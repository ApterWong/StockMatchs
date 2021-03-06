
(function($$){
	$$.init({
		beforeback: function(){
			//获得列表界面的webview
			var list = plus.webview.currentWebview();
			//触发列表界面的自定义事件（refresh）,从而进行数据刷新
			mui.fire(list,'refresh');
			//返回true，继续页面关闭逻辑
			return true;
		},
		pullRefresh : {
		    container:"#pullrefreshArea",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
//		    down : {
//		      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
//		      color:'#EEEEEE', //可选，默认“#2BD009” 下拉刷新控件颜色
////		      height:'100px',//可选,默认50px.下拉刷新控件的高度,
////		      range:'50px', //可选 默认50px,控件可下拉拖拽的范围
//		      offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
////		      auto: true,//可选,默认false.首次加载自动上拉刷新一次
//		      callback :function(){
//		      	console.log('下拉刷新..');
//		      }
//		    },
			up:{
				contentrefresh: '正在加载...',
				contentnomore:'',
				callback:function(){
					console.log("上拉加载，，，");
					this.endPullupToRefresh(true);
				}
			}
		}
	});

	
	// tabwidget 切換
	mui("#tab1")[0].addEventListener('tap', function(){
		console.log("tab1");
		
		document.getElementById("tab1").classList.add("curtab");
		document.getElementById("tab2").classList.remove("curtab");
		document.getElementById("tab3").classList.remove("curtab");
		document.getElementById("tab4").classList.remove("curtab");
		
		document.getElementById("hot").classList.remove("mui-hidden");
		document.getElementById("newest").classList.add("mui-hidden");
		document.getElementById("care").classList.add("mui-hidden");
		document.getElementById("mine").classList.add("mui-hidden");
		document.getElementById("publish").classList.add("mui-hidden");
	});
	mui("#tab2")[0].addEventListener('tap', function(){
		console.log("tab2");
		
		document.getElementById("tab2").classList.add("curtab");
		document.getElementById("tab1").classList.remove("curtab");
		document.getElementById("tab3").classList.remove("curtab");
		document.getElementById("tab4").classList.remove("curtab");
		
		document.getElementById("newest").classList.remove("mui-hidden");
		document.getElementById("hot").classList.add("mui-hidden");
		document.getElementById("care").classList.add("mui-hidden");
		document.getElementById("mine").classList.add("mui-hidden");
		document.getElementById("publish").classList.add("mui-hidden");
	});
	mui("#tab3")[0].addEventListener('tap', function(){
		console.log("tab3");
		
		document.getElementById("tab3").classList.add("curtab");
		document.getElementById("tab2").classList.remove("curtab");
		document.getElementById("tab1").classList.remove("curtab");
		document.getElementById("tab4").classList.remove("curtab");
		
		document.getElementById("care").classList.remove("mui-hidden");
		document.getElementById("newest").classList.add("mui-hidden");
		document.getElementById("hot").classList.add("mui-hidden");
		document.getElementById("mine").classList.add("mui-hidden");
		document.getElementById("publish").classList.add("mui-hidden");
	});
	mui("#tab4")[0].addEventListener('tap', function(){
		console.log("tab4");
		
		document.getElementById("tab4").classList.add("curtab");
		document.getElementById("tab2").classList.remove("curtab");
		document.getElementById("tab3").classList.remove("curtab");
		document.getElementById("tab1").classList.remove("curtab");
		
		document.getElementById("mine").classList.remove("mui-hidden");
		document.getElementById("newest").classList.add("mui-hidden");
		document.getElementById("care").classList.add("mui-hidden");
		document.getElementById("hot").classList.add("mui-hidden");
		
		document.getElementById("publish").classList.remove("mui-hidden");
	});
	
	
	mui('#publish').on('tap', 'button', function(event){
		console.log("發表。。");
		var pg_new_topic = mui.preload({
			url:"newTopic.html",
			id:"newTopic",//默认使用当前页面的url作为id
		});
		
		mui.fire(pg_new_topic,'display',{});
		//打开個股詳情
		mui.openWindow({
			id:'newTopic'
		});
	});
	
	
	/********
	 * VM相关的操作函数  提取出来:
	 */
	/***
	 * post 請求到後端
	 * @param {Object} postdata：
	 * @param {Object} _url
	 * @param {Object} cb
	 */
	function fn_ajax_post(postdata, _url, cb) {
		cb = cb || mui.noop;
		
		app.fillToken(postdata);
		
		mui.ajax({
	            type: "post",
				url: _url,
				data:postdata,
	            timeout: 3000,
	            success: function(data) {
	            	console.log("success: URL:" + _url );
	            	
	            	if(data['errcode'] == 0){
	            		cb(data['retdata']);
	            	} else {
	            		plus.nativeUI.toast(data['errmsg']);
	            	}
	            },
	            error: function(xhr, type, errorThrown) {
	                plus.nativeUI.toast(errorThrown);
	            }
	        });// ajax
	}
	
	/**
	 * 給文章點贊
	 * @param {Object} item
	 */
	function fnUpCountTopic(item) {
//		var state = owner.getState();
//		if (!state) {
//			mui.alert("請登錄！", "提示");
//			return;
//		}
		postdata = {}
		postdata.aid = item.id;
		
		fn_ajax_post(postdata, urls.url_topicUpcountOnly, function(dat){
			item.upcounts += 1;
			plus.nativeUI.toast("點贊成功！");
		});
	};
	
	/***
	 * 跳轉到 用戶詳細頁面
	 */
	function toUserInfoPage(item) {
		mui.fire(userinfoPage, 'display', {data:item});
		//打开
		mui.openWindow({
			id:'userinfo'
		});
	};
	
	/**
	 * 跳轉到 文章詳細頁面
	 */
	function toTopicDetailPage(item) {
		mui.fire(topicDetailPage, 'display', {data:item});
		//打开
		mui.openWindow({
			id:'topicDetail'
		});
	}
	
	/****
	 * 数据模型  和  ajax 的数据获取
	 */
	var hotvm = new Vue({
		el:'#hotvm',
		data:{
			datas:{}
		},
		methods:{
			resetData:function(){//重置数据
				Object.assign(this.$data, {});
			},
			toUserinfo:function(item) {
				console.log("点击用户名:" + item.uid + " uname:" + item.uname);
				toUserInfoPage(item);
			},
			toTopicDetail:function(item){
				console.log("点击了文章（话题）:" + item.title);
				toTopicDetailPage(item);
			},
			upCountTopic:function(item) {
				console.log("给文章（话题）点赞:" + item.title);
				fnUpCountTopic(item);
			}
		}
	});
	
	var newestvm = new Vue({
		el:'#newestvm',
		data:{
			datas:{}
		},
		methods:{
			resetData:function(){//重置数据
				Object.assign(this.$data, {});
			},
			toUserinfo:function(item) {
				console.log("点击用户名:" + item.uid + " uname:" + item.uname);
				toUserInfoPage(item);
			},
			toTopicDetail:function(item){
				console.log("点击了文章（话题）:" + item.title);
				toTopicDetailPage(item);
			},
			upCountTopic:function(item) {
				console.log("给文章（话题）点赞:" + item.title);
				fnUpCountTopic(item);
			}
		}
	});
	
	var carevm = new Vue({
		el:'#carevm',
		data:{
			datas:{}
		},
		methods:{
			resetData:function(){//重置数据
				Object.assign(this.$data, {});
			},
			toUserinfo:function(item) {
				console.log("点击用户名:" + item.uid + " uname:" + item.uname);
				toUserInfoPage(item);
			},
			toTopicDetail:function(item){
				console.log("点击了文章（话题）:" + item.title);
				toTopicDetailPage(item);
			},
			upCountTopic:function(item) {
				console.log("给文章（话题）点赞:" + item.title);
				fnUpCountTopic(item);
			}
		}
	});
	
	var minevm = new Vue({
		el:'#minevm',
		data:{
			datas:{}
		},
		methods:{
			resetData:function(){//重置数据
				Object.assign(this.$data, {});
			},
			toUserinfo:function(item) {
				console.log("点击用户名:" + item.uid + " uname:" + item.uname);
				toUserInfoPage(item);
			},
			toTopicDetail:function(item){
				console.log("点击了文章（话题）:" + item.title);
				toTopicDetailPage(item);
			},
			upCountTopic:function(item) {
				console.log("给文章（话题）点赞:" + item.title);
				fnUpCountTopic(item);
			}
		}
	});
	
	function fn_ajax(postdata, url, cb){
		
		app.fillToken(postdata);
		
		mui.ajax({
	            type: "get",
				url: url,
				data:postdata,
	            timeout: 3000,
	            success: function(data) {
	            	console.log("success: URL:" + url );
	            	
	            	if(data['errcode'] == 0){
	            		cb(data['retdata']);
	            	} else {
	            		plus.nativeUI.toast(data['errmsg']);
	            	}
	            },
	            error: function(xhr, type, errorThrown) {
	                plus.nativeUI.toast(errorThrown);
	            }
	        });// ajax
	};
	
	/***8
	 * 获取热门
	 */
	function get_hot(){
		var data = {}
		
		data.page = 0;
		data.count = 40;
		
		fn_ajax(data, urls.url_topichot, function(resp){
			console.log(JSON.stringify(resp));
			
			hotvm.datas = resp;
		});
	};
	
	/****8
	 * 获取最新
	 */
	function get_newest(){
		var data = {}
		
		data.page = 0;
		data.count = 40;
		
		fn_ajax(data, urls.url_topicnewest, function(resp){
			console.log(JSON.stringify(resp));
			newestvm.datas = resp;
		});
	};
	
	/****
	 * 获取关注的
	 */
	function get_care(){
		var data = {}
		
		data.userid = app.getState().uid;
		data.page = 0;
		data.count = 40;
		
		fn_ajax(data, urls.url_topiccare, function(resp){
			console.log(JSON.stringify(resp));
			
			carevm.datas = resp;
		});
	};
	
	/****
	 * 获取与我相关的
	 */
	function get_mine(){
		var data = {}
		
		data.page = 0;
		data.count = 40;
		
		fn_ajax(data, urls.url_topicmine, function(resp){
			console.log(JSON.stringify(resp));
			
			minevm.datas = resp;
		});
	};
	
	
	mui.plusReady(function(){
		userinfoPage = mui.preload({
				url:"userinfo.html",
				id:"userinfo",//默认使用当前页面的url作为id
			});
		topicDetailPage = mui.preload({
				url:"topicDetail.html",
				id:"topicDetail",//默认使用当前页面的url作为id
			});
	});
	
	window.addEventListener('display', function(event) {
		console.log("討論頁面顯示。");
		
		get_hot();
		get_care();
		get_newest();
		get_mine();
	});
	
	window.addEventListener('refresh', function(event){
		console.log("討論頁面關閉。");
	});
})(mui);
