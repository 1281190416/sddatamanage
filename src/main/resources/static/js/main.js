/**
 * Created by dlw on 2017/7/19.
 */

//全局产品列表树和全局产品详情树
var tree_item_list;
var tree_item_detail;
//Tree Context Menu Structure,用于产品列表的页面的树的右键目录
var context_menu_prod_list = {
    'context1': {
        elements: [//这个elements不能改变
            {
                text: '删除当前产品',
                action: function (node) {
                    if(window.confirm('确定要删除当前产品？')) {
                        var id = node.uid;
                        var nextDisId;
                        var item = {
                            "id": id,
                            "layer": 1,
                            "name": "name",
                            "description": "des"
                        };
                        if (node.parent.childNodes.length > 1 && node.parent.childNodes[0].uid != node.uid) {//有其他产品且第0个不是当前,则删除后显示第0个产品
                            nextDisId = node.parent.childNodes[0].uid;
                        }
                        else if (node.parent.childNodes.length > 1) {//有其他产品且第0个是当前,则删除后显示第1个产品
                            nextDisId = node.parent.childNodes[1].uid;
                        }
                        else {//没有其他产品,则使用null交有后台处理
                            nextDisId = null;
                        }
                        deleteItem(item);//向后台发起删除请求, delete中调用了删除节点方法, 重新刷新两棵树
                        getTopItem();
                        getItemDetail(nextDisId);
                        getLeaf(nextDisId);
                        //node.removeNode();//删除当前树中的节点
                        //这边刷新出错是因为ajax 异步请求出错

                    }
                },

            },
            {
                text: '查看产品详细信息',
                action: function (node) {
                    getItemDetail(node.uid);//向后台请求更新产品详情树
                    getLeaf(node.uid);
                },

            },
            {
                text: '修改节点名称',
                action: function(node){
                    setNameDescription(node.uid);
                },
            },
        ]
    }
};
// 在加载结束时自动调用该函数加载产品列表
// 在这个函数里面调用了displayTree来创建并显示产品列表
// 调用getTreeItem来显示第一个产品树节点
window.onload=function(){
    getTopItem();
    getItemDetail(1);//调用显示第一个产品的详情
    getLeaf(1);
};
//获取顶层产品列表,并且调用显示
function getTopItem(){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/topItem",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        data:null,//JSON.stringify({"userName":userName}),  //获取form表单所又内容
        success: function(data){
            if(data.length>0) {//如果产品列表不为空,则
                console.log('getTopItem');
                tree_item_list=displayItemTree(tree_item_list,'div_prod_list', data,context_menu_prod_list);//调用显示所有产品
                $.each(data, function (i, item) {
                    ////////console.log(item);
                });
            }
        },
        error: function(text) {}
    });
}


