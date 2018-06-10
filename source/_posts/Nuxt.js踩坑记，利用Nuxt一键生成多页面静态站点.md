---
title: Nuxt.js踩坑记，利用Nuxt一键生成多页面静态站点
date: 2018-06-05 18:06:51
tags: [Vue, Nuxt]
categories: Vue
---

<!-- 一件产品，要经历怎样的构思，才能造就不一样体验。 -->
<!-- 一份设计，要经历怎样的揣摩，才能。。 -->
<!-- 一个网页，要经历怎样的过程，才能抵达用户面前。 -->

本文结合实际项目基于 `Nuxt.js@1.4.0` 进行讲解，部分案例摘自 [Nuxt.js](https://nuxtjs.org) 官方文档。*如需转载，请标明出处。*

- [Nuxt.js简单介绍](#1)
- [为什么使用Nuxt.js?](#2)
- [项目创建](#3)
- [项目配置](#4)
  - [nuxt.config.js总览](#4.1)
  - [路由(router)](#4.2)
  - [Nuxt模块(modules)](#4.3)
  - [插件(plugins)](#4.4)
  - [页面元信息(head)](#4.5)
- [页面布局(layout)](#5)
- [状态管理(vuex)](#6)
- [一键静态化](#7)

<h2 id="1">Nuxt.js简单介绍</h2>

2016 年 10 月 25 日，[zeit.co](https://zeit.co/) 背后的团队对外发布了 [Next.js](https://zeit.co/blog/next)，一个 React 的服务端渲染应用框架。几小时后，与 Next.js 异曲同工，一个基于 Vue.js 的服务端渲染应用框架应运而生，我们称之为：Nuxt.js。

Nuxt.js 是一个基于 Vue.js 的通用应用框架。通过对客户端/服务端基础架构的抽象组织，Nuxt.js 主要关注的是应用的 UI渲染。Nuxt.js 预设了利用Vue.js开发服务端渲染的应用所需要的各种配置。

<h2 id="2">为什么使用Nuxt.js?</h2>

- SSR（服务端渲染）的页面初始加载时间显然优于单页首屏渲染
- 可以方便的对 SEO 进行管理
- 无需配置页面路由，内置 `vue-rouer`，自动依据 pages 目录结构生成对应路由配置
- 便捷的 HTML 头部标签管理（vue-meta）
- 项目结构自动代码分层
- 支持静态化（本文将着重以此展开介绍）

<!-- more -->

<h2 id="3">项目创建</h2>

为了便于大家快速使用，Nuxt.js 提供了很多模板

[starter-template](https://github.com/nuxt-community/starter-template): 基础Nuxt.js模板

[typescript-template](https://github.com/nuxt-community/typescript-template): 基于Typescript的Nuxt.js模板

[express-template](https://github.com/nuxt-community/express-template): Nuxt.js + Express

[koa-template](https://github.com/nuxt-community/koa-template): Nuxt.js + Koa

[adonuxt-template](https://github.com/nuxt-community/adonuxt-template): Nuxt.js + AdonisJS

[electron-template](https://github.com/nuxt-community/electron-template): Nuxt.js + Electron
<br>...

等等，更多的可以在这里看到 [nuxt-community](https://github.com/nuxt-community)

这里我们使用 `starter-template`，可以使用 [vue-cli](https://github.com/vuejs/vue-cli) 安装：

```bash
$ npm install -g vue-cli
$ vue init nuxt-community/starter-template nuxt-demo
$ cd nuxt-demo
$ npm install
```

生成项目结构如下：
```
nuxt-demo/
├── assets/
├── components/
│   └── AppLogo.vue
├── layouts/
│   └── default.vue
├── middleware/
├── pages/
│   └── index.vue
├── plugins/
│   └── README.md
├── static/
│   └── favicon.ico
├── store/
├── nuxt.config.js
├── package.json
└── README.md
```

可以看出来项目结构还是比较清晰的，接着我们根据业务需求在 `vue-cli` 脚手架生成的项目基础上扩展和修改出来的目录结构如下(已隐去部分文件)：
```
nuxt-demo/
├── api/                                  //- 接口
│   └── index.js
├── assets/                               //- 需要编译的静态资源，如 scss、less、stylus
│   ├── images/                           //- 图片
│   └── styles/                           //- 样式
├── build/                                //- 自定义的一些编译配置
├── components/                           //- 公用的组件
│   ├── dm-toast.vue                      //- 全局组件`dm-toast`
│   └── ...
├── data/                                 //- 静态数据
├── layouts/                              //- 布局
│   ├── components/
│   │   ├── dm-footer.vue                 //- 公用header
│   │   └── dm-header.vue                 //- 公用footer
│   └── default.vue                       //- 默认布局
├── middleware/                           //- 中间件
├── mixins/                               //- Vue mixins
├── pages/                                //- 页面
│   ├── index.vue                         //- 主页
│   └── ...
├── plugins/                              //- vue插件
│   └── dm-tracker.js/                    //- 挂载utils/tracker.js
├── static/                               //- 无需编译处理的静态资源
│   └── images/                           //- 这里存放了一些通过数据循环出来的图片
├── store/                                //- vuex
│   └── index.js
├── utils/                                //- 工具集
│   ├── index.js
│   ├── http.js                           //- axios
│   ├── tracker.js                        //- PV统计
│   └── tracker-uitl.js
├── vendor/                               //- 第三方的库和插件
│   └── index.js
├── nuxt.config.js                        //- Nuxt.js配置文件
├── seo.config.js                         //- SEO相关配置文件
├── package-lock.json                     //- npm的版本锁
├── package.json
└── README.md
```

<h2 id="4">项目配置</h2>

Nuxt.js 默认的配置涵盖了大部分使用情形，可通过 `nuxt.config.js` 来覆盖默认的配置，下面相关配置根据实际项目驱动讲解，未涉及到的配置项可查阅 [Nuxt.js](https://nuxtjs.org/api) 文档。

<h3 id="4.1">nuxt.config.js 总览</h3>

```js
module.exports = {
  //- Document Common <head>
  head: {
    meta: [
      title: '我是一个title',
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'renderer', content: 'webkit' },
      { name: 'applicable-device', content: 'pc' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { 'http-equiv': 'Cache-Control', content: 'no-transform' },
      { 'http-equiv': 'Cache-Control', content: 'no-siteapp' }
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '你的icon地址' }
    ],

    //- 这里可以写一些每个页面需要额外引入的一些js代码，比如：百度统计
    //- `alert(1)` 仅为代码示例
    script: [{
      type: 'text/javascript',
      innerHTML: `alert(1)`
    }],

    //- __dangerouslyDisableSanitizers 设置<script>中的内容不被转义。
    //- https://github.com/declandewet/vue-meta#__dangerouslydisablesanitizers-string
    __dangerouslyDisableSanitizers: ['script']
  }

  //- 页面切换的时候进度条的颜色
  loading: { color: '#77b6ff' },

  //- modules 可以用来扩展核心功能或者添加一些集成
  //- 这里使用了一个本地开发请求远端接口的反向代理模块 `@nuxtjs/proxy`
  //- https://nuxtjs.org/api/configuration-modules
  modules: [
    '@nuxtjs/proxy'
  ],

  //- 上面 modules 中配置了 '@nuxtjs/proxy' 时，此字段才会生效
  //- https://github.com/nuxt-community/proxy-module
  proxy: {
    '/api': 'http://xxx.xxx.com'
  },

  //- 在这里注册 `Vue` 的插件、全局组件或者其他的一些需要挂载到 `Vue` 原型下面的东西
  //- ssr 为 `false` 表示该文件只会在浏览器端被打包引入
  //- https://nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/dm-toast',
    { src: '~plugins/dm-tracker', ssr: false }
  ],

  //- 配置全局样式文件（每个页面都会被引入）
  //- `lang` 可以为该样式文件配置相关 loader 进行转译
  css: [
    'animate.css',
    { src: '~assets/styles/common.scss', lang: 'scss' }
  ],

  //- 配置 Nuxt.js 应用生成静态站点的具体方式。
  //- https://nuxtjs.org/api/configuration-generate
  generate: {
    //- 为动态路由添加静态化
    //- 静态化站点的时候动态路由是无法被感知到的
    //- 所以可以预测性的在这里配置
    routes: [
      '/1',
      '/2',
      '/3'
      ...
    ]
  },

  //- router 属性让你可以个性化配置 Nuxt.js 应用的路由（vue-router）
  //- https://nuxtjs.org/api/configuration-router
  router: {
    //- 中间件在每次路由切换前被调用
    middleware: 'set-env',
    //- 通过 extendRoutes 来扩展或者修改 Nuxt.js 生成的路由表配置
    extendRoutes(routes) {}
  },

  //- 编译配置
  build: {
    //- 使用 webpack-bundle-analyzer 分析并可视化构建后的打包文件
    //- 你可以基于分析结果来决定如何优化它
    analyze: true,

    //- 为客户端和服务端的构建配置进行手动的扩展处理
    //- https://nuxtjs.org/api/configuration-build#extend
    extend(config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        //- 使用 ESLint 保证代码规范
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (!isDev) {
        config.module.rules //- 覆盖默认 `url-loader` 配置
          .find((rule) => rule.loader === 'url-loader')
            .options.name = 'images/[name].[ext]?v=[hash:7]'
      }
    },

    //- 这里可以自定义打包后的文件名
    //- `hash` 项目中任何一个文件改动后就会被重新创建
    //- `chunkhash` 是根据模块内容计算出的hash值，对应的文件发生内容变动就会重新计算
    //- 生成如下：
    //- <head>
    //-   ...
    //-   <link href="//cdn.xxx.com/manifest.js?v=8d09730" rel="preload" as="script">
    //-   <link href="//cdn.xxx.com/vendor.js?v=8d09730" rel="preload" as="script">
    //-   <link href="//cdn.xxx.com/app.js?v=fea3ec0" rel="preload" as="script">
    //-   <link href="//cdn.xxx.com/pages_index.js?v=6f7b904" rel="preload" as="script">
    //-   ...
    //- </head>
    filenames: {
      manifest: 'js/manifest.js?v=[hash:7]',
      vendor: 'js/vendor.js?v=[hash:7]',
      app: 'js/app.js?v=[chunkhash:7]',
      //- `chunk` 这里这样使用编译会报错，最后面会讲解相关解决方案
      chunk: 'js/[name].js?v=[chunkhash:7]'
    },

    //- 自定义 postcss 配置
    //- https://nuxtjs.org/api/configuration-build#postcss
    postcss: [
      require('autoprefixer')({
        browsers: ['> 1%', 'last 3 versions', 'not ie <= 8']
      })
    ],

    //- 这里可以设置你的CDN地址，生成的静态资源将会基于此CDN地址加上URL前缀
    publicPath: '//cdn.xxx.com/',

    //- Nuxt.js 允许你在生成的 vendor.js 文件中添加一些模块，以减少应用 bundle 的体积
    //- 这里说的是一些你所依赖的第三方模块 (比如 axios)，或者使用频率较高的一些自定义模块
    //- https://nuxtjs.org/api/configuration-build#vendor
    vendor: [
      'axios',
      ...
    ]
  }
}
```

<h3 id="4.2">路由(router)</h3>

Nuxt.js 依据 pages 目录结构，自动生成 vue-router 模块的路由配置。

比如：
```
├── pages/
│   ├── b-case/
│   │   ├── home.vue
│   │   ├── home/
│   │   │   └── _type.vue
│   │   └── _id.vue
│   └── index.vue
```

生成路由配置如下：

```js
[
  {
    name: 'b-case-home',
    path: '/b-case/home',
    component: 'E:\\\\nuxt-demo\\\\pages\\\\b-case\\\\home.vue',
    chunkName: 'pages/b-case/home',
    children: [{
      name: 'b-case-home-type',
      path: ':type?',
      component: 'E:\\\\nuxt-demo\\\\pages\\\\b-case\\\\home\\\\_type.vue',
      chunkName: 'pages/b-case/home/_type'
    }]
  },
  {
    name: 'b-case-id',
    path: '/b-case/:id?',
    component: 'E:\\\\nuxt-demo\\\\pages\\\\b-case\\\\_id.vue',
    chunkName: 'pages/b-case/_id'
  },
  {
    name: 'index',
    path: '/',
    component: 'E:\\\\nuxt-demo\\\\pages\\\\index.vue',
    chunkName: 'pages/index'
  }
]
```

如果你想修改已有路由配置可以在 `nuxt.config.js` 中添加 `route.extendRoutes` 配置项，覆盖已有路由或者添加新的路由：

```js
module.exports = {
  ...
  router: {
    ...
    extendRoutes(routes) {
      //- `routes` 是一个包含所所有路由配置信息的参数
    }
  }
}
```

<h3 id="4.3">Nuxt模块(modules)</h3>

如果你对上述路由的配置方式不满意，想要更加个性化的自定义路由，Nuxt.js 社区提供了一款 Nuxt模块 [router-module](https://github.com/nuxt-community/router-module)

使用步骤：

首先安装这个模块
```bash
npm install @nuxtjs/router --save # OR yarn add @nuxtjs/router
```

然后在 nuxt.config.js 中添加模块名 到 `modules` 字段下：
```js
module.exports ={
  ...
  modules: [
    '@nuxtjs/router'
  ]
}
```

在项目根目录下创建 `routes.js`，并 `export` 一个方法 `createRouter `。这里有一点要记住，不能使用 `pages/` 这个目录，会和 Nuxt.js 官方的路由机制产生冲突。
```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home.vue'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Home
      }
    ]
  })
}
```
其他比较常用的 Nuxt.js 模块：

[axios-module](https://github.com/nuxt-community/axios-module)：axios模块，它将网络请求与页面的进度条集成

[proxy-module](https://github.com/nuxt-community/proxy-module)：反向代理模块，本地便捷调试远端接口

[auth-module](https://github.com/nuxt-community/auth-module)：鉴权模块

[python-module](https://github.com/nuxt-community/python-module)：用 Python 编写 Nuxt.js 应用程序

[pwa-module](https://github.com/nuxt-community/pwa-module)：把你的站点变成 [pwa](https://developers.google.com/web/progressive-web-apps/) 渐进式网络应用

配置方法比较类似，这里不作详细讲解

<h3 id="4.4">插件(plugins)</h3>

插件可以让我们向 Vue 注入一些使用率比较高的属性或者方法，这里我们讲解一个埋点的插件是如何实现的。

*在讲解埋点之前我们需要先了解一下PV的概念：PV(page view)，即页面浏览量，或点击量，PV之于网站，就像收视率之于电视。*

通过 `plugins` [配置项](#4.1)，我们可以轻而易举的在 Vue 中使用插件。同时我们需要在 `plugins` 目录下创建对应的文件，以保证配置项可以正确的加载这个文件。

> plugins/dm-tracker.js

```js
//- 将发起pv统计的方法挂载到 Vue 原型下
//- 让每个组件都能通过 `this.$tracker` 访问

import Vue from 'vue'
import { trackerPlugins } from '../utils/tracker.js'

Vue.use(trackerPlugins)
```

`utils/tracker.js` 里是一些发起 *PV* 统计所调用的代码（隐去了部分业务代码）。

> utils/tracker.js

```js
...

/**
 * 发起PV统计
 * @param {String} caFrom - ev: @ca_from
 * @param {Object} vueRouteName - vm.$route.name
 * @return {Promise} 成功`then`或者失败`catch`的回调
 */
const tracker = (caFrom, vueRouteName) => {
  ...
}

export default tracker

export const trackerPlugins = {
  install(Vue, options) {
    Vue.prototype.$tracker = tracker
  }
}
```

我们发现几乎每次初始化进入或者跳转到一个新的页面都需要调用 `this.$tracker` 这个方法，要是在每个页面文件里加岂不是很麻烦，况且如果将埋点深入到业务层后期维护更新不免产生一些不必要的繁琐，所以我们在 `layout/default.vue` 里面对 `$route` 进行监听，同时设置 watch 参数 `immediate: true`，便可针对每个页面实现这个功能。

> layout/default.vue

```js
...
  mounted() {
    //- 通过监听路由变化，得到不同页面的 pv 统计参数，同时 `immediate: true` 使得每次页面初始进来也会默认执行一次
    this.$watch('$route', ({ name }) => this.$tracker('-', name), { immediate: true })
  }
...
```

至此，就完成了一个 *PV* 统计插件。

<h3 id="4.5">页面元信息(head)</h3>

Nuxt.js 文档是这么说的：
<br>使用 `head` 方法可以设置当前页面的头部标签，在 `head` 方法里可通过 `this` 关键字来获取组件的数据，所以你可以利用页面组件的数据来个性化设置 meta 标签。为了避免子组件中的 meta 标签不能正确覆盖父组件中相同的标签而产生重复的现象，建议利用 `hid` 键为 meta 标签配一个唯一的标识编号。请阅读关于 [vue-meta](https://github.com/declandewet/vue-meta#lists-of-tags) 的更多信息。

官方示例：
```html
<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
  data () {
    return {
      title: 'Hello World!'
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  }
}
</script>
```

根据官方文档的描述，我们了解到页面里的 head 配置优先级高于 `nuxt.config.js` 中的 head，就是说同等的配置会覆盖 `nuxt.config.js` 中的 head 相关位置的配置。但是这个等同覆盖的条件是你为它设置了同一个 `hid`，它会以此作为等同替换的条件去查找相关 dom 元素进行替换。

因为项目生成的是多页面静态站点，很多页面需要配置的 meta 多少有些不一样，深入到每一个页面去写单独的配置信息不免繁琐了许多，所以我们可以在 `nuxt.config.js` 的 `head` 字段中将公用的一些 `head` 信息放在里面；所以我们是不是可以把它单独抽离出来作为一个配置文件，并和每个页面的路由名字(`$route.name`)关联起来，这样按照理想格式的 `seo.config.js` 就诞生了。

seo的配置文件写好了，接下来我们应该怎么才能注入这个配置呢，很简单，只需要在 `default.vue` 的 `head` 字段下将不同页面的配置，将他们关联起来。这样就达到了通过每个页面的路由名字(`$route.name`)来映射和渲染对应的 meta。

> layout/default.vue

```html
<template>
  <div>
    <dm-header/>
    <nuxt/>
    <dm-footer/>
  </div>
</template>

<script>
import DmHeader from './components/dm-header'
import DmFooter from './components/dm-footer'

const heads = seo => function getHeadsMap() {
  const map = {}

  for (const key in seo) {
    map[key] = seo[key].head
  }
  return map
}

const routeMapHead = heads(require('../seo.config'))

export default {
  components: { DmHeader, DmFooter },
  computed: { routeMapHead },
  head() {
    //- SEO 的中心化管理, 根据路由 `$route.name` 映射 Document  <head>
    const route = this.$route
    const head = this.routeMapHead[route.name]
    return typeof head === 'function' ? head(route) : head
  }
}
</script>
```

> seo.config.js

```js
//- 根据路由 `$route.name` 映射配置
//- path - 页面的访问路径
//- head - Document <head>，页面的元信息
module.exports = {
  'index': {
    head: {
      title: '我是首页',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'mobile-agent', content: 'format=wml; url=//该页面对应的移动端网址/' },
        { name: 'mobile-agent', content: 'format=xhtml; url=//该页面对应的移动端网址/' },
        { name: 'mobile-agent', content: 'format=html5; url=//该页面对应的移动端网址/' }
      ],
      link: [
        { rel: 'alternate', type: 'applicationnd.wap.xhtml+xml', media: 'handheld', href: '//该页面对应的移动端网址/' }
      ]
    }
  },
  //- head 可以是一个 `function`
  //- `function` 中会接收过来一个参数 `route`，表示当前页面的路由信息
  //- 可以根据这个做一些动态的配置信息
  //- 比如动态路由生成的页面中的 meta 信息，可能会根据页面内容来决定
  'name': {
    head(route) {
      const titles = {
        '1': 'ofo小黄车',
        '2': '盒马生鲜',
        '3': '顺丰速运'
      }

      return {
        title: `${titles[route.params.id]}_客户案例-斗米网`,
        meta: [
          { name: 'mobile-agent', content: `format=wml; url=//该页面对应的移动端网址${route.fullPath}` },
          { name: 'mobile-agent', content: `format=xhtml; url=//该页面对应的移动端网址${route.fullPath}` },
          { name: 'mobile-agent', content: `format=html5; url=//该页面对应的移动端网址${route.fullPath}` }
        ],
        link: [
          { rel: 'alternate', type: 'applicationnd.wap.xhtml+xml', media: 'handheld', href: `//该页面对应的移动端网址${route.fullPath}` }
        ]
      }
    }
  }
  ...
}
```

<h2 id="5">页面布局(layout)</h2>

Nuxt.js 中，抽象出来一个新的概念：layout，这样将页面划分为三层：1. layout、2. page、3. component，很方便的在多种布局方案中切换。

<!-- 页面布局图示__start -->
<style>.layout, .page, .component {border: 2px solid cornflowerblue;text-align: center;padding: 10px 0;box-sizing: border-box;}.layout {color: brown;font-size: 20px;width: 400px;}.page, .component {margin: 25px;}</style>
<div class="layout">layout<div class="page">page<div class="component">component</div><div class="component">component</div><div class="component">component</div></div></div>
<!-- 页面布局图示__end -->

在页面 `pages/*.vue` 文件中可以指定一种布局，不指定的时候会使用默认布局 `default`。

比如以下目录结构：

```
├── layouts/                              //- 布局
│   ├── components/
│   │   ├── dm-footer.vue                 //- 公用header
│   │   └── dm-header.vue                 //- 公用footer
│   ├── box.vue
│   └── default.vue                       //- 默认布局
├── pages/                                //- 页面
│   └── index.vue
```

使用 `box.vue` 的布局，`<nuxt/>` 对应页面部分，类似 Vue 的 slot

> layouts/box.vue

```html
<template>
  <div>
    <dm-header/>
    <nuxt/>
    <dm-footer/>
  </div>
</template>

<script>
import DmHeader from './components/dm-header'
import DmFooter from './components/dm-footer'

export default {
  components: { DmHeader, DmFooter }
}
</script>
```

> pages/index.vue
```html
<script>
export default {
  layout: 'box'
  ...
}
</script>
```

<h2 id="6">状态管理(vuex)</h2>

像普通的 Vue 应用一样，在 Nuxt.js 中也可以使用 `vuex`，而且无需额外 `npm install vuex --save` 和配置，只要直接在项目根目录创建 `store` 文件夹，Nuxt.js 会自动去寻找下面的 `.js` 文件，并自动进行状态树的模块划分。

Nuxt.js 支持两种使用 `store` 的方式：

普通方式：返回一个 Vuex.Store 实例，感觉很眼熟有木有

> store/index.js
```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    counter: 0
  },

  mutations: {
    increment (state) {
      state.counter++
    }
  }
})

export default store
```

模块方式：store 目录下的每个 `.js` 文件会被转换成为状态树指定命名的子模块，`index.js` 会被作为根模块

> store/index.js
```js
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}
```

> store/todos.js
```js
export const state = () => ({
  list: []
})

export const mutations = {
  toggle (state, todo) {
    todo.done = !todo.done
  }
}
```

最终渲染出来的状态树：

```js
new Vuex.Store({
  state: { counter: 0 },
  mutations: {
    increment (state) {
      state.counter++
    }
  },
  modules: {
    todos: {
      state: {
        list: []
      },
      mutations: {
        toggle (state, { todo }) {
          todo.done = !todo.done
        }
      }
    }
  }
})
```

<h3 id="7">一键静态化</h3>
使用下面的命令生成应用的静态目录和文件：

```bash
npm run generate
```

然后会在项目根目录生成 `dist` 目录，静态化后的资源都在其内(html、js、css...)

当然，在静态化的时候还是遇到了一些问题：我们有一个专门放置静态资源的 CDN 分发服务器，所以每次版本更新的时候需要版本智能更新(不然用户访问到的可能就是旧的资源)，即对应的模块内容发生改变时才去更新这个版本号，虽然可以通过 `js/[name].[chunkhash:7].js` 这样的配置实现，但是 CDN 访问到的静态资源是通过 git 控制上线的，所以这样生成的静态资源，文件名每次可能不一样，这样就会越来越多，git 需要定时清理，比较麻烦。于是才有了这样一个两全的方案：既控制了版本更新，也让文件名不产生变动。

就是如下配置：

```js
module.exports = {
  ...
  build: {
    ...
    filenames: {
      ...
      chunk: 'js/[name].js?v=[chunkhash:7]'
    }
  }
}
```

想法很丰满，现实很骨感，在 `nuxt.config.js` 中使用这样的配置静态化编译的时候会报错 `Cannot find module 'pages_index.js?v=6f7b904...`，(⊙o⊙)…经过一系列的源码追踪发现是`vue-server-renderer` 这个模块的 BUG。

虽然向官方提了相关 issue ，但是因不可抗拒的因素暂时无法修复。

`vue-server-renderer/server-plugin.js` 78行 **asset.name.match(/\.js$/)** 这个判断里的正则明显把我们设定的格式 `js/[name].js?v=[chunkhash:7]` 过滤掉了，不会走这个判断，所以我们只要想办法把这个判断条件改一下，让它走这里。发现他同文件上面有个 `isJS` 函数，这样就省事多了，我们可以直接调用。

所以我们如果改源码的话只需要把这里 **asset.name.match(/\.js$/)** 替换为 **isJS(asset.name)** 就行了。但是改源码总归不好，因为并不能保证团队其他成员的机器上模块库一致。投机取巧，既然直接修改不好，那就间接修改呗。

开始动手，先安装一个 npm 的模块：
```bash
npm install shelljs -D # OR yarn add shelljs -D
```

接着在项目下新建两个文件：

- build/nuxt-generate.js：用来执行静态化的一些命令
- build/vue-server-renderer.patch.js：给 `vue-server-renderer` 模块打补丁

> build/nuxt-generate.js
```js
const shell = require('shelljs')
const { resolve } = require('path')
const nuxt = resolve(__dirname, '../node_modules/.bin/nuxt')
const logProvider = require('consola').withScope('nuxt:generate')

shell.exec(`npm run patch`, (code, stdout, stderr) => {
  if (code !== 0) {
    logProvider.error(stderr)
  }

  //- 上面的命令执行成功之后在执行下面的命令
  shell.exec(`${nuxt} generate`)
})
```

> build/vue-server-renderer.patch.js
```js
const { resolve } = require('path')
const fs = require('fs')
const SSRJSPath = resolve(__dirname, '../node_modules/vue-server-renderer/server-plugin.js')
const consola = require('consola')
const logProvider = consola.withScope('vue:patch')

module.exports = VueSSRPatch()

/**
 * 对 `vue-server-renderer/server-plugin.js` 源码内容进行替换
 * asset.name.match(/\.js$/)
 * =>
 * isJS(asset.name)
 */
function VueSSRPatch() {
  //- 检测该模块是否存在
  if (fs.existsSync(SSRJSPath)) {
    let regexp = /asset\.name\.match\(\/\\\.js\$\/\)/
    let SSRJSContent = fs.readFileSync(SSRJSPath, 'utf8')

    //- 检测是否存在需要替换的内容(通常是指该项目在本机第一次运行)
    if (regexp.test(SSRJSContent)) {
      logProvider.start(`发现vue-server-renderer模块，开始执行修补操作！`)

      SSRJSContent = SSRJSContent.replace(regexp, 'isJS(asset.name)')
      fs.writeFileSync(SSRJSPath, SSRJSContent, 'utf8')

      logProvider.ready(`修补完毕！`)
      return true
    }

    logProvider.warn(`该模块已修补过，无需再次修补，可直接运行\`npm run dev\` 或 \`npm run gen\``)
    return false
  }

  logProvider.warn(`未发现该模块，跳出本次修复！`)
  return false
}
```

最后在 `package.json` 中 `scripts` 添加 `gen` 和 `patch` 两条命令：
```js
  "scripts": {
    "dev": "nuxt",
    "generate": "nuxt generate",
    "patch": "node build/vue-server-renderer.patch",
    "gen": "node build/nuxt-generate"
  }
```

**patch**：本机第一次运行或者更新相关模块(vue-server-renderer)时需要执行一次。

**gen**：
`npm run patch` 和 `npm run generate` 的合并命令，就是说会先后执行这两个，方便本机第一次使用。如果本机执行过 `npm run patch` 可直接 `npm run generate`，生成相关静态页。

### 本人文笔拙劣，如有描述不当，欢迎各路大神拍砖！
