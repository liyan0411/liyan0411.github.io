---
layout: post
title:  "vue组件封装"
date:   2019-07-09 15:10:39
categories: Vue
tags: Vue
excerpt:	vue是一个构建数据驱动的 web 界面的渐进式框架.
mathjax: true
author:	李岩
---

* content
{:toc}

#	vue插件开发

开发vue插件之前呢，先说下封装插件的目的是什么？封装插件的目的就是为了代码的可复用，既然是为了可复用，那么只要能实现可复用的操作，封装方式就可以多样化。这和jq的$.fn.myPlugin = function(){}有些区别。先来看下官方文档对于vue插件的说明：

##  插件通常会为 Vue 添加全局功能。

**插件的范围没有限制——一般有下面几种：**

**1.添加全局方法或者属性，如: vue-custom-element;**

**2.添加全局资源：指令/过滤器/过渡等，如 vue-touch;**

**3.通过全局 mixin 方法添加一些组件选项，如: vue-router;**

**4.添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现;**

**5.一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如 vue-router.**


	MyPlugin.install = function (Vue, options) {
    // 第一种方法. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
        // 逻辑...
    }

    // 第二种方法. 添加全局资源
    Vue.directive('my-directive', {
        bind (el, binding, vnode, oldVnode) {
            // 逻辑...
        }
        ...
    })

    // 第三种方法. 注入组件
    /* Vue.mixin(mixin) 
     *混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。
     *混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象
     *的选项将被混入该组件本身的选项。 
     */ 
    Vue.mixin({
        created: function () {
        // 逻辑...
        }
         ...
    })

    // 第五种方法. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
        // 逻辑...
    }

    // 第六种方法，注册组件
    Vue.component(组件名, 组件)
	}

这些形式都可以作为我们的插件开发。根据封装需求选择不同的形式，例如toast提示可以选择Vue.prototype，输入框自动获取焦点可以选择Vue.directive指令，自定义组件可以选择Vue.component的形式。

###		待插件开发好后，就可以在mian.js中这样使用：

	// 引入插件
	import XXX from './lib/XXX'
	// 使用插件
	Vue.use(XXX);

（注：开发完成后的npm包，也是可以发布到npm官网供别人使用的哦。具体发布，请关注后续文章）