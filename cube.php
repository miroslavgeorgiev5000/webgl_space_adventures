
<!doctype html>
<html>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	
    <script src="sylvester.js" type="text/javascript"></script>
    <script src="glUtils.js" type="text/javascript"></script>
    <script src="ObjReader.js" type="text/javascript"></script>
    <script src="ObjModel.js" type="text/javascript"></script>
    <script src="Texture.js" type="text/javascript"></script>
    <script src="Core.js" type="text/javascript"></script>
    <script src="Engine.js" type="text/javascript"></script>
	
	

    <script id="shader-fs" type="x-shader/x-fragment">
		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;

		uniform sampler2D uSampler;
		uniform int textureAvailable;
		uniform highp float lightMult;

		void main(void) {
			mediump vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
			if(textureAvailable==1){
				gl_FragColor = vec4(texelColor.rgb * vLighting*vec3(lightMult), texelColor.a);
			}else{
				gl_FragColor = vec4(vLighting, 1.0);
			}
		}
    </script>
	

    <script id="shader-vs" type="x-shader/x-vertex">
		attribute highp vec3 aVertexNormal;
		attribute highp vec3 aVertexPosition;
		attribute highp vec2 aTextureCoord;

		uniform highp mat4 uNormalMatrix;
		uniform highp mat4 uMVMatrix;
		uniform highp mat4 uPMatrix;

		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;

		void main(void) {
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
			vTextureCoord = aTextureCoord;

			// Apply lighting effect

			highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
			highp vec3 directionalLightColor = vec3(0.3, 0.3, 0.3);
			highp vec3 directionalVector = vec3(-0.85, 0.8, -0.75);

			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			//highp vec4 transformedNormal = vec4(aVertexNormal, 1.0);
			highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = (ambientLight + (directionalLightColor * directional));
		}
    </script>
	
	
	<!--------------------------------------------------------------------------->
	

  </head>

  <body onload="new Core(new Engine())">
    <canvas id="glcanvas">
      Your browser doesn't appear to support the <code>&lt;canvas&gt;</code> element.
    </canvas>
	<div>fps: <span id="fpsdiv">-1</div></div>
	<textarea  style="width:635px;height:300px;" id="dbg"></textarea>
	
		<script>
	function readFile(url,callback){
			var rawFile = new XMLHttpRequest();
			rawFile.open("GET", url, true);
			rawFile.onreadystatechange = function (){
				if(rawFile.readyState === 4){
					var allText = rawFile.responseText;
					callback(allText);
				}
			}
			rawFile.send();
		}
	
	function appendTextarea(str){
		var dbgarea = document.getElementById("dbg");
		dbgarea.value = dbgarea.value+"\n"+str;
	}

var fpsdiv;
fpsdiv=document.getElementById("fpsdiv");
	
	</script>
  </body>
</html>


	  
	  