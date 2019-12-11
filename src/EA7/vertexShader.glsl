precision mediump float;
			
varying vec3 aPosition;
attribute vec3 aNormal;
			
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat3 uNMatrix;

uniform vec4 uColor;
			
varying vec4 vColor;
			
void main(){
	float displacement = sin(aPosition.x) * sin(aPosition.z);			
    vec3 newPosition = aPosition + displacement * vec3(0.0, 1.0, 0.0);
 
    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
 
    vec3 tNormal = uNMatrix * aNormal;
 
    vColor = uColor;
}