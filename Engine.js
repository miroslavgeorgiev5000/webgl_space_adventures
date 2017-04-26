

function Engine(){
	this.empty();
}

Engine.prototype.empty = function(){
	this.gl;
	this.core;
	
	this.anim=[];
	this.animframe=0;
	this.flag
	this.wood
	
	this.lastframetime =0;
	this.lastfps = 0;
	this.lastanimtime= 0;
	
	this.cubeRotationX = 0.0;
	this.cubeRotationY = 0.0;
	this.lastCubeUpdateTime = 0;

	this.posoffset=[0.0,0.0,0.0];
	this.pointerLockedPos=[0,0];
	this.mousePos=[0,0];
	this.pointerLocked=false;
	this.pointerLockAvailable = 'pointerLockElement' in document ||
		'mozPointerLockElement' in document ||
		'webkitPointerLockElement' in document;
}

// local funcs
Engine.prototype.lockPointer = function(){
	if(this.pointerLockAvailable && !this.pointerLocked){
		var e = this.core.canvas;
		e.requestPointerLock = e.requestPointerLock ||
					 e.mozRequestPointerLock ||
					 e.webkitRequestPointerLock;
		e.requestPointerLock();
	}
}

Engine.prototype.unlockPointer = function(){
	if(this.pointerLockAvailable && this.pointerLocked){
		document.exitPointerLock = document.exitPointerLock ||
					   document.mozExitPointerLock ||
					   document.webkitExitPointerLock;
		document.exitPointerLock();
	}
}
Engine.prototype.clamp = function(v,min,max){
	if(v<min){return min;}
	if(v>max){return max;}
	return v;
}
Engine.prototype.translate = function(vec){
	this.core.mvTranslate(vec)
}
Engine.prototype.rotate = function(ang,vec){
	this.core.mvRotate(ang,vec)
}
Engine.prototype.scale = function(vec){
	this.core.mvScale(vec)
}
Engine.prototype.pushMatrix = function(){
	this.core.mvPushMatrix();
}
Engine.prototype.popMatrix = function(){
	this.core.mvPopMatrix();
}
Engine.prototype.loadIdentity = function(){
	this.core.loadIdentity();
}
Engine.prototype.ScrX = function(){
	return this.core.resx;
}
Engine.prototype.ScrY = function(){
	return this.core.resy;
}
Engine.prototype.setReflection = function(n){
	this.core.setReflection(n)
}
Engine.prototype.setTexture = function(tex,w,h){
	this.core.setTexture(tex,w,h)
}
Engine.prototype.setSprite = function(id){
	this.core.setSprite(id)
}
Engine.prototype.setNoTexture = function(){
	this.core.setNoTexture()
}
Engine.prototype.setNoLighting = function(){
	this.core.setNoLighting()
}
Engine.prototype.setNoFillColor = function(){
	this.core.setNoFillColor()
}
Engine.prototype.fillColor = function(r,g,b,a){
	this.core.fillColor(r,g,b,a)
}
Engine.prototype.setMatrixUniforms = function(){
	this.core.setMatrixUniforms();
}

// internal events

Engine.prototype._internal_onMouseMove = function(x,y,mx,my){
	this.mousePos=[x,y];
	if(this.pointerLocked){
		this.pointerLockedPos[0]+=mx;
		this.pointerLockedPos[1]+=my;
	}
	this.onMouseMove(x,y,mx,my);
}
Engine.prototype._internal_onClicked = function(x,y){
	this.mousePos=[x,y];
	this.onClicked(x,y);
}
Engine.prototype._internal_onPointerLocked = function(){
	this.pointerLocked=true;
	this.onPointerLocked();
}
Engine.prototype._internal_onPointerUnlocked = function(){
	this.pointerLocked=false;
	this.onPointerUnlocked();
}

// implementable events

