package com.badribhaiapparel.config;

import com.badribhaiapparel.entity.Category;
import com.badribhaiapparel.entity.Product;
import com.badribhaiapparel.entity.Role;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.entity.Coupon;
import com.badribhaiapparel.repository.CouponRepository;
import com.badribhaiapparel.repository.CategoryRepository;
import com.badribhaiapparel.repository.ProductRepository;
import com.badribhaiapparel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                    CategoryRepository categoryRepository,
                                    ProductRepository productRepository,
                                    CouponRepository couponRepository,
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

            // Seed Categories
            if (categoryRepository.count() == 0) {
                Category kurties = Category.builder().name("Jaipuri Kurties").slug("kurties").description("Authentic Jaipuri Handcrafted Kurties").build();
                Category festive = Category.builder().name("Festive Wear").slug("festive").description("Luxury Festive Collection").build();
                Category coords = Category.builder().name("Ethnic Co-ords").slug("co-ords").description("Modern Ethnic Co-ord Sets").build();
                categoryRepository.saveAll(Arrays.asList(kurties, festive, coords));
                System.out.println("Categories Seeded");
            }

            // Seed some Products if none exist
            if (productRepository.count() == 0) {
                Category category = categoryRepository.findAll().get(0);
                
                Product p1 = Product.builder()
                        .title("Essential Beige Hoodie")
                        .description("Crafted from heavy-weight premium organic cotton")
                        .price(9999.0)
                        .stock(50)
                        .category(category)
                        .sizes(Arrays.asList("S", "M", "L", "XL"))
                        .colors(Arrays.asList("Beige", "Black"))
                        .brand("BADRIBHAI APPAREL")
                        .fabric("Organic Cotton")
                        .printType("Minimalist")
                        .featured(true)
                        .build();

                Product p2 = Product.builder()
                        .title("Luxury Minimalist Jacket")
                        .description("Premium quality outerwear")
                        .price(18999.0)
                        .stock(30)
                        .category(category)
                        .sizes(Arrays.asList("S", "M", "L"))
                        .colors(Arrays.asList("Navy", "Grey"))
                        .brand("BADRIBHAI APPAREL")
                        .fabric("Wool")
                        .printType("Minimalist")
                        .trending(true)
                        .build();

                productRepository.saveAll(Arrays.asList(p1, p2));
                System.out.println("Initial Products Seeded");
            }

            // Seed Coupons
            if (couponRepository.count() == 0) {
                Coupon welcome = new Coupon();
                welcome.setCode("WELCOME10");
                welcome.setDiscountValue(10.0);
                welcome.setDiscountType("PERCENTAGE");
                welcome.setMinOrderAmount(500.0);
                welcome.setActive(true);
                
                Coupon festive = new Coupon();
                festive.setCode("FESTIVE500");
                festive.setDiscountValue(500.0);
                festive.setDiscountType("FIXED");
                festive.setMinOrderAmount(2000.0);
                festive.setActive(true);
                
                couponRepository.saveAll(Arrays.asList(welcome, festive));
                System.out.println("Test Coupons Seeded: WELCOME10, FESTIVE500");
            }
        };
    }
}
