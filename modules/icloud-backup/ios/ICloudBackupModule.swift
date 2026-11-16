import ExpoModulesCore
import Foundation

/**
 * Talino's backups in the app's own iCloud container (iCloud.com.fordytechsolutions.talino,
 * entitlements from `ios.usesIcloudStorage`): files copied into its Documents/Backups folder are
 * uploaded by iCloud itself, and appear (at first as placeholders) on every phone signed in to the
 * same Apple Account. Nothing here talks to a server: iCloud Drive does the syncing.
 */
public class ICloudBackupModule: Module {
  /**
   * The module's own serial queue (2026-10-18). Expo runs every AsyncFunction without one on a
   * single shared serial queue, and these wait on iCloud (the first container lookup, a download
   * that polls until iCloud delivers the file, file coordination): a reinstall's background restore
   * held it for up to two minutes, and every other Expo call queued behind, so the notification
   * permission request never reached iOS and onboarding's Enable Notifications spun forever.
   */
  private static let queue = DispatchQueue(label: "com.fordytechsolutions.talino.icloud-backup", qos: .utility)

  public func definition() -> ModuleDefinition {
    Name("ICloudBackup")

    // "available": signed in with iCloud Drive on for this app; "signed_out": no account, or iCloud
    // Drive is off (for everything or for Talino); "unavailable": the container can't be opened
    // (the build has no iCloud entitlement, or the container isn't set up for this app).
    AsyncFunction("statusAsync") { () -> String in
      guard FileManager.default.ubiquityIdentityToken != nil else { return "signed_out" }
      return Self.backupsFolder() == nil ? "unavailable" : "available"
    }.runOnQueue(Self.queue)

    // Copies a finished backup file into iCloud under `name`, replacing one of the same name.
    AsyncFunction("uploadAsync") { (sourcePath: String, name: String) -> String in
      guard FileManager.default.ubiquityIdentityToken != nil else { throw CloudException("signed_out") }
      guard let folder = Self.backupsFolder() else { throw CloudException("unavailable") }
      let source = URL(fileURLWithPath: sourcePath)
      let target = folder.appendingPathComponent(name)
      var coordinationError: NSError?
      var writeError: Error?
      NSFileCoordinator().coordinate(writingItemAt: target, options: .forReplacing, error: &coordinationError) { url in
        do {
          if FileManager.default.fileExists(atPath: url.path) { try FileManager.default.removeItem(at: url) }
          try FileManager.default.copyItem(at: source, to: url)
        } catch {
          writeError = error
        }
      }
      if let failure = writeError ?? coordinationError {
        let code = (failure as NSError).code
        throw CloudException(code == NSFileWriteOutOfSpaceError ? "full" : "failed")
      }
      return target.lastPathComponent
    }.runOnQueue(Self.queue)

    // Whether iCloud has really uploaded a backup copied into the container: copying only queues
    // it, and with the owner's iCloud storage full it never goes up (nothing fails at copy time).
    // "uploaded", "uploading", "full", "error", "none" (no such file) or "unavailable".
    AsyncFunction("uploadStatusAsync") { (name: String) -> String in
      guard FileManager.default.ubiquityIdentityToken != nil else { return "unavailable" }
      guard let folder = Self.backupsFolder() else { return "unavailable" }
      var file = folder.appendingPathComponent(name)
      guard FileManager.default.fileExists(atPath: file.path) else { return "none" }
      file.removeAllCachedResourceValues()
      let values = try? file.resourceValues(forKeys: [.ubiquitousItemIsUploadedKey, .ubiquitousItemUploadingErrorKey])
      if let error = values?.ubiquitousItemUploadingError {
        return error.code == CocoaError.ubiquitousFileNotUploadedDueToQuota.rawValue ? "full" : "error"
      }
      return values?.ubiquitousItemIsUploaded == true ? "uploaded" : "uploading"
    }.runOnQueue(Self.queue)

    // The backups in iCloud, newest first, whether or not they're on this phone yet. Found with a
    // metadata query, which asks iCloud itself: a reinstalled app's folder starts empty, and the
    // folder's own listing (also read, for files only here) shows iCloud's files only once iCloud
    // Drive has synced them down, which took minutes (2026-10-18: a restore then only happened
    // at the next launch).
    AsyncFunction("listAsync") { (promise: Promise) in
      guard FileManager.default.ubiquityIdentityToken != nil else { return promise.reject(CloudException("signed_out")) }
      guard let folder = Self.backupsFolder() else { return promise.reject(CloudException("unavailable")) }
      // Asks iCloud to bring the folder's listing (and its files) down now, rather than whenever it
      // would on its own: a reinstalled app's container starts empty, and its placeholders (which
      // localEntries reads) appear only as iCloud syncs.
      try? FileManager.default.startDownloadingUbiquitousItem(at: folder)
      BackupQuery.gather(timeout: Self.listTimeout) { fromICloud in
        Self.queue.async {
          var byName: [String: [String: Any]] = [:]
          for entry in fromICloud + Self.localEntries(in: folder) {
            guard let name = entry["name"] as? String else { continue }
            if byName[name] == nil { byName[name] = entry }
          }
          promise.resolve(byName.values.sorted { ($0["modified"] as? Double ?? 0) > ($1["modified"] as? Double ?? 0) })
        }
      }
    }.runOnQueue(Self.queue)

    // While a fresh install is still looking for its backup: a live metadata query that says when
    // a Talino backup appears in iCloud (or changes), so the restore starts right then.
    Events("onBackupsChanged")
    Function("startWatching") {
      DispatchQueue.main.async { self.startWatcher() }
    }
    Function("stopWatching") {
      DispatchQueue.main.async { self.stopWatcher() }
    }

    // Makes sure a backup is on this phone (iCloud downloads it if it's only a placeholder) and
    // copies it to `destinationPath`. Gives up after `timeoutSeconds`.
    AsyncFunction("downloadAsync") { (name: String, destinationPath: String, timeoutSeconds: Double) -> String in
      guard FileManager.default.ubiquityIdentityToken != nil else { throw CloudException("signed_out") }
      guard let folder = Self.backupsFolder() else { throw CloudException("unavailable") }
      var file = folder.appendingPathComponent(name)
      try? FileManager.default.startDownloadingUbiquitousItem(at: file)
      let deadline = Date().addingTimeInterval(timeoutSeconds)
      while true {
        // A URL keeps the resource values it has read, and this queue has no run loop to clear
        // them (2026-10-18): without this every check saw the first answer, "not downloaded",
        // until the timeout, though iCloud had downloaded the file meanwhile, so a reinstall's
        // restore failed in its own session and worked only after the app was reopened.
        file.removeAllCachedResourceValues()
        let status = (try? file.resourceValues(forKeys: [.ubiquitousItemDownloadingStatusKey]))?.ubiquitousItemDownloadingStatus
        // .downloaded is a full local copy too (iCloud may hold a newer one): good enough to restore from.
        if status == .current || status == .downloaded || (status == nil && FileManager.default.fileExists(atPath: file.path)) { break }
        if Date() > deadline { throw CloudException("timeout") }
        Thread.sleep(forTimeInterval: 0.5)
      }
      let destination = URL(fileURLWithPath: destinationPath)
      var coordinationError: NSError?
      var readError: Error?
      NSFileCoordinator().coordinate(readingItemAt: file, options: [], error: &coordinationError) { url in
        do {
          if FileManager.default.fileExists(atPath: destination.path) { try FileManager.default.removeItem(at: destination) }
          try FileManager.default.copyItem(at: url, to: destination)
        } catch {
          readError = error
        }
      }
      if readError != nil || coordinationError != nil { throw CloudException("failed") }
      return destination.path
    }.runOnQueue(Self.queue)

    // Removes a backup from iCloud (older ones beyond the few kept).
    AsyncFunction("deleteAsync") { (name: String) in
      guard let folder = Self.backupsFolder() else { return }
      let file = folder.appendingPathComponent(name)
      var coordinationError: NSError?
      NSFileCoordinator().coordinate(writingItemAt: file, options: .forDeleting, error: &coordinationError) { url in
        try? FileManager.default.removeItem(at: url)
      }
    }.runOnQueue(Self.queue)
  }

