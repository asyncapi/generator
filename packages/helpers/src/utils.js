/**
 * Get client name from AsyncAPI info.title or uses a custom name if provided.
 *
 * @param {object} info - The AsyncAPI info object.
 * @param {boolean} appendClientSuffix - Whether to append "Client" to the generated name
 * @param {string} [customClientName] - Optional custom client name to use instead of generating from title
 * 
 * @returns {string} The formatted client name, either the custom name or a generated name based on the title
 */
module.exports.getClientName = (info, appendClientSuffix, customClientName) => {
  if (customClientName) {
    return customClientName;
  }
  const title = info.title();
  const baseName = `${title.replace(/\s+/g, '') // Remove all spaces
    .replace(/^./, char => char.toUpperCase())}`; // Make the first letter uppercase
  return appendClientSuffix ? `${baseName}Client` : baseName;
};
  