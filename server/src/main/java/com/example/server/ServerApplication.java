package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		// Load .env variables
        Dotenv dotenv = Dotenv.load();

        // Apply to System properties so Spring can read them
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
		
		SpringApplication.run(ServerApplication.class, args);
	}

}
