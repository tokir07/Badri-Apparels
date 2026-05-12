package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.Cart;
import com.badribhaiapparel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserEmailIgnoreCase(String email);
}
