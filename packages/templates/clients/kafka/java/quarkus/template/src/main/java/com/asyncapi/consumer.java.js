import { toCamelCase, upperFirst } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { ConsumerDependencies } from '../../../../../../components/dependencies/ConsumerDependencies';
import ClientConsumer from '../../../../../../components/ClientConsumer';

export default function ({ asyncapi, params }) {
  const operations = asyncapi.operations();
  const receiveOperations = operations.filterByReceive();

  return receiveOperations.map((operation, index) => {
    const topicName = toCamelCase(operation.channels()[index].id());
    const consumerName = `${upperFirst(topicName)  }Consumer`;
    const consumerFileName = upperFirst(`${consumerName}.java`);
        
    return (
      <File name={consumerFileName}>
        <ConsumerDependencies />
        <ClientConsumer className={consumerName} eventName={topicName}/>
      </File>
    );
  });
}