/**
 * @typedef {'python' | 'javascript' | 'typescript' | 'dart' | 'java' | 'csharp' | 'rust'} Language
 * All supported programming languages across the AsyncAPI generator components.
 */

/**
 * @typedef {Language} SupportedLanguage
 * Alias for Language typedef, kept for backward compatibility.
 */

/**
 * @typedef {'python' | 'java' | 'typescript' | 'rust' | 'csharp' | 'js'} ModelLanguage
 * Languages supported by the Models component.
 */

/**
 * @typedef {'toPascalCase' | 'toCamelCase' | 'toKebabCase' | 'toSnakeCase'} Format
 * Available format helpers for transforming naming conventions.
 */

/**
 * @typedef {Object} QueryParamCodeBlock
 * Language-specific code block structure for query parameter generation.
 *
 * @property {{ text: string, indent?: number, newLines?: number }} variableDefinition
 * @property {{ text: string, indent?: number, newLines?: number }} ifCondition
 * @property {{ text: string, indent?: number, newLines?: number }} assignment
 * @property {{ text: string, indent?: number, newLines?: number } | null} [closing]
 */
