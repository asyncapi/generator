
const fs = require('fs');

/**
 * Class to watch for change in certain file(s)
 */
class Watcher {
  constructor(path) {
    this.path = path;
    this.fsWait = false;
  }

  /**
   * This method initiate the watch for change in file(s)
   * @param {*} callback called when the file(s) change
   */
  watch(callback) {
    this.watcher = fs.watch(this.path, { recursive: true }, (eventType, filename) => {
      // Since multiple changes can occur, lets wait a bit before processing.
      if (this.fsWait) return;
      this.fsWait = setTimeout(() => {
        this.fsWait = false;
      }, 100);
      callback();
      // Close the previous watcher to ensure no dublicate generations.
      this.closeWatcher();
      this.watch(callback);
    });
  }

  /**
   * Closes the active watcher down.
   */
  closeWatcher() {
    // Ensure if called before `watch` to do nothing
    if (this.watcher != null) {
      this.watcher.close();
    }
  }
}
module.exports = Watcher;
