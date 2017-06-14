/**
 * Created by Administrator on 2016/11/3.
 */



BPR.bodyHeight = $(window).height() - BPR.notBodyHeight;
BPR.bodyHeight = BPR.bodyHeight > 400 ? BPR.bodyHeight : 400;
$('.body_main').css('min-height',BPR.bodyHeight);

$(window).resize(function(){
    $('.body_main').css('min-height',BPR.bodyHeight);
})
//检测浏览器版本，如果ie8以下，全部屏蔽
$(function(){
    //检测浏览器版本，如果是ie6/7/8，则跳转到提示页
    checkIEVer(function(version){
        if ( version==8 || version==7 || version==6 )
        {
            try{
                if(Ext.Msg){
                    //window.location=BPR.domain + "/browserUp.htm";
                }
            }catch(e){

            }
        }else{

        }
    })
})


// 检查IE浏览器版本,如果为ie则返回ie版本（6,7,8……）,否则返回0
function checkIEVer(cb){
    if(document.all){
        var versionIndex = navigator.userAgent.indexOf("MSIE ");
        var version = navigator.userAgent.substr(versionIndex, 7);
        cb(version.replace("MSIE ","")*1);
    } else {
        cb(0);
    }
}

/********************************************************字符串正则表达式验证/替换方法******************************************************************/
/**
 * 手机号码验证
 */
function CheckPhoneNum(phoneNum) {
    var filter_phoneNum = /^0?(1[0-9][0-9]|15[012356789]|18[012356789]|14[57]|17[678])[0-9]{8}$/;
    if (filter_phoneNum.test($.trim(phoneNum)))
        return true;
    else {
        return false;
    }
}

/**
 * 用户名验证(只能输入5-20个以字母开头、可带数字、“_”、“.”的字串 )
 */
function CheckUserName(userName) {
    var filter_userName = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._@-]){4,19}$/;
    if (filter_userName.test(userName))
        return true;
    else {
        return false;
    }
}
/**
 * 固定电话验证
 */
function isLinePhone(Num) {
    return Num.match(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/);
}
/**
 * 密码验证
 */
function CheckPassWord(passWord) {
    var filter_passWord = /^[a-zA-Z]\w{5,17}$/;
    if (filter_passWord.test(passWord))
        return true;
    else {
        return false;
    }
}

/**
 * 邮箱验证
 */
function CheckMail(mail) {
    var filter_email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter_email.test(mail))
        return true;
    else {
        return false;
    }
}

/**
 * 邮编验证
 */
function isPostalCode(postalCode) {
    // var patrn=/^[a-zA-Z0-9]{3,12}$/;
    var patrn = /^[1-9][0-9]{5}$/;
    if (!patrn.exec(postalCode)){
        return false;
    }
    return true
}

/**
 * 身份证验证
 */
function isIdCardNo(num) {
    num = num.toUpperCase(); // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    } // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    // 下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re); // 检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/'
            + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2]))
            && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
            && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            // alert('输入的身份证号里出生日期不对！');
            return false;
        } else { // 将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD
            // 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5,
                8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4',
                '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re); // 检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/"
            + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
            && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
            && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
// alert(dtmBirth.getYear());
// alert(arrSplit[2]);
            // alert('输入的身份证号里出生日期不对！');
            return false;
        } else { // 检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD
            // 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5,
                8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4',
                '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                // alert('18位身份证的校验码不正确！应该为：' + valnum);
                return false;
            }
            return true;
        }
    }
    return false;

}



