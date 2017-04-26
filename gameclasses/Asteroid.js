
function Asteroid(GameWorldPtr,poss){
	this.PhysObj=new PhysObj(GameWorldPtr,poss,0);
	
	var strength=randint(16,48); //Math.floor(Math.random()*32+16);
	this.PhysObj.health=strength
	this.PhysObj.maxhealth=strength
	this.PhysObj.size=strength/(29*4);
	
	this.PhysObj.ang=randint(0,360);
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	this.type="asteroid";
	var id = this.GameWorldPtr.AddEnt(this);
	this.id=id;
	if(id===-1){
		return;
	}
}

Asteroid.prototype = quickOverwrite(Object.create(GameEntity.prototype),{
	draw: function(){
		var g=this.GamePtr;
		var gw=this.GameWorldPtr;
		var campos=gw.GetCamPos()
		var scenew=gw.SceneW/2
		var sceneh=gw.SceneH/2
		var drawsize=this.PhysObj.size*4.3;
		var pos=this.PhysObj.pos
		if(!(campos.x-scenew-drawsize<pos.x &&
			campos.x+scenew+drawsize>pos.x &&
			campos.y-sceneh-drawsize<pos.y &&
			campos.y+sceneh+drawsize>pos.y)){
				return;
			}
		//g.pushMatrix();
			//g.fillColor(1,1,1,0.5);
			g.setNoFillColor();
			g.setSprite(g.tid_meteor);
			gw.drawCenteredRect(pos.x,pos.y,drawsize/1.6,drawsize,this.PhysObj.ang);
		//g.popMatrix();
		
	},
});


Asteroid.prototype.constructor = Asteroid;