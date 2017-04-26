<!doctype html>
<html>
	<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	
	<script>
	function CurTime(){
		return ((new Date).getTime()/1000.0);
	}
	var curframetime=0;
	function _SetFrameTime(){
		curframetime = ((new Date).getTime()/1000.0);
	}
	function CurFrameTime(){
		return curframetime;
	}
	
	function quickOverwrite(o1,o2){
		for (var key in o2) {
			o1[key]=o2[key];
		}
		return o1;
	}
	
	function randint(a,b){
		var range=a-b
		return Math.floor(Math.random()*range+b);
	}
	
	function randf(a,b){
		var range=a-b
		return Math.random()*range+b;
	}
	function clamp(v,a,b){
		return Math.min(Math.max(v,a),b)
	}
	</script>
	<script src="sylvester.js" type="text/javascript"></script>
	<script src="vec2f.js" type="text/javascript"></script>
	<script src="glUtils.js" type="text/javascript"></script>
	<script src="ObjReader.js" type="text/javascript"></script>
	<script src="ObjModel.js" type="text/javascript"></script>
	<script src="Texture.js" type="text/javascript"></script>
	<script src="Animation.js" type="text/javascript"></script>
	<script src="Core.js" type="text/javascript"></script>
	<script src="Engine.js" type="text/javascript"></script>
	<script src="Game.js" type="text/javascript"></script>
	<script src="PhysicsContext.js" type="text/javascript"></script>
	<script src="vkCodes.js" type="text/javascript"></script>
	
	<!----   -->
	<script src="gameclasses/GameWorld.js" type="text/javascript"></script>
	<script src="gameclasses/GameEntity.js" type="text/javascript"></script>
	<script src="gameclasses/PhysObj.js" type="text/javascript"></script>
	<script src="gameclasses/Asteroid.js" type="text/javascript"></script>
	<script src="gameclasses/Player.js" type="text/javascript"></script>
	<script src="gameclasses/Particle.js" type="text/javascript"></script>


	
		<script id="shader-fs" type="x-shader/x-fragment">
		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;

		uniform int textureAvailable;
		uniform int fillcolorAvailable;
		uniform int lightingAvailable;
		uniform int rendermode;
		uniform int spriteID;
		uniform sampler2D uSampler;
		uniform highp float lightMult;
		uniform highp float time;
		uniform highp vec2 CamPos;
		uniform highp vec2 SceneSize;
		uniform highp vec2 imgSiz;
		uniform highp vec2 fullTexSiz;
		uniform highp vec4 fillColor;
		
		/*mediump vec4 allOrNothing(mediump vec4 clr){
			if(clr.a != 1.0){
				return vec4(0.0,0.0,0.0,0.0);
			}
			return clr;
		}*/
		mediump vec4 alphacalc(mediump vec3 clr,mediump vec4 overlayclr){
			if(overlayclr.a<0.0){
				return vec4(0.0,0.0,0.0,0.0);
			}
			if(overlayclr.a>=1.0){
				return vec4(overlayclr.rgb,1.0);
			}
			return vec4((1.0-overlayclr.a)*clr+overlayclr.rgb*overlayclr.a,overlayclr.a);
		}
		
		mediump vec4 multfill(mediump vec4 clr,mediump vec4 overlayclr){
			return vec4(clr.rgb*overlayclr.rgb,clr.a*overlayclr.a);
		}
		
		mediump vec4 tint(mediump vec4 clr,mediump vec4 overlayclr){
			return vec4((1.0-overlayclr.a*clr.a)*clr.rgb+overlayclr.rgb*(overlayclr.a*clr.a),overlayclr.a*clr.a);
		}
		
		void main(void) {
			if(rendermode==0){
//				const mediump float alpha=0.1;
//				mediump vec2 x = fract(vTextureCoord);
//				mediump vec2 x_ = clamp(0.5/alpha*x, 0.0, 0.5) +
//						  clamp(0.5/alpha*(x-1.0)+0.5, 0.0, 0.5);
				/*mediump vec4 texelColor = texture2D(uSampler, 
					floor(vec2(vTextureCoord.s, vTextureCoord.t)*64.0)/64.0
				
				);*/
				
				/*mediump vec4 texelColor = texture2D(uSampler, 
					floor(vec2(vTextureCoord.s, vTextureCoord.t)*imgSiz)/imgSiz
				);*/
				mediump float f_spriteID=float(spriteID);
				//mediump vec2 vttmp=floor(vec2(vTextureCoord.s, vTextureCoord.t)*imgSiz)/imgSiz;
				mediump vec2 vttmp=floor(vec2(vTextureCoord.s, vTextureCoord.t)*imgSiz)/imgSiz;
				mediump vec2 singletex=fullTexSiz/imgSiz;
				mediump float tmpy = floor(f_spriteID/singletex.x);
				mediump float tmpx = f_spriteID-tmpy*singletex.x;
				mediump vec2 clrpos = (vec2(tmpx,tmpy)+(vttmp))/singletex;
				
				
				mediump vec4 texelColor = texture2D(uSampler, 
					clrpos //
				);
				
				//spriteID
				texelColor=texelColor-vec4(1.0-texelColor.a);
				if(textureAvailable==1){
					if(fillcolorAvailable==1){
						if(lightingAvailable==1){
							mediump vec4 asd = vec4(texelColor.rgb * vLighting*vec3(lightMult),texelColor.a);
							gl_FragColor=alphacalc(gl_FragColor.rgb,multfill(asd,fillColor));
						}else{
							gl_FragColor = alphacalc(gl_FragColor.rgb,multfill(texelColor,fillColor));
						}
					}else{
						if(lightingAvailable==1){
							mediump vec4 asd = vec4(texelColor.rgb * vLighting*vec3(lightMult),texelColor.a);
							gl_FragColor=alphacalc(gl_FragColor.rgb,asd);
						}else{
							gl_FragColor=alphacalc(gl_FragColor.rgb,(texelColor));
						}
					}
				}else{
					if(fillcolorAvailable==1){
						if(lightingAvailable==1){
							mediump vec4 asd = vec4(vLighting*vec3(lightMult), 1.0); 
							gl_FragColor=alphacalc(gl_FragColor.rgb,multfill(asd,fillColor));
						}else{
							gl_FragColor=vec4(alphacalc(gl_FragColor.rgb,fillColor).rgb,1.0);
							//gl_FragColor = fillColor;
						}
					}else{
						gl_FragColor = vec4(0.0,0.0,0.0,1.0);
					}
				}
			}else if(rendermode==1){ // custom background
				highp float uv = SceneSize.x/SceneSize.y;
				highp float tinyMult=1.0+cos((time*60.0)/10.0)/90.0;
				//time
				for(int k=1;k<4;k++){
					if(k==2){
						tinyMult=1.0+sin((time*60.0)/10.0)/60.0;
					}
					if(k==3){
						tinyMult=1.0+cos((time*60.0)/10.0)/50.0;
					}
					highp float k_flt=float(k);
					highp float speedmul=0.05;
					highp float sizemul=(0.5/k_flt);
					
					mediump vec4 texelColor = texture2D(uSampler, ceil(vec2(
					(vTextureCoord.s*uv)/sizemul+(CamPos.x+tinyMult)*speedmul, 
					(vTextureCoord.t)/sizemul   +(CamPos.y+tinyMult)*speedmul)*255.0)/255.0);
					gl_FragColor=alphacalc(gl_FragColor.rgb,texelColor);
				}
				
				//gl_FragColor = vec4(texelColor.rgb*texelColor.a,1.0); //vec4(1.0,0.0,0.0,1.0);
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
			//highp vec3 directionalLightColor = vec3(0.3, 0.3, 0.3);
			highp vec3 directionalLightColor = vec3(0.0, 0.0, 0.0);
			highp vec3 directionalVector = vec3(-0.85, 0.8, -0.75);

			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			//highp vec4 transformedNormal = vec4(aVertexNormal, 1.0);
			highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = (ambientLight + (directionalLightColor * directional));
		}
	</script>


	<!--------------------------------------------------------------------------->


	</head>

	<body onload="new Core(new Game())"
		style="oveflow:hidden;">
		<canvas id="glcanvas"
		style="position:fixed; left:0; top:0;">
			Your browser doesn't support webgl.
		</canvas>
	</body>
</html>
