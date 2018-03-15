---
layout: post
title:  "JavaScript语言核心——JavaScript中的类和模块"
date:   2016-04-04 23:11:54
categories: JavaScript
tags: JavaScript
excerpt:	每个JavaScript对象都是一个属性集合，相互之间没有任何联系。JavaScript中也可以定义对象的类，让每个对象都共享某些属性，这种“共享”的特性是非常有用的。类的成员或实例都包含一些属性，用以存放或定义它们的状态，其中有些属性定义了它们的行为(方法);在JavaScript中，类的实现是基于其原型继承机制的，如果两个实例都从同一个原型对象上继承了属性，我们说它们是同一个类的实例。
mathjax: true
author:	闵超
---
* content
{:toc}

##		JavaScript中的类和模块

之前的第二篇中学过了JavaScript对象，每个JavaScript对象都是一个属性集合，相互之间没有任何联系。JavaScript中也可以定义对象的类，让每个对象都共享某些属性，这种“共享”的特性是非常有用的。类的成员或实例都包含一些属性，用以存放或定义它们的状态，其中有些属性定义了它们的行为(方法);

在JavaScript中，类的实现是基于其原型继承机制的，如果两个实例都从同一个原型对象上继承了属性，我们说它们是同一个类的实例。

如果两个对象继承自同一个原型，往往意味着(但不是绝对)它们是由同一个构造函数创建并初始化。


###		类和原型

在js中，类的所有实例对象都从同一个原型对象上继承属性。因此，原型对象是类的核心。一个函数可以看成一个类，原型是所有类都有的一个属性，原型的作用就是给这个类的每一个对象都添加一个统一的方法


###		类和构造函数


定义构造函数就是定义类，并且类名首字母要大写，而普通的函数和方法都是首字母小写。构造函数是用来初始化新创建的对象的。

####	构造函数和类的标识

原型对象是类的唯一标识：当且仅当两个对象继承自同一个原型对象时，它们才是属于同一个类的实例。

#####	constructor属性
	
任何js函数都可以用做构造函数，并且调用构造函数是需要用到一个prototye属性的，因此，每个js函数都自动拥有一个prototype属性。这个属性的值是一个对象，这个对象包含唯一一个不可枚举属性constructor。

#####	Constructor属性值是一个函数对象:
	
	var F=function(){};		//这是一个函数对象
	var p =F.prototype;		//这是F相关联的原型对象
	var c=p.constructor;	//这是与原型相关联的函数
	c===F				//true
			
可以看出，构造函数的原型中存在预先定义好的constructor属性。

#####	js中的java式的类继承
			
Js和java的不同之处在于，js中的函数都是以值的形式出现的，方法和字段之间并没有太大的区别。如果属性值是函数，那么这个属性就兴义一个方法；否则，它只是一个普通的属性或字段，尽管存在出多差异，我们还是可以用js模拟出java的四种成员类型。

Js中类牵扯出三种不同的对象，三种对象的属性的行为和下面三种类成员非常相似：

1.	构造函数对象

	构造函数 (对象)是js的类定义了名字。任何添加到这个构造函数对象中的属性都是类字段和类方法(如果属性值是函数的话就是类方法)。

2.	原型对象

	原型对象的属性被类的所有实例所继承没如果原型对象的属性值是函数的话这个函数就作为类的实例的方法来调用。
3.	实例对象

	类的每个实例都是一个独立的对象，直接给这个实例定义的属性是不会为所有实例对象所共享的，定义在实例上的非函数属性，实际上是实例的字段。

####	类的扩充
	
Js基于原型的继承机制是动态的，对象从其原型继承属性没如果创建对象之后原型的属性发生改变，也会影响到继承这个原型的所有实例对象

####	类和类型
	
js定义了少量的数据类型：null,undefined,布尔值,数字,字符串,函数和对象。

instanceof运算符,左操作数是待检测其类的对象，右操作数是定义类的构造函数。如果o继承自c.prototype，则表达式o instanceof c值为true。

constructor属性是某个类的方法是使用constructor属性。

使用instanceof运算符和constructor属性来检测对象所属的类有一个主要问题，在多个执行上下文中存在构造函数的多个副本的时候，这两种方法的检测结果会出错。

####	js中的面向对象技术。

如何利用js的类进行编程。

1.	集合类的一个例子：

2.	枚举类型

3.	标准转换方法：toString();toLocaleString();valueOf();toJSON()

4.	比较方法	:

	equals()方法对其参数执行了类型检查，
	
	compareTo()方法并没有返回一个表示”这两个值不能比较，由于咩有对象参数做任何类型检查，因此如果给compareTo()方法传入错误类型的参数，往往会抛出异常

5.	方法借用
  
	Js中方法没有什么特别的，无非是一些简单的函数，赋值给了队形的属性，可以通过对象来调用它，一个函数可以赋值给两个属性，然后作为两个方法来调用它。

6.	私有状态

	在经典的面向对象编程中，经常需要将对象的某个状态封装或隐藏在对象内，只有通过对象的方法才能访问这些状态，对外值暴露一些重要的状态变量可以直接读写。

7.	构造函数的重载和工厂方法
 
	有时候，我们希望对象的初始化有多种方式，通过重载(overload)这个构造函数让它根据传入参数的不同来执行不同的初始化方法。

####	子类

A是父类，B是子类,B的实例从A继承了所有的实例方法，，类B可以定义自己的实例方法，有些方法可以重载类A中的同名方法，如果B的方法重载了A中的方法，B中重载方法可能会调用A中的重载方法，这种做法称为”方法链”

#####	定义子类

JS的对象可以从类的原型对象中继承属性。B.prototype = inherit(A.prototype);//子类派生自父类	B.prototype.comstructor = B;//重载继承来的constructor属性

#####	构造方法和子类链

#####	组合vs子类
	
面向对象编程中一条广为人知的设计原则：“组合优于继承”。这样，可以利用组合的原理定义一个新的集合实现，它“包装”了另一个集合对象，在将受限制的成员过滤掉之后会用到这个(包装的)集合对象。

#####	类的层次结构和抽象类
	
为了将这条原则阐述清楚，创建了Set的子类，这样做的原因是最终得到的类是Set的实例，它将从Set继承有用的辅助方法，比如toString()和equals()。

####	ES5中的类

让属性不可枚举

定义不可变的类
	
除了可以设置属性为不可枚举的，ECMS5还可以设置属性为只读的，当我们希望类的实例都是不可变的，这个特性非常有帮助。

#####	封装对象状态
	
构造函数中的变量和参数可以用做它创建的对象的私有状态

#####	防止类的扩展
	
通常给原型对象添加方法可以动态地对类进行扩展，这是js的特性

#####	子类和ECMS5

####	模块

将代码组织到类中的一个重要的原因是，让代码更加“模块化”，可以在很多不同场景中实现代码的重用。一般来说，模块是一个独立的js文件，模块文件可以包含一个类定义、一组相关的类、一个使用函数库或者是一些待执行的代码。

#####	用做命名空间的对象
	
在模块创建过程中避免污染全局变量的一种方法是使用一个对象作为命名空间。它将函数和值作为命名空间对象属性存储起来，而不是定义全局函数和变量。

#####	作为私有命名空间的函数
	
模块对外导出一些共用API，这些API是提供给其他程序员使用的，它包括函数、类、属性和方法。