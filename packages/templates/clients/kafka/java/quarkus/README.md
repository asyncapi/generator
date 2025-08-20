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










Take note of a bundle issue
make sure it matches the payload
fix the send and recevei operations
look at parser .md
focus sperately on send and receive and use it without reply
use handler that will subscribe to you and one then will send message to channel
Don't worry about the **message** header for now
Look out for messages
Ask ahmed
try to use .id() more often
Ask lukasz about the skill of schemas
I think its better to leave as String , String and they put their BL, I will later ask him about iut, the payload is hard becasue how do I get the models class
**Plan**
Make sure that you have a proper producer and consumer
The new version does that different diagram, try to just get producer and consumer working proeprly,
Then see about it 
So follow a hybrid of older one + newer one, but mostly focusing on older one
    - newer messages up the way consumer works but try referencing both throughout
Ask lukasz about the approach



Just use a crd.yaml, the operator doesn't seem to work, but able to back it up later on
put a crd input parameter, if they want, by default it is false
    - ask lukasx if I should put it 

Ask about the link payload 


before using docker file do `mvn clean package`, make sure naming of quarkus-kafka and other are correct
    - for running the dockerfile of the kafka, it need to run the docker-compose file first before being able to run the docker image

need to make sure have proper image naming 

So I deployed it but the operator is not working, I may make it so that no operator is even there idk?
Also need to double check with the whole docker file and how to build image and deploy on k8s
    - image for kafka must work, currently needs not working
Fixed the getIMage name function, make so just checks locally, and remove my docker hub pull

Todo:
Seems that the crd works (some review)
    - fix the operator or even if I need it 
    - fix the docker file, current image is wrong
    - so I may not need a controller
    - Also determine oif I am building an operator or controller
            Controllers: are processes that watch for changes to resources (including custom resources) and reconcile the cluster's actual state with the desired state defined in those resources.
            Operators: are a specific type of controller that encapsulate operational knowledge for managing complex applications or services, often involving multiple Kubernetes resources and external systems.



**Todo**

Aug 18th
Review to make sure this is as simple as possible, so far looks good
    - So review crd, then review operators
    - once that is done, build image and try to make a apiconfig resource (for the image tell the user in the steps that they must build the image to deploy it to k8s)
    - then template it 
    - REALLY JUST WANT A SIMPLE OPERATOR


Also need to make sure that all these small like custer-ip things are in the right place for things to work

After CRD is done,
Review kafka for NO HARD CODING PLEASE!!!!
THE CRD MAY BE SLIGTLY HARD CODED BUT PLEASE MAKE IT SO THAT IT WOKRS FOR BOTH TEMPLATES\



Aug 16th
Might put reusable componetns in templates/client/components/java
- get the crd to wokr
- controller will most liely be written in java using quakrus api

Aug17th
1. Containerizing and Deploying via Quarkus on Kubernetes
    - need to give them a way to deploy the containerize app with quarkus to k8s. Then can make a instance of new resource
    - important to have this 
2. Custom Resource Definitions (CRDs) + Operators in Java
    - Ideas
        - whenever the document is done we, rebuild the tempalte and build teh container again from sratch?
        - Might use the appconfig resource

I also need to know how to deploy the applcation as a contianer using quarkus then making the the customer resoruce and checking that it got setup properly
    - probably will test with kubernetes on docker desktop since I only need to test with one cluster

**NOTE**: i think quakurs might make the manifest for me. Double check if that is the case

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