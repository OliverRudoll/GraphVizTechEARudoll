import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import { Container, Row, Col } from 'reactstrap';
import HashMap from 'hashmap';

import './ea3.css';

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


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
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


export default class EA2 extends Component {

    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            eventKey: " ",
            xMin: -1.0, xMax: 1.0, yMin: -1.0, yMax: 1.0,
            vertexContainer1: { vertex: { x: 0.56, y: 0.88, r: 1.0, g: 1.0, b: 0.0 }, colorManipulator: -0.5 },
            vertexContainer2: { vertex: { x: -0.6, y: 0.6, r: 0.5, g: 0.0, b: 1.0 }, colorManipulator: 0.0 },
            vertexContainer3: { vertex: { x: 0.6, y: -0.6, r: 0.1, g: 1.0, b: 0.8 }, colorManipulator: 0.0 },
            vertexContainer4: { vertex: { x: 0.6, y: 0.6, r: 0.3, g: 0.9, b: 0.8 }, colorManipulator: 0.0 },
            vertexContainer5: { vertex: { x: -0.84, y: -0.19, r: 1.0, g: 0.2, b: 0.0 }, colorManipulator: -0.5 }
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

    attributeSetFloats = (gl, prog, attr_name, rsize, arr) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr),
            gl.STATIC_DRAW);
        var attr = gl.getAttribLocation(prog, attr_name);
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);
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



        var triangleVertices =
            [ // X, Y,       R, G, B
                this.state.vertexContainer1.vertex.x, this.state.vertexContainer1.vertex.y, this.state.vertexContainer1.vertex.r, this.state.vertexContainer1.vertex.g, this.state.vertexContainer1.vertex.b,
                this.state.vertexContainer2.vertex.x, this.state.vertexContainer2.vertex.y, this.state.vertexContainer2.vertex.r, this.state.vertexContainer2.vertex.g, this.state.vertexContainer2.vertex.b,
                this.state.vertexContainer3.vertex.x, this.state.vertexContainer3.vertex.y, this.state.vertexContainer3.vertex.r, this.state.vertexContainer3.vertex.g, this.state.vertexContainer3.vertex.b,
                this.state.vertexContainer4.vertex.x, this.state.vertexContainer4.vertex.y, this.state.vertexContainer4.vertex.r, this.state.vertexContainer4.vertex.g, this.state.vertexContainer4.vertex.b,
                this.state.vertexContainer5.vertex.x, this.state.vertexContainer5.vertex.y, this.state.vertexContainer5.vertex.r, this.state.vertexContainer5.vertex.g, this.state.vertexContainer5.vertex.b
            ];

        var triangleVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

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
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);

    }

    init = () => {
        try {
            this.draw();
        } catch (e) {
            alert("Error: " + e);
        }
    }

    handleKeyDown = (key) => {

        this.setState(
            {
                eventKey: key
            })

        if (key === '?') {
            console.log('? pressed ! ')
        }
    }

    changeXV1 = (value) => {
        this.state.vertexContainer1.vertex.x = value;
        this.draw();
    }

    changeYV1 = (value) => {
        this.state.vertexContainer1.vertex.y = value;
        this.draw();
    }

    changeXV2 = (value) => {
        this.state.vertexContainer2.vertex.x = value;
        this.draw();
    }

    changeYV2 = (value) => {
        this.state.vertexContainer2.vertex.y = value;
        this.draw();
    }


    changeXV3 = (value) => {
        this.state.vertexContainer3.vertex.x = value;
        this.draw();
    }

    changeYV3 = (value) => {
        this.state.vertexContainer3.vertex.y = value;
        this.draw();
    }

    changeXV4 = (value) => {
        this.state.vertexContainer4.vertex.x = value;
        this.draw();
    }

    changeYV4 = (value) => {
        this.state.vertexContainer4.vertex.y = value;
        this.draw();
    }

    changeXV5 = (value) => {
        this.state.vertexContainer5.vertex.x = value;
        this.draw();
    }

    changeYV5 = (value) => {
        this.state.vertexContainer5.vertex.y = value;
        this.draw();
    }


    changeColorV1 = (value) => {
        this.state.vertexContainer1.colorManipulator = value;

        this.state.vertexContainer1.vertex.r = 1 - this.state.vertexContainer1.colorManipulator;
        this.state.vertexContainer1.vertex.g = 1 - this.state.vertexContainer1.colorManipulator;
        this.state.vertexContainer1.vertex.b = 0 + this.state.vertexContainer1.colorManipulator;

        this.draw();
    }

    changeColorV2 = (value) => {
        this.state.vertexContainer2.colorManipulator = value;

        this.state.vertexContainer2.vertex.r = 1 - this.state.vertexContainer2.colorManipulator;
        this.state.vertexContainer2.vertex.g = 0 + this.state.vertexContainer2.colorManipulator;
        this.state.vertexContainer2.vertex.b = 0 + this.state.vertexContainer2.colorManipulator;

        this.draw();
    }

    changeColorV3 = (value) => {
        this.state.vertexContainer3.colorManipulator = value;

        this.state.vertexContainer3.vertex.r = 0 + this.state.vertexContainer3.colorManipulator;
        this.state.vertexContainer3.vertex.g = 1 - this.state.vertexContainer3.colorManipulator;
        this.state.vertexContainer3.vertex.b = 1 - this.state.vertexContainer3.colorManipulator;

        this.draw();
    }


    changeColorV4 = (value) => {
        this.state.vertexContainer4.colorManipulator = value;

        this.state.vertexContainer4.vertex.r = 1 - this.state.vertexContainer4.colorManipulator;
        this.state.vertexContainer4.vertex.g = 0 - this.state.vertexContainer4.colorManipulator;
        this.state.vertexContainer4.vertex.b = 1 - this.state.vertexContainer4.colorManipulator;

        this.draw();
    }

    changeColorV5 = (value) => {
        this.state.vertexContainer5.colorManipulator = value;

        this.state.vertexContainer5.vertex.r = 1 - this.state.vertexContainer5.colorManipulator;
        this.state.vertexContainer5.vertex.g = 0 + this.state.vertexContainer5.colorManipulator;
        this.state.vertexContainer5.vertex.b = 0 + this.state.vertexContainer5.colorManipulator;

        this.draw();
    }

    propsAsString = obj => {
        var depthLevelMap = new HashMap();
        var depth = 1;

        var unwrapObjects = (obj, depthLevelMap, depth) => {
            return Object.keys(obj)
                .map(function (k) {
                    if (depthLevelMap.get(obj[k]) === undefined) {
                        depthLevelMap.set(obj[k], 0);
                    }

                    var dethValue = depthLevelMap.get(obj[k]);

                    if (
                        typeof obj[k] === 'object' &&
                        obj[k] !== null &&
                        obj[k] !== undefined &&
                        dethValue < depth
                    ) {
                        var currentDepthValue = depthLevelMap.get(obj[k]);
                        currentDepthValue++;
                        depthLevelMap.set(obj[k], currentDepthValue);

                        return unwrapObjects(obj[k], depthLevelMap, depth);
                    } else {
                        return k + ' : ' + obj[k];
                    }
                })
                .join(' \n ');
        };

        return unwrapObjects(obj, depthLevelMap, depth);
    };

    render() {

        const wrapperStyle = { width: 400, margin: 10 };



        return (

            <div>
                <div>
                    <h2>EA3</h2>
                </div>

                <div className='rowC'>

                    <div className='canvasBox'>
                        <canvas ref={ref => this['webGLCanvas'] = ref} width='512px' height='512px'></canvas>
                    </div>

                    <div className='sliderBox'>

                        <div style={wrapperStyle}>

                            Vertex1 X Value:
                                <Slider min={this.state.xMin} max={this.state.xMax} defaultValue={this.state.vertexContainer1.vertex.x} step={0.01} handle={handle} onChange={this.changeXV1} />

                        </div>
                        <div style={wrapperStyle}>
                            Vertex1 Y Value:
                                <Slider min={this.state.yMin} max={this.state.yMax} defaultValue={this.state.vertexContainer1.vertex.y} step={0.01} handle={handle} onChange={this.changeYV1} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex1 Color
                <Slider min={-0.5} max={0.5} defaultValue={this.state.vertexContainer1.colorManipulator} step={0.001} handle={handle} onChange={this.changeColorV1} />
                        </div>



                        <div style={wrapperStyle}>
                            Vertex2 X Value:
                                <Slider min={this.state.xMin} max={this.state.xMax} defaultValue={this.state.vertexContainer2.vertex.x} step={0.01} handle={handle} onChange={this.changeXV2} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex2 Y Value:
                                <Slider min={this.state.yMin} max={this.state.yMax} defaultValue={this.state.vertexContainer2.vertex.y} step={0.01} handle={handle} onChange={this.changeYV2} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex2 Color
                <Slider min={-0.5} max={0.5} defaultValue={this.state.vertexContainer2.colorManipulator} step={0.001} handle={handle} onChange={this.changeColorV2} />
                        </div>




                        <div style={wrapperStyle}>
                            Vertex3 X Value:
                                <Slider min={this.state.xMin} max={this.state.xMax} defaultValue={this.state.vertexContainer3.vertex.x} step={0.01} handle={handle} onChange={this.changeXV3} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex3 Y Value:
                                <Slider min={this.state.yMin} max={this.state.yMax} defaultValue={this.state.vertexContainer3.vertex.y} step={0.01} handle={handle} onChange={this.changeYV3} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex3 Color
                <Slider min={-0.5} max={0.5} defaultValue={this.state.vertexContainer3.colorManipulator} step={0.001} handle={handle} onChange={this.changeColorV3} />
                        </div>


                        <div style={wrapperStyle}>
                            Vertex4 X Value:
                                <Slider min={this.state.xMin} max={this.state.xMax} defaultValue={this.state.vertexContainer4.vertex.x} step={0.01} handle={handle} onChange={this.changeXV4} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex4 Y Value:
                                <Slider min={this.state.yMin} max={this.state.yMax} defaultValue={this.state.vertexContainer4.vertex.y} step={0.01} handle={handle} onChange={this.changeYV4} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex4 Color
                <Slider min={-0.5} max={0.5} defaultValue={this.state.vertexContainer4.colorManipulator} step={0.001} handle={handle} onChange={this.changeColorV4} />
                        </div>

                        <div style={wrapperStyle}>
                            Vertex5 X Value:
                                <Slider min={this.state.xMin} max={this.state.xMax} defaultValue={this.state.vertexContainer5.vertex.x} step={0.01} handle={handle} onChange={this.changeXV5} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex5 Y Value:
                                <Slider min={this.state.yMin} max={this.state.yMax} defaultValue={this.state.vertexContainer5.vertex.y} step={0.01} handle={handle} onChange={this.changeYV5} />
                        </div>
                        <div style={wrapperStyle}>
                            Vertex5 Color
                <Slider min={-0.5} max={0.5} defaultValue={this.state.vertexContainer5.colorManipulator} step={0.001} handle={handle} onChange={this.changeColorV5} />
                        </div>

                    </div>

                </div>

                <div>{this.state.eventKey}</div>
                <KeyboardEventHandler
                    handleKeys={['?']}
                    onKeyEvent={(key, e) => this.handleKeyDown(key)} />

                <div style={{ position: 'relative', height: '30px' }}></div>
            </div>


        );
    }
}