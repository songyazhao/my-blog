---
title: Mac安装php-redis操作步骤以及遇到的问题记录
date: 2019-12-19 11:47:26
tags: [php-redis, redis]
categories: PHP
---

这几天用自己的Mac折腾PHP, 需要用到php-redis, 安装时候遇到诸多问题, 特此记录

<!-- more -->

```bash
# 克隆php-redis到本机电脑
➜  /Users/Zero/Downloads git clone  https://github.com/phpredis/phpredis.git

# 进入到 `phpredis` 目录
➜  /Users/Zero/Downloads cd phpredis

# 运行下面的命令
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ /usr/bin/phpize

# 出现下面的错误提示, 是因为缺少 m4
grep: /usr/include/php/main/php.h: No such file or directory
grep: /usr/include/php/Zend/zend_modules.h: No such file or directory
grep: /usr/include/php/Zend/zend_extensions.h: No such file or directory
Configuring for:
PHP Api Version:
Zend Module Api No:
Zend Extension Api No:
autom4te: need GNU m4 1.4 or later: /usr/bin/m4

# 执行 `brew install m4` 进行安装
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ brew install m4

# 安装完m4后, 此时如果还不行, 在执行下面的命令安装一下 `command line`
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ xcode-select --install

# 执行下面命令后去sdk路径
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ xcrun --show-sdk-path

# 得到路径
/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk

# 接着执行
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ ln -s /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include /usr/include

# 可能会出现下面提示
ln: /usr/include: Read-only file system

# 新版MacOs 分离了系统文件和用户访问, 系统文件都被mount到了只读分区
# 解决办法: 1、禁止ISP.  2、在终端输入 `sudo mount -uw /` 这个命令是把分区mount成可写模式, 这个命令在系统重启后失效
# 之后在执行 `ln -s 那一步的命令`
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ sudo mount -uw /

# 然后
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ /usr/bin/phpize
Configuring for:
PHP Api Version:         20180731
Zend Module Api No:      20180731
Zend Extension Api No:   320180731

# 执行完上一步，我们就有了 configure 配置文件了，接下来配置
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ ./configure --with-php-config=/usr/bin/php-config

# 接下来是编译和安装
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ make
➜  /Users/Zero/Downloads/phpredis git:(develop) ✗ make install

# 配置php的配置文件php.ini（具体放在那里可以用 `whereis php.ini` 或者 `php --ini` 来查看）

# php -m  #查询php的扩展

# 重启php-fpm, 重启nginx使redis扩展生效
➜  /etc sudo killall php-fpm
➜  /etc sudo php-fpm
➜  /etc sudo nginx -s reload
```
