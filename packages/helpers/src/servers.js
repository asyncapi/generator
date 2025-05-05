/**
   * Get server URL from AsyncAPI server object.
   *
   * @param {object} server - The AsyncAPI server object.
   * 
   * return {string} - The server URL.
   */
const getServerUrl = (server) => {
  let url = server.host();

  //might be that somebody by mistake duplicated protocol info inside the host field
  //we need to make sure host do not hold protocol info
  if (server.protocol() && !url.includes(`${server.protocol()}://`)) {
    url = `${server.protocol()}://${url}`;
  }

  if (server.hasPathname()) {
    url = `${url}${server.pathname()}`;
  }

  return url;
};

/**
 * Retrieve a server object from the provided AsyncAPI servers collection.
 *
 * @param {Map<string, object>} servers - A map of server names to AsyncAPI server objects.
 * @param {string} serverName - The name of the server to retrieve.
 * 
 * @throws {Error} If any of the parameter is missing or invalid.
 *
 * @returns {object} The AsyncAPI server object corresponding to the given server name.
 */
const getServer = (servers, serverName) => {
  if (!servers) {
    throw new Error('Provided AsyncAPI document doesn\'t contain Servers object.');
  }
  if (!serverName) {
    throw new Error('Server name must be provided.');
  }
  if (!servers.has(serverName)) {
    throw new Error(`Server "${serverName}" not found in AsyncAPI document. Available servers: ${Array.from(servers.keys()).join(', ')}`);
  }
  return servers.get(serverName);
};

module.exports = {
  getServerUrl,
  getServer
};

//TODO: this separate file for helpers for servers represents approach to keep all helpers in separate files related to extractions of data from specific high level AsyncAPI objects. Here we will have more helpers for example related to variables extraction from servers, security, etc.