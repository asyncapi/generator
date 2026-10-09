/* eslint-disable sonarjs/no-duplicate-string */
import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedFramework, unsupportedLanguage, unsupportedRole } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'dart' | 'java';

interface FlatDependencyConfig {
  dependencies: string[];
}

interface FrameworkRoleConfig {
  [role: string]: FlatDependencyConfig;
}

type LanguageDependencyConfig = FlatDependencyConfig | Record<string, FlatDependencyConfig | FrameworkRoleConfig>;

/**
 * Mapping of supported programming languages to their default dependency import statements.
 */
const dependenciesConfig: Record<string, LanguageDependencyConfig> = {
  python: {
    dependencies: ['import json', 'import certifi', 'import threading', 'import websocket']
  },
  javascript: {
    dependencies: ['const WebSocket = require(\'ws\');', 'const { compileSchemasByOperationId, validateMessage } = require(\'@asyncapi/keeper\');']
  },
  dart: {
    dependencies: ['import \'dart:convert\';', 'import \'package:web_socket_channel/web_socket_channel.dart\';']
  },
  java: {
    quarkus: {
      client: {
        dependencies: ['package com.asyncapi;\n','import io.quarkus.websockets.next.WebSocketClient;',
          'import io.quarkus.websockets.next.WebSocketClientConnection;','import io.quarkus.websockets.next.OnOpen;',
          'import io.quarkus.websockets.next.OnClose;','import io.quarkus.websockets.next.OnError;',
          'import io.quarkus.websockets.next.OnTextMessage;','import io.quarkus.websockets.next.CloseReason;',
          'import jakarta.inject.Inject;','import org.jboss.logging.Logger;']
      },
      connector: {
        dependencies: ['package com.asyncapi;\n','import io.quarkus.websockets.next.WebSocketConnector;',
          'import io.quarkus.websockets.next.WebSocketClientConnection;','import jakarta.inject.Inject;',
          'import jakarta.inject.Singleton;','import jakarta.annotation.PostConstruct;',
          'import io.quarkus.logging.Log;','import io.quarkus.runtime.Startup;']
      },
      producer: {
        dependencies: ['package com.asyncapi;\n','import io.smallrye.reactive.messaging.kafka.KafkaRecord;',
          'import org.eclipse.microprofile.reactive.messaging.Channel;','import org.eclipse.microprofile.reactive.messaging.Emitter;',
          'import org.jboss.logging.Logger;','import org.eclipse.microprofile.reactive.messaging.Message;',
          'import jakarta.enterprise.context.ApplicationScoped;','import jakarta.inject.Inject;','import java.util.UUID;']
      },
      consumer: {
        dependencies: ['package com.asyncapi;\n','import io.smallrye.reactive.messaging.kafka.Record;',
          'import org.eclipse.microprofile.reactive.messaging.Incoming;','import org.jboss.logging.Logger;',
          'import jakarta.enterprise.context.ApplicationScoped;']
      },
      kafkaEndpoint: {
        dependencies: ['package com.asyncapi;\n','import jakarta.inject.Inject;','import jakarta.ws.rs.*;','import jakarta.ws.rs.core.MediaType;',
          'import jakarta.ws.rs.core.Response;','import org.eclipse.microprofile.reactive.messaging.Channel;','import org.eclipse.microprofile.reactive.messaging.Emitter;',
          'import org.eclipse.microprofile.reactive.messaging.Incoming;','import org.eclipse.microprofile.reactive.messaging.Message;',
          'import io.smallrye.reactive.messaging.kafka.Record;','import io.smallrye.reactive.messaging.kafka.KafkaRecord;']
      }
    }
  }
};

/**
 * Helper function to resolve dependencies for framework and role configurations.
 *
 * @private
 * @param frameworkConfig - The framework configuration object.
 * @param role - The role (e.g., 'client', 'connector' for Java).
 * @returns Array of dependency strings or empty array.
 * @throws If the role is not supported by the framework configuration.
 */
function resolveFrameworkDependencies(frameworkConfig: Record<string, unknown>, role: string): string[] {
  if (!role) {
    return (frameworkConfig as FlatDependencyConfig).dependencies || [];
  }

  const supportedRoles = Object.keys(frameworkConfig);
  if (!supportedRoles.includes(role)) {
    throw unsupportedRole(role, supportedRoles);
  }

  const roleConfig = frameworkConfig[role] as FlatDependencyConfig | undefined;
  return roleConfig?.dependencies || (frameworkConfig as FlatDependencyConfig).dependencies || [];
}

/**
 * Helper function to resolve dependencies based on language, framework, and role.
 *
 * @private
 * @param language - The programming language.
 * @param framework - The framework (e.g., 'quarkus' for Java).
 * @param role - The role (e.g., 'client', 'connector' for Java).
 * @returns Array of dependency strings.
 * @throws When the specified language is not supported.
 * @throws When the specified framework is not supported for the given language.
 */
function resolveDependencies(language: string, framework: string, role: string): string[] {
  const config = dependenciesConfig[language];
  const supportedLanguages = Object.keys(dependenciesConfig);
  
  if (!config) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  // Handle flat structure (python, javascript, dart)
  if ((config as FlatDependencyConfig).dependencies) {
    return (config as FlatDependencyConfig).dependencies;
  }
  
  // Handle nested structure (java with quarkus framework and roles)
  const supportedFrameworks = Object.keys(config);
  
  if (!(config as Record<string, unknown>)[framework]) {
    throw unsupportedFramework(language, framework, supportedFrameworks);
  }
    
  return resolveFrameworkDependencies((config as Record<string, unknown>)[framework] as Record<string, unknown>, role);
}

interface DependencyProviderProps {
  /** The programming language for which to render dependency statements. */
  language: string;
  /** The framework (e.g., 'quarkus' for Java). */
  framework?: string;
  /** The role (e.g., 'client', 'connector' for Java). */
  role?: string;
  /** Optional additional dependencies to include. */
  additionalDependencies?: string[];
}

/**
 * Renders the top-of-file dependency statements for the selected programming language.
 *
 * @param props - Component props.
 * @returns A Text component that contains list of import/require statements.
 *
 * @example
 * import { DependencyProvider } from "@asyncapi/generator-components";
 * const language = "java";
 * const framework = "quarkus";
 * const role = "client";
 * const additionalDependencies = ["import java.util.concurrent.CompletableFuture;", "import java.time.Duration;"];
 *
 * function renderDependencyProvider() {
 *   return (
 *     <DependencyProvider
 *        language={language}
 *        framework={framework}
 *        role={role}
 *        additionalDependencies={additionalDependencies}
 *     />
 *   )
 * }
 * renderDependencyProvider();
 */
export function DependencyProvider({ language, framework = '', role = '', additionalDependencies = [] }: DependencyProviderProps): JSX.Element {
  const dependencies = resolveDependencies(language, framework, role);

  const allDependencies = [...dependencies, ...additionalDependencies];
    
  return (
    <Text>
      {allDependencies.join('\n')}
    </Text>
  );
}