---
layout:     post
title:      "微服务之高可用的分布式配置中心（Spring Cloud Config）"
subtitle:   " \"Hello SpringBoot, Hello SpringClould\""
date:       2019-01-11 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - 手把手教你玩转SpringCloud
---

> “Hello everyone! ”


## 高可用的分布式配置中心（Spring Cloud Config）简介

上一篇文章讲述了一个服务如何从配置中心读取文件，配置中心如何从远程git读取配置文件，这样就存在了一个问题，
客户端和服务端的耦合性太高，如果server端要做集群，客户端只能通过原始的方式来路由，server端改变IP地址的时候，
客户端也需要修改配置，不符合springcloud服务治理的理念。springcloud提供了这样的解决方案，我们只需要将server
端当做一个服务注册到eureka中，client端去eureka中去获取配置中心server端的服务既可。



## 第一步：创建条件

创建一个maven主工程.

## 第二步：创建eureka-server工程： 

右键工程->创建module->选择spring initialir->cloud discovery->eureka server,然后一直下一步就行了。

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
		<artifactId>eureka-server</artifactId>
		<version>0.0.1-SNAPSHOT</version>
		<name>eureka-server</name>
		<description>Demo project for Spring Boot</description>

		<properties>
			<java.version>1.8</java.version>
			<spring-cloud.version>Greenwich.RC2</spring-cloud.version>
		</properties>

		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
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
	eureka:
	  instance:
		hostname: localhost
	  client:
		register-with-eureka: false
		fetch-registry: false
	  service-url:
		defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/


## 第三步 修改主程序

添加注解@EnableEurekaServer

	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

	@SpringBootApplication
	@EnableEurekaServer
	public class EurekaServerApplication {

		public static void main(String[] args) {
			SpringApplication.run(EurekaServerApplication.class, args);
		}

	}
	

## 第四步：创建config-server工程： 

右键工程->创建module->选择spring initialir->cloud discovery->eureka client,web->web,cloud config->server,然后一直下一步就行了。


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
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
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
	eureka:
	  client:
		service-url:
		  defaultZone: http://localhost:9871/eureka/

## 第五步 配置主程序

	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.cloud.config.server.EnableConfigServer;
	import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

	@SpringBootApplication
	@EnableEurekaClient
	@EnableConfigServer
	public class ConfigServerApplication {

		public static void main(String[] args) {
			SpringApplication.run(ConfigServerApplication.class, args);
		}

	}
	
## 第六步：创建config-server2工程： 

右键工程->创建module->选择spring initialir->cloud discovery->eureka client,web->web,cloud config->server,然后一直下一步就行了。


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
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
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
	  port: 8887
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
	eureka:
	  client:
		service-url:
		  defaultZone: http://localhost:9871/eureka/

## 第七步 配置主程序
	
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.cloud.config.server.EnableConfigServer;
	import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

	@SpringBootApplication
	@EnableEurekaClient
	@EnableConfigServer
	public class ConfigServerApplication {

		public static void main(String[] args) {
			SpringApplication.run(ConfigServerApplication.class, args);
		}

	}
	
## 第八步：创建config-client工程： 

右键工程->创建module->选择spring initialir->cloud discovery->eureka client,web->web,cloud config->client,然后一直下一步就行了。


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
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
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
	  application:
		name: config-client
	  cloud:
		config:
		  label: master
		  profile: dev
		  discovery:
			enabled: true
			service-id: config-server
	eureka:
	  client:
		service-url:
		  defaultZone: http://localhost:9871/eureka/

## 第九步 配置主程序
	
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;

	@SpringBootApplication
	@EnableEurekaClient
	@RestController
	public class ConfigClientApplication {

		public static void main(String[] args) {
			SpringApplication.run(ConfigClientApplication.class, args);
		}

		@Value("${hello}")
		String hello;

		@RequestMapping("/hello")
		public String hello(){
			return "hello=" + hello;
		}
	}
	

## 第十步 启动程序

依次启动eureka-servr,config-server,config-server2,config-client

我们先单独测试服务端，分别访问：http://localhost:8888/hello/dev、http://localhost:8887/hello/dev返回信息：

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


访问http://localhost:8881/hello，网页显示：name=hello,handsomeman.
说明客户端已经读取到了server端的内容，我们随机停掉一台server端的服务，
再次访问http://localhost:8002/hello，返回：hello im dev update，说明达到了高可用的目的。
	


####  源码下载：

[https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section7](https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section7)

