/**
 * Created by Administrator on 2016/11/3.
 */

//初始化window
Ext.define('Ext.custom.basicWindow',{
    extend : 'Ext.window.Window',
    resizable : false,
    autoScroll : true,
    modal : true,
    closeAction : 'hide',
    constrain : true,
    initComponent : function(){
        Ext.custom.basicWindow.superclass.initComponent.call(this);
    }
});

//初始化textfield
Ext.define('Ext.custom.middletextfield',{
    extend : 'Ext.form.field.Text',
    labelAlign : 'right',
    width : 370,
    margin:'0 10 0 0',
    labelWidth :65,
    initComponent : function(){
        Ext.custom.middletextfield.superclass.initComponent.call(this);
    }
});

//初始化textfield2
Ext.define('Ext.custom.bigtextfield',{
    extend : 'Ext.form.field.Text',
    width : 560,
    margin:'0 10 0 0',
    labelAlign : 'right',
    labelWidth :65,
    initComponent : function(){
        Ext.custom.bigtextfield.superclass.initComponent.call(this);
    }
});
//初始化textfield3
Ext.define('Ext.custom.minitextfield',{
    extend : 'Ext.form.field.Text',
    labelAlign : 'right',
    width :110,
    margin:'0 10 0 0',
    labelWidth :65,
    initComponent : function(){
        Ext.custom.minitextfield.superclass.initComponent.call(this);
    }
});

//初始化textfield4
Ext.define('Ext.custom.textfield',{
    extend : 'Ext.form.field.Text',
    width:180,
    margin:'0 10 0 0',
    initComponent : function(){
        Ext.custom.textfield.superclass.initComponent.call(this);
    }
});

//初始化textfield5
Ext.define('Ext.custom.labelfield',{
    extend : 'Ext.form.field.Text',
    border : 0,
    disabled : true,
    style: {
        border : 0,
        background: 'transparent'
    },
    initComponent : function(){
        Ext.custom.textfield.superclass.initComponent.call(this);
    }
});


//初始化grid store
Ext.define('Ext.custom.basicStore',{
    extend : 'Ext.data.Store',
    labelAlign : 'right',
    initComponent : function(){
        Ext.custom.basicStore.superclass.initComponent.call(this);
    }
});

//初始化datefield
Ext.define('Ext.custom.datefield',{
    extend : 'Ext.form.field.Date',
    width : 340,
    labelAlign : 'right',
    format : 'y-m-d',
    value: new Date(),
    labelWidth :25,
    editable : false,
    initComponent : function(){
        Ext.custom.datefield.superclass.initComponent.call(this);
    }
});


//初始化button
Ext.define('Ext.custom.button',{
    extend : 'Ext.button.Button',
    width:70,
    height:30,
    bodyStyle:'background:#3c3c3c',
    initComponent : function(){
        Ext.custom.button.superclass.initComponent.call(this);
    }
});

//初始化panel
Ext.define('Ext.custom.basicPanel',{
    extend : 'Ext.panel.Panel',
    border : 0,
    initComponent : function(){
        Ext.custom.basicPanel.superclass.initComponent.call(this);
    }
});

//初始化Combo
Ext.define('Ext.custom.basicCombo',{
    extend : 'Ext.form.ComboBox',
    /*	triggerAction : 'all',
     */	labelWidth :65,
    typeAhead : true,
    labelAlign : 'right',
    editable:false,
    queryMode : 'local',
    width:180,
    margin:'0 10 0 0',
    displayField: 'value',
    forceSelection : true,
    valueField: 'name',
    initComponent : function(){
        Ext.custom.basicCombo.superclass.initComponent.call(this);
    }
});

//初始化miniCombo
Ext.define('Ext.custom.basicminiCombo',{
    extend : 'Ext.form.ComboBox',
    triggerAction : 'all',
    labelWidth :65,
    typeAhead : true,
    editable:false,
    labelAlign : 'right',
    width:180,
    displayField: 'value',
    forceSelection : true,
    valueField: 'name',
    initComponent : function(){
        Ext.custom.basicminiCombo.superclass.initComponent.call(this);
    }
});


//初始化formPanel
Ext.define('Ext.custom.basicFormPanel',{
    extend : 'Ext.form.Panel',
    defaultType : 'textfield',
    initComponent : function(){
        Ext.custom.basicFormPanel.superclass.initComponent.call(this);
    }
});

