---
layout:     post
title:      "SpringBoot 集成 Durid"
subtitle:   " \"Hello SpringBoot, Hello Durid\""
date:       2019-03-29 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## Druid简介

Druid首先是一个数据库连接池。Druid是目前最好的数据库连接池，在功能、性能、扩展性方面，都超过其他数据库连接池，包括DBCP、C3P0、BoneCP、Proxool、JBoss DataSource。Druid已经在阿里巴巴部署了超过600个应用，经过一年多生产环境大规模部署的严苛考验。Druid是阿里巴巴开发的号称为监控而生的数据库连接池！

## druid的特点

基于Filter－Chain模式的插件体系。

DruidDataSource 高效可管理的数据库连接池。

SQLParser

## 第一步： 新建SpringBoot项目

右键工程->创建Project->选择spring initialir->Web-Web,SQl-JPA/Mysql/JDBC/MyBatis,然后一直下一步就行了。

####  创建完成后加入Durid支持和自动生产数据访问文件：

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
	    <artifactId>durid</artifactId>
	    <version>0.0.1-SNAPSHOT</version>
	    <name>durid</name>
	    <description>Demo project for Spring Boot</description>

	    <properties>
	        <java.version>1.8</java.version>
	    </properties>

	    <dependencies>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-data-jpa</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-jdbc</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-thymeleaf</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-web</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.mybatis.spring.boot</groupId>
	            <artifactId>mybatis-spring-boot-starter</artifactId>
	            <version>2.0.0</version>
	        </dependency>

	        <dependency>
	            <groupId>mysql</groupId>
	            <artifactId>mysql-connector-java</artifactId>
	            <scope>runtime</scope>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-test</artifactId>
	            <scope>test</scope>
	        </dependency>
	        <dependency>
	            <groupId>com.alibaba</groupId>
	            <artifactId>druid</artifactId>
	            <version>1.1.15</version>
	        </dependency>
	    </dependencies>

	    <build>
	        <plugins>
	            <plugin>
	                <groupId>org.springframework.boot</groupId>
	                <artifactId>spring-boot-maven-plugin</artifactId>
	            </plugin>
	            <!--添加mybatis generator maven插件-->
	            <plugin>
	                <groupId>org.mybatis.generator</groupId>
	                <artifactId>mybatis-generator-maven-plugin</artifactId>
	                <version>1.3.5</version>
	                <configuration>
	                    <!--generatorConfig.xml位置-->
	                    <configurationFile>src/main/resources/generatorConfig.xml</configurationFile>
	                    <verbose>true</verbose>
	                    <overwrite>true</overwrite>
	                </configuration>
	                <executions>
	                    <execution>
	                        <id>Generate MyBatis Artifacts</id>
	                        <goals>
	                            <goal>generate</goal>
	                        </goals>
	                        <phase>generate-sources</phase>
	                    </execution>
	                </executions>
	            </plugin>
	        </plugins>
	    </build>

	</project>


