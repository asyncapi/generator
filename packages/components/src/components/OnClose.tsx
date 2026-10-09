import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedFramework, unsupportedLanguage } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'dart' | 'java';

interface OnCloseResult {
  onCloseMethod: string;
  indent?: number;
}

type OnCloseGenerator = (title: string) => OnCloseResult;

/**
 * Mapping of supported programming languages to their WebSocket onClose event handler implementations.
 */
const websocketOnCloseMethod: Record<string, OnCloseGenerator | Record<string, OnCloseGenerator>> = {
  javascript: (title: string): OnCloseResult => {
    return {
      onCloseMethod: `// On connection close
    this.websocket.onclose = () => {
      console.log('Disconnected from ${title} server');
    };`
    };
  },
  python: (title: string): OnCloseResult => {
    return {
      onCloseMethod: `def on_close(self, ws, close_status_code, close_msg):
  print("Disconnected from ${title}", close_status_code, close_msg)`
    };
  },
  dart: (title: string): OnCloseResult => {
    return {
      onCloseMethod: `onDone: () {
        _channel = null;
        print('Disconnected from ${title} server');
      },`
    };
  },
  java: {
    quarkus: (title: string): OnCloseResult => {
      const onCloseMethod = `
  @OnClose
  public void onClose(CloseReason reason, WebSocketClientConnection connection) {
    int code = reason.getCode();
    LOG.info("Websocket disconnected from ${title} with Close code: " + code);
  }
}`;
      return { onCloseMethod, indent: 0 };
    }
  }
};

/**
 * Resolves the appropriate onClose code generator for the given language and optional framework.
 *
 * @private
 */
const resolveCloseConfig = (language: string, framework: string): OnCloseGenerator | null => {
  const config = websocketOnCloseMethod[language];
  if (typeof config === 'function') {
    return config;
  }
  if (framework && typeof (config as Record<string, OnCloseGenerator>)[framework] === 'function') {
    return (config as Record<string, OnCloseGenerator>)[framework];
  }
  return null;
};

interface OnCloseProps {
  /** The programming language for which to generate onClose handler code. */
  language: Language;
  /** Framework variant; required for framework-specific languages (e.g., 'quarkus' for java). */
  framework?: string;
  /** The title of the WebSocket server. */
  title: string;
}

/**
 * Renders a WebSocket onClose event handler for the specified programming language.
 *
 * @param props - Component props.
 * @returns A Text component containing the onClose handler code for the specified language.
 * @throws When the specified language is not supported.
 * @throws When the specified framework is not supported for the given language.
 *
 * @example
 * import { OnClose } from "@asyncapi/generator-components";
 * const language = "java";
 * const framework = "quarkus";
 * const title = "HoppscotchEchoWebSocketClient";
 *
 * function renderOnClose() {
 *  return (
 *    <OnClose
 *       language={language}
 *       framework={framework}
 *       title={title}
 *    />
 *  )
 * }
 *
 * renderOnClose();
 */
export function OnClose({ language, framework = '', title }: OnCloseProps): JSX.Element {
  let indent = 0;

  const supportedLanguages = Object.keys(websocketOnCloseMethod);

  if (!websocketOnCloseMethod[language]) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const generateOnCloseCode = resolveCloseConfig(language, framework);

  if (typeof generateOnCloseCode !== 'function') {
    const supportedFrameworks = Object.keys(websocketOnCloseMethod[language]);
    throw unsupportedFramework(language, framework, supportedFrameworks);
  }

  const closeResult = generateOnCloseCode(title);
  const { onCloseMethod } = closeResult;
  
  indent = closeResult.indent ?? 0;

  return (
    <Text indent={indent}>
      {onCloseMethod}
    </Text>
  );
}