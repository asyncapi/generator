import { render } from '@asyncapi/generator-react-sdk';
import MessageExamples from '../../components/MessageExamples';
import { getOperationMessages, getMessageExamples } from '@asyncapi/generator-helpers';

jest.mock('@asyncapi/generator-helpers', () => ({
  getOperationMessages: jest.fn(),
  getMessageExamples: jest.fn(),
}));

describe('Test MessageExamples Component', () => {
  const mockOperation = { id: () => { return 'sendMessage'; } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing if operation has no messages', () => {
    getOperationMessages.mockReturnValue(null);

    const result = render(<MessageExamples operation={mockOperation} />);
    expect(result.trim()).toBe('');
  });

  test('renders nothing if messages have no examples', () => {
    getOperationMessages.mockReturnValue([{}]);
    getMessageExamples.mockReturnValue(null);

    const result = render(<MessageExamples operation={mockOperation} />);
    expect(result.trim()).toBe('');
  });

  test('renders only one example', () => {
    getOperationMessages.mockReturnValue([{}]);
    getMessageExamples.mockReturnValue([
      { payload: () => { return { test: 'test text' }; } },
    ]);

    const result = render(<MessageExamples operation={mockOperation} />);
    expect(result).toContain('client.sendMessage');
    expect(result).toContain('"test": "test text"');
  });

  test('renders multiple examples from multiple messages', () => {
    getOperationMessages.mockReturnValue([
      {},
      {},
    ]);
    getMessageExamples
      .mockReturnValueOnce([
        { payload: () => { return { test: 'test text' }; } },
        { payload: () => { return 'test string'; } },
      ])
      .mockReturnValueOnce([
        { payload: () => { return 123; } },
      ]);

    const result = render(<MessageExamples operation={mockOperation} />);
    expect(result).toContain('"test": "test text"');
    expect(result).toContain('test string');
    expect(result).toContain('123');
  });
  
  test('renders multiple messages, some with examples and some without examples', () => {
    getOperationMessages.mockReturnValue([
      {},
      {},
    ]);
    getMessageExamples
      .mockReturnValueOnce([
        { payload: () => { return 'test'; } },
        { payload: () => { return 123; } },
      ])
      .mockReturnValueOnce(null);
    const result = render(<MessageExamples operation={mockOperation} />);
    expect(result).toContain('test');
    expect(result).toContain('123');
  });
});
