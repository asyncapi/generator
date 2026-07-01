import { File } from '@asyncapi/generator-react-sdk';
import { Example } from '@asyncapi/generator-components';

export default function ({ asyncapi, params }) {
  return (
    <File name={params.exampleFileName}>
      <Example asyncapi={asyncapi} params={params} language="python" />
    </File>
  );
}
