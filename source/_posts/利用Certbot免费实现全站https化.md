---
title: CentOS7.2下利用Certbot免费实现全站https化
date: 2018-10-27 15:38:20
tags: [CentOS, HTTPS, SSL]
categories: CentOS
---

昨天折腾了俩小时，把做的一个项目全站升级了 `https`，遇到一些坑点，随便写写记录一下。

## 为啥要使用 https

说白了，就是 https 更安全点，而现在的爬虫引擎甚至对 https 的站点有更高的排名和收录权，为此，必须得折腾一番啊。

## 咋部署呢

你只需要有一张被信任的 CA （ Certificate Authority ）也就是证书授权中心颁发的 SSL 安全证书，并且将它部署到你的网站服务器上。一旦部署成功后，当用户访问你的网站时，浏览器会在显示的网址前加一把小绿锁，表明这个网站是安全的，当然同时你也会看到网址前的前缀变成了 `https` ，不再是 `http` 了。

<!-- more -->

## Certbot 使用方法

1、获取 certbot 客户端

```bash
wget https://dl.eff.org/certbot-auto
chmod a+x certbot-auto
```

2、如果 nginx 有在运行需要将他停止，同时保证80端口处于未占用状态

```bash
systemctl stop nginx
```

3、生成证书

直接使用官网首页的安装方法是无法使用最新的Let's Encrypt的v2 API，这里加参数 `--server`，当有多个域名时可以在后面追加 `-d` 参数，这里我使用一个泛域名配置

```bash
./certbot-auto certonly --preferred-challenges dns --manual  -d *.example.com --server https://acme-v02.api.letsencrypt.org/directory
```

4、根据提示在域名商那里添加解析 TXT 记录

```bash
-------------------------------------------------------------------------------
Please deploy a DNS TXT record under the name
_acme-challenge.example.com with the following value:

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Before continuing, verify the record is deployed.
-------------------------------------------------------------------------------
```

5、nginx 中添加配置

```bash
server {
  # TLS 基本设置
  listen 443 ssl;
  # ssl on; # 这个配置开启后 http 和 https 就不能共存了
  ssl_session_cache shared:SSL:1m;
  ssl_session_timeout  5m;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # 证书位置
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # 证书位置
}
```

6、至此配置完成，启动 nginx

```bash
systemctl start nginx
```

## 证书续签

Let’s Encrypt 生成的免费证书为3个月时间，但是我们可以无限次续签证书

```bash
./certbot-auto renew
```
