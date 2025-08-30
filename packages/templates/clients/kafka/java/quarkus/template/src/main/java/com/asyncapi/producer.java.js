import { File } from '@asyncapi/generator-react-sdk';
import { ProducerDependencies } from '../../../../../../components/dependencies/ProducerDependencies';
import ClientProducer from '../../../../../../components/ClientProducer';
import { FormatHelpers } from '@asyncapi/modelina';

export default async function ({ asyncapi, params }) {
  const operations = asyncapi.operations();    

  const sendOperations = operations.filterBySend();    
    
  return sendOperations.map((operation, index) => {
    const topicName = FormatHelpers.toCamelCase(operation.channels()[index].id());
    const producerName = `${FormatHelpers.upperFirst(topicName)  }Producer`;
    const producerFileName = FormatHelpers.upperFirst(`${producerName}.java`);
        
    return (
      <File name={producerFileName}>
        <ProducerDependencies />
        <ClientProducer className={producerName}/>
      </File>
    );
  });
}