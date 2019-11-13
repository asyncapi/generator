
const fs = require('fs');
const Path = require('path');

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
    this.filesChanged = {};
  }

  /**
   * This method initiate the watch for change in all files
   * @param {*} callback called when the file(s) change
   */
  async watch(changeCallback, errorCallback) {
    for (const index in this.paths) {
      const path = this.paths[index];
      const watcher = fs.watch(path, { recursive: true }, (eventType, fileName) => {
        try {
          const stat = fs.statSync(path);
          //Convert the event type to a more usefull one.
          eventType = this.convertEventType(eventType, path, fileName);
          if (eventType === null) return;
          if (stat.isDirectory()) {
            const filePath = Path.resolve(path, `./${fileName}`);
            this.filesChanged[filePath] = { eventType, path, fileName };
          } else if (stat.isFile()) {
            this.filesChanged[path] = { eventType, path };
          }
          // Since multiple changes can occur at the same time, lets wait a bit before processing.
          if (this.fsWait) return;
          this.fsWait = setTimeout(async () => {
            await changeCallback(this.filesChanged);
            this.filesChanged = {};
            this.fsWait = false;
            this.watch(changeCallback, errorCallback);
          }, 500);
        } catch (e) {
          // File was not found find all that are missing..
          const unknownPaths = this.getAllNonExistingPaths();
          if (unknownPaths.length > 0) {
            this.closeWatchers();
            errorCallback(unknownPaths);
          }
        }
      });
      this.watchers[path] = watcher;
    }
  }

  /**
   * Convert the event type to a more usefull one.
   * @param {*} currentEventType
   * @param {*} path
   * @param {*} fileName
   */
  convertEventType(currentEventType, path, fileName) {
    let newEventType = currentEventType;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      const filePath = Path.resolve(path, `./${fileName}`);
      if (!fs.existsSync(filePath)) {
        newEventType = 'removed';
      } else if (currentEventType === 'change') {
        const filePathStat = fs.statSync(filePath);
        //Not all unix have access to birthtime
        if (filePathStat.isFile() && filePathStat.birthtimeMs) {
          const milliseconds = (new Date().getTime() - filePathStat.birthtimeMs);
          if (milliseconds < 500) {
            newEventType = 'added';
          }
        } else {
          return null;
        }
      } else if (currentEventType === 'rename') {
        newEventType = 'added';
      }
    }
    //Change the naming of the event type
    switch (newEventType) {
    case 'change':
      newEventType = 'changed';
      break;
    case 'rename':
      newEventType = 'renamed';
      break;
    }
    return newEventType;
  }

  /**
   * Get all paths which no longer exists
   */
  getAllNonExistingPaths() {
    const unknownPaths = [];
    for (const index in this.paths) {
      const path = this.paths[index];
      if (!fs.existsSync(path)) {
        unknownPaths.push(path);
      }
    }
    return unknownPaths;
  }

  /**
   * Closes all active watchers down.
   */
  closeWatchers() {
    this.filesChanged = {};
    for (const index in this.paths) {
      const path = this.paths[index];
      this.closeWatcher(path);
    }
  }

  /**
   * Closes an active watcher down.
   * @param {*} path The path to close the watcher for.
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
