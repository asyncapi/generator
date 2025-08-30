import { ProducerFields } from './ProducerFields';
import { Text } from '@asyncapi/generator-react-sdk';
import SendEvent from './SendEvent';
import { FormatHelpers } from '@asyncapi/modelina';

export default function ClientProducer({ className }) {
  const clientName = FormatHelpers.lowerFirst(className);

  return (
    <Text newLines={2}>
      <Text newLines={2}>
        {`
@ApplicationScoped  
public class ${className}{`}
      </Text>
      <ProducerFields clientName={clientName} />
      <SendEvent eventName={clientName}/>
      
    </Text>
  );
}