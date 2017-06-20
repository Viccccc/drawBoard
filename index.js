// 	创建一个通过id返回该节点的函数
function d(id) {
	return document.getElementById(id) || null;
}

// 	功能栏的值显示
function showValue(target, show) {
	target.oninput = function() {
		show.innerHTML = target.value;
	}
}
// 获取值
function getValue(elem) {
	return elem.value;
}
// 等待页面加载

window.onload = function() {
	// 调用方法
	showValue(d('lineWidth'), d('showWidth'));
	showValue(d('strokeColor'), d('showStrokeColor'));
	showValue(d('fillColor'), d('showFillColor'));
	showValue(d('eraser'), d('showEraser'));

	// 创建画图板对象
	var panel = {
		// 画布属性
		canvas: d('canvas'),
		width: 800,
		height: 480,
		ctx: null,
		//		基本属性信息
		lineWidth: 1,
		eraserWidth:20,
		strokeColor: '#333',
		fillColor: '#333',
		shape: 'line',
		rect: {
			x: 0,
			y: 0,
			w: 0,
			cx:0,
			cy:0,
			h: 0
		},
		way:'stroke',
		circle: {
			x: 0,
			y: 0,
			cx:0,
			cy:0,
			r:0,
			rate:1
		},
		line:{x:null,y:null},
		// 是否为连续线段
		isContinuity:true,
		shape: 'line',
		rubberRandDiv:d('rubberRandDiv'),
		// 	添加事件  发生变化时更新属性
		getAttr:function(){
			var _self = this;
				d('lineWidth').addEventListener('input',function(){
					_self.lineWidth = this.value;
				});

				d('strokeColor').addEventListener('change',function(){
					_self.strokeColor = this.value;
				});

				d('fillColor').addEventListener('change',function(){
					_self.fillColor = this.value;
				});

				d('fill').addEventListener('click',function(){
					_self.way = this.value;
				});

				d('stroke').addEventListener('click',function(){
					_self.way = this.value;
				});

				d('continuity').addEventListener('click',function(){
					_self.isContinuity = true;
				});

				d('discontinuity').addEventListener('click',function(){
					_self.isContinuity = false;
					_self.initLine();
				});

				d('eraser').addEventListener('input',function(){
					_self.eraserWidth = this.value;
				});
		},
		//	初始化线条的属性
		initLine:function(){
			this.line={x:null,y:null};
		},
		//	初始化矩形的属性
		initRect:function(){
			this.rect={
				x: 0,
				y: 0,
				w: 0,
				cx:0,
				cy:0,
				h: 0
			}
		},
		//	初始化椭圆的属性
		initCircle:function(){
			this.circle={
				x: 0,
				y: 0,
				cx:0,
				cy:0,
				r:0,
				rate:1
			}
		},
		//		初始化函数   填充画布   添加清空画布事件
		init: function() {
			this.getAttr();
			//	设置画布的宽高
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			//		将画布填充为白色
			this.ctx = this.canvas.getContext('2d');
			this.ctx.fillStyle = '#fff';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			var _self = this;
			d('clear').addEventListener('click',function(){
					_self.ctx.clearRect(0,0,_self.width,_self.height);
			});
			// 调用获取坐标的方法
			this.draw();
		},
		//	画笔函数
		drawPoint:function(){
			var _self = this;
			var flag = false;
			//	鼠标按下
			this.canvas.onmousedown = function(event){
				flag = true;
				// _self.ctx.save();
				_self.ctx.beginPath();
				var x = event.pageX - _self.canvas.offsetLeft;
				var y = event.pageY - _self.canvas.offsetTop;
				// _self.ctx.fillStyle = _self.fillColor;
				// _self.ctx.arc(x,y,_self.lineWidth,0,Math.PI*2);
				// _self.ctx.fill();
				// _self.ctx.restore();
				_self.ctx.moveTo(x,y);
			} 
			//	鼠标移动   使用变量判断是否之前按下鼠标
			this.canvas.onmousemove = function(event){
				// _self.ctx.save();
				var x = event.pageX - _self.canvas.offsetLeft;
				var y = event.pageY - _self.canvas.offsetTop;
				if(flag){
					// _self.ctx.fillStyle = _self.fillColor;
					// _self.ctx.moveTo(x,y);
					// _self.ctx.arc(x,y,_self.lineWidth,0,Math.PI*2);
					// _self.ctx.fill();
					_self.ctx.lineJoin = 'round';
					_self.ctx.lineWidth = _self.lineWidth;
					_self.ctx.strokeStyle = _self.strokeColor;
					_self.ctx.lineTo(x,y);
					_self.ctx.stroke();
					// _self.ctx.closePath();
					// _self.ctx.restore();
				}
			}
			//	鼠标松开	取消按下状态
			this.canvas.onmouseup = function(){
				_self.ctx.closePath();
				flag = false;	
			}
		},
		//	画矩形函数
		drawRect:function(){
			var _self = this;
			var flag =false;
			//	鼠标按下		替代矩形显示
			this.canvas.onmousedown = function(event){
					_self.rect.x = event.pageX - _self.canvas.offsetLeft;
					_self.rect.y = event.pageY - _self.canvas.offsetTop;
					flag = true;

					_self.rect.cx = event.pageX;
					_self.rect.cy = event.pageY;
					d('rubberRandDiv').style.display = 'block';
				}

			this.canvas.onmousemove = function(event){

					event.preventDefault();
					//	判断是否之前按下鼠标
					if(flag){
						//	计算出替代矩形的left top width height
						_self.rubberRandDiv.style.left = (event.pageX<_self.rect.cx?event.pageX:_self.rect.cx) + 'px';
						_self.rubberRandDiv.style.top = (event.pageY<_self.rect.cy?event.pageY:_self.rect.cy) + 'px';
						_self.rubberRandDiv.style.width = Math.abs(event.pageX - _self.rect.cx) + 'px';
						_self.rubberRandDiv.style.height = Math.abs(event.pageY - _self.rect.cy) + 'px';
						//	设置线宽  颜色等熟悉
						_self.rubberRandDiv.style.borderStyle = 'solid';
						_self.rubberRandDiv.style.borderColor = _self.strokeColor;
						_self.rubberRandDiv.style.borderRadius = 0;
						//	判断是否填充
						if(_self.way != "stroke"){
							_self.rubberRandDiv.style.backgroundColor = _self.fillColor;
							_self.rubberRandDiv.style.borderWidth = 0;
						}else{
							_self.rubberRandDiv.style.borderWidth = _self.lineWidth +'px';
						}
					}
			}
		
			window.onmouseup = function(event){
				//	替代矩形隐藏
				d('rubberRandDiv').style.display = 'none';
				if(flag){
					// 矩形的位置
					var x = event.pageX - _self.canvas.offsetLeft;
					var y = event.pageY - _self.canvas.offsetTop;

					var rx = _self.rect.x;
					var ry = _self.rect.y;

					// 矩形的宽高
					_self.rect.w = Math.abs(x - rx);
					_self.rect.h = Math.abs(y - ry);
					// 矩形的左上角坐标
					_self.rect.x = x<rx?x:rx;
					_self.rect.y = y<ry?y:ry;

					
					// 开始绘制
					if(_self.way=='stroke'){
						_self.ctx.beginPath();
						_self.ctx.lineWidth = _self.lineWidth;
						_self.ctx.strokeStyle = _self.strokeColor;
						_self.ctx.strokeRect(_self.rect.x,_self.rect.y,_self.rect.w,_self.rect.h);
						_self.ctx.closePath();
					}else{
						_self.ctx.beginPath();
						_self.ctx.lineWidth = _self.lineWidth;
						_self.ctx.fillStyle = _self.fillColor;
						_self.ctx.rect(_self.rect.x,_self.rect.y,_self.rect.w,_self.rect.h);
						_self.ctx.fill();
						_self.ctx.closePath();
					}
					flag = false;
				}
				_self.initRect();
			}
		},
		//	橡皮擦函数
		eraser:function(){
			var _self = this;
			var flag = false;
			//	鼠标按下
			this.canvas.onmousedown = function(event){
				_self.ctx.save();
				_self.ctx.beginPath();
				var x = event.pageX - _self.canvas.offsetLeft;
				var y = event.pageY - _self.canvas.offsetTop;
				_self.ctx.arc(x,y,_self.eraserWidth,0,Math.PI*2);
				_self.ctx.clip();
				_self.ctx.clearRect(0,0,_self.width,_self.height);
				_self.ctx.restore();
				flag = true;
			}
			//	鼠标移动
			this.canvas.onmousemove = function(event){
				if(flag){
					_self.ctx.save();
					_self.ctx.beginPath();
					var x = event.pageX - _self.canvas.offsetLeft;
					var y = event.pageY - _self.canvas.offsetTop;
					_self.ctx.arc(x,y,_self.eraserWidth,0,Math.PI*2);
					_self.ctx.clip();
					_self.ctx.clearRect(0,0,_self.width,_self.height);
					_self.ctx.restore();
				}
			}

			this.canvas.onmouseup = function(event){
				flag = false;
			}
		},
		//	画椭圆函数
		drawCircle:function(){
			var _self = this;
			var flag = false;
			var isCtr = false;
			//	按下时的出圆心
			this.canvas.onmousedown = function(event){
				_self.circle.x = event.pageX - _self.canvas.offsetLeft;
				_self.circle.y = event.pageY - _self.canvas.offsetTop;

				_self.circle.cx = event.pageX;
				_self.circle.cy = event.pageY;
				flag = true;
			}
			//	判断是否按下ctrl键  即判断是否画圆
			window.onkeydown = function(event){
				if(event.keyCode == 17){
					isCtr = true;
				}
			}
			//	是否松开ctrl键
			window.onkeyup = function(event){
				if(event.keyCode == 17){
					isCtr = false;
				}
			}
			//	移动事件
			window.onmousemove = function(event){

				event.stopPropagation();
				//	计算触发事件点据canvas左 上侧的距离
				var x = event.pageX - _self.canvas.offsetLeft;
				var y = event.pageY - _self.canvas.offsetTop;
				if(flag){

					_self.rubberRandDiv.style.display = 'block';
					//	计算半径
					_self.circle.r = Math.sqrt(Math.pow(x-_self.circle.x,2)+Math.pow(y-_self.circle.y,2));
					//	替代圆形
					_self.rubberRandDiv.style.borderRadius = "50%";
					_self.rubberRandDiv.style.borderStyle = 'solid';

// 画圆 按下ctr键
					if(isCtr){
						//	判断是否超出canvas的范围
						if(_self.circle.r+_self.lineWidth>=Math.min(_self.circle.x,_self.circle.y,_self.width-_self.circle.x,_self.height-_self.circle.y)){
							_self.circle.r = Math.min(_self.circle.x,_self.circle.y,_self.width-_self.circle.x,_self.height-_self.circle.y) - _self.lineWidth;
						}
						//	得出替代圆形的半径
						_self.rubberRandDiv.style.width = _self.circle.r*2+'px';
						_self.rubberRandDiv.style.height = _self.circle.r*2+'px';
						//	得出替代圆形的left top
						_self.rubberRandDiv.style.left = _self.circle.cx - _self.circle.r +'px'; 					
						_self.rubberRandDiv.style.top = _self.circle.cy - _self.circle.r +'px'; 		
						if(_self.way == 'stroke'){
							//	判断实心或空心
							_self.rubberRandDiv.style.borderWidth = _self.lineWidth+'px';
							_self.rubberRandDiv.style.borderColor = _self.strokeColor;
							_self.rubberRandDiv.style.backgroundColor = "transparent";
						}else{
							_self.rubberRandDiv.style.backgroundColor = _self.fillColor;
							_self.rubberRandDiv.style.borderWidth = 0;
						}
					}else{
						//	绘制椭圆
						//	计算椭圆的宽高的一半
						var w = Math.abs(event.pageX - _self.circle.cx);
						var h = Math.abs(event.pageY - _self.circle.cy);
						//	是否超出canvas的范围
						if(w+_self.lineWidth>=Math.min(_self.width - _self.circle.x,_self.circle.x)){
							w = Math.min(_self.width - _self.circle.x,_self.circle.x)-_self.lineWidth;
						}


						if(h+_self.lineWidth>=Math.min(_self.height - _self.circle.y,_self.circle.y)){
							h = Math.min(_self.height - _self.circle.y,_self.circle.y)-_self.lineWidth;
						}
						//	将最长的作为半径
						_self.circle.r = w>h?w:h;

						//	替代矩形的宽高
						_self.rubberRandDiv.style.width = w*2 + 'px';
						_self.rubberRandDiv.style.height =h*2 + 'px';
						//	计算替代圆的left
						var left  = _self.canvas.offsetLeft + _self.circle.x - w - _self.lineWidth;		
						//	超出时  等于canvas左侧的left  或右侧的 left
						if(left<=_self.canvas.offsetLeft){
							left = _self.canvas.offsetLeft;
						}

						if(left+2*w+2*_self.lineWidth>=_self.canvas.offsetLeft+_self.canvas.width){
							left = _self.canvas.offsetLeft+_self.canvas.width - 2*w+2*_self.lineWidth;
						}
						_self.rubberRandDiv.style.left = left+'px';

						//	计算替代原的top
						var top  = _self.circle.cy - Math.abs(event.pageY - _self.circle.cy);		

						if(top<=_self.canvas.offsetTop){
							top = _self.canvas.offsetTop;
						}

						if(top+2*h+2*_self.lineWidth>=_self.canvas.offsetTop+_self.canvas.height){
							top = _self.canvas.offsetTop+_self.canvas.height - 2*h+2*_self.lineWidth;
						}
						_self.rubberRandDiv.style.top = top+'px';


						if(_self.way == 'stroke'){
							_self.rubberRandDiv.style.borderWidth = _self.lineWidth+'px';
							_self.rubberRandDiv.style.borderColor = _self.strokeColor;
							_self.rubberRandDiv.style.backgroundColor = "transparent";
						}else{
							_self.rubberRandDiv.style.backgroundColor = _self.fillColor;
							_self.rubberRandDiv.style.borderWidth = 0;
						}

						_self.circle.rate = {rateX:w/_self.circle.r,rateY:h/_self.circle.r};
					}
				}
			}
		//	松开即进行绘制
			window.onmouseup = function(event){
					d('rubberRandDiv').style.display = 'none';

					flag = false;
					// 绘制圆形
					if(isCtr){
						if(_self.way == 'stroke'){
							_self.ctx.beginPath();

							_self.ctx.strokeStyle = _self.strokeColor;
							_self.ctx.lineWidth = _self.lineWidth;
							_self.ctx.arc(_self.circle.x,_self.circle.y,_self.circle.r,0,Math.PI*2);
							_self.ctx.stroke();
							_self.ctx.closePath();
						}else{
							_self.ctx.beginPath();
							_self.ctx.lineWidth = 0;
							_self.ctx.fillStyle = _self.fillColor;
							_self.ctx.arc(_self.circle.x,_self.circle.y,_self.circle.r,0,Math.PI*2);
							_self.ctx.fill();
							_self.ctx.closePath();
						}
						//	绘制椭圆
					}else{
						if(_self.way == 'stroke'){
							_self.ctx.save();
							_self.ctx.scale(_self.circle.rate.rateX,_self.circle.rate.rateY);
							_self.ctx.beginPath();

							_self.ctx.strokeStyle = _self.strokeColor;
							_self.ctx.lineWidth = _self.lineWidth;
							_self.ctx.arc(_self.circle.x/_self.circle.rate.rateX,_self.circle.y/_self.circle.rate.rateY,_self.circle.r,0,Math.PI*2);
							_self.ctx.closePath();
							_self.ctx.stroke();
							_self.ctx.restore();
						}else{
							_self.ctx.save();
							_self.ctx.scale(_self.circle.rate.rateX,_self.circle.rate.rateY);
							_self.ctx.beginPath();

							console.log(_self.fillColor);
							_self.ctx.fillStyle = _self.fillColor;
							_self.ctx.lineWidth = 0;
							_self.ctx.arc(_self.circle.x/_self.circle.rate.rateX,_self.circle.y/_self.circle.rate.rateY,_self.circle.r,0,Math.PI*2);
							_self.ctx.closePath();
							_self.ctx.fill();
							_self.ctx.restore();
					}
				}
			_self.initCircle();
			}
		},
		// 绘制线条
		drawLine:function(){
			var _self = this;
			// 每次画线条重新选点
			//	当鼠标按下的时候确定线段的位置
			this.canvas.onmousedown = function(event){
				_self.ctx.restore();
				// _self.ctx.clearRect(0,0,_self.width,_self.height);
				// _self.ctx.fillStyle = '#333';
				// _self.ctx.fillRect(0, 0, _self.canvas.width, _self.canvas.height);
					// 之前有起点保存
					_self.ctx.beginPath();
				if(_self.line.x != null){
					_self.ctx.moveTo(_self.line.x,_self.line.y);
					// 获取按下的坐标
					var x = event.pageX - _self.canvas.offsetLeft;
					var y = event.pageY - _self.canvas.offsetTop;

					//	设置线段的属性
					_self.ctx.lineWidth = _self.lineWidth;
					_self.ctx.lineJoin = 'round';
					_self.ctx.strokeStyle = _self.strokeColor;
					_self.ctx.lineTo(x,y);
					_self.line.x = x;
					_self.line.y = y;
					_self.ctx.stroke();
					_self.ctx.save();
//	是否绘制连续点
					if(!_self.isContinuity){
						_self.initLine();
					}
					// 当前为起始点
				}else{
					_self.line.x = event.pageX - Number(_self.canvas.offsetLeft);
					_self.line.y = event.pageY - Number(_self.canvas.offsetTop);
				}
					_self.ctx.closePath();
			}
		},
		//	总调用方法  调用其他的分方法
		draw: function() {

			// 默认为划线
			this.drawLine();
			var _self = this;
			var shapes = document.getElementsByName('shape');
			//	获取选中的形状
			for (var i = 0; i < shapes.length; i++) {
				(function(j) {
					shapes[j].onclick = function() {
						if(this.value == 'rect' || this.value == 'circle'){
							d('fill').removeAttribute('disabled');
						}else{
							d('fill').setAttribute('disabled','true');
						}
						_self.shape = this.value;

						//	根据选择的形状调用方法

						switch (_self.shape) {
							case 'point':
								_self.drawPoint();
								break;
							case 'rect':
								_self.drawRect();
								break;
							case 'line':
								_self.drawLine();
								break;
							case 'circle':
								_self.drawCircle();
								break;
						}
					}
				})(i);
			}
		

		var _self = this;
			d('eraserBtn').addEventListener('click',function(){
				_self.eraser();
			});
		}
	};

	// 调用初始化对象
	panel.init();
}