//Tree Context Menu Structure,用于产品详情页面的树的右键目录
var context_menu_prod_detail = {
    'context1': {
        elements: [//这个elements不能改变
            {
                text: '删除当前节点及其子节点',
                //icon: 'aimaraJS_master/images/delete.png',
                action: function (node) {
                    if(window.confirm('确定要删除该项及其子项？')) {
                        var id = node.uid;
                        var nextDisId;
                        if(id.length==1) var layer = 1;//如果是顶层节点, 那么就需要刷新详情树和列表树
                        var item = {
                            "id": id,
                            "layer": layer,
                            "name": "name",
                            "description": "des"
                        };
                        //console.log(item);
                        //node.removeNode();
                        deleteItem(item);//delete的success方法中调用了刷新请求
                        getTopItem();//每次删除之后都要更新两棵树,只有delete是在这里调用更新的
                        console.log(tree_item_detail.childNodes);
                        getItemDetail(tree_item_detail.childNodes[0].childNodes.length==0?1:tree_item_detail.childNodes[0].uid);//向后台请求更新产品详情树,总是显示当前产品,如果为空了,那就显示空的
                        getLeaf(tree_item_detail.childNodes[0].childNodes.length==0?1:tree_item_detail.childNodes[0].uid);//向后台请求更新产品详情树,总是显示当前产品,如果为空了,那就显示空的
                    }
                },
                /*submenu: {
                 elements: [
                 {
                 text: 'Toggle Node',
                 icon: 'aimaraJS_master/images/leaf.png',
                 action: function (node) {
                 node.toggleNode();
                 }
                 },
                 {
                 text: 'Expand Node',
                 icon: 'aimaraJS_master/images/leaf.png',
                 action: function (node) {
                 node.expandNode();
                 }
                 },
                 {
                 text: 'Collapse Node',
                 icon: 'aimaraJS_master/images/leaf.png',
                 action: function (node) {
                 node.collapseNode();
                 }
                 },
                 {
                 text: 'Expand Subtree',
                 icon: 'aimaraJS_master/images/tree.png',
                 action: function (node) {
                 node.expandSubtree();
                 }
                 },
                 {
                 text: 'Collapse Subtree',
                 icon: 'aimaraJS_master/images/tree.png',
                 action: function (node) {
                 node.collapseSubtree();
                 }
                 },
                 {
                 text: 'Delete Node',
                 icon: 'aimaraJS_master/images/delete.png',
                 action: function (node) {
                 node.removeNode();
                 }
                 },
                 ]
                 }*/
            },
            {
                text: '插入一个子条目',
                //icon: 'aimaraJS_master/images/blue_key.png',
                action: function (node) {
                    var name = prompt("新增条目名称");
                    var description = prompt("新增条目详细");
                    //console.log(name);
                    //console.log(description);
                    if(name==null || name == "" ||name==undefined) return;
                    else {
                        var id = node.uid + "." + (node.childNodes.length + 1);
                        item = {
                            "id": id,
                            "layer": 0,
                            "name": name,
                            "description": description
                        };
                        insertItem(item);//调用函数向后台写入
                        //node.createChildNode(item.id, item.name, false, null, null, 'context1');//修改前台树
                    }
                },
                /*
                 submenu: {

                 elements: [
                 {
                 text: 'Create Child Node',
                 icon: 'aimaraJS_master/images/add1.png',
                 action: function (node) {
                 node.createChildNode('Created', false, 'aimaraJS_master/images/folder.png', null, 'context1');
                 }
                 },
                 {
                 text: 'Create 1000 Child Nodes',
                 icon: 'aimaraJS_master/images/add1.png',
                 action: function (node) {
                 for (var i = 0; i < 1000; i++)
                 node.createChildNode('Created -' + i, false, 'aimaraJS_master/images/folder.png', null, 'context1');
                 }
                 },
                 {
                 text: 'Delete Child Nodes',
                 icon: 'aimaraJS_master/images/delete.png',
                 action: function (node) {
                 node.removeChildNodes();
                 }
                 }
                 ]
                 }*/
            },
            {
                text: '修改节点名称',
                action: function(node){
                    setNameDescription(node.uid);
                },
            },
        ]
    }
};

function SepTopID(idin){
    var id = idin;
    var i;
    for(i=0; i<id.length; i++){
        if(idin[i]==".") return id.substring(0,i);
    }
    return id;
}

