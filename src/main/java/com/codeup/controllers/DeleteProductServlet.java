package com.codeup.controllers;

import com.codeup.dao.DaoFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = "/products/delete")
public class DeleteProductServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Long id = Long.parseLong(req.getParameter("product_id"));
        DaoFactory.getProductsDao().delete(id);
        resp.sendRedirect("/products");
    }
}
