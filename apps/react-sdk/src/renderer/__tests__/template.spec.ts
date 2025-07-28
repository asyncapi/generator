import path from "path";
import { renderTemplate } from "../template";
import { TemplateRenderResult } from "../../types";

describe('renderTemplate', () => {
  test('should render a single File template', async () => {
    const filePath = path.resolve(__dirname, './file-tests/single-template.js');
    const renderedContent = await renderTemplate(filePath, {} as any) as TemplateRenderResult;

    expect(typeof renderedContent).toEqual('object');
    expect(renderedContent.content).toEqual('Content');
    expect(renderedContent.metadata.fileName).toEqual('file.html');
  });

  test('should render an array of File templates', async () => {
    const filePath = path.resolve(__dirname, './file-tests/file-templates.js');
    const renderedContent = await renderTemplate(filePath, {} as any) as TemplateRenderResult[];

    expect(Array.isArray(renderedContent)).toEqual(true);
    expect(typeof renderedContent[0]).toEqual('object');
    expect(renderedContent[0].content).toEqual('Content1');
    expect(renderedContent[0].metadata.fileName).toEqual('file1.html');
    expect(typeof renderedContent[1]).toEqual('object');
    expect(renderedContent[1].content).toEqual('Content2');
    expect(renderedContent[1].metadata.fileName).toEqual('file2.html');
  });

  test('should render a single async File template', async () => {
    const filePath = path.resolve(__dirname, './file-tests/async-template.js');
    const renderedContent = await renderTemplate(filePath, {} as any) as TemplateRenderResult;

    expect(typeof renderedContent).toEqual('object');
    expect(renderedContent.content).toEqual('Content');
    expect(renderedContent.metadata.fileName).toEqual('file.html');
  });
});
