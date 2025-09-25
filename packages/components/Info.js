import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';


export function BaseInfo(asyncapi, params) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);

  return { server, info, clientName, title, serverUrl };
}
