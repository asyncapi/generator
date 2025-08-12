import { Text } from '@asyncapi/generator-react-sdk';

export function ProducerFields({ clientName }) {
  return (
    <Text indent={2} newLines={2}>
      {`private static final Logger logger = Logger.getLogger(${clientName}.class);

@Inject 
@Channel("costing-request-out") // is this the right channel name
Emitter<Record<String, String>> ${clientName}Emitter;`}
    </Text>
  );
}
