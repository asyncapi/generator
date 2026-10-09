import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedFramework, unsupportedLanguage } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'java';

interface OnOpenResult {
  onOpenMethod: string;
  indent?: number;
  newLines?: number;
}

type OnOpenGenerator = (title: string) => OnOpenResult;

/**
 * Mapping of supported programming languages to their WebSocket onOpen event handler implementations.
 */
const websocketOnOpenMethod: Record<string, OnOpenGenerator | Record<string, OnOpenGenerator>> = {
  javascript: (title: string): OnOpenResult => {
    return {
      onOpenMethod: `// On successful connection
      this.websocket.onopen = () => {
      console.log('Connected to ${title} server');
      resolve();
    };`
    };
  },
  python: (title: string): OnOpenResult => {
    return {
      onOpenMethod: `def on_open(self, ws):
  print("Connected to ${title} server")`
    };
  },
  java: {
    quarkus: (title: string): OnOpenResult => {
      const onOpenMethod = `@OnOpen
public void onOpen() {
    String broadcastMessage = "Echo called from ${title} server";
    LOG.info("Connected to ${title} server");
    LOG.info(broadcastMessage);
}`;
      return { onOpenMethod, indent: 2, newLines: 2 };
    }
  }
};

/**
 * Resolves the appropriate onOpen code generator for the given language and optional framework.
 *
 * @private
 */
const resolveOpenConfig = (language: string, framework: string): OnOpenGenerator | null => {
  const config = websocketOnOpenMethod[language];
  if (typeof config === 'function') {
    return config;
  }
  if (framework && typeof (config as Record<string, OnOpenGenerator>)[framework] === 'function') {
    return (config as Record<string, OnOpenGenerator>)[framework];
  }
  return null;
};

interface OnOpenProps {
  /** The programming language for which to generate onOpen handler code. */
  language: Language;
  /** Optional framework variant (e.g., 'quarkus' for java). */
  framework?: string;
  /** The title of the WebSocket server. */
  title: string;
}

/**
 * Renders a WebSocket onOpen event handler for the specified programming language.
 *
 * @param props - Component props.
 * @returns A Text component containing the onOpen handler code for the specified language.
 * @throws When the specified language is not supported.
 * @throws When the specified framework is not supported for the given language.
 *
 * @example
 * import { OnOpen } from "@asyncapi/generator-components";
 * const language = "java";
 * const framework = "quarkus";
 * const title = "HoppscotchEchoWebSocketClient";
 *
 * function renderOnOpen() {
 *   return (
 *     <OnOpen
 *        language={language}
 *        framework={framework}
 *        title={title}
 *     />
 *   )
 * }
 *
 * renderOnOpen();
 */
export function OnOpen({ language, framework='', title }: OnOpenProps): JSX.Element {
  let indent = 0;
  let newLines = 1;

  const supportedLanguages = Object.keys(websocketOnOpenMethod);

  if (!websocketOnOpenMethod[language]) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const generateOnOpenCode = resolveOpenConfig(language, framework);

  if (typeof generateOnOpenCode !== 'function') {
    const supportedFrameworks = Object.keys(websocketOnOpenMethod[language]);
    throw unsupportedFramework(language, framework, supportedFrameworks);
  }

  const openResult = generateOnOpenCode(title);
  const { onOpenMethod } = openResult;
  indent = openResult.indent ?? 0;
  newLines = openResult.newLines ?? newLines;

  return (
    <Text newLines={newLines} indent={indent}>
      {onOpenMethod}
    </Text>
  );
}