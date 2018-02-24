//ajax检测用户名是否存在
function CheckAccount(){
    var userName = $("#userName").val(); //获取用户名进行判断

    if(userName!=""){
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/ajaxLoginCheck",    //这里的url为Servlet配置xml文件的路径
            dataType: "json",
            data: JSON.stringify({"userName":userName}),  //获取form表单所又内容
            success: function(ma){
                console.log(ma);
                if(ma.isExist == "true" || ma.isExist =="TRUE"){
                    console.log("isExist--------------------");
                    $("#buttonSignIn").attr("disabled",false);//用户名存在才设置允许点击登录
                    $("#msg").html("");
                }else{
                    console.log("---------------------!isExist");
                    $("#buttonSignIn").attr("disabled",true);
                    $("#msg").text("用户名不存在");
                }
            }
        });

    }else{
        $("#msg").text("请输入用户名");
    }
}