function CheckHTML(Str){

    var S = Str;

    S = S.replace(/<img\s(src=\S+)(.*?>)/gi ,"[[[img $1>");

    S = S.replace(/<img\s(.+\s)(src=.*\s)(.*?>)/gi ,"[[[img $2 ");

    S = S.replace(/<br?>/gi , "[[[br/>");

    S = S.replace(/(<br>)/g, "");

    S = S.replace(/<p(.*?>)/gi , "[[[p>");

    S = S.replace(/<\/p>/gi , "[[[/p>");

    S = S.replace(/<(table+\s)/gi ,"[[[$1 ");

    S = S.replace(/<\/table?>/gi , "[[[/table>")    ;

    S = S.replace(/<(tr.+>)/gi ,"[[[tr>");

    S = S.replace(/<\/tr?>/gi , "[[[/tr>");

    S = S.replace(/<(td.*)(rowspan.\d.|colspan.\d.)(.*?)>/gi ,"[[[td $2>");

    S = S.replace(/<(td.+?)>/gi ,"[[[td>");

    S = S.replace(/<\/td?>/gi , "[[[/td>");

    S = S.replace(/<.+?>/gi , "");// 去掉其它HTML代码

    S = S.replace(/\[\[\[/gi , "<")  ;

    return S;

}

/**
 * 判断是否为空
 */
function isEmpty(str){
    str = str.replace(/( )/g,"");
    if(str.length > 0){
        return false;
    }
    return true;
}


/**
 * 特殊字符替换
 */
function convertSpecialChar(str){
    str = str.replace(/(&)/g, "&amp;");
    str = str.replace(/(<)/g, "&lt;");
    str = str.replace(/(>)/g, "&gt;");
    str = str.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    str = str.replace(/(\r\n)/g, "\n");
    str = str.replace(/(\n)/g, "<br>");
    str = str.replace(/( )/g, "&nbsp;&nbsp;");
    str = str.replace(/(')/g, "&#39;");
    str = str.replace(/(")/g, "&quot;");
    str = str.replace(/(\\)/g, "&#92;");
    str = str.replace(/(:)/g,"&#58;");
    str = str.replace(/(#)/g,"&58;");
    return str;
}

/**
 * 特殊字符还原
 */
function reconvertSpecialChar(str){
    str = str.replace(/(&58;)/g,"#");
    str = str.replace(/(&amp;)/g,"&");
    str = str.replace(/(&lt;)/g, "<");
    str = str.replace(/(&gt;)/g, ">");
    str = str.replace(/(&nbsp;&nbsp;&nbsp;&nbsp;)/g, "\t");
    str = str.replace(/(\n)/g, "\r\n");
    str = str.replace(/(<br>)/g, "\n");
    str = str.replace(/(&nbsp;&nbsp;)/g, "  ");
    str = str.replace(/(&#39;)/g, "'");
    str = str.replace(/(&quot;)/g, '"');
    str = str.replace(/(&#92;)/g, "\\");
    str = str.replace(/(&#58;)/g,":");
    return str;
}

/******************************************************获取地址栏参数方法*******************************************************************/
/**
 * 获取url参数值
 *
 * @param
 * 		paras 参数名
 * 		isDecode 链接参数是否加密
 */
function getUrlParams(paras, isDecode) {
    var url = location.href;
    var paraString = (isDecode ? decode(url.substring(url.indexOf("?") + 1, (url.indexOf("#") > 0? url.indexOf("#") : url.length)))
        :url.substring(url.indexOf("?") + 1, url.length)).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j
                .indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return (returnValue && returnValue.indexOf("#") >= 0) ? returnValue.substring(0, returnValue.indexOf("#")) : returnValue;
    }
}

/**
 * 获取url参数值
 */
function getParam(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  decodeURI(r[2]); //decodeURI也可
    else
        return null;
}

/**
 * 截取URL指定字符后的字符串
 */
function getUrlParamsBySign(para){
    var sign = para ? para : '#';
    var value = window.location.href.substring(window.location.href.indexOf(sign)+1);
    if(value!==undefined && value!=='' && window.location.href.indexOf(sign)>0){
        return value;
    } else {
        return '';
    }

}

/**********************************************时间或日期方法***********************************************************************/
// formatDataTime格式化时间格式(json对象转为时间字符串)
function formatDataTimeToString(dataTimeObject){
    var originalTime = new Date(dataTimeObject),
        resultMonth = originalTime.getMonth() + 1;
    return  originalTime.getFullYear() + "-" + resultMonth + "-" + originalTime.getDate() + " " + originalTime.getHours() + ":" + originalTime.getMinutes() + ":" + originalTime.getSeconds();
}

function formatNewDataTimeToString(){
    var originalTime = new Date(),
        resultMonth = originalTime.getMonth() + 1;
    return  originalTime.getFullYear() + "-" + resultMonth + "-" + originalTime.getDate() + " " + originalTime.getHours() + ":" + originalTime.getMinutes() + ":" + originalTime.getSeconds();

}

// 将秒数转成时分秒的方法----参数：秒
function formatTime(s) {
    var t;
    if(s > -1){
        hour = Math.floor(s/3600);
        min = Math.floor(s/60) % 60;
        sec = s % 60;
        day = parseInt(hour / 24);
        if (day > 0) {
            hour = hour - 24 * day;
            t = day + "day " + hour + ":";
        }
        else t = hour + ":";
        if(min < 10){t += "0";}
        t += min + ":";
        if(sec < 10){t += "0";}
        t += sec;
    }
    return t;
}

//获取当前日期前后AddDayCount天的日期，innerStr为链接字符串
function GetDateStr(AddDayCount, innerStr)
{
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate(); //获取当前几号，不足10补0
    return y + (innerStr || "-") + m + (innerStr || "-") + d;
}
/**
 * 获取浏览器URL的参数----参数：要获得参数的参数名
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 将timestamp转成字符串,1990-01-01 12:21:12
 */
function timestampToString(timestampObj){
    var year = "20" + (parseInt(timestampObj.year) - 100);
    var month = parseInt(timestampObj.month) + 1;
    var date = timestampObj.date;
    var hour = timestampObj.hours;
    var minutes = timestampObj.minutes;
    var seconds = timestampObj.seconds;

    if(month < 10){
        month = "0" + month;
    }
    if(date < 10){
        date = "0" + date;
    }
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }

    var dateStr = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
    return dateStr;
}

/**
 * 将秒数时间转换为00:00格式的时间
 */
function formatSecToString(sec){
    sec = sec*1;
    var minNum = (sec/60)+"",
        secNum = (sec%60)+"";
    if(minNum.length = 1){
        minNum = "0" + minNum;
    }
    if(secNum.length = 1){
        secNum = "0" + secNum;
    }
    return minNum+":"+secNum;
}


//倒计时方法
var wait = 90;
function checkCodeTime(o) {// o为按钮的对象
    var point = ".";
    if (wait == 0) {
        o.removeAttr("disabled");
        o.css("color","black");
        o.css("background-color","#DADADA");
        o.text("重新获取");// 改变按钮中value的值
        wait = 60;
    } else {
        point = (wait%2 ==0) ?"..":".";
        o.css("color","");
        o.css("background-color","");
        o.attr("disabled", true);// 倒计时过程中禁止点击按钮
        o.text(wait + "秒后重发");// 改变按钮中value的值
        wait--;
        setTimeout(function() {
            checkCodeTime(o);// 循环调用
        }, 1000)
    }
}



var jmz = {};
jmz.GetLength = function(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

function commonTip(data){
    if(data && data.err){
        alert(data.err);
    }else if(data && data.redirect){
        window.location = data.redirect;
    }else if(data && data.success){
        window.location = data.url;
    }
}


/**
 * 每一次请求的共同判断，判断是否登录，是否有err提示
 */
function errTip(data, cb){
    if (Ext.Msg){
        if(data && data.login){	// 登录提示
            Ext.Msg.alert("请注意",data.login,function(){
                window.top.location = "backLogin.html";
            });
        }else if(data && data.err){	// 操作失败，提示
            Ext.Msg.alert("错误",data.err);
        }else{
            cb();
        }
    } else {
        alert(data.err);
    }

}


/** ************************************************************加密、解密******************************************************* */
function encode(data, key) {
    if(!key){
        key = BPR.PARAM_ENCODE_KEY;
    }
    var result = xor_encrypt(key, data);
    return b64_encode(result);
};

function decode(data, key) {
    if(!key){
        key = BPR.PARAM_ENCODE_KEY;
    }
    data = b64_decode(data);
    return xor_decrypt(key, data);
};


var b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function b64_encode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
    if (!data) {
        return data;
    }
    do {
        o1 = data[i++];
        o2 = data[i++];
        o3 = data[i++];
        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        enc += b64_table.charAt(h1) + b64_table.charAt(h2)
            + b64_table.charAt(h3) + b64_table.charAt(h4);
    } while (i < data.length);
    r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
}

function b64_decode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
    if (!data) {
        return data;
    }
    data += "";
    do {
        h1 = b64_table.indexOf(data.charAt(i++));
        h2 = b64_table.indexOf(data.charAt(i++));
        h3 = b64_table.indexOf(data.charAt(i++));
        h4 = b64_table.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        result.push(o1);
        if (h3 !== 64) {
            result.push(o2);
            if (h4 !== 64) {
                result.push(o3);
            }
        }
    } while (i < data.length);
    return result;
}

function keyCharAt(key, i) {
    return key.charCodeAt(Math.floor(i % key.length));
}

function xor_encrypt(key, data) {
    var dataArr = [];
    for(var i = 0; i< data.length; i++){
        dataArr.push(data.substr(i, 1));
    }
    return _.map(dataArr, function(c, i) {
        return c.charCodeAt(0) ^ keyCharAt(key, i);
    });
}

function xor_decrypt(key, data) {
    return _.map(data, function(c, i) {
        return String.fromCharCode(c ^ keyCharAt(key, i));
    }).join("");
}

/*************************************************************cookie操作************************************************************/
// 获取cookie
function getCookie(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");

        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);

            if (c_end==-1){
                c_end=document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return ""
}

// 设置cookie
function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setMinutes(exdate.getMinutes()+expiredays);
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays==null) ? "" : "; expires=" + exdate.toGMTString());
}

// 检查cookie
function chkcookies(NameOfCookie)
{
    var c = document.cookie.indexOf(NameOfCookie+"=");
    if (c != -1){
        return true;
    }else{
        return false;
    }
}

// 删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}


/**********************************************************文件大小格式化、获取文件大小***************************************************/
// 格式化文件大小
function renderSize(value, p, record){
    if(null==value||value==''){
        return "0 B";
    }
    var unitArr = new Array("B","KB","MB","GB","TB","PB","EB","ZB","YB");
    var index=0;

    var srcsize = parseFloat(value);
    var quotient = srcsize;
    while(quotient>1024){
        index +=1;
        quotient=quotient/1024;
    }
    return roundFun(quotient,2)+" "+unitArr[index];
}


//计算文件大小，返回文件大小值
function getFileSize(obj){

    var objValue = obj.value;
    if (objValue=="") return ;
    var fileLenth=-1;
    try {
        //对于IE判断要上传的文件的大小
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        fileLenth=parseInt(fso.getFile(objValue).size);
    } catch (e){
        try{
            //对于非IE获得要上传文件的大小
            fileLenth=parseInt(obj.files[0].size);
        }catch (e) {
            fileLenth=-1;

        }

    }


    return fileLenth;
}

/*
 * 四舍五入保留小数位数 numberRound 被处理的数 roundDigit 保留几位小数位
 */
function  roundFun(numberRound,roundDigit)   // 处理金额 -by hailang
{
    if(numberRound>=0) {
        var   tempNumber   =   parseInt((numberRound   *   Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
        return   tempNumber;
    }else{
        numberRound1=-numberRound
        var   tempNumber   =   parseInt((numberRound1   *   Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
        return   -tempNumber;
    }
}



function clientSideInclude(id, url) {
    var req = false;

    // Safari, Firefox, 及其他非微软浏览器
    if (window.XMLHttpRequest) {
        try {
            req = new XMLHttpRequest();
        } catch (e) {
            req = false;
        }
    } else if (window.ActiveXObject) {

        // For Internet Explorer on Windows
        try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                req = false;
            }
        }
    }
    var element = document.getElementById(id);
    if (!element) {
        alert("函数clientSideInclude无法找到id " + id + "。"
            + "你的网页中必须有一个含有这个id的div 或 span 标签。");
        return;
    }
    if (req) {
        // 同步请求，等待收到全部内容
        req.open('GET', url, false);
        req.send(null);
        element.innerHTML = req.responseText;
    } else {
        element.innerHTML = "对不起，你的浏览器不支持" + "XMLHTTPRequest 对象。这个网页的显示要求"
            + "Internet Explorer 5 以上版本, "
            + "或 Firefox 或 Safari 浏览器，也可能会有其他可兼容的浏览器存在。";
    }
}



/*
 获取上传文件限制条件
 */
function getUploadConfine(fileType, cb){
    $.ajax({
        async: false,
        url: BPR.domain + "/getUploadConfine.htm",
        type: "GET",
        data : {fileType: fileType},
        contentType: "application/json",
        dataType: "json"
    }).done(function (result) {
        errTip(result, function(){
            cb(result.data);
        });
    }).fail(function () {

    }).always(function () {

    });
}



