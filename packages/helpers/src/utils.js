/**
 * Get client name from AsyncAPI info.title
 *
 * @param {object} info - The AsyncAPI info object.
 * 
 * return {string} - The client name with "Client" appended at the end.
 */
module.exports.getClientName = (info) => {
  const title = info.title();
  
  // Remove spaces, make the first letter uppercase, and add "Client" at the end
  return `${title.replace(/\s+/g, '') // Remove all spaces
    .replace(/^./, char => char.toUpperCase()) // Make the first letter uppercase
  }Client`;
};
  