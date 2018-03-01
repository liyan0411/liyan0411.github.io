/**
 * Created by Administrator on 2016/11/3.
 */



$(function(){
    var timeTicket = null;
    //图表
    // 路径配置
    require.config({
        paths: {
            echarts: '../lib/dist'
        }
    });

    // 使用
    require(
        [
            'echarts',
            'echarts/chart/pie', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/funnel',
            'echarts/chart/bar',
            'echarts/chart/gauge',
            'echarts/theme/macarons'
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart01 = ec.init(document.getElementById('chart01'),'macarons');
            var myChart02 = ec.init(document.getElementById('chart02'),'macarons');
            var myChart03 = ec.init(document.getElementById('chart03'),'macarons');

            var option01 = {
                title : {
                    text: '学习人数比例',
                    subtext: '  ',
                    x:'center'
                },
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                series : [
                    {
                        name:'学习人数比例',
                        type:'gauge',
                        detail : {formatter:'{value}%'},
                        data:[{value: 80, name: '比例'}]
                    }
                ]
            };

            var option02 = {
                title : {
                    text: '考试通过率',
                    subtext: '  ',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[
                            {value:335, name:'已通过'},
                            {value:310, name:'未通过'}
                        ]
                    }
                ]
            };



            var option03 = {
                title: {
                    x: 'center',
                    text: '时间、课程、新增课程输',
                    subtext: ' '/*,
                     link: 'http://echarts.baidu.com/doc/example.html'*/
                },
                tooltip: {
                    trigger: 'item'
                },
                calculable: true,
                grid: {
                    borderWidth: 0,
                    y: 80,
                    y2: 60
                },
                xAxis: [
                    {
                        type: 'category',
                        show: false,
                        data: ['学习时间', '总课程数', '新增课程数']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: false
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#C1232B','#B5C334','#F0805A'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{b}\n{c}'
                                }
                            }
                        },
                        data: [12,21,10],
                        markPoint: {
                            tooltip: {
                                trigger: 'item',
                                backgroundColor: 'rgba(0,0,0,0)',
                                formatter: function(params){
                                    return '<img src="'
                                        + params.data.symbol.replace('image://', '')
                                        + '"/>';
                                }
                            },
                            data: [
                                {xAxis:0, y: 350, name:'Line', symbolSize:20, symbol: 'image://../asset/ico/折线图.png'},
                                {xAxis:1, y: 350, name:'Bar', symbolSize:20, symbol: 'image://../asset/ico/柱状图.png'},
                                {xAxis:2, y: 350, name:'Scatter', symbolSize:20, symbol: 'image://../asset/ico/散点图.png'}
                            ]
                        }
                    }
                ]
            };

            // 为echarts对象加载数据
            myChart01.setOption(option01);
            myChart02.setOption(option02);
            myChart03.setOption(option03);

        }
    );

s

});