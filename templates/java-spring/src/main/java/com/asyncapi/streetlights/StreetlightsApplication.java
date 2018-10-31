package com.asyncapi.streetlights;

import com.asyncapi.streetlights.infrastructure.Bindings;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.annotation.EnableBinding;

@SpringBootApplication
@EnableBinding(Bindings.class)
public class StreetlightsApplication {

	public static void main(String[] args) {
		SpringApplication.run(StreetlightsApplication.class, args);
	}

}
