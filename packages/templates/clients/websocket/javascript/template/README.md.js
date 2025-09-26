import { File, Text } from '@asyncapi/generator-react-sdk';
import { BaseInfo } from '../../../../../components/Info';
import { Overview } from '../../../../../components/Overview';
import { CoreMethods } from '../../../../../components/CoreMethods';
import { Usage } from '../../../../../components/Usage';
import { AvailableOperations } from '../components/AvailableOperations';

export default function({ asyncapi, params }) {
  const { info, clientName, title, serverUrl } = BaseInfo(asyncapi, params);

  const operations = asyncapi.operations().all();

  return (
    <File name="README.md">
      <>
        <Text newLines={2}>
          {`# ${title}`}
        </Text>
        <Overview info={info} title={title} serverUrl={serverUrl} />
        <Usage
          clientName={clientName}
          clientFileName={params.clientFileName}
          language="javascript"
        />
        <CoreMethods language="javascript" />
        <AvailableOperations operations={operations} />
      </>
    </File>
  );
}
