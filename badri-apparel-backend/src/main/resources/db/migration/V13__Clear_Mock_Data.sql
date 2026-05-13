-- V13__Clear_Mock_Data.sql
-- This migration clears any existing mock data from the products and related tables.
-- This allows for a clean start with real inventory.

DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM product_images_new;
DELETE FROM product_variants;
DELETE FROM product_colors;
DELETE FROM product_sizes;
DELETE FROM wishlists;
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM categories;
