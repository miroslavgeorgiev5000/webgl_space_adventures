



function GameWorld(GamePtr){
	this.viewpoint=[0,0];
	this.GamePtr=GamePtr;
	this.ptrPhysicsContext=new PhysicsContext(this);
	this.ents=[];
	this.maxents=512;
	this.ScrW=0;
	this.ScrH=12;
	this.SceneW=0;
	this.SceneH=0;
	
	this.first=true;
	this.CamPosX=0;
	this.CamPosY=0;
	this.MenuWidth=4;
	this.MenuHeight=1;
	
	this.TotalAsteroids=0;
	this.AsteroidLimit=100;
	this.lastAsteroidSpawn=0;
	
	
	this.timeScale=1.0
	this.targetSpeed=120
	this._timescale_factor=this.timeScale*this.targetSpeed
	this.dt=0
	this.lastframe=0
	this.drawqueue=[];
	this.drawqueuecount=0;
}
var tmpanglol=0;
//GameWorld.prototype = Object.create(Engine.prototype);
var lellel=1.988
var scalemult=0.0414*4;
GameWorld.prototype = {
	HandleSpawning: function(){
		if(this.lastAsteroidSpawn+0.020 < CurTime()){
			this.lastAsteroidSpawn=CurTime();
			if(this.TotalAsteroids<this.AsteroidLimit){
				var SposX = this.CamPosX-this.MenuWidth+randf(-this.ScrW/2,this.ScrW/2);  //spawn pos X
				var SposY = this.CamPosY-this.MenuHeight+randf(-this.ScrH/2,this.ScrH/2);
				new Asteroid(this,vec2(SposX,SposY));
				this.TotalAsteroids=this.TotalAsteroids+1
			}
		}
	},
	SetCamPos: function(v2f,v2f2){
		var v= vec2(v2f,v2f2);
		this.CamPosX=v.x*2+this.MenuWidth;
		this.CamPosY=v.y*2+this.MenuHeight;
	},
	GetCamPos: function(){
		return vec2(
			(this.CamPosX-this.MenuWidth)/2,
			(this.CamPosY-this.MenuHeight)/2);
	},
	EntExists: function(entID){
		if (entID===undefined){
			console.Log("Warning: EntExists(entID) - entID is undefuned");
			return false;
		}
		var tmpent=this.ents[entID];
		if (tmpent===undefined){
			return false;
		}
		return true
	},
	e:function(entID){
		if (entID===undefined){
			console.Log("Warning: e(entID) - entID is undefuned");
			return undefined;
		}
		return this.ents[entID];
	},
	_NextFreeEntID: function(){
		for(var k=0;k<this.maxents;k++){
			if(this.ents[k]===undefined){
				return k;
			}
		}
		return -1;
	},
	AddEnt(entity){
		if (entity===undefined){
			console.Log("Warning: AddEnt(entity) - entity is undefuned");
			return -1;
		}
		var id = this._NextFreeEntID();
		if(id===-1){
			console.log("Error: AddEnt(entity) - failed to add entity, no more IDs left");
			return id;
		}
		this.ents[id]=entity;
		return id;
	},
	setViewpoint: function(v2){
		this.viewpoint=v2;
	},
	/*drawRect:function(x,y,w,h,ang){
	
	},
	drawCenteredRect:function(x,y,w,h,ang){
	
	},*/
	drawRect: function(x,y,w,h,ang){
		if(ang===undefined){
			ang=0;
		}
		var g=this.GamePtr;
		g.pushMatrix();
			g.translate([2.0*x, 2.0*y, 0])
			g.rotate(90, [1, 0, 0]);
			g.rotate(ang, [0, 1, 0]);
			
			g.scale([w, 1, h]);
			g.setMatrixUniforms();
			g.tilemodel.draw();
		g.popMatrix();
	},
	drawCenteredRect: function(x,y,w,h,ang){
		if(ang===undefined){
			ang=0;
		}
		var g=this.GamePtr;
		g.pushMatrix();
			g.translate([2.0*x, 2.0*y, 0])
			g.rotate(90, [1, 0, 0]);
			g.rotate(ang, [0, 1, 0]);
			g.translate([-1.0*w, 0, 1.0*h])
			g.scale([w, 1, h]);
			g.setMatrixUniforms();
			g.tilemodel.draw();
		g.popMatrix();
	},
	
	
	draw: function(gl){
	//this.GamePtr.setMatrixUniforms();
		
		
		var g=this.GamePtr;
		var scrW=g.core.resx;
		var scrH=g.core.resy;
		if(this.first){
			this.first=false;
			this.lastframe=CurFrameTime()
			//this.CamPosX+=4;
			//this.CamPosY+=1;
		}
		this._timescale_factor=this.timeScale*this.targetSpeed
		this.dt=CurFrameTime()-this.lastframe
		this.lastframe=CurFrameTime()
		
		
		this.ptrPhysicsContext.tick();
		g.setNoLighting();
		g.pushMatrix();
			g.translate([0, 0, -0.4]);
			g.rotate(180, [0, 0, 1]);
			g.rotate(180, [0, 1, 0]);
			var uv=scrH/scrW;
			var uv2=1.0/uv;
			g.translate([-uv2*scalemult,-scalemult,0]);
			
			
			
			
			
			
			var BlocksToFitByY=this.ScrH;
			
			g.scale([scalemult/BlocksToFitByY, scalemult/BlocksToFitByY, 1]);
			var TILEWIDTHPX=scrH*(scalemult/lellel);
			
			this.ScrW=scrW/TILEWIDTHPX //+1
			this.SceneW=this.ScrW-this.MenuWidth
			this.SceneH=this.ScrH-this.MenuHeight
			//console.log(this.ScrW);
			
			this.HandleSpawning();
			
			
			
			
			///////////background
			g.setTime(CurFrameTime()-g.startTime); // pass time to shader
			g.pushMatrix();
				g.setNoFillColor();
				//g.setNoTexture()
				g.setTexture(g.tex_background);
				g.setRenderMode(RM_CUSTOMBACKGROUND);
				g.setCamPos(this.CamPosX,this.CamPosY);
				g.setSceneSize(this.SceneW,this.SceneH);
				this.drawRect(0,0,this.SceneW,this.SceneH);
			g.popMatrix();
			
			g.setRenderMode(RM_NORMAL);
			g.setNoFillColor();
			g.setTexture(g.tex_sprites,64,64);
			
			
			
			g.pushMatrix(); // world ents
				//console.log(this.CamPosX);
				g.translate([this.ScrW-this.CamPosX,this.ScrH-this.CamPosY,0]);
				
				
				
				
				
				var entslen=this.maxents;
				for(var k=0;k<entslen;k++){
					if(this.EntExists(k)){
						var ent=this.e(k);
						ent.draw();
					}
				}
			g.popMatrix();
			g.pushMatrix(); // UI
			
			//g.setTexture(g.tex_tile);
			
				g.setNoTexture();
				g.fillColor(0.8,0.8,0.8,1);
				this.drawRect(this.ScrW-this.MenuWidth,0,this.MenuWidth,this.ScrH);
				this.drawRect(0,this.ScrH-this.MenuHeight,this.ScrW-this.MenuWidth,this.MenuHeight);
				
				
				
				
				
				
				
				
				
			g.popMatrix();
		g.popMatrix();
	}
	
};
GameWorld.prototype.constructor = GameWorld;