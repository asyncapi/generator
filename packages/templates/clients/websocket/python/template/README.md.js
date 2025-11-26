import { GenerateReadMe } from '@asyncapi/generator-components';
import { File } from '@asyncapi/generator-react-sdk';

export default function({ asyncapi, params }) {
  return (
    <File name="README.md">
      <GenerateReadMe
        asyncapi={asyncapi}
        params={params}
        language="python"/>
    </File>
  );  
}