  /** How long a list waits for iCloud's answer before going with what's on the phone. */
  private static let listTimeout: TimeInterval = 15

  private var watcher: NSMetadataQuery?
  private var watcherTokens: [NSObjectProtocol] = []

  private func startWatcher() {
    guard watcher == nil else { return }
    let query = BackupQuery.makeQuery()
    let report: (Notification) -> Void = { [weak self, weak query] _ in
      guard let self, let query else { return }
      query.disableUpdates()
      let found = query.resultCount > 0
      query.enableUpdates()
      if found { self.sendEvent("onBackupsChanged", [:]) }
    }
    watcherTokens = [
      NotificationCenter.default.addObserver(forName: .NSMetadataQueryDidFinishGathering, object: query, queue: .main, using: report),
      NotificationCenter.default.addObserver(forName: .NSMetadataQueryDidUpdate, object: query, queue: .main, using: report),
    ]
    query.start()
    watcher = query
  }

  private func stopWatcher() {
    watcher?.stop()
    watcher = nil
    watcherTokens.forEach(NotificationCenter.default.removeObserver)
    watcherTokens = []
  }

  /** Backups in the folder on this phone (downloaded files and ".name.icloud" placeholders). */
  private static func localEntries(in folder: URL) -> [[String: Any]] {
    let keys: [URLResourceKey] = [.contentModificationDateKey, .fileSizeKey]
    let items = (try? FileManager.default.contentsOfDirectory(at: folder, includingPropertiesForKeys: keys, options: [])) ?? []
    return items.compactMap { url -> [String: Any]? in
      var name = url.lastPathComponent
      if name.hasPrefix(".") && name.hasSuffix(".icloud") {
        name = String(name.dropFirst().dropLast(".icloud".count))
      }
      guard name.hasSuffix(".talino-backup") else { return nil }
      let values = try? url.resourceValues(forKeys: Set(keys))
      let modified = values?.contentModificationDate ?? Date.distantPast
      return ["name": name, "modified": modified.timeIntervalSince1970 * 1000, "size": values?.fileSize ?? 0]
    }
  }

