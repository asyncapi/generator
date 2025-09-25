import { DependencyProvider } from '@asyncapi/generator-components';

export function ConsumerDependencies() {
  return (
    <DependencyProvider
      language="java"
      framework="quarkus"
      role="consumer"
    />
  );
}   