/*	precision mediump float;
			
			attribute vec3 aPosition;
			attribute vec3 aNormal;
			
			uniform mat4 uPMatrix;
			uniform mat4 uMVMatrix;
			uniform mat3 uNMatrix;
			uniform vec4 uColor;
			
			varying vec4 vColor;
			
			void main(){
				gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
				
				vec3 tNormal = uNMatrix * aNormal;
			
				vColor = uColor;
			}*/

attribute vec3 aPosition;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

varying vec4 position_;

void main(){

mat4 modelViewProjectionMatrix = uPMatrix * uMVMatrix;

gl_Position = modelViewProjectionMatrix * vec4(aPosition, 1.0);
position_ = modelViewProjectionMatrix * vec4(aPosition, 1.0);

}