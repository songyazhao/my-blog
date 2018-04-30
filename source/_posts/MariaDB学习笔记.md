---
title: MariaDB学习笔记
date: 2018-04-30 16:00:19
tags: [MariaDB]
categories: MariaDB
---

## 启动MariaDB
> systemctl start mariadb
## 设置开机启动
> systemctl enable mariadb
##MariaDB的相关简单配置
> mysql_secure_installation

<!-- more -->

首先是设置密码，会提示先输入密码
> Enter current password for root (enter for none):<–初次运行直接回车

> Set root password? [Y/n] <– 是否设置root用户密码，输入y并回车或直接回车

> New password: <– 设置root用户的密码

> Re-enter new password: <– 再输入一次你设置的密码

> Remove anonymous users? [Y/n] <– 是否删除匿名用户，回车

> Disallow root login remotely? [Y/n] <–是否禁止root远程登录,回车,

> Remove test database and access to it? [Y/n] <– 是否删除test数据库，回车

> Reload privilege tables now? [Y/n] <– 是否重新加载权限表，回车

初始化MariaDB完成，接下来测试登录
>mysql -uroot -p [回车，之后输入密码]

## 配置MariaDB的字符集
设置客户端
> vim /etc/my.cnf.d/mysql-clients.cnf
```
[mysql]
default-character-set=utf8
```
设置服务端
> vim /etc/my.cnf.d/server.cnf
```
[mysqld]
init_connect='SET collation_connection = utf8_general_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_general_ci
skip-character-set-client-handshake

#开启慢查询
slow_query_log = ON
slow_query_log_file = /usr/local/mysql/data/slow.log
long_query_time = 1
```
全部配置完成，重启MariaDB
> systemctl restart mariadb

之后进入MariaDB查看字符集
> Mysql>SHOW VARIABLES like "%character%";

## 添加用户，设置权限
创建用户命令
> Mysql>CREATE USER username@localhost INDENTIFIED BY 'password';

直接创建用户并授权的命令
> Mysql>GRANT ALL ON \*.* TO username@localhost INDENTIFIED BY 'password';

授予外网登陆权限，但不能二级授权；
>Mysql>GRANT ALL PRIVILEGES ON \*.* TO username@'%' INDENTIFIED BY 'password';

授予权限并且可以二次授权
> Mysql>GRANT ALL PRIVILEGES ON \*.* TO username@'hostname' INDENTIFIED BY 'password' WITH GRANT OPTION;

然后刷新mysql用户权限相关表
> Mysql>FLUSH PRIVILEGES;

其中只授予部分权限把 其中 `ALL PRIVILEGES`或者`ALL`改为：
`select, insert, update, delete, create, drop, index, alter, grant, references, reload, shutdown, process, file`
其中一部分。

## 还有两个常用操作
修改指定用户密码
> Mysql>UPDATE mysql.user SET password=PASSWORD('新密码') WHERE user="test" AND host="localhost";

删除用户
> Mysql>DELETE FROM user WHERE user='test' AND host='localhost';

[CentOS系统使用yum安装MariaDB数据库](https://www.linuxidc.com/Linux/2014-11/109048.htm)
