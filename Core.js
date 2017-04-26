

function Core(engine){
	this.empty();
	if(typeof(engine)==="undefined"){
		this.engine=new Engine();
	}else{
		this.engine=engine;
	}
	this.start();
}

Core.prototype.empty = function(){
	this.gl = null;
	this.engine = null;
	this.resx=window.innerWidth;
	this.resy=window.innerHeight;
	this.startresx=window.innerWidth;
	this.startresy=window.innerHeight;
	this.canvas = null;
	
	this.resizeTimeoutID=0;
	this.mvMatrix;
	this.mvMatrixStack = [];
	this.shaderProgram = null;
	this.vertexPositionAttribute=[];
	this.vertexNormalAttribute;
	this.textureCoordAttribute;
	this.perspectiveMatrix;
	this.shouldStop=false
}

Core.prototype.start = function() {
	this.canvas = document.getElementById("glcanvas");
	this.canvas.width=this.resx;
	this.canvas.height=this.resy;
	this.shouldStop=false;

	this.initWebGL(this.canvas);  
	var gl=this.gl;
	if (gl) {
		gl.e_core_var=this;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		this.initShaders();
		
		this.engine.core=this;
		this.engine.gl=gl;
		this.engine.onStart(gl);
		
		var tmpengine=this.engine;
		var tmpcanvas=this.canvas;
		this.keystatuses=[];
		
		var disobj=this;
		// engine events
		document.addEventListener("keydown",		function(e){ 
			if(	(disobj.keystatuses[e.keyCode] === undefined) ||
				(disobj.keystatuses[e.keyCode] === false)){
					disobj.keystatuses[e.keyCode]=true;
					tmpengine.onKeyDown(e);
			}
			tmpengine.onKeyTyped(e)
		});
		document.addEventListener("keyup",			function(e){  
			if( disobj.keystatuses[e.keyCode] === true ){
				disobj.keystatuses[e.keyCode]=false
				tmpengine.onKeyUp(e)
			}
		});
		//document.addEventListener("resize", 		function(e){  tmpengine.onResize(e)		});
		
		document.body.addEventListener("mousemove",	function(e){  
			var elemLeft = tmpcanvas.offsetLeft,
				elemTop = tmpcanvas.offsetTop;
			var x = event.pageX - elemLeft,
				y = event.pageY - elemTop;
			var mx = event.movementX, 
				my = event.movementY;
			tmpengine._internal_onMouseMove(x,y,mx,my);
		});
		
		this.canvas.addEventListener('click', function(event) {
			var elemLeft = tmpcanvas.offsetLeft,
				elemTop = tmpcanvas.offsetTop;
			var x = event.pageX - elemLeft,
				y = event.pageY - elemTop;
			tmpengine._internal_onClicked(x,y);

		}, false);
		
		var handlePointerLockChange=function(){
			if(document.pointerLockElement === tmpcanvas ||
				document.mozPointerLockElement === tmpcanvas) { // locked
				tmpengine._internal_onPointerLocked();
			} else {// unlocked
				tmpengine._internal_onPointerUnlocked();
			}
		}
		
		if ("onpointerlockchange" in document) {
			document.addEventListener('pointerlockchange', handlePointerLockChange, false);
		} else if ("onmozpointerlockchange" in document) {
			document.addEventListener('mozpointerlockchange', handlePointerLockChange, false);
		}

		
		
		
		
		
		this.checkSize=function(){
			//console.log(this.canvas.clientWidth+"  "+this.resx);
			if(window.innerWidth != this.tresx ||
			window.innerHeight != this.tresy ){
				var dis=this;
				
				dis.tresx=window.innerWidth; //this.canvas.clientWidth;
				dis.tresy=window.innerHeight; //this.canvas.clientHeight;
				
				clearTimeout(this.resizeTimeoutID);
				this.resizeTimeoutID = setTimeout(function(){
					dis.resx=window.innerWidth; //this.canvas.clientWidth;
					dis.resy=window.innerHeight; //this.canvas.clientHeight;
					//dis.canvas.width=dis.resx;
					//dis.canvas.height=dis.resy;
					dis.engine.onResize(dis.resx,dis.resy);
					
					dis.gl = dis.canvas.getContext("webgl");
					dis.gl.canvas.width=dis.resx;
					dis.gl.canvas.height=dis.resy;
					//dis.restart();
					
				}, 200);
				
				
			}
		};
		
		this.internalDraw=function() {
			for(var k=0;k<255;k++){
				if(disobj.keystatuses[k]!==undefined){
					if(disobj.keystatuses[k]===true){
						disobj.engine.onKeyDownTick(k) // pass VK code
					}
				}
			}
			disobj.checkSize();
			disobj.draw();
		}
		window.requestAnimationFrame(this.internalDraw);
	}
}