//根据节点的id获取子树并显示在中间部分,getTreeItem中调用displayTree来实现真正的树显示
function getItemDetail(id){
    //如果没有给出id,则应该是页面刚载入的时候,这时候将由服务器决定显示哪一个产品的信息
    if(id==null || id=="" || id==undefined){id='randomId';}//向服务器发送约定用随便的一个产品号
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/treeItemById",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        data:JSON.stringify({"id":id}),  //获取form表单所又内容
        success: function(data){
            //console.log(data);
            if(data.length>0) {
                tree_item_detail = displayItemTree(tree_item_detail,'div_prod_detail', data, context_menu_prod_detail);
                //displayTree(data,'div_prod_list');//可以通过传入不同的div id来获取多棵树
            }
        },
        error: function(text) {}
    });
}
//最终的树显示, 调用了Animara.js插件,paren_div是页面用来显示tree的div,treeData是要显示的数据
//显示数据的节点格式必须为{"id":id,"layer":layer:"layer",description:"description"}
//而且这些数据必须是以layer进行了深度优先组织的,
function displayItemTree(treeHandle,parent_div,treeData,context_menu) {
    treeHandle = createTree(parent_div,'red', context_menu);//已经删除了css中的node背景色,这里的red不会起作用
    /*treeData = [//测试用数据
     {id: '1', name: 'n1', layer: 1, description: 'd1'},
     {id: '1.1', name: 'n1.1', layer: 2, description: 'd1.1'},
     {id: '1.1.1', name: 'n1.1.1', layer: 3, description: 'd1.1.1'},
     {id: '1.2', name: 'n1.2', layer: 2, description: 'd1,2'},
     {id: '2', name: 'n2', layer: 1, description: 'd2'},
     {id: '2.1', name: 'n2.1', layer: 2, description: 'd2.1'},
     {id: '2.2', name: 'n2.2', layer: 2, description: 'd2.2'},
     ];*/
    var curData, lastNode, lastData;
    for (var i = 0; i < treeData.length; i++) {
        curData = treeData[i];
        //createNode: function(p_uid,p_text,p_expanded, p_icon, p_parentNode,p_tag,p_contextmenu);
        if (curData.layer == 1) {//设置为null,不加入icon,如果是顶层节点
            lastNode = treeHandle.createNode(""+curData.id,curData.name+' '+curData.description, true, null, null, null, 'context1');
        }
        else {
            if (curData.layer == lastData.layer + 1) {
                lastNode = lastNode.createChildNode(""+curData.id, curData.name+' '+curData.description, true, null, null, 'context1');
            }
            else {
                for (var j = lastData.layer - curData.layer + 1; j > 0; j--) lastNode = lastNode.parent;//向上追溯父节点
                lastNode = lastNode.createChildNode(""+curData.id, curData.name+' '+curData.description, true, null, null, 'context1');
            }
        }
        lastData = curData;
    }
    //Rendering the tree
    console.log('displayItemTree');
    treeHandle.drawTree();
    return treeHandle;
};

//插入某个节点的ajax通信函数
function insertItem(item){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/insertItem",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        async:false,//设置同步
        data:JSON.stringify(item),  //获取form表单所又内容
        success: function(data){
            ////////console.log(data);
        },
        error: function(text) {}
    });
    getTopItem();//每次删除之后都要更新两棵树
    ////console.log(SepTopID(item.id));
    getItemDetail(SepTopID(item.id));
    getLeaf(SepTopID(item.id));
}

//删除某个节点(及其子节点)的ajax通信函数
function deleteItem(item){//这个不能作为异步请求
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/deleteItem",    //这里的url为Servlet配置xml文件的路径
        async: false,//设置为同步, 禁止其他请求同时进行
        dataType: "json",
        data:JSON.stringify(item),  //获取form表单所又内容
        success: function(data){
            ////////console.log(data);
        },
        error: function(text) {}
    });
    // 没有把删除后的重新读取放在这里是因为delete item之后仅仅依赖item是无法判定接下来显示什么
}

