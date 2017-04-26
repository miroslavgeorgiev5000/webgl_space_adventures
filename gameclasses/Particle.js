
function Particle(GameWorldPtr,poss,spritearr){
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	this.type="particle";
	
	this.pos=poss
	this.size=1;
	
	var spriteanim = new Animation(GameWorldPtr,spritearr,spritearr.length);
	spriteanim.animationType = AT_PLAYONCE
	spriteanim.fps = 5
	//spriteanim.framelength+=1
	var lel=this
	spriteanim.onEnd=function(o){lel.Remove()}
	this.spriteanim=spriteanim
	
	
	
	var id = this.GameWorldPtr.AddEnt(this);
	this.id=id;
	if(id===-1){
		return;
	}
}

Particle.prototype = quickOverwrite(Object.create(GameEntity.prototype),{
	draw: function(){
		var g=this.GamePtr;
		var spriteanim=this.spriteanim
		spriteanim.tick(); 
		if(spriteanim.finished){
			return
		}
		var gw=this.GameWorldPtr;
		var drawsize=this.size;
		var pos=this.pos
		var campos=gw.GetCamPos()
		var scenew=gw.SceneW/2
		var sceneh=gw.SceneH/2
		if(!(campos.x-scenew-drawsize<pos.x &&
			campos.x+scenew+drawsize>pos.x &&
			campos.y-sceneh-drawsize<pos.y &&
			campos.y+sceneh+drawsize>pos.y)){
				return;
			}
		//g.pushMatrix();
			//g.fillColor(1,1,1,0.5);
			g.setNoFillColor(); 
			g.setSprite(spriteanim.GetFrame());
			gw.drawCenteredRect(pos.x,pos.y,drawsize,drawsize,0);
		//g.popMatrix();
	},
});


Particle.prototype.constructor = Particle;