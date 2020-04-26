---
layout:     post
title:      "SpringBoot 整合 阿里云OSS存储服务 秒变图床"
subtitle:   " \"Hello SpringBoot, Hello OSS\""
date:       2019-04-01 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-os-metro.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## 阿里云OSS简介

阿里云 OSS 将数据文件以对象（object）的形式上传到存储空间（bucket）中。您可以进行以下操作：

1. 创建一个或者多个存储空间，向每个存储空间中添加一个或多个文件。
2. 通过获取已上传文件的地址进行文件的分享和下载。
3. 通过修改存储空间或文件的读写权限（ACL）来设置访问权限。
4. 通过阿里云管理控制台、各种便捷工具、以及丰富的 SDK 包执行基本和高级 OSS 操作。

## 第一步： 新建SpringBoot项目

右键工程->创建Project->选择spring initialir->Web-Web,Template->Thymeleaf,然后一直下一步就行了。

####  创建完成后加入阿里云OSS集成包文件：

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
	    <artifactId>osspicture</artifactId>
	    <version>0.0.1-SNAPSHOT</version>
	    <name>osspicture</name>
	    <description>Demo project for Spring Boot</description>

	    <properties>
	        <java.version>1.8</java.version>
	    </properties>

	    <dependencies>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-web</artifactId>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-test</artifactId>
	            <scope>test</scope>
	        </dependency>
	        <!-- Thymeleaf-->
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-starter-thymeleaf</artifactId>
	        </dependency>
	        <!-- 阿里云OSS-->
	        <dependency>
	            <groupId>com.aliyun.oss</groupId>
	            <artifactId>aliyun-sdk-oss</artifactId>
	            <version>2.4.0</version>
	        </dependency>
	        <dependency>
	            <groupId>commons-fileupload</groupId>
	            <artifactId>commons-fileupload</artifactId>
	            <version>1.3.1</version>
	        </dependency>
	        <dependency>
	            <groupId>org.springframework.boot</groupId>
	            <artifactId>spring-boot-configuration-processor</artifactId>
	            <optional>true</optional>
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

	server:
	  port: 8081
	spring:
	  servlet:
	    multipart:
	      max-file-size: 100MB
	      max-request-size: 1000MB

## 第二步：配置常量类AliyunOSSConfigConstant类

	package com.test.osspicture.config;

	public class AliyunOSSConfigConstant {

	    private AliyunOSSConfigConstant() {

	    }

	    //仓库名称 Bucket名称
	    public static final String BUCKE_NAME = "storagepicture";

	    //地域节点 仓库访问域名
	    public static final String END_POINT = "oss-cn-shanghai.aliyuncs.com";

	    //AccessKey Id 在个人信息里面
	    public static final String AccessKey_ID = "你的AccessKeyID";

	    //Access Key Secret 在个人信息里面
	    public static final String AccessKey_Secret = "你的AccessKeySecret";

	    //仓库的文件夹
	    public static final String FILE_HOST = "test";

	    //本地存储路径
	    public static final String LOCAL_FILE = "/Users/lijun/java/";
	}



