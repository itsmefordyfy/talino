const { BACKUP_RULES, DATA_EXTRACTION_RULES } = require('./with-android-backup');

describe('Android backup rules', () => {
  test('back up only the snapshot folder, for both mechanisms', () => {
    for (const rules of [BACKUP_RULES, DATA_EXTRACTION_RULES]) {
      const includes = [...rules.matchAll(/<include domain="(\w+)" path="([^"]+)"/g)].map((match) => `${match[1]}:${match[2]}`);
      expect(includes.length).toBeGreaterThan(0);
      expect(new Set(includes)).toEqual(new Set(['file:backups/']));
    }
    expect(DATA_EXTRACTION_RULES).toContain('<cloud-backup>');
    expect(DATA_EXTRACTION_RULES).toContain('<device-transfer>');
  });

  test('never includes the database, shared preferences or the whole app', () => {
    for (const rules of [BACKUP_RULES, DATA_EXTRACTION_RULES]) {
      expect(rules).not.toMatch(/domain="(database|sharedpref|root|external)"/);
      expect(rules).not.toMatch(/path="(\.|\/|SQLite)/);
    }
  });
});
