---
layout:     post
title:      "微服务之分布式配置中心（Spring Cloud Config）"
subtitle:   " \"Hello SpringBoot, Hello SpringClould\""
date:       2019-01-10 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - 手把手教你玩转SpringCloud
---

> “Hello everyone! ”


## 分布式配置中心（Spring Cloud Config）简介

在分布式系统中，每一个功能模块都能拆分成一个独立的服务，一次请求的完成，可能会调用很多个服务协调来完成，
为了方便服务配置文件统一管理，更易于部署、维护，所以就需要分布式配置中心组件了，在spring cloud中，
有分布式配置中心组件spring cloud config，它支持配置文件放在在配置服务的内存中，也支持放在远程Git仓库里。
引入spring cloud config后，我们的外部配置文件就可以集中放置在一个git仓库里，再新建一个config server，
用来管理所有的配置文件，维护的时候需要更改配置时，只需要在本地更改后，推送到远程仓库，所有的服务实例
都可以通过config server来获取配置文件，这时每个服务实例就相当于配置服务的客户端config client。



## 第一步：创建条件

创建一个maven主工程.

## 第二步：创建config-server工程： 

右键工程->创建module->选择spring initialir->web->web,cloud config->server,然后一直下一步就行了。

####  创建完成后：

	<?xml version="1.0" encoding="UTF-8"?>
	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
		<modelVersion>4.0.0</modelVersion>
		<parent>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-parent</artifactId>
			<version>2.1.1.RELEASE</version>
			<relativePath/> <!-- lookup parent from repository -->
		</parent>
		<groupId>com.test</groupId>
		<artifactId>config-server</artifactId>
		<version>0.0.1-SNAPSHOT</version>
		<name>config-server</name>
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
				<artifactId>spring-cloud-config-server</artifactId>
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
	  port: 8888
	spring:
	  application:
		name: config-server
	  cloud:
		config:
		  server:
			git:
			  uri: https://github.com/mochengyanliu/SpringCloudConfig
			  search-paths: dev
			  username:
			  password:
		  label: master
	
	##spring.cloud.config.server.git.uri：配置git仓库地址
	##spring.cloud.config.server.git.searchPaths：配置仓库路径
	##spring.cloud.config.label：配置仓库的分支
	##spring.cloud.config.server.git.username：访问git仓库的用户名
	##spring.cloud.config.server.git.password：访问git仓库的用户密码

如果Git仓库为公开仓库，可以不填写用户名和密码，如果是私有仓库需要填写，本例子是公开仓库，所以无需用户名密码。

远程仓库https://github.com/forezp/SpringCloudConfig/ 中有个文件config-client-dev.properties文件中有一个属性：

	hello = hello,handsomeman.


## 第三步 启动程序

访问http://localhost:8888/hello/dev

	{
	  "name": "hello",
	  "profiles": [
		"dev"
	  ],
	  "label": null,
	  "version": "3e9c0ea54f12e08e5135a16f14d12cb07ccc4f8b",
	  "state": null,
	  "propertySources": []
	}
	
证明配置服务中心拿到了远程仓库信息。

http请求地址和资源文件映射如下:

    /{application}/{profile}[/{label}]
    /{application}-{profile}.yml
    /{label}/{application}-{profile}.yml
    /{application}-{profile}.properties
    /{label}/{application}-{profile}.properties
	

## 第四步：创建config-client工程： 

右键工程->创建创建module->选择spring initialir->web->web,cloud config->client,然后一直下一步就行了。


####  创建完成后：

	<?xml version="1.0" encoding="UTF-8"?>
	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
		<modelVersion>4.0.0</modelVersion>
		<parent>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-parent</artifactId>
			<version>2.1.1.RELEASE</version>
			<relativePath/> <!-- lookup parent from repository -->
		</parent>
		<groupId>com.test</groupId>
		<artifactId>config-client</artifactId>
		<version>0.0.1-SNAPSHOT</version>
		<name>config-client</name>
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
				<artifactId>spring-cloud-starter-config</artifactId>
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
	  port: 8881
	spring:
	  cloud:
		config:
		  label: master
		  profile: dev
		  uri: http://localhost:8888/
	  application:
		name: config-client
	
	##spring.cloud.config.label 指明远程仓库的分支

	##spring.cloud.config.profile

		##dev开发环境配置文件
		##test测试环境
		##pro正式环境

	##spring.cloud.config.uri= http://localhost:8888/ 指明配置服务中心的网址。

## 第五步 配置主程序
	
在ConfigClientApplication类里面写一个API接口"/hello”，返回从配置中心读取的hello变量的值，代码如下

	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;

	@SpringBootApplication
	@RestController
	public class ConfigClientApplication {

		public static void main(String[] args) {
			SpringApplication.run(ConfigClientApplication.class, args);
		}

		@Value("${hello}")
		String hello;

		@RequestMapping("/hello")
		public String hello(){
			return "name=" + hello;
		}
	}

## 第六步 启动程序

访问http://localhost:8881/hello，网页显示

name=hello,handsomeman.
	


####  源码下载：

[https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section6](https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section6)

