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

/**
 * {`
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

import jakarta.enterprise.context.ApplicationScoped;`}
 */