2017/07/23
1.修复目录树插件bug, 原始版本的src\main\resources\static\aimaraJS_master\lib\Aimara.js定义的目录树中类似v_tree变量是全局的, 导致一个document下无法建立两个目录树, 修改为var v_tree后可以在一个document内定义多个全局的目录树.
2.修改deleteItem删除函数, 前一版本删除节点后, 兄弟节点id不会自动填充, 修改后删除节点后兄弟节点及其子节点会自动填充
3.增加右键目录,在main.js中


2017/07/25
1.增加自定义弹出框插件,本质上是仿照前面的目录树插件
2.利用自定义弹出框插件实现增加产品
3.略微修改main界面的布局

2017/07/27+
1.加入主界面规划,前端样式

2017/07/29
1.加入末端节点详情表格
2.修改文件路径+
3.修复删除产品不刷新显示错误的bug(原因是ajax异步查询先于删除操作,这里把删除操作改为同步的,必须等删除操作完成了以后才能进行查询然后才能页面更新)

2017/07/31
1.加入修改某节点的名称和描述的方法
2.修改插入, 删除等ajax请求的bug(刷新显示出错)
3.修改目录树显示方式内容为: name+description, 对于非叶节点一般不设置description, 对于叶子节点直接显示name+description.
4.待改进: 
	-用户密码的验证, 使用session.
	-Popdiv, poptable回调参数列表的优化
	-Ajax请求队列的设计与优化
	-前端显示样式, 尤其是背景如何填满垂直方向, 响应式网页?
	
2017/09/20 答辩前
1.修复新建产品按钮bug
2.修复js字符串indexOf bug 和 SubString错误使用
