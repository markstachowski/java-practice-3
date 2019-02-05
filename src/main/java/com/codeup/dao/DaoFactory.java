package com.codeup.dao;

public class DaoFactory {
    private static ProductsDao productsDao;
    private static Config config = new Config();

    public static ProductsDao getProductsDao() {
        if (productsDao == null) {
            productsDao = new ProductsDao(config);
        }
        return productsDao;
    }
}
