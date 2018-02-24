/**
 * Created by dlw on 2017/7/25.
 */

//p_div,主体div
//p_inputParam,需要输入的参数
//p_callBack,输入完需要调用的函数
createPopDiv = function(p_div,p_inputParam,p_callBack,p_leastParamNum){
    ////////console.log('into create');
    var popDiv={
        name: p_div+"tree",
        div: p_div,
        inputBoxFade:{},
        neededParam:p_inputParam,
        returnData:[],
        callBack:p_callBack,
        leastParamNum:p_leastParamNum,
        createInputBox:function() {
            document.getElementById(this.div).innerHTML='';//清空给定的div内元素
            var v_popdiv = this;
            ////////console.log('-------------into createInputBox');
            ////////console.log(this.div+""+this.name+''+this.neededParam);
            ////////console.log(p_div+''+p_neededParam);
            var fade=createSimpleElement('div',p_div+'fade','black_overlay');//创建遮罩div
            fade.click(function(event){event.stopPropagation();});//拦截遮罩背景的单击
            var inputBox = createSimpleElement('div',p_div+'inputBox','inputBox');//创建主体输入框div
            var textDiv=createSimpleElement('div',p_div+'input',null);//创建输入框主体
            var buttonDiv=createSimpleElement('div',p_div+'btn',null);//创建两个按键的div
            for (var i = 0; i < this.neededParam.length; i++) {//追加参数要求个数对应的输入框
                var textele = createSimpleElement('input',null,null);
                textele.required="required";
                textele.type='text';
                textele.placeholder =this.neededParam[i];
                textDiv.append(textele);
            }
            var btn;
            btn = createSimpleElement('button',p_div+'btn1',p_div+'inputBox_btn')//追加第一个按键
            btn.innerHTML='确定';
            btn.onclick = function(){//绑定按键的click事件
                //document.getElementById(v_popdiv.div).checkEmpty();
                v_popdiv.checkEmpty();
            }
            buttonDiv.append(btn);
            btn = createSimpleElement('button',p_div+'btn2',p_div+'inputBox_btn')//追加第二个按键
            btn.innerHTML='取消';
            btn.onclick = function(){//绑定按键的click事件
                //document.getElementById(v_popdiv.div).closeInputBox();
                v_popdiv.closeInputBox();
            }
            buttonDiv.append(btn);
            inputBox.append(textDiv);
            inputBox.append(buttonDiv);
            inputBox.style.display='block';
            fade.style.display='block';//默认不显示
            document.getElementById(this.div).appendChild(fade);//追加到输入参数
            document.getElementById(this.div).appendChild(inputBox);
        },
        closeInputBox:function(){//隐藏元素
            document.getElementById(this.div).childNodes[0].style.display='none';
            document.getElementById(this.div).childNodes[1].style.display='none';
        },
        //负责读取输入框的数据,不能从外部调用,仅仅是由弹出框的确认按键来调用
        checkEmpty:function(){
            var hasEmpty = false;
            var inputDiv = document.getElementById(p_div+'input');
            for(var i=0; i<this.leastParamNum;i++) {
                if (inputDiv.childNodes[i].value == "") {//如果输入框有一个为空,则不合法
                    hasEmpty = true;
                }
            }
            if (hasEmpty == true)
            {
                alert('输入数据不能为空');
                return;
            }
            else {//否则把数据写入re
                this.getBoxInput();
                if(this.callBack!=undefined && this.callBack!=null){this.callBack(this.returnData);}//回调后续处理函数
                this.closeInputBox();
            }
        },

        getBoxInput:function(){
            re = [];//返回一个数组,数组可以push新的元素,object不行
            var inputDiv = document.getElementById(p_div+'input');
            for(var i=0; i<inputDiv.childElementCount;i++) {
                re.push(inputDiv.childNodes[i].value);
            }
            this.returnData=re;
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
