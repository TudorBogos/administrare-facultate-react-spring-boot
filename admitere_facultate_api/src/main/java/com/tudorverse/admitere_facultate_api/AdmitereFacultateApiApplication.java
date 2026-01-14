package com.tudorverse.admitere_facultate_api;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Punctul de intrare al aplicatiei; porneste Spring si verifica conexiunea la baza de date la pornire.
 */
@SpringBootApplication
public class AdmitereFacultateApiApplication {

	private static final Logger LOGGER = LoggerFactory.getLogger(AdmitereFacultateApiApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(AdmitereFacultateApiApplication.class, args);
	}

	@Bean
	CommandLineRunner verifyDatabaseConnection(DataSource dataSource) {
		return args -> {
			try (Connection connection = dataSource.getConnection()) {
				if (connection.isValid(2)) {
					LOGGER.info("Connection established");
				}
			} catch (SQLException ex) {
				LOGGER.error("Failed to establish connection", ex);
			}
		};
	}
}
