attribute vec3 aPosition;
attribute vec3 aNormal;
 
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat3 uNMatrix;
 
varying vec3 vNormal;
varying vec4 vPosition;
 
void main(){
    // Calculate vertex position in eye coordinates. 
    vec4 tPosition = uMVMatrix * vec4(aPosition, 1.0);
    // Calculate projektion.
    gl_Position = uPMatrix * tPosition;
 
    vec3 tNormal = normalize(uNMatrix * aNormal);
 
    vPosition = tPosition;
    vNormal = tNormal;
}

/*
attribute vec3 aVertexPosition; // vertex position
attribute vec3 aVertexNormal; // vertex normal

uniform mat4 upvmMatrix; // the project view model matrix

uniform float uOutlineWidth; // width of the outline

void main(void) {
    gl_Position = upvmMatrix * vec4(aVertexPosition + aVertexNormal * uOutlineWidth, 1.0);
}
*/