-- V9__add_avatar_fields.sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255);