  /// The container's Documents/Backups folder, created when missing; nil when there's no container.
  /// (Never called on the main thread: the first call can take a while.)
  private static func backupsFolder() -> URL? {
    guard let container = FileManager.default.url(forUbiquityContainerIdentifier: nil) else { return nil }
    let folder = container.appendingPathComponent("Documents/Backups", isDirectory: true)
    try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
    return folder
  }
}

/// A failure the app shows as a reason: signed_out, unavailable, full, timeout or failed.
internal final class CloudException: GenericException<String> {
  override var code: String { param }
  override var reason: String { "iCloud backup: \(param)" }
}

/**
 * Talino's backups as iCloud knows them (the .talino-backup files in Documents/Backups), including files not yet
 * downloaded to this phone. One-off gathers run on the main thread, as NSMetadataQuery needs a run
 * loop; the caller hears back once, with what was found, or nothing if the deadline passed.
 */
private final class BackupQuery: NSObject {
  private static var running = Set<BackupQuery>()
  private let query = BackupQuery.makeQuery()
  private let completion: ([[String: Any]]) -> Void
  private var finished = false

  private init(completion: @escaping ([[String: Any]]) -> Void) {
    self.completion = completion
  }

  static func makeQuery() -> NSMetadataQuery {
    let query = NSMetadataQuery()
    query.searchScopes = [NSMetadataQueryUbiquitousDocumentsScope]
    query.predicate = NSPredicate(format: "%K LIKE '*.talino-backup'", NSMetadataItemFSNameKey)
    return query
  }

  static func gather(timeout: TimeInterval, completion: @escaping ([[String: Any]]) -> Void) {
    DispatchQueue.main.async {
      let finder = BackupQuery(completion: completion)
      running.insert(finder)
      // A reinstalled app's first gather can finish empty before iCloud has synced its index; the
      // query then keeps going and reports the backups as they arrive (DidUpdate), until the deadline.
      NotificationCenter.default.addObserver(finder, selector: #selector(gathered), name: .NSMetadataQueryDidFinishGathering, object: finder.query)
      NotificationCenter.default.addObserver(finder, selector: #selector(gathered), name: .NSMetadataQueryDidUpdate, object: finder.query)
      finder.query.start()
      DispatchQueue.main.asyncAfter(deadline: .now() + timeout) { [weak finder] in
        guard let finder else { return }
        finder.query.disableUpdates()
        finder.finish(with: finder.entries())
      }
    }
  }

  @objc private func gathered() {
    query.disableUpdates()
    let found = entries()
    if found.isEmpty {
      query.enableUpdates()
      return
    }
    finish(with: found)
  }

  private func entries() -> [[String: Any]] {
    return query.results.compactMap { result in
      guard let item = result as? NSMetadataItem,
        let name = item.value(forAttribute: NSMetadataItemFSNameKey) as? String,
        name.hasSuffix(".talino-backup"),
        let url = item.value(forAttribute: NSMetadataItemURLKey) as? URL,
        url.deletingLastPathComponent().lastPathComponent == "Backups"
      else { return nil }
      let modified = item.value(forAttribute: NSMetadataItemFSContentChangeDateKey) as? Date ?? Date.distantPast
      let size = (item.value(forAttribute: NSMetadataItemFSSizeKey) as? NSNumber)?.intValue ?? 0
      return ["name": name, "modified": modified.timeIntervalSince1970 * 1000, "size": size]
    }
  }

  private func finish(with entries: [[String: Any]]) {
    guard !finished else { return }
    finished = true
    query.stop()
    NotificationCenter.default.removeObserver(self)
    BackupQuery.running.remove(self)
    completion(entries)
  }
}
