
## Java WebSocket Client

You can test this template (for now modifications are coming):
1. Clone the project and run `npm install`
2. Navigate to `packages/templates/clients/websocket/java/quarkus`
3. Install with `npm install`
4. Navigate back to `./generator`
5. Generate the template client with `node .\apps\generator\cli.js .\packages\templates\clients\websocket\test\__fixtures__\asyncapi-postman-echo.yml .\packages\templates\clients\websocket\java\quarkus\ -o outputClient --force-write --param server=echoServer`
6. Navigate to `outputClient` or any other name you gave the output folder
7. Run `mvn quarkus:dev`
8. See the output in the terminal

## **NOTE:**
- Currently only supports asyncapi-postman-echo.yml AsyncApi Document

## Todo
- Generate Test
- Support slack AsyncAPI document