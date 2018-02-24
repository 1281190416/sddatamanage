<!DOCTYPE HTML>

<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<head>
    <!--这边的路径默认是在 resources/static/ 下的-->
    <!--login logon dependency-->
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.css">
    <link rel = "stylesheet" href="popdiv/popdiv.css"/>
    <link rel = "stylesheet" href="poptable/poptable.css"/>
    <link rel = "stylesheet" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="aimaraJS_master/css/Aimara.css">

    <!--login logon dependency-->
    <script src="css/bootstrap/js/jquery-3.2.1.js"></script>
    <script src="css/bootstrap/js/bootstrap.js"></script>

    <!--main category tree dependency-->
    <script src="aimaraJS_master/lib/Aimara.js"></script>
    <script src="js/main.js"></script>
    <script src="popdiv/popdiv.js"></script>
    <script src="poptable/poptable.js"></script>


    <title>海善达企业数据管理平台</title>
</head>
<body>

<div id="container" class="container-fluid no-padding-margin" >
    <!--<div class="col-md-12 no-padding-margin">
        <ul id="prod-layer-1">
        </ul>
    </div>-->
    <div id="header" class="row no-padding-margin">
        <div class="col-md-12 no-padding-margin">
            <img src="img/header.jpg" class="img-responsive" alt="Responsive image">
        </div>
    </div>

    <div id="content" class="row no-padding-margin">
        <!--产品列表-->
        <div id="productList" class="col-md-2 no-padding-margin" >
            <div id="productListHeader">
                <img src="img/prod_list.jpg" class="img-responsive"
                     alt="Responsive image">
            </div>
            <div id="productListContent" class="mCustomScrollbar" data-mcs-theme="minimal-dark">
                <div class="editor">
                    <button id="addNewProdByPop" type="button" class="editor btn btn-primary btn-lg font-custom">
                        &nbsp;&nbsp;&nbsp;&nbsp;新建产品&nbsp;&nbsp;&nbsp;&nbsp;
                        <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                    </button>
                </div>

                <div>
                    <div id="div_prod_list"  ></div>
                </div>
            </div>
        </div>

        <!----------------------产品树------------------------>
        <div id="productTree" class="col-md-6"style="margin: 0;padding: 0">
            <div id="productTreeHeader">
                <img src="img/prod_tree.jpg" class="img-responsive" alt="Responsive image">
            </div>
            <div id="div_prod_detail"></div>
        </div>

        <!----------------------产品信息---------------------->
        <!--产品信息-->
        <div id="productInfo" class="col-md-4"style="margin: 0;padding: 0;height: 100%">
            <div id="productInfoHeader">
                <img src="img/prod_info.jpg" class="img-responsive" alt="Responsive image">
            </div>
            <div id="poptable1" ></div><!---->

        </div>
    </div>
</div>



<!--专门用于弹出框进行数据输入-->
<div id="inputBoxFade" class="black_overlay" style="display:none">
    <div id="inputBox" class="inputBox" style="display:none">
        <div id="text_input_div"></div>
        <div>
            <button id="boxBtn1">确认</button>
            <button id="boxBtn2">取消</button>
        </div>
    </div>
</div>
<!--这里的div只是作为一个输入参数,调用弹出右键框的时候会用-->
<div id="popdivbox1">
</div>
<div id="popdivbox2">
</div>

</body>
</html>