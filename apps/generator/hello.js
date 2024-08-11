const path = require("path");
const Generator = require("./lib/generator");
const { promises: fsPromise } = require("fs");
const reactTemplate = 'test/test-templates/react-template';

// const reactTemplate = path.resolve(__dirname, "./test/test-templates/react-template");
// console.log("reactTemplate", reactTemplate);
const dummySpecPath = path.resolve(__dirname, './test/docs/dummy.yml');

async function main() {
  const outputDir = path.resolve(__dirname, "test/hello");
  console.log("outputDir", outputDir);
  // await fsPromise.mkdir(outputDir, { recursive: true });

  // Create temp.md.js file dynamically
  const tempJsContent = `
  import { File, Text } from '@asyncapi/generator-react-sdk';

  export default function() {
    return (
      <File name="temp.md">
        <Text>Test</Text>
      </File>
    );
}
`;
// const reactTemplate = path.resolve(__dirname, "./test/test-templates/react-template");
console.log("reactTemplate", reactTemplate);
  const transpiledPath = path.join(reactTemplate, '__transpiled');
  
  // await fsPromise.unlink(path.join(transpiledPath, 'temp.md.js'))
  // await fsPromise.unlink(path.join(transpiledPath, 'temp.md.js.map'))

  const tempJsPath = path.join(reactTemplate, "template","temp.md.js");
  await fsPromise.writeFile(tempJsPath, tempJsContent);
  console.log("tempJsPath", tempJsPath);

  const generator = new Generator(reactTemplate, outputDir, {
    forceWrite: true,
    debug: true,
    compile: false,
  });
  await generator.generateFromFile(dummySpecPath);

  // Check if temp.md is created in the output directory
  const tempMdPath = path.join(outputDir, "temp.md");
  console.log("tempMdPath", tempMdPath);
}

main()