---
title: 30分钟Stylus进阶
date: 2015-12-21 14:25:04
tags: [Stylus, CSS]
categories: CSS
---
写CSS，最繁琐的就是每个属性都要写冒号`:`，分号`;`，每个选择器都要带花括号`{}`。一次触键时间可能非常短，但是每行都要重复地输入一些符号，肯定会增加编码时间。后来出现了Less和Sass这些预编译语言，却依然没有减少这些冗余符号的输入，从这点上来说，我真的很不明白它们怎么会起Less这样的名字，也奇怪为什么它们这么火。（好吧，需要承认的是，能nesting，能写mixin和function等等的确是减少了时间，而且这些都发生在Stylus出生以前）
<!-- more -->

Stylus就是我一直在找的东西。

既然是预编译，当然在写的时候写得越少越好。引用一下官网语法：

```stylus
    body
      color white
```

对，就是这么简单。所以基本语法不再多做介绍，可以自行到[Stylus官网](http://learnboost.github.io/stylus/)查阅。这里要记录的是Stylus的一些巧妙用法，可以大大地方便开发，提升编码速度。

## 文件/模块引入和文件路径速配（@import &amp; globbing）

在Stylus中引入文件或模块非常简单，就是使用`@import`。

引入文件：
```stylus
    /* 假设variables.styl放在styl目录下 */
    @import 'styl/variables'    /* 如果是stylus文件，不需要写后缀 */
```

引入模块：
```stylus
    /* 假设项目中已安装nib模块 */
    @import 'nib'
```

引入文件时，你可能会有过这样的经历：
```stylus
    @import 'styl/variables'
    @import 'styl/animation'
    @import 'styl/mixins'
    ......
```

一个个文件地import，文件一多起来，其实也挺烦人。除了要保证自己没少引入文件，还要保证自己没拼错单词…… 但是在Stylus里，可以这样写：
```stylus
    @import 'styl/*'
```

这样，在`styl`文件夹下的所有文件都会被自动引入了。一秒解决所有烦恼。

## 有用的自带Function（Built-in Function）

**rgba(color | r,g,b,a)**

直接告诉`rgba`方法你需要的颜色和透明度，它帮你搞定。
```stylus
    rgba(#ffcc00, 0.5)
    /* rgba(255,204,0,0.5) */
```
跟颜色相关的方法还有很多，次于`rgba`的常用方法，个人来说可能会是`lighten(color, amount)` 和 `darken(color, amount)`在做一些`hover`或点击事件效果的时候会挺有用。

**pathjoin(…)**
路径拼接让引入图片变得非常简单。比方说，可以自己写一个方法：
```stylus
    bgImg(name)
        background-image url(pathjoin('images/' + name + '.png'))
    bgImg(banner) /* =>  background-image: url("images/banner.png"); */
```

## CSS3扩展模块nib

如果说，Stylus让写css变得更简便，那nib绝对让写Stylus更简便。[官方文档在此](http://tj.github.io/nib/)。里面的每一个方法，都是提升编码速度的利器。

**Position mixins**

以前，我们这样写position：
```stylus
    position absolute
    top 0
    left 0
```

有了nib以后：

```stylus
    /* top, left都为0时 */
    absolute top left
    /* top, left 有值时 */
    absolute 10px 5px
```

**border**

以前，我们这样写border：
```stylus
    border: 1px solid red;
```

有了nib以后：

```stylus
    border red
```

**auto-prefix**

用个less还是sass，还要找个auto-prefixer？nib直接帮你搞定，以`border-radius`为例（更多用法请参考官方文档）：

```stylus
    button
      border-radius 5px
    /* 输出：*/
    button {
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
```

**Ellipsis**

找个方法对于永远没有办法记住单行缩略的几个属性的我来说，简直就是天大的福音！

```stylus
    button
      overflow ellipsis
    /* 输出：*/
    button {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
```
**Reset**

像下面这样写，就可以获得基本的reset或normalize，如何可以不爱它？

```stylus
    reset-html5()
    or
    normalize-html5()
```

## 与gulp配合使用

`gulpfile.js`这样写：
```JavaScript
    var gulp         = require('gulp');
    var stylus       = require('gulp-stylus');
    var nib          = require('nib');
    gulp.task('stylus', function () {
        gulp.src('styl/*.styl')
            .pipe(stylus(
                { use: [nib()] }  /* 直接调用nib，就可以一并编译 */
            ))
            .pipe(gulp.dest('css/'))
    });
```

## 转自

[Stylus进阶](https://levblanc.github.io/2015/08/29/advance-stylus-in-30-min/)