## 第三步： 配置工具类AliyunOSSUtil类
	
	package com.test.osspicture.util;

	import com.aliyun.oss.ClientException;
	import com.aliyun.oss.OSSClient;
	import com.aliyun.oss.OSSException;
	import com.aliyun.oss.model.CannedAccessControlList;
	import com.aliyun.oss.model.CreateBucketRequest;
	import com.aliyun.oss.model.GetObjectRequest;
	import com.aliyun.oss.model.ListObjectsRequest;
	import com.aliyun.oss.model.OSSObjectSummary;
	import com.aliyun.oss.model.ObjectListing;
	import com.aliyun.oss.model.PutObjectRequest;
	import com.aliyun.oss.model.PutObjectResult;
	import com.test.osspicture.config.AliyunOSSConfigConstant;
	import org.springframework.stereotype.Component;

	import javax.imageio.ImageIO;
	import java.awt.*;
	import java.io.File;
	import java.io.IOException;
	import java.util.ArrayList;
	import java.util.HashMap;
	import java.util.List;
	import java.util.Map;
	import java.util.UUID;

	@Component
	public class AliyunOSSUtil {
	    private static String FILE_URL;
	    private static String bucketName = AliyunOSSConfigConstant.BUCKE_NAME;
	    private static String endpoint = AliyunOSSConfigConstant.END_POINT;
	    private static String accessKeyId = AliyunOSSConfigConstant.AccessKey_ID;
	    private static String accessKeySecret = AliyunOSSConfigConstant.AccessKey_Secret;
	    private static String fileHost = AliyunOSSConfigConstant.FILE_HOST;
	    private static String localFileName = AliyunOSSConfigConstant.LOCAL_FILE;

	    /**
	     * 上传图片
	     * @param file
	     * @return
	     */
	    public static String upLoad(File file){
	        // 默认值：true
	        boolean isImage = true;
	        // 判断所要上传的是否是图片，图片可以预览，其他不支持预览
	        try {
	            Image image = ImageIO.read(file);
	        } catch (IOException e) {
	            e.printStackTrace();
	        }

	        System.out.println("------OSS文件上传开始--------" + file.getName());

	        // 判断文件
	        if(file == null){
	            return null;
	        }

	        // 创建OSSClient实例
	        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);

	        try {
	            // 判断容器是否存在，不存在创建
	            if (!ossClient.doesBucketExist(bucketName)) {
	                ossClient.createBucket(bucketName);
	                CreateBucketRequest createBucketRequest = new CreateBucketRequest(bucketName);
	                createBucketRequest.setCannedACL(CannedAccessControlList.PublicRead);
	                ossClient.createBucket(createBucketRequest);
	            }

	            // 设置文件路径和名称
	            String fileUrl = fileHost + "/" + (UUID.randomUUID().toString().replace("-", "") + "-" + file.getName());
	            if (isImage) {
	                FILE_URL = "https://" + bucketName + "." + endpoint + "/" + fileUrl;
	            } else {
	                FILE_URL = "非图片，不可预览，文件路径为：" + fileUrl;
	            }

	            // 上传图片
	            PutObjectResult result = ossClient.putObject(new PutObjectRequest(bucketName, fileUrl, file));

	            // 设置权限（公开读）
	            ossClient.setBucketAcl(bucketName, CannedAccessControlList.PublicRead);
	            if (result != null) {
	                System.out.println("------OSS文件上传成功--------" + file.getName());
	            }
	        } catch (OSSException oe) {
	            System.out.println(oe.getMessage());
	        } catch (ClientException ce) {
	            System.out.println(ce.getErrorMessage());
	        } finally {
	            if (ossClient != null) {
	                ossClient.shutdown();
	            }
	        }
	        return  FILE_URL;
	    }

	    /**
	     * 下载图片
	     * @param objectName
	     */
	    public static void downloadFile(String objectName) {
	        // 创建OSSClient实例
	        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
	        // 下载OSS文件到本地，如果本地存在会被覆盖，不存在就创建
	        String fielName = objectName.substring(objectName.indexOf("-")+1,objectName.length());
	        ossClient.getObject(new GetObjectRequest(bucketName, objectName), new File(localFileName + fielName));

	        // 关闭ossClient
	        ossClient.shutdown();
	    }

	    /**
	     * 浏览图片
	     * @return
	     */
	    public static List<Map<String, Object>> listFile() {
	        // 创建OSSClient实例
	        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);

	        //列出文件
	        ObjectListing listing = ossClient.listObjects(new ListObjectsRequest(bucketName).withPrefix("test/"));

	        //遍历所有文件
	        List<OSSObjectSummary> ossObjectSummaryList = listing.getObjectSummaries();
	        List<Map<String, Object>> list = new ArrayList<>();
	        for (int i = 0; i < ossObjectSummaryList.size(); i ++ ) {
	        	//去除第一个文件夹名称
	            if (i >= 1){
	                Map<String, Object> map = new HashMap<>();
	                map.put("url", "https://" + bucketName + "." + endpoint + "/" + ossObjectSummaryList.get(i).getKey());
	                map.put("fileName", ossObjectSummaryList.get(i).getKey());
	                list.add(map);
	            }
	        }
	        //关闭ossClient
	        ossClient.shutdown();
	        return list;
	    }

	    /**
	     * 删除文件
	     * @param objectName
	     */
	    public static void deleteFile(String objectName){
	        //创建OSSClient实例
	        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);

	        //删除文件
	        ossClient.deleteObject(bucketName, objectName);

	        //关闭OSSClient
	        ossClient.shutdown();
	    }

	}
 

## 第四步： 配置访问类AliyunOSSController类

	package com.test.osspicture.controller;

	import com.test.osspicture.util.AliyunOSSUtil;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.multipart.MultipartFile;

	import java.io.File;
	import java.io.FileOutputStream;
	import java.util.List;
	import java.util.Map;

	@Controller
	@RequestMapping("/oss")
	public class AliyunOSSController {

	    @Autowired
	    private AliyunOSSUtil aliyunOSSUtil;

	    @RequestMapping(value = "upload")
	    public String upload() {
	        return "upload.html";
	    }

	    @RequestMapping(value = "uploadFile")
	    public String upLoad(@RequestParam("file")MultipartFile file, Model model) {
	        String fileName = file.getOriginalFilename();
	        System.out.println(fileName);
	        try {
	            if (file != null) {
	                if (!"".equals(fileName.trim())) {
	                    File newFile = new File(fileName);
	                    FileOutputStream os = new FileOutputStream(newFile);
	                    os.write(file.getBytes());
	                    os.close();
	                    file.transferTo(newFile);
	                    // 上传到OSS
	                    String uploadUrl = aliyunOSSUtil.upLoad(newFile);
	                    model.addAttribute("url", uploadUrl);
	                    newFile.delete();
	                }
	            }
	        } catch (Exception ex) {
	            ex.printStackTrace();
	        }
	        return "uploadSuccess.html";
	    }

	    @RequestMapping(value = "download")
	    public String download(@RequestParam("fileName")String fileName) {
	        aliyunOSSUtil.downloadFile(fileName);
	        return "downSuccess.html";
	    }

	    @RequestMapping(value = "listFile")
	    public String listFile(Model model) {
	        List<Map<String, Object>> list = aliyunOSSUtil.listFile();
	        model.addAttribute("list", list);
	        return "listFile.html";
	    }

	    @RequestMapping(value = "deleteFile")
	    public String deleteFile(@RequestParam("fileName")String fileName) {
	        aliyunOSSUtil.deleteFile(fileName);
	        return "deleteSuccess.html";
	    }
	}

## 第四步：创建简单的页面
	uploadSuccess.html
	downSuccess.html
	listFile.html
	deleteSuccess.html
	upload.html

## 第五步：访问工程

 启动工程，访问http://localhost:8081/oss/listFile,此时可以进行图片管理啦！
 
####  源码下载：

[https://github.com/mochengyanliu/Study/tree/master/osspicture](https://github.com/mochengyanliu/Study/tree/master/osspicture)


