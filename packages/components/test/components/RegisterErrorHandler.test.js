import { render } from '@asyncapi/generator-react-sdk';
import { RegisterErrorHandler } from '../../src/index';

describe('Testing of RegisterErrorHandler function', () => {
  test('render javascript websocket register error handler method', () => {
    const result = render(
      <RegisterErrorHandler language='javascript' methodParams={['handler']} />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websocket register error handler method', () => {
    const result = render(
      <RegisterErrorHandler 
        language='python'
        methodParams={['self', 'handler']}
        preExecutionCode='"""Register a callable as a error handler."""'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart websocket register error handler method', () => {
    const result = render(
      <RegisterErrorHandler 
        language='dart'
        methodParams={['void Function(Object) handler']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render javascript method with custom name', () => {
    const result = render(
      <RegisterErrorHandler 
        language='javascript'
        methodName='addHandler'
        methodParams={['handler']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart method with parameters', () => {
    const result = render(
      <RegisterErrorHandler 
        language='dart'
        methodParams={['handler']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python with pre and post execution code', () => {
    const result = render(
      <RegisterErrorHandler 
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
    const customMethodConfig = {
      returnType: 'int', 
      openingTag: '{', 
      closingTag: '}', 
      indentSize: 2
    };
    const result = render(
      <RegisterErrorHandler 
        language='dart'
        methodName='bindHandler'
        methodParams={['handler']}
        preExecutionCode='// Preparing to bind handler'
        postExecutionCode='// Handler bound successfully'
        customMethodConfig={customMethodConfig}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
