---
layout:     post
title:      "微服务之SpringBoot集成Swagger"
subtitle:   " \"Hello SpringBoot, Hello Swagger\""
date:       2018-10-24 12:00:00
author:     "墨城烟柳（Mcyl）"
header-img: "img/post-bg-css.jpg"
catalog: true
tags:
    - SpringBoot
---

> “Hello everyone! ”


## 认识Swagger

Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。总体目标是使客户端和文件系统作为服务器以同样的速度来更新。文件的方法，参数和模型紧密集成到服务器端的代码，允许API来始终保持同步。

**作用**：

1. *接口的文档在线自动生成。*

2. *功能测试。*

**Swagger是一组开源项目，其中主要要项目如下：**

1.   **Swagger-tools**:提供各种与Swagger进行集成和交互的工具。例如模式检验、Swagger 1.2文档转换成Swagger 2.0文档等功能。

2.   **Swagger-core**: 用于Java/Scala的的Swagger实现。与JAX-RS(Jersey、Resteasy、CXF...)、Servlets和Play框架进行集成。

3.   **Swagger-js**: 用于JavaScript的Swagger实现。

4.   **Swagger-node-express**: Swagger模块，用于node.js的Express web应用框架。

5.   **Swagger-ui**：一个无依赖的HTML、JS和CSS集合，可以为Swagger兼容API动态生成优雅文档。

6.   **Swagger-codegen**：一个模板驱动引擎，通过分析用户Swagger资源声明以各种语言生成客户端代码。

## 集成SpringBoot

#### 第一步： jar包的引入

	<dependency> 
	  <groupId>io.springfox</groupId> 
	  <artifactId>springfox-swagger2</artifactId> 
	  <version>2.6.1</version> 
	</dependency> 

	<dependency> 
	  <groupId>io.springfox</groupId> 
	  <artifactId>springfox-swagger-ui</artifactId> 
	  <version>2.6.1</version> 
	</dependency>

#### 第二步： swagger的配置启动类编写
在Application.java同级创建Swagger2的配置类Swagger2

	package com.swaggerTest;
	 
	import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;
	 
	import springfox.documentation.builders.ApiInfoBuilder;
	import springfox.documentation.builders.PathSelectors;
	import springfox.documentation.builders.RequestHandlerSelectors;
	import springfox.documentation.service.ApiInfo;
	import springfox.documentation.spi.DocumentationType;
	import springfox.documentation.spring.web.plugins.Docket;
	import springfox.documentation.swagger2.annotations.EnableSwagger2;
	 
	/**
	 * Swagger2配置类
	 * 在与spring boot集成时，放在与Application.java同级的目录下。
	 * 通过@Configuration注解，让Spring来加载该类配置。
	 * 再通过@EnableSwagger2注解来启用Swagger2。
	 */
	@Configuration
	@EnableSwagger2
	public class Swagger2 {
		
		/**
		 * 创建API应用
		 * apiInfo() 增加API相关信息
		 * 通过select()函数返回一个ApiSelectorBuilder实例,用来控制哪些接口暴露给Swagger来展现，
		 * 本例采用指定扫描的包路径来定义指定要建立API的目录。
		 * 
		 * @return
		 */
		@Bean
		public Docket createRestApi() {
			return new Docket(DocumentationType.SWAGGER_2)
					.apiInfo(apiInfo())
					.select()                
					//为当前包路径
					.apis(RequestHandlerSelectors.basePackage("com.swaggerTest.controller"))
					.paths(PathSelectors.any())
					.build();
		}
		
		/**
		 * 创建该API的基本信息（这些基本信息会展现在文档页面中）
		 * 访问地址：http://项目实际地址/swagger-ui.html
		 * @return
		 */
		private ApiInfo apiInfo() {
			return new ApiInfoBuilder()
					//页面标题
					.title("Spring Boot中使用Swagger2构建RESTful APIs")
					//描述
					.description("更多请关注http://www.baidu.com")
					//服务地址
					.termsOfServiceUrl("http://www.baidu.com")
					//创建人
					.contact("sunf")
					//版本号
					.version("1.0")
					.build();
		}
	}

以上代码所示，通过createRestApi函数创建Docket的Bean之后，apiInfo()用来创建该Api的基本信息（这些基本信息会展现在文档页面中）。

