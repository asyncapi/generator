## Testing Clients with Microcks

### Concept

Microcks is a tool for mocking. To test our generated clients, we need to mock the server. In other words, if we want to check if the generated client for Postman works well, we need to mock the server that the client will communicate with while testing.

### Using Microcks locally

> This instruction assumes you are located in directory where `microcks-podman.yml` is located

#### Start Microcks

1. Install [Podman](https://podman.io/docs/installation). 
    > Microcks needs some services running to simulate the infrastructure and this requires multiple resources. Docker is not the best solution for this, thus better use Podman that manages resources better.

1. Install [docker-compose](https://docs.docker.com/compose/install/) that `podman compose` uses.

1. Create `microcks-data` directory where mongo will keep data after you start it with podman: `mkdir microcks-data`.

1. Start Microcks infrastructure: `podman compose -f microcks-podman.yml up -d`.

1. Check with `podman ps` command if all services are running. It may take few minutes to start all containers. You can also run special script that will confirm services are ready: `bash checkMicrocksReady.sh`.

1. Access Microcks UI with `open http://localhost:8080`.

#### Load AsyncAPI documents

To test clients, we need to mock the server. Remember to load AsyncAPI documents that represent the server.

1. Install [Microcks CLI](https://microcks.io/documentation/guides/automation/cli/)

1. Import AsyncAPI document
    ```bash
    microcks-cli import __fixtures__/asyncapi-hoppscotch-server.yml \
      --microcksURL=http://localhost:8080/api/ \
      --keycloakClientId=microcks-serviceaccount \
      --keycloakClientSecret="ab54d329-e435-41ae-a900-ec6b3fe15c54"

1. See the mock in the Microcks UI with `open http://localhost:8080/#/services`

#### Invoke Mocks tests

Start simple testing of the mock to see if it was created properly. Tests should turn green.

You should run tests only on one operation at a time.

```bash
# the higher timeout the more test samples will run
curl -X POST http://localhost:8080/api/tests \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "Hoppscotch WebSocket Server:1.0.0",
    "testEndpoint": "ws://localhost:8081/api/ws/Hoppscotch+WebSocket+Server/1.0.0/sendTimeStampMessage",
    "runnerType": "ASYNC_API_SCHEMA",
    "timeout": 30000,
    "filteredOperations": ["SEND sendTimeStampMessage"]
  }'
```

You can also check the status of tests in the Microcks UI.


### Cleanup

Run `podman compose -f microcks-podman.yml down --remove-orphans` to clean everything.