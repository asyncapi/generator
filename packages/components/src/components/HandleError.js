import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, unsupportedFramework } from '../utils/ErrorHandling';

/**
 * @typedef {'python' | 'dart' | 'java'} Language
 * Supported programming languages for error-handling method generation.
 */

/**
 * @typedef {Object} HandleErrorBlock
 * @property {string} body - Source string rendered inside the `<Text>` block.
 * @property {number} indent - Indentation applied by the `<Text>` wrapper.
 * @property {number} [newLines] - Trailing newlines on the `<Text>` wrapper (defaults to 1 in react-sdk).
 */

/**
 * Language/framework-specific bodies of the `handleError` method.
 *
 * @type {Record<Language, HandleErrorBlock | Record<string, HandleErrorBlock>>}
 */
const handleErrorConfig = {
  python: {
    indent: 2,
    newLines: 2,
    body: `def handle_error(self, error):
    """Pass the error to all registered error handlers. Generic log message is printed if no handlers are registered."""
    if len(self.error_handlers) == 0:
      print("\\033[91mError occurred:\\033[0m", error)
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
 * @param {Language} language
 * @param {string} framework
 * @returns {HandleErrorBlock | null}
 */
function resolveHandleErrorBlock(language, framework) {
  const config = handleErrorConfig[language];
  if (config && typeof config.body === 'string') {
    return config;
  }
  if (config && framework && config[framework]) {
    return config[framework];
  }
  return null;
}

/**
 * Renders the `handleError` (or framework-equivalent) method body that dispatches
 * an error to registered handlers (or logs it when none are registered).
 *
 * @param {Object} props
 * @param {Language} props.language - Target programming language.
 * @param {string} [props.framework=''] - Framework discriminator (required for languages with multiple frameworks, e.g. `java` → `quarkus`).
 * @returns {JSX.Element} A `<Text>` block containing the rendered method.
 * @throws {Error} When `language` is missing or not one of the supported languages for `HandleError` (code: `ERR_UNSUPPORTED_LANGUAGE`).
 * @throws {Error} When `language` requires a framework discriminator and `framework` is missing or not supported for that language (e.g. `java` without `quarkus`) (code: `ERR_UNSUPPORTED_FRAMEWORK`).
 *
 * @example
 * import { HandleError } from '@asyncapi/generator-components';
 *
 * function renderHandleError() {
 *   return <HandleError language='python' />;
 * }
 */
export function HandleError({ language, framework = '' }) {
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
