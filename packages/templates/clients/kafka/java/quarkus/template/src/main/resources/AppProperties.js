import { Text, File } from '@asyncapi/generator-react-sdk';

export default function AppProperties({ asyncapi, params }) {
  // follow what need from kafka starter
 
  

  return (
    <File name="application.properties">
      <Text>
        {`# application.properties`}
      </Text>
    </File>
  );
}