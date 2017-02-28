---
title: webpack2踩坑与升级指南
date: 2017-2-21 11:25:04
tags: [webpack2, 升级指南]
categories: JS相关
---
最近前端聊得最多的莫过于 **某某某2.0发布了**，作为前端狗即感兴奋又觉苦逼。然而，webpack也不例外，一个东西的新版发布，文档什么的都得跟上，然而现在好像资料并不多，官方的说法是，webpack1和2在使用上并没有太大的区别。 好吧，那就折腾折腾webpack2吧。
<!-- more -->
## Install Webpack 2  

第一步，当然是安装最新版本的webpack2，不过因为还没正式发布，所以咱们就指定一个版本。

```bash
    npm install --save-dev webpack@2.1.0-beta.25
```

如果你还用到其他的webpack插件（这假设简直是多余），那很可能就需要升级到2.0。

例如 `extract-text-webpack-plugin`，同样也在2.0的路上  

```bash
    npm install --save-dev extract-text-webpack-plugin@2.0.0-beta.4
```

## module.loaders =&gt; module.rules  

module.loaders还是可以继续使用，但是将来可能会被删掉，所以在2.0的配置里最好使用 **module.rules** 替代。  

```JavaScript
    // before
    modules: {
        loaders: {
            ...
        }
    }

    // after
    modules: {
        rules: {
            ...
        }
    }
```

## resolve.modulesDirectories = resolve.modules  

resolve的配置也有所改变。  

```JavaScript
    // before
    resolve: {
        modulesDirectories: [...],
    }

    // after
    resolve: {
        modules: [...],
    }
```

## No webpack.optimize.OccurenceOrderPlugin  

webpack.optimize.OccurenceOrderPlugin这个插件，如果有研究过webpack优化的小伙伴应该就很清楚其作用，那么在2.0里，为默认功能，无需再手动添加到配置里。  

## Configuring loaders  

在项目中，一般会用到 **postcss** 和 **postcss-loader** 来加载和处理我们的CSS。在1.0里，需要在webpack配置的最外层对其进行单独配置，那么在2.0里是不再允许。作为替代，在2.0里允许对每个loader进行单独的配置，但是需要在对应的rule.use里。也就是说，在1.0里需要在最外层进行配置的插件，在2.0里就必须修改成在rule里单独配置。  

```JavaScript
    // before, in Webpack top level
    postcss: {
        plugins: ...
    }

    // after
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                    loader: 'postcss-loader',
                    options: {
                        plugins: ...
                    }
                },
                'sass-loader'
            ]
        }]
    }
```

## ExtractTextPlugin changes  

上面提到的loaders配置的变更，无疑让我们配置webpack时更加方便和清晰。以前，往往需要传入多个loader作为参数来配置某些插件，例如 _ExtractTextPlugin_：  

```JavaScript
    // Webpack 1
    ExtractTextPlugin.extract(
        'style-loader',
        'css-loader!postcss-loader!sass-loader'
    );
```

如果有更多的配置时，显得更加麻烦和混乱。

```JavaScript
    // Webpack 1
    ExtractTextPlugin.extract(
        'style-loader',
        'css-loader?modules-true!postcss-loader!sass-loader'
    );
```

在2.0里可以通过定义个loaders的数组来替代上面的复杂配置：

```JavaScript
    // Webpack 2
    varloaders = [{
            loader: 'css-loader',
            options: {
                modules: true
            }
        }, {
            loader: 'postcss-loader'
        }, {
            loader: 'sass-loader'
    }]

    ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: loaders,
    })
```

## Stop Babel from compiling ES2015 modules  

在1.0里，webpack不支持ES2015的modules导入方法，但是可以通过Babel将其转成CommonJS的注入规范。在2.0里，同样支持ES6的原生module导入方法，并且他能够识别到在引入的模块中，有哪些代码是没有被使用的。也就是说，假如我们使用了Babel，应该要主动告诉他不要去把ES6的注入模块方法转成CommonJS。

我们可以通过改变 **.babelrc** 的配置来做到这点：  

``` JavaScript
    // before
    "presets": ["es2015"]

    // after
    "presets": [
        ["es2015", {"modules":false}]
    ]
```

## 最后  

Webpack2在性能上有不少的提升，在改善了资源打包的同时也优化了配置的方法，虽然现在还没正式发布，但如果可以，希望在你的项目上能用上她。

## 参考文献

1. [Migrating to Webpack 2](http://javascriptplayground.com/blog/2016/10/moving-to-webpack-2/)
