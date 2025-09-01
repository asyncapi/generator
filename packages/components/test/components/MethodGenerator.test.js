import { render } from '@asyncapi/generator-react-sdk';
import { MethodGenerator } from '../../src/index';

describe('MethodGenerator', () => {
  test('renders default python method', () => {
    const result = render(
      <MethodGenerator
        language="python"
        methodName="connect"
        methodParams={['self', 'url']}
        methodLogic="print('Connecting...')"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders default javascript method', () => {
    const result = render(
      <MethodGenerator
        language="javascript"
        methodName="connect"
        methodParams={['url']}
        methodLogic="console.log('Connecting...');"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders default dart method', () => {
    const result = render(
      <MethodGenerator
        language="dart"
        methodName="connect"
        methodParams={['String url']}
        methodLogic="print('Connecting...');"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with customMethodConfig override', () => {
    const result = render(
      <MethodGenerator
        language="javascript"
        customMethodConfig={{ returnType: 'async function', openingTag: '{', closingTag: '}', indentSize: 4 }}
        methodName="fetchData"
        methodLogic="await getData();"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with methodDocs', () => {
    const result = render(
      <MethodGenerator
        language="python"
        methodName="processData"
        methodDocs='"""Process the input data."""'
        methodLogic="pass"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with preExecutionCode and postExecutionCode', () => {
    const result = render(
      <MethodGenerator
        language="python"
        methodName="registerHandler"
        methodParams={['self', 'handler']}
        preExecutionCode="# Before handler registration"
        methodLogic="self.handlers.append(handler)"
        postExecutionCode="# After handler registration"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with custom indentation', () => {
    const result = render(
      <MethodGenerator
        language="javascript"
        methodName="customIndent"
        methodLogic="console.log('Indented');"
        customMethodConfig={{ openingTag: '{', closingTag: '}', indentSize: 6 }}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders method with no logic', () => {
    const result = render(
      <MethodGenerator
        language="dart"
        methodName="emptyMethod"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders method with multiline logic', () => {
    const result = render(
      <MethodGenerator
        language="javascript"
        methodName="multiLineLogic"
        methodLogic={'console.log(\'Line 1\');\nconsole.log(\'Line 2\');'}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with parameterWrap false', () => {
    const result = render(
      <MethodGenerator
        language="java"
        methodName="testMethod"
        methodParams={['String param1', 'int param2']}
        customMethodConfig={{ 
          returnType: 'public void', 
          openingTag: '{', 
          closingTag: '}', 
          indentSize: 4, 
          parameterWrap: false 
        }}
        methodLogic="System.out.println('Testing parameterWrap');"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
