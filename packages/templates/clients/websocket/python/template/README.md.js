import { GenerateReadMe } from '@asyncapi/generator-components';

export default function({ asyncapi, params }) {
  return GenerateReadMe({asyncapi, params, language: 'python'});  
}