#### 配置appication.yml文件：

	server:
	  port: 8081
	durid:
	  login:  #登陆的账户密码
	    user-name: root
	    password: root
	  allow:
	    ip: 127.0.0.1
	spring:
	  datasource:
	    driver-class-name: com.mysql.cj.jdbc.Driver
	    url: jdbc:mysql://localhost:3306/Spring_Durid?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&useSSL=false
	    username: root
	    password: lijun520
	    type: com.alibaba.druid.pool.DruidDataSource
	    # 连接池的配置信息
	    # 初始化大小 最小等待连接数 最大等待连接数 最大连接数
	    initial-size: 1
	    min-idle: 1
	    max-idle: 5
	    max-active: 20
	    # 配置获取连接等待超时的时间
	    max-wait: 60000
	    # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
	    time-between-eviction-runs-millis: 60000
	    # 配置一个连接在池中最小生存的时间，单位是毫秒
	    min-evictable-idle-time-millis: 30000
	    validation-query: SELECT 1 FROM DUAL
	    test-while-idle: true
	    test-on-borrow: false
	    test-on-return: false
	    # 打开PSCache，并且指定每个连接上PSCache的大小
	    pool-prepared-statements: true
	    max-pool-prepared-statement-per-connection-size: 20
	    # 配置监控统计拦截的filters，去掉后监控界面sql无法统计，'wall'用于防火墙
	    filters: stat,wall
	    # 通过connectProperties属性来打开mergeSql功能；慢SQL记录
	    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=5000
	    # 合并多个DruidDataSource的监控数据
	    #spring.datasource.useGlobalDataSourceStat=true

	mybatis:
	  mapper-locations: classpath:mapper/*Mapper.xml
	  type-aliases-package: com.test.durid.entity

#### 配置数据库表和数据文件：

	已上传至工程目录的resources文件夹下面。
	自动生产访问数据文件是generatorConfig.xml

## 第二步：配置DruidConfig类

	package com.test.durid.config;

	import com.alibaba.druid.pool.DruidDataSource;
	import com.alibaba.druid.support.http.StatViewServlet;
	import com.alibaba.druid.support.http.WebStatFilter;
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.boot.context.properties.ConfigurationProperties;
	import org.springframework.boot.web.servlet.FilterRegistrationBean;
	import org.springframework.boot.web.servlet.ServletRegistrationBean;
	import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;

	import javax.sql.DataSource;
	import java.util.HashMap;
	import java.util.Map;

	@Configuration
	public class DruidConfig {
	    @Value("${durid.login.password}")
	    private String userName;

	    @Value("${durid.login.user-name}")
	    private String password;

	    @Value("${durid.allow.ip}")
	    private String allowIp;

	    @Bean(name = "default_databaseSource")
	    @ConfigurationProperties(prefix = "spring.datasource")
	    public DataSource druidDataSource() {
	        return new DruidDataSource();
	    }

	    @Bean
	    public ServletRegistrationBean druidServlet() {
	        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean();
	        servletRegistrationBean.setServlet(new StatViewServlet());
	        servletRegistrationBean.addUrlMappings("/durid/*");
	        Map<String, String> initParameters = new HashMap<>();
	        initParameters.put("loginUsername", userName); // 用户名
	        initParameters.put("loginPassword", password); // 密码
	        initParameters.put("resetEnable", "false"); // 禁用HTML页面上的“Reset All”功能
	        initParameters.put("allow", allowIp); // IP白名单 (没有配置或者为空，则允许所有访问)
	        initParameters.put("deny", ""); // IP黑名单 (存在共同时，deny优先于allow)
	        servletRegistrationBean.setInitParameters(initParameters);
	        return  servletRegistrationBean;
	    }

	    @Bean
	    public FilterRegistrationBean filterRegistrationBean() {
	        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
	        filterRegistrationBean.setFilter(new WebStatFilter());
	        filterRegistrationBean.addUrlPatterns("/*");
	        filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
	        return filterRegistrationBean;
	    }
	}


## 第三步： 配置访问类
	
	package com.test.durid.controller;

	import com.test.durid.entity.CityEntity;
	import com.test.durid.service.CityService;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.RestController;

	@RestController
	public class CityController {

	    @Autowired
	    private CityService cityService;

	    @RequestMapping("/city")
	    public CityEntity findCityById(@RequestParam Integer id){
	        return cityService.findCityById(id);
	    }
	}


#### 注：这里省略了service层和mapper层，需要的可以去看原工程代码。
 

## 第四步： 访问

 启动工程，访问http://127.0.0.1:8081/durid/login.html,你会发现此时会自动跳转到Durid的登陆页面，然后输入你自己设置账户和密码，
 登陆后进入DruidMonitor页面，然后可以查看SQL监控，发现此时没有数据，再访问：http://127.0.0.1:8081/city?id=1,此时可以正常访问，
 然后返回查看SQL监控，此时会展现出你刚刚访问数据的详情。
 
####  源码下载：

[https://github.com/mochengyanliu/Study/tree/master/durid](https://github.com/mochengyanliu/Study/tree/master/durid)


