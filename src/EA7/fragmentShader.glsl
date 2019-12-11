precision mediump float;
varying vec4 vColor;
vec4 ndcPos;
			
void main() {
	float ndcDepth = (2.0 * gl_FragCoord.z - gl_DepthRange.near - gl_DepthRange.far) / (gl_DepthRange.far - gl_DepthRange.near);
	ndcPos.z = ndcDepth;
	float clipDepth = ndcDepth / gl_FragCoord.w;
	gl_FragColor = vec4((clipDepth * 0.5) + 0.5); 
}