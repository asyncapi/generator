import { Text } from '@asyncapi/generator-react-sdk';

export function ModuleExport({ clientName }) {
  return (
    <Text>
      {
        `module.exports = ${clientName};`
      }
    </Text>
  );
}
