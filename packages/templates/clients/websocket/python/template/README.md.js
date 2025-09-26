import { File, Text } from '@asyncapi/generator-react-sdk';
import { BaseInfo } from '../../../../../components/Info';
import { Overview } from '../../../../../components/Overview';
import { Installation } from '../../../../../components/Installation';
import { Usage } from '../../../../../components/Usage';
import { CoreMethods} from '../../../../../components/CoreMethods';

export default function({ asyncapi, params }) {
  const { info, clientName, title, serverUrl } = BaseInfo(asyncapi, params);

  return (
    <File name="README.md">
      <Text newLines={2}>{`# ${title}`}</Text>
      <Overview info={info} title={title} serverUrl={serverUrl} />
      <Installation />
      <Usage clientName={clientName} clientFileName={params.clientFileName} language="python" />
      <CoreMethods language="python" />
    </File>
  );
}
