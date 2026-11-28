/**
 * Build the JSDoc `@param` line that documents one property of a schema, such as a message's headers or payload.
 * A property of type `object` gets its line without a description, followed by one line for each of its own properties.
 *
 * @example
 * // `field` is the schema `{ type: 'integer', description: 'Size of the page' }`
 * docline(field, 'pageSize', 'options.message.headers')
 * // ' * @param {integer} options.message.headers.pageSize - Size of the page'
 *
 * @param {object} field - The AsyncAPI schema object of the property.
 * @param {string} fieldName - The name of the property.
 * @param {string} [scopePropName] - The JSDoc name of the parameter that holds the property, e.g. `options.message.payload`.
 *
 * @returns {string} The JSDoc line, or several lines separated by line feeds for a property of type `object`.
 */
const docline = (field, fieldName, scopePropName) => {
  const type = field.type() || 'string';
  const paramName = scopePropName ? `${scopePropName}.${fieldName}` : fieldName;

  let defaultValue = field.default();
  if (defaultValue && type === 'string') {
    defaultValue = `'${defaultValue}'`;
  }

  let line = ` * @param {${type}} ${paramName}`;
  if (defaultValue !== undefined) {
    line = ` * @param {${type}} [${paramName}=${defaultValue}]`;
  }

  if (type === 'object') {
    // Why: the Parser returns `undefined`, not an empty map, for an object schema without `properties`.
    const properties = field.properties() || {};
    const propertyLines = Object.keys(properties).map((propertyName) => {
      return docline(properties[propertyName], propertyName, paramName);
    });
    return `${line}\n${propertyLines.join('\n')}`;
  }

  const description = field.description() ? ` - ${field.description().replace(/\r?\n|\r/g, '')}` : '';
  return `${line}${description}`;
};

module.exports = {
  docline
};
