import { CompileOperationSchemas } from '../components/CompileOperationSchemas';
import { Text } from '@asyncapi/generator-react-sdk';

describe('CompileOperationSchemas', () => {
  it('should return null when sendOperations is undefined', () => {
    const result = CompileOperationSchemas({});
    expect(result).toBeNull();
  });

  it('should return null when sendOperations is empty', () => {
    const result = CompileOperationSchemas({ sendOperations: [] });
    expect(result).toBeNull();
  });

  it('should render Text component when sendOperations exist', () => {
    const result = CompileOperationSchemas({ sendOperations: ['op1'] });

    expect(result).not.toBeNull();
    expect(result.props.children.type).toBe(Text);
  });

  it('should contain compileOperationSchemas function in output', () => {
    const result = CompileOperationSchemas({ sendOperations: ['op1'] });

    const textContent = result.props.children.props.children;

    expect(textContent).toContain('async compileOperationSchemas()');
    expect(textContent).toContain('this.schemasCompiled');
    expect(textContent).toContain('compileSchemasByOperationId');
  });
});