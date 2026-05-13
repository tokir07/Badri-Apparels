package com.badribhaiapparel.config;

import com.badribhaiapparel.entity.Role;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user exists
            if (userRepository.findByEmailIgnoreCase("admin@badriapparel.com").isEmpty()) {
                User admin = User.builder()
                        .firstName("Admin")
                        .lastName("Badri")
                        .email("admin@badriapparel.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .phoneNumber("1234567890")
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Default Admin User Created: admin@badriapparel.com / Admin@123");
            }
        };
    }
}
