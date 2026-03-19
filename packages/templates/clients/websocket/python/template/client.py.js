import { File } from '@asyncapi/generator-react-sdk';
import { getServer, getQueryParams, getInfo } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '@asyncapi/generator-components';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  
  // Fetch all channel parameters with our new helper
  const allQueryParams = getQueryParams(asyncapi.channels());
  
  // Convert the first channel's parameters back into a Map so the template doesn't break
  let queryParams = null;
  if (allQueryParams) {
    const firstChannelName = Object.keys(allQueryParams)[0];
    queryParams = new Map(Object.entries(allQueryParams[firstChannelName]));
  }

  return (
    // The clientFileName default values can be found and modified under the .ageneratorrc
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="python"
      />
      <Requires query={queryParams} />
      <ClientClass asyncapi={asyncapi} params={params} />
    </File>
  );
}