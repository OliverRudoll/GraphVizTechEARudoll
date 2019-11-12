import React, { Component } from 'react';
import './ea4.css';

var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        '',
        'void main()',
        '{',
        '  fragColor = vertColor;',
        '  gl_Position = vec4(vertPosition, 0.0, 1.0);',
        '}'
    ].join('\n');

var fragmentShaderText =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        '  gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');


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

    shaderProgram = (gl, vs, fs) => {

        var prog = gl.createProgram();

        var addshader = function (type, source) {

            var s = gl.createShader((type === 'vertex') ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

            gl.shaderSource(s, source);

            gl.compileShader(s);

            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {

                alert("Could not compile " + type +
                    " shader:\n\n" + gl.getShaderInfoLog(s));

                throw "Could not compile " + type +
                " shader:\n\n" + gl.getShaderInfoLog(s);
            }

            gl.attachShader(prog, s);

        };

        addshader('vertex', vs);
        addshader('fragment', fs);

        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            throw "Could not link the shader program!";
        }
        return prog;
    }

    draw = () => {

        try {
            var gl = this['webGLCanvas'].getContext('webgl');
            if (!gl) { throw "x"; }
        } catch (err) {
            throw "Your web browser does not support WebGL!";
        }

        gl.clearColor(0.8, 0.8, 0.8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var prog = this.shaderProgram(gl, vertexShaderText, fragmentShaderText);


        /*
                var vertices =
                    [ // X, Y,       R, G, B
                    0.56, 0.88, 1.0, 1.0, 0.0,
                    -0.6, 0.6, 0.5, 0.0, 1.0,
                    0.6, -0.6, 0.1, 1.0, 0.8,
                    0.6, 0.6, 0.3, 0.9, 0.8,
                    -0.84, -0.19, 1.0, 0.2, 0.0,
                    0.6, -0.2, 0.3, 0.9, 0.8,
                    0.6, -0.6, 0.3, 0.9, 0.8,
                    -0.6, 0.6, 0.5, 0.0, 1.0,
                    0.56, 0.88, 1.0, 1.0, 0.0
                    ]
        */


        var color1 = [0.3, 0.9, 0.8, 1];
        var color2 = [1.0, 1.0, 0.0, 1];
        var color3 = [0.5, 0.3, 0.6, 1];
        var vertices = [];
        var colors = [];
        var normals = [];
        var across = 40;
        var down = 20;

        function addPoint(x, y, color) {
            var u = x / across;
            var v = y / down;
            var radius = Math.sin(v * Math.PI);
            var angle = u * Math.PI * 2;
            var nx = Math.cos(angle);
            var ny = Math.cos(v * Math.PI);
            //var nz = Math.sin(angle);
            
            vertices.push(
                nx * radius,   // x
                ny,            // y
                //nz * radius,   // z
                color[0], 
                color[1], 
                color[2]
                );  
            //normals.push(nx, ny, nz);
            //colors.push(color[0], color[1], color[2], color[3]);
        }

        for (var y = 0; y < down; ++y) {
            for (var x = 0; x < across; ++x) {
                // for each rect we need 6 points
                addPoint(x, y, color1);
                addPoint(x + 1, y, color2);
                addPoint(x, y + 1, color3);

                addPoint(x, y + 1, color1);
                addPoint(x + 1, y, color2);
                addPoint(x + 1, y + 1, color3);
            }
        }

        var triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var positionAttribLocation = gl.getAttribLocation(prog, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(prog, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);

        //
        // Main render loop
        //
        gl.useProgram(prog);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length/5); //the amount of vertices / positions minimum for triangle strip to see something is 3 

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