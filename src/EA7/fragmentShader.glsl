precision mediump float;

/*
varying vec4 vColor;

void main()
{             

	float ndcDepth =
    (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far) /
    (gl_DepthRange.far - gl_DepthRange.near);
float clipDepth = ndcDepth / gl_FragCoord.w;
gl_FragColor = vec4((clipDepth * 0.5) + 0.5); 

//gl_FragColor = vColor;

}*/

varying vec4 position_;

void main()
{   

float depth = ((position_.z / position_.w) + 1.0) * 0.5;

gl_FragColor = vec4(depth, depth, depth, 1.0);
}