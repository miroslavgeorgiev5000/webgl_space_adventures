
function PhysicsContext(GameWorldPtr){
	
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	this.dt=0;
	this.lastframe=0;
	 
}
var debugfps=false
var lastdebgtime=0
PhysicsContext.prototype = quickOverwrite({},{
	tick: function(){
		//console.log(this.dt)
		
		var friction=0.992;
		
		var tf = this.GameWorldPtr._timescale_factor
		var dt = this.GameWorldPtr.dt
		//// I HAVE CLINICAL DEPRESSION
		if(debugfps === true){
			if(CurFrameTime()>lastdebgtime){
				lastdebgtime=CurFrameTime()+1
				console.log(Math.floor(1/dt))
			}
			
		}
		
		var ents = this.GameWorldPtr.ents;
		
		var maxents = this.GameWorldPtr.maxents;
		
		var stillPossibleToHaveCollisions=true;
		while(stillPossibleToHaveCollisions){
			stillPossibleToHaveCollisions=false;
			for (var k=0;k<maxents;k++) {
			
				var e1=ents[k];
				
				if(e1===undefined){
					continue;
				}
				var phy1=e1.PhysObj
				if(phy1===undefined){
					continue;
				}
				var vel1=phy1.vel
				var settleLimit=0.00000000001;
				var tmpphyssettled=false;
				if(((vel1.x>settleLimit) || (vel1.x<-settleLimit)) || 
				((vel1.y>settleLimit) || (vel1.y<-settleLimit))){
					phy1.physSettled=false;
				}else{
					tmpphyssettled=true;
				}
				if(phy1.physSettled){
					continue;
				}
				var pos1=phy1.pos
				
				pos1=pos1.add(vel1.mult(dt*tf))
				vel1=(vel1).mult(Math.pow(friction,(dt*tf)))
				
				var id1=e1.id
				this.GameWorldPtr.ents[id1].PhysObj.vel=vel1
				this.GameWorldPtr.ents[id1].PhysObj.pos=pos1
				
				if(e1.tick!==undefined){
					e1.tick();
				}
				
				
				
				
				for (var v=0;v<maxents;v++) {
					var e2=ents[v];
					if(e1===undefined || e2===undefined){
						continue;
					}
					var phy2=e2.PhysObj
					if(phy1===undefined || phy2===undefined){
						continue;
					}
					if(e1.id===e2.id){
						continue;
					}
					var pos2=phy2.pos
					var siz1=phy1.size
					var siz2=phy2.size
					
					if(pos1.dist(pos2)<(siz1+siz2)){
						stillPossibleToHaveCollisions=true;
						this.onCollision(e1,e2);
					}
				}
				
				//var e1=ents[k];
				//var phy1=e1.PhysObj
				//var vel1=phy1.vel
				
				phy1.physSettled=tmpphyssettled;
				//if((((vel1.x>settleLimit) || (vel1.x<-settleLimit)) || 
				//((vel1.y>settleLimit) || (vel1.y<-settleLimit)))){
				//}else{
				//	phy1.physSettled=true;
				//}
			}
		}
	},
	onCollision: function(ent1,ent2){
		var tf = this.GameWorldPtr._timescale_factor
		var dt = this.GameWorldPtr.dt
		var phy1=ent1.PhysObj
		var phy2=ent2.PhysObj
		var pos1=phy1.pos
		var pos2=phy2.pos
		var vel1=phy1.vel
		var vel2=phy2.vel
		var siz1=phy1.size
		var siz2=phy2.size
		var health1=phy1.health
		var health2=phy2.health
		var bounce1=phy1.bouncelvl
		var bounce2=phy2.bouncelvl
	
		var ColInters = (pos1.sub(pos2)).div(2)
		var vtmp=pos1.sub(pos2);
		var forward= vtmp.forward();
		
		var tempposk=vec2(pos1)
		
        var offset=0;
		health1-=vel1.length()*2
		health2-=vel2.length()*2
		
		var velocityLoss=0.7
		var newvel = clamp( ((siz1+siz2) - pos1.dist(pos2))/(dt*tf)*velocityLoss,0,0.03);
		
		
		pos1=pos2.add(forward.mult(siz1+siz2+offset).mult(1,-1))
		pos2=tempposk.add(forward.mult(siz1+siz2+offset).mult(-1,1))
		
		// i should probably temporarily store phy1's vel
		var extradiv=130
		vel1=vel1.add(forward.mult(bounce1/2).mult(6).mult(1,-1).mult(newvel)).add(vel2.div(12))
		vel2=vel2.add(forward.mult(bounce2/2).mult(6).mult(-1,1).mult(newvel)).add(vel1.div(12))
		
		
		var id1=ent1.id
		var id2=ent2.id
		
		phy1.pos=pos1
		phy2.pos=pos2
		phy1.vel=vel1
		phy2.vel=vel2
		phy1.health=health1
		phy2.health=health2
		
		phy1.physSettled=false;
		phy2.physSettled=false;
       
	},
});


PhysicsContext.prototype.constructor = PhysicsContext;