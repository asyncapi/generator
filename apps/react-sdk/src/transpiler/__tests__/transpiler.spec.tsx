import { transpileFiles } from "../";
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { renderTemplate } from "../../renderer/index";
import { AsyncAPIDocument } from "@asyncapi/parser";
const readFile = promisify(fs.readFile);


describe('Transpiler', () => {
  const testFiles = path.resolve(__dirname, './testfiles');
  const outputFiles = path.resolve(__dirname, './__transpiled_testfiles');
  beforeAll(async (done) => {
    try {
      await transpileFiles(testFiles, outputFiles, {
        recursive: true
      });
      done();
    } catch (e) {
      console.log(e);
      done(e);
    }
  });
  describe('should transpile CommonJS files', () => {
    describe('with a simple setup', () => {
      const commonjs_testFile = path.resolve(outputFiles, './CommonJS/simple.js');
      const commonjs_testFileMap = path.resolve(outputFiles, './CommonJS/simple.js.map');
      test('and import correctly', async () => {
        const content = await readFile(commonjs_testFile, 'utf8');
        expect(switchToUnixLinebreaks(content)).toMatchSnapshot();
        const mapContent = await readFile(commonjs_testFileMap, 'utf8');
        expect(switchToUnixLinebreaks(mapContent)).toMatchSnapshot();
        expect(await import(commonjs_testFile)).toBeDefined();
      });
      test('and render correctly', async () => {
        const content = await renderTemplate(commonjs_testFile, { asyncapi: {} as AsyncAPIDocument, originalAsyncAPI: "", params: {} });
        expect(content?.content).toBe("hello Test"); 
      });
    });
  });
  describe('should transpile ES5 files', () => {
    describe('with a simple setup', () => {
      const es5_testFile = path.resolve(outputFiles, './ES5/simple.js');
      const es5_testFileMap = path.resolve(outputFiles, './ES5/simple.js.map');
      test('and import correctly', async () => {
        const content = await readFile(es5_testFile, 'utf8')
        expect(switchToUnixLinebreaks(content)).toMatchSnapshot();
        const mapContent = await readFile(es5_testFileMap, 'utf8');
        expect(switchToUnixLinebreaks(mapContent)).toMatchSnapshot();
        expect(await import(es5_testFile)).toBeDefined();
      });
      test('and render correctly', async () => {
        const content = await renderTemplate(es5_testFile, { asyncapi: {} as AsyncAPIDocument, originalAsyncAPI: "", params: {} });
        expect(content?.content).toBe("hello Test"); 
      });
    });
  });
  describe('should transpile ES6 files', () => {
    describe('with a simple setup', () => {
      const es6_testFile = path.resolve(outputFiles, './ES6/simple.js');
      const es6_testFileMap = path.resolve(outputFiles, './ES6/simple.js.map');
      test('and import correctly', async () => {
        const content = await readFile(es6_testFile, 'utf8')
        expect(switchToUnixLinebreaks(content)).toMatchSnapshot();
        const mapContent = await readFile(es6_testFileMap, 'utf8');
        expect(switchToUnixLinebreaks(mapContent)).toMatchSnapshot();
        expect(await import(es6_testFile)).toBeDefined();
      });
      test('and render correctly', async () => {
        const content = await renderTemplate(es6_testFile, { asyncapi: {} as AsyncAPIDocument, originalAsyncAPI: "", params: {} });
        expect(content?.content).toBe("hello Test"); 
      });
    });
  });
});

/*
  It is a helper required for snapshot testing on windows. It can't be solved by editor configuration and the end line setting because snapshots are generated not created in the editor.
  We need to remove `\r` from files transpiled on windows before we can match them with the snapshot generated on unix
*/
function switchToUnixLinebreaks(str: String) {
  return str.replace(/\\r/g, "")
}