///// Creating the tree component
// p_div: ID of the div where the tree will be rendered;
// p_backColor: Background color of the region where the tree is being rendered;
// p_contextMenu: Object containing all the context menus. Set null for no context menu;
function createTree(p_div,p_backColor,p_contextMenu) {
    ///////console.log('create tree');
    var tree = {//整棵树
        name: p_div+"tree",
        div: p_div,
        ulElement: null,
        childNodes: [],
        backcolor: p_backColor,
        contextMenu: p_contextMenu,//根的contextMenu是contex_menu
        selectedNode: null,
        nodeCounter: 0,//计数树的根顶层节点个数
        contextMenuDiv: null,
        rendered: false,
        ///// Creating a new node,创建树的节点
        // p_text: Text displayed on the node;
        // p_expanded: True or false, indicating wether the node starts expanded or not;
        // p_icon: Relative path to the icon displayed with the node. Set null if the node has no icon;
        // p_parentNode: Reference to the parent node. Set null to create the node on the root;
        // p_tag: Tag is used to store additional information on the node. All node attributes are visible when programming events and context menu actions;
        // p_contextmenu: Name of the context menu, which is one of the attributes of the p_contextMenu object created with the tree;
        createNode: function(p_uid,p_text,p_expanded, p_icon, p_parentNode,p_tag,p_contextmenu) {
            var v_tree = this;//this是指调用creatNode的对象
            ////////console.log('--createNode---');
            ////////console.log(v_tree);
            node = {//节点对象点定义,Fields和Methods
                id: 'node_' + this.nodeCounter,
                uid: p_uid,
                text: p_text,
                icon: p_icon,
                parent: p_parentNode,//父节点
                expanded : p_expanded,
                childNodes : [],
                tag : p_tag,
                contextMenu: p_contextmenu,//对于顶层节点以及子节点来说,contextMenu是里层里面的context_menu['context1']
                elementLi: null,
                ///// Removing the node and all its children
                removeNode: function() { v_tree.removeNode(this); },
                ///// Expanding or collapsing the node, depending on the expanded value
                toggleNode: function(p_event) { v_tree.toggleNode(this); },
                ///// Expanding the node
                expandNode: function(p_event) { v_tree.expandNode(this); },
                ///// Expanding the node and its children recursively
                expandSubtree: function() { v_tree.expandSubtree(this); },
                ///// Changing the node text
                // p_text: New text;
                setText: function(p_text) { v_tree.setText(this,p_text); },
                ///// Collapsing the node
                collapseNode: function() { v_tree.collapseNode(this); },
                ///// Collapsing the node and its children recursively
                collapseSubtree: function() { v_tree.collapseSubtree(this); },
                ///// Deleting all child nodes
                removeChildNodes: function() { v_tree.removeChildNodes(this); },
                ///// Creating a new child node;
                // p_text: Text displayed;
                // p_expanded: True or false, indicating wether the node starts expanded or not;
                // p_icon: Icon;
                // p_tag: Tag;
                // p_contextmenu: Context Menu;
                createChildNode: function(p_uid,p_text,p_expanded,p_icon,p_tag,p_contextmenu) { return v_tree.createNode(p_uid,p_text,p_expanded,p_icon,this,p_tag,p_contextmenu); }
            }

            this.nodeCounter++;

            if (this.rendered) {//如果这棵树还没有显示
                if (p_parentNode==undefined) {//并且父节点没有定义,也就是当前新建的节点是顶层节点
                    this.drawNode(this.ulElement,node);//使用tree的drawNode函数,ulElement就是根的<ul>,node就是顶层节点
                    this.adjustLines(this.ulElement,false);//用根节点调用调整行显示函数
                }
                else {//父节点有定义,也就不是顶层节点
                    var v_ul = p_parentNode.elementLi.getElementsByTagName("ul")[0];//用父节点的elmentLi获取ul对象
                    if (p_parentNode.childNodes.length==0) {//如果父节点还没有子节点,说明这是第一个子节点
                        if (p_parentNode.expanded) {//如果父节点展开了,设置
                            p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'block';
                            v_img = p_parentNode.elementLi.getElementsByTagName("img")[0];//改写父节点的img图标属性
                            v_img.style.visibility = "visible";
                            v_img.src = 'aimaraJS_master/images/collapse.png';
                            v_img.id = 'toggle_off';
                        }
                        else {//如果父节点没有展开
                            p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'none';
                            v_img = p_parentNode.elementLi.getElementsByTagName("img")[0];
                            v_img.style.visibility = "visible";
                            v_img.src = 'aimaraJS_master/images/expand.png';
                            v_img.id = 'toggle_on';
                        }
                    }
                    this.drawNode(v_ul,node);//画当前节点,当前节点不是跟,也不是顶层节点
                    this.adjustLines(v_ul,false);//调整当前节点
                }
            }

            if (p_parentNode==undefined) {//如果父节点没有没有定义,说明当前节点是顶层节点
                this.childNodes.push(node);//整个tree的根中加入当前节点(顶层节点)为子节点
                node.parent=this;//定义顶层节点的父节点为整个tree的根
            }
            else//如果定义了父节点,则把父节点的孩子节点中加入当前节点
                p_parentNode.childNodes.push(node);

            return node;
        },
        ///// Render the tree;
        drawTree: function() {
            //////// console.log('--drawTree---');
            ////////console.log(this);
            this.rendered = true;

            var div_tree = document.getElementById(this.div);//获取HTML界面上的容纳当前树的div id
            div_tree.innerHTML = '';

            ulElement = createSimpleElement('ul',this.name,'tree');//type, id ,class
            this.ulElement = ulElement;

            for (var i=0; i<this.childNodes.length; i++) {
                this.drawNode(ulElement,this.childNodes[i]);
            }

            div_tree.appendChild(ulElement);

            this.adjustLines(document.getElementById(this.name),true);

        },
        ///// Drawing the node. This function is used when drawing the Tree and should not be called directly;
        // p_ulElement: Reference to the UL tag element where the node should be created;
        // p_node: Reference to the node object;
        // 创建节点显示元素, 改写了当前节点的p_ulElemnt,调用了各种dbclick,rightclick,onclick事件,创建了整个树的右键目录,
        // 这个函数会被递归调用到所有子目录drawNode
        drawNode: function(p_ulElement,p_node) {
            //先从父节点和子节点创建形式描述,再写入响应鼠标动作的函数
            var v_tree = this;
            ////////console.log('--drawNode---');
            ////////console.log(v_tree);
            ////////console.log(p_node.parent);
            var v_icon = null;

            if (p_node.icon!=null)//如果定了icon,则建立id=null,src=p_node.icon,class=p_node.icon的Img元素
                v_icon = createImgElement(null,'icon_tree',p_node.icon);

            var v_li = document.createElement('li');
            p_node.elementLi = v_li;//当前节点的li元素由document直接的创建

            var v_span = createSimpleElement('span',null,'node');//创建一个span元素,该元素的class=node,span元素只是横向显示内容元素

            var v_exp_col = null;//v_exp_col是每个节点前头的+/-折叠元素

            if (p_node.childNodes.length == 0) {//如果当前节点没有子节点,
                v_exp_col = createImgElement('toggle_off','exp_col','aimaraJS_master/images/collapse.png');//创建状态为toggle_off,class=exp_col,src=...的Img元素
                v_exp_col.style.visibility = "hidden";//且v_exp_col元素隐藏
            }
            else {//如果当前节点有子节点
                if (p_node.expanded) {//且当前节点是展开的状态,则创建折叠的元素,就是在展开的情况下显示"-"折叠符号,以备折叠
                    v_exp_col = createImgElement('toggle_off','exp_col','aimaraJS_master/images/collapse.png');
                }
                else {//当前节点是折叠的状态,则创建展开Img元素以备展开
                    v_exp_col = createImgElement('toggle_on','exp_col','aimaraJS_master/images/expand.png');
                }
            }

            v_span.ondblclick = function() {//如果双击,则调用双击函数,双击折叠展开
                ////////console.log('--callDoubleClick---');
                ////////console.log(v_tree);
                v_tree.doubleClickNode(p_node);
            };

            v_exp_col.onclick = function() {//如果是单击前面的+/-图标元素,就是折叠展开p_node
                v_tree.toggleNode(p_node);
            };

            v_span.onclick = function() {//单击元素内容设置选中的节点
                v_tree.selectNode(p_node);
            };

            v_span.oncontextmenu = function(e) {//在div元素上右键单击触发打开上下文菜单
                v_tree.selectNode(p_node);//设置当前节点为选中节点
                v_tree.nodeContextMenu(e,p_node);//创建右键子目录
            };

            if (v_icon!=undefined)//如果定义了icon
                v_span.appendChild(v_icon);//在span中追加icon,例子中就是顶层的五角星

            v_a = createSimpleElement('a',null,null);//创建一个空的超链接,这个超链接就是为了给例子中最后的google元素用的
            v_a.innerHTML=p_node.text;
            v_span.appendChild(v_a);//在sapn中追加超链接
            v_li.appendChild(v_exp_col);//追加前头的元素+/-
            v_li.appendChild(v_span);//追加span内的内容元素

            p_ulElement.appendChild(v_li);//前节点的ulElement中追加v_li

            var v_ul = createSimpleElement('ul',this.name+'ul_' + p_node.id,null);//实际上就是子节点列表
            v_li.appendChild(v_ul);//v_li中追加一个ul子节点列表

            if (p_node.childNodes.length > 0) {//如果当前节点包含子节点

                if (!p_node.expanded)//如果子节点不展开,那就不显示
                    v_ul.style.display = 'none';

                for (var i=0; i<p_node.childNodes.length; i++) {//递归调用draw函数来处理子节点
                    this.drawNode(v_ul,p_node.childNodes[i]);
                }
            }
        },
        ///// Changing node text
        // p_node: Reference to the node that will have its text updated;
        // p_text: New text;
        setText: function(p_node,p_text) {
            ////////console.log('--setText---');
            ////////console.log(this);
            p_node.elementLi.getElementsByTagName('span')[0].lastChild.innerHTML = p_text;
            p_node.text = p_text;
        },
        ///// Expanding all tree nodes
        // 展开整个树
        expandTree: function() {
            ////////console.log('--expandTree---');
            ////////console.log(this);
            for (var i=0; i<this.childNodes.length; i++) {
                if (this.childNodes[i].childNodes.length>0) {
                    this.expandSubtree(this.childNodes[i]);
                }
            }
        },
        ///// Expanding all nodes inside the subtree that have parameter 'p_node' as root
        // p_node: Subtree root;
        // 展开子树
        expandSubtree: function(p_node) {
            ////////console.log('--expandSubtree---');
            ////////console.log(this);
            this.expandNode(p_node);
            for (var i=0; i<p_node.childNodes.length; i++) {
                if (p_node.childNodes[i].childNodes.length>0) {
                    this.expandSubtree(p_node.childNodes[i]);
                }
            }
        },
        ///// Collapsing all tree nodes
        // 折叠这个树
        collapseTree: function() {
            ////////console.log('--collapseTree---');
            ////////console.log(this);
            for (var i=0; i<this.childNodes.length; i++) {
                if (this.childNodes[i].childNodes.length>0) {
                    this.collapseSubtree(this.childNodes[i]);
                }
            }
        },
        ///// Collapsing all nodes inside the subtree that have parameter 'p_node' as root
        // p_node: Subtree root;
        // 递归展开树
        collapseSubtree: function(p_node) {
            ////////console.log('--collapseSubtree---');
            ////////console.log(this);
            this.collapseNode(p_node);
            for (var i=0; i<p_node.childNodes.length; i++) {
                if (p_node.childNodes[i].childNodes.length>0) {
                    this.collapseSubtree(p_node.childNodes[i]);
                }
            }
        },
        ///// Expanding node
        // p_node: Reference to the node;
        // 展开某个节点,设置当前节点的属性为展开
        expandNode: function(p_node) {
            ////////console.log('--expandNode---');
            ////////console.log(this);
            if (p_node.childNodes.length>0 && p_node.expanded==false) {
                if (this.nodeBeforeOpenEvent!=undefined)
                    this.nodeBeforeOpenEvent(p_node);

                var img=p_node.elementLi.getElementsByTagName("img")[0];

                p_node.expanded = true;

                img.id="toggle_off";
                img.src = 'aimaraJS_master/images/collapse.png';
                elem_ul = img.parentElement.getElementsByTagName("ul")[0];
                elem_ul.style.display = 'block';

                if (this.nodeAfterOpenEvent!=undefined)
                    this.nodeAfterOpenEvent(p_node);
            }
        },
        ///// Collapsing node
        // p_node: Reference to the node;
        // 折叠当前节点的直接子节点,没有递归
        collapseNode: function(p_node) {
            ////////console.log('--collapseNode---');
            ////////console.log(this);
            if (p_node.childNodes.length>0 && p_node.expanded==true) {
                var img=p_node.elementLi.getElementsByTagName("img")[0];

                p_node.expanded = false;
                if (this.nodeBeforeCloseEvent!=undefined)
                    this.nodeBeforeCloseEvent(p_node);

                img.id="toggle_on";
                img.src = 'aimaraJS_master/images/expand.png';
                elem_ul = img.parentElement.getElementsByTagName("ul")[0];
                elem_ul.style.display = 'none';

            }
        },
        ///// Toggling node
        // p_node: Reference to the node;
        // toggle当前节点
        toggleNode: function(p_node) {
            ////////console.log('--toggleNode---');
            ////////console.log(this);
            if (p_node.childNodes.length>0) {
                if (p_node.expanded)
                    p_node.collapseNode();
                else
                    p_node.expandNode();
            }
        },
        ///// Double clicking node
        // p_node: Reference to the node;
        // 双击就是toggleNode
        doubleClickNode: function(p_node) {
            this.toggleNode(p_node);
        },
        ///// Selecting node
        // p_node: Reference to the node;
        // 设置选中元素的属性,底色变化
        selectNode: function(p_node) {//单击节点内容选中这个这个节点的时候
            ////////console.log('--selectNode---');
            ////////console.log(this);
            var span = p_node.elementLi.getElementsByTagName("span")[0];
            span.className = 'node_selected';//设置该span的class=node_selected,node_selected样式由CSS样式统一规定
            ////////console.log(this);
            if (this.selectedNode!=null && this.selectedNode!=p_node)//如果整个树的节点列表里面有其他的节点处于选中状态,则要取消这个节点的选中状态
                this.selectedNode.elementLi.getElementsByTagName("span")[0].className = 'node';
            this.selectedNode = p_node;//设置整个树的被选中节点为当前节点
        },
        ///// Deleting node
        // p_node: Reference to the node;
        removeNode: function(p_node) {
            ////////console.log('--removeNode---');
            ////////console.log(this);
            var index = p_node.parent.childNodes.indexOf(p_node);

            if (p_node.elementLi.className=="last" && index!=0) {
                p_node.parent.childNodes[index-1].elementLi.className += "last";
                //p_node.parent.childNodes[index-1].elementLi.style.backgroundColor = this.backcolor;
            }

            p_node.elementLi.parentNode.removeChild(p_node.elementLi);
            p_node.parent.childNodes.splice(index, 1);

           /* if (p_node.parent.childNodes.length==0 && p_node.parent.elementLi.getElementsByTagName("img").length>0) {
                var v_img = p_node.parent.elementLi.getElementsByTagName("img")[0];
                v_img.style.visibility = "hidden";
            }*/

        },
        ///// Deleting all node children
        // p_node: Reference to the node;
        removeChildNodes: function(p_node) {
            ////////console.log('--removeChildNodes---');
            //////// console.log(this);
            if (p_node.childNodes.length>0) {
                var v_ul = p_node.elementLi.getElementsByTagName("ul")[0];

                var v_img = p_node.elementLi.getElementsByTagName("img")[0];
                v_img.style.visibility = "hidden";

                p_node.childNodes = [];
                v_ul.innerHTML = "";
            }
        },
        ///// Rendering context menu when mouse right button is pressed over a node. This function should no be called directly
        // p_event: Event triggered when right clicking;
        // p_node: Reference to the node;
        // 创建右键一级目录
        nodeContextMenu: function(p_event,p_node) {//右键触发的事件p_vent,当前节点p_node
            ////////console.log('--nodeContextMenu---');
            ////////console.log(this);
            if (p_event.button==2) {//如果p_event的右键按下
                p_event.preventDefault();//取消右键事件的默认动作
                p_event.stopPropagation();//根据DOM事件流机制，在元素上触发的大多数事件都会冒泡传递到该元素的所有祖辈元素上，如果这些祖辈元素上也绑定了相应的事件处理函数，就会触发执行这些函数。
                //使用stopPropagation()函数可以阻止当前事件向祖辈元素的冒泡传递，也就是说该事件不会触发执行当前元素的任何祖辈元素的任何事件处理函数。
                if (p_node.contextMenu!=undefined) {//如果定义了node的contextMenu,注意contexmenu是逐级继承根的p_contextMenu

                    var v_tree = this;//获取调用节点
                    ////////console.log(this);
                    var v_menu = this.contextMenu[p_node.contextMenu];//获取contextMenu,this.contextMenu[p_node.contextMenu]=tree.contex_menu['context1']
                    ////////console.log(v_menu);
                    var v_div;
                    if (this.contextMenuDiv==null) {//如果整个tree.contextMenuDiv==null,也就是之前的时候还没有node上的右键事件
                        v_div = createSimpleElement('ul',this.name+'ul_cm','menu');//那么创建一个type=<ul>,id=ul_cm,class=menu的元素
                        document.body.appendChild(v_div);//然后再整个文档追加一个v_div(右键弹出目录框)
                    }
                    else
                        v_div = this.contextMenuDiv;//如果整个tree有了右键弹出框元素,那么就直接获取

                    v_div.innerHTML = '';//先清空右键弹出框内的元素

                    var v_left = p_event.pageX-5;//定义左七点的坐标为鼠标右击点x左边5个px
                    var v_right = p_event.pageY-5;

                    v_div.style.display = 'block';//给这个弹出的右键框框设置style
                    v_div.style.position = 'absolute';
                    v_div.style.left = v_left + 'px';//写入style
                    v_div.style.top = v_right + 'px';
                    for (var i=0; i<v_menu.elements.length; i++) (function(i){//对于contex_menu['context1']中定义的右击项进行遍历, 例子中leements就两个子元素

                        var v_li = createSimpleElement('li',null,null);//创建一个li

                        var v_span = createSimpleElement('span',null,null);//创建一个span
                        v_span.onclick = function () {  v_menu.elements[i].action(p_node) };//从'context1'中获取这个action,也就是右键列表的选项事件

                        var v_a = createSimpleElement('a',null,null);//创建一个超链接a元素
                        var v_ul = createSimpleElement('ul',null,'sub-menu');//创建一个子目录,对应于例子的nodeaction和childaction

                        v_a.appendChild(document.createTextNode(v_menu.elements[i].text));//追加一个新建的text节点, 文本内容就是"Node Action"/"Child Action"

                        v_li.appendChild(v_span);//在v_li中追加上面建立的v_span

                        if (v_menu.elements[i].icon!=undefined) {//如果v_menu即右键弹出菜单没有定义icon,则新建一个icon并追加到img元素
                            var v_img = createImgElement('null','null',v_menu.elements[i].icon);
                            v_li.appendChild(v_img);
                        }

                        v_li.appendChild(v_a);//在列表项中追加超链接,超连接中是含有文本的
                        v_li.appendChild(v_ul);//在列表项中追加子列表
                        v_div.appendChild(v_li);//在右键菜单v_div中追加li元素

                        if (v_menu.elements[i].submenu!=undefined) {//如果NodeAction/ChildAction对应的子列表不为空,只有存在子目录的时候使用
                            var v_span_more = createSimpleElement('div',null,null);//创建二级右键子菜单
                            v_span_more.appendChild(createImgElement(null,'menu_img','aimaraJS_master/images/right.png'));//追加菜单图标
                            v_li.appendChild(v_span_more);//追加子菜单项
                            v_tree.contextMenuLi(v_menu.elements[i].submenu,v_ul,p_node);//调用递归创建二级子目录
                        }

                    })(i);

                    this.contextMenuDiv = v_div;//设置整个tree的右键菜单

                }
            }
        },
        ///// Recursive function called when rendering context menu submenus. This function should no be called directly
        // p_submenu: Reference to the submenu object;
        // p_ul: Reference to the UL tag;
        // p_node: Reference to the node;
        // 创建右键二级以后的子目录,这个函数是递归的,可以在右键中递归创建
        contextMenuLi : function(p_submenu,p_ul,p_node) {//p_submenu就是例子中contex_menu.contex1.elements[0/1].submenu, p_ul是右键一级子菜单传过来的参数, p_node是右键选中节点

            var v_tree = this;
            ////////.log('--contextMenuLi---');
            ////////console.log(this);
            for (var i=0; i<p_submenu.elements.length; i++) (function(i){
                //整体的过程和nodeContextMenu的主要过程是类似的
                var v_li = createSimpleElement('li',null,null);

                var v_span = createSimpleElement('span',null,null);
                v_span.onclick = function () {  p_submenu.elements[i].action(p_node) };

                var v_a = createSimpleElement('a',null,null);
                var v_ul = createSimpleElement('ul',null,'sub-menu');

                v_a.appendChild(document.createTextNode(p_submenu.elements[i].text));

                v_li.appendChild(v_span);

                if (p_submenu.elements[i].icon!=undefined) {
                    var v_img = createImgElement('null','null',p_submenu.elements[i].icon);
                    v_li.appendChild(v_img);
                }

                v_li.appendChild(v_a);
                v_li.appendChild(v_ul);
                p_ul.appendChild(v_li);

                if (p_submenu.elements[i].p_submenu!=undefined) {
                    var v_span_more = createSimpleElement('div',null,null);
                    v_span_more.appendChild(createImgElement(null,'menu_img','aimaraJS_master/images/right.png'));
                    v_li.appendChild(v_span_more);
                    v_tree.contextMenuLi(p_submenu.elements[i].p_submenu,v_ul,p_node);//递归创建子目录
                }

            })(i);
        },
        ///// Adjusting tree dotted lines. This function should not be called directly
        // p_node: Reference to the node;
        // 调整行
        adjustLines: function(p_ul,p_recursive) {
            ////////.log('--adjustLines---');
            ////////console.log(this);
            var tree = p_ul;

            var lists = [];

            if (tree.childNodes.length>0) {
                lists = [ tree ];

                if (p_recursive) {
                    for (var i = 0; i < tree.getElementsByTagName("ul").length; i++) {
                        var check_ul = tree.getElementsByTagName("ul")[i];
                        if (check_ul.childNodes.length!=0)
                            lists[lists.length] = check_ul;
                    }
                }

            }

            for (var i = 0; i < lists.length; i++) {
                var item = lists[i].lastChild;

                while (!item.tagName || item.tagName.toLowerCase() != "li") {
                    item = item.previousSibling;
                }

                item.className += "last";
                //item.style.backgroundColor = this.backcolor;

                item = item.previousSibling;

                if (item!=null)
                    if (item.tagName.toLowerCase() == "li") {
                        item.className = "";
                        item.style.backgroundColor = 'transparent';
                    }
            }
        }
    }

    /*window.onclick = function() {
        console.log('----print ?tree');
        console.log(tree.name);
        if (tree.contextMenuDiv!=null)
            tree.contextMenuDiv.style.display = 'none';
    }*/

    window.addEventListener('click',function(){//添加事件监听器
        ////////console.log('----print ?tree');
        ////////console.log(tree.name);
        if (tree.contextMenuDiv!=null)
            tree.contextMenuDiv.style.display = 'none';
    });

    return tree;
}

// Helper Functions

//Create a HTML element specified by parameter 'p_type'
//创建简单的包含id,type,class的元素
function createSimpleElement(p_type,p_id,p_class) {
    element = document.createElement(p_type);
    if (p_id!=undefined)
        element.id = p_id;
    if (p_class!=undefined)
        element.className = p_class;
    return element;
}

//Create img element
// 创建图标元素
function createImgElement(p_id,p_class,p_src) {
    element = document.createElement('img');
    if (p_id!=undefined)
        element.id = p_id;
    if (p_class!=undefined)
        element.className = p_class;
    if (p_src!=undefined)
        element.src = p_src;
    return element;
}
