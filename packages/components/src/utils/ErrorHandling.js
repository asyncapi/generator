const stringify = (v) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

const isEmpty = (v) => v === undefined || v === null || v === '';
const list = (arr) => arr.join(', ');

export const ERROR_CODES = {
  UNSUPPORTED_LANGUAGE: 'ERR_UNSUPPORTED_LANGUAGE',
  UNSUPPORTED_FRAMEWORK: 'ERR_UNSUPPORTED_FRAMEWORK',
  INVALID_METHOD_NAME: 'ERR_INVALID_METHOD_NAME',
  INVALID_NEW_LINES: 'ERR_INVALID_NEW_LINES',
  INVALID_METHOD_PARAMS: 'ERR_INVALID_METHOD_PARAMS',
  INVALID_CLIENT_NAME: 'ERR_INVALID_CLIENT_NAME',
  INVALID_CLIENT_FILE_NAME: 'ERR_INVALID_CLIENT_FILE_NAME',
  INVALID_PARAMS: 'ERR_INVALID_PARAMS',
  MISSING_ASYNC_API: 'ERR_MISSING_ASYNC_API',
  MISSING_INFO: 'ERR_MISSING_INFO',
  MISSING_SERVER: 'ERR_MISSING_SERVER',
  INVALID_OPERATION: 'ERR_INVALID_OPERATION',
  INVALID_ROLE: 'ERR_INVALID_ROLE',
  NEGATIVE_INDENT: 'ERR_NEGATIVE_INDENT',
};

/**
 * Creates an error with a specific error code for programmatic handling
 * @param {string} code - The error code (from ERROR_CODES)
 * @param {string} message - The error message
 * @returns {Error} An error object with an attached code property
 */
function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function unsupportedLanguage(language, supported = []) {
  const supportedList = list(supported);
  if (isEmpty(language)) {
    return createError(ERROR_CODES.UNSUPPORTED_LANGUAGE, `Language is required. Supported languages: ${supportedList}`);
  }
  return createError(ERROR_CODES.UNSUPPORTED_LANGUAGE, `Unsupported language "${language}". Supported languages: ${supportedList}`);
}

export function unsupportedFramework(language, framework, supported = []) {
  const supportedList = list(supported);
  if (isEmpty(framework)) {
    return createError(ERROR_CODES.UNSUPPORTED_FRAMEWORK, `Framework is required for language "${language}". Supported frameworks: ${supportedList}`);
  }
  return createError(ERROR_CODES.UNSUPPORTED_FRAMEWORK, `Unsupported framework "${framework}" for language "${language}". Supported frameworks: ${supportedList}`);
}

export function invalidMethodName(methodName) {
  return createError(ERROR_CODES.INVALID_METHOD_NAME, `Invalid method name. Expected a non-empty string. Received: ${stringify(methodName)}`);
}

export function invalidMethodParams(methodParams) {
  return createError(ERROR_CODES.INVALID_METHOD_PARAMS, `Invalid method parameters. Expected an array. Received: ${stringify(methodParams)}`);
}

export function invalidClientName(clientName) {
  return createError(ERROR_CODES.INVALID_CLIENT_NAME, `Invalid client name. Expected a non-empty string. Received: ${stringify(clientName)}`);
}

export function invalidClientFileName(clientFileName) {
  return createError(ERROR_CODES.INVALID_CLIENT_FILE_NAME, `Invalid client file name. Expected a non-empty string. Received: ${stringify(clientFileName)}`);
}

export function invalidParams(params) {
  return createError(ERROR_CODES.INVALID_PARAMS, `Invalid params object. Received: ${stringify(params)}`);
}

export function invalidAsyncAPI() {
  return createError(ERROR_CODES.MISSING_ASYNC_API, 'AsyncAPI document is missing.');
}

export function invalidInfo() {
  return createError(ERROR_CODES.MISSING_INFO, 'AsyncAPI "info" object is missing.');
}

export function invalidServer() {
  return createError(ERROR_CODES.MISSING_SERVER, 'AsyncAPI "server" object is missing.');
}

export function invalidOperation() {
  return createError(ERROR_CODES.INVALID_OPERATION, 'Invalid AsyncAPI operation. Expected a valid operation with id().');
}

export function invalidRole(role, supported = []) {
  return createError(ERROR_CODES.INVALID_ROLE, `Unsupported role "${role}". Supported roles: ${supported.join(', ')}`);
}

export function invalidNonNegativeInteger(code, field, value) {
  return createError(code, `"${field}" must be >= 0. Received: ${stringify(value)}`);
}

export function invalidNewLines(newLines) {
  return invalidNonNegativeInteger(ERROR_CODES.INVALID_NEW_LINES, 'newLines', newLines);
}

export function negativeIndent(indent) {
  return invalidNonNegativeInteger(ERROR_CODES.NEGATIVE_INDENT, 'indent', indent);
}
