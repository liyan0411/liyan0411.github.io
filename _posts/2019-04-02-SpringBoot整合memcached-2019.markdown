---
layout:     post
title:      "SpringBoot 整合 Memcached"
subtitle:   " \"Hello SpringBoot, Hello Memcached\""
date:       2019-04-02 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## Memcached简介

Memcached是一个自由开源的，高性能，分布式内存对象缓存系统。

Memcached是以LiveJournal旗下Danga Interactive公司的Brad Fitzpatric为首开发的一款软件。现在已成为mixi、hatena、Facebook、Vox、LiveJournal等众多服务中提高Web应用扩展性的重要因素。

Memcached是一种基于内存的key-value存储，用来存储小块的任意数据（字符串、对象）。这些数据可以是数据库调用、API调用或者是页面渲染的结果。

Memcached简洁而强大。它的简洁设计便于快速开发，减轻开发难度，解决了大数据量缓存的很多问题。它的API兼容大部分流行的开发语言。

本质上，它是一个简洁的key-value存储系统。一般的使用目的是，通过缓存数据库查询结果，减少数据库访问次数，以提高动态Web应用的速度、提高可扩展性。

#### 安装memcached服务端 

[http://www.runoob.com/memcached/window-install-memcached.html](http://www.runoob.com/memcached/window-install-memcached.html)

## 第一步： 新建SpringBoot项目

右键工程->创建Project->选择spring initialir->Web-Web,然后一直下一步就行了。

####  创建完成后加入Memcached集成包文件：

	<?xml version="1.0" encoding="UTF-8"?>
	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	    <modelVersion>4.0.0</modelVersion>
	    <parent>
	        <groupId>org.springframework.boot</groupId>
	        <artifactId>spring-boot-starter-parent</artifactId>
	        <version>2.1.3.RELEASE</version>
	        <relativePath/> <!-- lookup parent from repository -->
	    </parent>
	    <groupId>com.test</groupId>
	    <artifactId>memcache</artifactId>
	    <version>0.0.1-SNAPSHOT</version>
	    <name>memcache</name>
	    <description>Demo project for Spring Boot</description>

	    <properties>
	        <java.version>1.8</java.version>
	    </properties>

	    <dependencies>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-web</artifactId>
	        </dependency>

	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-test</artifactId>
	            <scope>test</scope>
	        </dependency>

	        <!-- Memcached集成包 -->
	        <dependency>
	            <groupId>commons-pool</groupId>
	            <artifactId>commons-pool</artifactId>
	            <version>1.5.6</version>
	        </dependency>
	        <dependency>
	            <groupId>com.whalin</groupId>
	            <artifactId>Memcached-Java-Client</artifactId>
	            <version>3.0.2</version>
	        </dependency>

	    </dependencies>

	    <build>
	        <plugins>
	            <plugin>
	                <groupId>org.springframework.boot</groupId>
	                <artifactId>spring-boot-maven-plugin</artifactId>
	            </plugin>
	        </plugins>
	    </build>

	</project>


#### 配置appication.yml文件：

	## Memcached 配置 ##
	memcache:
	  servers: 10.108.12.102:11211
	  failover: true
	  initConn: 100
	  minConn: 20
	  maxConn: 1000
	  maintSleep: 50
	  nagel: false
	  socketTO: 3000
	  aliveCheck: true



## 第二步：配置常量类MemcacheConfiguration类

	package com.test.memcache.config;

	import com.whalin.MemCached.MemCachedClient;
	import com.whalin.MemCached.SockIOPool;
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;

	@Configuration
	public class MemcacheConfiguration {
	    // 设置服务信息
	    @Value("${memcache.servers}")
	    private String[] servers;
	    @Value("${memcache.failover}")
	    private boolean failover;
	    @Value("${memcache.initConn}")
	    // 最小连接数
	    private int initConn;
	    @Value("${memcache.minConn}")
	    // 最大连接数
	    private int minConn;
	    @Value("${memcache.maxConn}")
	    private int maxConn;
	    // 设置连接池守护线程的睡眠时间
	    @Value("${memcache.maintSleep}")
	    private int maintSleep;
	    // 设置TCP的参数，连接超时等
	    @Value("${memcache.nagel}")
	    private boolean nagel;
	    @Value("${memcache.socketTO}")
	    private int socketTO;
	    @Value("${memcache.aliveCheck}")
	    private boolean aliveCheck;

	    @Bean
	    public SockIOPool sockIOPool () {
	        SockIOPool pool = SockIOPool.getInstance();
	        pool.setServers(servers);
	        pool.setFailover(failover);
	        pool.setInitConn(initConn);
	        pool.setMinConn(minConn);
	        pool.setMaxConn(maxConn);
	        pool.setMaintSleep(maintSleep);
	        pool.setNagle(nagel);
	        pool.setSocketTO(socketTO);
	        pool.setAliveCheck(aliveCheck);
	        pool.initialize();
	        return pool;
	    }

	    @Bean
	    public MemCachedClient memCachedClient(){
	        return new MemCachedClient();
	    }

	}

## 第三步： 配置实体类UserEntity类
	
	package com.test.memcache.entity;

	import java.io.Serializable;

	public class UserEntity implements Serializable {
	    private Integer id;

	    private String name;

	    private Integer age;

	    private String sex;

	    private Long tel;

	    private String email;

	    private String address;

	    public Integer getId() {
	        return id;
	    }

	    public void setId(Integer id) {
	        this.id = id;
	    }

	    public String getName() {
	        return name;
	    }

	    public void setName(String name) {
	        this.name = name;
	    }

	    public Integer getAge() {
	        return age;
	    }

	    public void setAge(Integer age) {
	        this.age = age;
	    }

	    public String getSex() {
	        return sex;
	    }

	    public void setSex(String sex) {
	        this.sex = sex;
	    }

	    public Long getTel() {
	        return tel;
	    }

	    public void setTel(Long tel) {
	        this.tel = tel;
	    }

	    public String getEmail() {
	        return email;
	    }

	    public void setEmail(String email) {
	        this.email = email;
	    }

	    public String getAddress() {
	        return address;
	    }

	    public void setAddress(String address) {
	        this.address = address;
	    }
	}


## 第四步： 配置访问类MemcacheController类

	package com.test.memcache.controller;

	import com.test.memcache.entity.UserEntity;
	import com.whalin.MemCached.MemCachedClient;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.RestController;

	import java.util.Date;

	@RestController
	public class MemcacheController {
	    @Autowired
	    private MemCachedClient memCachedClient;

	    @RequestMapping("/listUser")
	    public UserEntity listUser(@RequestParam Integer userId){
	        UserEntity userEntity = (UserEntity) memCachedClient.get("user:"+userId);
	        if (userEntity == null) {
	            System.out.println("没有缓存");
	            userEntity = new UserEntity();
	            userEntity.setId(1);
	            userEntity.setName("老王");
	            userEntity.setSex("男");
	            userEntity.setAge(24);
	            userEntity.setTel(17789899090L);
	            userEntity.setEmail("1011212@qq.com");
	            userEntity.setAddress("上海浦东新区");
	            //设置缓存，并设置20秒过期
	            memCachedClient.set("user:"+userEntity.getId(),userEntity,new Date(20000));
	        } else {
	            System.out.println("加载缓存");
	        }
	        return userEntity;
	    }
	}


## 第四步：访问工程

 启动工程，访问http://localhost:8080/listUser?userId=1,多次请求,控制台第一次会出现“没有缓存”,直到过期以内，会出现“加载缓存”。
 
####  源码下载：

[https://github.com/mochengyanliu/Study/tree/master/memcache](https://github.com/mochengyanliu/Study/tree/master/memcache)


