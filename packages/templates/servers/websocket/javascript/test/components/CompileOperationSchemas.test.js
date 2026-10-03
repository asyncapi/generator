import { render } from '@asyncapi/generator-react-sdk';
import { CompileOperationSchemas } from '../../components/CompileOperationSchemas';

describe('CompileOperationSchemas component', () => {
  it('renders compileOperationSchemas method correctly', async () => {
    const result = await render(
      <CompileOperationSchemas allOps={['sendTimeStampMessage', 'handleEchoMessage']} />
    );

    expect(result).toContain('async compileOperationSchemas()');
    expect(result).toContain('compileSchemasByOperationId');
    expect(result).toContain('this.schemasCompiled = true');
  });

  it('renders correctly with empty operations', async () => {
    const result = await render(
      <CompileOperationSchemas allOps={[]} />
    );

    expect(result).toContain('async compileOperationSchemas()');
  });
});
