


function deg2rad(deg) {
	return deg/180*Math.PI;
}
function rad2deg(rad) {
	return (rad/Math.PI)*180;
}


function v2fcos(a){
	return Math.floor(Math.cos(a)*100000000000)/100000000000;
}
function v2fsin(a){
	return Math.floor(Math.sin(a)*100000000000)/100000000000;
}
/*
function v2fcos(a){
	return parseFloat(Math.cos(a).toFixed(8));
}
function v2fsin(a){
	return parseFloat(Math.sin(a).toFixed(8));
}
*/
function vec2f(x,y){
	this.empty();
	var params=this.getxy(x,y);
	this.x=params[0];
	this.y=params[1];
	
}
function getxy(x,y){
	return vec2f.prototype.getxy(x,y);
}
function dist(v, y){
	var params=getxy(v,y);
	var vx=params[0];
	var vy=params[1];
	return Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2));
}
	
function ang2Vec2f(angle,dbg){
	var r=deg2rad(angle)
	var si=v2fsin(r)
	var co=v2fcos(r)
	var vecc=new vec2f(si,co);
	if(dbg!==undefined){
		console.log("A "+angle);
		console.log("B "+r);
		console.log("C "+si);
		console.log("D "+co);
		console.log("E "+vecc);
	}
  return vecc
}

vec2f.prototype = {
	empty: function(){
		this.x=0;
		this.y=0;
	},
	load: function(){
		
	},
	length: function(){
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
	},
	getxy: function(x,y){
		var vx=undefined;
		var vy=undefined;
		if(x!==undefined){
			if(typeof(x)==="object"){
				if(x[0]===undefined || x[1]===undefined){
					vx=x.x;
					vy=x.y;
				}else{
					vx=x[0];
					vy=x[1];
				}
			}else if(typeof(x)==="number" && y===undefined){
				vx=x;
				vy=x;
			}else if(typeof(x)==="number" && typeof(y)==="number"){
				vx=x;
				vy=y;
			}
		}
		return [vx,vy];
	},
	dist: function(v, y){
		var params=this.getxy(v,y);
		var vx=params[0];
		var vy=params[1];
		return Math.sqrt(Math.pow((vx-this.x),2)+Math.pow((vy-this.y),2));
	},
  
  ////////// to angle funcs
  
  
	toAngle: function(x2,y2){
		if(x2===undefined && y2===undefined){
			var d=this.length();
			return rad2deg(Math.atan2(this.y/d,this.x/d));
		}else{
			var params=this.getxy(x2,y2);
			var vx=params[0];
			var vy=params[1];
			var xx=vx-this.x;
			var yy=vy-this.y;
			var d=dist(xx,yy);
			return rad2deg(Math.atan2(yy/d,xx/d));
		}
	},
  
	forward: function(dbg){
		var fwd=this.toAngle()
		var targetang = fwd+90; // forward
		var av = ang2Vec2f(targetang,dbg);
		if(dbg!==undefined){
			console.log("A "+fwd);
			console.log("B "+targetang);
			console.log("C "+av);
		}
		return av
	},
  
	right: function(){
		var targetang = this.toAngle()+180; // to the right
		return ang2Vec2f(targetang);
	},
  
	getNormal: function(){ ////////////////////////////////////////////// new
		var siz = this.length();
		return new vec2f(this.x/siz,this.y/siz);
	},
  
	rotate: function(r){ // r for rotation //////////////////////////////////////// new
		//console.log("A "+r)
		var siz = this.length();
		var curang= this.toAngle();
		//console.log("B "+curang)
		curang-=r;
		//console.log("C "+curang)
    
		return ang2Vec2f(curang).mult(siz);
	},
  
	sub: function(vv,y){
		var v = new vec2f(vv,y);
		return new vec2f(this.x - v.x ,this.y - v.y);
	},
	add: function(vv,y){
		var v = new vec2f(vv,y);
		return new vec2f(this.x + v.x, this.y + v.y);
	},
	mult: function(vv,y){
		var v = new vec2f(vv,y);
		return new vec2f(this.x*v.x, this.y*v.y);
		
	},
	div: function(vv,y){
		var v = new vec2f(vv,y);
		return new vec2f(this.x/v.x, this.y/v.y);
	},
};



function vec2(x,y){
  return new vec2f(x,y);
}  

function dotproduct(v1,v2){
  return (v1.x*v2.x + v1.y*v2.y);
}


vec2f.prototype.constructor = vec2f;