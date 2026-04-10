import { render } from '@asyncapi/generator-react-sdk';
import { CompileOperationSchemas } from '../../components/CompileOperationSchemas';

describe('CompileOperationSchemas', () => {
  it('renders correctly with send operations', async () => {
    const result = await render(
      <CompileOperationSchemas sendOperations={['testOperation']} />
    );

    expect(result).toMatchSnapshot();
  });

  it('renders empty output when no send operations', async () => {
    const result = await render(
      <CompileOperationSchemas sendOperations={[]} />
    );

    expect(result).toBe('');
  });

  it('renders empty output when sendOperations is undefined', async () => {
    const result = await render(
      <CompileOperationSchemas />
    );

    expect(result).toBe('');
  });
  it('renders empty output when sendOperations is null', async () => {
    const result = await render(
      <CompileOperationSchemas sendOperations={null} />
    );

    expect(result).toBe('');
  });
});