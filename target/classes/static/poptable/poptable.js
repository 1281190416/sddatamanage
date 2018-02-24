/**
 * Created by dlw on 2017/7/25.
 */

//p_div,主体div
//p_inputParam,需要输入的参数
//p_callBack,输入完需要调用的函数
createDisTable = function(p_div,p_inputParam,p_callBack){
    console.log('into create');
    var popDiv={
        name: p_div+"table",
        div: p_div,
        inputBoxFade:{},
        neededParam:p_inputParam,
        returnData:[],
        callBack:p_callBack,
        createDiaTable:function() {
            document.getElementById(this.div).innerHTML='';//清空给定的div内元素
            var v_poptable = this;
            ////////console.log('-------------into createInputBox');
            ////////console.log(this.div+""+this.name+''+this.neededParam);
            ////////console.log(p_div+''+p_neededParam);
            var disTable = v_poptable.createSimpleElement('div',p_div+'disTable','disTable');//创建主体输入框div

            var buttonDiv=v_poptable.createSimpleElement('div',p_div+'btn','buttondiv');//创建两个按键的div
            var btn;
            btn = v_poptable.createSimpleElement('button',p_div+'btn1',p_div+'btn')//追加第一个按键
            btn.innerHTML='编辑';
            btn.onclick = function(){//绑定按键的click事件
                v_poptable.disableEdit(false);
            }
            buttonDiv.append(btn);
            btn = v_poptable.createSimpleElement('button',p_div+'btn2',p_div+'btn')//追加第二个按键
            btn.innerHTML='保存';
            btn.onclick = function(){//绑定按键的click事件
                v_poptable.saveEdit();
            }
            buttonDiv.append(btn);
            btn = v_poptable.createSimpleElement('button',p_div+'btn3',p_div+'btn')//追加第三个按键
            btn.innerHTML='取消';
            btn.onclick = function(){//绑定按键的click事件
                v_poptable.cancelEdit();
            }
            buttonDiv.append(btn);
            disTable.append(buttonDiv);


            var textDiv=v_poptable.createSimpleElement('div',p_div+'input',null);//创建输入框主体
            for (var i = 0; i < this.neededParam.length; i++) {//追加参数要求个数对应的输入框
                var mergeInputDiv = v_poptable.createSimpleElement('span',null,'mergeInput');//一个提示+一个输入
                var textele = v_poptable.createSimpleElement('span',null,'singleInput1');//单行,显示名称用,
                textele.innerHTML=this.neededParam[i].name;//注入名称到提示框
                mergeInputDiv.append(textele);//加入
                //textele=v_poptable.createSimpleElement('br',null,null);
                //mergeInputDiv.append(textele);//加入
                textele = v_poptable.createSimpleElement('input',null,'singleInput2');//创建输入框
                textele.required="required";
                textele.type='text';
                //textele.placeholder =this.neededParam[i].description;//加入当前元素的描述
                textele.value=this.neededParam[i].description;
                textele.readOnly=true;//设置只读
                textele.setAttribute('uid',this.neededParam[i].id);//内嵌当前元素的id,为了读取使用
                mergeInputDiv.append(textele);//加入显示格
                textDiv.append(mergeInputDiv);//加入到textDiv中
            }
            disTable.append(textDiv);
            disTable.style.display='block';
            document.getElementById(this.div).appendChild(disTable);
        },
        disableEdit:function(trueOrFalse){//隐藏元素
            var mergeInputDiv = document.getElementsByClassName('mergeInput');
            ////console.log(mergeInputDiv);
            ////console.log(mergeInputDiv.length);
            for(var i=0; i<mergeInputDiv.length; i++) {
                ////console.log(mergeInputDiv[i].childNodes[1]);
                mergeInputDiv[i].childNodes[1].readOnly = trueOrFalse;
            }
        },
        //负责读取输入框的数据,不能从外部调用,仅仅是由弹出框的确认按键来调用
        saveEdit:function(){
            //否则把数据写入returnData
            this.writeBoxInput();
            if(this.callBack!=undefined && this.callBack!=null){this.callBack(this.returnData);}//回调后续处理函数
            this.disableEdit(true);
        },

        writeBoxInput:function(){
            var re = [];//返回一个数组,数组可以push新的元素,object不行
            var mergeInputDiv = document.getElementsByClassName('mergeInput');
            var neededParam = this.neededParam;
            //console.log(neededParam);
            //console.log(mergeInputDiv);
            //console.log(mergeInputDiv.length);
            //console.log(neededParam.length);
            for(var i=0; i<mergeInputDiv.length;i++) {
                (function(i){
                    //console.log(i);
                    //console.log(neededParam[i].id);
                    re.push({'id':neededParam[i].id,'description':mergeInputDiv[i].childNodes[1].value});
                    //console.log(re);
                })(i);
            }
            this.returnData=re;
            //console.log(this.returnData);
        },

        cancelEdit:function(){
            var mergeInputDiv = document.getElementsByClassName('mergeInput');
            for(var i=0; i<mergeInputDiv.length; i++) {
                mergeInputDiv[i].childNodes[1].value=this.neededParam[i].description;;//清空内容
            }
            this.disableEdit(true);
        },

        createSimpleElement:function(p_type,p_id,p_class) {
            var element = document.createElement(p_type);
            if (p_id!=undefined)
                element.id = p_id;
            if (p_class!=undefined)
                element.className = p_class;
            return element;
        },
    };
    return popDiv;
}