//初始化textarea
Ext.define('Ext.custom.textarea',{
    extend : 'Ext.form.field.TextArea',
    grow: true,
    labelAlign : 'right',
    width:600,
    labelWidth:80,
    height:80,
    initComponent : function(){
        Ext.custom.textarea.superclass.initComponent.call(this);
    }
});

//初始化Checkbox
Ext.define('Ext.custom.Checkbox',{
    extend : 'Ext.form.field.Checkbox',
    labelAlign : 'right',
    initComponent : function(){
        Ext.custom.Checkbox.superclass.initComponent.call(this);
    }
});



//初始化datefield
Ext.define('Ext.custom.datefield',{
    extend : 'Ext.form.field.Date',
    editable : false,
    format : 'y-m-d',
    value : new Date(),
    initComponent : function(){
        Ext.custom.datefield.superclass.initComponent.call(this);
    }
})

//初始化numberfield
Ext.define('Ext.custom.numberfield',{
    extend : 'Ext.form.field.Number',
    width : 280,
    minValue : 0,
    initComponent : function(){
        Ext.custom.numberfield.superclass.initComponent.call(this);
    }
})


//初始化树形
Ext.define('Ext.custom.basicTree',{
    extend : 'Ext.tree.Panel',
    rootVisible: false,
    initComponent : function(){
        Ext.custom.basicTree.superclass.initComponent.call(this);
    }
})

Ext.define('Ext.custon.applicabkeObjects', {
    extend : 'Ext.form.Panel',
    //margin:5,
    layout:'hbox',
    items:[{
        html:'<div style="width:655px;height:30px;">'+
        '<span style="float:left;paddding-left:3px;"><span style="color:red">*</span>适用专业:</span>'+'<div id="applicable_objects" name="applicable_objects" class="applicable_objects" style="padding:2px;width:570px;height:25px;float:left;margin-left:9px;border:1px solid #C0C0C0"></div>'+
        '</div>'
    }]
})

//初始化tooltip
Ext.tip.QuickTipManager.init();

//必填*号HTML片段
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

//内部容器自适应插件
Ext.namespace('Ext.ux');
Ext.ux.FitToParent = Ext.extend(Object,
    {
        fitWidth: true,
        fitHeight: true,
        offsets: [0, 0],
        constructor: function(config)
        {
            config = config || {};
            if(config.tagName || config.dom || Ext.isString(config))
            {
                config = {parent: config};
            }
            Ext.apply(this, config);
        },
        init: function(c)
        {
            this.component = c;
            c.on('render', function(c)
            {
                this.parent = Ext.get(this.parent || c.getPositionEl().dom.parentNode);

                this.fitSize();
                Ext.EventManager.onWindowResize(this.fitSize, this);
            }, this, {single: true});
        },
        fitSize: function()
        {
            var pos = this.component.getPosition(true),
                size = this.parent.getViewSize();
            this.component.setSize(
                this.fitWidth ? size.width - pos[0] - this.offsets[0] : undefined,
                this.fitHeight ? size.height - pos[1] - this.offsets[1] : undefined);
        }
    });
Ext.preg('fittoparent', Ext.ux.FitToParent);

