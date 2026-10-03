import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders route matching, connection handling, and message dispatching methods.
 *
 * @returns {JSX.Element} Route handlers code component.
 */
export function RouteHandlers() {
  return (
    <Text indent={2} newLines={2}>
      {`/**
   * Register an inbound message handler for a specific operation.
   *
   * @param {string} operationId ID of the operation defined in the AsyncAPI document.
   * @param {Function} handler Callback invoked when a validated message is received.
   */
  registerMessageHandler(operationId, handler) {
    if (typeof handler !== 'function') {
      throw new Error(\`Handler for operation "\${operationId}" must be a function.\`);
    }
    this.messageHandlers[operationId] = handler;
  }

  /**
   * Register a global error handler for validation failures or connection errors.
   *
   * @param {Function} handler Callback receiving (error, context).
   */
  registerErrorHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Error handler must be a function.');
    }
    this.errorHandlers.push(handler);
  }

  /**
   * Register a connection handler invoked whenever a client connects to any channel.
   *
   * @param {Function} handler Callback receiving (ws, req, channelAddress).
   */
  registerConnectionHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Connection handler must be a function.');
    }
    this.connectionHandlers.push(handler);
  }

  /**
   * Matches an incoming HTTP request pathname against configured AsyncAPI channel addresses.
   *
   * @param {string} pathname Incoming URL path.
   * @returns {string|null} Matching channel address or null if none matched.
   */
  matchChannel(pathname) {
    const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    for (const channelAddress of Object.keys(this.channels)) {
      const channelNorm = channelAddress.length > 1 && channelAddress.endsWith('/') ? channelAddress.slice(0, -1) : channelAddress;
      if (normalized === channelNorm) {
        return channelAddress;
      }
      const regexParts = channelNorm.split(/(\\{[^}]+\\})/g).map((part) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          return '([^/]+)';
        }
        return part.replace(/[-/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');
      });
      const paramPattern = new RegExp('^' + regexParts.join('') + '$');
      if (paramPattern.test(normalized)) {
        return channelAddress;
      }
    }
    return null;
  }

  /**
   * Handles an established WebSocket connection for a given channel.
   *
   * @param {WebSocket} ws Connected WebSocket instance.
   * @param {http.IncomingMessage} req Incoming HTTP upgrade request.
   * @param {string} channelAddress Matched channel address.
   */
  handleConnection(ws, req, channelAddress) {
    const channel = this.channels[channelAddress];
    if (!channel) {
      ws.close(1008, 'Channel not found');
      return;
    }

    channel.clients.add(ws);

    for (const handler of this.connectionHandlers) {
      try {
        handler(ws, req, channelAddress);
      } catch (err) {
        this.handleError(err, { ws, req, channel: channelAddress, phase: 'connection' });
      }
    }

    ws.on('message', async (data) => {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(data.toString());
      } catch {
        parsedPayload = data.toString();
      }

      const receiveOps = channel.operations.receive || [];
      if (receiveOps.length === 0) {
        if (this.messageHandlers.default) {
          try {
            await this.messageHandlers.default({ message: parsedPayload, raw: data, ws, req, channel: channelAddress });
          } catch (err) {
            this.handleError(err, { ws, req, channel: channelAddress, phase: 'handler' });
          }
        }
        return;
      }

      for (const opId of receiveOps) {
        const validators = this.compiledSchemas[opId];
        let isValid = true;
        let validationErrors = null;

        if (validators && validators.length > 0) {
          let passed = false;
          for (const validator of validators) {
            const result = validateMessage(validator, parsedPayload);
            if (result.isValid) {
              passed = true;
              break;
            } else {
              validationErrors = result.validationErrors;
            }
          }
          isValid = passed;
        }

        if (!isValid) {
          const validationError = new Error(\`Validation failed for operation "\${opId}"\`);
          validationError.errors = validationErrors;
          this.handleError(validationError, { ws, req, channel: channelAddress, operationId: opId, payload: parsedPayload });
          continue;
        }

        const handler = this.messageHandlers[opId];
        if (handler) {
          try {
            await handler({ message: parsedPayload, raw: data, ws, req, channel: channelAddress, operationId: opId });
          } catch (err) {
            this.handleError(err, { ws, req, channel: channelAddress, operationId: opId, phase: 'handler' });
          }
        }
      }
    });

    ws.on('close', () => {
      channel.clients.delete(ws);
    });

    ws.on('error', (err) => {
      this.handleError(err, { ws, req, channel: channelAddress, phase: 'socket' });
      channel.clients.delete(ws);
    });
  }

  /**
   * Internal error dispatcher.
   *
   * @param {Error} error Error instance.
   * @param {Object} context Error context details.
   */
  handleError(error, context) {
    if (this.errorHandlers.length > 0) {
      for (const handler of this.errorHandlers) {
        try {
          handler(error, context);
        } catch (handlerErr) {
          console.error('[WebSocketServer] Error in registered error handler:', handlerErr);
        }
      }
    } else {
      console.error('[WebSocketServer] Error:', error.message, context);
    }
  }`}
    </Text>
  );
}
