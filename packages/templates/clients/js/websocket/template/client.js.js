import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { ClassDeclaration } from '../components/ClassDeclaration';
import { ConnectMethod } from '../components/ConnectMethod';
import { HandlerRegistration } from '../components/HandlerRegistration';
import { HandleMessageMethod, SendEchoMessageMethod, CloseMethod } from '../components/UtilityMethods';
import { ModuleExport } from '../components/ModuleExport';

export default function({ asyncapi, params }) {
  const server = asyncapi.servers().get(params.server);
  const info = asyncapi.info();
  const clientName = getClientName(info);
  const serverUrl = getServerUrl(server);

  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo info={info} server={server} />
      <Requires />
      <Text>
        {`
${ClassDeclaration({ clientName, serverUrl })}

${ConnectMethod({ title: info.title() })}

${HandlerRegistration({ handlerType: 'Message' })}
${HandlerRegistration({ handlerType: 'Error' })}

${HandleMessageMethod()}
${SendEchoMessageMethod()}
${CloseMethod()}
}`}
      </Text>
      <ModuleExport clientName={clientName} />
    </File>
  );
}