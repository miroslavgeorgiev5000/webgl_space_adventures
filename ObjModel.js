


function ObjModel(objreader,gl){
	this.empty();
	this.objreader=objreader;
	this.url=objreader.url;
	this.gl=gl;
	var disobj=this;
	this.objreader.onLoad=function(){
		disobj.load();
		if(!disobj.hasError){
			disobj.loaded=true;
		}
		disobj.onLoad();
	}
}

ObjModel.prototype.empty = function(){
	this.objreader;
	this.verticesBuffer;
	this.verticesColorBuffer;
	this.verticesIndexBuffer;
	this.verticesNormalBuffer;
	this.verticesTextureCoordBuffer;
	this.indexBufferSize;
	this.gl;
	this.loaded=false;
    this.url = "";
	this.hasError=false;
	this.strError="no error";
	this.onLoad=function(){};
}

ObjModel.prototype.load = function(){
	if(this.objreader.hasError){
		this.hasError=true;
		this.strError="ObjReader error: "+this.objreader.strError;
		return;
	}
	
	var gl=this.gl;
	
	// load vertices
	this.verticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
	var vertices = this.objreader.vertexes;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	
	// load normals
	this.verticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesNormalBuffer);
	var vertexNormals=this.objreader.normalpositions;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	
	
	// load UVs
	this.verticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureCoordBuffer);
	var textureCoordinates = this.objreader.texturepositions;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);
				

	// load indexes
	this.verticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
	var vertexIndices=this.objreader.faces;
	this.indexBufferSize=this.objreader.faces.length;
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		  new Uint16Array(vertexIndices), gl.STATIC_DRAW);
	
	
}


ObjModel.prototype.draw = function(){
	if(this.loaded){
		var gl=this.gl;
		var c=gl.e_core_var;
		
		
		// Draw 
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureCoordBuffer);
		gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesNormalBuffer);
		gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
		gl.drawElements(gl.TRIANGLES, this.indexBufferSize, gl.UNSIGNED_SHORT, 0);
	}
}



