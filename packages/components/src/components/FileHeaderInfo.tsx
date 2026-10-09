import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, missingInfo, missingServer } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'typescript' | 'java' | 'csharp' | 'rust' | 'dart';

interface CommentStyle {
  commentChar: string;
  lineStyle: string;
}

/**
 * Mapping of supported programming languages to their respective comment syntax configurations.
 */
const commentConfig: Record<Language, CommentStyle> = {
  python: {  commentChar: '#', lineStyle: '#'.repeat(50) },
  javascript: { commentChar: '//', lineStyle: '//'.repeat(25) },
  typescript: { commentChar: '//', lineStyle: '//'.repeat(25) },
  java: { commentChar: '//', lineStyle: '//'.repeat(25) },
  csharp: { commentChar: '//', lineStyle: '//'.repeat(25) },
  rust: { commentChar: '//', lineStyle: '//'.repeat(25) },
  dart: { commentChar: '///', lineStyle: '///' }
};

interface FileHeaderInfoProps {
  info: unknown;
  server: unknown;
  language: string;
}
/**
 * Renders a file header with metadata information such as title, version, protocol, host, and path.
 *
 * @param props - Component props.
 * @returns A Text component that contains file header.
 * @throws When info is missing or invalid.
 * @throws When server is missing or invalid.
 * @throws When the specified language is not supported.
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
export function FileHeaderInfo({ info, server, language }: FileHeaderInfoProps): JSX.Element {
  if (!info) {
    throw missingInfo();
  }

  if (!server) {
    throw missingServer();
  }

  const supportedLanguages = Object.keys(commentConfig);
  
  if (!supportedLanguages.includes(language)) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  const { commentChar, lineStyle } = commentConfig[language];

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