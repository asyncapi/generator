
const { describe, before, it } = require('mocha');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);
const expect = chai.expect;
const Watcher = require('../../../../lib/watcher');
const fs = require('fs');
describe('Watcher class', () => {
  before(() => {
  });

  it('should not be able to create empty path watcher', () => {
  });
  it('should be create watcher if path and not array are supplied', () => {
  });

  describe('fileChanged function', () => {

  });
  describe('getAllNonExistingPaths function', () => {

  });
  describe('closeWatcher function', () => {

  });
  describe('closeWatchers function', () => {

  });
  describe('convertEventType function', () => {

  });
  describe('isWatching function', () => {

  });
  describe('watch function', () => {
    it('should not keep notifying when no data was change in the file.', () => {
    });
    it('should handle the deletion of a watched file path correctly, when more paths can be watched', () => {
    });
    it('should handle the deletion of a watched file path correctly, when there are no more paths to watch', () => {
    });
    it('should handle the deletion of a watched directory path correctly, when there are no more paths to be watched', () => {
    });
    it('should handle the deletion of a watched directory path correctly, when more paths can be watched', () => {
    });
    describe('should be able to watch a single file path', () => {
      it('and give correct notice when the watched file are changed', () => {
      });
      it('and give correct notice when the watched file are renamed', () => {
      });
    });
    describe('should be able to watch multiple file paths', () => {
      it('and give correct notice when 1 watched file are changed', () => {
      });
      it('and give correct notice when multiple watched files are changed', () => {
      });
      it('and give correct notice when 1 watched file are renamed', () => {
      });
      it('and give correct notice when multiple watched files are renamed', () => {
      });
    });
    describe('should be able to watch both file paths and directory paths', () => {
      it('and give correct notice when 1 file are changed', () => {
      });
      it('and give correct notice when multiple watched files are changed', () => {
      });
      it('and give correct notice when 1 watched file are renamed', () => {
      });
      it('and give correct notice when multiple watched files are renamed', () => {
      });

      it('and give correct notice when 1 file are changed in 1 watched directory', () => {
      });
      it('and give correct notice when multiple files are changed in 1 watched directory', () => {
      });
      it('and give correct notice when 1 file are created in 1 watched directory', () => {
      });
      it('and give correct notice when multiple files are created in 1 watched directory', () => {
      });
      it('and give correct notice when 1 file are deleted from 1 watched directory', () => {
      });
      it('and give correct notice when multiple files are deleted from 1 watched directory', () => {
      });
      it('and give correct notice when 1 directory are deleted from 1 watched directory', () => {
      });
      it('and give correct notice when multiple directories are deleted from 1 watched directory', () => {
      });

      it('and give correct notice when 1 file are changed in each watched directory', () => {
      });
      it('and give correct notice when multiple files are changed in each watched directory', () => {
      });
      it('and give correct notice when 1 file are created in each watched directory', () => {
      });
      it('and give correct notice when multiple files are created in each watched directory', () => {
      });
      it('and give correct notice when 1 file are deleted from each watched directory', () => {
      });
      it('and give correct notice when multiple files are deleted from each watched directory', () => {
      });
      it('and give correct notice when 1 directory are deleted from each watched directory', () => {
      });
      it('and give correct notice when multiple directories are deleted from each watched directory', () => {
      });
    });
    describe('should be able to watch directory path', () => {
      it('and give correct notice when 1 file are changed in the watched directory', () => {
      });
      it('and give correct notice when multiple files are changed in the watched directory', () => {
      });
      it('and give correct notice when 1 file are created in the watched directory', () => {
      });
      it('and give correct notice when multiple files are created in the watched directory', () => {
      });
      it('and give correct notice when 1 file are deleted from the watched directory', () => {
      });
      it('and give correct notice when multiple files are deleted from the watched directory', () => {
      });
      it('and give correct notice when 1 directory are deleted from the watched directory', () => {
      });
      it('and give correct notice when multiple directories are deleted from the watched directory', () => {
      });
    });
    describe('should be able to watch multiple directory paths', () => {
      it('and give correct notice when 1 file are changed in 1 watched directory', () => {
      });
      it('and give correct notice when multiple files are changed in 1 watched directory', () => {
      });
      it('and give correct notice when 1 file are created in 1 watched directory', () => {
      });
      it('and give correct notice when multiple files are created in 1 watched directory', () => {
      });
      it('and give correct notice when 1 file are deleted from 1 watched directory', () => {
      });
      it('and give correct notice when multiple files are deleted from 1 watched directory', () => {
      });
      it('and give correct notice when 1 directory are deleted from 1 watched directory', () => {
      });
      it('and give correct notice when multiple directories are deleted from 1 watched directory', () => {
      });

      it('and give correct notice when 1 file are changed in each watched directory', () => {
      });
      it('and give correct notice when multiple files are changed in each watched directory', () => {
      });
      it('and give correct notice when 1 file are created in each watched directory', () => {
      });
      it('and give correct notice when multiple files are created in each watched directory', () => {
      });
      it('and give correct notice when 1 file are deleted from each watched directory', () => {
      });
      it('and give correct notice when multiple files are deleted from each watched directory', () => {
      });
      it('and give correct notice when 1 directory are deleted from each watched directory', () => {
      });
      it('and give correct notice when multiple directories are deleted from each watched directory', () => {
      });
    });
  });
});
