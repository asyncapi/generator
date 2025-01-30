import { Text } from '@asyncapi/generator-react-sdk';

export function HandlerRegistration({ handlerType }) {
  return (
    <Text>
      {`
  register${handlerType}Handler(handler) {
    if (typeof handler === 'function') {
      this.${handlerType.toLowerCase()}Handlers.push(handler);
    } else {
      console.warn('${handlerType} handler must be a function');
    }
  }`}
    </Text>
  );
}