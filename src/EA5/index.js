import React, { Component } from 'react';
import './ea5.css';
import * as glmatrix from 'gl-matrix';
import * as importedGeometry1 from './sphere.js';
import * as importedGeometry2 from './custom.js';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';

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

var vertexShaderText =
    [
        'attribute vec3 aPosition;',
        'attribute vec3 aNormal;',
        'uniform mat4 uPMatrix;',
        'uniform mat4 uMVMatrix;',
        'varying vec4 vColor;',
        'void main()',
        '{',
        'gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);',
        'vColor = vec4(aNormal.x, aNormal.y, aNormal.z, 1.0);',
        'vColor = (vColor + 1.0) / 2.0;',
        '}'
    ].join('\n');


var fragmentShaderText =
    [
        'precision mediump float;',
        'varying vec4 vColor;',
        'void main()',
        '{',
        '  gl_FragColor = vColor;',
        '}'
    ].join('\n');

var gl;

// The shader program object is also used to
// store attribute and uniform locations.
var prog;

// Array of model objects.
var models = [];

var camera = {
    // Initial position of the camera.
    eye: [0, 1, 4],
    // Point to look at.
    center: [0, 0, 0],
    // Roll and pitch of the camera.
    up: [0, 1, 0],
    // Opening angle given in radian.
    // radian = degree*2*PI/360.
    fovy: 60.0 * Math.PI / 180,
    // Camera near plane dimensions:
    // value for left right top bottom in projection.
    lrtb: 2.0,
    // View matrix.
    vMatrix: glmatrix.mat4.create(),
    // Projection matrix.
    pMatrix: glmatrix.mat4.create(),
    // Projection types: ortho, perspective, frustum.
    projectionType: "ortho",
    // Angle to Z-Axis for camera when orbiting the center
    // given in radian.
    zAngle: 0,
    // Distance in XZ-Plane from center when orbiting.
    distance: 4,
};

export default class EA5 extends Component {

    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            eventKey: " ",
            zoom: 2,
            xMin: -3.0, xMax: 3.0, yMin: -3.0, yMax: 3.0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            cameraCenterX: 0,
            cameraCenterY: 0,
            cameraCenterZ: 0,
            cameraUpX: 0,
            cameraUpY: 0,
            cameraUpZ: 0
        }
    }

    componentDidMount() {
        this.init();
    }

        /*
    *
    *
    * GUI Functions
    * 
    * 
    * */

