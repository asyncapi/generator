export class ComponentConfigError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = 'ComponentConfigError';
    this.code = code;
    this.meta = meta;
  }
}

export function resolveLanguageConfig({
  config,
  language,
  framework,
  context
}) {
  const langConfig = config[language];

  if (!langConfig) {
    throw new ComponentConfigError(
      'UNSUPPORTED_LANGUAGE',
      `Language "${language}" is not supported for ${context}.`,
      { supportedLanguages: Object.keys(config) }
    );
  }

  // Case 1: function-based config (python, js, etc.)
  if (typeof langConfig === 'function') {
    return langConfig;
  }

  // Case 2: direct method config (NO frameworks)
  if (
    typeof langConfig === 'object' &&
    ('methodLogic' in langConfig || 'methodDocs' in langConfig)
  ) {
    return langConfig;
  }

  // Case 3: framework-based config (java, etc.)
  if (typeof langConfig === 'object') {
    if (framework && langConfig[framework]) {
      return langConfig[framework];
    }

    if (framework) {
      throw new ComponentConfigError(
        'UNSUPPORTED_FRAMEWORK',
        `Framework "${framework}" is not supported for ${context} in ${language}.`,
        { supportedFrameworks: Object.keys(langConfig) }
      );
    }

    throw new ComponentConfigError(
      'MISSING_FRAMEWORK',
      `Framework must be specified for ${context} in ${language}.`,
      { supportedFrameworks: Object.keys(langConfig) }
    );
  }

  throw new ComponentConfigError(
    'INVALID_LANGUAGE_CONFIG',
    `Invalid configuration for ${context} in ${language}.`
  );
}
