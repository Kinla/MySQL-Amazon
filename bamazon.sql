DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
    ("SanDisk Ultra 128GB microSD", "Electronics & Accessories", 19.00, 8),
    ("Anker SoundBuds Slim Bluetooth Earbuds", "Electronics & Accessories", 32.99, 50),
    ("Fitbit Charge 3 fitness activity tracker", "Electronics & Accessories", 199.95, 156),
    ("MOON CHEESE Medium Cheddar Cheese","Grocery & Gourmet Food", 5.73, 89),
    ("Kraft Smooth Peanut Butter","Grocery & Gourmet Food", 8.79, 198),
    ("Kicking Horse Coffee, Three Sisters","Grocery & Gourmet Food", 13.24, 10),
    ("Manitoba Harvest Hemp Hearts","Grocery & Gourmet Food", 12.82, 18),
    ("Instant Pot Ultra 10-in-1","Home", 149.99, 71),
    ("black+Decker Toaster Oven","Home", 34.96, 64),
    ("Cottonelle Ultra ComfortCare Toilet Paper","Home", 12.97, 900),
    ("Digital Bathroom Scale","Home", 23.99, 481)