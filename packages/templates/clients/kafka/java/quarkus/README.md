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
8. Start the kafka broker by runnning `docker-compose up -d`. 
9. In another terminal, run the templated client with `mvn quarkus:dev`. You will see the logged events in this one.
10. In another terminal, send request the REST endpoint to simulate event production.
11. See the output in the terminal











**Plan**
Make sure that you have a proper producer and consumer
The new version does that different diagram, try to just get producer and consumer working proeprly,
Then see about it 
So follow a hybrid of older one + newer one, but mostly focusing on older one
    - newer messages up the way consumer works but try referencing both throughout
Ask lukasz about the approach



**Todo**
- Add endpoint to test the producer and consumer then try them out !!!!
Aug 13
    - test out the endpoint I made, make sure right topic names are consisten if need be 
Aug 13th
- try to use dependencyprovider component
- Be sure to check out the kafka dev UI that quarkus has

What should we be exchange?!?!?
It should be the send and receive payloads??!!?!
    - how can I make sure I get the right one?
Need to make sure we listen on consisten channel and topic (know if they are different)
Make sure you use right serializer and desirializer
Make sure you use the right group-Id and topic for each event you are dealing with 

Of course start simmple then work up !!
    - should I do both consumer and producer or just producer

`NOTE:` assuming for now that CostingRequest is the producer. Double check with lukasz !!!! ask !!!!!!


we send and receive records 
    - to make a models record class so we have things to send and receive
    - ask if I can send to one channel and receive from another??!!?!



Make sure at the end to put information on how to use graalvm properly

Look at qucikstarts for junit type tests


In case I have to add smallrye:
`quarkus ext add io.quarkus:quarkus-smallrye-reactive-messaging-kafka`
Note: quarkus-messaging-kafka  should do the trick though, renamed it 



`node .\apps\generator\cli.js .\packages/tempaltes/clients/kafka/test/__fixtures__/asyncapi-adeo.yml .\packages\templates\clients\kafka\java\quarkus\ -o outputClient --force-write --param server=<custom-server>`

**Ask**
Ask best place to put the share modesl preset
Ask why I am getting these anonymous things
Ask which server should I be using
Ask about the repalce maven thing
Ask how can I extract the message payload, only got the headers
Ask if I should do simple pub-sub or if I should be doing the request-response pattern 1 vs 2
ask if this docker compose is the right idea





todo:
make it so that I don't have to use future

figure out how to best send an event (even if it is a model generated) 
    - since the goal is to just the api set up and work, i may just send a <String,String> where key is random and value is "it works"
        - then you know by newly generate key that is a different 

Then template it up
    - also if only one channel then make it so its simple pub-sub, and no middle guy needed



**NOTE**
For now going to make it so its just simple (key, value) since unless I know the BL, I can't definitively know what they are sending as payload or event. I just make API configuration
    - however, depending on the operation payload (in the specs), I may be able to do but focus on simple first
    (com.adeo.casestudy.costingresponse.CostingResultItem) --> might use this 
    (don't forget the JSOn serialization)



curl.exe -v -H "Content-Type: application/json" -d '{\"id\":\"123\", \"value\":\"my-value\"}' http://localhost:8080/costing

aug 15th

/*Old code for reference. -----> Need to make sure I get the correct producer by Lukasz and that it is the right way to do it.
ask about the channel/topic naming and the name of the producer I should use

Also ask how could I dynamically use the models generated, like how would I know the right one so i can call them !!! cause I need a payload
     - I think it should be based on the message payload we are sending costingRequestV1 & costingResponse 
ask about this response thing:  adeo-{env}-case-study-COSTING-RESPONSE-{version}


Confirm if serializer is by default for like json of other things !!!!*/