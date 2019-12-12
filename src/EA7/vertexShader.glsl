attribute vec3 aPosition;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

varying vec4 position_;

void main(){

mat4 modelViewProjectionMatrix = uPMatrix * uMVMatrix;

gl_Position = modelViewProjectionMatrix * vec4(aPosition, 1.0);
position_ = modelViewProjectionMatrix * vec4(aPosition, 1.0);

}