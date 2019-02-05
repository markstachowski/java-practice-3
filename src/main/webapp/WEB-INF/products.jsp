<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <jsp:include page="/WEB-INF/partials/head.jsp">
        <jsp:param name="title" value="Welcome to my site!" />
    </jsp:include>
</head>
<body>
<jsp:include page="/WEB-INF/partials/navbar.jsp" />
<div class="container">
    <h1 class="my-3 text-center">Products</h1>
    <table class="table">
        <thead>
        <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${products}" var="product">
            <tr>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.quantity}</td>
                <td>
                    <form action="/products/delete" method="post">
                        <input type="hidden" name="product_id" value="${product.id}">
                        <input class="btn btn-danger btn-sm" type="submit" value="Delete">
                    </form>
                </td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
</div>
</body>
</html>
