package com.leafcard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LeafCardApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeafCardApplication.class, args);
    }

}