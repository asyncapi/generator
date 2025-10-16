import { File, Text } from '@asyncapi/generator-react-sdk';
import { Overview } from './Overview';
import { Installation } from './Installation';
import { Usage } from './Usage';
import { CoreMethods } from './CoreMethods';
import { AvailableOperations } from '../../../../../../../components/AvailableOperations';


export function GenerateReadMe({ asyncapi, params, language}) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);
  const operations = language === 'javascript' ? asyncapi.operations().all() : null;

  const includeInstallation = language === 'python';
  const includeOperations = language === 'javascript';

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
      {includeOperations && <AvailableOperations operations={operations} />}
    </File>
  );
}
