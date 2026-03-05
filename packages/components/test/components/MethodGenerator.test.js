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

  test('resolves docs and logic from framework-level methodConfig', () => {
    const result = render(
      <MethodGenerator
        language="java"
        methodName="testMethod"
        methodConfig={{
          java: {
            quarkus: {
              methodDocs: '// Framework Docs',
              methodLogic: 'System.out.println("Framework Logic");'
            }
          }
        }}
        framework="quarkus"
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

  test('renders with destructuring default values when customMethodConfig is partial', () => {
    const result = render(
      <MethodGenerator
        language="java"
        methodName="testMethod"
        methodParams={['String param1', 'int param2']}
        customMethodConfig={{ 
          returnType: 'public void', 
          closingTag: '}', 
          parameterWrap: false 
        }}
        methodLogic="System.out.println('Testing parameterWrap');"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with framework config falls back to methodDocs prop when frameworkDocs missing', () => {
    const result = render(
      <MethodGenerator
        language="java"
        methodName="testMethod"
        methodDocs="// Prop Docs"
        methodConfig={{
          java: {
            quarkus: {
              methodLogic: 'System.out.println("Logic");'
            }
          }
        }}
        framework="quarkus"
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with framework config falls back to empty string when both docs missing', () => {
    const result = render(
      <MethodGenerator
        language="java"
        methodName="testMethod"
        methodConfig={{
          java: {
            quarkus: {}
          }
        }}
        framework="quarkus"
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with language-level config falls back to methodLogic prop when config.methodLogic missing', () => {
    const result = render(
      <MethodGenerator
        language="python"
        methodName="testMethod"
        methodLogic="print('from prop')"
        methodConfig={{
          python: {
            methodDocs: 'Some docs'
          }
        }}
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with language-level config falls back to empty string when both methodLogic sources missing', () => {
    const result = render(
      <MethodGenerator
        language="python"
        methodName="testMethod"
        methodConfig={{
          python: {
            methodDocs: 'Some docs'
          }
        }}
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with language-level config falls back to methodLogic prop', () => {
    const result = render(
      <MethodGenerator
        language="python"
        methodName="testMethod"
        methodLogic="print('fallback')"
        methodConfig={{
          python: {
            methodDocs: undefined,
            methodLogic: undefined
          }
        }}
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('throws an error when unsupported language is provided', () => {
    expect(() => 
      render(
        <MethodGenerator
          language="cpp"
          methodName="multiLineLogic"
          methodParams={['url']}
          methodLogic={'std::cout << \"Connecting...\" << std::endl;'}
        />
      )).toThrow(/Unsupported language "cpp". Supported languages:/);
  });

  test('throws an error when the indent is negative', () => {
    expect(() => 
      render(
        <MethodGenerator
          language="python"
          methodName="connect"
          methodParams={['self', 'url']}
          methodLogic="print('Connecting...')"
          indent={-2}
        />
      )).toThrow(/\"indent\" must be >= 0. Received: -2/);
  });

  test('throws an error when the newLines is negative', () => {
    expect(() => 
      render(
        <MethodGenerator
          language="python"
          methodName="connect"
          methodParams={['self', 'url']}
          methodLogic="print('Connecting...')"
          newLines={-2}
        />
      )).toThrow(/\"newLines\" must be >= 0. Received: -2/);
  });

  test('throws an error when the methodName is non-empty string', () => {
    expect(() => 
      render(
        <MethodGenerator
          language="python"
          methodName={() => {}}
          methodParams={['self', 'url']}
          methodLogic="print('Connecting...')"
          newLines={-2}
        />
      )).toThrow(/Invalid method name. Expected a non-empty string. Received:/);
  });

  test('throws an error when the methodParams is not an array', () => {
    expect(() => 
      render(
        <MethodGenerator
          language="python"
          methodName="connect"
          methodParams={() => {}}
          methodLogic="print('Connecting...')"
        />
      )).toThrow(/Invalid method parameters. Expected an array. Received:/);
  });
});
