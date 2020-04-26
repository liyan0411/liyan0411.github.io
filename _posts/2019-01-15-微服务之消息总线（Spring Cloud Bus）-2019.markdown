---
layout:     post
title:      "微服务之消息总线（Spring Cloud Bus）"
subtitle:   " \"Hello SpringBoot, Hello SpringClould\""
date:       2019-01-15 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - 手把手教你玩转SpringCloud
---

> “Hello everyone! ”


## 消息总线（Spring Cloud Bus）简介

spring cloud bus整合java的事件处理机制和消息中间件消息的发送和接受，主要由发送端、
接收端和事件组成。针对不同的业务需求，可以设置不同的事件，发送端发送事件，接收端
接受相应的事件，并进行相应的处理。



## 第一步：创建条件

首先安装[rabbitmq](https://mochengyanliu.github.io/2019/01/16/RabbitMQ-安装教程-2019/)，然后创建一个maven主工程.

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
	
	
## 第六步：创建config-client工程： 

右键工程->创建module->选择spring initialir->cloud discovery->eureka client,web->web,cloud config->client,intgeration->tabbitmq,ops->actuator,然后一直下一步就行了。


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
				<artifactId>spring-boot-starter-actuator</artifactId>
			</dependency>
			<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-starter-amqp</artifactId>
			</dependency>
			<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-starter-web</artifactId>
			</dependency>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-bus</artifactId>
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
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-stream-binder-rabbit</artifactId>
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
		bus:
		  enabled: true
		  trace:
			enabled: true
	  rabbitmq:
		host: localhost
		port: 5672
		username: guest
		password: guest
	eureka:
	  client:
		service-url:
		  defaultZone: http://localhost:9871/eureka/
	management:
	  endpoints:
		web:
		  exposure:
			include: bus-refresh


## 第七步 配置主程序
	
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.boot.SpringApplication;
	import org.springframework.boot.autoconfigure.SpringBootApplication;
	import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
	import org.springframework.cloud.context.config.annotation.RefreshScope;
	import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RestController;

	@SpringBootApplication
	@EnableEurekaClient
	@EnableDiscoveryClient
	@RestController
	@RefreshScope
	public class ConfigClientApplication {

		public static void main(String[] args) {
			SpringApplication.run(ConfigClientApplication.class, args);
		}

		@Value("${hello}")
		String hello;

		@RequestMapping(value = "/hello")
		public String hello(){
			return "hello=" + hello;
		}
	}


## 第八步：创建config-client2工程： 

配置同config-client，修改端口号：8882
	

## 第九步 启动程序

依次启动eureka-servr,config-server,config-client,config-client2

分别访问：http://localhost:8881/hello、http://localhost:8882/hello返回信息：

hello=hello,handsomeman.

这时我们去代码仓库将hello的值改为“hello=hello,every handsomeman.”，即改变配置文件hello的值。
如果是传统的做法，需要重启服务，才能达到配置文件的更新。此时，我们只需要发送post请求，记住
一定要post请求：http://localhost:8881/actuator/bus-refresh，你会发现config-client会重新读取配置文件

	Fetching config from server at : http://localhost:8888
	Located environment: name=config-client, profiles=[dev], label=master, version=6591dd45233b34ef195417ee4e2ad9002eaddb79, state=null
	Located property source: CompositePropertySource {name='configService', propertySources=[MapPropertySource {name='configClient'}, MapPropertySource {name='https://github.com/mochengyanliu/SpringCloudConfig/dev/config-client-dev.properties'}]}


再次分别访问：http://localhost:8881/hello、http://localhost:8882/hello返回信息：

hello=hello,every handsomeman.

另外，/actuator/bus-refresh接口可以指定服务，即使用"destination"参数，比如 “/actuator/bus-refresh?destination=user:**” 即刷新服务名为user的所有服务。


####  源码下载：

[https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section8](https://github.com/mochengyanliu/SpringCloudLearn/tree/master/section8)

