Pod::Spec.new do |s|
  s.name           = 'ICloudBackup'
  s.version        = '1.0.0'
  s.summary        = 'Talino backups in the app’s iCloud container'
  s.description    = 'Copies backup files into the app’s own iCloud Documents container, lists them, and downloads one on a new phone.'
  s.license        = 'MIT'
  s.author         = 'Fordytech'
  s.homepage       = 'https://github.com/expo/expo'
  s.platforms      = {
    :ios => '16.4'
  }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,swift}"
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
