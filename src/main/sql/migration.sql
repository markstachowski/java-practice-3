DROP DATABASE IF EXISTS products_db;
CREATE DATABASE IF NOT EXISTS products_db;

USE products_db;

CREATE TABLE products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    price DOUBLE NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT UNSIGNED,
    PRIMARY KEY (id)
);
