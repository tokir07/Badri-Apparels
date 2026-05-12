package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    
    @Query(value = """
      SELECT p.* FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL
        AND p.is_active = true
        AND (:search IS NULL OR :search = '' OR
             to_tsvector('english', p.title || ' ' || COALESCE(p.description,'') || ' ' || COALESCE(c.name, ''))
             @@ plainto_tsquery('english', :search))
        AND (:categoryId IS NULL OR p.category_id = :categoryId)
        AND (:minPrice IS NULL OR p.base_price >= :minPrice)
        AND (:maxPrice IS NULL OR p.base_price <= :maxPrice)
        AND (:fabric IS NULL OR p.fabric ILIKE '%' || :fabric || '%')
      ORDER BY
        CASE WHEN :sort = 'price_asc' THEN p.base_price END ASC,
        CASE WHEN :sort = 'price_desc' THEN p.base_price END DESC,
        CASE WHEN :sort = 'newest' THEN p.created_at END DESC,
        p.created_at DESC
      """, 
      countQuery = """
      SELECT count(*) FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL
        AND p.is_active = true
        AND (:search IS NULL OR :search = '' OR
             to_tsvector('english', p.title || ' ' || COALESCE(p.description,'') || ' ' || COALESCE(c.name, ''))
             @@ plainto_tsquery('english', :search))
        AND (:categoryId IS NULL OR p.category_id = :categoryId)
        AND (:minPrice IS NULL OR p.base_price >= :minPrice)
        AND (:maxPrice IS NULL OR p.base_price <= :maxPrice)
        AND (:fabric IS NULL OR p.fabric ILIKE '%' || :fabric || '%')
      """,
      nativeQuery = true)
    Page<Product> searchProducts(
      @Param("search") String search,
      @Param("categoryId") Long categoryId,
      @Param("minPrice") BigDecimal minPrice,
      @Param("maxPrice") BigDecimal maxPrice,
      @Param("fabric") String fabric,
      @Param("sort") String sort,
      Pageable pageable
    );

    List<Product> findByFeaturedTrue();
    List<Product> findByTrendingTrue();
    
    List<Product> findByStockLessThan(int threshold);
}
