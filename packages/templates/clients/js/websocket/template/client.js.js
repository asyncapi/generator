import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { Constructor } from '../components/Constructor';
import { Connect } from '../components/Connect';
import { RegisterMessageHandler } from '../components/RegisterMessageHandler';
import { RegisterErrorHandler } from '../components/RegisterErrorHandler';
import { HandleMessage } from '../components/HandleMessage';
import { SendEchoMessage } from '../components/SendEchoMessage';
import { CloseConnection } from '../components/CloseConnection';
import { ModuleExport } from '../components/ModuleExport';

export default function ({ asyncapi, params }) {
  const server = asyncapi.servers().get(params.server);
  const info = asyncapi.info();
  const title = info.title();
  const clientName = getClientName(info);
  const serverName = getServerUrl(server);
  //TODO at this moment this template shows usage of granular components and also generic Text component with lots of code but also not so nice to read. We need to figure the best way of handling this.
  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires />
        <Text>
           {`class ${clientName} {`}
        </Text>
          <Constructor serverName={serverName} />
          <Connect title={title} />
          <RegisterMessageHandler />
          <RegisterErrorHandler />
          <HandleMessage />
          <SendEchoMessage />
          <CloseConnection />
        <Text>
          {
            `}`
          }
        </Text>
        <ModuleExport clientName={clientName} />
    </File>
  );
}
