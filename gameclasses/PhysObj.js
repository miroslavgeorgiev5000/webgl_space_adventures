////// phys types
	var PT_NONE		=	0
	var PT_SOLID	=	1
//////



function PhysObj(GameWorldPtr,poss,ang){
	this.pos=poss;
	this.vel=new vec2f(0,0);
	this.size=1
	this.ang=ang;
	this.bouncelvl=0.5;
	this.health=30;
	this.maxhealth=30;
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	this.type="physobj";
	this.phystype=PT_SOLID;
	this.physSettled=false;
}

//PhysObj.prototype = Object.create(GameEntity.prototype);
PhysObj.prototype = {
	draw: function(){
		/*var g=this.GamePtr;
		var gw=this.GameWorldPtr;
		g.fillColor(1,1,1,1);
		g.setTexture(g.tex_meteor);
		gw.drawCenteredRect(this.pos[0],this.pos[1],1,1,this.ang);*/
	}
};
PhysObj.prototype.constructor = PhysObj;