import { Readme } from '@asyncapi/generator-components';
import { CONSTRUCTOR_RESERVED_NAMES } from '../components/Constructor';

export default function({ asyncapi, params }) {
  return Readme({asyncapi, params, language: 'javascript', reservedNames: CONSTRUCTOR_RESERVED_NAMES});  
}