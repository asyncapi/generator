const path = require('path');

const SNAPSHOTS_DIR = '__snapshots__';
const TEST_FILE = 'integration.test.js';

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const client = process.env.TEST_CLIENT;
    const snapshotDir = path.join(path.dirname(testPath), SNAPSHOTS_DIR);

    const baseName = path.basename(testPath);

    const snapshotFileName = client
      ? `${baseName}.${client}${snapshotExtension}`   
      : `${baseName}${snapshotExtension}`;          

    return path.join(snapshotDir, snapshotFileName);
  },

  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const snapshotDir = path.dirname(snapshotFilePath);
    const testDir = path.resolve(snapshotDir, '..');

    return path.join(testDir, TEST_FILE); 
  },

  testPathForConsistencyCheck: path.resolve(__dirname, TEST_FILE),
};