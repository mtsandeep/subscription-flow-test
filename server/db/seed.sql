-- Payment Flow Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER,
  weight REAL,              -- Weight in kg
  height REAL,              -- Height in cm
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,  -- Price in paisa
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL,  -- e.g., 10 means 10% off
  max_uses INTEGER NOT NULL,
  current_uses INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table (initially empty)
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT
  -- Add subscription fields here as needed
);

-- Insert default plans (prices in paisa)
INSERT OR IGNORE INTO plans (name, price) VALUES
  ('Basic', 149900),   -- ₹1499.00
  ('Pro', 299900);    -- ₹2999.00

-- Insert default coupons
INSERT OR IGNORE INTO coupons (code, discount_percent, max_uses, current_uses) VALUES
  ('WELCOME10', 10, 100, 0),  -- 10% off, max 100 uses
  ('SUPER50', 50, 5, 0);      -- 50% off, max 5 uses
