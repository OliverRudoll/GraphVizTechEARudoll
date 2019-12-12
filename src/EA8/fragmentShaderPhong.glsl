precision mediump float;
 
varying vec3 vNormal;
varying vec4 vPosition;
 
// Material.
struct PhongMaterial {
    vec3 ka;
    vec3 kd;
    vec3 ks;
    float ke; 
};
uniform PhongMaterial material;
 
// Ambient light.
uniform vec3 ambientLight;
 
// Pointlights.
const int MAX_LIGHT_SOURCES = 8;

struct LightSource {
    bool isOn;
    vec3 position;
    vec3 color;
};
uniform LightSource light[MAX_LIGHT_SOURCES];
 

// Phong illumination for single light source,
// no ambient light.
vec3 phong(vec3 p, vec3 n, vec3 v, LightSource l) {
 
    vec3 L = l.color;
 
    vec3 s = normalize(l.position - p); //light
    vec3 r = reflect(-s, n); //
 
    float sn = max( dot(s,n), 0.0); //lambert

    float rv = max( dot(r,v), 0.0);
 
    vec3 diffuse = material.kd * L * sn;
 
    vec3 specular = material.ks * L * pow(rv, material.ke);
 
    return diffuse + specular;			
}
 
// Phong illumination for multiple light sources
vec3 phong(vec3 p, vec3 n, vec3 v) {
 
    // Calculate ambient light.
    vec3 result = material.ka * ambientLight;
 
    // Add light from all light sources.
    for(int j=0; j < MAX_LIGHT_SOURCES; j++){
        if(light[j].isOn){
            result += phong(p, n, v, light[j]);
        }
    }
    return result;
}
 
void main() {
    // Calculate view vector.
    vec3 v = normalize(-vPosition.xyz);
 
    vec3 vNormal = normalize(vNormal);
 
    gl_FragColor = vec4(phong(vPosition.xyz, vNormal, v), 1.0);
}