USE products_db;

TRUNCATE products;

INSERT INTO products(name, price, quantity) VALUES
('Hammer', 20, 1),
('Drill', 100, 2),
('Mower', 200, 3),
('Screwdriver', 10, 4);
