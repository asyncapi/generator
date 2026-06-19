import { Text } from '@asyncapi/generator-react-sdk';
import { getMessageDiscriminatorsFromOperations } from '@asyncapi/generator-helpers';

/**
 * Component that generates initialization code for receive operation discriminators.
 * 
 * @param {Object} props - Component properties
 * @param {Array<Object>} [props.receiveOperations] - Receive operations from AsyncAPI document
 * @returns {React.Element|null} Rendered initialization code or null.
 */
export function ReceiveOperationsDiscriminators({ receiveOperations }) {
  const operationDiscriminators = Array.isArray(receiveOperations) && receiveOperations.length > 0
    ? getMessageDiscriminatorsFromOperations(receiveOperations)
    : [];
  const serializedDiscriminators = JSON.stringify(operationDiscriminators);

  return (
    <Text indent={2} newLines={2}>
      {`
      self.receive_operation_handlers = {}
      self.receive_operation_discriminators = ${serializedDiscriminators}`
      }
    </Text>
  );
}
