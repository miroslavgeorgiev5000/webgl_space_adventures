var globalgame

function quickOverwrite(o1,o2){
	for (var key in o2) {
		o1[key]=o2[key];
	}
	return o1;
}


function Game(){
	Engine.call(this);
	globalgame=this;
	this.started=false;
	this.ptrGameWorldObj=new GameWorld(this);
	/*for(var k=0;k<20;k++){
		new GameEntity(this.ptrGameWorldObj,vec2(0,k));
	}
	for(var k=1;k<20;k++){
		new GameEntity(this.ptrGameWorldObj,vec2(k,0));
	}
	for(var k=-1;k>-20;k--){
		new GameEntity(this.ptrGameWorldObj,vec2(k,0));
	}
	for(var k=-1;k>-20;k--){
		new GameEntity(this.ptrGameWorldObj,vec2(0,k));
	}*/
	
	
		
}
var blendfunc1=0
var blendfunc2=0
var ggl=undefined
Game.prototype = Object.create(Engine.prototype);
Game.prototype = quickOverwrite(Game.prototype,{
	
	toScreen: function(v3){
	
	},
	toWorld: function(v2){
	
	},
	
	onStart: function(gl){
		this.startTime=CurTime();
		/*if(this.started){
			return;
		}
		this.started=true;*/
		this.gl=gl;
		ggl=gl;
		//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		//gl.enable(gl.BLEND);
		//gl.disable(gl.DEPTH_TEST);
		
		
		/*gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST);*/
		blendfunc1=gl.ONE //gl.DST_ALPHA
		blendfunc2=gl.ONE_MINUS_SRC_ALPHA
		gl.blendFunc(blendfunc1,blendfunc2);
		gl.enable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST);
		
		//gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
		//gl.enable(gl.STENCIL_TEST);
		var urlstr="data/models/tile.obj";
		this.tilemodel= new ObjModel(new ObjReader(urlstr),gl);
		this.tilemodel.onLoad=function(){
			console.log("model loaded! ");
		}
		
		this.tex_sprites = new Texture("data/textures/po2/sprites.png",gl);
		
		this.tid_crate = 0;
		
		this.tidanim_explosion=[];
		for(var k=0;k<7;k++){
			this.tidanim_explosion[k] = 1+k;
		}
		
		this.tid_friendlyplane = 8;
		this.tid_fueltank = 9;
		this.tid_meteor = 10;
		this.tid_missile = 11;
		
		
		
		this.tidanim_plasma=[];
		for(var k=0;k<8;k++){
			this.tidanim_plasma[k] = 12+k;
		}
		
		this.tidanim_plasmaring=[];
		for(var k=0;k<6;k++){
			this.tidanim_plasmaring[k] = 20+k;
		}
		
		this.tid_wrench = 26;
		
		
		
		/////////////////////////////
		
		this.tex_background = new Texture("data/textures/po2/background_image_1_transparent.png",gl);
		
		
		
		
		
		
		
		this.tmpang=0;
		
		
		new Player(this.ptrGameWorldObj,vec2(0,0));
		new Asteroid(this.ptrGameWorldObj,vec2(5,5));
		
	},
	onDraw: function(gl){
		_SetFrameTime()
		gl.blendFunc(blendfunc1,blendfunc2);
		var c = this.core;
		gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		c.perspectiveMatrix = makePerspective(45, c.resx/c.resy, 0.1, 100.0);
		this.loadIdentity();
		//this.setReflection(1);
		this.tmpang=this.tmpang+1;
		//this.scale([c.resx/c.startresx,c.resy/c.startresy,1]);
		this.ptrGameWorldObj.draw(gl);
	},
	onPointerLocked: function(){
	
	},
	onPointerUnlocked: function(){
	
	},
	onClicked: function(x,y){
	var i = this.core.canvas; //document.getElementById("glcanvas");

	// go full-screen
	if (i.requestFullscreen) {
		i.requestFullscreen();
	} else if (i.webkitRequestFullscreen) {
		i.webkitRequestFullscreen();
	} else if (i.mozRequestFullScreen) {
		i.mozRequestFullScreen();
	} else if (i.msRequestFullscreen) {
		i.msRequestFullscreen();
	}
		//var a = document.getElementById("glcanvas");
		//a.requestFullscreen()
		//document.body.requestFullscreen();
		//this.ptrGameWorldObj.ents[0].Remove()
	},
	onMouseMove: function(x,y,mx,my){
		
	},
	onKeyDownTick: function(VKcode){
		
		if(VKcode===VK_D){
			var gwo=this.ptrGameWorldObj
			var phy=gwo.player.PhysObj
			var a = phy.ang
			//var ptrPhysicsContext = gwo.ptrPhysicsContext
			var tf = gwo._timescale_factor
			var dt = gwo.dt
			
			a=a+2*((tf*dt)/2)
			phy.ang=a;
		}
		if(VKcode===VK_A){
			var gwo=this.ptrGameWorldObj
			var phy=gwo.player.PhysObj
			var a = phy.ang
			//var ptrPhysicsContext = gwo.ptrPhysicsContext
			var tf = gwo._timescale_factor
			var dt = gwo.dt
			
			a=a-2*((tf*dt)/2)
			phy.ang=a;
		}
		if(VKcode===VK_W){
			var gwo=this.ptrGameWorldObj
			var ply=gwo.player
			var phy=ply.PhysObj
			//var ptrPhysicsContext = gwo.ptrPhysicsContext
			var tf = gwo._timescale_factor
			var dt = gwo.dt
			var a = phy.ang
			var f = ang2Vec2f(a)
			var physPerFrame=10*29*6;
			
			var timescale=tf*dt
			
			var fwdvel = vec2(f.x/physPerFrame,f.y/physPerFrame).mult(timescale).mult(1,-1);
			phy.vel=phy.vel.add(fwdvel)
			var fuelwaste=0.05;
			ply.fuel-=fuelwaste*timescale;
		}
		if(VKcode===VK_S){
			var gwo=this.ptrGameWorldObj
			var ply=gwo.player
			var phy=ply.PhysObj
			//var ptrPhysicsContext = gwo.ptrPhysicsContext
			var tf = gwo._timescale_factor
			var dt = gwo.dt
			var a = phy.ang
			var f = ang2Vec2f(a)
			var physPerFrame=10*29*6;
			
			var timescale=tf*dt
			
			var fwdvel = vec2(f.x/physPerFrame,f.y/physPerFrame).mult(timescale).mult(-1,1);
			phy.vel=phy.vel.add(fwdvel)
			var fuelwaste=0.05;
			ply.fuel-=fuelwaste*timescale;
		}
	},
	onKeyTyped: function(e){
		
	},
	onKeyDown: function(e){
		if(e.keyCode==VK_W) { // left
			var gwo=this.ptrGameWorldObj
			var ply=gwo.player
			ply.goingForward=true
		}
		if(e.keyCode==VK_S) { // left
			var gwo=this.ptrGameWorldObj
			var ply=gwo.player
			ply.goingBack=true
		}
	},
	onKeyUp: function(e){
		if(e.keyCode==VK_W) { // left
			var gwo=this.ptrGameWorldObj
			var ply=gwo.player
			ply.goingForward=false
		}
		if(e.keyCode==VK_S) { // left
			var gwo=this.ptrGameWorldObj
			var ply=gwo.player
			ply.goingBack=false
		}
	},
	onResize: function(newx, newy){
		console.log("resized");
	},
	
	///// custom
	
	setRenderMode: function(renderMode){
		var gl=this.gl
		gl.uniform1i(gl.getUniformLocation(this.core.shaderProgram, "rendermode"), Math.floor(renderMode));
	},
	setCamPos: function(v2f,v2f2){
		var gl=this.gl
		var a=getxy(v2f,v2f2)
		//console.log(a)
		var pUniform = gl.getUniformLocation(this.core.shaderProgram, "CamPos");
		gl.uniform2f(pUniform,a[0],a[1]);
	},
	setSceneSize: function(v2f,v2f2){
		var gl=this.gl
		var a=getxy(v2f,v2f2)
		//console.log(a)
		var pUniform = gl.getUniformLocation(this.core.shaderProgram, "SceneSize");
		gl.uniform2f(pUniform,a[0],a[1]);
	},
	
	setTime: function(t){
		var gl=this.gl
		
		var pUniform = gl.getUniformLocation(this.core.shaderProgram, "time");
		gl.uniform1f(pUniform,t);
	}
	
	
	
});
var RM_NORMAL=0
var RM_CUSTOMBACKGROUND=1
Game.prototype.constructor = Game;