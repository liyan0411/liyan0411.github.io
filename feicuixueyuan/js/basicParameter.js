/**
 * Created by Administrator on 2016/11/3.
 */


//定义拼装请求URL的常量
var BPR = BPR || {};

BPR.domain = "";

BPR.PARAM_ENCODE_KEY = "20766caf0fd446c7b0b13f7fe985a8e8";

BPR.STUDENT_COOKIE_KEY = "EduWeb_student_auth_key";

BPR.BACKUSER_COOKIE_KEY = "EduWeb_backUser_auth_key";

BPR.STUDENT_IS_LOGIN = "student_is_login";
//页面加载头部和底部高度和
BPR.notBodyHeight = 102;
BPR.bottom_top = 75;


/* ---------------------------------------后台管理常量参数--------------------------------------*/
//后台管理表格最小高度
BPR.gridMinHeight = 300;


BPR.UploadModule = {
    PID				: 1, 	// 学员、用户证照图片
    THUMB			: 2, 	// 学员、用户头像图片
    PDFILE			: 3, 	// 学员资源
    GADGET			: 4, 	// 学员小工具图标
    CONTRACT		: 5, 	// 机构合同扫描件图片
    COURSECOVER		: 6, 	// 课程封面图片
    COURSEWAREREF	: 7, 	// 课件参考资料
    ASSESSITEM		: 8, 	// 试题答案选项图片
    HOMEIMAGE  		: 9,	// 个人中心首页背景图
    article_attach	: 10, 	// 文章附件
    smart_app		: 11, 	// 手机app
    import_source	: 12,	// 批量导入时的源文件
    flower			: 13	// 花册

}

BPR.roleKind = {
    worker 			: 0,	//学校工作人员
    housekeeper 	: 1,	//平台维护人员
    teacher  		: 2,	//教师
    partner 		: 10,	//网校
    hrpartner 		: 20,	//人事管理
    customer 		: 30
}

BPR.isStudent = {
    yes 		: 1,	//学员
    no		 	: 0		//非学员
}

BPR.genericStatus = {
    deleted	:0,			//删除状态
    hidden	:1,			//隐藏状态
    active	:2			//正常状态
}

BPR.courseKind = {
    video : 0, 			// 视频
    evaluate : 1 		// 通关考
}

BPR.courseStatus = {
    deleted	:0, 		// 删除
    closed	:1, 		// 关闭
    draft	:2, 		// 草稿
    pending	:3, 		// 待审
    frozen	:4, 		// 冻结、暂停
    active	:5 			// 发布、正常
}

BPR.courseStatus2Zh = {
    0	: "删除", 		// 删除
    1	: "关闭", 		// 关闭
    2	: "草稿", 		// 草稿
    3	: "待审", 		// 待审
    4	: "冻结", 		// 冻结、暂停
    5	: "正常" 			// 发布、正常
}

BPR.personStatus = {
    deleted : 0,		//已删除
    closed	:1, 		// 关闭
    registered	:2, 	// 注册
    frozen	:3, 		// 冻结
    active	:4 			// 正常
}

BPR.personStatus2Zh = {
    0	: "删除", 		// 删除
    1	: "关闭", 		// 关闭
    2	: "注册", 		// 注册
    3	: "冻结", 		// 冻结、暂停
    4	: "已激活" 		// 发布、正常
}


BPR.domainType = {
    homework	:0, 		// 作业
    exam		:1 			// 考试
}

BPR.videoUsage = {
    courseware 	: 0,		// 课件
    article		: 1			// 免费视频
}

BPR.tpracticeStatus = {
    deleted : 0, 		// 删除
    plan : 1, 			// 计划
    abort : 2, 			// 异常中止
    draft : 3, 			// 拟开班
    progress : 4, 		// 实施中
    complete : 5 		// 成功完结
}

BPR.oeCategory = {
    catIndustryNews : 1,        // 行业动态
    catNotice : 2,              // 通知
    catOfflineClass : 3,        // 开班计划
    catFreeVideo : 4            // 免费视频
}

BPR.articleStatus = {
    deleted : 0,        // 删除
    draft : 1,          // 草稿
    pending : 2,        // 待审
    active : 3          // 发布、正常
}

BPR.ipsStatus = {
    wait : 1, // 等待支付
    succ : 2, // 支付成功
    fail : 3 // 支付失败
}