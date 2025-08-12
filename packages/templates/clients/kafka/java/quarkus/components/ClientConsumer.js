import ConsumeEvent from "./ConsumeEvent";
import { ConsumerFields } from "./ConsumerFields";
import { Text } from '@asyncapi/generator-react-sdk';


export default function ClientConsumer({ className, operations, headers }) {
    return (
    <Text newLines={2}>
      <Text newLines={2}>
        {`
@ApplicationScoped  
public class ${className}{`}
      </Text>
      <ConsumerFields clientName={className}/>
      <ConsumeEvent/>
      
      
      
    </Text>
  );
}
