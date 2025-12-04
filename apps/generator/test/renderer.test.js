/* eslint-disable sonarjs/no-duplicate-string */

jest.mock('../lib/utils', () => ({
  writeFileWithFiltering: jest.fn().mockResolvedValue(true),
}));
jest.mock('@asyncapi/generator-react-sdk');

const {
  configureReact,
  renderReact,
  saveRenderedReactContent,
} = require('../lib/renderer/react');

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

      const written = await saveRenderedReactContent(content, '../some/path');
      expect(util.writeFileWithFiltering).toHaveBeenCalledTimes(1);
      expect(written).toBe(1);
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

      const written = await saveRenderedReactContent(content, '../some/path');
      expect(util.writeFileWithFiltering).toHaveBeenCalledTimes(2);
      expect(written).toBe(2);
    });
  });
});