#### 第三步：使用swagger来进行模拟测试：

	package com.swaggerTest.controller;
	 
	import org.springframework.stereotype.Controller;
	import org.springframework.util.StringUtils;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestMethod;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.ResponseBody;
	 
	import io.swagger.annotations.Api;
	import io.swagger.annotations.ApiImplicitParam;
	import io.swagger.annotations.ApiImplicitParams;
	import io.swagger.annotations.ApiOperation;
	 
	/**
	 * 一个用来测试swagger注解的控制器
	 * 注意@ApiImplicitParam的使用会影响程序运行，如果使用不当可能造成控制器收不到消息
	 * 
	 * @author SUNF
	 */
	@Controller
	@RequestMapping("/Hello")
	@Api(value = "HelloController|一个用来测试swagger注解的控制器")
	public class HelloController {
		
		@ResponseBody
		@RequestMapping(value ="/getUserName", method= RequestMethod.GET)
		@ApiOperation(value="根据用户编号获取用户姓名", notes="test: 仅1和2有正确返回")
		@ApiImplicitParam(paramType="query", name = "userNumber", value = "用户编号", required = true, dataType = "Integer")
		public String getUserName(@RequestParam Integer userNumber){
			if(userNumber == 1){
				return "张三";
			}
			else if(userNumber == 2){
				return "李四";
			}
			else{
				return "未知";
			}
		}
		
		@ResponseBody
		@RequestMapping("/updatePassword")
		@ApiOperation(value="修改用户密码", notes="根据用户id修改密码")
		@ApiImplicitParams({
			@ApiImplicitParam(paramType="query", name = "userId", value = "用户ID", required = true, dataType = "Integer"),
			@ApiImplicitParam(paramType="query", name = "password", value = "旧密码", required = true, dataType = "String"),
			@ApiImplicitParam(paramType="query", name = "newPassword", value = "新密码", required = true, dataType = "String")
		})
		public String updatePassword(@RequestParam(value="userId") Integer userId, @RequestParam(value="password") String password, 
				@RequestParam(value="newPassword") String newPassword){
		  if(userId <= 0 || userId > 2){
			  return "未知的用户";
		  }
		  if(StringUtils.isEmpty(password) || StringUtils.isEmpty(newPassword)){
			  return "密码不能为空";
		  }
		  if(password.equals(newPassword)){
			  return "新旧密码不能相同";
		  }
		  return "密码修改成功!";
		}
	}


Swagger使用的注解及其说明：

- @Api：用在类上，说明该类的作用。

- @ApiOperation：注解来给API增加方法说明。

- @ApiImplicitParams : 用在方法上包含一组参数说明。

    -   paramType：指定参数放在哪个地方
		
		-   header：请求参数放置于Request Header，使用@RequestHeader获取

		-   query：请求参数放置于请求地址，使用@RequestParam获取

		-   path：（用于restful接口）-->请求参数的获取：@PathVariable

		-   body：（不常用

		-   form（不常用）

    -   name：参数名

    -   dataType：参数类型

	-   required：参数是否必须传（true or false）

    -   value：说明参数的意思

    -   defaultValue：参数的默认值

- @ApiImplicitParam：用来注解来给方法入参增加说明。

- @ApiResponses：用于表示一组响应

- @ApiResponse：用在@ApiResponses中，一般用于表达一个错误的响应信息

    -   code：数字，例如400

    -   message：信息，例如"请求参数没填好"

    -   response：抛出异常的类   

- @ApiModel：描述一个Model的信息（一般用在请求参数无法使用@ApiImplicitParam注解进行描述的时候）

    -   @ApiModelProperty：描述一个model的属性

#### 第四步：完成上述代码后
启动Spring Boot程序，访问：http://localhost:8080/swagger-ui.html

## 【*注】

1.如果后台写了过滤器或者有跨域请注意加上以下代码：

	@Configuration
	public class WebApiConfig extends WebMvcConfigurationSupport {
	 
		//解决访问Swagger404问题
		@Override
		public void addResourceHandlers(ResourceHandlerRegistry registry) {
			registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
			registry.addResourceHandler("swagger-ui.html")
					.addResourceLocations("classpath:/META-INF/resources/");
			registry.addResourceHandler("/webjars/**")
					.addResourceLocations("classpath:/META-INF/resources/webjars/");
			super.addResourceHandlers(registry);
		}
		
		//跨域代码
		@Override
		public void addCorsMappings(CorsRegistry registry) {
			registry.addMapping("/**")
					.allowedOrigins("*")
					.allowedMethods("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH")
					.allowCredentials(true).maxAge(3600);
		}


2.paramType会直接影响程序的运行期，如果paramType与@RequestParam方法参数获取使用的注解不一致，会直接影响到参数的接收。

3.Conntroller中定义的方法必须在@RequestMapper中显示的指定RequestMethod类型，否则SawggerUi会默认为全类型皆可访问， API列表中会生成多条项目。


