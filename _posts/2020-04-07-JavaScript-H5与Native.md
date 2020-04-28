---
layout:     post
title:      "H5与Native交互"
subtitle:   " \"原生APP与H5页面之间的交互\""
date:       2020-04-07 14:00:09
author:     "小李子（Leey）"
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - Javascript
---

> “Record life record you.”

##  H5与原生 APP 交互的原理  
现在移动端 web 应用，很多时候都需要与原生 APP 进行交互、沟通（运行在 webview 中），比如微信的 jssdk，通过 window.wx 对象调用一些原生 APP 的功能。所以，这次就来捋一捋 H5 与原生 APP 交互的原理。 

H5 与原生 APP 的交互，本质上说，就是两种调用：
*  APP 调用 H5 
*  H5 调用 APP 

###  1.APP 调用 H5 的代码
因为 APP 是宿主，可以直接访问 H5，所以这种调用比较简单，就是在 H5 中曝露一些全局对象（包括方法），然后在原生 APP 中调用这些对象。  
#### javascript：
```
window.websdk={
  double = value => value * 2,
  triple = value => value * 3
}
```
####  android:
```
webview.evaluateJavascript('window.websdk.double(8)', new ValueCallback<String>() {
  @Override
  public void onReceiveValue(String s) {
    // 16
  }
});
```
####  ios:
```
NSString *func = @"window.websdk.double(8)";
// UIWebView
NSString *str = [webView stringByEvaluatingJavaScriptFromString:func]; // 16
// WKWebView
NSString *str = [wkWebView evaluateJavaScript:func]; // 16
```

###  2. H5 调用 APP 的代码
因为 H5 不能直接访问宿主 APP，所以这种调用就相对复杂一点。这种调用常用有两种方式：
*  由H5发起一个自定义协议请求，APP拦截这个请求后，再由APP调用 H5 中的回调函数  
*  由APP向H5注入一个全局js对象，然后在H5直接访问这个对象

####  2.1 由H5发起一个自定义协议请求  

这种方式要稍复杂一点，因为需要自定义协议，这对很多前端开发者来说是比较新的东西。一般不推荐这种方式。
> 大致需要以下几个步骤：
1. 由 APP自定义协议，比如 websdk://action?params 
2. 在 H5 定义好回调函数，比如 window.bridge = {getDouble: value => {value * 2}, getTriple: value => {value * 3}}
3. 由 H5 发起一个自定义协议请求，比如 window.location.href = 'websdk://double?value=8'
4. APP 拦截这个请求后，进行相应的操作，获取返回值  
5. 由 APP 调用 H5 中的回调函数，比如 window.bridge.getDouble(8);//16   window.bridge.getTriple(8);//24  

javascript:
```
window.bridge = {
  getDouble: value => value*2, 
  getTriple: value => value*3 
};
window.location.href = 'websdk://double?value=8';
```
android:
```
webview.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        // 判断如果 url 是 websdk:// 打头的就拦截掉
        // 然后从 url websdk://action?params 中取出 action 与params 
        Uri uri = Uri.parse(url);                                 
        if ( uri.getScheme().equals("websdk")) {
            // 比如 action = double, params = value=8
            webview.evaluateJavascript('window.bridge.getDouble(8)');
            return true;
        }
        return super.shouldOverrideUrlLoading(view, url);
    }
});
```
ios:
```
// UIwebview
- (BOOL)webview:(UIWebView *)webview shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    // 判断如果 url 是 websdk:// 打头的就拦截掉
    // 然后从 url websdk://action?params 中取出 action 与params
    NSString *urlStr = request.URL.absoluteString;
    if ([urlStr hasPrefix:@"websdk://"]) {
        // 比如 action = double, params = value=8
        NSString *func = @"window.bridge.getDouble(16)";
        [webview stringByEvaluatingJavaScriptFromString:func];
        return NO;
    }
    return YES;
}

// WKwebview
func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    // 判断如果 url 是 websdk:// 打头的就拦截掉
    // 然后从 url websdk://action?params 中取出 action 与params
    let urlStr = navigationAction.request.url?.absoluteString
    if (urlStr?.hasPrefix("websdk://"))! {
        // 比如 action = double, params = value=8
        let funcStr = "window.bridge.getDouble(16)"
        webView.evaluateJavaScript(funcStr, completionHandler: nil)
        decisionHandler(.cancel)
    } else {
        decisionHandler(.allow)
    }
}
<!--待完善-->
```
####  2.2 由app向h5注入一个全局js对象(推荐)  
这种方式沟通机制简单，比较好理解，并且对于 h5 来说，没有新的东西，是比较推荐的一种方式。
android:
```
webview.addJavascriptInterface(new Object() {
    @JavascriptInterface
    public int double(value) {
        return value * 2;
    }
    @JavascriptInterface
    public int triple(value) {
        return value * 3;
    }
}, "appSdk");
```
ios:
```
NSString *scripts = @"window.appSdk = {
    double: value => value * 2,
    triple: value => value * 3
}";
// UIWebView
[webview stringByEvaluatingJavaScriptFromString:scripts];
// WKWebView
[wkWebView evaluateJavaScript:scripts];
```
javascript:
```
window.appSdk.XXX(historyStr);
// 如果注册方式不同，由于android中没有webkit的属性，注意调用方式也要区分
if (ios) {
    // 调用 ios 的方法发送记录 WKWebView
    window.webkit.messageHandlers.XXX.postMessage(value);
}
if (android) {
    // 调用 Android 的方法发送记录
    window.android.XXX(value);
}
```
设备 | 调用
-------- | ---
ios | window.webkit.messageHandlers.XXX.postMessage(value);
android | window.android.XXX(value);

### 感谢你的阅读
> 多多指导哦

如果觉得喜欢，就收藏一下或者star一下呗，或者也可以给我的[github](https://github.com/liyan0411)来颗 star~~

### [https://github.com/liyan0411](https://github.com/liyan0411)