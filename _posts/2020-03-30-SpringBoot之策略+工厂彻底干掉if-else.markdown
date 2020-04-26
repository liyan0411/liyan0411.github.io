---
layout:     post
title:      "SpringBoot 策略+工厂彻底干掉if-else"
subtitle:   " \"Hello SpringBoot, Hello if-else\""
date:       2020-03-30 14:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## 策略模式介绍

策略模式也叫政策模式，是一种行为型设计模式，是一种比较简单的设计模式。策略模式采用了面向对象的继承和多态机制，下面让我们详细了解一下策略模式吧！

策略模式定义： 

定义一组算法，将每个算法都封装起来，并且使他们之间可以互换。

策略模式使用场景：

1. 多个类只有在算法或行为上稍有不同的场景。
2. 算法需要自由切换的场景。
3. 需要屏蔽算法规则的场景

## 恶心的if-else

#### 1、假设我们疫情结束，打算去上班，路程有500公里，有这样的需求：

1. 自己开车去目的地上班，每公里需要0.5元。
2. 坐飞机去上班，每公里50元。
3. 坐火车去上班，每公里0.1元。

那么，我们可以看到以下伪代码：
	
	package com.example.strategyfactorymode.TestController;

	/**
	 * @Author lijun
	 * @Description if-else
	 * @Date 2020-03-30 8:51 上午
	 *
	 * 简单，臃肿
	 **/

	public class Client {
	    static int km = 500;

	    public static void main(String[] args) {
	        String type = "car";
	        // 选择自己开车
	        if ("car".equals(type)) {
	            System.out.println("自己开车所需要的费用是：￥" + 0.5 * km);
	        } else if ("plane".equals(type)){
	            System.out.println("乘飞机所需要的费用是：￥" + 50 * km);
	        } else if ("train".equals(type)){
	            System.out.println("乘火车所需要的费用是：￥" + 0.1 * km);
	        }
	    }

	}


以上，就是对于这个需求的一段价格计算逻辑，使用伪代码都这么复杂，如果是真的写代码，那复杂度可想而知。

这样的代码中，有很多if-else，并且还有可能出现很多的if-else的嵌套，无论是可读性还是可维护性都非常低。

那么，如何改善呢？

#### 2、使用策略模式

接下来，我们尝试引入策略模式来提升代码的可维护性和可读性。

首先，定义一个接口：

	package com.example.strategyfactorymode.service;

	/**
	 * @Author lijun
	 * @Description  计算接口
	 * @Date 2020-03-30 8:40 上午
	 **/

	public interface CalculateStrategy {
	    String price(int km);
	}


接着定义几个策略类

	package com.example.strategyfactorymode.service.impl;

	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.stereotype.Service;

	/**
	 * @Author lijun
	 * @Description 自己开车
	 * @Date 2020-03-30 8:44 上午
	 **/

	@Service
	public class CarStrategy implements CalculateStrategy {

	    @Override
	    public String price(int km) {
	        // 自己开车，按每公里0.5计算
	        return "自己开车所需要的费用是：￥" + 0.5 * km;
	    }
	}


	package com.example.strategyfactorymode.service.impl;

	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.stereotype.Service;

	/**
	 * @Author lijun
	 * @Description 乘飞机
	 * @Date 2020-03-30 8:47 上午
	 **/

	@Service
	public class PlaneStrategy implements CalculateStrategy {
	    @Override
	    public String price(int km) {
	        // 乘飞机，按每公里50元计算
	        return "乘飞机所需要的费用是：￥" + 50 * km;
	    }
	}

	package com.example.strategyfactorymode.service.impl;

	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.stereotype.Service;

	/**
	 * @Author lijun
	 * @Description 乘火车
	 * @Date 2020-03-30 8:49 上午
	 **/
	@Service
	public class TrainStrategy implements CalculateStrategy {
	    @Override
	    public String price(int km) {
	        // 乘火车，按每公里0.1元计算
	        return "乘火车所需要的费用是：￥" + 0.1 * km;
	    }
	}



