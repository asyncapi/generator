import { FormatHelpers } from "@asyncapi/modelina";
import { File } from "@asyncapi/generator-react-sdk";
import { ConsumerDependencies } from "../../../../../../components/dependencies/ConsumerDependencies";
import ClientConsumer from "../../../../../../components/ClientConsumer";




export default async function ({ asyncapi, params }) {

    const operations = asyncapi.operations();
    const receiveOperations = operations.filterByReceive();

     return receiveOperations.map((operation, index ) => {
        const topicName = FormatHelpers.toCamelCase(operation.channels()[index].id());
        const consumerName = FormatHelpers.upperFirst(topicName) + "Consumer";
        const consumerFileName = FormatHelpers.upperFirst(`${consumerName}.java`);
        
        return (
        <File name={consumerFileName}>
            <ConsumerDependencies />
            <ClientConsumer className={consumerName}/>
        </File>
        );


     });

}
/**
 * Could just use the model
 * 
 * function mapToJavaType(schema, name) {
  // JSON Schema type → Java type mapping
  const jsonType = schema.type();

  if (jsonType === 'string') return 'String';
  if (jsonType === 'integer') return 'Integer';
  if (jsonType === 'number') return 'Double';
  if (jsonType === 'boolean') return 'Boolean';

  if (jsonType === 'array') {
    const items = schema.items();
    if (items && items.type()) {
      return `List<${mapToJavaType(items, name)}>`;
    }
    return "List<Object>";
  }

  if (jsonType === 'object' || schema.oneOf()?.length) {
    // Complex type → class name = capitalize property name
    return FormatHelpers.upperFirst(name);
  }

  return "Object"; // fallback
}
 */