import { File } from '@asyncapi/generator-react-sdk';
import { ProducerDependencies } from '../../../../../../components/dependencies/ProducerDependencies';
import ClientProducer from '../../../../../../components/ClientProducer';
import { toCamelCase, upperFirst } from '@asyncapi/generator-helpers';

export default function ({ asyncapi, params }) {
  const operations = asyncapi.operations();    

  const sendOperations = operations.filterBySend();    
    
  return sendOperations.map((operation, index) => {
    const topicName = toCamelCase(operation.channels()[index].id());
    const producerName = `${upperFirst(topicName)  }Producer`;
    const producerFileName = upperFirst(`${producerName}.java`);
        
    return (
      <File name={producerFileName}>
        <ProducerDependencies />
        <ClientProducer className={producerName}/>
      </File>
    );
  });
}