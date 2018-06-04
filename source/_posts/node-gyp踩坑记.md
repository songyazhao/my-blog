---
title: node-canvas的安装，node-gyp踩坑记
date: 2018-06-04 14:35:08
tags: [NodeJS, Npm, node-gyp, node-canvas]
categories: NodeJS
---

最近安装 [node-canvas](https://github.com/Automattic/node-canvas)，遇到一些问题，特此记录。这个模块的底层是C++编写的，用的时候时候需要 [node-gyp](https://github.com/nodejs/node-gyp#on-windows) 这个模块编译。

## `node-gyp` 依赖 `Python 2.x` 环境，和 `Visual C++` 的构建环境
所以我们先来安装这些环境依赖。

方法有二，推荐第一种，自动化配置不容易出错。

<!-- more -->

### 方法一：
使用微软提供的一个npm模块[windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)，
管理员身份运行PowerShell或CMD.exe，接下来就是等待它自动下载完安装即可。
> npm install --global --production windows-build-tools

```cmd
PS C:\WINDOWS\system32> npm install --global --production windows-build-tools

> windows-build-tools@2.3.0 postinstall D:\dev-software\NodeJs\node_modules\windows-build-tools
> node ./lib/index.js

Downloading python-2.7.14.amd64.msi
Downloading BuildTools_Full.exe
[>                                            ] 0.0% (0 B/s)
Downloaded BuildTools_Full.exe. Saved to C:\Users\Zero\.windows-build-tools\BuildTools_Full.exe.

Starting installation...
Launched installers, now waiting for them to finish.
This will likely take some time - please be patient!

Status from the installers:
---------- Visual Studio Build Tools ----------
Successfully installed Visual Studio Build Tools.
------------------- Python --------------------
Successfully installed Python 2.7
+ windows-build-tools@2.3.0
added 140 packages in 2374.301s
```

### 方法二：
手动安装环境和配置，

安装 Visual C++ 构建环境：

安装Visual Studio 2015并在安装过程中为选择Common Tools

安装Python 2.7（v3.x.x不支持），并运行 `npm config set python python2.7`

启动powershell， `npm config set msvs_version 2015`

## 现在可以全局安装 `node-gyp` 了
> npm install --global node-gyp

至此，如果你按上述任何一种方法安装成功之后，在你的项目下就可以使用 `node-canvas` 了
> npm install canvas --save

## 使用教程参考
[node-canvas模块的使用](https://blog.csdn.net/wengye1990/article/details/71120743?locationNum=9&fps=1)
