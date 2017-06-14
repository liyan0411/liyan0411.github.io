/**
 * Created by Administrator on 2016/11/2.
 */


var GLOBAL = GLOBAL || {};
Ext.onReady(function(){
    //调整导航栏覆盖层高度
    $(".nav_content_wrap").css("height",$(window).height()-100+'px');

    //菜单栏伸缩动作
    var hideTimer = null;
    var moveTimer = null;
    $(".main_nav").delegate("li","mouseenter",function(){
        $this = $(this);
        clearInterval(moveTimer);
        moveTimer = setTimeout(function(){
            $(".main_nav .now").removeClass("now");
            $this.addClass("now");
            var nowIndex = $this.index(".main_nav li");
            $(".nav_content_wrap").slideDown(0);
            $(".one_nav_content_wrap").eq(nowIndex).css({"z-index":"1001"}).fadeIn(300).addClass("now");
            setTimeout(function(){
                $(".one_nav_content_wrap").each(function(index, element) {
                    if(index != nowIndex){
                        $(element).slideUp(300).css({"z-index":"1000"}).removeClass("now");
                    }
                });
            },300)
        },300)

    });
    $(".nav_wrap").mouseleave(function(){
        doHide();
    })
    $(".nav_content").delegate("li","click", function(){
        doHide()
    })
    $(".nav_moveout").mouseenter(function(){
        doHide()
    })
    function doHide(){
        $(".one_nav_content_wrap, .nav_content_wrap").fadeOut(300);
        clearInterval(moveTimer);
        $(".main_nav .now").removeClass("now");
    }

    //点击导航的时候，加载对应页面
    $(".nav_content").delegate("li","click",function(){
        if($(this).attr("iLink")){
            var index = $(this).parent().index($(".one_nav_content"));
            var pathName = $(".main_nav li").eq(index).text() +' / '+ $(this).text();
            loadPage($(this).attr("iLink"),pathName,$(this).attr("id"));
        }
    });

    $(".logo_wrap").click(function(){
        loadPage('backHomeIndex.html','','')
    });

    //加载中部内容(页面进入时，加载首页)
    loadHashPage();

    //登录密码弹出层
    GLOBAL.modifPwd = new Ext.custom.basicWindow({
        title: '修改密码',
        height: 300,
        width: 480,
        items: [new Ext.custom.middletextfield({
            margin:'40 0 0 60',
            inputType : 'password',
            itemId : "userPwd",
            fieldLabel : '当前密码',
            beforeLabelTextTpl: required,
            labelAlign : 'right'
        }),new Ext.custom.middletextfield({
            margin:'10 0 0 60',
            inputType : 'password',
            itemId : "newUserPwd",
            fieldLabel : '新密码',
            beforeLabelTextTpl: required,
            labelAlign : 'right'
        }),new Ext.custom.middletextfield({
            margin:'10 0 0 60',
            inputType : 'password',
            itemId : "newUserPwdAgain",
            beforeLabelTextTpl: required,
            fieldLabel : '确认密码',
            labelAlign : 'right'
        }),{
            layout : 'hbox',
            margin:'10 0 0 140',
            arrowAlign: 'right',
            items : [{
                xtype:'button',
                margin:'10 0 0 10',
                width:80,
                height:30,
                handler : function(){
                    var newUserPwd = GLOBAL.modifPwd.down("#newUserPwd").getValue(),
                        newUserPwdAgain = GLOBAL.modifPwd.down("#newUserPwdAgain").getValue();

                    if(newUserPwd != newUserPwdAgain){
                        Ext.Msg.alert("温馨提示", "两次输入密码不一致！");
                        return;
                    }
                    var userPwds = {
                        userPwd : GLOBAL.modifPwd.down("#userPwd").getValue(),
                        newPwd : newUserPwd
                    };

                    //修改密码,设置安全保护问题
                    $.ajax({
                        async: false,
                        url: BPR.domain + "/Handler/AdminHandler.ashx?action=updatepass",
                        type: "POST",
                        data : userPwds,
                        dataType: "json"
                    }).done(function (data) {
                        errTip(data, function(){
                            Ext.Msg.alert("温馨提示", "修改密码成功");
                            GLOBAL.modifPwd.down("#userPwd").setValue("");
                            GLOBAL.modifPwd.down("#newUserPwd").setValue("");
                            GLOBAL.modifPwd.down("#newUserPwdAgain").setValue("");
                            GLOBAL.modifPwd.hide();
                        });
                    }).fail(function () {

                    }).always(function () {

                    });
                },
                style :'background:#6EC131;border:0',
                text:'确定'
            },{
                xtype:'button',
                margin:'10 0 0 30',
                width:80,
                height:30,
                text:'取消',
                handler : function(){
                    GLOBAL.modifPwd.hide();
                }

            }]
        }]
    });


    //调整iframe的宽高
    var iframeResizeTimer = null;
    $(window).resize(function(){

        clearInterval(iframeResizeTimer);

        iframeResizeTimer = setTimeout(function(){

            //调整导航栏覆盖层高度
            $(".nav_content_wrap").css("height",$(window).height()-100+'px');

            //调整iframe高度
            $("#mainframe").height( $(window).height()-100);

        },200)

    });



    //加载用户信息
    SecurityQuestion();

});


//刷新页面时加载相应内容页
function loadHashPage(){
    //实现刷新页面时加载相应内容页
    if(window.location.hash){
        var menuHashId = window.location.hash.substring(1);
        if($("#" + menuHashId).length > 0){
            $("#" + menuHashId).trigger('click');
        }else{
            loadPage('backHomeIndex.html','','');
        }

    }else{
        loadPage('backHomeIndex.html','','');
    }
}

//点击菜单加载相应页面
function loadPage(link,pathName,id){

    //加载对应页面
    $("#backHomeContent").html('<iframe id="mainframe" src="' + link + '" width="100%" height="'+ ($(window).height()-100) +'" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="auto"></iframe>');
    //
    window.location.hash = id;
    $("#mainframe").load(function(){

        //面包线导航
        var nowLink = "'backHomeIndex.html'";
        $(this).contents().find(".xn_nowpath").html('<a onclick="parent.loadPage('+ nowLink +')">首页</a> / '+ pathName +'');

        /*设置iframe内部横向隐藏*/
        $(this).contents().find("body").css("overflow-x","hidden");
    })
}

//读取用户基本数据
function SecurityQuestion(){

    $.ajax({
        async: false,
        url: BPR.domain + "/Handler/AdminHandler.ashx?action=returnuserinfo",
        type: "POST",
        dataType: "json",
        contentType: "application/json"
    }).done(function (result) {
        errTip(result, function(){
            $("#userName").text(result.turename);
        });
    }).fail(function () {
    }).always(function () {

    });
}

//退出系统
function exitSystem(){
    $.ajax({
        async: false,
        url: BPR.domain + "/Handler/AdminHandler.ashx?action=quit",
        type: "GET",
        dataType: "json"
    }).done(function (result) {
        errTip(result,function(){
            Ext.Msg.alert("提示",result.success,function(){
                window.location = "backLogin.html";
            });

        });
    }).fail(function () {

    }).always(function () {

    });
}

//修改密码
function modifyPassword(){
    GLOBAL.modifPwd.show();
}