//--------------------------------------------------------------------------------------------------------------------
//新建产品,使用自定义弹窗获取参数
//使用方式
//1.定义发起后台请求的ajax函数addTopItemByPopDiv,注意这个函数里面需要完成请求完成后的刷新功能
//2.定义一个全局的popdiv1,作为全局的弹出输入框;主页内定义一个div:popdivbox作为入参
//3.根据addTopItemPopDiv的请求参数列表定义需要的参数列表数组inputPara
//4.创建弹窗createPopDiv,并createInputBox
//--------------------------------------------------------------------------------------------------------------------
/*//这一段是最开始直接把弹出框写在这里进行的,函数调度非常乱,而且污染全局变量名称
//插入一个产品
function addTopItem(){
    var item={};
    item["name"]=newProdParam[0];
    item["description"]=newProdParam[1];
    item["layer"]=1;
    item["id"]=tree_item_list.childNodes.length+1;//基于所有产品的id是紧密排列的前提,理论上这里最好先做一步从数据库读取的工作
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/addTopItem",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        data:JSON.stringify(item), //读取内容
        success: function(data){
            ////////console.log(data);
            if(data.msg=="insert succeed") getTopItem();//刷新界面的list列表
        },
        error: function(text) {}
    });
}
//--------------------------------------


$(document).ready(function () {//这里调用创建遮罩和输入框的函数
    $('#addNewProd').click(function(){
        createInputBoxForNewItem();
    });
});

//这是专门针对新建产品的窗帘输入框的函数
function createInputBoxForNewItem(){
    var needParam = ["产品名称","产品描述"];
    createInputBox(needParam);
}

// 动态创建输入框
var newProdParam;
function createInputBox(data) {
    var inputBox = $('#inputBox');
    inputBox.parent().click(function(event){event.stopPropagation();});//拦截遮罩的单击
    var i;
    var childDiv=$('#text_input_div');
    childDiv.html('');
    for (i = 0; i < data.length; i++) {
        childDiv.append('<span><input type="text" required="required" id="inputBox_' + i + '" placeholder="' + data[i] + '"/></span>');
    }
    inputBox.show();//显示fade背景
    $('#inputBoxFade').show();//显示fade背景
}

//负责读取输入框的数据
function getBoxInput(){
    newProdParam = [];//返回一个数组,数组可以push新的元素,object不行
    $('.inputBox input').each(function () {
        newProdParam.push($(this).val());
    });
}

// 与读取输入框数据相关的函数
$(document).ready(function() {//等文档加载完成以后
    $('#boxBtn1').click(function () {
        var hasEmpty = false;
        $('.inputBox input').each(function () {
            if ($(this).val() == "") {//如果输入框有一个为空,则不合法
                hasEmpty = true;
            }
        });
        if (hasEmpty == true) alert('输入数据不能为空');
        else {//否则把数据写入re
            getBoxInput();
            addTopItem();
            $('#inputBox').hide();
            $('#inputBoxFade').hide();//显示fade背景
        }
    });
    $('#inputBox').delegate('#boxBtn2', 'click', function () {//动态绑定,不过这里貌似没必要
        $('#inputBox').hide();
        $('#inputBoxFade').hide();//显示fade背景
    });
});
*/
// 发起插入请求,将作为参数传递, 用来向服务器发起新建一件产品的数据, 同时刷新list
function addTopItemByPopDiv(datain){
    var item={};
    item["name"]=datain[0];
    item["description"]=datain[1];
    item["layer"]=1;
    item["id"]=tree_item_list.childNodes.length+1;//基于所有产品的id是紧密排列的前提,理论上这里最好先做一步从数据库读取的工作
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/addTopItem",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        async: false,
        data:JSON.stringify(item), //读取内容
        success: function(data){
            ////////console.log(data);
            ////////if(data.msg=="insert succeed") getTopItem();//刷新界面的list列表
        },
        error: function(text) {}
    });
    //console.log(SepTopID(item.id));
    getTopItem();//每次删除之后都要更新两棵树
    getItemDetail(item.id);
    getLeaf(item.id);
}
// 使用自定义输入弹窗
var popDiv1;//定义一个弹窗变量
$(document).ready(function () {//这里调用创建遮罩和输入框的函数
    $('#addNewProdByPop').click(function(){
        //console.log('before create');//仅用于调试
        var inputPara = ["产品名称","产品描述"];//要求的输入参数描述
        //var inputPara =[];
        popDiv1 = createPopDiv('popdivbox1',inputPara,addTopItemByPopDiv,1);//html页面预留div id, 要求的参数, 回调函数
        //popDiv1 = createPopDiv('popdivbox1',inputPara,null);//仅用于测试
        popDiv1.createInputBox();
    });
});

//-------------------------------------------------------------------------------------------------------------------
// 使用自定义输入弹窗
var poptable1;//定义一个Table

