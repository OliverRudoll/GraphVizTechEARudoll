import React, { Component } from 'react';
import './ea5.css';

export default class EA5 extends Component {

    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
        }
    }

    componentDidMount() {
        this.init();
    }

    draw = () => {

        try {
            var gl = this['webGLCanvas'].getContext('webgl');
            if (!gl) { throw "x"; }
        } catch (err) {
            throw "Your web browser does not support WebGL!";
        }
 
           
            // Pipeline setup.
            gl.clearColor(.95, .95, .95, 1);
            // Backface culling.
            gl.frontFace(gl.CCW);
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            // Depth(Z)-Buffer.
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);    
            // Polygon offset of rastered Fragments.
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(0.5, 0);           
 
            // Compile vertex shader. 
            var vsSource = '' + 
                'attribute vec3 pos;' + 
                'attribute vec3 col;' + 
                'varying vec4 color;' + 
                'void main(){' +
                'color = vec4(col.z, col.z, col.z, 1);' + 
                'gl_Position = vec4(pos, 1);' +
                '}';
            var vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vsSource);
            gl.compileShader(vs);
 
            // Compile fragment shader.
            var fsSouce = 'precision mediump float;' + 
                'varying vec4 color;' + 
                'void main() {' + 
                'gl_FragColor = color;' + 
                '}';
            var fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fsSouce);
            gl.compileShader(fs);
 
            // Link shader together into a program.
            var prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.bindAttribLocation(prog, 0, "pos");
            gl.linkProgram(prog);
            gl.useProgram(prog);
 
            // Vertex data.
            // Positions, Normals, Index data.
            var vertices, normals, indicesLines, indicesTris;
            // Fill the data arrays.
            createVertexData();
 
            // Setup position vertex buffer object.
            var vboPos = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
            gl.bufferData(gl.ARRAY_BUFFER,
                vertices, gl.STATIC_DRAW);
            // Bind vertex buffer to attribute variable.
            var posAttrib = gl.getAttribLocation(prog, 'pos');
            gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT,
                false, 0, 0);
            gl.enableVertexAttribArray(posAttrib);
 
            // Setup normal vertex buffer object.
            var vboNormal = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vboNormal);
            gl.bufferData(gl.ARRAY_BUFFER,
                normals, gl.STATIC_DRAW);
            // Bind buffer to attribute variable.
            var colAttrib = gl.getAttribLocation(prog, 'col');
            gl.vertexAttribPointer(colAttrib, 3, gl.FLOAT,
                false, 0, 0);
            gl.enableVertexAttribArray(colAttrib);
 
            // Setup constant color.
            //var colAttrib = gl.getAttribLocation(prog, 'col');
 
            // Setup lines index buffer object.
            var iboLines = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                indicesLines, gl.STATIC_DRAW);
            iboLines.numberOfElements = indicesLines.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
 
            // Setup tris index buffer object.
            var iboTris = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                indicesTris, gl.STATIC_DRAW);
            iboTris.numberOfElements = indicesTris.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
 
            // Clear framebuffer and render primitives.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
            // Setup rendering tris.
            // gl.vertexAttrib4f(colAttrib, 0, 1, 1, 1);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.drawElements(gl.TRIANGLES,
                iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
 
            // Setup rendering lines.
            gl.disableVertexAttribArray(colAttrib);
            gl.vertexAttrib3f(colAttrib, 0, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.drawElements(gl.LINES,
                iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
 
            function createVertexData(){
                var n = 100;
                var m = 100;
 
                // Positions.
                vertices = new Float32Array(3 * (n+1) * (m+1));
                // Normals.
                normals = new Float32Array(3 * (n+1) * (m+1));                                
                // Index data.
                indicesLines = new Uint16Array(2 * 2 * n * m);
                indicesTris  = new Uint16Array(3 * 2 * n * m);
 
                var du = /*2 * Math.PI/*/2/n;
                var dv = /*Math.PI/*/2/m;
                var r = 1;
                // Counter for entries in index array.
                var iLines = 0;
                var iTris = 0;
 
                // Loop angle u.
                for(var i=0, u=-1; i <= n; i++, u += du) {
                    // Loop angle v.
                    for(var j=0, v=-1; j <= m; j++, v += dv) {
 
                        var iVertex = i*(m+1) + j;
 /*
                        var x = r * Math.sin(v) * Math.cos(u);
                        var y = r * Math.sin(v) * Math.sin(u);
                        var z = r * Math.cos(v);*/

                        var x = u;
                        var y = v;
                        var z = Math.pow(u,3) - 3 * u * Math.pow(v,2);
 
                        // Set vertex positions.
                        vertices[iVertex * 3] = x;
                        vertices[iVertex * 3 + 1] = y;
                        vertices[iVertex * 3 + 2] = z;
 
                        // Calc and set normals.
                        var vertexLength = Math.sqrt(x*x+y*y+z*z);
                        normals[iVertex * 3] = x/vertexLength;
                        normals[iVertex * 3 + 1] = y/vertexLength;
                        normals[iVertex * 3 + 2] = z/vertexLength;
 
                        // Set index.
                        // Line on beam.
                        if(j>0 && i>0){
                            indicesLines[iLines++] = iVertex - 1;
                            indicesLines[iLines++] = iVertex;
                         }
                        // Line on ring.
                        if(j>0 && i>0){
                            indicesLines[iLines++] = iVertex - (m+1);                            
                            indicesLines[iLines++] = iVertex;
                        }                   
 
                        // Set index.
                        // Two Triangles.
                        if(j>0 && i>0){
                            indicesTris[iTris++] = iVertex;
                            indicesTris[iTris++] = iVertex - 1;
                            indicesTris[iTris++] = iVertex - (m+1);
                            //                            
                            indicesTris[iTris++] = iVertex - 1;
                            indicesTris[iTris++] = iVertex - (m+1) - 1;                            
                            indicesTris[iTris++] = iVertex - (m+1);                            
                        }
                    }
                }
            }    
    }

    init = () => {
        try {
            this.draw();
        } catch (e) {
            alert("Error: " + e);
        }
    }
    render() {

        const wrapperStyle = { width: 400, margin: 10 };
        return (

            <div>
                <div>
                    <h2>EA5</h2>
                </div>

                <div className='rowC'>
                    <div className='canvasBox'>
                        <canvas ref={ref => this['webGLCanvas'] = ref} width='512px' height='512px'></canvas>
                    </div>
                </div>
                <div style={{ position: 'relative', height: '30px' }}></div>
            </div>


        );
    }
}