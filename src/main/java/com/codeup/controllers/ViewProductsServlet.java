package com.codeup.controllers;

import com.codeup.dao.DaoFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = "/products")
public class ViewProductsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setAttribute(
            "products",
            DaoFactory.getProductsDao().all()
        );
        req.getRequestDispatcher("/WEB-INF/products.jsp").forward(req, resp);
    }
}
