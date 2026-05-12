package com.badribhaiapparel.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.math.BigDecimal;

public class ProductDTO {
    private Long id;
    
    @JsonProperty("name")
    @JsonAlias("title")
    private String title;
    
    private String slug;
    private String description;
    
    @JsonProperty("mrp")
    @JsonAlias("price")
    private Double price;
    
    @JsonProperty("sellingPrice")
    @JsonAlias("discountPrice")
    private Double discountPrice;
    
    private Integer stock;
    private Long categoryId;
    private List<String> sizes;
    private List<String> colors;
    private List<ProductImageDto> images;
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
    private BigDecimal basePrice;
    private List<ProductVariantDto> variants;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private int totalStock;

    public ProductDTO() {}

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
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }
    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }
    public List<ProductImageDto> getImages() { return images; }
    public void setImages(List<ProductImageDto> images) { this.images = images; }
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
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public List<ProductVariantDto> getVariants() { return variants; }
    public void setVariants(List<ProductVariantDto> variants) { this.variants = variants; }
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    public int getTotalStock() { return totalStock; }
    public void setTotalStock(int totalStock) { this.totalStock = totalStock; }

    public static ProductDTOBuilder builder() { return new ProductDTOBuilder(); }

    public static class ProductDTOBuilder {
        private Long id;
        private String title;
        private String slug;
        private String description;
        private Double price;
        private Double discountPrice;
        private Integer stock;
        private Long categoryId;
        private List<String> sizes;
        private List<String> colors;
        private List<ProductImageDto> images;
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
        private BigDecimal basePrice;
        private List<ProductVariantDto> variants;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private int totalStock;

        public ProductDTOBuilder id(Long id) { this.id = id; return this; }
        public ProductDTOBuilder title(String title) { this.title = title; return this; }
        public ProductDTOBuilder slug(String slug) { this.slug = slug; return this; }
        public ProductDTOBuilder description(String description) { this.description = description; return this; }
        public ProductDTOBuilder price(Double price) { this.price = price; return this; }
        public ProductDTOBuilder discountPrice(Double discountPrice) { this.discountPrice = discountPrice; return this; }
        public ProductDTOBuilder stock(Integer stock) { this.stock = stock; return this; }
        public ProductDTOBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public ProductDTOBuilder sizes(List<String> sizes) { this.sizes = sizes; return this; }
        public ProductDTOBuilder colors(List<String> colors) { this.colors = colors; return this; }
        public ProductDTOBuilder images(List<ProductImageDto> images) { this.images = images; return this; }
        public ProductDTOBuilder brand(String brand) { this.brand = brand; return this; }
        public ProductDTOBuilder type(String type) { this.type = type; return this; }
        public ProductDTOBuilder collection(String collection) { this.collection = collection; return this; }
        public ProductDTOBuilder fabric(String fabric) { this.fabric = fabric; return this; }
        public ProductDTOBuilder printType(String printType) { this.printType = printType; return this; }
        public ProductDTOBuilder occasion(String occasion) { this.occasion = occasion; return this; }
        public ProductDTOBuilder rating(Double rating) { this.rating = rating; return this; }
        public ProductDTOBuilder reviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; return this; }
        public ProductDTOBuilder featured(boolean featured) { this.featured = featured; return this; }
        public ProductDTOBuilder trending(boolean trending) { this.trending = trending; return this; }
        public ProductDTOBuilder hasVariants(boolean hasVariants) { this.hasVariants = hasVariants; return this; }
        public ProductDTOBuilder basePrice(BigDecimal basePrice) { this.basePrice = basePrice; return this; }
        public ProductDTOBuilder variants(List<ProductVariantDto> variants) { this.variants = variants; return this; }
        public ProductDTOBuilder minPrice(BigDecimal minPrice) { this.minPrice = minPrice; return this; }
        public ProductDTOBuilder maxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; return this; }
        public ProductDTOBuilder totalStock(int totalStock) { this.totalStock = totalStock; return this; }

        public ProductDTO build() {
            ProductDTO dto = new ProductDTO();
            dto.setId(id);
            dto.setTitle(title);
            dto.setSlug(slug);
            dto.setDescription(description);
            dto.setPrice(price);
            dto.setDiscountPrice(discountPrice);
            dto.setStock(stock);
            dto.setCategoryId(categoryId);
            dto.setSizes(sizes);
            dto.setColors(colors);
            dto.setImages(images);
            dto.setBrand(brand);
            dto.setType(type);
            dto.setCollection(collection);
            dto.setFabric(fabric);
            dto.setPrintType(printType);
            dto.setOccasion(occasion);
            dto.setRating(rating);
            dto.setReviewsCount(reviewsCount);
            dto.setFeatured(featured);
            dto.setTrending(trending);
            dto.setHasVariants(hasVariants);
            dto.setBasePrice(basePrice);
            dto.setVariants(variants);
            dto.setMinPrice(minPrice);
            dto.setMaxPrice(maxPrice);
            dto.setTotalStock(totalStock);
            return dto;
        }
    }
}
