package com.codeup.controllers;

import com.codeup.dao.DaoFactory;
import com.codeup.models.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = "/products/create")
public class CreateProductServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/WEB-INF/create.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");
        Double price = Double.parseDouble(req.getParameter("price"));
        Integer quantity = Integer.parseInt(req.getParameter("quantity"));

        Product product = new Product(name, price, quantity);
        DaoFactory.getProductsDao().insert(product);

        resp.sendRedirect("/products");
    }
}