Engine.prototype.onPointerLocked = function(){
}
Engine.prototype.onPointerUnlocked = function(){
}
Engine.prototype.onClicked = function(x,y){
	if(!this.pointerLocked){
		this.lockPointer();
	}
}
Engine.prototype.onMouseMove = function(x,y,mx,my){
	if(this.pointerLocked){
		this.cubeRotationX += mx;
		this.cubeRotationY += my;
		//this.cubeRotationX=this.clamp(this.cubeRotationX,-90,90);
		this.cubeRotationY=this.clamp(this.cubeRotationY,-90,90);
	}
}
Engine.prototype.onKeyDownTick = function(VKcode){

}
Engine.prototype.onKeyTyped = function(e){

}
Engine.prototype.onKeyDown = function(e){
	if(e.keyCode==VK_LEFT) { // left
		this.posoffset[0]+=0.2;
	}
	if(e.keyCode==VK_UP) { // up
		this.posoffset[2]+=0.2;
	}
	if(e.keyCode==VK_RIGHT) { // right
		this.posoffset[0]-=0.2;
	}
	if(e.keyCode==VK_DOWN) { // down
		this.posoffset[2]-=0.2;
	}
	
	if(e.keyCode==VK_SPACE){
		this.unlockPointer();
	}
	console.log(e.keyCode);

}
Engine.prototype.onKeyUp = function(e){

} 
Engine.prototype.onResize = function(newx, newy){
	console.log("resized");
} 


Engine.prototype.onStart = function(gl){
	var gl=this.gl;
	for(var k=0;k<28;k++){
		var objid=k+1;
		var urlstr="http://electricity256.com/stuff/models/newnewflag_fixt_"+objid+".obj"
		this.anim[k]= new ObjModel(new ObjReader(urlstr),gl);
		this.anim[k].onLoad=function(){
			console.log("model "+objid+"/28 loaded! ");
		}
	}
	
	var model_url="http://electricity256.com/stuff/models/cube1.obj";
	console.log("loading model "+model_url);
	this.objtmp 		= new ObjReader(model_url);
	this.objmdltmp 	= new ObjModel(this.objtmp,gl);
	this.objmdltmp.onLoad=function(){
		console.log("model loaded! ");
	}

	this.wood = new Texture("http://electricity256.com/stuff/models/512wood_texture.jpg",gl);
	this.flag = new Texture("http://electricity256.com/stuff/models/flagtexture3.jpg",gl);
}

Engine.prototype.onDraw = function(gl){
	var c=this.core;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var ratio=c.resy/c.resx
	c.perspectiveMatrix = makePerspective(45, ratio, 0.1, 100.0);

	this.loadIdentity();

	
	this.scale([1, 1, 1]);
	this.translate([(c.resx/c.startresx-1)*8, 0.0, -12.0]);
	this.rotate(this.cubeRotationY, [1, 0, 0]);
	this.rotate(this.cubeRotationX, [0, 1, 0]);
	this.translate(this.posoffset);
	this.setReflection(1);
	
	this.pushMatrix();
		this.translate([1.305, 0.0, 0.0]);
		this.rotate(10, [0, 0, -1]);
		this.translate([0.0, -1.6, 0.0]);
		this.scale([0.05,3,0.05]);
		
		this.setTexture(this.wood);
		this.setMatrixUniforms();
		this.objmdltmp.draw();
	this.popMatrix();
  
	this.pushMatrix();
		this.translate([1.3, 0.3, 0]);
		this.rotate(90, [0, -1, 0]);
		this.rotate(100, [-1, 0, 0]);
		this.rotate(180, [0, 0, 1]);

		this.setTexture(this.flag);
		this.setMatrixUniforms();
		this.anim[this.animframe].draw();
	this.popMatrix();

	var currentTime = (new Date).getTime();
	
	if(currentTime>this.lastanimtime+20){
		this.lastanimtime=currentTime;
		this.animframe++;
		if(this.animframe>=28){
			this.animframe=0;
		}
	}
  
	if (this.lastCubeUpdateTime) {
		var delta = currentTime - this.lastCubeUpdateTime;
		
		//this.cubeRotation += (30 * delta) / 1000.0;
		if(currentTime>this.lastframetime+200){
			this.lastfps=Math.floor((this.lastfps+Math.floor(1000/delta))/2);
			//fpsdiv.innerHTML=""+this.lastfps;
			this.lastframetime=currentTime;
		}
		
	}

	this.lastCubeUpdateTime = currentTime;
}

