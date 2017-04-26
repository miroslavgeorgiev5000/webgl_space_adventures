
function GameEntity(GameWorldPtr,poss){
	if(poss===undefined){
		this.pos=new vec2f(0.5,0.5);
	}else{
		this.pos=poss;
	}
	this.ang=0.0;
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	var id = this.GameWorldPtr.AddEnt(this);
	if(id===-1){
		return;
	}
}

//GameEntity.prototype = Object.create(?.prototype);
GameEntity.prototype = {
	draw: function(){
		//this.ang=this.ang+1.0;
		var g=this.GamePtr;
		var gw=this.GameWorldPtr;
		g.pushMatrix();
			//g.fillColor(1,1,1,1);
			g.setNoFillColor();
			g.setSprite(g.tid_friendlyplane);
	
			gw.drawCenteredRect(this.pos.x,this.pos.y,1,1,this.ang);
		g.popMatrix();
	},
	Remove: function(){
		this.GameWorldPtr.ents[this.id]=undefined
		this.id=-1;
		delete this;
	}
};
GameEntity.prototype.constructor = GameEntity;

