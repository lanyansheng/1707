
//2017-12-5
function Ajax(url,fn){      //Ajax，fn为回调函数的函数名，不加();
				if(XMLHttpRequest){
					var xhr = new XMLHttpRequest();
				}
				else{
					var xhr = new ActiveXObject('Microsoft.XMLHTTP');
				}
				xhr.open("GET",url,true) ;
				xhr.send();
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4 && xhr.status == 200){
						var data = xhr.responseText ;
						fn(data);
					}
				}
			}

		/*
        	editor：兰延生
        	time：2017-11-22
        	describe：cookie封装
   		*/

function setCookie (name,value,day) {                     // 创建cookie	
	var oDate = new Date();
	oDate.setDate(oDate.getDate()+day);
	document.cookie = name + "=" + value + ";expires=" + oDate ;
}

function getCookie (name) {                   //通过cookie名查询单个cookie值
	var strCookie = document.cookie ;
	var arrCookie = strCookie.split("; ");
	for( var i = 0 ; i < arrCookie.length ; i ++){
		var arr = arrCookie[i].split("=");
		if(arr[0] == name){
			return arr[1];
		}
	}
	
}

function removeCookie (name) {                // 通过cookie名删除cookie
	setCookie(name,1,-1) ;
}

function drag(ele) {                         // 拖拽
	ele.onmousedown = function(e) {
		var evt = e || event;
		var disX = evt.offsetX;
		var disY = evt.offsetY;
		ele.style.left = evt.clientX - disX + "px";
		ele.style.top = evt.clientY - disY + "px";
		document.onmousemove = function(e) {
			var evt = e || event;
			var x = evt.clientX - disX;
			var y = evt.clientY - disY;
			if(x <= 0){
				x = 0 ;
			}
			if(y <= 0){
				y = 0 ;
			}
			if(x >= document.documentElement.clientWidth-ele.offsetWidth){
				x = document.documentElement.clientWidth-ele.offsetWidth ;
			}
			if(y >=document.documentElement.clientHeight-ele.offsetHeight){
				y = document.documentElement.clientHeight-ele.offsetHeight ;
			}
			ele.style.left = x + "px";
			ele.style.top = y + "px";
		}
		document.onmouseup = function() {
			document.onmousemove = null;
	//		document.onmouseup = null;
		}
	}
}

function position_remember( ele ){                  //记录该元素位置
	if(getCookie("left")){				
				ele.style.left = getCookie("left") ;
				ele.style.top  = getCookie("top")  ;
			}
			ele.onmousedown = function(e) {
		var evt = e || event;
		var disX = evt.offsetX;
		var disY = evt.offsetY;
		document.onmousemove = function(e) {
			var evt = e || event;
			var x = evt.clientX - disX;
			var y = evt.clientY - disY;
			if(x <= 0){
				x = 0 ;
			}
			if(y <= 0){
				y = 0 ;
			}
			if(x >= document.documentElement.clientWidth-ele.offsetWidth){
				x = document.documentElement.clientWidth-ele.offsetWidth ;
			}
			if(y >=document.documentElement.clientHeight-ele.offsetHeight){
				y = document.documentElement.clientHeight-ele.offsetHeight ;
			}
			ele.style.left = x + "px";
			ele.style.top = y + "px";
		}
		document.onmouseup = function(e) {
			document.onmousemove = null;
			document.onmouseup = null;
			console.log("aaa");
				var evt = e || event ;
				var x = ele.style.left ;
				var y =ele.style.top ;
				setCookie("left",x,7);
				setCookie("top",y,7);
		}
	}	
}

function getstyle(obj,attr){              //获取非行内样式属性值
	if(obj.currentStyle){
		return obj.currentStyle[attr]; //IE浏览器
	}
		return  getComputedStyle(obj,null)[attr];  // 非IE浏览器	
}
		/*
        	editor：兰延生
        	time：2017-11-27
        	describe：运动函数封装
        	obj : 元素
        	json : 要改变的元素的属性和值  {"width":200,"height":300}
        	fn : 回调函数，异步实现不同元素属性值变化时使用
   		*/
