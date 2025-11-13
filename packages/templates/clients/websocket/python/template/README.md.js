import { GenerateReadMe } from '@asyncapi/generator-components';

export default function({ asyncapi, params }) {
  return (  
    <GenerateReadMe  
      asyncapi={asyncapi} 
      params={params} 
      language="python" 
    />  
  );  
}