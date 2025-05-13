---
title: "Creating a template - Java"
weight: 190
---

This tutorial teaches you how to create a simple generator template using a Java MQTT client. You'll use the AsyncAPI document and the template you develop to generate Java code. Additionally, you'll create template code with a reusable component to reuse the custom functionality you create and test your code using an MQTT client.

This section guides you through creating a flexible MQTT-supported template that will generate a **Java** client from the template and the AsyncAPI document referenced above. The following steps are similar to the [Creating a template - Python](https://www.asyncapi.com/docs/tools/generator/generator-template) but with a few differences and Java flair. This will help developers practice with AsyncAPI generator tool using statically typed language **Java**.

## Prerequisites

To run it, ensure you have Java JDK 8 or higher, Gradle, and the AsyncAPI generator.
- **Gradle** - Get gradle at https://gradle.org/install/ 
- **JDK** - Get jdk at https://www.oracle.com/ca-en/java/technologies/downloads/

## Overview of Java Template

In this section, you'll:

1. Create a new directory to run Java code.
2. Create the Java client.
3. Test the Java Client
4. Output Java template code.
5. Create more channels

### 1. Create a new directory to run Java code

Create a new directory called **java-mqtt-client-template** at the root of your project. This is where all your Java templating work will go.

Once that is done, you should create some new sub-directories to begin building your Java client.
  1. Create a new subdirectory called `src`
  2. Change into `src` and create two new subdirectories: `fixtures` and `main/java`.
  3. Create a file named `asyncapi.yml` in your fixtures directory and paste the `asyncapi.yml` document mentioned [here](https://www.asyncapi.com/docs/tools/generator/generator-template#background-context) into it.
  4. Create a new file named **package.json** in your **java-mqtt-client-template** directory. This file is used to define the **dependencies** for your template.
  5. Create a new file called **build.gradle** in your **java-mqtt-client-template** directory. This file is used to build your generated java code for your template.
  6. Create a new file named **index.js** in a `template` folder from root directory. This file is used to define the **logic** for your template.

Now your directory should look like this:

```
java-mqtt-client-template 
├── src
|   └── fixtures
|       └── asyncapi.yml
│   └── main/java
├── template
|   └── index.js
└── package.json
└── build.gradle
```


Note: The `client.java` code must be in your `src/main/java` directory, or else Gradle won't build your application.

### Java - package.json file
Add the following code snippet to your package.json file:

```json
{
    "name": "java-mqtt-client-template",
    "version": "0.0.1",
    "description": "A template that generates a Java MQTT client using MQTT.",
    "generator": {
      "renderer": "react",
      "apiVersion": "v1",
      "generator": ">=1.10.0 <2.0.0",
      "supportedProtocols": ["mqtt"]
    },
    "dependencies": {
      "@asyncapi/generator-react-sdk": "^0.2.25"
    },
    "devDependencies": {
      "rimraf": "^5.0.0"
    }
}
```

Navigate to the `java-mqtt-client-template` directory and run the command `npm install` on your terminal to install the dependencies specified in `package.json`.

### Java - index.js file

The **index.js** file is used to define the logic for your template. Inside the template folder, create an **index.js** file and add the code snippet below:

```js
//1
import { File } from '@asyncapi/generator-react-sdk'
//2
export default function ({ asyncapi }) {
//3
  return <File name="Client.java">{asyncapi.info().title()}</File>
}
```

To see this in action, navigate to the `java-mqtt-client-template` directory. Then, run `asyncapi generate fromTemplate src/fixtures/asyncapi.yml ./ --output src/main/java` command in your terminal. You should get  a sucess message as shown below and a `Client.java` file in `src/main/java`.

``` cmd
Generation in progress. Keep calm and wait a bit... done
Check out your shiny new generated files at test/project.
```

### 2. Create the Java client

  #### 2a. Setting up Gradle
The first step in creating the Java client to send messages using the MQTT protocol is to ensure that your `build.gradle` file includes the correct dependencies. Add the code snippet below into your `build.gradle` file.

```groovy
plugins {
    id 'java'
    id 'application'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.2.5'
}

application{
    mainClass = project.hasProperty('mainClass') ? project.mainClass : 'Client'  // Default to 'Client' if no property is passed
}
```

Here's what is contained in the code snippet above:

- **plugins** - This section defines the plugins applied to the Gradle project.
  - **id 'java'** - This applies the Java plugin, which allows you to compile and run Java code.
  - **id 'application'** - This plugin is used to support building and running applications. It helps with creating an executable JAR.
- **repositories** - This section tells you app to fetch dependencies from Maven Central to retrieve the MQTT client library.
- **dependencies** - This specifies that the project depends on the Eclipse Paho MQTT client version 1.2.5, which is needed to compile and run.
- **application** - This section defines how the application should be executed. **mainClass** specifies the main class to be executed in a Java application. It can be specified via the command line else it defaults to the **Client.java** file.

Navigate to the `java-mqtt-client-template` directory. Run the command `gradle build` in your terminal to build your Java application. **Note**: Every time you update the `build.gradle` file, you must recompile it to get the new changes. 

  #### 2b. Beefing up Client.java

Here is the sample code to pasted into the `Client.java` file you generated above running the `asyncapi generate fromTemplate src/fixtures/asyncapi.yml ./ --output src/main/java` command. 

```java
import org.eclipse.paho.client.mqttv3.*;

public class Client {
    private static final String BROKER_URL = "tcp://test.mosquitto.org:1883";
    private static final String TOPIC = "temperature/changed";

    private MqttClient client;

    public Client() {
        try {
            // Generate a unique client ID
            String clientId = MqttClient.generateClientId();
                    
            // Create and connect the MQTT client
            client = new MqttClient(BROKER_URL, clientId);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
                    
            client.connect(options);
            System.out.println("Connected to MQTT broker: " + BROKER_URL);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
     public void sendTemperatureChange(String id) {
        try {
            // Publish the message with the temperature change
            MqttMessage message = new MqttMessage(id.getBytes());
            client.publish(TOPIC, message);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
```

### 3. Test the Java Client
Create a **src/main/java/TestClient.java** file in your project and add the code snippet below.

Your directory should now look like this:

```
java-mqtt-client-template 
├── src
|   └── fixtures
|       └── asyncapi.yml
│   └── main/java
|       └── Client.java
|       └── TestClient.java
├── template
|   └── index.js
└── package.json
└── build.gradle
```

```java
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class TestClient {
    public static void main(String[] args) {
        Client client = new Client();
        Random random = new Random();

        int idLength = 8;
        int minValue = (int) Math.pow(10, idLength - 1); // Minimum 8-digit number (e.g., 10000000)
        int maxValue = (int) Math.pow(10, idLength) - 1; // Maximum 8-digit number (e.g., 99999999)
        System.out.println("Validating generated generated Client.java");
        System.out.println("Running tests in TestClient.java");
        System.out.println("Sending temperature changes to the broker...");
        System.err.println("\n");
        while (true) {
            int randomId = random.nextInt(maxValue - minValue + 1) + minValue;
            client.sendTemperatureChange(String.valueOf(randomId));
            System.out.println("New temperature detected " + randomId + " sent to temperature/changed");

            try {
                TimeUnit.SECONDS.sleep(1); // Sleep for 1 second
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```
Run the command `gradle run -PmainClass=TestClient` to run your Java program with Gradle on your terminal. You should see output similar to the snippet below logged on your terminal:

``` cmd
New temperature detected 64250266 sent to temperature/changed
New temperature detected 36947728 sent to temperature/changed
New temperature detected 72955029 sent to temperature/changed
```
### 4. Output Java template code.
Open **index.js** and copy the content below so your file looks like the code snippet below:

```js
//1
import { File } from '@asyncapi/generator-react-sdk'
//2
export default function ({ asyncapi }) {
//3
  return <File name="Client.java">
  {`

import org.eclipse.paho.client.mqttv3.*;
public class Client {
    private static final String BROKER_URL = "tcp://test.mosquitto.org:1883";
    private static final String TOPIC = "temperature/changed";

    private MqttClient client;

    public Client() {
        try {
            // Generate a unique client ID
            String clientId = MqttClient.generateClientId();
                    
            // Create and connect the MQTT client
            client = new MqttClient(BROKER_URL, clientId);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
                    
            client.connect(options);
            System.out.println("Connected to MQTT broker: " + BROKER_URL);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
     public void sendTemperatureChange(String id) {
        try {
            // Publish the message with the temperature change
            MqttMessage message = new MqttMessage(id.getBytes());
            client.publish(TOPIC, message);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}`
  }</File>
}
```
#### 4a. Write the script to run the test code
In **package.json** define a script property that you invoke by calling `npm run <your_script>`. After adding these scripts in **package.json**, it will look like the following code snippet:

``` json
   {
    "name": "java-mqtt-client-template",
    "version": "0.0.1",
    "description": "A template that generates a Java MQTT client using MQTT.",
    "generator": {
      "renderer": "react",
      "apiVersion": "v1",
      "generator": ">=1.10.0 <2.0.0",
      "supportedProtocols": ["mqtt"],
      "parameters": {
            "server": {
              "description": "The server you want to use in the code.",
              "required": true
            }
        }
    },
    "scripts": {
        "test:clean": "rimraf src/main/java/Client.java",
        "test:generate": "asyncapi generate fromTemplate src/fixtures/asyncapi.yml ./ --output src/main/java --force-write --param server=dev",
        "test:start": "gradle run -PmainClass=TestClient",
        "test": "npm run test:clean && npm run test:generate && npm run test:start"
    },
    "dependencies": {
      "@asyncapi/generator-react-sdk": "^0.2.25"
    },
    "devDependencies": {
      "rimraf": "^5.0.0"
    }
  }
```
Run `npm test` to see if everything is working.
### 5. Create more channels

#### 5a. Creating more reusable components

Similar to the previous `TopicFunction` function we will create a function to make reusable components regardless of the number of channels in the asyncAPI document. 

Create a **components** directory at the root of your project and create a file named `TopicFunction.js` and add the code snippet below:

```js
/*
 * This component returns a block of functions that users can use to send messages to specific topics.
 * As input it requires a list of Channel models from the parsed AsyncAPI document.
 */
export function TopicFunction({ channels }) {
  const topicsDetails = getTopics(channels);
  let functions = '';

  topicsDetails.forEach((t) => {
    functions += `
    public void send${t.name}(String id) {
        String topic = "${t.topic}";
        try {
            MqttMessage message = new MqttMessage(id.getBytes());
            client.publish(topic, message);
            System.out.println("${t.name} change sent: " + id);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }\n`;
  });

  return functions;
}
  
  /*
   * This function returns a list of objects, one for each channel, each containing two properties: `name` and `topic`.
   * name - holds information about the `operationId` definedin the AsyncAPI document
   * topic - holds information about the topic's address.
   *
   * It requires as input, a list of Channel models from the parsed AsyncAPI document.
   */
  function getTopics(channels) {
    const channelsCanSendTo = channels
    let topicsDetails = []
  
    channelsCanSendTo.forEach((ch) => {
      const topic = {}
      const operationId = ch.operations().filterByReceive()[0].id()
      topic.name = operationId.charAt(0).toUpperCase() + operationId.slice(1)
      topic.topic = ch.address()
  
      topicsDetails.push(topic)
    })
  
    return topicsDetails
  }

```

Import the `TopicFunction` component in your template code in **index.js** and add the template code to generate the functions for the topics which the `Temperature Service` application is subscribed to. In your case, the final version of your template code should look like this:

```js
import { File, Text } from '@asyncapi/generator-react-sdk';
import { TopicFunction } from '../components/TopicFunction'

export default function ({ asyncapi, params }) {
    let channels = asyncapi.channels().filterByReceive();  // Get all the channels that receive messages

    // Generate Java code for each topic dynamically using TopicFunction
    const topicMethods = TopicFunction({ channels });  // This will return Java methods as text
    
    return (
    <File name="Client.java">
    {
      
`import org.eclipse.paho.client.mqttv3.*;

public class Client {
    private static final String BROKER_URL = "${asyncapi.servers().get(params.server).url()}";
    private static final String TOPIC = "temperature/changed";

    private MqttClient client;

    public Client() {
        try {
            // Generate a unique client ID
            String clientId = MqttClient.generateClientId();
                    
            // Create and connect the MQTT client
            client = new MqttClient(BROKER_URL, clientId);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
                    
            client.connect(options);
            System.out.println("Connected to MQTT broker: " + BROKER_URL);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    ${topicMethods}

    public static void main(String[] args) {
        Client serviceClient = new Client();
                
        // Simulate sending a temperature change
        //serviceClient.sendTemperatureDrop("Sensor-1: 25°C");
    }
}`
    }
    </File>
  );
}
```

Now your directory should look like this:

```
java-mqtt-client-template 
├── components
|   └── TopicFunction.js
├── src
|   └── fixtures
|       └── asyncapi.yml
│   └── main/java
|       └── Client.java
|       └── TestClient.java
├── template
|   └── index.js
└── package.json
└── build.gradle
```

#### 5b. Update AsyncAPI document with more channels

Add the following AsyncAPI document to have more channels:

```yaml
asyncapi: 2.6.0

info:
  title: Temperature Service
  version: 1.0.0
  description: This service is in charge of processing all the events related to temperature.

servers:
  dev:
    url: tcp://test.mosquitto.org:1883
    protocol: mqtt

channels:
  temperature/dropped:
    description:  Notifies the user when the temperature drops past a certain point.
    publish:
      operationId: temperatureDrop
      message:
        description: Message that is being sent when the temperature drops past a certain point.
        payload:
          type: object
          additionalProperties: false
          properties:
            temperatureId:
              type: string

  temperature/risen:
    description: Notifies the user when the temperature rises past a certain point.
    publish:
      operationId: temperatureRise
      message:
        description: Message that is being sent when the temperature rises past a certain point.
        payload:
          type: object
          additionalProperties: false
          properties:
            temperatureId:
              type: string

components:
  schemas:
    temperatureId:
      type: object
      additionalProperties: false
      properties:
        temperatureId:
          type: string

```
#### 5c. Update TestClient.java
We must now update the **TestClient.java** file to test the different channels in the AsyncAPI document above. The tests will be similar to the previous ones you performed earlier. Paste the following code snippet into your **TestClient.java** file:

```java
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class TestClient {
    public static void main(String[] args) {
        Client client = new Client();
        Random random = new Random();

        int idLength = 8;
        int minValue = (int) Math.pow(10, idLength - 1); // Minimum 8-digit number (e.g., 10000000)
        int maxValue = (int) Math.pow(10, idLength) - 1; // Maximum 8-digit number (e.g., 99999999)
        System.out.println("Validating generated generated Client.java");
        System.out.println("Running tests in TestClient.java");
        System.out.println("Sending temperature changes to the broker...");
        System.err.println("\n");
        while (true) {
            int randomId = random.nextInt(maxValue - minValue + 1) + minValue;
            client.sendTemperatureDrop(String.valueOf(randomId));
            System.out.println("Temperature drop detected " + randomId + " sent to temperature/dropped");
            
            client.sendTemperatureRise(String.valueOf(randomId));
            System.out.println("Temperature risen detected " + randomId + " sent to temperature/risen");

            try {
                TimeUnit.SECONDS.sleep(1); // Sleep for 1 second
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

Run `npm test` to validate that everything works as expected. You should see logs similar to the snippet below in your terminal:

```cmd
Connected to MQTT broker: tcp://test.mosquitto.org:1883

Validating generated generated Client.java
Running tests in TestClient.java
Sending temperature changes to the broker...
TemperatureDrop change sent: 43289900
Temperature drop detected 43289900 sent to temperature/dropped
TemperatureRise change sent: 43289900
Temperature risen detected 43289900 sent to temperature/risen
```

## Where to go from here?

Great job completing this tutorial! You have learnt how to use an AsyncAPI file to create a Java MQTT template and used it with the Paho-MQTT library in Java to connect to an MQTT broker and publish messages.😃

If you want to tinker with a completed template and see what it would look like in production, check out the [Java-MQTT-client-template](https://github.com/ssala034/Java-MQTT-client-template). You can also check out the accompanying [article about creating MQTT client code](https://www.brainfart.dev/blog/asyncapi-codegen-python).

You can also check out the [MQTT beginners guide](https://medium.com/python-point/mqtt-basics-with-python-examples-7c758e605d4) tutorial to learn more about asynchronous messaging using MQTT.