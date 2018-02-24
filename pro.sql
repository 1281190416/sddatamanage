create table t_prod
(
id varchar(20) not null primary key,
layer int not null,
name varchar(30) not null,
description varchar(30)
);
insert into t_prod values("1","1","AIS网位仪w150","这是一件产品");
insert into t_prod values("2.1",2,"n2.1","d2.1");
insert into t_prod values("2.2",2,"n2.2","d2.2");
insert into t_prod values("2.3",2,"n2.3","d2.3");
insert into t_prod values("2.2.1",3,"n2.2.1","d2.2.1");
insert into t_prod values("2.3.1",3,"n2.3.1","d2.3.1");


--这个文件只是记录一些cmd下的Mysql操作,请不要直接运行这个文件



insert into t_prod values("3.1",2,"n3.1","d3.1");
insert into t_prod values("3.2",2,"n3.2","d3.2");
insert into t_prod values("3.3",2,"n3.3","d3.3");
insert into t_prod values("3.2.1",3,"n3.2.1","d3.2.1");
insert into t_prod values("3.3.1",3,"n3.3.1","d3.3.1");

create table t_user
(
id int auto_increment primary key,
name varchar(30),
password varchar(32),
isManager int
);

--修改列长度
alter table t_prod  modify column description varchar(40);

--把id="3"的行的name替换为"name3root"
update t_prod set name="name3root" where id="3";

--把'3.3%'这样的id全部替换为'3.4%'
update t_prod set id=replace(id,'3.3','3.4') where id like '3.3%';


--把数据库导出,之前可能会遇到类似于secure_file_priv的问题,那么这时候就打开安装目录下的my.ini文件,并services.msc重新启动mysql服务
select * from t_prod into outfile 'E:/programfiles/mysql5718/outputdata/t_prod.xls';
--然后再把导出的t_prod.xls转为ANSI编码,这样用excel打开就不会乱码了

--从Excel文件导入的方法,首先注意excel表的数据一定要和数据库表一一对应
--选中excel表格中的数据,复制,建立一个sourcename.txt文件,
--用notepadd++打开文件,选择菜单项:编码->转为utf8格式
--进入mysql后,进入目标表,
load data local infile 'E:/programfiles/mysql5718/outputdata/sourcename.txt' into table t_user;