function StartMove(obj,json,fn){    
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var flag = true;
		for(var attr in json) {
			if(attr == "opacity") { // 得到当前属性值
				var iCur = Math.round(parseFloat(getstyle(obj, "opacity") * 100));
			} else {
				var iCur = parseInt(getstyle(obj, attr)); //getstyle返回的值为字符串
			}
			var iTarget = json[attr]; // 获得目标属性值
			var iSpeed = (iTarget - iCur) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if(attr == "opacity") {
				obj.style.opacity = (iCur + iSpeed) / 100;
				obj.style.filter = "alpha(opacity=" + (iCur + iSpeed) + ")";
			} else {
				obj.style[attr] = iCur + iSpeed + "px";
			}
			if(iCur != iTarget) {
				flag = false;
			}
		}

	if(flag) {
		clearInterval(obj.timer);
		if(fn) {
			fn();
		}
	}
}, 30);
}
                           //  time：2017-11-30

//自适应瀑布流，条件：生成子元素需要为div，宽度需一致，外围结构定位top为0，img设置为block ;
function waterfall(oWrap,ml,mt,data){ //外围结构,左边距，上边距，数据库
			aLi = oWrap.children ;  // 获取所有li ；
			var _width = oWrap.offsetWidth ; // 获得外围宽度
			var perwidth = aLi[0].offsetWidth ; // 获取单个LI的宽度
			var col = Math.floor(_width/(perwidth+ml)) ; // 得到有几列
			var arr=[] ;                                 // 存放单列高度			
			for(i = 0 ;i < col;i++){                      // 给顶层赋 top left 值
				aLi[i].style.left = (perwidth+ml)* i +"px" ;
				aLi[i].style.top = 0 ; 
//				arr[i] = aLi[i].offsetHeight ;
				arr.push(aLi[i].offsetHeight) ;
			}
			Compos(col) ;
						
			window.onscroll=function(){   //滚动添加
				var minIndex = getMinIndex(arr);
				var minVal = arr[minIndex];
				var clientHeight =document.documentElement.clientHeight || document.body.clientHeight ;                       //窗口可视高度
				var scrollTop =document.documentElement.scrollTop || document.body.scrollTop;
				var ComHeight =scrollTop+clientHeight ; //比较高度
				if(minVal < ComHeight){
						var html="" ;
						for(j=0;j<data.length;j++){
							html += "<div><img src='"+data[j]+"'></div>"  ;
						}
						console.log(html);
						oWrap.innerHTML += html ;
						Compos( aLi.length- data.length ) ;
				}
			}
			
			function getMinIndex(arr){
				var minValue = Math.min.apply(null,arr) ;
				var minIndex = arr.indexOf(minValue) ;
				return minIndex ;
			}
			function Compos(col){
				for( i = col ; i< aLi.length ; i++){     //找到最小高度的Li，添加
				 var minIndex = getMinIndex(arr) ;
				 aLi[i].style.left =  minIndex*(perwidth+ml) +"px" ;
				 aLi[i].style.top = arr[minIndex] + mt + "px" ;
				 arr[minIndex] = arr[minIndex] + mt + aLi[i].offsetHeight;//添加之后要刷新LI的高度
			}
			}
		}

//getbyclassname  输入class名，返回当前文档的所有含有该class名的节点，兼容IE
function getByClassName(classname) {
	if(document.getElementsByClassName) {
		return document.getElementsByClassName(classname);
	}
	var newArr = [];
	var nodes = document.getElementsByTagName("*");
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].getAttribute("class")) {
			var attr = nodes[i].getAttribute("class");
			var arr = attr.split(" ");
			for(var j = 0; j < arr.length; j++) {
				if(arr[j] == classname) {
					newArr.push(nodes[i]);
				}
			}
		}
	}
	return newArr;
}

			//利用递归实现深拷贝 
			function deepCopy(obj){
				if(Array.isArray(obj)){
					var newObj = [];
				}else{
					var newObj = {};
				}			
				for(var i in obj){
					if(typeof obj[i] == "object"){
						newObj[i] = deepCopy(obj[i]);
					}else{
						newObj[i] = obj[i]
					}	
				}
				
				return newObj;
			}
		/*
        	editor：兰延生
        	time：2017-11-18
        	describe：常用日期封装
   		*/
	
