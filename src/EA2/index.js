import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import './ea2.css';

export default class EA2 extends Component {
    
    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            eventKey: " "
        }
    }

    
    componentDidMount() {
            this.init();
    }


    shaderProgram = (gl, vs, fs) => {

        var prog = gl.createProgram();
        var addshader = function(type, source) {
            var s = gl.createShader((type == 'vertex') ?
                gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                throw "Could not compile "+type+
                    " shader:\n\n"+gl.getShaderInfoLog(s);
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
    
        var prog = this.shaderProgram(gl,
            "attribute vec3 pos;"+
            "void main() {"+
            "	gl_Position = vec4(pos, 2.0);"+
            "}",
            "void main() {"+
            "	gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);"+
            "}"
        );
        gl.useProgram(prog);
    
        this.attributeSetFloats(gl, prog, "pos", 2, [
            0.1, -0.1,
            -0.1, 0.1,
            0.1,0.1,
            -0.1,-0.1,
            -0.1,-0.1,
            -0.2,-0.2,
            -0.2,-0.1,
            -0.2,-0.2,
            -0.2,0.2,
            0.2,0.2,
            0.2,-0.2,
            0.1,-0.1,
            0,0,
            0,-0.5,
            -0.5,-0.5,
            -0.5,0.5,
            0.5,0.5,
            0.5,-0.5,
            -0.5,-0.5,
            -0.5,-0.5,
            1.0, -1.0,
            -1, 1,
            1,1,
            -1,-1,
            -1,-1,
            -1.2,-1.2,
            -1.2,-1.1,
            -1.2,-1.2,
            -1.2,1.2,
            1.2,1.2,
            1.2,-1.2,
            1.2,-1.2,
            1.1,-1.1,
            1.1,-1.1,
            0,0,
            -1.5,-1.5,
            -1.5,1.5,
            1.5,1.5,
            1.5,-1.5,
            -1.5,-1.5,
            -1.5,-1.5
        ]);
        
        gl.drawArrays(gl.LINE_STRIP, 0, 41);

    }
    
    init = () => {
        try {
            this.draw();
        } catch (e) {
            alert("Error: "+e);
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

    render() {

        return (
            <div>
                <div><h2>EA2</h2></div>

                <canvas ref={ref => this['webGLCanvas'] = ref} width ='512px' height ='512px'></canvas>

                <div>{this.state.eventKey}</div>
                <KeyboardEventHandler
                    handleKeys={['?']}
                    onKeyEvent={(key, e) => this.handleKeyDown(key)} />

                    <div style= {{position: 'relative', height: '30px'}}></div>
            </div>
        );
    }
}