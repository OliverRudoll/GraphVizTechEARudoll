import React, { Component } from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import Checkbox from 'react-simple-checkbox';

var i = 1;                     //  set your counter to 1

const Handle = Slider.Handle;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

export default class EA4_2 extends Component {

    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            constant: 1.0,
            parameter: 0.0,
            checked: true
        }
    }

    componentDidMount() {
        this.init();
    }

    handleCheckboxChange = (value) => {
        this.setState({ checked: value });

        if(value)
        {
            this.init();
        }
        else 
        {
            this.draw();
        }
    }

    changeConstant = (value) => {
        this.setState({ constant: value });
        if(!this.state.checked)
        {
            this.draw();
        }
    }

    changeParameter =  (value) => 
    {
        this.setState({parameter: value});

        if(!this.state.checked)
        {
            this.draw();
        }
    }

    draw = () => {

        try {
            var gl = this['webGLCanvas'].getContext('webgl');
            if (!gl) { throw "x"; }
        } catch (err) {
            throw "Your web browser does not support WebGL!";
        }
 
           // Pipeline setup.
           gl.clearColor(Math.random(0.2), Math.random(0.2), Math.random(0.2), 0.5);
           // Backface culling.
           gl.frontFace(gl.CCW);
           gl.enable(gl.CULL_FACE);
           gl.cullFace(gl.BACK);

           // Compile vertex shader. 
           var vsSource = '' + 
               'attribute vec3 pos;' + 
               'attribute vec4 col;' +
               'attribute float c;' + 
               'varying vec4 color;' + 
               'void main(){' + 'color = col;' + 
               'gl_Position = vec4(c * pos, 1);' +
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
           var containerObject = this.createVertexData(vertices, indicesLines, indicesTris);

           vertices = containerObject.vertices;
           indicesLines = containerObject.indicesLines;
           indicesTris = containerObject.indicesTris;

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

           var c = gl.getAttribLocation(prog, 'c');

           gl.vertexAttrib1f(c,this.state.constant);
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


    }

    createVertexData = (vertices, indicesLines, indicesTris) => {
        var n = 100;
        var m = 100;
        // Positions.
        vertices = new Float32Array(3 * (n+1) * (m+1));
        // Index data.
        indicesLines = new Uint16Array(2 * 2 * n * m);
        indicesTris  = new Uint16Array(3 * 2 * n * m);

        var dt = 10/n;
        var dr = 10/m;
        // Counter for entries in index array.
        var iLines = 0;
        var iTris = 0;

        // Loop angle t.
        for(var i=0, t=-Math.PI; i <= n; i++, t += dt) {
            // Loop radius r.
            for(var j=0, r=Math.PI; j <= m; j++, r += dr){

                 var u = t;
                 var v = r;

                var iVertex = i*(m+1) + j;

                var x = 2 * Math.sin(3* u)/(2 + Math.cos(v*this.state.parameter));
                var y = 2 * (Math.sin(u) + 2* Math.sin(2 *u*this.state.parameter))/(2 + Math.cos(v*this.state.parameter + 2 *Math.PI/3));    
                var z = (Math.cos(u) - 2 * Math.cos(2 * u)) * (2 + Math.cos(v)) * (2 + Math.cos(v + 2 * Math.PI))/4;

                

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

        return {vertices:vertices , 
            indicesLines:indicesLines , 
            indicesTris:indicesTris }
    } 

     myLoop = () => {

        setTimeout(() => {
            this.draw();
            this.changeParameter(this.state.parameter + 0.001);
            this.changeConstant(this.state.constant - 0.01);
            i++;

            if (this.state.checked) {
                if (i < 100000) {
                    this.myLoop();
                }
            } else {
                i = 0;
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
                    <h2>EA4 2 - Tranguloid Trefoil (with extra parameter)</h2>
                </div>

                <div className='rowC'>

                    <div className='canvasBox'>
                        <canvas ref={ref => this['webGLCanvas'] = ref} width='512px' height='512px'></canvas>
                    </div>
                </div>

                <div style={wrapperStyle}>
                            Zoom :
                                <Slider min={0.001} max={2.0} defaultValue={1.0} step={0.001} handle={handle} onChange={this.changeConstant} />
                        </div>

                        <div style={wrapperStyle}>
                            Parameter :
                                <Slider min={0.000001} max={4.0} defaultValue={0.0} step={0.000001} handle={handle} onChange={this.changeParameter} />
                        </div>

                        <div style={wrapperStyle}>
                    Animation on?
                        <Checkbox
                        id='Animation'
                        color='#884A88'
                        size='2'
                        checked={this.state.checked}
                        onChange={this.handleCheckboxChange}
                    />
                </div>

                <div style={{ position: 'relative', height: '30px' }}></div>
            </div>


        );
    }
}