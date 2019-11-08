
const fs = require('fs');

/**
 * Class to watch for change in certain file(s)
 */
class Watcher {
  constructor(paths) {
    if (Array.isArray(paths)) {
      this.paths = paths;
    } else {
      this.paths = [paths];
    }
    this.fsWait = false;
    this.watchers = {};
  }

  /**
   * This method initiate the watch for change in file(s)
   * @param {*} callback called when the file(s) change
   */
  watch(callback) {
    for (const index in this.paths) {
      const path = this.paths[index];
      const watcher = fs.watch(path, { recursive: true }, (eventType, filename) => {
        // Since multiple changes can occur, lets wait a bit before processing.
        if (this.fsWait) return;
        this.fsWait = setTimeout(() => {
          this.fsWait = false;
        }, 100);
        callback(eventType, path, filename);
        // Close the previous watcher to ensure no dublicate generations.
        this.closeWatcher(path);
        this.watch(callback);
      });
      this.watchers[path] = watcher;
    }
  }

  /**
   * Closes an active watcher down.
   */
  closeWatcher(path) {
    // Ensure if called before `watch` to do nothing
    if (path != null) {
      const watcher = this.watchers[path];
      if (watcher != null) {
        watcher.close();
        this.watchers[path] = null;
      } else {
        //Watcher not found for path
      }
    }
  }
}
module.exports = Watcher;
