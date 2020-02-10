{% if params.artifactType === 'application' -%}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>{{ [asyncapi.info(), params] | groupId }}</groupId>
    <artifactId>{{ [asyncapi.info(), params] | artifactId }}</artifactId>
    <version>{{ asyncapi.info().version() }}</version>
    <packaging>jar</packaging>
    <name>{{ [asyncapi.info(), params] | artifactId }}</name>
    <description>Auto-generated Spring Cloud Stream AsyncAPI application</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <spring-cloud.version>{{ [asyncapi.info(), params] | springCloudVersion }}</spring-cloud.version>
{%- if params.binder === 'solace' %}
        <solace-spring-cloud-bom.version>{{ [asyncapi.info(), params] | solaceSpringCloudVersion }}</solace-spring-cloud-bom.version>
{%- endif %}
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
{%- if params.binder === 'solace' %}
            <dependency>
                <groupId>com.solace.spring.cloud</groupId>
                <artifactId>solace-spring-cloud-bom</artifactId>
                <version>${solace-spring-cloud-bom.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
{%- endif %}
        </dependencies>
    </dependencyManagement>

    <dependencies>
{%- if params.binder === 'rabbit' %}
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-stream-binder-rabbit</artifactId>
		</dependency>
{%- elif params.binder === 'solace' %}
        <dependency>
            <groupId>com.solace.spring.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-solace</artifactId>
        </dependency>
{%- else %}
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-stream-binder-kafka</artifactId>
        </dependency>
{%- endif %}
{%- if params.actuator === 'true' %}
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>
{%- endif %}
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
{%- endif %}
