import { DependencyProvider } from '@asyncapi/generator-components';

export function ConnectorDependencies({ queryParams }) {
  const additionalDependencies = [];
  if (queryParams && queryParams.length > 0) {
    additionalDependencies.push('import org.eclipse.microprofile.config.inject.ConfigProperty;');
    additionalDependencies.push('import java.net.URI;');
    additionalDependencies.push('import java.net.URLEncoder;');
    additionalDependencies.push('import java.nio.charset.StandardCharsets;');
  }

  return (
    <DependencyProvider
      language="java"
      framework="quarkus"
      role="connector"
      additionalDependencies={additionalDependencies}
    />
  );
}
