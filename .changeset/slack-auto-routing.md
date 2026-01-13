---
"@asyncapi/generator-components": minor
"@asyncapi/generator-helpers": minor
---

Enhanced WebSocket client generation with operation-based message routing:

- **New Component**: `OperationsDiscriminators` - Generates language-specific initialization code for receive operation discriminators, enabling automatic message routing based on message type
- **Updated Component**: `OnMessage` (Python) - Added discriminator-based routing logic that automatically dispatches messages to operation-specific handlers before falling back to generic handlers
- **New Helpers**: `getMessageDiscriminatorData` and `getMessageDiscriminatorsFromOperations` - Extract discriminator metadata from AsyncAPI messages to enable operation-specific message routing