引入了策略之后，我们可以按照如下方式进行价格计算：

	package com.example.strategyfactorymode.TestController;

	import com.example.strategyfactorymode.service.CalculateStrategy;
	import com.example.strategyfactorymode.service.impl.CarStrategy;
	import com.example.strategyfactorymode.service.impl.PlaneStrategy;
	import com.example.strategyfactorymode.service.impl.TrainStrategy;

	/**
	 * @Author lijun
	 * @Description 策略模式
	 * @Date 2020-03-30 8:51 上午
	 *
	 * 优点:
	 * 1.算法可以自由切换。
	 * 2.结构清晰明了，使用简单直观。
	 * 3.操作封装更为彻底，简化了操作。
	 * 4.耦合度大大降低，只要实现接口即可，无需做其他修改。
	 *
	 * 缺点
	 * 1.随着策略的增加，策略类会越来越多。
	 * 2.所有的策略都要暴露出去。
	 **/

	public class Client1 {
	    CalculateStrategy calculateStrategy;
	    static int km = 500;

	    public static void main(String[] args) {
	        Client1 client = new Client1();
	        String type = "car";

	        if ("car".equals(type)) {
	            // 选择自己开车
	            client.setCalculateStrategy(new CarStrategy());
	            System.out.println(client.getPrice(km));
	        } else if ("plane".equals(type)) {
	            // 选择乘飞机
	            client.setCalculateStrategy(new PlaneStrategy());
	            System.out.println(client.getPrice(km));
	        } else if ("train".equals(type)) {
	            // 选择乘火车
	            client.setCalculateStrategy(new TrainStrategy());
	            System.out.println(client.getPrice(km));
	        }
	    }

	    /**
	     * 设置出行方式
	     *
	     * @param calculateStrategy
	     */
	    public void setCalculateStrategy(CalculateStrategy calculateStrategy) {
	        this.calculateStrategy = calculateStrategy;
	    }

	    /**
	     * 获取出行费用
	     * @param km
	     * @return
	     */
	    public String getPrice(int km) {
	        return calculateStrategy.price(km);
	    }
	}


通过以上代码，我们发现，代码可维护性和可读性好像是好了一些，但是还是不够精简。
接下来，我们使用策略枚举使代码更加精简。

#### 3、策略枚举

添加一个枚举类

	package com.example.strategyfactorymode.Enum;

	/**
	 * @Author lijun
	 * @Description
	 * @Date 2020-03-26 8:59 上午
	 **/

	public enum Calculator {

	    // 自己开车
	    CAR {
	        public float price(int km) {
	            return (float) 0.5 * km;
	        }
	    },

	    // 乘飞机
	    PLANE {
	        public float price(int km) {
	            return (float) 50 * km;
	        }
	    },

	    // 乘火车
	    TRAIN {
	        public float price(int km) {
	            return (float) 0.1 * km;
	        }
	    };

	    Calculator(){}

	    public abstract float price(int km);
	}



再来看我们的伪代码：

	package com.example.strategyfactorymode.TestController;

	import com.example.strategyfactorymode.Enum.Calculator;

	/**
	 * @Author lijun
	 * @Description 策略枚举
	 * @Date 2020-03-30 8:51 上午
	 *
	 * 策略枚举是一个非常优秀和方便的模式，但是其受到枚举类型的限制，
	 * 每个枚举项都是public、final、static的，拓展性受到了一定的约束，
	 * 因此在系统开发中，枚举策略一般担当不经常发生变的角色。
	 **/

	public class Client2 {
	    static int km = 500;

	    public static void main(String[] args) {
	        String type = "car";

	        if ("car".equals(type)) {
	            // 选择自己开车
	            System.out.println("自己开车所需要的费用是：￥" + Calculator.CAR.price(km));
	        } else if ("plane".equals(type)) {
	            // 选择乘飞机
	            System.out.println("乘飞机所需要的费用是：￥" + Calculator.PLANE.price(km));
	        } else if ("train".equals(type)) {
	            // 选择乘火车
	            System.out.println("乘火车所需要的费用是：￥" + Calculator.TRAIN.price(km));
	        }
	    }
}


通过以上代码，我们发现，代码可维护性和可读性是好了，但是好像并没有减少if-else啊。
我们使用工程模式彻底解决这个难题吧！

#### 4、工厂模式

为了方便我们从Spring中获取CalculateStrategy的各个策略类，我们创建一个工厂类：
	
	package com.example.strategyfactorymode.factory;

	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.util.Assert;

	import java.util.Map;
	import java.util.concurrent.ConcurrentHashMap;

	/**
	 * @Author lijun
	 * @Description
	 * @Date 2020-03-30 9:47 上午
	 **/

	public class CalculateStrategyFactory {
	    private static Map<String, CalculateStrategy> services = new ConcurrentHashMap<>();

	    public static CalculateStrategy getType(String type) {
	        return services.get(type);
	    }

	    public static void register(String type, CalculateStrategy calculateStrategy) {
	        Assert.notNull(type, "type can't be null");
	        services.put(type, calculateStrategy);
	    }
	}


