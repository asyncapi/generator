# {{ asyncapi.info().title() }}

## Version {{ asyncapi.info().version() }}

{{ asyncapi.info().description() | safe }}


# Genenerator Instructions

This template generates Spring Cloud Stream (SCSt) code, either a library or a complete application. It uses version 3
of SCSt which uses function names rather than annotations to configure the channels. See the [reference](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/3.0.1.RELEASE/reference/html/spring-cloud-stream.html).

Ths template can generate a library which can be deployed and imported using Maven. It can also generate a complete Spring Boot application by passing the parameter ```artifactType=application```. Generating an application is a good way to get started, but the preferred way is to generate a library. That way you can regenerate the code when your AsyncAPI document changes, without overwriting your application code.

When generating an application, you can set the parameter ```binder={binderType}``` to specify which binder will get pulled in via a Maven dependency. Supported values are kafka, rabbit and solace.

The template as follows. For each channel, if there is a publisher operation, a Supplier function will be generated with the name ```{channelName}Supplier```. For example, if there is a channel called store/process with a publisher operation with a payload called Order, this code will be generated in a class called Messaging:

 ```
EmitterProcessor<Message<Order>> storeProcessEmitterProcessor = EmitterProcessor.create();

@Bean
public Supplier<Flux<Message<Order>>> orderOperationSupplier() {
  return () -> storeProcessEmitterProcessor;
}

// The client application calls this:
public void sendStoreProcess(Order order) {
  sendStoreProcess(order, null);
}

// The client application calls this when they need to set headers
public void sendStoreProcess(Order order, Map<String, Object> headers) {
  // Omitted for brevity: code that creates a Message with the order payload and sets the headers
  storeProcessEmitterProcessor.onNext(message);
}
```

If the channel has a subscribe operation, the client application must supply a callback function reference that takes a ```Message<Order>``` as a parameter. The following code is generated:

```
private Consumer<Message<Order>> storeProcessCallback;

public void setStoreProcessCallback(Consumer<Message<Order>> callback) {
  storeProcessCallback = callback;
}

@Bean
Consumer<Message<Order>> storeProcessConsumer() {
  return message -> callback.accept(message);
}
```

The names of the functions that are generated can be overridden for each channel by providing a channel specification extension of the form ```x-function-name: myFunctionName```. This is useful when the channel names are long and/or contain parameters that would not read nicely in function names. For example if you have a channel:

```orders/v1/operations/{orderType}/{operationThype}```

the supplier function would be named ```ordersV1OperationsOrderTypeOperationTypeSupplier```, so in cases like this you could override it to generate something like ```orderSupplier```.

If the channel has parameters, then the template will generate ```send``` functions with parameters, one for each channel parameter, and then will construct the topic, setting the ```spring.cloud.stream.sendto.destination``` header on the message. This works well when there are not too many different possible topics, but in cases where you have a different topic for each message, Spring Cloud Stream will create a Spring Integration channel for each topic (therefore for each messsage.) Spring Cloud Stream is not recommended when you have a new topic for each message.

The template generates an application.yaml file that has bindings configured corresponding to the functions in the Java code.

## Destination Overrides

There are a couple of specification extentions you can use to shape how the bindings are configured. You can add the following to a subscription operation:

```x-scs-destination``` : This overrides the destination value in a binder. This is useful for example when you are using the Solace binder and you are following the Solace pattern of publishing to topics but subscribing from queues. In this case the s-scs-destination value would be treated as the name of a queue.
```x-scs-group``` : This will add the group value on a binding.

## Parameters

Parameters can be passed to the generator using command line arguments in the form ```-p param=value```. Here is a list of the parameters that can be used with this template. In some cases these can be put into the AsyncAPI documents using the specification extensions feature.

Parameter   |   Extension  |    Description
------------|--------------|------------------
actuator    |              | If present, it adds the dependencies for spring-boot-starter-web, spring-boot-starter-actuator and micrometer-registry-prometheus.
artifactId  |  info.x-artifact-id | The Maven artifact id.
artifactType | | The type of project to generate, application or library. The default is library. When generating an application, the pom.xml file will contain the complete set of dependencies required to run an app, and it will contain an Application class with a main function. Otherwise the pom file will include only the dependencies required to compile a library.
binder | | The name of the binder implementation, one of kafka, rabbit or solace. Default: kafka
generateMessagingClass | | By default the Messaging.java class is generated. If you don't want it, set this parameter to 'false'.
groupId | info.x-group-id | The Maven group id.
host | | The host connection property. Currently this only works with the Solace binder. Example: tcp://myhost.com:55555
javaPackage | info.x-java-package	| The Java package of the generated classes.
msgVpn | | The message vpn connection property. Currently this only works with the Solace binder.
password | | The client password connection property. Currently this only works with the Solace binder.
solaceSpringCloudVersion | info.x-solace-spring-cloud-version | The version of the solace-spring-cloud BOM dependency used when generating an application.
springCloudVersion | info.x-spring-cloud-version | The version of the spring-cloud-dependencies BOM dependency used when generating an application.
springCloudStreamVersion | info.x-spring-cloud-stream-version | The version of the spring-cloud-stream dependency specified in the Maven file, when generating a library. When generating an application, the spring-cloud-dependencies BOM is used instead.
username | | The client username connection property. Currently this only works with the Solace binder.





