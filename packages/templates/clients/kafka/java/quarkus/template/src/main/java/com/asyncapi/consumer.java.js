import { FormatHelpers } from '@asyncapi/modelina';
import { File } from '@asyncapi/generator-react-sdk';
import { ConsumerDependencies } from '../../../../../../components/dependencies/ConsumerDependencies';
import ClientConsumer from '../../../../../../components/ClientConsumer';

export default async function ({ asyncapi, params }) {
  const operations = asyncapi.operations();
  const receiveOperations = operations.filterByReceive();

  return receiveOperations.map((operation, index) => {
    const topicName = FormatHelpers.toCamelCase(operation.channels()[index].id());
    const consumerName = `${FormatHelpers.upperFirst(topicName)  }Consumer`;
    const consumerFileName = FormatHelpers.upperFirst(`${consumerName}.java`);
        
    return (
      <File name={consumerFileName}>
        <ConsumerDependencies />
        <ClientConsumer className={consumerName} eventName={topicName}/>
      </File>
    );
  });
}