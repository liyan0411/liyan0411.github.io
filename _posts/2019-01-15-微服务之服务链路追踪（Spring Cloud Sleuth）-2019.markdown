---
layout:     post
title:      "微服务之服务链路追踪（Spring Cloud Sleuth）"
subtitle:   " \"Hello SpringBoot, Hello SpringClould\""
date:       2019-01-15 14:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - 手把手教你玩转SpringCloud
---

> “Hello everyone! ”


## 服务链路追踪（Spring Cloud Sleuth）简介

Spring Cloud Sleuth实现对Spring cloud 分布式链路监控
本文介绍了和Sleuth相关的内容，主要内容如下：

1、Spring Cloud Sleuth中的重要术语和意义：Span、Trance、Annotation
2、Zipkin中图形化展示分布式链接监控数据并说明字段意义
3、Spring Cloud集成Sleuth + Zipkin 的代码demo: Sleuth集成Zipkin, Zipkin数据持久化等



## 第一步：创建条件

主要有三个工程组成:一个server-zipkin,它的主要作用使用ZipkinServer的功能，收集调用数据，
并展示；一个service-one,对外暴露/hello接口；一个service-two,对外暴露/hello接口；
这两个service可以相互调用；并且只有调用了，server-zipkin才会收集数据的，这就是为什么叫服务追踪了。


## 第二步：创建server-zipkin工程： 

在spring Cloud为Finchley版本的时候，已经不需要自己构建Zipkin Server了，只需要下载jar即可，下载地址：

https://dl.bintray.com/openzipkin/maven/io/zipkin/java/zipkin-server/2.9.4/ 下载zipkin-server-2.9.4-exec.jar

下载完成jar 包之后，需要运行jar，如下：

	java -jar zipkin-server-2.9.4-exec.jar

访问浏览器localhost:9411即可看见管理页面

## 第三步：创建service-one工程： 

右键工程->创建module->选择spring initialir->web->web,cloud tracing->zipkin client,然后一直下一步就行了。


####  创建完成后：

	<?xml version="1.0" encoding="UTF-8"?>
	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
		<modelVersion>4.0.0</modelVersion>
		<parent>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-parent</artifactId>
			<version>2.1.2.RELEASE</version>
			<relativePath/> <!-- lookup parent from repository -->
		</parent>
		<groupId>com.test</groupId>
		<artifactId>service-one</artifactId>
		<version>0.0.1-SNAPSHOT</version>
		<name>service-one</name>
		<description>Demo project for Spring Boot</description>

		<properties>
			<java.version>1.8</java.version>
			<spring-cloud.version>Greenwich.RC2</spring-cloud.version>
		</properties>

		<dependencies>
			<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-starter-web</artifactId>
			</dependency>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-starter-zipkin</artifactId>
			</dependency>

			<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-starter-test</artifactId>
				<scope>test</scope>
			</dependency>
		</dependencies>

		<dependencyManagement>
			<dependencies>
				<dependency>
					<groupId>org.springframework.cloud</groupId>
					<artifactId>spring-cloud-dependencies</artifactId>
					<version>${spring-cloud.version}</version>
					<type>pom</type>
					<scope>import</scope>
				</dependency>
			</dependencies>
		</dependencyManagement>

		<build>
			<plugins>
				<plugin>
					<groupId>org.springframework.boot</groupId>
					<artifactId>spring-boot-maven-plugin</artifactId>
				</plugin>
			</plugins>
		</build>

		<repositories>
			<repository>
				<id>spring-milestones</id>
				<name>Spring Milestones</name>
				<url>https://repo.spring.io/milestone</url>
			</repository>
		</repositories>

	</project>




	

#### 配置appication.yml文件：

	server:
	  port: 9871
	spring:
	  zipkin:
		base-url: http://localhost:9411
	  application:
		name: service-one

## 第四步 配置主程序

	import brave.sampler.Sampler;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.context.annotation.Bean;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;
	import org.springframework.web.client.RestTemplate;

	import java.util.logging.Level;
	import java.util.logging.Logger;

	@SpringBootApplication
	@RestController
	public class ServiceOneApplication {

		public static void main(String[] args) {
			SpringApplication.run(ServiceOneApplication.class, args);
		}

		private static final Logger LOG = Logger.getLogger(ServiceOneApplication.class.getName());

		@Autowired
		private RestTemplate restTemplate;

		@Bean
		public RestTemplate getRestTemplate(){
			return new RestTemplate();
		}

		@RequestMapping("/hello")
		public String callHome(){
			LOG.log(Level.INFO, "calling service-two");
			return restTemplate.getForObject("http://localhost:9872/info/two", String.class);
		}

		@RequestMapping("/info/one")
		public String info(){
			LOG.log(Level.INFO, "calling service-one ");
			return "i'm service-one";
		}

		@Bean
		public Sampler defaultSampler() {
			return Sampler.ALWAYS_SAMPLE;
		}

	}
	
	
## 第五步：创建service-two工程： 

选择配置包不变，配置端口号改成9872即可

## 第六步 配置主程序
	
	import brave.sampler.Sampler;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.context.annotation.Bean;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;
	import org.springframework.web.client.RestTemplate;

	import java.util.logging.Level;
	import java.util.logging.Logger;

	@SpringBootApplication
	@RestController
	public class ServiceTwoApplication {

		public static void main(String[] args) {
			SpringApplication.run(ServiceTwoApplication.class, args);
		}

		private static final Logger LOG = Logger.getLogger(ServiceTwoApplication.class.getName());

		@RequestMapping("/info/two")
		public String home(){
			LOG.log(Level.INFO, "calling service-two");
			return "hi i'm service-two!";
		}

		@RequestMapping("/hello")
		public String info(){
			LOG.log(Level.INFO, "calling service-one");
			return restTemplate.getForObject("http://localhost:9871/info/one",String.class);
		}

		@Autowired
		private RestTemplate restTemplate;

		@Bean
		public RestTemplate getRestTemplate(){
			return new RestTemplate();
		}

		@Bean
		public Sampler defaultSampler() {
			return Sampler.ALWAYS_SAMPLE;
		}

	}



## 第七步 启动程序

启动service-one，service-two

访问：http://localhost:9871/hello，浏览器出现：

i'm service-two

再打开http://localhost:9411/的界面，点击依赖分析,可以发现服务的依赖关系

service-one ——> service-two

同理，访问：http://localhost:9872/hello，浏览器出现：

i'm service-one

这时的依赖关系是

service-one <——> service-two

点击查找调用链,可以看到具体服务相互调用的数据。


####  源码下载：

[https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section9](https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section9)

