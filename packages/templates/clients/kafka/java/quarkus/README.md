## Java Quarkus Kafka Client

1. Clone the generator project and run `npm install`
2. Navigate to `packages/templates/clients/kafka/test/integration-test` and run the tests with `npm run test` to generate WebSocket clients
3. Navigate to `packages/templates/clients/kafka/java/quarkus`
4. Install dependencies with `npm install` 
5. Navigate to the generated clients in the folder with `cd test/temp/snapshotTestResult`
6. Pick a generated client inside one of the folders and navigate to source code with `cd` ex: `cd /client_adeo`
7. Navigate to the docker folder with `cd src/main/docker` and find the `docker-compose.yaml` file. 
8. Start the kafka broker by runnning `docker-compose up -d`. 
9. In another terminal, run the templated client with `mvn quarkus:dev`. You will see the logged events in this one. 
10. In another terminal, send request the REST endpoint to simulate event production. Request example:

    Linux/MacOs
    ```bash
    curl --header "Content-Type: application/json" --request POST --data '{""value"": ""thirteenpencils""}' http://localhost:8080/
    ```

    Windows
    ```powershell
    curl.exe --header "Content-Type: application/json" --request POST --data '{""value"": ""RANDOM_VALUE""}' http://localhost:8080/
    ```

## Generate client with custom AsyncAPI document

2. Navigate to `packages/templates/clients/kafka/java/quarkus`
3. Install with `npm install`
4. Navigate back to `./generator`
5. Generate the template client with `node .\apps\generator\cli.js <path-to-custom-document> .\packages\templates\clients\kafka\java\quarkus\ -o outputClient --force-write --param server=<custom-server>`
6. Navigate to `outputClient` or any other name you gave the output folder
7. Navigate to the docker folder with `cd src/main/docker` and find the `docker-compose.yaml` file. 
8. Start the kafka broker by runnning `docker-compose up -d`. Make sure you have docker desktop up and running.
9. In another terminal, run the templated client with `mvn quarkus:dev`. You will see the logged events in this one.
10. In another terminal, send request the REST endpoint to simulate event production.
11. See the output in the terminal