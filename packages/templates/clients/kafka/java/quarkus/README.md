## Java Quarkus Kafka Client



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