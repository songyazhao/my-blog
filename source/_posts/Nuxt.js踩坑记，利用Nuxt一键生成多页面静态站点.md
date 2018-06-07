---
title: Nuxt.js踩坑记，利用Nuxt一键生成多页面静态站点
date: 2018-06-05 18:06:51
tags: [Vue, Nuxt]
categories: Vue
---

<!-- 一件产品，要经历怎样的构思，才能打造完美体验。 -->
<!-- 一份设计，要经历怎样的揣摩，才能。。 -->
<!-- 一个网页，要经历怎样的过程，才能抵达用户面前。 -->

本文结合实际项目进行讲解，部分案例摘自 [Nuxt.js](https://zh.nuxtjs.org) 官方文档。

- [Nuxt.js简单介绍](#1)
- [为什么使用Nuxt.js?](#2)
- [项目创建](#3)
- [项目配置](#4)
- [页面路由(vue-router)](#5)
- [状态管理(vuex)](#6)
- [页面元信息(vue-meta)](#7)
- [埋点](#8)

<h2 id="1">Nuxt.js简单介绍</h2>

2016 年 10 月 25 日，[zeit.co](https://zeit.co/) 背后的团队对外发布了 [Next.js](https://zeit.co/blog/next)，一个 React 的服务端渲染应用框架。几小时后，与 Next.js 异曲同工，一个基于 Vue.js 的服务端渲染应用框架应运而生，我们称之为：Nuxt.js。

Nuxt.js 是一个基于 Vue.js 的通用应用框架。通过对客户端/服务端基础架构的抽象组织，Nuxt.js 主要关注的是应用的 UI渲染。Nuxt.js 预设了利用Vue.js开发服务端渲染的应用所需要的各种配置。

<h2 id="2">为什么使用Nuxt.js?</h2>

- SSR（服务端渲染）的页面初始加载时间显然优于单页首屏渲染
- 可以方便的对 SEO 进行管理
- 无需配置页面路由，内置 `vue-rouer`，自动依据 pages 目录结构生成对应路由配置。
- 便捷的 HTML 头部标签管理（vue-meta）
- 项目结构自动代码分层
- 支持静态化（本文将着重以此展开介绍）

<!-- more -->

<h2 id="3">项目创建</h2>

为了便于大家快速使用，`Nuxt.js` 提供了很多模板

[starter-template](https://github.com/nuxt-community/adonuxt-template): 基础Nuxt.js模板

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

Nuxt.js 默认的配置涵盖了大部分使用情形，可通过 `nuxt.config.js` 来覆盖默认的配置，下面相关配置根据实际项目驱动讲解，未涉及到的配置项可查阅 Nuxt.js 文档。

> nuxt.config.js

```js
module.exports = {
  //- Document Common <head>
  head: {
    meta: [
      title: '这里可以设置公用的title',
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
    script: [{
      type: 'text/javascript',
      innerHTML: `alert(1)`
    }],

    //- __dangerouslyDisableSanitizers 设置<script>中的内容不被转义。
    //- https://github.com/declandewet/vue-meta#__dangerouslydisablesanitizers-string
    __dangerouslyDisableSanitizers: ['script']
  }

  //- 切换页面的进度条颜色
  loading: { color: '#77b6ff' },

  //- modules 可以用来扩展核心功能或者添加一些集成
  //- 这里使用了一个本地开发请求远端接口的反向代理模块 `@nuxtjs/proxy`
  //- https://nuxtjs.org/api/configuration-modules
  modules: [
    '@nuxtjs/proxy'
  ],

  //- https://github.com/nuxt-community/proxy-module
  proxy: {
    '/api': 'http://xxx.xxx.com',
  },

  //- 在这里注册 `Vue` 的插件、全局组件或者其他的一些需要挂载到 `Vue` 原型下面的东西
  //- ssr 为 `false` 表示该文件只会在浏览器端被打包引入
  //- https://zh.nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/dm-toast',
    { src: '~plugins/dm-tracker', ssr: false }
  ],

  //- 配置全局样式文件（每个页面都会被引入）
  //- `lang` 可以为该样式文件配置相关 loader 进行转译
  css: [
    'animate.css',
    { src: '~assets/styles/common.scss', lang: 'scss' },
  ],

  //- 配置 Nuxt.js 应用生成静态站点的具体方式。
  //- https://zh.nuxtjs.org/api/configuration-generate
  generate: {
    //- 为动态路由添加静态化
    routes: [
      '/1',
      '/2',
      '/3'
      ...
    ]
  },

  //- router 属性让你可以个性化配置 Nuxt.js 应用的路由（vue-router）
  //- https://zh.nuxtjs.org/api/configuration-router
  router: {
    //- 中间件在每次路由切换前被调用
    middleware: 'set-env',
    //- 通过 extendRoutes 配置项来扩展 Nuxt.js 生成的路由配置
    extendRoutes(routes) {}
  },

  //- 编译配置
  build: {
    //- 使用 webpack-bundle-analyzer 分析并可视化构建后的打包文件
    //- 你可以基于分析结果来决定如何优化它
    analyze: true,

    //- 为客户端和服务端的构建配置进行手动的扩展处理
    //- https://zh.nuxtjs.org/api/configuration-build#extend
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
      chunk: 'js/[name].js?v=[chunkhash:7]'
    },

    //- 自定义 postcss 配置
    //- https://zh.nuxtjs.org/api/configuration-build#postcss
    postcss: [
      require('autoprefixer')({
        browsers: ['> 1%', 'last 3 versions', 'not ie <= 8']
      })
    ],

    //- 这里可以设置你的CDN地址，生成的静态资源将会基于此CDN地址加上URL前缀
    publicPath: '//cdn.xxx.com/',

    //- Nuxt.js 允许你在生成的 vendor.js 文件中添加一些模块，以减少应用 bundle 的体积
    //- 这里说的是一些你所依赖的第三方模块 (比如 axios)，或者使用频率较高的一些自定义模块
    //- https://zh.nuxtjs.org/api/configuration-build#vendor
    vendor: [
      'axios',
      ...
    ]
  }
}
```

<h2 id="5">页面布局(layouts)</h2>

<style>
.layout, .page, .component {
  border: 2px solid cornflowerblue;
  text-align: center;
  padding: 10px 0;
  box-sizing: border-box;
}
.layout {
  color: brown;
  font-size: 20px;
  width: 400px;
}
.page, .component {
  margin: 25px;
}
</style>
<div class="layout">
  layout
  <div class="page">
    page
    <div class="component">
      component
    </div>
    <div class="component">
      component
    </div>
    <div class="component">
      component
    </div>
  </div>
</div>


<h2 id="6">页面路由(vue-router)</h2>

Nuxt.js 依据 pages 目录结构，自动生成 vue-router 模块的路由配置。



<h2 id="7">状态管理(vuex)</h2>

像普通的 Vue 应用一样，在 Nuxt.js 中也可以使用 vuex，而且无需额外 `npm install vuex --save` 和配置，只要直接在项目根目录创建 `store` 文件夹，Nuxt.js 会自动去寻找下面的 `.js` 文件，并自动进行状态树的模块划分。

如果是 `index.js` 文件

Nuxt.js 支持两种使用 store 的方式：

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

<h2 id="8">页面元信息(vue-meta)</h2>

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

根据官方文档的描述，我们了解到页面里的 head 配置优先级高于 `nuxt.config.js` 中的 head，就是说同等的配置会覆盖 `nuxt.config.js` 中的 head 相关位置的配置。但是这个等同覆盖的条件是你为它设置了同一个 `hid`，它会以此作为等同替换的条件去查找相关 dom 元素。

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
//- 引入公共头和尾
import DmHeader from './components/dm-header'
import DmFooter from './components/dm-footer'

//- SEO 的中心化管理, 根据路由 `$route.name` 映射 Document <head>
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
        { name: 'mobile-agent', content: 'format=wml; url=//wap.xxx.com/' },
        { name: 'mobile-agent', content: 'format=xhtml; url=//wap.xxx.com/' },
        { name: 'mobile-agent', content: 'format=html5; url=//wap.xxx.com/' }
      ],
      link: [
        { rel: 'alternate', type: 'applicationnd.wap.xhtml+xml', media: 'handheld', href: '//wap.xxx.com/' }
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
          { name: 'mobile-agent', content: `format=wml; url=//wap.xxx.com${route.fullPath}` },
          { name: 'mobile-agent', content: `format=xhtml; url=//wap.xxx.com${route.fullPath}` },
          { name: 'mobile-agent', content: `format=html5; url=//wap.xxx.com${route.fullPath}` }
        ],
        link: [
          { rel: 'alternate', type: 'applicationnd.wap.xhtml+xml', media: 'handheld', href: `//wap.xxx.com${route.fullPath}` }
        ]
      }
    }
  }
  ...
}
```

<h2 id="8">插件(plugins)</h2>

插件可以让我们向 Vue 注入一些使用率比较高的属性或者方法，这里我们来看一下一个埋点的插件是如何实现的。

*在讲解埋点之前我们需要先了解一下PV的概念：PV(page view)，即页面浏览量，或点击量，PV之于网站，就像收视率之于电视。*

通过Nuxt提供的 `plugins` 配置项，我们可以轻而易举的在 `Vue` 中使用插件。相关配置项见上方 [项目配置](#4)。

同时我们需要在 `plugins` 目录下创建对应的文件，以保证配置项可以正确的加载这个文件。

> plugins/dm-tracker.js

```js
//- 将发起pv统计的方法挂载到Vue原型下
//- 让每个组件都能通过`this.$tracker`访问

import Vue from 'vue'
import { trackerPlugins } from '../utils/tracker.js'

Vue.use(trackerPlugins)
```

又是一次涉及每一个页面都有的操作，要是在每个页面文件里加岂不是很麻烦，所以我们在 `layout/default.vue` 里面对 `$route` 进行监听，同时设置 watch 参数 `immediate: true`

> layout/default.vue

```js
...
  mounted() {
    //- 通过监听路由变化，执行不同的pv统计，同时 `immediate: true` 使得每次页面初始进来也会默认执行一次
    this.$watch('$route', ({ name }) => this.$tracker('-', name), { immediate: true })
  }
...
```

`utils/tracker.js` 里是一些发起 `PV` 统计所调用的代码（隐去了部分业务代码）

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

### 本人文笔拙劣，如有错误，欢迎各路大神拍砖！
