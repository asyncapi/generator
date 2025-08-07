
## Java Quarkus WebSocket Client

You can test this template (for now modifications are coming):
1. Clone the project and run `npm install`
2. Navigate to `packages/templates/clients/websocket/test/integration-test` and run the tests with `npm run test` to generate WebSocket clients
3. Navigate to `packages/templates/clients/websocket/java/quarkus`
4. Install dependencies with `npm install` 
5. Navigate to the generated clients in the folder with `cd test/temp/snapshotTestResult`
6. Pick a generated client inside one of the folders and navigate to source code with `cd` ex: `cd /client_postman`
7. Run the templated client with `mvn quarkus:dev`
8. See the output in the terminal

## Client for Slack

To run the Slack CLient example, follow the steps above but with the following exceptions:

- Navigate to the slack generated client via `cd test/temp/snapshotTestResult/client_slack`
- You need to pass environment variables with proper authorization details. Your command must look like this: `TICKET={provide secret info} APP_ID={provide id of the slack app} mvn quarkus:dev`. For example: `TICKET=1d967f38-ccff-44f6-adec-9616eec9c4b7 APP_ID=00dfdcccb53a2645dd3f1773fcb10fa7b0a598cf333a990a9db12375ef1865dd mvn quarkus:dev`.

> Instructions on how to create the Slack app and also obtain authorization is described in details in the [Slack AsyncAPI document](../test/__fixtures__/asyncapi-slack-client.yml).

You can use our AsyncAPI's credentials to access different set of events produced in AsyncAPI Slack workspace, in the `#generator` channel.

1. Make sure you are in the `packages/templates/clients/websocket/java/quarkus/test/temp/snapshotTestResult/client_slack` directory.
2. If the `client_slack` directory doesn't exists you probably  did not run tests that generate the client. Fix this by running `npm run test`.
3. Generate an access ticket with an application ID that will enable you to establish a websocket connection. Such a ticket can be used only once. You need to generate a new one every time you connect to Slack server. Replace the following  bearer token with real token that you can find in `slack-example.md` document added to bookmarks of `#generator` channel in [AsyncAPI Slack workspace](https://www.asyncapi.com/slack-invite):
    
    Linux/MacOs
    ```
    curl --location --request POST 'https://slack.com/api/apps.connections.open' \
    --header 'Authorization: Bearer TAKE_XAPP_TOKEN_FROM_BOOKMARKS_DOC_IN_SLACK'
    ```

    Windows
    ```
    curl.exe --location --request POST 'https://slack.com/api/apps.connections.open' ^
    --header 'Authorization: Bearer TAKE_XAPP_TOKEN_FROM_BOOKMARKS_DOC_IN_SLACK'
    ```

>**Note**:  Ensure that you do not expose the real token on GitHub or any other public platform because it will be disabled by Slack.

    Example response with `ticket` and `app_id`:
    ```
    {"ok":true,"url":"wss:\/\/wss-primary.slack.com\/link\/?ticket=089a0c38-cdec-409f-99fa-0ca24e216ea4&app_id=00dfdcccb53a2645dd3f1773fcb10fa7b0a598cf333a990a9db12375ef1865dd"}
    ```

    You can take generated `url` and use with CLI websocket client like `websocat` (first remove excape backslashes):
    ```
    websocat "wss://wss-primary.slack.com/link/?ticket=5ad694c1-2a81-4cfc-a503-057b8e798120&app_id=00dfdcccb53a2645dd3f1773fcb10fa7b0a598cf333a990a9db12375ef1865dd"
    ```

    But that is just for testing. The point is to use the generated Python client.

1. Start the example that uses generated client. Examine events, and modify example as you want:
    
    Linux/MacOs
    ```
    TICKET=6b150bb1-82b4-457f-a09d-6ff0af1fd2d1 APPID=00dfdcccb53a2645dd3f1773fcb10fa7b0a598cf333a990a9db12375ef1865dd mvn quarkus:dev
    ```

    Windows
    ```
    $env:TICKET="6b150bb1-82b4-457f-a09d-6ff0af1fd2d1"; $env:APPID="00dfdcccb53a2645dd3f1773fcb10fa7b0a598cf333a990a9db12375ef1865dd"; mvn quarkus:dev
    ```
    
    Successfully established connection will welcome you with below event:
    ```
    {"type":"hello","num_connections":1,"debug_info":{"host":"applink-3","build_number":118,"approximate_connection_time":18060},"connection_info":{"app_id":"A08NKKBFGBD"}}
    ```
    If you did not receive it, you probably connect with wrong credentials. Remember that generated `ticket` can be used only once to establish a websocket connection.

## Generate client with custom AsyncAPI document

2. Navigate to `packages/templates/clients/websocket/java/quarkus`
3. Install with `npm install`
4. Navigate back to `./generator`
5. Generate the template client with `node .\apps\generator\cli.js <path-to-custom-document> .\packages\templates\clients\websocket\java\quarkus\ -o outputClient --force-write --param server=<custom-server>`
6. Navigate to `outputClient` or any other name you gave the output folder
7. Run `mvn quarkus:dev`
8. See the output in the terminal

## Todo
- Support slack AsyncAPI document

Note: need onTextMessage always to process the message!!!

try to find a use for the constructor, Still keep cause the user may want to do something with it later
might try to handle json message
add getters later ???


Todo Aug 5th:

fix enum and interface pacakge !!!
add proper documentation for slack

Ask: add serverhost test ( works and added a checking for duplicate, ask if okay)
Command:

$env:TICKET="ffd199b0-3b97-47b6-901f-960091269cc1"; $env:APPID="00dfdcccb53a2645dd3f1773fcb10fa7b0a598cf333a990a9db12375ef1865dd"; mvn quarkus:dev