import { render } from '@asyncapi/generator-react-sdk';
import { DependencyProvider } from '../../src/index';

describe('Testing of FileDependencies function', () => {
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
});