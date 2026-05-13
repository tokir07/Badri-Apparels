package com.badribhaiapparel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@EntityScan(basePackages = "com.badribhaiapparel.entity")
@EnableJpaRepositories(basePackages = "com.badribhaiapparel.repository")
public class BadriApparelApplication {

	public static void main(String[] args) {
		SpringApplication.run(BadriApparelApplication.class, args);
	}

}
