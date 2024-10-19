/* eslint-disable sonarjs/no-duplicate-string */
const { 
  configureReact,
  renderReact,
  saveRenderedReactContent,
} = require('../lib/renderer/react');

jest.mock('../lib/utils');
jest.mock('@asyncapi/generator-react-sdk');

describe('React renderer', () => {
  describe('saveRenderedReactContent', () => {
    let util;
    let AsyncReactSDK;
    beforeAll(() => {
      util = require('../lib/utils');
      AsyncReactSDK = require('@asyncapi/generator-react-sdk');
    });

    it('works transpilation', async () => {
      await configureReact('../file', '../dir', '../file');
      expect(AsyncReactSDK.transpileFiles).toHaveBeenCalledTimes(1);
    });

    it('works rendering', async () => {
      await renderReact({}, '../file', {}, '../file', '../dir', '../location', {}, false, '');
      expect(AsyncReactSDK.renderTemplate).toHaveBeenCalledTimes(1);
    });
    
    it('works saving single rendered content', async () => {
      const content = {
        content: 'Content',
        metadata: {
          fileName: 'file.html',
        }
      };

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
