//TODO: at the moment this template as devDependency set to "@asyncapi/generator-components": "*" in generator root but this is temporary to not complicate one PR too much. We still need to explore concept of having just one dependency in the template pointing to @asyncapi/generator and noting else, and components, react sdks and others should be just part of @asyncapi/generator dependency
import { Models } from '@asyncapi/generator-components';

export default async function({ asyncapi }) {
  return await Models({asyncapi, language: 'csharp'});
}