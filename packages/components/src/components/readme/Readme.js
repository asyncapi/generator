import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { Overview } from './Overview';
import { Installation } from './Installation';
import { Usage } from './Usage';
import { CoreMethods } from './CoreMethods';

export function GenerateReadMe({ asyncapi, params, language, AvailableOperations: AvailableOperationsComponent }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);

  const includeInstallation = language === 'python';
  const includeAvailableOps = language === 'javascript';
  const operations = includeAvailableOps ? asyncapi.operations().all() : [];

  return (
    <File name="README.md">
      <Text newLines={2}>{`# ${title}`}</Text>
      <Overview info={info} title={title} serverUrl={serverUrl} />
      {includeInstallation && <Installation />}
      <Usage
        clientName={clientName}
        clientFileName={params.clientFileName}
        language={language}
      />
      <CoreMethods language={language} />
      {includeAvailableOps && <AvailableOperationsComponent operations={operations} />}
    </File>
  );
}

