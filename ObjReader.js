	
	


function ObjReader (url) {
	this.empty();
    this.url = url;
    this.request(url);
}

function ObjReader (url,onLoad) {
	this.empty();
    this.url = url;
	this.onLoad=onLoad;
    this.request(url);
}

ObjReader.prototype.empty = function(){
	this.raw="";
	this.loaded=false;
    this.url = "";
	this.vertexes=[];
	this.vertexcount=0;
	this.texturepositions=[]; // not loaded yet
	this.normalpositions=[];// not loaded yet
	
	
	this.hasTexturePositions=false;
	this.hasNormalPositions=false;
	
	this.faces=[];
	this.textureindexes=[];
	this.normalindexes=[];
	
	this.hasError=false;
	this.strError="no error";
	
	this.hasWarnings=false;
	this.strWarnings="";
	
	this.onLoad=function(){};
}
ObjReader.prototype.isNumber = function(i){
	return !((parseFloat(i)+"")==="NaN");
}
ObjReader.prototype.requestcallback = function(data){
	this.raw=data;
	this.load();
	if(!this.hasError){
		this.loaded=true;
	}
	this.onLoad();
}
ObjReader.prototype.request = function(url){
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", url, true);
	var tmpdis=this;
	rawFile.onreadystatechange = function (){
		if(rawFile.readyState === 4){
			var allText = rawFile.responseText;
			tmpdis.requestcallback(allText);
		}
	}
	rawFile.send();
}

ObjReader.prototype.load = function(){
	var vertexes=[];
	var vertexcount=0;
	var faces=[];
	var facecount=0;
	var textureindexes=[];
	
	var normalvertices=[];
	var normalverticescount=0;
	
	var texturevertices=[];
	var textureverticescount=0;
	
	var normalindexes=[];
	var hasTextureCoordinates=false;
	var hasNormalVertexes=false;
	var firstface=true;
	var lines = this.raw.split("\n");
	for(var k=0;k<lines.length;k++){
		var params = lines[k].split(" ");
		for(var a=0;a<params.length;a++){ // remove double blank spaces
			if(params[a]===""){
				params.splice(a,1);
				a--;
			}
		}
		
		if(params[0]==="v"){
			vertexes.push.apply(vertexes, [parseFloat(params[1]),parseFloat(params[2]),parseFloat(params[3])]);
			vertexcount++;
		}
		if(params[0]==="vn"){
			normalvertices.push.apply(normalvertices, [[parseFloat(params[1]),parseFloat(params[2]),parseFloat(params[3])]]);
			normalverticescount++;
		}
		if(params[0]==="vt"){
			if(k<50){
				console.log(params);
			}
			texturevertices.push.apply(texturevertices, [[parseFloat(params[1]),parseFloat(params[2])]]);
			textureverticescount++;
		}
		
		// https://en.wikipedia.org/wiki/Wavefront_.obj_file#Vertex_Indices
		// standard: "Each face can contain three or more elements."
		// For now, in this implementation, a face can contain only 3 elements, which makes it non-standard
		if(params[0]==="f"){  // i.e. "f 134/119/1 135/120/1 120/105/1"
			var faceindexes=[];
			var texindexes=[];
			var normindexes=[];
			for(var a=1;a<4;a++){  // i.e. "134/119/1" in "f 134/119/1 135/120/1 120/105/1"
				var eachIndex = params[a].split("/");
				if(eachIndex[0]==""){  // i.e. "134" in "134/119/1"
					this.hasError=true;
					this.strError="index not provided, line "+k+" : "+lines[k];
					return;
				}
				
				if(!this.isNumber(eachIndex[0])){ // i.e. if parseFloat("134") === "NaN"
					this.hasError=true;
					this.strError="index is not a number, line "+k+", parameter "+a+"[0] : "+lines[k];
					return;
				}
				
				if(firstface){ // set the profile. if the first element has a certain valid index, then all elements which follow are required to have it.
					if(eachIndex.length > 1 && eachIndex[1]!="" && this.isNumber(eachIndex[1])){
						hasTextureCoordinates=true;
					}
					if(eachIndex.length > 2 && eachIndex[2]!="" && this.isNumber(eachIndex[2])){
						hasNormalVertexes=true;
					}
					
					firstface=false;
				}
				
				faceindexes[a-1]=parseInt(eachIndex[0])-1;
				
				if(hasTextureCoordinates){
					if(eachIndex.length > 1 && eachIndex[1]!="" && this.isNumber(eachIndex[1])){
						texindexes[a-1]=parseInt(eachIndex[1])-1;
					}else{
						this.hasWarnings=true;
						this.strWarnings+="Element present elsewhere, but missing here, line "+k+", parameter "+a+"[1] : "+lines[k]+"\n";
					}
				}
				
				if(hasNormalVertexes){
					if(eachIndex.length > 2 && eachIndex[2]!="" && this.isNumber(eachIndex[2])){
						normindexes[a-1]=parseInt(eachIndex[2])-1;
					}else{
						this.hasWarnings=true;
						this.strWarnings+="Element present elsewhere, but missing here, line "+k+", parameter "+a+"[2] : "+lines[k]+"\n";
					}
				}
				
			}
			faces.push.apply(faces, faceindexes);
			if(hasTextureCoordinates){
				textureindexes.push.apply(textureindexes, texindexes);
			}
			if(hasNormalVertexes){
				normalindexes.push.apply(normalindexes, normindexes);
			}
			facecount++;
		}
	}
	
	
	this.hasTexturePositions=hasTextureCoordinates;
	this.hasNormalPositions=hasNormalVertexes;
	
	//if(hasTextureCoordinates){
		this.textureindexes=textureindexes;

	//if(hasNormalVertexes){
		this.normalindexes=normalindexes;

	this.vertexes=vertexes;
	this.normalpositions=this.rasterizeIBO(normalvertices,this.normalindexes,faces);
	this.texturepositions=this.rasterizeIBO(texturevertices,this.textureindexes,faces);
	this.faces=faces;
	
	//console.log(normalvertices);
	//console.log(this.normalpositions);
	
}


ObjReader.prototype.rasterizeIBO = function(verts,indexes,vertindex){
	var out = [];
	for(var k=0;k<indexes.length;k++){
		//out.push.apply(out, verts[indexes[k]]);
		//console.log(vertindex[k]);
		out[vertindex[k]]=verts[indexes[k]];
	}
	var out2 = [];
	for(var k=0;k<indexes.length;k++){
		out2.push.apply(out2, out[k]);
	}
	return out2;
}