import React, { Component } from 'react';
import './ea4.css';

var i = 1;                     //  set your counter to 1

export default class EA4 extends Component {

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

           // Compile vertex shader. 
           var vsSource = '' + 
               'attribute vec3 pos;' + 
               'attribute vec4 col;' + 
               'varying vec4 color;' + 
               'void main(){' + 'color = col;' + 
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
           // Positions, Index data.
           var vertices, indicesLines, indicesTris;
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

           // Setup constant color.
           var colAttrib = gl.getAttribLocation(prog, 'col');

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
           gl.clear(gl.COLOR_BUFFER_BIT);

           // Setup rendering tris.
           gl.vertexAttrib4f(colAttrib, Math.random(0.5), Math.random(0.5),Math.random(0.5),1);
           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
           gl.drawElements(gl.TRIANGLES,
               iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

           // Setup rendering lines.
           gl.vertexAttrib4f(colAttrib, Math.random(0.5),Math.random(0.5),Math.random(0.5),1);
           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
           gl.drawElements(gl.LINES,
               iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

           function createVertexData(){
               var n = 50;
               var m = 50;
               // Positions.
               vertices = new Float32Array(3 * (n+1) * (m+1));
               // Index data.
               indicesLines = new Uint16Array(2 * 2 * n * m);
               indicesTris  = new Uint16Array(3 * 2 * n * m);

               var dt = /*2*Math.PI*/2/n;
               var dr = 2/m;
               // Counter for entries in index array.
               var iLines = 0;
               var iTris = 0;

               // Loop angle t.
               for(var i=0, t=-1; i <= n; i++, t += dt) {
                   // Loop radius r.
                   for(var j=0, r=-1; j <= m; j++, r += dr){

                       var iVertex = i*(m+1) + j;

                       var x = r;
                       var y = t;
                       var z = Math.pow(r,3) - 3 * r * Math.pow(t,2);

                       // Set vertex positions.
                       vertices[iVertex * 3] = x;
                       vertices[iVertex * 3 + 1] = y;
                       vertices[iVertex * 3 + 2] = z;

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

    

    myLoop = () => {           
        setTimeout(() => {   
             this.draw();          
           i++;                  
           if (i < 100000) {         
              this.myLoop();           
           }                
        }, 100)
     }

    init = () => {
        try {
            this.myLoop();            
        } catch (e) {
            alert("Error: " + e);
        }
    }
    render() {

        const wrapperStyle = { width: 400, margin: 10 };
        return (

            <div>
                <div>
                    <h2>EA4</h2>
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