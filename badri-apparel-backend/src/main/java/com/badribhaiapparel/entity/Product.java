package com.badribhaiapparel.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@SQLRestriction("deleted_at IS NULL")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double discountPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "has_variants")
    private boolean hasVariants = false;

    @Column(name = "base_price")
    private java.math.BigDecimal basePrice;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "meta_title", length = 60)
    private String metaTitle;

    @Column(name = "meta_description", length = 160)
    private String metaDescription;

    @Column(name = "hsn_code", length = 20)
    private String hsnCode;

    @Column(name = "care_instructions", columnDefinition = "TEXT")
    private String careInstructions;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> sizes;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> colors;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images = new java.util.ArrayList<>();

    @Column(name = "brand")
    private String brand;

    private String type;
    private String collection;
    private String fabric;
    private String printType;
    private String occasion;

    private Double rating = 0.0;
    private Integer reviewsCount = 0;
    private boolean featured = false;
    private boolean trending = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (this.title != null && (this.slug == null || this.slug.isEmpty())) {
            String baseSlug = this.title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
            
            // Append a short random suffix to ensure uniqueness in production
            this.slug = baseSlug + "-" + System.currentTimeMillis() % 10000;
        }
    }

    public Product() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(Double discountPrice) { this.discountPrice = discountPrice; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }
    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }
    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }
    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCollection() { return collection; }
    public void setCollection(String collection) { this.collection = collection; }
    public String getFabric() { return fabric; }
    public void setFabric(String fabric) { this.fabric = fabric; }
    public String getPrintType() { return printType; }
    public void setPrintType(String printType) { this.printType = printType; }
    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public boolean isTrending() { return trending; }
    public void setTrending(boolean trending) { this.trending = trending; }
    public boolean isHasVariants() { return hasVariants; }
    public void setHasVariants(boolean hasVariants) { this.hasVariants = hasVariants; }
    public java.math.BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(java.math.BigDecimal basePrice) { this.basePrice = basePrice; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getMetaTitle() { return metaTitle; }
    public void setMetaTitle(String metaTitle) { this.metaTitle = metaTitle; }
    public String getMetaDescription() { return metaDescription; }
    public void setMetaDescription(String metaDescription) { this.metaDescription = metaDescription; }
    public String getHsnCode() { return hsnCode; }
    public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }
    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static ProductBuilder builder() { return new ProductBuilder(); }

    public static class ProductBuilder {
        private Long id;
        private String title;
        private String slug;
        private String description;
        private Double price;
        private Double discountPrice;
        private Integer stock;
        private Category category;
        private List<String> sizes;
        private List<String> colors;
        private List<ProductVariant> variants = new java.util.ArrayList<>();
        private List<ProductImage> images = new java.util.ArrayList<>();
        private String brand;
        private String type;
        private String collection;
        private String fabric;
        private String printType;
        private String occasion;
        private Double rating;
        private Integer reviewsCount;
        private boolean featured;
        private boolean trending;
        private boolean hasVariants;
        private java.math.BigDecimal basePrice;
        private boolean isActive = true;
        private String metaTitle;
        private String metaDescription;
        private String hsnCode;
        private String careInstructions;
        private LocalDateTime publishedAt;
        private LocalDateTime deletedAt;

        public ProductBuilder id(Long id) { this.id = id; return this; }

        public ProductBuilder title(String title) { this.title = title; return this; }
        public ProductBuilder slug(String slug) { this.slug = slug; return this; }
        public ProductBuilder description(String description) { this.description = description; return this; }
        public ProductBuilder price(Double price) { this.price = price; return this; }
        public ProductBuilder discountPrice(Double discountPrice) { this.discountPrice = discountPrice; return this; }
        public ProductBuilder stock(Integer stock) { this.stock = stock; return this; }
        public ProductBuilder category(Category category) { this.category = category; return this; }
        public ProductBuilder sizes(List<String> sizes) { this.sizes = sizes; return this; }
        public ProductBuilder colors(List<String> colors) { this.colors = colors; return this; }
        public ProductBuilder images(List<ProductImage> images) { this.images = images; return this; }
        public ProductBuilder brand(String brand) { this.brand = brand; return this; }
        public ProductBuilder type(String type) { this.type = type; return this; }
        public ProductBuilder collection(String collection) { this.collection = collection; return this; }
        public ProductBuilder fabric(String fabric) { this.fabric = fabric; return this; }
        public ProductBuilder printType(String printType) { this.printType = printType; return this; }
        public ProductBuilder occasion(String occasion) { this.occasion = occasion; return this; }
        public ProductBuilder rating(Double rating) { this.rating = rating; return this; }
        public ProductBuilder reviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; return this; }
        public ProductBuilder featured(boolean featured) { this.featured = featured; return this; }
        public ProductBuilder trending(boolean trending) { this.trending = trending; return this; }
        public ProductBuilder variants(List<ProductVariant> variants) { this.variants = variants; return this; }
        public ProductBuilder hasVariants(boolean hasVariants) { this.hasVariants = hasVariants; return this; }
        public ProductBuilder basePrice(java.math.BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public ProductBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public ProductBuilder metaTitle(String metaTitle) { this.metaTitle = metaTitle; return this; }
        public ProductBuilder metaDescription(String metaDescription) { this.metaDescription = metaDescription; return this; }
        public ProductBuilder hsnCode(String hsnCode) { this.hsnCode = hsnCode; return this; }
        public ProductBuilder careInstructions(String careInstructions) { this.careInstructions = careInstructions; return this; }
        public ProductBuilder publishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; return this; }
        public ProductBuilder deletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; return this; }

        public Product build() {
            Product product = new Product();
            product.setId(id);
            product.setTitle(title);
            product.setSlug(slug);
            product.setDescription(description);
            product.setPrice(price);
            product.setDiscountPrice(discountPrice);
            product.setStock(stock);
            product.setCategory(category);
            product.setSizes(sizes);
            product.setColors(colors);
            product.setVariants(variants);
            product.setImages(images);
            product.setBrand(brand);
            product.setType(type);
            product.setCollection(collection);
            product.setFabric(fabric);
            product.setPrintType(printType);
            product.setOccasion(occasion);
            product.setRating(rating);
            product.setReviewsCount(reviewsCount);
            product.setFeatured(featured);
            product.setTrending(trending);
            product.setHasVariants(hasVariants);
            product.setBasePrice(basePrice);
            product.setActive(isActive);
            product.setMetaTitle(metaTitle);
            product.setMetaDescription(metaDescription);
            product.setHsnCode(hsnCode);
            product.setCareInstructions(careInstructions);
            product.setPublishedAt(publishedAt);
            product.setDeletedAt(deletedAt);
            return product;
        }
    }
}
