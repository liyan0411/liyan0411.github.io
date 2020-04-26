---
layout:     post
title:      "SpringBoot 构建者模式专治丢三落四"
subtitle:   " \"Hello SpringBoot, Hello builder\""
date:       2020-04-03 14:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## 构建者模式介绍

Builder模式，又称生成器或构建者模式，属于对象创建型模式，侧重于一步一步的构建复杂对象，只有在构建完成后才会返回生成的对象。
Builder模式将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

策略模式使用场景：

创建复杂的对象。什么才能算复杂对象？如果一个对象只需要通过 new XXX() 的方式创建，那就算是一个简单对象；如果需要 new XXX()，
并且还要设置很多属性，那这种就可以称为复杂对象了，因为它的构建过程比较复杂。

## 丢三落四的我

#### 1、故事还得从我刚学会做饭开始：

还记得刚开始学做饭那会，自己想熬汤喝，不了解怎么煮，第一次是煮了玉米排骨汤，因为玉米比较难熟，所以是跟排骨一起下锅，
然后煮了 40 分钟，加了盐就可以出锅啦。第二次煮了土豆排骨汤，不懂得土豆容易熟，就和排骨一起下锅，煮了也差不多 40 分钟，
下了盐和香菜，发现怎么这汤有点不对，土豆全散架了，根本没法夹起来，我室友看到这锅汤，才跟我说土豆容易熟，得先熬排骨，
再放土豆进去煮。那时才发现熬汤特么还有这差异。

上面是背景哈，接下来我们来实现这个煲汤过程，土豆排骨汤是先加排骨，熬制30分钟，加土豆，熬制15分钟，加盐加香菜；
玉米排骨汤是先加排骨和玉米，熬制40分钟，再加盐。这汤都需要加肉、加菜、熬制、加配料。我们使用下面代码实现这个
煲土豆排骨汤和玉米排骨汤的过程。

那么，我们可以看到以下伪代码：
	
	package com.example.builderpattern.controller;

	import com.example.builderpattern.server.impl.TuDouPaiguSoup;
	import com.example.builderpattern.server.impl.YuMiPaiGuSoup;

	/**
	 * @Author lijun
	 * @Description
	 * @Date 2020-04-03 9:31 上午
	 **/

	public class NoBuilderTestController {
	    public static void main(String[] args) {
	        // 熬土豆排骨汤
	        TuDouPaiguSoup tuDouPaiguSoup = new TuDouPaiguSoup();
	        // 加排骨
	        tuDouPaiguSoup.addRibs();
	        // 熬30分钟
	        tuDouPaiguSoup.minute(30);
	        // 加土豆
	        tuDouPaiguSoup.addVegetable();
	        // 熬15分钟
	        tuDouPaiguSoup.minute(15);
	        // 加调料
	        tuDouPaiguSoup.addIngredients();

	        // 熬玉米排骨汤
	        YuMiPaiGuSoup yuMiPaiGuSoup = new YuMiPaiGuSoup();
	        // 加排骨
	        yuMiPaiGuSoup.addRibs();
	        // 加玉米
	        yuMiPaiGuSoup.addVegetable();
	        // 熬40分钟
	        yuMiPaiGuSoup.minute(40);
	        // 加调料
	        yuMiPaiGuSoup.addIngredients();
	    }
	}

	package com.example.builderpattern.server;

	/**
	 * @Author lijun
	 * @Description 熬汤接口
	 * @Date 2020-04-03 9:36 上午
	 **/

	public interface Soup {

	    // 加排骨
	    void addRibs();

	    // 加菜
	    void addVegetable();

	    // 熬制时间
	    void minute(int minute);

	    // 加配料
	    void addIngredients();
	}

	package com.example.builderpattern.server.impl;

	import com.example.builderpattern.server.Soup;

	/**
	 * @Author lijun
	 * @Description 土豆排骨汤
	 * @Date 2020-04-03 9:48 上午
	 **/

	public class TuDouPaiguSoup implements Soup {
	    @Override
	    public void addRibs() {
	        System.out.println("加排骨");
	    }

	    @Override
	    public void addVegetable() {
	        System.out.println("加土豆");
	    }

	    @Override
	    public void minute(int minute) {
	        System.out.println("熬" + minute + "分钟");
	    }

	    @Override
	    public void addIngredients() {
	        System.out.println("添加各种调料");
	    }
	}

	package com.example.builderpattern.server.impl;

	import com.example.builderpattern.server.Soup;

	/**
	 * @Author lijun
	 * @Description 玉米排骨汤
	 * @Date 2020-04-03 9:55 上午
	 **/

	public class YuMiPaiGuSoup implements Soup {

	    @Override
	    public void addRibs() {
	        System.out.println("加排骨");
	    }

	    @Override
	    public void addVegetable() {
	        System.out.println("加玉米");
	    }

	    @Override
	    public void minute(int minute) {
	        System.out.println("熬" + minute + "分钟");
	    }

	    @Override
	    public void addIngredients() {
	        System.out.println("添加各种调料");
	    }
	}



上面代码简单实现了煲土豆排骨汤和玉米排骨汤。煲汤我们要关注的点是：各操作的顺序，是先加排骨先煮再加菜，还是排骨和菜一起放进锅煮。
上面代码中，这个过程是谁控制的？是煲汤的人，所以顺序由煲汤的人决定，甚至有可能忘记放配料啥的，这样子的汤就味道不够好。那怎么去解决这些问题？

