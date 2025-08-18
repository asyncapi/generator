import { render } from '@asyncapi/generator-react-sdk';
import { RegisterMessageHandler } from '../../src/index';

describe('Testing of RegisterMessageHandler function', () => {
  test('render javascript websocket register message handler method', () => {
    const result = render(
      <RegisterMessageHandler language='javascript' />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websocket register message handler method', () => {
    const result = render(
      <RegisterMessageHandler 
        language='python'
        methodParams={['self', 'handler']}
        preExecutionCode='"""Register a callable as a message handler."""'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart websocket register message handler method', () => {
    const result = render(
      <RegisterMessageHandler 
        language='dart'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render javascript method with custom name', () => {
    const result = render(
      <RegisterMessageHandler 
        language='javascript'
        methodName='addHandler'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart method with parameters', () => {
    const result = render(
      <RegisterMessageHandler 
        language='dart'
        methodParams={['handler']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python with pre and post execution code', () => {
    const result = render(
      <RegisterMessageHandler 
        language='python'
        methodParams={['self', 'handler']}
        preExecutionCode='# Pre-register operations'
        postExecutionCode='# Post-register cleanup'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart with all the props', () => {
    const result = render(
      <RegisterMessageHandler 
        language='dart'
        methodName='bindHandler'
        methodParams={['handler']}
        preExecutionCode='// Preparing to bind handler'
        postExecutionCode='// Handler bound successfully'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
