import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { Overview } from './Overview';
import { Installation } from './Installation';
import { Usage } from './Usage';
import { CoreMethods } from './CoreMethods';
import { AvailableOperations } from './AvailableOperations';

export function Readme({ asyncapi, params, language }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);

  const operations = asyncapi.operations().all();

  return (
    <File name="README.md">
      <Text newLines={2}>{`# ${title}`}</Text>
      <Overview info={info} title={title} serverUrl={serverUrl} />
      <Installation language={language}/>
      <Usage
        clientName={clientName}
        clientFileName={params.clientFileName}
        language={language}
      />
      <CoreMethods language={language} />
      {operations.length > 0 && <AvailableOperations operations={operations} />}
    </File>
  );
}

