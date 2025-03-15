import { File, Text } from '@asyncapi/generator-react-sdk';

export default function () {
  return (
    <File name="requirements.txt">
      <Text>
        {`websockets==9.1
requests==2.20.0`}
      </Text>
    </File>
  );
}