这个CalculateStrategyFactory中定义了一个Map，用来保存所有的策略类的实例，并提供一个getType方法，可以根据类型直接获取对应的类的实例。
还有一个register方法，这个后面再讲。有了这个工厂类之后，计算价格的代码即可得到大大的优化：

	package com.example.strategyfactorymode.TestController;

	import com.example.strategyfactorymode.StrategyfactorymodeApplication;
	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.boot.SpringApplication;

	/**
	 * @Author lijun
	 * @Description 策略模式 + 工厂模式
	 * @Date 2020-03-30 8:51 上午
	 *
	 * 彻底解决if-else
	 **/

	public class Client3 {
	    static int km = 500;

	    public static void main(String[] args) {
	        SpringApplication.run(StrategyfactorymodeApplication.class, args);
	        String type = "car";
	        CalculateStrategy calculateStrategy = CalculateStrategyFactory.getType(type);
	        System.out.println(calculateStrategy.price(km));
	    }
	}


以上代码中，不再需要if-else了，拿到交通方式类型之后，直接通过工厂的getType方法直接调用就可以了。
通过策略+工厂，我们的代码很大程度的优化了，大大提升了可读性和可维护性。但是，上面还遗留了一个问题，
那就是UserPayServiceStrategyFactory中用来保存所有的策略类的实例的Map是如何被初始化的？
各个策略的实例对象如何塞进去的呢？Spring Bean的注册还记得我们前面定义的
UserPayServiceStrategyFactory中提供了的register方法吗？他就是用来注册策略服务的。
接下来，我们就想办法调用register方法，把Spring通过IOC创建出来的Bean注册进去就行了。这种需求，
可以借用Spring种提供的InitializingBean接口，这个接口为Bean提供了属性初始化后的处理方法，
它只包括afterPropertiesSet方法，凡是继承该接口的类，在bean的属性初始化后都会执行该方法。
那么，我们将前面的各个策略类稍作改造即可：

	package com.example.strategyfactorymode.service.impl;

	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.beans.factory.InitializingBean;
	import org.springframework.stereotype.Service;

	/**
	 * @Author lijun
	 * @Description 自己开车
	 * @Date 2020-03-30 8:44 上午
	 **/

	@Service
	public class CarStrategy implements CalculateStrategy, InitializingBean {

	    @Override
	    public String price(int km) {
	        // 自己开车，按每公里0.5计算
	        return "自己开车所需要的费用是：￥" + 0.5 * km;
	    }

	    @Override
	    public void afterPropertiesSet() throws Exception {
	        CalculateStrategyFactory.register("car", this);
	    }
	}


	package com.example.strategyfactorymode.service.impl;

	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.beans.factory.InitializingBean;
	import org.springframework.stereotype.Service;

	/**
	 * @Author lijun
	 * @Description 乘飞机
	 * @Date 2020-03-30 8:47 上午
	 **/

	@Service
	public class PlaneStrategy implements CalculateStrategy, InitializingBean {
	    @Override
	    public String price(int km) {
	        // 乘飞机，按每公里50元计算
	        return "乘飞机所需要的费用是：￥" + 50 * km;
	    }

	    @Override
	    public void afterPropertiesSet() throws Exception {
	        CalculateStrategyFactory.register("plane", this);
	    }
	}


	package com.example.strategyfactorymode.service.impl;

	import com.example.strategyfactorymode.factory.CalculateStrategyFactory;
	import com.example.strategyfactorymode.service.CalculateStrategy;
	import org.springframework.beans.factory.InitializingBean;
	import org.springframework.stereotype.Service;

	/**
	 * @Author lijun
	 * @Description 乘火车
	 * @Date 2020-03-30 8:49 上午
	 **/
	@Service
	public class TrainStrategy implements CalculateStrategy, InitializingBean {
	    @Override
	    public String price(int km) {
	        // 乘火车，按每公里0.1元计算
	        return "乘火车所需要的费用是：￥" + 0.1 * km;
	    }

	    @Override
	    public void afterPropertiesSet() throws Exception {
	        CalculateStrategyFactory.register("train", this);
	    }
	}


以上代码，其实还是有一些重复代码的，这里面还可以引入模板方法模式进一步精简，这里就不展开了。
CalculateStrategyFactory.register调用的时候，第一个参数需要传一个字符串，
这里的话其实也可以优化掉。比如使用枚举，或者在每个策略类中自定义一个getType方法，各自实现即可。


## 总结

本文，我们通过策略模式、工厂模式以及Spring的InitializingBean，提升了代码的可读性以及可维护性，
彻底消灭了一坨if-else。文中的这种做法，大家可以立刻尝试起来，这种实践，是我们日常开发中经常用到的，
而且还有很多衍生的用法，也都非常好用。有机会后面再介绍。其实，如果读者们对策略模式和工厂模式了解的话，
文中使用的并不是严格意义上面的策略模式和工厂模式。

 
####  源码下载：

[https://github.com/mochengyanliu/Study/tree/master/strategyfactorymode](https://github.com/mochengyanliu/Study/tree/master/strategyfactorymode)


