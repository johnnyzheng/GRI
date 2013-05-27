;(function($){
    
    $.fn.multiChart = function(options){
        var data = options;
        var chartContainer = $(this).attr('id');
        var containerId = '#' + chartContainer;
        var chartType = options.chartType || '';
        $(containerId).empty();
        if (data.hasOwnProperty('isMultiChart')){
            var index = 1;
            for(var i in data.data){
                var item = data.data[i];
                var width = item.width || '100%';
                var subId = chartContainer + index++;
                $(containerId).append("<div id='" + subId + "' style='float:left;width:" + width + "'></div>"); 
                $('#' + subId).createChart({chartType: chartType, dataFormat: 1, categories: item.data.categories, series : item.data.series, chartOptions: item.data.chartOptions});
            }
        }
        else{
			$(containerId).createChart(data);
        }
    }

    $.fn.createChart = function(options){
        //highchart默认配置
        var defOptions = {
            title: {
                margin: 20,
                y: 20
			},
            colors: ['#49C9C3', '#FFBF3E', '#9DD30D', '#DA7D2A', '#39B54A', '#1CC4F5', '#1C95BD', '#5674B9', '#8560A8', '#9999FF'],
//            colors: ['#1bd0dc', '#f9b700', '#eb6100', '#009944','#eb6877'],
            lang: {                                
                //设置highcharts的全局常量的中文值，如月份、星期、按钮文字等
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                resetZoom: '查看全图',
                resetZoomTitle: '查看全图',
                downloadPNG: '下载PNG',
                downloadJPEG: '下载JPEG',
                downloadPDF: '下载PDF',
                downloadSVG: '下载SVG',
                exportButtonTitle: '导出成图片',
                printButtonTitle: '打印图表', 
                loading: '数据加载中，请稍候...'            
            },
            chart: {
                borderWidth: 0,
//                marginBottom: 65,
//                marginTop: 50,
  //              marginRight: 20, 
//                zoomType: 'x',
                selectionMarkerFill : 'rgba(122, 201, 67, 0.25)',
				style:{
                    fontFamily: 'Tahoma, "microsoft yahei", 微软雅黑, 宋体;'
                },
                //plotBackgroundImage: 'http://imgcache.qq.com/bossweb/mta/pic/skies.jpg',
                resetZoomButton: {
                    theme: {
                        fill: 'white',
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
                                fill: '#41739D',
                                style: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                }
            },
            xAxis: {
                startOnTick: false,
                lineColor: '#6a7791',
                lineWidth: 1,
//                minorTickinterval: 1,
                tickPixelInterval: 150,
                tickmarkPlacement: 'on'
            },
            yAxis: {
                title: {
                    text: ''       
                },
				min: 0,
                gridLineColor: '#eae9e9',
                showFirstLabel: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    innerSize: '45%',
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        color: '#000000',
                        connectorColor: '#000000'
                    }
                },
                series: {
                    pointPalcemeng: 'on',
                    fillOpacity: 0.1,
                    shadow: false,
                    dataLabels: {
                        enabled: true 
                    },
                    marker: {
                        enabled: true,
                        radius: 4,
                        fillColor: null,
                        lineWidth: 2,
                        lineColor: '#FFFFFF',
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }             
            },
            legend: {
                borderWidth: 0,
//                y: 5,
                verticalAlign: 'bottom',
    //            floating: true,
                maxHeight: 57 
//                align: 'left'
            },
            tooltip: {                
                borderColor: '#666',
                borderWidth: 1,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                useHTML: true,
                crosshairs: {
                    color: '#7ac943',
                    dashStyle: 'shortdot'
                },
                shared: true
            },
            credits: {
                enabled: false,
                href: 'http://ta.qq.com',
                text: 'ta.qq.com',
                position: {
                    align: 'right',
                    x: -10,
                    verticalAlign: 'bottom',
                    y: 0
                }     
            }             
        }

        
       //默认配置
        var defaults = {
            title: '',                              //图表标题,备用
            width: '100%',                          //图表宽度
            height: 300,                            //图表高度
            showLabel: true,                        //是否显示标签
            showMarker: true,                       //是否显示点
            chartType: 'area',                      //图表类型
			dataFormat: 1,							//数据类型，1：整数，2：浮点数  3：百分比，仅在后面追加百分号  4：时间格式 HH:MM:SS	5：百分比，显示时会乘上100  6：不处理，保留原有格式 
            labelFormat: 0,                         //指定标签显示的格式，0: 不显示，1: 显示Y值， 2：自动计算百分比并显示
            categories: [],                         //X轴数据
            series:[],                              //Y轴数列
            yMin: null,                             //Y轴最小值
            yMax: null,                             //Y轴最大值
            xAxisLabelStep: 0,                      //X轴标签间隔
            xAxisTickInterval: 0,                   //X轴刻度间隔
            useDefaultStyle: true,                  //是否使用默认highchart主题样式
            enableZoom: true,
            autoStep: true,                         //自动计算步长
            showPlotLine: false,                    //是否显示中位线 
            enableLegend: true,                     //是否显示图例
            autoYAxisInterval: true,                //自动计算Y轴间隔
            maxYAxisIntervalCount: 3,               //Y轴最大刻度数 
            chartOptions:{                          //hichCharts的配置
                chart: {},
                title: {},
                xAxis: {
                    categories: '',
                    labels: {}
                },
                yAxis: {
                    min: 0
                },
                plotOptions: {
                    pie: {},
                    series: {
                        dataLabels: {}
                    }
                },
                legend:{},
                tooltip:{}
            }
        };

        var minY = maxY = 0;                        //标识Y坐标最大最小值
        var hasData = false;                        //判断是否有数据
        
        options = $.extend(true, defaults, options);
        options.useDefaultStyle && Highcharts.setOptions(defOptions);

        $(this).css('height', options.height);
//        $(this).css('width', options.width);

        var cOptions = options.chartOptions;
        var defaultChartType = {'area': 'area', 'line': 'line', 'pie': 'pie', 'bar': 'bar', 'spline': 'spline', 'column': 'column' }[options.chartType] || 'area';
        cOptions.chart.type = cOptions.chart.type || defaultChartType;
		cOptions.yAxis.dataFormat = cOptions.yAxis.dataFormat || options.dataFormat;
        (typeof options.title == 'object') ? cOptions.title = options.title :  cOptions.title.text = options.title;
        cOptions.legend.enabled = options.enableLegend;
        if (options.categories){
            var isDateTime = false;
            var maxLen = 0;
            var index = 0;
            for(var i in options.categories){
                var cate = options.categories[i].toString();
                maxLen < cate.length && (maxLen = cate.length);
                
                if (index == 0){
                    var strDate = options.categories[i].toString();
                    var ar = strDate.split('-');
                    var startDate =  Date.UTC(ar[0], ar[1] - 1, ar[2]);
                    isDateTime = !isNaN(startDate);
                    index++;
                }
            }

            if (cOptions.xAxis.type !== 'datetime'){
                isDateTime = false;
            }
            if (!isDateTime){
                //智能判断x轴的标签步长
                var labelWidth = maxLen * 6 + 50;
                cOptions.xAxis.categories = toHighChartCategories(options.categories);
                if (options.autoStep){
                    var interval = cOptions.xAxis.tickInterval || 1;
                    cOptions.xAxis.labels.step = Math.ceil(cOptions.xAxis.categories.length / ($(this).css('width').replace(/[^\d\.]/g,'') / labelWidth) / interval);
                }
            }
            else{
                var oneDay = 24 * 3600 * 1000;
                cOptions.plotOptions.series.pointStart = startDate;
                cOptions.plotOptions.series.pointInterval = oneDay;
				cOptions.xAxis.type = 'datetime';
                cOptions.xAxis.maxZoom = 7 * oneDay;
                cOptions.xAxis.labels = cOptions.xAxis.labels || {};
                cOptions.xAxis.labels.formatter = cOptions.xAxis.labels.formatter || function(){
                        var d = new Date(this.value);
                        var result = isNaN(d) ? this.value : /*d.getFullYear() + '-' +*/ (d.getMonth() + 1) + '-' + d.getDate();
                        return result;
                };       
                
                cOptions.xAxis.tickInterval = oneDay;
                var labelWidth = 60;
                cOptions.xAxis.labels.step = Math.ceil(options.categories.length / ($(this).css('width').replace(/[^\d\.]/g,'') / labelWidth));
            }
            
            if (options.xAxisLabelStep > 0){
                cOptions.xAxis.labels.step = options.xAxisLabelStep;
            }

            cOptions.series = toHighChartSeries(options.series);
        }
        else{
            cOptions.chart.type = 'pie';
            cOptions.series = toHighChartSeries(options.series);
            cOptions.tooltip = cOptions.tooltip || {};
            cOptions.tooltip.shared = false;
            cOptions.tooltip.useHTML= false;
            cOptions.tooltip.formatter =  cOptions.tooltip.formatter || function() {
                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage * 100) / 100 +' %'; 
            };
        }

        if (!hasData){
            $(this).addClass('nodata');
            $(this).html('<H4>' + cOptions.title.text + '</H4>');
            return;
        }
        $(this).removeClass('nodata');

        cOptions.chart.renderTo = $(this).attr('id');
        if (options.yMin != null && options.yMax != null){
            minY = options.yMin;
            maxY = options.yMax;
            cOptions.yAxis.min = options.yMin;
            cOptions.yAxis.max = options.yMax;
        }
			
		cOptions.yAxis.labels = cOptions.yAxis.labels || {};

		//处理百分比格式
		if (cOptions.yAxis.dataFormat == 3){
			cOptions.tooltip.valueSuffix = '%';
		}
		if (cOptions.tooltip.valueSuffix){
			cOptions.yAxis.labels.formatter = function(){
				var value = (cOptions.yAxis.dataFormat == 5)?  Highcharts.numberFormat(this.value * 100, 0) : this.value;
				return value + cOptions.tooltip.valueSuffix;
			};
		}
		//自定义tooltip
		if (cOptions.chart.type != 'pie'){
            cOptions.tooltip.formatter = function(){
			var yName = cOptions.yAxis.name ? ' (' + cOptions.yAxis.name + ')' : '';			//显示自定义的Y轴名称
			var xName = isDateTime ? toDateDesc(this.x) : this.x;
			var s = '<div style="padding:5px;"><b>' + xName + yName + '</b></div><table style="width: 150px">';                
			$.each(this.points, function(i, point) {
				var value = formatValue(cOptions.yAxis.dataFormat, point.y);
				var suffix = cOptions.tooltip.valueSuffix || '';
				s += '<tr><td style="padding: 2px 5px" >' + point.series.name + ' </td>' 
				   + '<td style="text-align: right;padding-left:15px">' + value + suffix + ' </td></tr>';
			});           
			s += '</table>';
			return s;
		};
        }
		if (cOptions.yAxis.dataFormat == 4){
			//转成时分秒格式H:mm:ss
			cOptions.yAxis.labels.formatter = function(){
				return formatValue(cOptions.yAxis.dataFormat, this.value);
			};
		}
        switch(options.labelFormat){
            case 0:
                cOptions.plotOptions.series.dataLabels.enabled = false;
                break;
            case 1:
                cOptions.plotOptions.series.dataLabels.formatter = cOptions.plotOptions.series.dataLabels.formatter || function(){
				    return formatValue(cOptions.yAxis.dataFormat, this.y);
                }
                break;
            case 2:
                cOptions.plotOptions.series.dataLabels.formatter = cOptions.plotOptions.series.dataLabels.formatter || function(){
                    return Highcharts.numberFormat(this.percentage, 2) + '%';
                }
                break;
            default:
                cOptions.plotOptions.series.dataLabels.enabled = false;
                break;
        }


        options.showPlotLine && drawPlotLine();
        options.autoYAxisInterval && autoYAxisInterval();

        var chart = new Highcharts.Chart(cOptions);

        function formatValue(dataFormat, value){

            switch(dataFormat){
                case 1:
                    value =  Highcharts.numberFormat(value, 0);
                    break;
                case 2:
                    value =  Highcharts.numberFormat(value, 2);
                    break;
                case 3:
                    value =  Highcharts.numberFormat(value, 2);
                    break;
                case 4:
                    var toTimeDesc = function(t){
                        var h = parseInt(t / 3600);
                        var m = '00' + parseInt((t % 3600) / 60);
                        var s = '00' + parseInt(t % 3600 % 60);
                        m = m.substr(m.length - 2, 2);
                        s = s.substr(s.length - 2, 2);

                        return h + ':' + m + ':' + s;
                    };

                    value = toTimeDesc(value);						//处理时间格式为时分秒格式H:mm:ss
                    break;
                case 5:
                    value =  Highcharts.numberFormat(value * 100, 2);
                    break;
            }

            return value;
        }

        /*
         * 自动计算Y轴间距,算法如下:
         * 1. 计算平均间距, (maxY - minY) / 最大刻度数, 
         * 2. 规范化平均间距, 1). 当间距是100量级,规范化为10, 50, 100
         *                    2). 间距规范化为, 100, 200, ... 900, (1000量级)
         *                                      1000, 2000, ... 9000 (1W量级)
         */
        function autoYAxisInterval(){
            
            if (maxY == 0){
                cOptions.yAxis.max = 100;   //如果所有数据为0，则固定Y轴最大为100
                return;
            }
            //堆叠图不处理自动间距
            if (cOptions.chart.type == 'column' && cOptions.plotOptions.column && cOptions.plotOptions.column.stacking){
                return;
            }

            var interval = parseInt((maxY - minY) / options.maxYAxisIntervalCount);
            var yAxis = cOptions.yAxis;
            var maxVal = 10;

            while (interval > maxVal){
                maxVal *= 10;
            }

            if (maxVal >= 1000){
                for(var i = 1; i <= 10; i++){
                    if (interval < i * maxVal / 10){
                        interval = parseInt((i - 1) * maxVal / 10);
                        break;
                    }
                }
            }else{
                //如果间距是100量级,规范化为10, 50, 100
                if (interval < maxVal * 1 / 4){
                    interval = maxVal / 10;
                }else if (interval < maxVal * 3 / 4){
                    interval = maxVal / 2;
                }else{
                    interval = maxVal;
                }
            }


            yAxis.allowDecimals = false;
            yAxis.tickInterval = interval;
        }

    function isNotPieChart(){
        return cOptions.chart.type !== 'pie';
    }

    function isDate(obj){
        var d = new Date(obj);
        return !isNaN(d);
    }

	function toDateDesc(obj){
		var d = new Date(obj);
		var result = isNaN(d) ? obj : d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		return result;
	}

    //转换成highcharts可以识别的categories
    function toHighChartCategories(categories){
        var hcCagetories = [];
        for(var c in categories){
           hcCagetories.push(categories[c]); 
        }

        return hcCagetories;
    }

    //转换成highcharts可以识别的数列
    function toHighChartSeries(series){
        var hcSeries = [];
        var hcSer;

        if ($.isArray(series)){
            for(var i in series){
                var ser = series[i];
                hcSer = toSeriesItem(ser);
                hcSeries.push(hcSer);
            }
        }
        else{
            hcSer = toSeriesItem(series);
            hcSeries.push(hcSer);
        }

        return hcSeries;
    }

    //转换一个数列
    function toSeriesItem(ser){
		if (!ser){
			return {name: ' ', data: []};
		}
        var hcSer = {
            name: ser.name || '',
            data: []
        };
        hcSer = $.extend(true, hcSer, ser);
        hcSer.data = [];
        
        var serData = ser.data || [];
        var hcData = [];

        var counter = 0;
        var sumY = 0;
        for (var j in serData){
            var point = serData[j];
            var hcPoint;
//            if (point > 0){
                hcPoint = point;
 /*           }
            else{
                hcPoint = {
                    name: point.name || '',
                    y: point.y || point[0] || null,
                    color: point.color || null
                };
            } 
*/
            isNotPieChart() && (hcPoint.marker = hcPoint.marker || {}, typeof(hcPoint.marker.enabled) == 'undefined' && (hcPoint.marker.enabled = false));
            hcPoint.y != null && (hasData = true, counter++, maxY = maxY > hcPoint.y? maxY : hcPoint.y, sumY += hcPoint.y);
            hcData.push(hcPoint);
        }

        for(var i in hcData){
            var point = hcData[i];
            if (point.y != null){
                isNotPieChart() && (point.marker.enabled = counter <= 7);
                point.percentage = Math.round(parseFloat(point.y * 10000) / sumY) / 100;
            }
        }

        hcSer.data = hcData;
        return hcSer;
    }

    function drawPlotLine(){
        if (minY >= maxY){
            return;
        }

        midY = (maxY - minY) / 2;
        cOptions.yAxis.plotLines = [{dashStyle: 'longdashdot', color: 'red', width: 1, value: midY, label:{text:'中位线'}}];
    } 

    };

})(jQuery);

