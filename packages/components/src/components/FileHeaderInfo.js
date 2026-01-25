import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'typescript' | 'java' | 'csharp' | 'rust' | 'dart'} Language
 * Supported programming languages.
 */

/**
 * Mapping of supported programming languages to their respective comment syntax configurations.
 * @type {Record<Language, { commentChar: string, lineStyle: string }>}
 */
const commentConfig = {
  python: {  commentChar: '#', lineStyle: '#'.repeat(50) },
  javascript: { commentChar: '//', lineStyle: '//'.repeat(25) },
  typescript: { commentChar: '//', lineStyle: '//'.repeat(25) },
  java: { commentChar: '//', lineStyle: '//'.repeat(25) },
  csharp: { commentChar: '//', lineStyle: '//'.repeat(25) },
  rust: { commentChar: '//', lineStyle: '//'.repeat(25) },
  dart: { commentChar: '///', lineStyle: '///' }
};

/**
 * Renders a file header with metadata information such as title, version, protocol, host, and path.
 *
 * @param {Object} props - Component props.
 * @param {object} props.info - Info object from the AsyncAPI document.
 * @param {object} props.server - Server object from the AsyncAPI document.
 * @param {Language} props.language - Programming language used for comment formatting.
 * @returns {JSX.Element} A Text component that contains file header.
 * 
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { FileHeaderInfo } from "@asyncapi/generator-components";
 * 
 * async function renderFileHeader() {
 *   const parser = new Parser();
 *   const asyncapi_websocket_query = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
 *   const language = "javascript";
 *   
 *   // Parse the AsyncAPI document 
 *   const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
 *   const parsedAsyncAPIDocument = parseResult.document;
 *   
 *   return (
 *     <FileHeaderInfo 
 *       info={parsedAsyncAPIDocument.info()} 
 *       server={parsedAsyncAPIDocument.servers().get("withPathname")} 
 *       language={language} 
 *     />
 *   )
 * }
 * 
 * renderFileHeader().catch(console.error);
 */
export function FileHeaderInfo({ info, server, language }) {
  const { commentChar, lineStyle } = commentConfig[language] || { 
    commentChar: '//', 
    lineStyle: '//'.repeat(25) 
  };

  return (
    <Text>
      <Text>{lineStyle}</Text>

      <Text>{commentChar}</Text>

      <Text>
        {commentChar} {info.title()} - {info.version()}
      </Text>

      <Text>
        {commentChar} Protocol: {server.protocol()}
      </Text>

      <Text>
        {commentChar} Host: {server.host()}
      </Text>

      {server.hasPathname() && (
        <Text>
          {commentChar} Path: {server.pathname()}
        </Text>
      )}

      <Text>{commentChar}</Text>

      <Text>{lineStyle}</Text>
    </Text>
  );
}