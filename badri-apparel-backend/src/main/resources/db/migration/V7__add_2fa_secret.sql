-- V7__add_2fa_secret.sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);
