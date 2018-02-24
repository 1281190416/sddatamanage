<!DOCTYPE HTML>

<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
<link rel="stylesheet" href="css/bootstrap/css/bootstrap.css">
<link rel = "stylesheet" href="css/myForm.css"/>
<!--<link rel="stylesheet" href="css/myForm.css">-->

<script src="css/bootstrap/js/jquery-3.2.1.js"></script>
<script src="css/bootstrap/js/bootstrap.js"></script>
<script src="js/logon.js"></script>
<head>

    <!--元素可提供有关页面的元信息(meta-information)，比如针对搜索引擎和更新频度的描述和关键词。-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        body{background: url(/resources/img/u0.jpg) no-repeat;background-size:cover;font-size: 16px;}
    </style>
    <title>注册新账户</title>
</head>
<body>
<div class="container" style="margin-top:10%">
    <div class="row" >
        <div class="col-xs-4 col-sm-offset-4 col-sm-4 col-md-offset-4 col-md-4 col-lg-offset-4 col-lg-4" style="background-color: #dedef8;">
            <form class="form-signin" action="<c:url value="logonRegister"/>" method="post">
                <h2 class="form-signin-heading">Please sign on</h2>
                <label for="userName" class="sr-only">Email address</label>
                <input type="text" name="userName" id="userName" class="form-control"
                       value = "${userName}" placeholder="Username" onchange="checkAccount()" required autofocus>
                <label for="password1" class="sr-only">Password</label>
                <input type="password" name="password1" id="password1" class="form-control"
                       placeholder="Password" required onchange="checkPassword()">
                <label for="password2" class="sr-only">Password</label>
                <input type="password" name="password2" id="password2" class="form-control"
                       placeholder="Password" required onchange="checkPassword()">

                <button id="buttonLogon" class="btn btn-lg btn-primary btn-block"
                        type="submit" disabled="false">Sign on</button>
                <!--<button class="btn btn-lg btn-primary btn-block bottom-ele" type="reset">Reset</button>-->
            </form>
            <a href="/login.html">Already has an account?Login</a>
            <div id="msg" style="color: #b92c28; text-align: center">
                <div id="userNameMsg">${msg}</div>
                <div id="passwordMsg"></div>
            </div>
        </div>
    </div>
</div>

</body>
</html>