我们通过建造者模式可以解决上面的2个问题：煲汤顺序问题和忘记加配料这种丢三落四行为。我们将这个煲汤顺序从煲汤者分离开来，
让煲汤者只需要决定煲什么汤就好，让建造者来保证煲汤顺序问题和防止漏加配料。

我们用一个SoupBuilder来规范化煲汤过程，方法buildSoup给实现者提供一个设置煲汤顺序的地方。因为土豆排骨汤和玉米排骨汤熬制的过程不一样，
所以分别用TuDouPaiGuSoupBuilder和YuMiPaiGuSoupBuilder来具体实现土豆排骨汤和玉米排骨汤的熬制过程，也就是消除熬制过程和煲汤者的依赖关系。 
Director则相当于一个菜单，提供为熬汤者来选择熬什么汤。具体代码如下所示。

#### 2、使用构建者模式

首先，定义一个接口：

	package com.example.builderpattern.server;

	/**
	 * @Author lijun
	 * @Description 熬汤构建者接口
	 * @Date 2020-04-03 8:37 上午
	 **/

	public interface SoupBuilder {
	    void buildSoup();

	    Soup getSoup();
	}



接着实现几个接口类

	package com.example.builderpattern.server.impl;

	import com.example.builderpattern.server.Soup;
	import com.example.builderpattern.server.SoupBuilder;

	/**
	 * @Author lijun
	 * @Description 土豆排骨汤构建者
	 * @Date 2020-04-03 8:38 上午
	 **/

	public class TuDouPaiGuSoupBuilder implements SoupBuilder {
	    private TuDouPaiguSoup tuDouPaiguSoup = new TuDouPaiguSoup();


	    @Override
	    public void buildSoup() {
	        // 加排骨
	        tuDouPaiguSoup.addRibs();
	        // 熬30分钟
	        tuDouPaiguSoup.minute(30);
	        // 加土豆
	        tuDouPaiguSoup.addVegetable();
	        // 熬10分钟
	        tuDouPaiguSoup.minute(15);
	        // 添调料
	        tuDouPaiguSoup.addIngredients();
	    }

	    @Override
	    public Soup getSoup() {
	        return tuDouPaiguSoup;
	    }
	}

	package com.example.builderpattern.server.impl;

	import com.example.builderpattern.server.Soup;
	import com.example.builderpattern.server.SoupBuilder;

	/**
	 * @Author lijun
	 * @Description 玉米排骨汤构建者
	 * @Date 2020-04-03 8:38 上午
	 **/

	public class YuMiPaiGuSoupBuilder implements SoupBuilder {
	    private YuMiPaiGuSoup yuMiPaiGuSoup = new YuMiPaiGuSoup();


	    @Override
	    public void buildSoup() {
	        // 加排骨
	        yuMiPaiGuSoup.addRibs();
	        // 加玉米
	        yuMiPaiGuSoup.addVegetable();
	        // 熬40分钟
	        yuMiPaiGuSoup.minute(40);
	        // 添调料
	        yuMiPaiGuSoup.addIngredients();
	    }

	    @Override
	    public Soup getSoup() {
	        return yuMiPaiGuSoup;
	    }
	}


引入了构建者之后，我们可以定义一个熬汤人：

	package com.example.builderpattern.produce;

	import com.example.builderpattern.server.impl.TuDouPaiGuSoupBuilder;
	import com.example.builderpattern.server.impl.TuDouPaiguSoup;
	import com.example.builderpattern.server.impl.YuMiPaiGuSoup;
	import com.example.builderpattern.server.impl.YuMiPaiGuSoupBuilder;

	/**
	 * @Author lijun
	 * @Description 熬汤人
	 * @Date 2020-04-03 8:44 上午
	 **/

	public class Director {
	    private TuDouPaiGuSoupBuilder tuDouPaiGuSoupBuilder = new TuDouPaiGuSoupBuilder();
	    private YuMiPaiGuSoupBuilder yuMiPaiGuSoupBuilder = new YuMiPaiGuSoupBuilder();

	    /**
	     * 熬土豆排骨汤
	     * @return
	     */
	    public TuDouPaiguSoup buildTuDouPaiguSoup() {
	        tuDouPaiGuSoupBuilder.buildSoup();
	        return (TuDouPaiguSoup) tuDouPaiGuSoupBuilder.getSoup();
	    }

	    /**
	     * 熬玉米排骨汤
	     * @return
	     */
	    public YuMiPaiGuSoup buildYuMiPaiGuSoup() {
	        yuMiPaiGuSoupBuilder.buildSoup();
	        return (YuMiPaiGuSoup) yuMiPaiGuSoupBuilder.getSoup();
	    }
	}


通过用建造者实现，是不是保证了熬制汤的顺序并且一定会加够料？感受一下其中的奥秘吧。

## 总结

通过建造者模式，可以把本来强依赖的东西解绑，不仅仅解决依赖问题，还提高了封装性，让使用者不用明白内部的细节，
用上面的例子说就熬汤不用关心怎么熬制的过程，就像我们想喝玉米排骨汤，告诉女朋友，女朋友熬制，我们并不知道是怎么熬制的。

 
####  源码下载：

[https://github.com/mochengyanliu/Study/tree/master/builderpattern](https://github.com/mochengyanliu/Study/tree/master/builderpattern)


