const stringify = (v) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

export function unsupportedLanguage(language, supported = []) {
  throw new Error(`Unsupported language "${language}". Supported languages: ${supported.join(', ')}`);
}

export function unsupportedFramework(language, framework, supported = []) {
  throw new Error(`Unsupported framework "${framework}" for language "${language}". Supported frameworks: ${supported.join(', ')}`);
}

export function unsupportedFormat(format, supported = []) {
  throw new Error(`Unsupported format "${format}". Supported formats: ${supported.join(', ')}`);
}

export function invalidValue(name, value) {
  throw new Error(`Invalid value for "${name}". Received: ${stringify(value)}`);
}

export function invalidMethodName(methodName) {
  throw new Error(`Invalid method name. Expected a non-empty string. Received: ${stringify(methodName)}`);
}

export function invalidNewLines(newLines) {
  throw new Error(`Invalid newLines value. Must be >= 0. Received: ${newLines}`);
}

export function invalidMethodParams(methodParams) {
  throw new Error(`Invalid method parameters. Expected an array. Received: ${stringify(methodParams)}`);
}

export function invalidClientName(clientName) {
  throw new Error(`Invalid client name. Expected a non-empty string. Received: ${stringify(clientName)}`);
}

export function invalidClientFileName(clientFileName) {
  throw new Error(`Invalid client file name. Expected a non-empty string. Received: ${stringify(clientFileName)}`);
}

export function invalidParams(params) {
  throw new Error(`Invalid params object. Received: ${stringify(params)}`);
}

export function invalidAsyncAPI() {
  throw new Error('AsyncAPI document is missing or invalid.');
}

export function invalidInfo() {
  throw new Error('AsyncAPI "info" object is missing or invalid.');
}

export function invalidServer() {
  throw new Error('AsyncAPI "server" object is missing or invalid.');
}

export function invalidOperation() {
  throw new Error('Invalid AsyncAPI operation. Expected a valid operation with id().');
}

export function invalidRole(role, supported = []) {
  throw new Error(`Unsupported role "${role}". Supported roles: ${supported.join(', ')}`);
}

export function negativeIndent(indent) {
  throw new Error(`Indent size must be >= 0. Received: ${indent}`);
}
