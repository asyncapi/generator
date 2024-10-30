//TODO: this is not good, lame workaround that will fail in our tests that do some isolation magic and paths like that will not work
import { Models } from '../../../../../components/src/index';
//import { Models } from '@asyncapi/generator-components';

export default async function({ asyncapi }) {
  return await Models({asyncapi, language: 'csharp'})
}