## Kafka Client Test Project

This `test` directory contains two types of testing for the Kafka client template:
- [Acceptance Testing](#acceptance-testing)
- [Integration Testing](#integration-testing)

---

## Acceptance Testing

The acceptance tests verify that the generated Kafka client can connect, produce messages, and consume messages over a live TCP connection against a real mock broker (Microcks + Redpanda) inside Docker/Podman containers.

### Test Architecture & Validation
1. **Producer Contract Validation**: Triggers Microcks `ASYNC_API_SCHEMA` test runner to validate that messages emitted by `CostingResponseProducer` conform to the imported AsyncAPI contract.
2. **Consumer Message Handling**: Emits test messages across topics on the Redpanda broker and verifies that `CostingRequestConsumer` receives, deserializes, and processes them.
3. **Broker Integration**: Emits live messages across topics on the Redpanda broker.
4. **Performance**: Measures ~11s execution with a warm Maven `.m2` cache (`maven-cache` volume). Initial cold runs on fresh runners will take longer while downloading Quarkus dependencies.

### Prerequisites

Install [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/docs/installation).

### How to Run Acceptance Tests Locally

Acceptance tests share the unified Microcks infrastructure located in `packages/templates/clients/websocket/test/microcks-setup`.

1. **Generate the Kafka client** (runs snapshot tests and outputs the generated Quarkus client):
   ```bash
   npm run test --prefix packages/templates/clients/kafka/test/integration-test
   ```

2. **Start the Microcks Infrastructure** (spins up Redpanda Kafka broker, Mongo, Microcks, and Async Minion):
   ```bash
   cd packages/templates/clients/websocket/test/microcks-setup
   docker compose -f microcks-podman.yml --profile infra up -d
   ```
   *(Or with Podman: `podman compose -f microcks-podman.yml --profile infra up -d`)*

3. **Verify services are healthy**:
   ```bash
   docker compose -f microcks-podman.yml ps
   ```
   *(Or if using Podman: `bash ./checkMicrocksReady.sh`)*

4. **Execute the Kafka Acceptance Test**:
   ```bash
   docker compose -f microcks-podman.yml --profile test-kafka up --abort-on-container-exit
   ```

5. **Cleanup**:
   ```bash
   docker compose -f microcks-podman.yml down --remove-orphans
   ```

---

## Integration Testing

Integration tests verify code generation and output file structure against saved snapshots.

### Running Integration Tests

From `packages/templates/clients/kafka/test/integration-test`:
```bash
npm run test           # Run integration snapshot tests
npm run test:update    # Update snapshots if template changed intentionally
```
