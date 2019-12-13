// Author @oliverrudoll - 2019

//referencing to:
// Author @patriciogv - 2015
// Title: Truchet - 10 print

	precision mediump float;
			
			uniform sampler2D uTexture;
			
			varying vec2 vTextureCoord;
						
			varying vec3 vNormal;
			varying vec4 vPosition;
			
			
            uniform float uTime;

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

            const int MAX_DOTS = 100;

            struct Dot {
                vec2 center;
                float radius;
            };

            vec3 colorA = vec3(0.149,0.141,0.912);
            vec3 colorB = vec3(1.000,0.833,0.224);
    		
			// Phong illumination for single light source,
			// no ambient light.
			vec3 phong(vec3 p, vec3 n, vec3 v, LightSource l) {
			
				vec3 L = l.color;
			
				vec3 s = normalize(l.position - p);
				vec3 r = reflect(-s, n);
				
				float sn = max( dot(s,n), 0.0);
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

            float rand(vec2 co){
                        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            vec2 truchetPattern(in vec2 _st, in float _index){
                
                _index = fract(((_index-0.5)*2.0));
                
                if (_index > 0.75) {
                    _st = vec2(1.0) - _st;
                } else if (_index > 0.5) {
                    _st = vec2(1.0-_st.x,_st.y);
                } else if (_index > 0.25) {
                    _st = 1.0-vec2(1.0-_st.x,_st.y);
                }
                return _st;
            }
/*
            vec4 lerpVec4(vec4 a, mat4 b, float t)
            {
                return a + (b - a) * t;
            }*/
			
			void main() {
				// Calculate view vector.
				// For ortho projection:
				vec3 v = vec3(0,0,-1);
				
                float pct = abs(sin(uTime * 0.5));

				vec3 vNormal = normalize(vNormal);
				
                vec4 tColor = vec4(1.0,0.5,0,1);

                vec2 st = vec2(vTextureCoord.s * 2.0 * pct,vTextureCoord.t * 2.0 * pct);

                vec2 ipos = floor(st);  // integer
                vec2 fpos = fract(st);  // fraction

                vec2 tile = truchetPattern(fpos, rand( ipos )* pct);



                float color1ChannelProcedural = 0.0;

                    // Maze
                    /*color1ChannelProcedural = smoothstep(tile.x-0.3,tile.x,tile.y)-
                            smoothstep(tile.x,tile.x+0.3,tile.y);
*/

                    // Circles
                    color1ChannelProcedural = (step(length(tile),0.6 * pct) -
                              step(length(tile),0.4 * pct) ) +
                             (step(length(tile-vec2(1.)),0.6 * pct) -
                              step(length(tile-vec2(1.)),0.4 * pct) );

                    // Truchet (2 triangles)
                    // color1ChannelProcedural = step(tile.x,tile.y);

                    

                // Mix uses pct (a value from 0-1) to
                // mix the two colors
                vec3 colorProcedural = vec3(color1ChannelProcedural);

                tColor = vec4(mix(colorA, colorProcedural, pct),1.0);

                //light
				vec4 lighting = vec4( phong(vPosition.xyz, vNormal, v), 1.0);
				gl_FragColor = tColor * lighting;
			}