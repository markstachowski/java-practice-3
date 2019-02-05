<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <jsp:include page="partials/head.jsp">
        <jsp:param name="title" value="Add A Product" />
    </jsp:include>
</head>
<body>
<jsp:include page="partials/navbar.jsp" />

<div class="container">
    <form class="col-md-8 offset-md-2" method="post" action="/products/create">
        <h1 class="my-4">Add a Product</h1>
        <div class="form-group">
            <label for="name">Name</label>
            <input class="form-control" type="text" id="name" name="name" />
        </div>
        <div class="form-group">
            <label for="price">Price</label>
            <input class="form-control" type="number" step="0.01" id="price" name="price" />
        </div>
        <div class="form-group">
            <label for="quantity">Quantity</label>
            <input class="form-control" type="number" step="1" id="quantity" name="quantity" />
        </div>
        <input class="btn btn-block btn-primary" type="submit" value="Submit" />
    </form>
</div>

</body>
</html>