var dateUtil = {
	Leap_Year : function(year){                             //判断是否为闰年，返回布尔值
 		if(year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
			return true ;
		}
		return false ;
	},
	
	// 输入日期:var oDate=  new Date("2016/3/5");
	
	Date_Format : function(oDate,str){                               //返回日期格式
		var year = oDate.getFullYear();
		var month = oDate.getMonth() + 1 ;
		var day = oDate.getDate() ;
		month = dateUtil.Add_Zero(month) ;
		day = dateUtil.Add_Zero(day) ;
		return year + str + month + str + day ;
	},
	
	//输入 str为年月日的间隔符号格式， str1为时分秒的间隔符号格式
	Date_Detail : function (str,str1){                           // 返回当前具体日期，精确到秒
		var oDate = new Date();
		var year = oDate.getFullYear();
		
		var month = oDate.getMonth() + 1 ;
		var day = oDate.getDate() ;
		var hour =oDate.getHours() ;
		var minute = oDate.getMinutes() ;
		var second = oDate.getSeconds() ;
		month = dateUtil.Add_Zero(month) ;
		day = dateUtil.Add_Zero(day) ;
		hour = dateUtil.Add_Zero(hour) ;
		minute = dateUtil.Add_Zero(minute) ;
		second = dateUtil.Add_Zero(second) ;
		return year + str + month + str + day +" " + hour + str1 + minute + str1 + second ;
	},
	
	Add_Zero : function(num){                              //值<10时，返回值前面加0
		return num < 10 ? "0" + num : num ;  
	},
	
	This_Month_Day : function(year,month){                 // 返回输入月份的天数
		switch(month){
			case 4 : 
			case 6 :
			case 9 :
			case 11 :
			return 30 ;
			case 2 :
			if(dateUtil.Leap_Year(year)){
				return 29 ;
			}
			return 28 ;
			default :
			return 31 ;
		}
	},
	
	//输入日期的格式如 var oDate_1 = new Date("2016/3/3 16:4:3");
	
	Date_Diff_Days :function(oDate_1,oDate_2){              //输入的两天相差多少时间
		var sum = Math.abs((oDate_2-oDate_1)/1000);		
		var day = Math.floor ( sum / 60 / 60 / 24 ) ;
		var hour = Math.floor( sum / 60 / 60 % 24 ) ;
		var minute = Math.floor( sum / 60 % 60 ) ;
		var second = Math.floor( sum % 60 ) ;
		return day + "天" + hour + "小时" + minute + "分钟" + second + "秒"
	},
	
	Get_Future_Day : function(num){                        // 当前日期加上输入值后是哪一天
		var date = new Date();
		var day = date.getDate();
		date.setDate( day + num ) ;
		return dateUtil.Date_Format( date , "/") ;
	}
}


		/*
        	editor：兰延生
        	time：2017-11-18
        	describe：常用日期封装
   		*/



var arrayUtil = {
   	Bubble_Sort : function(arr,num){                     // 冒泡排序，0：从小到大 1：从大到小			
   		for( var i = 0 ; i < arr.length ; i ++){
   			for( var j = 0 ; j < arr.length - i - 1 ; j ++){
   				if(num == 0){
   					if(arr[j]>arr[j+1]){
   						var temp = arr[j] ;
   						arr[j] = arr[j+1] ;
   						arr[j+1] = temp ;
   					}
   				}
   				else {
   					if(arr[j]<arr[j+1]){
   						var temp = arr[j] ;
   						arr[j] = arr[j+1] ;
   						arr[j+1] = temp ;
   				    }
   			    }
   		    } 
   	    }
   		return arr ;
    },
    
    No_Repeat : function(arr){                  //去重+从小到大排序 
   		var obj = {};
   		var new_arr = [];
   		for (var i = 0 ; i <arr.length ; i ++ ){
   			if( obj[arr[i]] == undefined ){
   				new_arr.push(arr[i]) ;
   				obj[arr[i]] = 1 ;
   			}
   		}
   		new_arr.sort(function(a,b){
   			return a-b ;
   		}) ;
   		return new_arr ;
    },
    
    Fac : function(num){                      // 求一个数的阶乘
    	if(num == 1){
    		return 1 ;
    	}
    	return num*arrayUtil.Fac(num-1);
    },
    
    Fac_Sum : function(n){                 //返回1到n的阶乘和
    	var j = 1;
    	var sum = 0 ;
    	for(var i = 1 ; i <= n ; i ++){
    		j *= i ;
    		sum += j ; 
    	}
    	return sum ;
    },
    
    Gcd : function(m,n){                  // 返回数值的最大公约数
    	var r = m % n ;
    	if ( r != 0){
    		return arrayUtil.Gcd(n,r);
    	}
    	else{
    		return n ;
    	}
    },
    
    Feibo: function(n){                         //1,1,2,3,5,8,13求斐波那契数列第n个数是
				if(n==0){
					return 0;
				}
				if(n==1){
					return 1;
				}				
				return arrayUtil.Feibo(n-1)+arrayUtil.Feibo(n-2);
			}
} 
