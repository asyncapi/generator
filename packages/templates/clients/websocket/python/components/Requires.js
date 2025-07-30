import { DependencyProvider } from '@asyncapi/generator-components';

export function Requires({ query }) {
  const additionalDependencies = [];
  if (query) {
    additionalDependencies.push('import os');
    additionalDependencies.push('from urllib.parse import urlencode');
  }
  return (
    <DependencyProvider
      language="python"
      additionalDependencies={additionalDependencies}
    />
  );
}