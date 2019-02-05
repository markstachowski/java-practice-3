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
        <h1 class="text-center my-5">Welcome!</h1>
        <div class="row">
            <div class="col">
                <a href="/products" class="btn btn-primary btn-block">
                    View The Products
                </a>
            </div>
            <div class="col">
                <a href="/products/create" class="btn btn-primary btn-block">
                    Create a Product
                </a>
            </div>
        </div>
    </div>
</body>
</html>
