import { render } from '@asyncapi/generator-react-sdk';
import { DependencyProvider } from '../../src/index';

describe('Testing of DependencyProvider function', () => {
  const languages = ['javascript', 'python', 'dart'];
  it.each(languages)('render %s websockets file dependencies correctly', (language) => {
    const result = render(
      <DependencyProvider
        language={language}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websockets file dependecies correctly with additionalDependencies', () => {
    const result = render(
      <DependencyProvider
        language="python"
        additionalDependencies={['import os', 'from urllib.parse import urlencode']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render js websockets file dependecies correctly with additionalDependencies', () => {
    const result = render(
      <DependencyProvider
        language="javascript"
        additionalDependencies={['const WebSocket = require(\'ws\');', 'const fetch = require(\'node-fetch\');']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart websockets file dependecies correctly with additionalDependencies', () => {
    const result = render(
      <DependencyProvider
        language="dart"
        additionalDependencies={['import \"package:web_socket_channel/web_socket_channel.dart\";', 'import \"dart:convert\";']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  const javaRoles = ['client', 'connector', 'producer', 'consumer', 'kafkaEndpoint'];
  it.each(javaRoles)('render java quarkus %s websockets file dependencies correctly', (role) => {
    const result = render(
      <DependencyProvider
        language="java"
        framework="quarkus"
        role={role}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render java quarkus client dependencies with additionalDependencies', () => {
    const result = render(
      <DependencyProvider
        language="java"
        framework="quarkus"
        role="client"
        additionalDependencies={['import java.util.concurrent.CompletableFuture;', 'import java.time.Duration;']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  
  test('throws error when unsupported language is provided', () => {
    expect(() => {
      render(
        <DependencyProvider language="ruby" />
      );
    }).toThrow(/Unsupported language "ruby". Supported languages:/);
  });

  test('throws error when language is not provided', () => {
    expect(() => {
      render(
        <DependencyProvider />
      );
    }).toThrow(/Language is required. Supported languages:/);
  });

  test('throws error when unsupported framwork is provided', () => {
    expect(() => {
      render(
        <DependencyProvider
          language="java"
          framework="spring"
          role="client"
        />
      );
    }).toThrow(/Unsupported framework "spring" for language "java". Supported frameworks:/);
  });

  test('throws error when framework is not provided', () => {
    expect(() => {
      render(
        <DependencyProvider 
          language='java'
        />
      );
    }).toThrow(/Framework is required for language "java". Supported frameworks:/);
  });

  test('throws error when role is invalid', () => {
    expect(() => {
      render(
        <DependencyProvider
          language="java"
          framework="quarkus"
          role="invalid"
        />
      );
    }).toThrow(/Unsupported role "invalid". Supported roles:/);
  });

  test('render java quarkus connector as empty when role is not provided', () => {
    const result = render(
      <DependencyProvider
        language="java"
        framework='quarkus'
      />
    );
    const actual = result.trim();
    expect(actual).toBe('');
  });
});