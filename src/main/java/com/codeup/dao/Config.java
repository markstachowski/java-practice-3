package com.codeup.dao;

public class Config {

    public String getUrl() {
        return "jdbc:mysql://localhost/products_db?serverTimezone=CST";
    }

    public String getUser() {
        return "root";
    }

    public String getPassword() {
        return "codeup";
    }
}
