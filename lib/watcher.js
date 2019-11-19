const fs = require('fs');
const chokidar = require('chokidar');

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
    //Ensure all backwards slashes are replaced with forward slash based on the requirement from chokidar
    for (const pathIndex in this.paths) {
      const path = this.paths[pathIndex];
      this.paths[pathIndex] = path.replace(/[\\]/g, '/');
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
      const watcher = chokidar.watch(path, {ignoreInitial: true});
      watcher.on('all', (eventType, changedPath) => this.fileChanged(path, changedPath, eventType, changeCallback, errorCallback));
      this.watchers[path] = watcher;
    }
  }

  /**
   * Should be called when a file has changed one way or another.
   * @param {*} listenerPath The path the watcher is listening on.
   * @param {*} changedPath The file/dir that was changed
   * @param {*} eventType What kind of change
   * @param {*} changeCallback Callback to call when changed occur.
   * @param {*} errorCallback Calback to call when it is no longer possible to watch a file.
   */
  fileChanged(listenerPath, changedPath, eventType, changeCallback, errorCallback) {
    try {
      if (fs.existsSync(listenerPath)) {
        const newEventType = this.convertEventType(eventType);
        this.filesChanged[changedPath] = { eventType: newEventType, path: changedPath};
        // Since multiple changes can occur at the same time, lets wait a bit before processing.
        if (this.fsWait) return;
        this.fsWait = setTimeout(async () => {
          await changeCallback(this.filesChanged);
          this.filesChanged = {};
          this.fsWait = false;
        }, 500);
      }
    } catch (e) {
      // File was not, find all files that are missing..
      const unknownPaths = this.getAllNonExistingPaths();
      this.closeWatchers();
      errorCallback(unknownPaths);
    }
  }

  /**
   * Convert the event type to a more usefull one.
   * @param {*} currentEventType The current event type (from chokidar)
   */
  convertEventType(currentEventType) {
    let newEventType = currentEventType;
    //Change the naming of the event type
    switch (newEventType) {
    case 'unlink':
    case 'unlinkDir':
      newEventType = 'removed';
      break;
    case 'addDir':
    case 'add':
      newEventType = 'added';
      break;
    case 'change':
      newEventType = 'changed';
      break;
    case 'rename':
      newEventType = 'renamed';
      break;
    default:
      newEventType = `unknown (${currentEventType})`;
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