// 这是一个被表格调用的函数, 直接作为参数传递, 用来项服务器发送读取到的表格数据
function readLeafTable(datain){
    var itemArray=[];
    var item={};
    for(var i=0; i<datain.length; i++){
        (function(i){
            item={};
            item["id"]=datain[i].id;//根据id修改description,不对layer和name进行改动
            item["description"]=datain[i].description;
            item["layer"]=0;
            item["name"]='';
            itemArray.push(item);
        })(i);
    }
    console.log(itemArray);
     $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/ModifyLeaf",    //这里的url为Servlet配置xml文件的路径
         async: false,
        dataType: "json",
        data:JSON.stringify(itemArray), //读取内容
        success: function(data){
            ////////console.log(data);
            ///////if(data.msg=="modified succeed") getTopItem();//刷新界面的list列表
        },
        error: function(text) {},
    });
    getTopItem();
    ////console.log(SepTopID(item.id));
    getItemDetail(SepTopID(item.id));
    //这里不要调用获取叶节点是因为修改是直接在文本框内进行的
}

// 从服务器读取叶节点, 生成表格
function getLeaf(id){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/leafItem",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        data:JSON.stringify({"id":id}),  //获取form表单所又内容
        success: function(data){
            if(data.length>0) {//如果产品列表不为空,则
                ////////console.log(data);
                poptable1 = createDisTable('poptable1',data,readLeafTable);//html页面预留div id, 要求的参数, 回调函数readLeafTable写入数据库
                //popDiv1 =('popdivbox',inputPara,null);//仅用于测试
                poptable1.createDiaTable();
                //$.each(data, function (i, item) {
                //});
            }
        },
        error: function(text) {}
    });
}

/*
$(document).ready(function () {
    $('#addpoptable').click(function(){
        //console.log('before create');//仅用于调试
        var inputPara = [
            {'id':1+'','name':'n1','description':'d1'},
            {'id':2+'','name':'n2','description':'d2'},
            {'id':3+'','name':'n3','description':'d3'},
        ];//要求的输入参数描述
        //var inputPara =[];
        poptable1 = createDisTable('poptable1',inputPara,null);//html页面预留div id, 要求的参数, 回调函数
        //popDiv1 =('popdivbox',inputPara,null);//仅用于测试
        poptable1.createDiaTable();
    });
});
*/
// 对于表格需要三个数据 id, name , description

//---------------------------------------------------------------------------------------------------------------------

function modifyNameDescription(datain){
    var item={};
    item["name"]=datain[0];
    item["description"]=datain[1];
    item["layer"]=1;
    item["id"]=popDiv2_id;//由于popDiv设计不合理,只能借助全局参数来弥补了
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/prod/ModifyNameDescription",    //这里的url为Servlet配置xml文件的路径
        dataType: "json",
        async: false,//设置为同步, 禁止其他请求同时进行
        data:JSON.stringify(item), //读取内容
        success: function(data){
            console.log(data);
            ////////console.log(data);
            ////////if(data.msg=="modify ND succeed") getTopItem();//刷新界面的list列表
        },
        error: function(text) {}
    });
    //在ajax之后在发起其他ajax请求更新显示
    getTopItem();
    console.log(SepTopID(item.id));
    getItemDetail(SepTopID(item.id));
    getLeaf(SepTopID(item.id));
}


// 使用自定义输入弹窗
var popDiv2;//定义一个弹窗变量
var popDiv2_id;//定义一个回调函数需要的参数, 这里是接口设计不合理的地方, 应该把这些进一步封装在popDiv里面

function setNameDescription(id){
    popDiv2_id = id;
        //console.log('before create');//仅用于调试
    var inputPara = ["节点名称","节点描述"];//要求的输入参数描述
        //var inputPara =[];
    popDiv2 = createPopDiv('popdivbox2',inputPara,modifyNameDescription,1);//html页面预留div id, 要求的参数, 回调函数, 必须要的参数个数
        //popDiv1 = createPopDiv('popdivbox1',inputPara,null);//仅用于测试
    popDiv2.createInputBox();
}
















