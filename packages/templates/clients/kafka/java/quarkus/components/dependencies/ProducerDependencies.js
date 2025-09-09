import { DependencyProvider } from '@asyncapi/generator-components';

export function ProducerDependencies() {
  return (
    <DependencyProvider
      language="java"
      framework="quarkus"
      role="producer"
    />
  );
}    