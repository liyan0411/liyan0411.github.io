---
layout:     post
title:      "SpringBoot 整合 MyBatis多数据源"
subtitle:   " \"Hello SpringBoot, Hello MyBatis\""
date:       2019-10-30 14:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## 多数据源简介

目前，业界流行的数据操作框架是 Mybatis，那 Druid 是什么呢？ Druid 是 Java 的数据库连接池组件。Druid 能够提供强大的监控和扩展功能。比如可以监控 SQL ，在监控业务可以查询慢查询 SQL 列表等。

Druid 核心主要包括三部分： 

1. DruidDriver 代理 Driver，能够提供基于 Filter－Chain 模式的插件体系。 
2. DruidDataSource 高效可管理的数据库连接池 
3. SQLParser 当业务数据量达到了一定程度，DBA需要合理配置数据库资源。

即配置主库的机器高配置，把核心高频的数据放在主库上；把次要的数据放在低配置的从库。开源节流嘛，把数据放在不同的数据库里，就需要通过不同的数据源进行操作数据。

## 数据库准备

#### 1、主库master

	CREATE DATABASE master;
 
	DROP TABLE IF EXISTS `user`;
	CREATE TABLE `user`  (
	  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户编号',
	  `user_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名称',
	  `description` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述',
	  PRIMARY KEY (`id`) USING BTREE
	) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
 
	INSERT user VALUES (1 ,'铠','以绝望挥剑 着逝者为铠');

#### 2、从库slave

	CREATE DATABASE slave;
	 
	DROP TABLE IF EXISTS `city`;
	CREATE TABLE `city`  (
	  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '城市编号',
	  `user_id` int(10) UNSIGNED NOT NULL COMMENT '用户id',
	  `city_name` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '城市名称',
	  `description` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述',
	  PRIMARY KEY (`id`) USING BTREE
	) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
	 
	INSERT city VALUES (1 ,1,'长安城','铠的家乡在长安城');

##  创建springboot工程，完成后pom文件：

	<?xml version="1.0" encoding="UTF-8"?>
	<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	    <modelVersion>4.0.0</modelVersion>
	    <parent>
	        <groupId>org.springframework.boot</groupId>
	        <artifactId>spring-boot-starter-parent</artifactId>
	        <version>2.2.0.RELEASE</version>
	        <relativePath/> <!-- lookup parent from repository -->
	    </parent>
	    <groupId>com.example</groupId>
	    <artifactId>multisource</artifactId>
	    <version>0.0.1-SNAPSHOT</version>
	    <name>multisource</name>
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
	            <groupId>org.mybatis.spring.boot</groupId>
	            <artifactId>mybatis-spring-boot-starter</artifactId>
	            <version>2.1.1</version>
	        </dependency>
	        <!-- Druid 数据连接池依赖 -->
	        <dependency>
	            <groupId>com.alibaba</groupId>
	            <artifactId>druid</artifactId>
	            <version>1.0.28</version>
	        </dependency>

	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-devtools</artifactId>
	            <scope>runtime</scope>
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




## 配置appication.yml文件：

	## master 数据源配置
	master:
	  datasource:
	    url: jdbc:mysql://localhost:3306/master?useUnicode=true&characterEncoding=utf8
	    username: root
	    password: 123456
	    driverClassName: com.mysql.cj.jdbc.Driver

	## slave 数据源配置
	slave:
	  datasource:
	    url: jdbc:mysql://localhost:3306/slave?useUnicode=true&characterEncoding=utf8
	    username: root
	    password: 123456
	    driverClassName: com.mysql.cj.jdbc.Driver

	#热部署
	spring:
	  devtools:
	  	restart:
	  	  enabled: true


## 主从数据config配置

#### 1、主数据源MasterDataSourceConfig 配置

	package com.example.multisource.config;

	import com.alibaba.druid.pool.DruidDataSource;
	import org.apache.ibatis.session.SqlSessionFactory;
	import org.mybatis.spring.SqlSessionFactoryBean;
	import org.mybatis.spring.annotation.MapperScan;
	import org.springframework.beans.factory.annotation.Qualifier;
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;
	import org.springframework.context.annotation.Primary;
	import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
	import org.springframework.jdbc.datasource.DataSourceTransactionManager;

	import javax.sql.DataSource;

	@Configuration
	// 扫描 Mapper 接口并容器管理
	@MapperScan(basePackages = MasterDataSourceConfig.PACKAGE, sqlSessionFactoryRef = "masterSqlSessionFactory")
	public class MasterDataSourceConfig {
	    // 精确到 master 目录，以便跟其他数据源隔离
	    static final String PACKAGE = "com.example.multisource.mapper.master";
	    static final String MAPPER_LOCATION = "classpath:mapper/master/*.xml";

	    @Value("${master.datasource.url}")
	    private String url;

	    @Value("${master.datasource.username}")
	    private String user;

	    @Value("${master.datasource.password}")
	    private String password;

	    @Value("${master.datasource.driverClassName}")
	    private String driverClass;

	    @Bean(name = "masterDataSource")
	    @Primary
	    public DataSource masterDataSource() {
	        DruidDataSource dataSource = new DruidDataSource();
	        dataSource.setDriverClassName(driverClass);
	        dataSource.setUrl(url);
	        dataSource.setUsername(user);
	        dataSource.setPassword(password);
	        return dataSource;
	    }

	    @Bean(name = "masterTransactionManager")
	    @Primary
	    public DataSourceTransactionManager masterTransactionManager() {
	        return new DataSourceTransactionManager(masterDataSource());
	    }

	    @Bean(name = "masterSqlSessionFactory")
	    @Primary
	    public SqlSessionFactory masterSqlSessionFactory(@Qualifier("masterDataSource") DataSource masterDataSource)
	            throws Exception {
	        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
	        sessionFactory.setDataSource(masterDataSource);
	        sessionFactory.setMapperLocations(
	                new PathMatchingResourcePatternResolver().getResources(MasterDataSourceConfig.MAPPER_LOCATION));
	        return sessionFactory.getObject();
	    }
	}


#### 2、从数据源SlaveDataSourceConfig配置
	
	package com.example.multisource.config;

	import com.alibaba.druid.pool.DruidDataSource;
	import org.apache.ibatis.session.SqlSessionFactory;
	import org.mybatis.spring.SqlSessionFactoryBean;
	import org.mybatis.spring.annotation.MapperScan;
	import org.springframework.beans.factory.annotation.Qualifier;
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;
	import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
	import org.springframework.jdbc.datasource.DataSourceTransactionManager;

	import javax.sql.DataSource;

	@Configuration
	// 扫描 Mapper 接口并容器管理
	@MapperScan(basePackages = SlaveDataSourceConfig.PACKAGE, sqlSessionFactoryRef = "slaveSqlSessionFactory")
	public class SlaveDataSourceConfig {
	    // 精确到 slave 目录，以便跟其他数据源隔离
	    static final String PACKAGE = "com.example.multisource.mapper.slave";
	    static final String MAPPER_LOCATION = "classpath:mapper/slave/*.xml";

	    @Value("${slave.datasource.url}")
	    private String url;

	    @Value("${slave.datasource.username}")
	    private String user;

	    @Value("${slave.datasource.password}")
	    private String password;

	    @Value("${slave.datasource.driverClassName}")
	    private String driverClass;

	    @Bean(name = "slaveDataSource")
	    public DataSource slaveDataSource() {
	        DruidDataSource dataSource = new DruidDataSource();
	        dataSource.setDriverClassName(driverClass);
	        dataSource.setUrl(url);
	        dataSource.setUsername(user);
	        dataSource.setPassword(password);
	        return dataSource;
	    }

	    @Bean(name = "slaveTransactionManager")
	    public DataSourceTransactionManager slaveTransactionManager() {
	        return new DataSourceTransactionManager(slaveDataSource());
	    }

	    @Bean(name = "slaveSqlSessionFactory")
	    public SqlSessionFactory slaveSqlSessionFactory(@Qualifier("slaveDataSource") DataSource slaveDataSource)
	            throws Exception {
	        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
	        sessionFactory.setDataSource(slaveDataSource);
	        sessionFactory.setMapperLocations(
	                new PathMatchingResourcePatternResolver().getResources(SlaveDataSourceConfig.MAPPER_LOCATION));
	        return sessionFactory.getObject();
	    }
	}



## 业务层代码

	package com.example.multisource.service.impl;

	import com.example.multisource.entity.CityEntity;
	import com.example.multisource.entity.UserEntity;
	import com.example.multisource.mapper.master.UserEntityMapper;
	import com.example.multisource.mapper.slave.CityEntityMapper;
	import com.example.multisource.service.UserService;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Service;

	import java.util.HashMap;
	import java.util.Map;

	@Service
	public class UserServiceImpl implements UserService {

	    @Autowired
	    UserEntityMapper userEntityMapper; // 主数据库

	    @Autowired
	    CityEntityMapper cityEntityMapper; // 从数据库

	    @Override
	    public Map<String, Object> getUserInfo(int id) {
	        UserEntity userEntity = userEntityMapper.selectByPrimaryKey(id);
	        CityEntity cityEntity = cityEntityMapper.selectCityByUserId(id);
	        Map<String, Object> map = new HashMap<>();
	        map.put("userEntity", userEntity);
	        map.put("cityEntity", cityEntity);
	        return map;
	    }
	}



## 访问工程

 启动工程，访问http://localhost:8081/getUserInfo?id=1，获取数据如下：

``` 	
{
    "userEntity": {
        "id": 1,
        "userName": "铠",
        "description": "以绝望挥剑 着逝者为铠"
    },
    "cityEntity": {
        "id": 1,
        "userId": 1,
        "cityName": "长安城",
        "description": "铠的家乡在长安城"
    }
}
```
 
####  源码下载：

[https://github.com/mochengyanliu/Study/tree/master/memcache](https://github.com/mochengyanliu/Study/tree/master/multisource)


