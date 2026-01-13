import { Text } from '@asyncapi/generator-react-sdk';
import { getMessageDiscriminatorsFromOperations } from '@asyncapi/generator-helpers';

/**
 * Language-specific code generators for initializing
 * receive operation discriminator handling.
 */
const languageSpecificInitializers = {
  python: (serializedDiscriminators) => `
      self.receive_operation_discriminators = ${serializedDiscriminators}`,
};

/**
 * Generates language-specific initialization code
 * for receive operation discriminators.
 *
 * @param {object} props - Component props.
 * @param {string} props.language - Target language (e.g. "python").
 * @param {Array} props.operations - Receive operations from AsyncAPI document.
 * @returns {React.Element|null} Rendered initialization code or null.
 */
export function OperationsDiscriminators({ language, operations }) {
  const hasOperations = Array.isArray(operations) && operations.length > 0;
  if (!hasOperations) {
    return null;
  }

  const getLanguageInitializer = languageSpecificInitializers[language];
  if (!getLanguageInitializer) {
    return null;
  }

  const operationDiscriminators = getMessageDiscriminatorsFromOperations(operations);
  const serializedDiscriminators = JSON.stringify(operationDiscriminators);
  const initializationCode = getLanguageInitializer(serializedDiscriminators);

  return (
    <Text indent={2} newLines={2}>
      {initializationCode}
    </Text>
  );
}
