/**
   * Get server URL from AsyncAPI server object.
   *
   * @param {object} server - The AsyncAPI server object.
   * 
   * return {string} - The server URL.
   */
function getServerUrl(server) {
  let url = server.host();

  //might be that somebody by mistake duplicated protocol info inside the host field
  //we need to make sure host do not hold protocol info
  if (server.protocol() && !url.includes(server.protocol())) {
    url = `${server.protocol()}://${url}`;
  }
    
  if (server.hasPathname()) {
    url = `${url}${server.pathname()}`;
  }
    
  return url;
}

//TODO: this separate file for helpers for servers represents approach to keep all helpers in separate files related to extractions of data from specific high level AsyncAPI objects. Here we will have more helpers for example related to variables extraction from servers, security, etc.
  
export { getServerUrl };
    