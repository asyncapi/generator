const stringify = (v) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

export function unsupportedLanguage(language, supported = []) {
  const supportedList = supported.join(', ');
  if (language === undefined || language === null || language === '') {
    return new Error(`Language is required. Supported languages: ${supportedList}`);
  }
  return new Error(`Unsupported language "${language}". Supported languages: ${supportedList}`);
}

export function unsupportedFramework(language, framework, supported = []) {
  const supportedList = supported.join(', ');
  if (framework === undefined || framework === null || framework === '') {
    return new Error(`Framework is required for language "${language}". Supported frameworks: ${supportedList}`);
  }
  return new Error(`Unsupported framework "${framework}" for language "${language}". Supported frameworks: ${supportedList}`);
}

export function invalidMethodName(methodName) {
  return new Error(`Invalid method name. Expected a non-empty string. Received: ${stringify(methodName)}`);
}

export function invalidNewLines(newLines) {
  return new Error(`Invalid newLines value. Must be >= 0. Received: ${stringify(newLines)}`);
}

export function invalidMethodParams(methodParams) {
  return new Error(`Invalid method parameters. Expected an array. Received: ${stringify(methodParams)}`);
}

export function invalidClientName(clientName) {
  return new Error(`Invalid client name. Expected a non-empty string. Received: ${stringify(clientName)}`);
}

export function invalidClientFileName(clientFileName) {
  return new Error(`Invalid client file name. Expected a non-empty string. Received: ${stringify(clientFileName)}`);
}

export function invalidParams(params) {
  return new Error(`Invalid params object. Received: ${stringify(params)}`);
}

export function invalidAsyncAPI() {
  return new Error('AsyncAPI document is missing.');
}

export function invalidInfo() {
  return new Error('AsyncAPI "info" object is missing.');
}

export function invalidServer() {
  return new Error('AsyncAPI "server" object is missing.');
}

export function invalidOperation() {
  return new Error('Invalid AsyncAPI operation. Expected a valid operation with id().');
}

export function invalidRole(role, supported = []) {
  return new Error(`Unsupported role "${role}". Supported roles: ${supported.join(', ')}`);
}

export function negativeIndent(indent) {
  return new Error(`Indent size must be >= 0. Received: ${stringify(indent)}`);
}
