import { File, Text } from '@asyncapi/generator-react-sdk';
import { getOperationMessages } from '@asyncapi/generator-helpers';

export default function ({ asyncapi }) {
  const operations = asyncapi.operations().all();
  const schemaExports = [];

  return (
    <File name="schemas.js">
      {operations.map((operation) => {
        const messages = getOperationMessages(operation);
        const messagePayloads = messages && messages.map((message) => message.payload());
        const schemas = messagePayloads && messagePayloads.map(payload => payload.json());
        const operationSchemas = JSON.stringify(schemas, null, 2);
        const schemaName = `${operation.id()}Schemas`;
        schemaExports.push(schemaName);
        return (
          <Text>
            {`const ${schemaName} = ${operationSchemas};`}
          </Text>
        );
      })}
      <Text>
        {`module.exports = {
  ${schemaExports.join(',\n  ')}
};
        `}
      </Text>
    </File>
  );
}