---
title: 盘点JavaScript里好用的原生API
date: 2015-6-10 15:25:22
tags: [JS技巧, 原生API]
categories: JS
---
这段时间翻了一番JavaScript的api，发现不少好的轮子，省去造的麻烦了。
<!-- more -->
直接进入正题

### 解析 **字符串对象**

我们都知道，JavaScript对象可以序列化为JSON，JSON也可以解析成对象，但是问题是如果出现了一个既不是JSON也不是对象的"东西"，转成哪一方都不方便，那么eval就可以派上用场
```JavaScript
    var obj = "{a:1,b:2}";   // 看起来像对象的字符串
    eval("("+ obj +")");     // {a: 1, b: 2}
```
因为 eval 可以执行字符串表达式，我们希望将 obj 这个字符串对象 执行成真正的对象，那么就需要用eval。但是为了避免eval 将带 **{ }** 的 obj 当语句来执行，我们就在obj的外面套了对 **( )**，让其被解析成表达式。

### **&** (按位与)

判断一个数是否为2的n次幂，可以将其与自身减一相与
```JavaScript
    var number = 4;
    (number & number -1) === 0;  // true
```

### **^** (按位异或)

不用第三个变量，就可以交换两个变量的值
```JavaScript
    var a = 4,b = 3;
        a = a ^ b;  //7
        b = a ^ b;  //4
        a = a ^ b;  //3
```

### **~** (按位非)

检索字符串，再也不用 str.indexOf('x') != -1 了
```JavaScript
    var str = 'xiaoma'
    !!~str.indexOf('xiao');  // true
```

### 格式化 **Date**

想得到format后的时间？现在不用再get年月日时分秒了，两步搞定
```JavaScript
    var temp = new Date();
    (temp.toLocaleDateString() + ' ' + temp.toLocaleTimeString().slice(2)).replace(/\//g, '-');  // "2015-5-7 9:04:10"
```

想将format后的时间转换为时间对象？直接用Date的构造函数
```JavaScript
    new Date("2015-5-7 9:04:10");
    // Thu May 07 2015 09:04:10 GMT+0800 (CST)
    //经测试发现火狐没法对format后的时间字符串使用Date.parse(),故这个方法在火狐上不好使
```

想将一个标准的时间对象转换为unix时间戳？valueOf搞定之
```JavaScript
    (new Date).valueOf();  // 1431004132641
```

许多朋友还提醒了这样可以快速得到时间戳
```JavaScript
    +new Date;  // 1431004132641
```

或者这样
```JavaScript
    Date.now();  // 1431004132641
```

### 一元加

一元加可以快速将字符串的数字转换为数学数字，即
```JavaScript
    var number = "23";
    typeof number;  // string
    typeof +number; // number
```

可以将时间对象转为时间戳
```JavaScript
    new Date;  //  Tue May 12 2015 22:21:33 GMT+0800 (CST)
    +new Date; //  1431440459887
```

## 转义 **URI**

需要将url当做参数在路由中传递，现在转义之
```JavaScript
    var url = encodeURIComponent('http://segmentfault.com/questions/newest');
    // "http%3A%2F%2Fsegmentfault.com%2Fquestions%2Fnewest"
```

再反转义
```JavaScript
    decodeURIComponent(url); // http://segmentfault.com/questions/newest
```

## Number

希望保留小数点后的几位小数，不用再做字符串截取了，toFixed拿走
```JavaScript
    number.toFixed();     // "12346"
    number.toFixed(3);    // "12345.679"
    number.toFixed(6);    // "12345.678900"
```
参数范围为0~20，不写默认0

## 类型检测

typeof是使用最频繁的类型检测手段
```JavaScript
    typeof 3;        // "number"
    typeof "333";    // "string"
    typeof false;    // "boolean"
```

对于基本（简单）数据类型还是挺好的，但是一旦到了引用数据类型的时候，就不那么好使了
```JavaScript
    typeof new Date();   // "object"
    typeof [];           // "object"
    typeof {};           // "object"
    typeof null;         // "object"
```

前三个还能忍，null居然也返回object，你是在逗我吗！！！（ps：其实这是JavaScript的bug 人艰不拆 ꒰･◡･๑꒱ ）
这时，我们会使用instanceof
```JavaScript
    toString instanceof Function;  // true
    (new Date) instanceof Date;    // true
    [] instanceof Object;          // true
    [] instanceof Array;           // true
```
其实我们可以发现，[] 和 Object得到了true，虽然我们知道，[]也是对象，但是我们希望一个能更准确的判断类型的方法，现在它来了

使用Object.prototype.toString()来判断，为了让每一个对象都能通过检测，我们需要使用Function.prototype.call或者Function.prototype.apply的形式来调用
```JavaScript
    var toString = Object.prototype.toString;

    toString.call(new Date);    // "[object Date]"
    toString.call(new Array);   // "[object Array]"
    toString.call(new Object);  // "[object Object]"
    toString.call(new Number);  // "[object Number]"
    toString.call(new String);  // "[object String]"
    toString.call(new Boolean); // "[object Boolean]"
    toString.call(null);        // "[object Null]"
    toString.call(undefined);   // "[object Undefined]"
```
要注意的是：toString方法极有可能被重写，所以需要使用的时候，
可以直接使用Object.prototype.toString()方法

## 实现继承

看一个官方给的例子
```JavaScript
    //Shape - superclass
    function Shape() {
      this.x = 0;
      this.y = 0;
    }

    Shape.prototype.move = function(x, y) {
        this.x += x;
        this.y += y;
        console.info("Shape moved.");
    };

    // Rectangle - subclass
    function Rectangle() {
      Shape.call(this); //call super constructor.
    }

    Rectangle.prototype = Object.create(Shape.prototype);

    var rect = new Rectangle();

    rect instanceof Rectangle //true.
    rect instanceof Shape //true.

    rect.move(1, 1); //Outputs, "Shape moved."
```
通过call来获取初始化的属性和方法，通过Object.create来获取原型对象上的属性和方法

## 迭代

ES5出了挺多的迭代函数，如map，filter，some，every，reduce等，这里有传送门，可以看到挺多的例子

[JavaScript:侃侃Array的应用场景](http://segmentfault.com/a/1190000002687651)

## Array

具体的api这里介绍的很详细。

[Array - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

这里就提几句：

1. **pop,push,reverse,shift,sort,splice,unshift** 会改变原数组
2. **join,concat,indexOf,lastIndexOf,slice,toString** 不会改变原数组
3. **map,filter,some,every,reduce,forEach这些迭代方法** 不会改变原数组

几个注意点：

1. **shift,pop** 会返回那个被删除的元素
2. **splice** 会返回被删除元素组成的数组，或者为空数组
3. **push** 会返回新数组长度
4. **some** 在有true的时候停止
5. **every** 在有false的时候停止
6. 上述的迭代方法可以在最后追加一个参数 **thisArg** ,它是执行 callback 时的 this 值。


## 原文链接

[https://segmentfault.com/a/1190000002753931](https://segmentfault.com/a/1190000002753931)
