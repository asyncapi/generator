import { Models } from '@asyncapi/generator-components';

export default async function({ asyncapi }) {
  return await Models({ asyncapi, language: 'java' });
}