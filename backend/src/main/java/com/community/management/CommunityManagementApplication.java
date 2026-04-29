package com.community.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Community Property Management System.
 * @SpringBootApplication enables auto-configuration, component scan, and configuration.
 */
@SpringBootApplication
public class CommunityManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommunityManagementApplication.class, args);
    }
}
