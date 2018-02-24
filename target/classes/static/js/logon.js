
function checkAccount(){
    var userName = $("#userName").val(); //获取用户名进行判断
    if(userName.length<4 && userName!=""){
        $("#userNameMsg").text("用户名长度不能少于4");
    }
    else if(userName!=""){
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/logonCheckUserName",    //这里的url为Servlet配置xml文件的路径
            dataType: "json",
            data: JSON.stringify({"userName":userName}),  //获取form表单所又内容
            success: function(ma){
                console.log(ma);
                if(ma.isExist == "true" || ma.isExist =="TRUE"){
                    $("#userNameMsg").text("用户名被占用");
                }else{
                    $("#userNameMsg").text("用户名可以使用");
                }
            }
        });
    }else{
        $("#userNameMsg").text("请输入用户名");
    }
}

function checkPassword(){
    var password1 = $("#password1").val(); //获取密码
    var password2 = $("#password2").val();
    if(password1!=password2){
        console.log("pass1!=pass2--------------------");
        $("#passwordMsg").text("两次密码不同");
        $("#buttonLogon").attr("disabled", true);
        return false;
    }
    else if(password1.length<6 || password2.length<6){
        $("#passwordMsg").text("密码不能少于6位");
        $("#buttonLogon").attr("disabled", true);
    }
    else{
        console.log("pass1==pass2--------------------");
        $("#passwordMsg").text("");
        $("#buttonLogon").attr("disabled", false);
    }
}
