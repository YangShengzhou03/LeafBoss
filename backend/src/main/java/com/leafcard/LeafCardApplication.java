package com.leafcard;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@MapperScan("com.leafcard.mapper")
public class LeafCardApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeafCardApplication.class, args);
    }

}