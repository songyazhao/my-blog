---
title: Web Performance常见性能指标(FP, FCP, LCP, DCL, FMP, TTI, TBT, FID, CLS)
date: 2020-11-02 11:00:23
tags: [Performance]
categories: Performance
---

## FP (First Paint) 首次绘制

标记浏览器渲染任何在视觉上不同于导航前屏幕内容之内容的时间点。

## FCP (First Contentful Paint) 首次内容绘制

标记浏览器渲染来自 DOM 第一位内容的时间点，该内容可能是文本、图像、SVG 甚至 元素。
![FCP](FCP.png)

<!-- more -->

## LCP (Largest Contentful Paint) 最大内容渲染

衡量viewport内可见的最大内容元素的渲染时间。元素包括img、video、div及其他块级元素。
LCP的数据会通过PerformanceEntry对象记录, 每次出现更大的内容渲染, 则会产生一个新的PerformanceEntry对象.(2019年11月新增)。
![LCP-1](LCP-1.png)

根据google建议，为了给用户提供更好的产品体验，LCP应该低于2.5s。
![LCP-2](LCP-2.png)

## DCL (DomContentloaded)

当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载。

## FMP(First Meaningful Paint) 首次有效绘制

页面主角元素的首次有效绘制。例如，在 bilibili 上，主角元素就是视频元素；微博的博文是主要元素。

## L (onLoad)

页面的onLoad时的时间点。当依赖的资源, 全部加载完毕之后才会触发。

## TTI (Time to Interactive) 可交互时间

用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点。

## TBT (Total Blocking Time) 页面阻塞总时长

TBT汇总所有加载过程中阻塞用户操作的时长，在FCP和TTI之间任何long task中阻塞部分都会被汇总。
来个例子说明一下:
![TBT-1](TBT-1.png)
上图，有三个长任务，两个短任务。
![TBT-2](TBT-2.png)
在主线程上运行任务所花费的总时间为560毫秒，但TBT只有345(200 + 40 + 105)毫秒的时间，被视为阻塞时间(超过50ms的Task都会被记录).

## FID (First Input Delay) 首次输入延迟

FID (First Input Delay) 首次输入延迟: 指标衡量的是从用户首次与您的网站进行交互（即当他们单击链接，点击按钮等）到浏览器实际能够访问之间的时间, 下面来张图来解释FID和TTI的区别:
![FID-1](FID-1.webp)

根据google建议，为了给用户提供更好的产品体验，FID应该低于100ms。
![FID-2](FID-2.png)

## CLS (Cumulative Layout Shift) 累积布局偏移

CLS (Cumulative Layout Shift) 累积布局偏移: 总结起来就是一个元素初始时和其hidden之间的任何时间如果元素偏移了, 则会被计算进去, 具体的计算方法可看这篇文章 [https://web.dev/cls/]

![FID](CLS.png)

## SI (Speed Index)

SI (Speed Index): 指标用于显示页面可见部分的显示速度, 单位是时间,

## 参考阅读

1. [什么是第一输入延迟(First Input Delay)](https://www.imqianduan.com/tool/fid.html)
2. [使用 Paint Timing API](https://www.w3cplus.com/performance/paint-timing-api.html)
3. [前端监控实践——FMP的智能获取算法](https://www.codercto.com/a/40349.html)
