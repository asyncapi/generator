import { Text } from '@asyncapi/generator-react-sdk';
import { ConstructorSignature } from './ConstructorSignature';
import { DefaultConstructorSignature } from './DefaultConstructorSignature';
import { QueryParamsVariables } from './QueryParamsVariables';

export function Constructor({clientName, query}) {
  const queryParamsArray = query && Array.from(query.entries());
  if (!queryParamsArray || queryParamsArray.length === 0) {
    return;
  }
  
  return (
    <>
      <DefaultConstructorSignature clientName={clientName} queryParams={queryParamsArray} />
      <ConstructorSignature clientName={clientName} queryParams={queryParamsArray} />
      <Text indent={6} >
        {`${ queryParamsArray && queryParamsArray.length > 0 ? 'params = new HashMap<>(); ' : ''}`
        }
      </Text>
      <QueryParamsVariables queryParams={queryParamsArray} />
      <Text indent={2}>
        {'}\n'}
      </Text>
    </>
  );
}