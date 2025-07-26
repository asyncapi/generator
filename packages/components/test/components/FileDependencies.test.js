import { render } from '@asyncapi/generator-react-sdk';
import { FileDependencies } from '../../src/index';

describe('Testing of FileDependencies function', () => {
  test('render js websockets file dependecies correctly', () => {
    const result = render(
      <FileDependencies
        language="javascript"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websockets file dependecies correctly', () => {
    const result = render(
      <FileDependencies
        language="python"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websockets file dependecies correctly with additionalDependencies', () => {
    const result = render(
      <FileDependencies
        language="python"
        additionalDependencies={['import os', 'from urllib.parse import urlencode']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart websockets file dependecies correctly', () => {
    const result = render(
      <FileDependencies
        language="dart"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});