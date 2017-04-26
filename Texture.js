
function Texture(url,gl){
	this.empty();
	this.url=url;
	this.gl=gl;
	this.load();
}

Texture.prototype.empty = function(){
	this.gl;
	this.url="";
	this.onLoad=function(){}
	this.t;
	this.img;
	this.loaded=false;
	this.width=0;
	this.height=0;
}

Texture.prototype.load = function(){
	this.t = this.gl.createTexture();
	this.img = new Image();
	
	var disobj=this;
	this.img.onload = function() { 
		var gl = disobj.gl;
		gl.bindTexture(gl.TEXTURE_2D, disobj.t);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, disobj.img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		disobj.width=disobj.img.width;
		disobj.height=disobj.img.height;
		disobj.loaded=true;
		disobj.onLoad();
	}
	this.img.src = this.url;

}