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
        const content = await readFile(commonjs_testFile);
        expect(content.toString()).toMatchSnapshot();
        const mapContent = await readFile(commonjs_testFileMap);
        expect(mapContent.toString()).toMatchSnapshot();
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
        const content = await readFile(es5_testFile)
        expect(content.toString()).toMatchSnapshot();
        const mapContent = await readFile(es5_testFileMap);
        expect(mapContent.toString()).toMatchSnapshot();
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
        const content = await readFile(es6_testFile)
        expect(content.toString()).toMatchSnapshot();
        const mapContent = await readFile(es6_testFileMap);
        expect(mapContent.toString()).toMatchSnapshot();
        expect(await import(es6_testFile)).toBeDefined();
      });
      test('and render correctly', async () => {
        const content = await renderTemplate(es6_testFile, { asyncapi: {} as AsyncAPIDocument, originalAsyncAPI: "", params: {} });
        expect(content?.content).toBe("hello Test"); 
      });
    });
  });
});
