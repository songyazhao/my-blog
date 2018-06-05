---
title: Nuxt.js踩坑记，利用Nuxt一键生成静态站点
date: 2018-06-05 18:06:51
tags: [Vue, Nuxt]
categories: Vue
---

## 为什么使用Nuxt.js?
- SSR（服务端渲染）的页面加载时间显然优于单页首屏渲染
- 可以方便的对 SEO 进行管理
- 无需配置页面路由，内置 `vue-rouer`，自动依据 pages 目录结构生成对应路由配置。
- 支持静态化（本文将着重以此展开介绍）

<!-- more -->

## Nuxt.js简单介绍

## 项目创建

### 1. 目录结构
```
doumi_vip_web/
├── api/                                  //- 接口
├── assets/                               //- 需要编译的静态资源，如SCSS、JS
│   ├── images/                           //- 图片
│   └── styles/                           //- 样式
├── build/                                //-
│   ├── nuxt-generate.js/                 //- nuxt generate
│   └── vue-server-renderer.patch.js/     //- 对 vue-server-renderer 相关修补
├── components/                           //- 公用的组件
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
│   └── vue-tracker.js/                   //- 挂载utils/tracker.js
├── static/                               //- 无需编译处理的静态资源
│   └── images/                           //- 这里存放了一些通过数据循环出来的图片
├── store/                                //- vuex
│   └── index.js
├── utils/                                //- 工具集
│   ├── index.js
│   ├── http.js                           //- axios
│   ├── script.js                         //- <head> 中的 <script></script>
│   ├── tracker.js                        //- 用户行为追踪(pv、ev)
│   └── tracker-uitl.js
├── vendor/                               //- 第三方的库和插件
│   └── index.js
├── nuxt.config.js                        //- Nuxt.js配置文件
├── seo.config.js                         //- SEO配置文件
├── package-lock.json                     //- npm的版本锁
├── package.json
└── README.md
```

### 2. 项目配置

Nuxt.js 默认的配置涵盖了大部分使用情形，可通过 `nuxt.config.js` 来覆盖默认的配置。

> nuxt.config.js

```js
  // Document Common <head>
const generateRoutes = require('./data/cases').cases
const SEO = require('./seo.config')
const routesMap = {}

for (const key in SEO) {
  if (SEO.hasOwnProperty(key)) {
    routesMap[key] = SEO[key].path
  }
}

module.exports = {
  // Document Common <head>
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
      { rel: 'icon', type: 'image/x-icon', href: '你的logo地址' }
    ]
  }
  // 切换页面的进度条颜色
  loading: { color: '#77b6ff' },
  // modules 可以用来扩展核心功能或者添加一些集成
  // https://nuxtjs.org/api/configuration-modules
  modules: [
    '@nuxtjs/proxy'
  ],
  // 本地开发请求远端接口时要用到的反向代理
  // 本地调试接口前请先将`vip.corp.doumi.com`域名绑定host到test`10.216.90.26`
  // https://github.com/nuxt-community/proxy-module
  proxy: {
    '/v2/api/': 'http://vip.corp.doumi.com',
    '/login/': 'http://vip.doumi.com',
    '/home/': 'http://vip.doumi.com'
  },
  // 这将允许使用Vue插件，或者注册Vue全局组件
  // https://zh.nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/global-comp',
    { src: '~plugins/vue-tracker', ssr: false }
  ],
  // 配置全局样式文件（每个页面都会被引入）
  css: [
    'animate.css',
    { src: '~assets/styles/common.scss', lang: 'scss' },
  ],
  // https://zh.nuxtjs.org/api/configuration-generate
  generate: {
    // 为动态路由添加静态化
    routes: generateRoutes.map(item => `/anli/${item.id}.htm`)
  },
  // router 属性让你可以个性化配置 Nuxt.js 应用的路由（vue-router）。
  // https://zh.nuxtjs.org/api/configuration-router
  router: {
    middleware: 'set-env',
    extendRoutes(routes) {
      // 重新定义路由
      routes.forEach(item => {
        if (typeof routesMap[item.name] !== 'undefined') {
          item.path = routesMap[item.name]
        }
      })
    }
  },
  // 编译配置
  build: {
    // 使用 webpack-bundle-analyzer 分析并可视化构建后的打包文件，你可以基于分析结果来决定如何优化它
    analyze: true,
    // 为客户端和服务端的构建配置进行手工的扩展处理
    // https://zh.nuxtjs.org/api/configuration-build#extend
    extend(config, context) {
      const { isDev, isClient, isServer } = context
      if (isDev && isClient) {
        // 使用ESLint
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (!isDev) {
        config.module.rules // 覆盖默认配置
          .find((rule) => rule.loader === 'url-loader')
          .options.name = 'images/[name].[ext]?v=[hash:7]'
      }
    },
    filenames: {
      manifest: 'js/manifest.js?v=[hash:7]',
      vendor: 'js/vendor.js?v=[hash:7]',
      app: 'js/app.js?v=[chunkhash:7]',
      chunk: 'js/[name].js?v=[chunkhash:7]'
    },
    // 自定义 postcss 配置
    // https://zh.nuxtjs.org/api/configuration-build#postcss
    postcss: [
      require('autoprefixer')({
        browsers: ['> 1%', 'last 3 versions', 'not ie <= 8']
      })
    ],
    // 生成的静态资源将会基于此CDN地址加上URL前缀
    publicPath: '//sta.doumistatic.com/src/vip/pc/',
    // Nuxt.js 允许你在生成的 vendor.js 文件中添加一些模块，以减少应用 bundle 的体积
    // 这里说的是一些你所依赖的第三方模块 (比如 axios)，或者使用频率较高的一些自定义模块
    // https://zh.nuxtjs.org/api/configuration-build#vendor
    vendor: [
      'axios',
      'crypto-js',
      'js-cookie'
      ...
    ]
  }
}
```

## 项目开发
