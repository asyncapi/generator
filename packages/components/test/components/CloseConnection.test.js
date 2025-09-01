import { render } from '@asyncapi/generator-react-sdk';
import { CloseConnection } from '../../src/index';

describe('Testing of CloseConnection function', () => {
  test('render javascript websocket close connection method', () => {
    const result = render(
      <CloseConnection language='javascript' />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websocket close connection method', () => {
    const result = render(
      <CloseConnection 
        language='python'
        methodParams={['self']}
        preExecutionCode='"""Cleanly close the WebSocket connection."""'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart websocket close connection method', () => {
    const result = render(
      <CloseConnection 
        language='dart'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render javascript method with custom name', () => {
    const result = render(
      <CloseConnection 
        language='javascript'
        methodName='disconnect'
      />
    );
    expect(result).toContain('disconnect() {');
    expect(result).toMatchSnapshot();
  });

  test('render dart method with parameters', () => {
    const result = render(
      <CloseConnection 
        language='dart'
        methodParams={['reason', 'code']}
      />
    );
    expect(result).toMatchSnapshot();
  });

  test('render python with pre and post execution code', () => {
    const result = render(
      <CloseConnection 
        language='python'
        preExecutionCode='# Pre-close operations'
        postExecutionCode='# Post-close cleanup'
      />
    );
    expect(result).toMatchSnapshot();
  });

  test('render dart with all the props', () => {
    const result = render(
      <CloseConnection 
        language='dart'
        methodName='terminateConnection'
        methodParams={['reason']}
        preExecutionCode='// About to terminate connection'
        postExecutionCode='// Connection terminated'
      />
    );
    expect(result).toMatchSnapshot();
  });
  
  test('render java websocket close connection method', () => {
    const result = render(
      <CloseConnection 
        language='java'
        framework='quarkus'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render java method with zero indent', () => {
    const result = render(
      <CloseConnection 
        language='java'
        framework='quarkus'
        indent={0}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});