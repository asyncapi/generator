import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, unsupportedFramework } from '../utils/ErrorHandling';

/**
 * Supported programming languages for error-handling method generation.
 */
type Language = 'python' | 'dart' | 'java';

/**
 * Shape of a single handle-error code block.
 */
interface HandleErrorBlock {
  /** Source string rendered inside the `<Text>` block. */
  body: string;
  /** Indentation applied by the `<Text>` wrapper. */
  indent: number;
  /** Trailing newlines on the `<Text>` wrapper (defaults to 1 in react-sdk). */
  newLines?: number;
}

/**
 * Language/framework-specific bodies of the `handleError` method.
 */
const handleErrorConfig: Record<string, HandleErrorBlock | Record<string, HandleErrorBlock>> = {
  python: {
    indent: 2,
    newLines: 2,
    body: String.raw`def handle_error(self, error):
    """Pass the error to all registered error handlers. Generic log message is printed if no handlers are registered."""
    if len(self.error_handlers) == 0:
      print("\033[91mError occurred:\033[0m", error)
    else:
      # Call custom error handlers
      for handler in self.error_handlers:
        handler(error)`,
  },
  dart: {
    indent: 2,
    newLines: 2,
    body: `/// Pass the error to all registered error handlers.
/// A generic log message is printed if no handlers are registered.
void _handleError(Object error) {
  if (_errorHandlers.isEmpty) {
    print('Error occurred: $error');
  } else {
    for (final handler in _errorHandlers) {
      handler(error);
    }
  }
}`,
  },
  java: {
    quarkus: {
      indent: 2,
      body: `@OnError
public void onError(Throwable throwable) {
    LOG.error("Websocket connection error: " + throwable.getMessage());
}
`,
    },
  },
};

/**
 * Resolve the appropriate handle-error block for the given language/framework pair.
 *
 * @private
 */
function resolveHandleErrorBlock(language: Language, framework: string): HandleErrorBlock | null {
  const config = handleErrorConfig[language];
  if (config && typeof (config as HandleErrorBlock).body === 'string') {
    return config as HandleErrorBlock;
  }
  if (config && framework && (config as Record<string, HandleErrorBlock>)[framework]) {
    return (config as Record<string, HandleErrorBlock>)[framework];
  }
  return null;
}

interface HandleErrorProps {
  /** Target programming language. */
  language: Language;
  /** Framework discriminator (required for languages with multiple frameworks, e.g. `java` → `quarkus`). */
  framework?: string;
}

/**
 * Renders the `handleError` (or framework-equivalent) method body that dispatches
 * an error to registered handlers (or logs it when none are registered).
 *
 * @param props
 * @returns A `<Text>` block containing the rendered method.
 * @throws When `language` is missing or not one of the supported languages for `HandleError` (code: `ERR_UNSUPPORTED_LANGUAGE`).
 * @throws When `language` requires a framework discriminator and `framework` is missing or not supported for that language (e.g. `java` without `quarkus`) (code: `ERR_UNSUPPORTED_FRAMEWORK`).
 *
 * @example
 * import { HandleError } from '@asyncapi/generator-components';
 *
 * function renderHandleError() {
 *   return <HandleError language='python' />;
 * }
 */
export function HandleError({ language, framework = '' }: HandleErrorProps): JSX.Element {
  const supportedLanguages = Object.keys(handleErrorConfig);
  if (!supportedLanguages.includes(language)) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  const block = resolveHandleErrorBlock(language, framework);
  if (!block) {
    const supportedFrameworks = Object.keys(handleErrorConfig[language]);
    throw unsupportedFramework(language, framework, supportedFrameworks);
  }

  return (
    <Text indent={block.indent} newLines={block.newLines}>
      {block.body}
    </Text>
  );
}
