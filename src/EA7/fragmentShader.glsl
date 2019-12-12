precision mediump float;
varying vec4 position_;

void main()
{   

float depth = ((position_.z / position_.w) + 1.0) * 0.5;

gl_FragColor = vec4(depth, depth, depth, 1.0);
}