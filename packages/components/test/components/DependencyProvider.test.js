import { render } from '@asyncapi/generator-react-sdk';
import { DependencyProvider } from '../../src/index';

describe('Testing of DependencyProvider function', () => {
  test('render js websockets file dependecies correctly', () => {
    const result = render(
      <DependencyProvider
        language="javascript"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websockets file dependecies correctly', () => {
    const result = render(
      <DependencyProvider
        language="python"
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

  test('render dart websockets file dependecies correctly', () => {
    const result = render(
      <DependencyProvider
        language="dart"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render java quarkus client websockets file dependencies correctly', () => {
    const result = render(
      <DependencyProvider
        language="java"
        framework="quarkus"
        role="client"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render java quarkus connector websockets file dependencies correctly', () => {
    const result = render(
      <DependencyProvider
        language="java"
        framework="quarkus"
        role="connector"
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

  test('render java without framework returns empty dependencies', () => {
    const result = render(
      <DependencyProvider
        language="java"
      />
    );
    const actual = result.trim();
    expect(actual).toBe('');
  });

  test('render java with invalid framework returns empty dependencies', () => {
    const result = render(
      <DependencyProvider
        language="java"
        framework="spring"
        role="client"
      />
    );
    const actual = result.trim();
    expect(actual).toBe('');
  });

  test('render java quarkus with invalid role returns empty dependencies', () => {
    const result = render(
      <DependencyProvider
        language="java"
        framework="quarkus"
        role="invalid"
      />
    );
    const actual = result.trim();
    expect(actual).toBe('');
  });
});