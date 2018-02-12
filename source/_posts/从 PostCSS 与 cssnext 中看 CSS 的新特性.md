---
title: 从 PostCSS 与 cssnext 中看 CSS 的新特性
date: 2018-01-18 17:53:26
tags: [css]
categories: css相关
---

今天刚好看了一下 PostCSS，看到了 [postcss-cssnext](http://cssnext.io/) 的网站，觉得用来学习一些新特性（虽然现在来看似乎不怎么新）。

先来介绍一下 PostCSS 与 Sass / Less / Stylus 相比的区别，也就是后处理器和预处理器的区别。

### 预处理器与后处理器
对于预处理器（Sass / Less / Stylus）而言，就像 JavaScript 的方言语法 coffeescript，或者 HTML 的方言语法 pug(jade) 那样，你需要学习一套新的不同的语法，这些 CSS 方言通过编译器编译成 CSS 文件，最终浏览器实现解析。
<!-- more -->

而 PostCSS 可以让你无缝迁移到现代化的 CSS 中，本身并没有任何功能，只由 postcss 的 plugin 来实现相关的功能，也就是说，等到浏览器实现了，你随时可以去掉这个插件，由原生浏览器来解析，而预处理器则是全家桶。

### postcss-cssnext

cssnext 提供了一些最新的 CSS 语法支持，让你不用担心于浏览器是否支持这些特性，因此，配合 postcss 实用，就取得了最佳的效果。

### 特性列表

*   自动提供浏览器前缀支持
*   自定义属性与 `var()` 支持
*   自定义属性集合与 `@apply` 支持
*   简化的、更安全的 `calc()`
*   可自定义的媒体查询
*   媒体查询范围
*   自定义选择器
*   嵌套
*   `image-set()`
*   `color()`
*   `hwb()`
*   `gray()`
*   `#rrggbbaa` 颜色
*   `rgba()` 的降级方案
*   `rebeccapurple` 颜色
*   `font-variant` 属性
*   `filter` 属性
*   `initial` 值
*   `rem` 单位的降级方案
*   `:any-link` 伪类
*   `:mathces` 伪类
*   `:not` 伪类
*   `::` 伪元素语法的降级方案
*   `overflow-wrap` 属性的降级方案
*   不区分大小写的属性
*   功能增强的 `rga()`
*   功能增强的 `hsl()`
*   `system-ui` 字体

### 功能介绍

说了这么多，然而我们还是不知道，这些功能到底是用来干嘛的，所以凑合翻译一下……

#### 自动提供浏览器前缀支持

自动添加（以及删除过时 / 没用的前缀），由 [autoprefixer](https://github.com/postcss/autoprefixer) 实现。

#### 自定义属性与 `var()` 支持

自定义属性的当前转换旨在提供一种限定在 `:root` 选择器中、面向未来的、由原生 CSS 自定义属性提供的新特性。

使用特性：
```css
  :root {
    --mainColor: red;
  }

  a {
    color: var(--mainColor);
  }`
```

注：仅限 `:root` 选择器来定义变量。

**W3C 官方特性**：[规范](https://www.w3.org/TR/css-variables/) | [插件文档](https://github.com/postcss/postcss-custom-properties)

#### 自定义属性集合与 `@apply` 支持

允许你在已命名的自定义属性中存储一套变量，然后在其他类型规则中引用它。
```css
  :root {
    --danger-theme: {
      color: white;
      background-color: red;
    };
  }

  .danger {
    @apply --danger-theme;
  }
```

注：仅限 `:root` 选择器来定义变量。

[规范](https://tabatkins.github.io/specs/css-apply-rule) | [插件文档](https://github.com/pascalduez/postcss-apply)

#### 简化的、更安全的 `calc()`

使用优化预分析 `var()` 引用来允许你更安全的用 `calc()` 使用自定义变量。
```css
  :root {
    --fontSize: 1rem;
  }

  h1 {
    font-size: calc(var(--fontSize) * 2);
  }
```

[规范](https://github.com/MoOx/reduce-css-calc#readme) | [插件文档](https://github.com/postcss/postcss-calc)

#### 可自定义的媒体查询

一个更好的方法来实现语义化的媒体查询。
```css
  @custom-media --small-viewport (max-width: 30em);
  /* check out media queries ranges for a better syntax !*/

  @media (--small-viewport) {
    /* styles for small viewport */
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/mediaqueries-5/#custom-mq) | [插件文档](https://github.com/postcss/postcss-custom-media)

#### 媒体查询范围

允许用 `&lt;=` 和 `&gt;=` 来取代 `min` 和 `max`（使得语法更具有可读性）。
```css
  @media (width &gt;= 500px) and (width &lt;= 1200px) {
    /* your styles */
  }

  /* or coupled with custom media queries */
  @custom-media --only-medium-screen (width &gt;= 500px) and (width &lt;= 1200px);

  @media (--only-medium-screen) {
    /* your styles */
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/mediaqueries/#mq-ranges) | [插件文档](https://github.com/postcss/postcss-media-minmax)

#### 自定义选择器

允许你创造自己的选择器
```css
  @custom-selector :--button button, .button;
  @custom-selector :--enter :hover, :focus;

  :--button {
    /* styles for your buttons */
  }
  :--button:--enter {
    /*
      hover/focus styles for your button

      Read more about :enter proposal
      http://discourse.specifiction.org/t/a-common-pseudo-class-for-hover-and-focus/877
      */
  }
```

 **W3C 官方特性**：[规范](https://drafts.csswg.org/css-extensions/#custom-selectors) | [插件文档](https://github.com/postcss/postcss-custom-selectors)

#### 嵌套

允许你使用嵌套选择器。
```css
  a {
    /* direct nesting (&amp; MUST be the first part of selector)*/
    &amp; span {
      color: white;
    }

    /* @nest rule (for complex nesting) */
    @nest span &amp; {
      color: blue;
    }

    /* media query automatic nesting */
    @media (min-width: 30em) {
      color: yellow;
    }
  }
```

[规范](http://tabatkins.github.io/specs/css-nesting/) | [插件文档](https://github.com/jonathantneal/postcss-nesting)

#### `image-set()` 函数

允许你根据不同的用户设备来提供不同的图片解决方案。
```css
  .foo {
    background-image: image-set(url(img/test.png) 1x,
                                url(img/test-2x.png) 2x,
                                url(my-img-print.png) 600dpi);
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/css-images-3/#image-set-notation) | [插件文档](https://github.com/SuperOl3g/postcss-image-set-polyfill)

#### `color()` 函数

一个颜色函数来修改颜色（转换为 `rgba()`）
```css
  a {
    color: color(red alpha(-10%));
  }

  a:hover {
    color: color(red blackness(80%));
  }
```

有很多颜色修饰符，记得看看[这个链接](https://github.com/postcss/postcss-color-function#list-of-color-adjuster)

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/css-color/#modifying-colors) | [插件文档](https://github.com/postcss/postcss-color-function)

#### `hwb()` 函数

与 `hsl()` 相似，不过更容易阅读。（会转换为 `rgba()`）
```css
  body {
    color: hwb(90, 0%, 0%, 0.5);
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/css-color/#the-hwb-notation) | [插件文档](https://github.com/postcss/postcss-color-hwb)

#### `gray()` 函数

允许你使用超过 50 种渐变的灰度值（转换为 `rgba()`），对于第一个参数，你可以使用一个 0 - 255 的数值或者百分比。
```css
  .foo {
    color: gray(85);
  }

  .bar {
    color: gray(10%, 50%);
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/css-color/#grays) | [插件文档](https://github.com/postcss/postcss-color-gray)

#### rrggbbaa 颜色值

允许使用 4 位或者 8 位十六进制数来表示颜色（转换为 `rgba()`）
```css
  body {
    background: #9d9c;
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/css-color/#hex-notation) | [插件文档](https://github.com/postcss/postcss-color-hex-alpha)

#### `rgba()` 的降级方案

如果你使用的是旧的浏览器（比如 IE8），那么把 `rgba()` 转换为实体颜色。
```css
  body {
    background: rgba(153, 221, 153, 0.8);
    /* you will have the same value without alpha as a fallback */
  }
```

**W3C 官方特性**：[规范](http://www.w3.org/TR/css3-color/) | [插件文档](https://github.com/postcss/postcss-color-rgba-fallback)

#### `rebeccapurple` 颜色

允许你使用新的颜色关键词。
```css
  body {
    color: rebeccapurple;
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/css-color/#valdef-color-rebeccapurple) | [插件文档](https://github.com/postcss/postcss-color-rebeccapurple)

#### `font-variant` 属性

通过 `font-feature-settings` 降级的一种属性。你可以通过[这个链接](http://caniuse.com/#feat=font-feature)来查看浏览器支持
```css
  h2 {
    font-variant-caps: small-caps;
  }

  table {
    font-variant-numeric: lining-nums;
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/css-fonts/#propdef-font-variant) | [插件文档](https://github.com/postcss/postcss-font-variant)

#### filter 属性

W3C 的 filters 只允许使用 `url(data:*)` 来转换 svg filter。
```css
  .blur {
      filter: blur(4px);
  }
```

**W3C 官方特性**：[规范](http://www.w3.org/TR/filter-effects/) | [插件文档](https://github.com/iamvdo/pleeease-filters)

#### initial 值

允许你使用任何值的初始值。该值表示属性初始化值所指定的值，但这并不意味着浏览器的默认值。

比如，对于 display 属性，initial 时钟标示内联，因为这是属性指定的初始值。一个例子，`div { display: initial }` 并不代表 `block`，而是 `inline`。
```css
  div {
    display: initial; /* inline */
  }
```

杀手级特性：一次性初始化所有属性
```css
  div {
    all: initial; /* use initial for ALL PROPERTIES in one shot */
  }
```

**W3C 官方特性**：[规范](http://www.w3.org/TR/css3-values/#common-keywords) | [插件文档](https://github.com/maximkoretskiy/postcss-initial)

#### rem 单位

在旧浏览器里将 rem 降级为 px（比如 IE8）。
```css
  h1 {
    font-size: 1.5rem;
  }
```

**W3C 官方特性**：[规范](http://www.w3.org/TR/css3-values/#rem-unit) | [插件文档](https://github.com/robwierzbowski/node-pixrem)

#### `:any-link` 伪类

允许你使用 `:any-link` 伪类。(只要有 `:link` 或者 `:visited` 都在 `:any-link` 的范围内）
```css
  nav :any-link {
    background-color: yellow;
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/selectors/#any-link-pseudo) | [插件文档](https://github.com/jonathantneal/postcss-pseudo-class-any-link)

#### `:matches` 伪类

允许你使用 `:matches` 伪类（可以看作 or 选择）
```css
  p:matches(:first-child, .special) {
    color: red;
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/selectors-4/#matches) | [插件文档](https://github.com/postcss/postcss-selector-matches)

#### `:not` 伪类

允许你使用支持多选择器的 `:not` 伪类，将此降级为只支持一个选择器的 `:not`。
```css
  p:not(:first-child, .special) {
    color: red;
  }
```

**W3C 官方特性**：[规范](http://dev.w3.org/csswg/selectors-4/#negation) | [插件文档](https://github.com/postcss/postcss-selector-NOT)

#### `::` 伪元素语法降级

如果你的浏览器是旧浏览器，会将 `::` 降级为 `:`。
```css
  a::before {
    /* ... */
  }
```

**W3C 官方特性**：[规范](http://www.w3.org/TR/css3-selectors/#pseudo-elements) | [插件文档](https://github.com/axa-ch/postcss-pseudoelements)

#### `overflow-wrap` 属性

将 `overflow-wrap` 转换为 `word-wrap` 属性（考虑到许多浏览器只支持 `word-wrap`）。
```css
  body {
    overflow-wrap: break-word;
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/css-text-3/#propdef-word-wrap) | [插件文档](https://github.com/MattDiMu/postcss-replace-overflow-wrap)

#### 不区分大小写的属性

允许你使用不区分大小写的属性。
```css
  [frame=hsides i] {
    border-style: solid none;
  }
```

**W3C 官方特性**：[规范](https://www.w3.org/TR/selectors4/#attribute-case) | [插件文档](https://github.com/Semigradsky/postcss-attribute-case-insensitive)

#### 功能增强的 `rga()`

允许你使用由空格分割的参数与可选的由斜线分割的不透明度新语法。

你也可以使用数字来表示颜色通道。

alpha 值接受百分比和数字，并且将 `rgb()` 作为可选参数。因此 `rgb()` 和 `rgba()` 现在是彼此的别名。
```css
  div {
    background-color: rgb(100 222.2 100.9 / 30%);
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/css-color/#rgb-functions) | [插件文档](https://github.com/dmarchena/postcss-color-rgb)

#### 功能增强的 `hsl()`

允许你使用由空格分割的参数与可选的由斜线分割的不透明度新语法。

`hsl()` 现在接受角度（`deg`, `grad`, `rad`, `turn`）以及用数字表示色调，用百分比或者数字来表示 alpha 值。所以 `hsl()` 与 `hsla()` 现在也是彼此的别名。
```css
  div {
    color: hsl(90deg 90% 70%);
    background-color: hsl(300grad 25% 15% / 70%);
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/css-color/#the-hsl-notation) | [插件文档](https://github.com/dmarchena/postcss-color-hsl)

#### `system-ui` 字体

允许你使用 `system-ui` 通用字体系列。当前转换提供了一个实际的字体列表来作为降级方案。
```css
  body {
    font-family: system-ui;
  }
```

**W3C 官方特性**：[规范](https://drafts.csswg.org/css-fonts-4/#valdef-font-family-system-ui) | [插件文档](https://github.com/JLHwung/postcss-font-family-system-ui)

### 写在最后

今天的博客好长，虽然我也知道翻译的很垃圾 T^T。通过这个列表，我们也能理解和阅读到一些新的特性了。

### 参考资料

*   [PostCSS及其常用插件介绍](http://www.css88.com/archives/7317)
*   [postcss-cssnext features](http://cssnext.io/features/)