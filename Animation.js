
// AT = Animation Type
var AT_LOOP=0
var AT_PLAYONCE=1

function Animation(GameWorldPtr,texanim_arr,tex_num){ // gameworld pointer, array of textures, number of textures in array
	this.type="Animation"
	this.GamePtr=GameWorldPtr.GamePtr;
	this.GameWorldPtr=GameWorldPtr;
	
	this.animationType=AT_LOOP;
	this.finished=false
	this.onEnd=function(disobj){console.log(disobj+" finished")}
	
	
	this.framelength=tex_num;
	this.curframe=0;
	
	this.frames=texanim_arr;
	this.fps=20;
	this.accumulatedDT=0;
	this.first=true;
}

Animation.prototype = quickOverwrite({},{
	normalizeFrame:function(fnum){
		var framelength=this.framelength
		var tmp = fnum/framelength
		var tmp2=tmp-Math.floor(tmp)
		return tmp2*framelength;
	},
	GetFrame:function(){
		var out=undefined
		if(this.frames!==undefined
			&& this.curframe !== undefined){
			out=this.frames[this.curframe];
		}
		return out;
	},
	tick: function(){
		if(this.finished){
			return 
		}
		if(this.first){
			this.first=false;
		}
		
		var anims = this.anims;
		
		var maxents = this.GameWorldPtr.maxents;
		var friction=0.990;
		
		var tmpadt=this.accumulatedDT
		var fps=this.fps
		var gwo=this.GameWorldPtr
		var tf = gwo._timescale_factor
		var dt = gwo.dt
		var adt= (tf*dt)*(fps/tf)
		tmpadt=tmpadt+adt
		 
		var framespassed = Math.floor(tmpadt)
		
		if(this.animationType===AT_PLAYONCE && 
			tmpadt>this.framelength){
			this.onEnd(this);
			this.curframe=undefined
			this.finished=true
			return 
		}
		
		var curframe = this.normalizeFrame(framespassed)
		//tmpadt = tmpadt
		
		this.curframe=curframe
		this.accumulatedDT=tmpadt
		
	},
});


Animation.prototype.constructor = Animation;