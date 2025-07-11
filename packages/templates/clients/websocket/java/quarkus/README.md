
## Java Quarkus WebSocket Client

You can test this template (for now modifications are coming):
1. Clone the project and run `npm install`
2. Navigate to `packages/templates/clients/websocket/test/integration-test` and run the tests with `npm run test` to generate WebSocket clients
3. Navigate to `packages/templates/clients/websocket/java/quarkus`
4. Install dependencies with `npm install` 
5. Navigate to the generated clients in the folder with `cd test/temp/snapshotTestResult`
6. Pick a generated client inside one of the folders and navigate to source code with `cd /selected-folder/src/main/java/com/asyncapi`
7. Run the templated client with `mvn quarkus:dev`
8. See the output in the terminal

## To generate client with custome AsyncAPI document 

2. Navigate to `packages/templates/clients/websocket/java/quarkus`
3. Install with `npm install`
4. Navigate back to `./generator`
5. Generate the template client with `node .\apps\generator\cli.js <path-to-custom-document> .\packages\templates\clients\websocket\java\quarkus\ -o outputClient --force-write --param server=<custom-server>`
6. Navigate to `outputClient` or any other name you gave the output folder
7. Run `mvn quarkus:dev`
8. See the output in the terminal

## **NOTE:**
- Currently only supports asyncapi-postman-echo.yml AsyncApi Document

## Todo
- Support slack AsyncAPI document