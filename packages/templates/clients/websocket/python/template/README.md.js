import { Readme } from '@asyncapi/generator-components';

export default function({ asyncapi, params }) {
  return Readme({asyncapi, params, language: 'python'});  
}