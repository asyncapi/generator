import { DependencyProvider } from '@asyncapi/generator-components';

export function ClientDependencies({ queryParams }) {
  const additionalDependencies = [];
  if (queryParams) {
    additionalDependencies.push('import java.util.HashMap;');
  }
  return (
    <DependencyProvider
      language="java"
      framework="quarkus"
      role="client"
      additionalDependencies={additionalDependencies}
    />
  );
}