handleKeyDown = (key) => {

    console.log(key + "is down");

    if (key === 'w') {
        console.log('w pressed ! ')

        var value = this.state.rotationX + 0.01;

            this.setState
            (
                {
                    rotationX: value
                }
            )
    }
    else 
    if (key === 's') {
        console.log('s pressed ! ')

        var value = this.state.rotationX - 0.01;

            this.setState
            (
                {
                    rotationX: value
                }
            )
    }
    else
    if (key === 'a') {
        console.log('a pressed ! ')

        var value = this.state.rotationY - 0.01;

            this.setState
            (
                {
                    rotationY: value
                }
            )
    }    
    else
    if (key === 'd') {
        console.log('d pressed ! ')

        var value = this.state.rotationY + 0.01;

            this.setState
            (
                {
                    rotationY: value
                }
            )
    }
    else
    if (key === 'q') {
        console.log('q pressed ! ')

        var value = this.state.rotationZ - 0.1;

            this.setState
            (
                {
                    rotationZ: value
                }
            )
    }
    else
    if (key === 'e') {
        console.log('e pressed ! ')

        var value = this.state.rotationZ + 0.1;

            this.setState
            (
                {
                    rotationZ: value
                }
            )
    }
    else
    if (key === 'i') {
        console.log('i pressed ! ')

        var value = this.state.zoom + 0.01;

            this.setState
            (
                {
                    zoom: value
                }
            )
    }
    else
    if (key === 'o') {
        console.log('o pressed ! ')

        var value = this.state.zoom - 0.01;

            this.setState
            (
                {
                    zoom: value
                }
            )
    }

    this.renderWegGL();
}


    render() {

        const wrapperStyle = { width: 400, margin: 10 };
        return (

            <div>
                <div>
                    <h2>EA5</h2>
                </div>

                <div className='rowCEA5'>
                    <div className='canvasBoxEA5'>
                        <canvas ref={ref => this['webGLCanvas'] = ref} width='512px' height='512px'></canvas>
                    </div>

                    <KeyboardEventHandler
                    handleKeys={['w','a','s','d','q','e','i','o']}
                    onKeyEvent={(key, e) => this.handleKeyDown(key)} />

                    <div className='sliderBoxEA5'>
                    <div style={wrapperStyle}>
                            Rotate Camera with W,A,S,D around X and Y and with Q,E around Z. Zoom with I,O
                        </div>
                        <div style={wrapperStyle}>
                            camera X Value: <p>{this.state.rotationX}</p>
                        </div>
                        <div style={wrapperStyle}>
                            camera Y Value: <p>{this.state.rotationY}</p>
                        </div>
                        <div style={wrapperStyle}>
                            camera Z Value: <p>{this.state.rotationZ}</p>
                        </div>
                        <div style={wrapperStyle}>
                            camera Zoom: <p>{this.state.zoom}</p>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'relative', height: '30px' }}></div>
            </div>
        );
    }


    /*
    *
    *
    * WEB GL Section
    * 
    * 
    * */

    init = () => {


        try {
            this.initWebGL();
        } catch (e) {
            alert("Error: " + e);
        }

        this.initShaderProgram();
        this.initUniforms()
        this.initModels();
        this.initEventHandler();
        this.initPipline();

        this.renderWegGL();
    }

    initWebGL = () => {

        try {
            gl = this['webGLCanvas'].getContext('webgl');
            if (!gl) { throw "x"; }
        } catch (err) {
            throw "Your web browser does not support WebGL!";
        }

        gl.viewportWidth = this['webGLCanvas'].width;
        gl.viewportHeight = this['webGLCanvas'].height;
    }

    /**
     * Init pipeline parameters that will not change again.
     * If projection or viewport change, their setup must
     * be in render .
     */
    initPipline = () => {
        gl.clearColor(.95, .95, .95, 1);

        // Backface culling.
        gl.frontFace(gl.CCW);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        // Depth(Z)-Buffer.
        gl.enable(gl.DEPTH_TEST);

        // Polygon offset of rastered Fragments.
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(0.5, 0);

        // Set viewport.
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

        // Init camera.
        // Set projection aspect ratio.
        camera.aspect = gl.viewportWidth / gl.viewportHeight;
    }

    initShaderProgram = () => {
        // Init vertex shader.
        var vs = this.initShader(gl.VERTEX_SHADER, "vertexshader");
        // Init fragment shader.
        var fs = this.initShader(gl.FRAGMENT_SHADER, "fragmentshader");
        // Link shader into a shader program.
        prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, "aPosition");
        gl.linkProgram(prog);
        gl.useProgram(prog);
    }

    /**
     * Create and init shader from source.
     * 
     * @parameter shaderType: openGL shader type.
     * @parameter SourceTagId: Id of HTML Tag with shader source.
     * @returns shader object.
     */
    initShader = (shaderType, SourceTagId) => {
        var shader = gl.createShader(shaderType);
        var shaderSource;

        if (SourceTagId == 'vertexshader') {
            shaderSource = vertexShaderText;
        }
        else {
            shaderSource = fragmentShaderText;
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    initUniforms = () => {
        // Projection Matrix.
        prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

        // Model-View-Matrix.
        prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");
    }

    initModels = () => {
        // fill-style
        var fs = "fillwireframe";
        this.createModel(importedGeometry1, fs);
        this.createModel(importedGeometry2, fs);
    }

    /**
     * Create model object, fill it and push it in models array.
     * 
     * @parameter geometryname: string with name of geometry.
     * @parameter fillstyle: wireframe, fill, fillwireframe.
     */
    createModel = (geometryname, fillstyle) => {
        var model = {};
        model.fillstyle = fillstyle;
        
        this.initDataAndBuffers(model, geometryname);
        // Create and initialize Model-View-Matrix.
        model.mvMatrix = glmatrix.mat4.create();

        models.push(model);
    }

    /**
     * Init data and buffers for model object.
     * 
     * @parameter model: a model object to augment with data.
     * @parameter geometryname: string with name of geometry.
     */
    initDataAndBuffers = (model, geometryname) => {
        // Provide model object with vertex data arrays.
        // Fill data arrays for Vertex-Positions, Normals, Index data:
        // vertices, normals, indicesLines, indicesTris;
        // Pointer this refers to the window.
        geometryname.createVertexData.apply(model);

        // Setup position vertex buffer object.
        model.vboPos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
        gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
        gl.enableVertexAttribArray(prog.positionAttrib);

        // Setup normal vertex buffer object.
        model.vboNormal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
        gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
        // Bind buffer to attribute variable.
        prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
        gl.enableVertexAttribArray(prog.normalAttrib);

        // Setup lines index buffer object.
        model.iboLines = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines,
            gl.STATIC_DRAW);
        model.iboLines.numberOfElements = model.indicesLines.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // Setup triangle index buffer object.
        model.iboTris = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris,
            gl.STATIC_DRAW);
        model.iboTris.numberOfElements = model.indicesTris.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    initEventHandler = () => {

        window.onkeydown = (evt) => {
            var key = evt.which ? evt.which : evt.keyCode;
            var c = String.fromCharCode(key);
            // console.log(evt);

            // Change projection of scene.
            switch (c) {
                case ('O'):
                    camera.projectionType = "ortho";
                    camera.lrtb = 2;
                    break;
            }

            // Render the scene again on any key pressed.
            this.renderWegGL();
        };
    }

    /**
     * Run the rendering pipeline.
     */
    renderWegGL = () => {

        //camera.eye = [this.state.rotationX, this.state.rotationY, this.state.rotationZ];
        //camera.center = [this.state.rotationX, this.state.rotationY, this.state.rotationZ];
        //camera.up = [this.state.rotationX, this.state.rotationY, this.state.rotationZ];
        camera.lrtb = this.state.zoom;


        // Clear framebuffer and depth-/z-buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.setProjection();

        glmatrix.mat4.identity(camera.vMatrix);
        glmatrix.mat4.rotate(camera.vMatrix, camera.vMatrix, Math.PI * this.state.rotationX,[1, 0, 0]);
        glmatrix.mat4.rotate(camera.vMatrix, camera.vMatrix, Math.PI * this.state.rotationY,[0, 1, 0]);
        glmatrix.mat4.rotate(camera.vMatrix, camera.vMatrix, Math.PI * this.state.rotationZ,[0, 0, 1]);

        // Loop over models.
        for (var i = 0; i < models.length; i++) {
            // Update modelview for model.
            glmatrix.mat4.copy(models[i].mvMatrix, camera.vMatrix);

            // Set uniforms for model.
            gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
                models[i].mvMatrix);

            this.draw(models[i]);
        }
    }

    setProjection = () => {
        // Set projection Matrix.
        switch (camera.projectionType) {
            case ("ortho"):
                var v = camera.lrtb;
                glmatrix.mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
                break;
        }
        // Set projection uniform.
        gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
    }

    draw = (model) => {
        // Setup position VBO.
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
        gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);

        // Setup normal VBO.
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
        gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

        // Setup rendering tris.
        var fill = (model.fillstyle.search(/fill/) != -1);
        if (fill) {
            gl.enableVertexAttribArray(prog.normalAttrib);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
            gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements,
                gl.UNSIGNED_SHORT, 0);
        }

        // Setup rendering lines.
        var wireframe = (model.fillstyle.search(/wireframe/) != -1);
        if (wireframe) {
            gl.disableVertexAttribArray(prog.normalAttrib);
            gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
            gl.drawElements(gl.LINES, model.iboLines.numberOfElements,
                gl.UNSIGNED_SHORT, 0);
        }
    }
}