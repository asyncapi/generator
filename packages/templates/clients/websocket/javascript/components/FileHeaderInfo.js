import { Text } from '@asyncapi/generator-react-sdk';

export function FileHeaderInfo({ info, server }) {
  return (
    <Text>
      <Text>
        {'//////////////////////////////////////////////////////////////////////'}
      </Text>
      
      <Text>
        {'//'}
      </Text>

      <Text>
        {'//'} {info.title()} - {info.version()}
      </Text>

      <Text>
        {'//'} Protocol: {server.protocol()}
      </Text>

      <Text>
        {'//'} Host: {server.host()}
      </Text>

      {server.hasPathname() && (
        <Text>
          {'//'} Path: {server.pathname()}
        </Text>
      )}

      <Text>
        {'//'}
      </Text>

      <Text>
        {'//////////////////////////////////////////////////////////////////////'}
      </Text>
    </Text>
  );
}