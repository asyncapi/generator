/* eslint-disable sonarjs/no-duplicate-string */

jest.mock('../lib/utils');
jest.mock('@asyncapi/generator-react-sdk');

const {
  configureReact,
  renderReact,
  saveRenderedReactContent,
} = require('../lib/renderer/react');

describe('React renderer', () => {
  let util;
  let AsyncReactSDK;

  beforeEach(() => {
    jest.clearAllMocks();
    util = require('../lib/utils');
    AsyncReactSDK = require('@asyncapi/generator-react-sdk');
  });

  /* ------------------------------------------------------------------ */
  /* configureReact                                                     */
  /* ------------------------------------------------------------------ */

  describe('configureReact', () => {
    it('should transpile React template files', async () => {
      await configureReact('../file', '../dir', '../file');

      expect(AsyncReactSDK.transpileFiles).toHaveBeenCalledTimes(1);
      expect(AsyncReactSDK.transpileFiles).toHaveBeenCalledWith(
        '../file',
        '../dir',
        '../file'
      );
    });
  });

  /* ------------------------------------------------------------------ */
  /* renderReact                                                        */
  /* ------------------------------------------------------------------ */

  describe('renderReact', () => {
    it('should render template using React SDK', async () => {
      await renderReact(
        {}, 
        '../file', 
        {}, 
        '../file', 
        '../dir', 
        '../location', 
        {}, 
        false, 
        ''
      );

      expect(AsyncReactSDK.renderTemplate).toHaveBeenCalledTimes(1);
    });
  });

  /* ------------------------------------------------------------------ */
  /* saveRenderedReactContent                                           */
  /* ------------------------------------------------------------------ */

  describe('saveRenderedReactContent', () => {
    it('should save single rendered file', async () => {
      const content = {
        content: 'Content',
        metadata: {
          fileName: 'file.html',
        },
      };

      await saveRenderedReactContent(content, '../some/path');

      expect(util.writeFile).toHaveBeenCalledTimes(1);
      expect(util.writeFile).toHaveBeenCalledWith(
        '../some/path/file.html',
        'Content'
      );
    });

    it('should save multiple rendered files', async () => {
      const content = [
        {
          content: 'Content1',
          metadata: { fileName: 'file1.html' },
        },
        {
          content: 'Content2',
          metadata: { fileName: 'file2.html' },
        },
      ];

      await saveRenderedReactContent(content, '../some/path');

      expect(util.writeFile).toHaveBeenCalledTimes(2);
      expect(util.writeFile).toHaveBeenNthCalledWith(
        1,
        '../some/path/file1.html',
        'Content1'
      );
      expect(util.writeFile).toHaveBeenNthCalledWith(
        2,
        '../some/path/file2.html',
        'Content2'
      );
    });

    it('should not fail when empty array is provided', async () => {
      await saveRenderedReactContent([], '../some/path');

      expect(util.writeFile).not.toHaveBeenCalled();
    });
  });
});
      await saveRenderedReactContent(content, '../some/path');
      expect(util.writeFile).toHaveBeenCalledTimes(1);
    });

    it('works saving multiple rendered contents', async () => {
      const content = [
        {
          content: 'Content1',
          metadata: {
            fileName: 'file1.html',
          }
        },
        {
          content: 'Content2',
          metadata: {
            fileName: 'file2.html',
          }
        },
      ];

      await saveRenderedReactContent(content, '../some/path');
      expect(util.writeFile).toHaveBeenCalledTimes(2);
    });
  });
});
