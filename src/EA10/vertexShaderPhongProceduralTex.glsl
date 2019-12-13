			attribute vec3 aPosition;
			attribute vec3 aNormal;
			attribute vec2 aTextureCoord;

			uniform mat4 uPMatrix;
			uniform mat4 uMVMatrix;
			uniform mat3 uNMatrix;

			varying vec3 vNormal;
			varying vec4 vPosition;
			varying vec2 vTextureCoord;

			void main(){
				// Calculte vertex position in eye coordinates. 
				vec4 tPosition = uMVMatrix * vec4(aPosition, 1.0);
				// Calculate projektion.
				gl_Position = uPMatrix * tPosition;
	
				vec3 tNormal = normalize(uNMatrix * aNormal);
				tNormal = uNMatrix * aNormal;
				
				vPosition = tPosition;
				vNormal = tNormal;
				
				vTextureCoord = aTextureCoord;		
			}