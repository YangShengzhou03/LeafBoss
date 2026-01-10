package com.leafboss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LeafBossApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeafBossApplication.class, args);
    }

}
