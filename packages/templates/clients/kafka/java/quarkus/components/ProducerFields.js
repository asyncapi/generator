import { Text } from '@asyncapi/generator-react-sdk';
import { FormatHelpers } from '@asyncapi/modelina';

export function ProducerFields({ clientName }) {
  const className = FormatHelpers.upperFirst(clientName);
  return (
    <Text newLines={2}>
      {`
    private static final Logger logger = Logger.getLogger(${className}.class);

    @Inject 
    @Channel("producer-channel")
    Emitter<String> ${clientName}Emitter;`}
    </Text>
  );
}