//课程评价窗口
Ext.define('Ext.custom.scoreWindow',{
    extend : 'Ext.window.Window',
    resizable : false,
    autoScroll : true,
    modal : true,
    title:'资源评价',
    constrain : true,
    width: 600,
    height : 300,
    initComponent : function(){
        var win = this;

        win.items = [{
            itemId : 'resourceName',
            xtype : 'textfield',
            margin : '10 0 0 80',
            disabled : true,
            width : 400,
            labelAlign : 'right',
            name : 'PcourseName',
            fieldLabel : '资源'
        },{
            xtype : 'radiogroup',
            itemId : 'ifRecommend',
            width : 400,
            margin : '10 0 0 80',
            fieldLabel : '推荐',
            name : 'ifRecommend',
            labelAlign : 'right',
            items: [
                { itemId : 'recommend' , boxLabel: '推荐', name: 'rb', inputValue: '1',checked : true },
                { itemId : 'recommendNo' , boxLabel: '不推荐', name: 'rb', inputValue: '2' }
            ]
        },{
            xtype : 'panel',
            margin : '0 0 0 148',
            html :
            '评分：<div id="xzw_starSys" style="position:relative;top:-15px;left:50px;">'+
            '<div id="xzw_starBox">'+
            '<ul class="star" id="star">'+
            '<li onclick="clickStart(1);"><a href="javascript:" title="1" class="one-star">1</a></li>'+
            '<li onclick="clickStart(2);"><a href="javascript:" title="2" class="two-stars">2</a></li>'+
            '<li onclick="clickStart(3);"><a href="javascript:" title="3" class="three-stars">3</a></li>'+
            '<li onclick="clickStart(4);"><a href="javascript:" title="4" class="four-stars">4</a></li>'+
            '<li onclick="clickStart(5);"><a href="javascript:" title="5" class="five-stars">5</a></li>'+
            '<li onclick="clickStart(6);"><a href="javascript:" title="6" class="six-stars">6</a></li>'+
            '<li onclick="clickStart(7);"><a href="javascript:" title="7" class="seven-stars">7</a></li>'+
            '<li onclick="clickStart(8);"><a href="javascript:" title="8" class="eight-stars">8</a></li>'+
            '<li onclick="clickStart(9);"><a href="javascript:" title="9" class="nine-stars">9</a></li>'+
            '<li onclick="clickStart(10);"><a href="javascript:" title="10" class="ten-stars">10</a></li>'+
            '</ul>'+
            '<span id="scoreResourceId">0</span>分'+
            '<div class="current-rating" id="showb"></div>'+
            '</div>'
        },{
            xtype : 'textareafield',
            itemId : 'description',
            fieldLabel : '说几句',
            labelAlign : 'right',
            margin : '0 0 0 80',
            name : 'description',
            emptyText : '在这里写下你的评价哦...',
            width : 400,
            height : 70
        },{
            xtype : 'panel',
            layout : 'hbox',
            margin : '10 0 0 195',
            items : [{
                xtype : 'button',
                text : '确定',
                width : 80,
                height : 30,
                style : {
                    background : 'red',
                    border : 0
                },
                handler : function(){
                    if($('#scoreResourceId').text()){
                        scoreResource($('#scoreResourceId').text(),win);
                    }else{
                        Ext.Msg.alert("温馨提示","请打分！");
                    }
                }
            },{
                xtype : 'button',
                text : '取消',
                width : 80,
                margin : '0 0 0 20',
                height : 30,
                handler : function(){
                    win.close();
                }
            }]
        }]

        Ext.custom.scoreWindow.superclass.initComponent.call(this);
    }
});

//上传窗口（共用：视频、附件、封面图片……）
Ext.define('Ext.custom.uploadFileWin',{
    extend : 'Ext.custom.basicWindow',
    width : 450,
    height : 200,
    closeAction : 'destroy',
    customMaxSize : 0,
    customSetValueInput : {},
    customUrl : '',
    index:0,
    customUploadType : null,
    customFilefieldLabel : '',
    initComponent : function(){
        var win = this;

        win.items = [{
            xtype : 'form',
            width: '100%',
            height : '100%',
            items : [{
                xtype: 'filefield',
                fieldLabel: win.customFilefieldLabel,
                labelWidth: 50,
                msgTarget: 'side',
                allowBlank: false,
                emptyText : '请点击选择......',
                margin : '30 0 10 15',
                width : 400,
                buttonText: '选择' + win.customFilefieldLabel
            },{
                xtype : 'label',
                margin : '0 0 0 70',
                html : '请选择不大于' + renderSize(win.customMaxSize) + '的文件'
            }]
        }];

        win.buttons = [{
            text: '上传',
            width : 100,
            handler: function() {
                var form = win.down('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: win.customUrl,
                        waitMsg: '正在上传...',
                        success: function(fp, o) {
                            errTip(o.result, function(){
                                if(o.result.success){
                                    var result = o.result;
                                    win.cbFn(result);
                                }
                            });
                        },
                        failure: function(fp, o) {
                            console.log(o);
                            console.log(fp);
                            Ext.Msg.alert('提示', o.result.err || '上传失败！');
                        }
                    });
                }
            }
        }];

        Ext.custom.uploadFileWin.superclass.initComponent.call(this);
    }
});
