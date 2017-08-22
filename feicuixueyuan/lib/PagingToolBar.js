Ext.define('PagingToolBar', {
	extend : 'Ext.form.FieldContainer',
	width: '100%',
	itemId: 'Oesys_PagingToolBar',
	hideLabel: true,
	layout : 'hbox',
	defaults: {
		margin: '0 5 0 5'
	},
	padding: '3 0 2 0',
	config: {
        pageSize: 10,
        onChange: function(){}          // 事件处理同一出口
    },
    pageNum: 0,
    resultCount: 0,
    numCount: 1,
    pageStart: 1,
    pageEnd: 0,
    constructor: function (config) {
        config = config || {};
        Ext.applyIf(config, this.config);
        this.callParent([config]); /*与ExtJS 3.X版本不同*/
        
        // 初始化界面
        this.changePageContent();
        
    },
    initComponent: function () {
        this.callParent();
    },
    /**
     * 加载分页信息
     * @param PageNum
     * @param ResultCount
     */
    loadPage: function(PageStart, ResultCount){
    	this.pageNum = (PageStart/this.pageSize) + 1;
    	this.resultCount = ResultCount;
    	// 计算总页数
    	if(ResultCount < this.pageSize){
    		// 如果总条数小于分页条数，则总页数为1
    		this.numCount = 1;
    	}else if(ResultCount % this.pageSize > 0){
    		this.numCount = parseInt( ResultCount / this.pageSize + 1);
    	}else if(ResultCount % this.pageSize == 0){
    		this.numCount = parseInt( ResultCount / this.pageSize );
    	}
    	
    	// 确定页头
    	this.loadPageStart();
    	
    	this.changePageContent();
    },
    loadPageStart: function(){
    	// 确定页头
    	if(this.pageNum == 1){
    		this.pageStart = 1; 
    		this.pageEnd = this.pageStart + this.pageSize - 1;
    	}else if(this.pageNum > 0){
    		this.pageStart = (this.pageNum - 1) * this.pageSize + 1;
    		this.pageEnd = this.pageStart + this.pageSize - 1;
    	}
    	// 确定页尾
    	if(this.pageEnd > this.resultCount){
    		this.pageEnd = this.resultCount;
    	}
    	
    },
    /**
     * 修改分页信息
     */
    changePageContent: function(){
    	var numCountLabel = this.getComponent('numCountLabel');
    	var numChildLabel = this.getComponent('numChildLabel');
    	var goPageInput = this.getComponent('goPageInput');
    	var pageInfo = this.getComponent('pageInfo');
    	
    	goPageInput.setValue(this.pageNum);
    	numChildLabel.setValue('【' + this.resultCount + '条】');
    	numCountLabel.setValue(this.numCount);
    	goPageInput.setMaxValue(this.numCount);
    	
    	if(this.pageEnd){
    		pageInfo.setValue(this.pageStart+' - '+this.pageEnd);
    	}
    },
    // 首页事件
    pageToFirst: function(){
    	if(this.pageNum == 1){
    		return false;
    	}
    	this.pageNum = this.pageNum != 0 ? 1 : 0;
    	// 确定页头
    	this.loadPageStart();
    	
    	return true;
    },
    // 上一页事件
    pagePrePage: function(){
    	if(this.pageNum == 1){
    		return false;
    	}
    	if(this.pageNum > 1 && this.pageNum != 0){
    		this.pageNum --;
    	}
    	// 确定页头
    	this.loadPageStart();
    	
    	return true;
    },
    // 下一页事件
    pageNextPage: function(){
    	if(this.pageNum == this.numCount){
    		return false;
    	}
    	if(this.pageNum < this.numCount && this.pageNum != 0){
    		this.pageNum ++;
    	}
    	// 确定页头
    	this.loadPageStart();
    	
    	return true;
    },
    // 尾页事件
    pageToLast: function(){
    	if(this.pageNum == this.numCount){
    		return false;
    	}
    	this.pageNum = this.numCount;
    	// 确定页头
    	this.loadPageStart();
    	
    	return true;
    },
    // 转到X页
    numTo: function(){
    	
    	this.pageNum = this.getComponent('goPageInput').getValue();
    	// 确定页头
    	this.loadPageStart();
    	
    	return true;
    },
    //设置每页条数
    setPageSize : function(size){
    	this.pageSize = size
    }, 
	items : [{
		xtype : 'button',
		tooltip : '第一页',
		itemId: 'btn_firstpage',
		cls: 'firstButton',
		width : 26,
		height : 26,
		handler : function(button, event) {
			// 首页按钮的事件
			if(this.ownerCt.pageToFirst()){
				
				if(this.ownerCt.onChange && this.ownerCt.onChange instanceof Function){
					this.ownerCt.onChange(this.ownerCt, this.ownerCt.pageStart-1, this.ownerCt.pageSize, 'onToFirst');
				}
			}
		}
	},
	{
		xtype : 'button',
		tooltip : '上一页',
		itemId: 'btn_prepage',
		cls: 'prevButton',
		width : 26,
		height : 26,
		handler : function() {
			// 上一页按钮的事件
			if(this.ownerCt.pagePrePage()){
				if(this.ownerCt.onChange && this.ownerCt.onChange instanceof Function){
					this.ownerCt.onChange(this.ownerCt, this.ownerCt.pageStart-1, this.ownerCt.pageSize, 'onPrePage');
				}
			}
		}
	}, 
	{
		xtype : 'displayfield',
		value : '跳转到第'
	}, 
	{
		xtype : 'numberfield',
		width : 60,
		value : 1,
		minValue: 1,
		maxValue: this.numCount,
		itemId: 'goPageInput'
	}, 
	{
		xtype : 'displayfield',
		value : '页'
	}, 
	{
		xtype : 'button',
		tooltip : '跳转',
		cls: 'goButton',
		width : 35,
		height : 26,
		handler : function() {
			var num = this.ownerCt.getComponent('goPageInput').getValue();
			var maxNum = this.ownerCt.getComponent('numCountLabel').getValue();
			
			if(num <= maxNum && this.ownerCt.numTo()){
				if(this.ownerCt.onChange && this.ownerCt.onChange instanceof Function){
					this.ownerCt.onChange(this.ownerCt, this.ownerCt.pageStart-1, this.ownerCt.pageSize, 'onNumTo');
				}
			}else{
				Ext.Msg.alert('温馨提示','最大页数为' + maxNum);
				
				this.ownerCt.getComponent('goPageInput').setValue(1);
			}
		}
	},
	{
		xtype : 'displayfield',
		value : ' / 共'
	}, 
	{
		xtype : 'displayfield',
		value : '0',
		itemId : 'numCountLabel'
	},
	{
		xtype : 'displayfield',
		value :　'页'
	},
	{
		xtype : 'displayfield',
		value : '0',
		margin : '0 0 0 0',
		itemId: 'numChildLabel'
	}, 
	{
		xtype : 'button',
		tooltip : '下一页',
		cls: 'nextButton',
		width : 26,
		height : 26,
		handler : function() {
			// 下一页按钮的事件
			if(this.ownerCt.pageNextPage()){
				if(this.ownerCt.onChange && this.ownerCt.onChange instanceof Function){
					this.ownerCt.onChange(this.ownerCt, this.ownerCt.pageStart-1, this.ownerCt.pageSize, 'onNextPage');
				}
			}
		}
	}, 
	{
		xtype : 'button',
		tooltip : '最后一页',
		cls: 'lastButton',
		width : 26,
		height : 26,
		handler : function() {
			// 尾页按钮的事件
			if(this.ownerCt.pageToLast()){
				if(this.ownerCt.onChange && this.ownerCt.onChange instanceof Function){
					this.ownerCt.onChange(this.ownerCt, this.ownerCt.pageStart-1, this.ownerCt.pageSize, 'onToLast');
				}
				
			}
		}
	}, 
	{
		xtype : 'displayfield',
		itemId: 'pageInfo'
	}]
});