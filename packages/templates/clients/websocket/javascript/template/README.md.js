import { GenerateReadMe } from '@asyncapi/generator-components';
import { AvailableOperations } from '../components/AvailableOperations';

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