package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
