import { GenerateReadMe } from '@asyncapi/generator-components';
import { AvailableOperations } from '../../../../../components/src/components/readme/AvailableOperations';

export default function({ asyncapi, params }) {
  return (  
    <GenerateReadMe  
      asyncapi={asyncapi} 
      params={params} 
      language="javascript" 
      AvailableOperations={AvailableOperations}
    />  
  );  
}