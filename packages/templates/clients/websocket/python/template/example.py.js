import { File } from '@asyncapi/generator-react-sdk';
import { Example } from '../components/Example';

export default function ({ asyncapi, params }) {
  return (
    <File name={params.exampleFileName}>
      <Example asyncapi={asyncapi} params={params} />
    </File>
  );
}
