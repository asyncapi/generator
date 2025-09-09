import { DependencyProvider } from '@asyncapi/generator-components';

export function EndpointDependencies() {
  return (
    <DependencyProvider
      language="java"
      framework="quarkus"
      role="kafkaEndpoint"
    />
  );
}   