Core.prototype.restart= function(){
	var dis=this;
	this.stop(function(){ 
		var parent = dis.canvas.parentNode;
		var tmpengine = dis.engine;
		var newcanv = document.createElement("canvas");
		newcanv.style.position="fixed";
		newcanv.style.left="0"; 
		newcanv.style.top="0";
		newcanv.id="glcanvas";
		
		parent.removeChild(dis.canvas);
		parent.appendChild(newcanv);
		
		dis.empty();
		dis.engine=tmpengine;
		dis.start(); 
		var gl = dis.canvas.getContext("experimental-webgl"); 
		//gl.clear(); //.clearRect(0, 0, dis.canvas.width, dis.canvas.height);  
	}); 
	
}
Core.prototype.stop= function(callback){
	this.shouldStop=true;
	var dis=this;
	
	this.stopcallback=function(){dis.onStop(); callback(); };
}
Core.prototype.onStop = function(){

}
Core.prototype.initWebGL = function() {
  this.gl = null;

  try {
    this.gl = this.canvas.getContext("experimental-webgl");
  }catch(e) {

  }

  if (!this.gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}


Core.prototype.initShaders = function() {
	var gl=this.gl;
  var fragmentShader = this.getShader(gl, "shader-fs");
  var vertexShader = this.getShader(gl, "shader-vs");
	
  this.shaderProgram = gl.createProgram();
  gl.attachShader(this.shaderProgram, vertexShader);
  gl.attachShader(this.shaderProgram, fragmentShader);
  gl.linkProgram(this.shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(this.shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);

  vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(vertexNormalAttribute);
}

Core.prototype.getShader = function(gl, id) {
  var shaderScript = document.getElementById(id);

  if (!shaderScript) {
    return null;
  }

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  
  }

  gl.shaderSource(shader, theSource);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

Core.prototype.draw=function() {
	//console.log(this);
	if(this.shouldStop){
		if(this.stopcallback !== undefined){
			this.stopcallback();
		}
	}else{
		this.engine.onDraw(this.gl);
		var disobj=this;
		window.requestAnimationFrame(this.internalDraw);
	}
	
}

Core.prototype.fillColor=function(r,g,b,a){
	var gl=this.gl
	
	

	var pUniform = gl.getUniformLocation(this.shaderProgram, "fillColor");
	gl.uniform4f(pUniform,r,g,b,a);
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "fillcolorAvailable"), 1);

}

Core.prototype.setNoTexture=function(){
	var gl=this.gl
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "textureAvailable"), 0);
}


Core.prototype.setNoFillColor=function(){
	var gl=this.gl
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "fillcolorAvailable"), 0);
}
Core.prototype.setNoLighting=function(){
	var gl=this.gl
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "lightingAvailable"), 0);
}
Core.prototype.setSprite=function(spriteID){
	var gl=this.gl
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "spriteID"), spriteID);
}
Core.prototype.setTexture=function(tex,sprw,sprh){
	if(tex===undefined){
		this.setNoTexture();
		return;
	}
	if(!tex.loaded){
		this.setNoTexture();
	}else{
		var gl=this.gl;
		gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "textureAvailable"), 1);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tex.t);
		gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);
		if(sprw===undefined){
			sprw=tex.width
		}
		if(sprh===undefined){
			sprh=tex.height
		}
		gl.uniform2f(gl.getUniformLocation(this.shaderProgram, "imgSiz"), sprw, sprh);
		gl.uniform2f(gl.getUniformLocation(this.shaderProgram, "fullTexSiz"), tex.width, tex.height);
		this.setSprite(0);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		
		
	}
}

Core.prototype.setReflection=function(f){
var gl=this.gl
	gl.uniform1f(gl.getUniformLocation(this.shaderProgram, "lightMult"), f);
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "lightingAvailable"), 1);
}

Core.prototype.loadIdentity=function() {
  this.mvMatrix = Matrix.I(4);
}

Core.prototype.multMatrix=function(m) {
  this.mvMatrix = this.mvMatrix.x(m);
}

Core.prototype.mvTranslate=function(v) {
  this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}




Core.prototype.mvPushMatrix=function(m) {
  if (m) {
    this.mvMatrixStack.push(m.dup());
    this.mvMatrix = m.dup();
  } else {
    this.mvMatrixStack.push(this.mvMatrix.dup());
  }
}

Core.prototype.mvPopMatrix=function() {
  if (!this.mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  this.mvMatrix = this.mvMatrixStack.pop();
  return this.mvMatrix;
}

Core.prototype.mvRotate=function(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  this.multMatrix(m);
}


Core.prototype.mvScale=function(v) {
	var m = Matrix.create([
							[v[0],0,0],
							[0,v[1],0],
							[0,0,v[2]]
							]).ensure4x4();
	this.multMatrix(m);
}


Core.prototype.setMatrixUniforms = function(){
		// set matrix uniforms
		var gl=this.gl;
		  var pUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
		  gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

		  var mvUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
		  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));

		  var normalMatrix = this.mvMatrix.inverse();
		  normalMatrix = normalMatrix.transpose();
		  var nUniform = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
		  gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
}