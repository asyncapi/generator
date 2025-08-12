import { ProducerFields } from "./ProducerFields";
import { Text } from '@asyncapi/generator-react-sdk';
import SendEvent from "./SendEvent";



export default function ClientProducer({ className, operations, headers }) {
    return (
    <Text newLines={2}>
      <Text newLines={2}>
        {`
@ApplicationScoped  
public class ${className}{`}
      </Text>
      <ProducerFields clientName={className} />
      <SendEvent headers={headers} eventName={className}/>
      
    </Text>
  );
}