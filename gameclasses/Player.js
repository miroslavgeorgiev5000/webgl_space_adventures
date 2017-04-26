
function Player(GameWorldPtr,poss){
	this.PhysObj=new PhysObj(GameWorldPtr,poss,0);
	
	this.PhysObj.health=100
	this.PhysObj.maxhealth=100
	this.PhysObj.size=0.3;
	this.fuel=100
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	var plasmaarr=this.GamePtr.tidanim_plasma
	
	var flameanim = new Animation(GameWorldPtr,plasmaarr,8);
	//flameanim.animationType = AT_PLAYONCE
	flameanim.fps = 10
	this.flameanim=flameanim
	
	this.ringSpawnTime=CurTime()
	this.goingForward=false
	this.goingBack=false
	
	if(GameWorldPtr.player!==undefined){
		GameWorldPtr.ents[GameWorldPtr.player.id]=undefined
	}
	GameWorldPtr.player=this;
	
	this.type="player";
	var id = this.GameWorldPtr.AddEnt(this);
	this.id=id;
	if(id===-1){
		return;
	}
}


Player.prototype = quickOverwrite(Object.create(GameEntity.prototype),{
	spawnPlasmaRings:function(pos,pos2){
		var PlasmaRingDelay=0.04;
		if(CurFrameTime()>this.ringSpawnTime+PlasmaRingDelay){
			this.ringSpawnTime=CurFrameTime()
			var gwo=this.GameWorldPtr
			var plasmaring=this.GamePtr.tidanim_plasmaring
			var pa = new Particle(gwo,pos,plasmaring);
			var pb = new Particle(gwo,pos2,plasmaring);
			pa.spriteanim.fps=2
			pb.spriteanim.fps=2
			
		}
	},
	tick: function(){
		//console.log("lol");
		var gw=this.GameWorldPtr;
		gw.SetCamPos(this.PhysObj.pos) 
		this.flameanim.tick();
	},
	draw: function(){
		var g=this.GamePtr;
		//g.pushMatrix();
			var gw=this.GameWorldPtr;
			var drawsize=this.PhysObj.size*4;
			var pos=this.PhysObj.pos
			//g.fillColor(1,1,1,0.5);
			g.setNoFillColor();
			
			
			var flametexture=this.flameanim.GetFrame();
			
			if(this.goingForward && !this.goingBack){
				var flameOffset=vec2(0.8,0.97)
				var flameOffset2=vec2(0.8,-0.94)
				//var flameOffset=vec2(0.8,1)
				//var flameOffset2=vec2(0.8,-1)
				var RelativePositionMult=0.171
				var FlameRatioMult=(8/24)
				var RelativeSizeMult=0.7 //0.22
				var relativeSize=drawsize*RelativeSizeMult
				var tmpflame1pos= flameOffset.rotate(this.PhysObj.ang).mult(vec2(drawsize*RelativePositionMult))
				var tmpflame2pos= flameOffset2.rotate(this.PhysObj.ang).mult(vec2(drawsize*RelativePositionMult))
				var flame1pos= tmpflame1pos.add(pos)
				var flame2pos= tmpflame2pos.add(pos)
				
				g.setSprite(flametexture);
				gw.drawCenteredRect(
					flame1pos.x,
					flame1pos.y,
					relativeSize, //relativeSize*FlameRatioMult,
					relativeSize,
					this.PhysObj.ang);
				gw.drawCenteredRect(
					flame2pos.x,
					flame2pos.y,
					relativeSize, //relativeSize*FlameRatioMult,
					relativeSize, //relativeSize,
					this.PhysObj.ang);
					
				this.spawnPlasmaRings(flame1pos,flame2pos);
			}else if(!this.goingForward && this.goingBack){
				var flameOffset=vec2(-0.7,0.97)
				var flameOffset2=vec2(-0.7,-0.94)
				var RelativePositionMult=0.171
				var FlameRatioMult=(8/24)
				var RelativeSizeMult=0.7 //0.22
				var relativeSize=drawsize*RelativeSizeMult
				var tmpflame1pos= flameOffset.rotate(this.PhysObj.ang).mult(vec2(drawsize*RelativePositionMult))
				var tmpflame2pos= flameOffset2.rotate(this.PhysObj.ang).mult(vec2(drawsize*RelativePositionMult))
				var flame1pos= tmpflame1pos.add(pos)
				var flame2pos= tmpflame2pos.add(pos)
				
				g.setSprite(flametexture);
				gw.drawCenteredRect(
					flame1pos.x,
					flame1pos.y,
					relativeSize, //relativeSize*FlameRatioMult,
					-relativeSize, //-relativeSize,
					this.PhysObj.ang);
				gw.drawCenteredRect(
					flame2pos.x,
					flame2pos.y,
					relativeSize, //relativeSize*FlameRatioMult,
					-relativeSize, //-relativeSize,
					this.PhysObj.ang);
				this.spawnPlasmaRings(flame1pos,flame2pos);
			}
			g.setSprite(g.tid_friendlyplane);
			gw.drawCenteredRect(pos.x,pos.y,drawsize,drawsize,this.PhysObj.ang);
			
			 
		//g.popMatrix();
	},
});


Player.prototype.constructor = Player;