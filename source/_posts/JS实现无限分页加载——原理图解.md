---
title: JS实现无限分页加载——原理图解
date: 2016-07-15 16:16:22
tags: [无限分页, scrollTop]
categories: JS相关
---
由于网页的执行都是单线程的，在JS执行的过程中，页面会呈现阻塞状态。因此，如果JS处理的数据量过大，过程复杂，可能会造成页面的卡顿。传统的数据展现都以分页的形式，但是分页的效果并不好，需要用户手动点击下一页，才能看到更多的内容。

有很多网站使用 无限分页 的模式，即网页视窗到达内容底部就自动加载下一部分的内容。。。

本篇就无限分页的实现模型，讲述其中奥妙。
<!-- more -->
## 原理图

实现无限分页的过程大致如下：

1. 视窗滚动到底部

2. 触发加载，添加到现有内容的后面。

因此，可能会出现两种情况：

1. 当页面的内容很少，没有出现滚动条。

2. 当页面的内容很多，出现了滚动条。

针对这两种情况，需要理解几个概念：

scrollHeight即真实内容的高度；

clientHeight比较好理解，是视窗的高度，就是我们在浏览器中所能看到内容的高度；

scrollTop是视窗上面隐藏掉的部分。

![](http://images2015.cnblogs.com/blog/449064/201512/449064-20151216234331693-1773584890.png)

实现的思路：

1. 如果真实的内容比视窗高度小，则一直加载到超过视窗

2. 如果超过了视窗，则判断下面隐藏的部分的距离是否小于一定的值，如果是，则触发加载。（即滚动到了底部）

## 代码样例

代码部分没有太多的内容，需要注意的是：

1. 使用 **fixed** 定位加载框

2. 使用 **setTimeout** 定时触发判断方法，频率可以自定义

3. 通过 **真实内容高度 - 视窗高度 - 上面隐藏的高度 < 20**，作为加载的触发条件

``` html
    <!DOCTYPE html>
    <html>
    <head>
        <title>无限翻页测试</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
        <style type="text/css">
        #spinner{
            position: fixed;
            top: 20px;
            left: 40%;
            display: block;
            color: red;
            font-weight: 900;
            background-color: rgba(80, 80, 90, 0.22);
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 100px;
            padding-right: 100px;
            border-radius: 15px;
        }
        </style>
    </head>
    <body>
        <div id="sample">
        </div>
        <div id="spinner">
            正在加载
        </div>
        <script type="text/javascript">
            var index = 0;
            function lowEnough(){
                var pageHeight = Math.max(document.body.scrollHeight,document.body.offsetHeight);
                var viewportHeight = window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight || 0;
                var scrollHeight = window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop || 0;
                // console.log(pageHeight);
                // console.log(viewportHeight);
                // console.log(scrollHeight);
                return pageHeight - viewportHeight - scrollHeight < 20;
            }

            function doSomething(){
                var htmlStr = "";
                for(var i=0;i<10;i++){
                    htmlStr += "这是第"+index+"次加载<br>";
                }
                $('#sample').append(htmlStr);
                index++;
                pollScroll();//继续循环
                $('#spinner').hide();
            }

            function checkScroll(){
                if(!lowEnough()) return pollScroll();

                $('#spinner').show();
                setTimeout(doSomething,900);

            }
            function pollScroll(){
                setTimeout(checkScroll,1000);
            }
            checkScroll();
        </script>
    </body>
    </html>
```

## 代码的运行结果以及视窗高度验证

最开始没有滚动滚动条时，上面隐藏的部分为0，视窗的高度是667（这个值是一直不变的），内容的高度为916

![](http://images2015.cnblogs.com/blog/449064/201512/449064-20151216234758709-1880154929.png)

当向下滚动了一下后，视窗的高度不变；上面隐藏的高度增加到100，即滚动条上面代表的部分。

![](http://images2015.cnblogs.com/blog/449064/201512/449064-20151216234926849-1722639107.png)

当触发加载后，视窗的高度保持变；上面隐藏的高度保持不变；文本的内容增加到1816；

![](http://images2015.cnblogs.com/blog/449064/201512/449064-20151216235051412-811968279.png)

转载自：[http://www.cnblogs.com/xing901022/p/5052780.html](http://www.cnblogs.com/xing901022/p/5052780.html)

## 参考文献

1. [height、clientHeight、scrollHeight、offsetHeight区别](http://www.cnblogs.com/yuteng/articles/1894578.html)

2. [ScrollHeight、OffsetHeight、ClientHeight](http://www.cnblogs.com/wang726zq/archive/2012/05/10/2494256.html)

3. [CSS position 属性](http://www.w3school.com.cn/cssref/pr_class_position.asp)
