import { Models } from '@asyncapi/generator-components';
import { JavaModelsPresets } from '@asyncapi/generator-helpers';

export default async function({ asyncapi }) {
  return await Models({ asyncapi, language: 'java', format: 'toPascalCase', presets: JavaModelsPresets });
}