## Java Quarkus Kafka Client



**Plan**
Make sure that you have a proper producer and consumer
The new version does that different diagram, try to just get producer and consumer working proeprly,
Then see about it 
So follow a hybrid of older one + newer one, but mostly focusing on older one
    - newer messages up the way consumer works but try referencing both throughout
Ask lukasz about the approach



**Todo**
- Add producer
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