import React, { Component } from 'react';
import './ea8.css';
import * as glmatrix from 'gl-matrix';
import * as plane from './GVT_Src_vertexData_plane.js';
import * as sphere from './GVT_Src_vertexData_sphere.js';
import * as torus from './GVT_Src_vertexData_torus.js';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import vertexShaderText from './vertexShaderToon.glsl';
import fragmentShaderText from './fragmentShaderToon.glsl';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

var lightPosition1 = [0,5,0];
var lightPosition2 = [1,3,0];

var illumination = {
    ambientLight: [.5, .5, .5],
    light: [
        { isOn: true, position: lightPosition1, color: [1., 1., 1.] },
        { isOn: true, position: lightPosition2, color: [1., 1., 1.] }
    ]
};

var i = 1;

// fill-style
var fs = "fillwireframe";
var wf = "wireframe";
var fill = 'fill';

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

var gl;

// The shader program object is also used to
// store attribute and uniform locations.
var prog;

// Array of model objects.
var models = [];

var zoomStep = 1;

var camera = {
    // Initial position of the camera.
    eye: [0, 5, 0],
    // Point to look at.
    center: [0, 0, 0],
    // Roll and pitch of the camera.
    up: [0, 1, 0],
    // Opening angle given in radian.
    // radian = degree*2*PI/360.
    fovy: 140.0 * Math.PI / 180,
    // Camera near plane dimensions:
    // value for left right top bottom in projection.
    lrtb: 100.0,
    // View matrix.
    vMatrix: glmatrix.mat4.create(),
    // Projection matrix.
    pMatrix: glmatrix.mat4.create(),
    // Projection types: ortho, perspective, frustum.
    projectionType: "perspective",
    // Angle to Z-Axis for camera when orbiting the center
    // given in radian.
    zAngle: 0,
    // Distance in XZ-Plane from center when orbiting.
    distance: 8,
};


var cameraMoveStep = 0.1;

export default class EA8 extends Component {

    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            eventKey: " ",
            zoom: 120,
            xMin: -3.0, xMax: 3.0, yMin: -3.0, yMax: 3.0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            cameraEyeX: 0,
            cameraEyeY: 5,
            cameraEyeZ: 0,
            cameraCenterX: 0,
            cameraCenterY: 0,
            cameraCenterZ: 0,
            cameraUpX: 0,
            cameraUpY: 0,
            cameraUpZ: 0,
            angle: 0,
            interactiveSphere1: null,
            interactiveSphere2: null,
            interactiveSphere3: null,
            interactiveSphere4: null,
            interactiveTorus: null,
            interactivePlane: null,
            interactiveSphere1Translate: null,
            interactiveSphere2Translate: null,
            interactiveSphere3Translate: null,
            interactiveSphere4Translate: null,
            lightPosition1Marker: null,
            lightPosition2Marker: null,
            deltaTime: 0.05,
            isLoop: false,
            radius: 0.2,
            commandNote: '',
            drawOrbit: false
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


    myLoop = () => {

        setTimeout(() => {
            this.animateModels();
            this.renderWegGL();

            var changedAngle = this.state.angle + this.state.deltaTime;
            this.setState({ angle: changedAngle });
            i++;

            if (i < 100000 && this.state.isLoop) {
                this.myLoop();
            }

        }, 25)
    }

    handleKeyDown = (key) => {

        this.setState({ commandNote: ((key + " pressed! ") + this.state.commandNote) });

        if (key === 'w') {

            camera.eye[1]+= cameraMoveStep;
            


        }
        else
            if (key === 's') {
                camera.eye[1]-= cameraMoveStep;
            
            }
            else
                if (key === 'q') {

                    camera.distance += cameraMoveStep;

                }
                else
                    if (key === 'e') {

                        camera.distance -= cameraMoveStep;

                    }
                    else
                        if (key === 'a') {

                            camera.zAngle -= cameraMoveStep;

                            
                        }
                        else
                            if (key === 'd') {

                                camera.zAngle += cameraMoveStep;

                            }
                            else
                                if (key === 'o') {
                                    var value = this.state.zoom + zoomStep;

                                    this.setState
                                        (
                                            {
                                                zoom: value
                                            }
                                        )
                                }
                                else
                                    if (key === 'i') {

                                        var value = this.state.zoom - zoomStep;

                                        this.setState
                                            (
                                                {
                                                    zoom: value
                                                }
                                            )
                                    }
        if (key === '1') {
            zoomStep = 0.1;
            camera.up = [0, 1, 0];
            this.setState({ zoom: 6 });
            camera.projectionType = 'ortho';
        }
        if (key === '2') {
            zoomStep = 0.1;
            camera.up = [0, 1, 0];
            this.setState({ zoom: 6 });
            camera.projectionType = 'frustum';
        }
        if (key === '3') {
            zoomStep = 0.1;
            camera.lrtb = 11;
            camera.fovy = 120.0 * Math.PI / 180;
            camera.up = [0, 1, 0];
            this.setState({ zoom: 120 });
            camera.projectionType = 'perspective';
        }
        if (key === 'k') {
            this.setState({ isLoop: false });
            this.animateModels();
            var changedAngle = this.state.angle + this.state.deltaTime;
            this.setState({ angle: changedAngle });
        }

        if (key === 'l') {
            this.setState({ isLoop: true });
            this.myLoop();

        }

        if (key === 'p') {
            var toggleDrawOrbit = !this.state.drawOrbit;
            this.setState({ drawOrbit: toggleDrawOrbit });
        }

        this.renderWegGL();
    }


    render() {

        const wrapperStyle = { width: 400, margin: 10 };
        return (

            <div>
                <div>
                    <h2>EA8</h2>
                </div>

                <div className='rowCEA5'>
                    <div className='canvasBoxEA5'>
                        <canvas ref={ref => this['webGLCanvas'] = ref} width='512px' height='512px'></canvas>
                    </div>

                    <KeyboardEventHandler
                        handleKeys={['w', 'a', 's', 'd', 'q', 'e', 'i', 'o', '1', '2', '3', 'k', 'l', 'p']}
                        onKeyEvent={(key, e) => this.handleKeyDown(key)} />

                    <div className='sliderBoxEA5'>
                        <div style={wrapperStyle}>
                            <h2>Note:</h2>
                            <p>Switch with 1, 2, 3 between ortho, frustum or perspective camera</p>
                            <h2>Controls:</h2>
                            <p>Start the Animated Loop with L or skip keyframe by keyframe with K. (Note: K will stop the loop.)</p>
                            <p>Move Camera with W,A,S,D on X and Y axis and with Q,E around Z. Zoom with I,O.</p>
                            <p>The Look At Center is 0,0,0</p>
                        </div>
                        <div style={wrapperStyle}>
                            rotationX: {this.state.rotationX} , cameraEyeX: {this.state.cameraEyeX}
                        </div>
                        <div style={wrapperStyle}>
                            rotationY: {this.state.rotationY} , cameraEyeY: {this.state.cameraEyeY}
                        </div>
                        <div style={wrapperStyle}>
                            rotationZ: {this.state.rotationZ}, cameraEyeZ: {this.state.cameraEyeZ}
                        </div>
                        <div style={wrapperStyle}>
                            camera Zoom: <p>{this.state.zoom}</p>
                        </div>
                        <div style={wrapperStyle}>
                            function angle : <p>{this.state.angle}</p>
                        </div>
                        <div style={wrapperStyle}>
                            <p>postiton sphere1:  {this.state.interactiveSphere1Translate === null ? 'null' : (this.state.interactiveSphere1Translate[0] + ', ' + this.state.interactiveSphere1Translate[1] + ', ' + this.state.interactiveSphere1Translate[2])}</p>
                            <p>postiton sphere2:  {this.state.interactiveSphere2Translate === null ? 'null' : (this.state.interactiveSphere2Translate[0] + ', ' + this.state.interactiveSphere2Translate[1] + ', ' + this.state.interactiveSphere2Translate[2])}</p>
                            <p>postiton sphere3:  {this.state.interactiveSphere3Translate === null ? 'null' : (this.state.interactiveSphere3Translate[0] + ', ' + this.state.interactiveSphere3Translate[1] + ', ' + this.state.interactiveSphere3Translate[2])}</p>
                            <p>postiton sphere4:  {this.state.interactiveSphere4Translate === null ? 'null' : (this.state.interactiveSphere4Translate[0] + ', ' + this.state.interactiveSphere4Translate[1] + ', ' + this.state.interactiveSphere4Translate[2])}</p>
                        </div>


                        <div style={wrapperStyle}>
                            last Commands:  {this.state.commandNote}
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


            this.initShaderProgram();
            this.initUniforms()
            this.initModels();
            this.initPipline();

            this.setState({isLoop: true});
            //this.renderWegGL();
            this.myLoop();


        } catch (e) {
            alert("Error: " + e);
        }
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
  
         // Normal Matrix.
         prog.nMatrixUniform = gl.getUniformLocation(prog, "uNMatrix");
  
         // Color.
         prog.colorUniform = gl.getUniformLocation(prog, "uColor");
  
         // Light.
         prog.ambientLightUniform = gl.getUniformLocation(prog,
                 "ambientLight");
         // Array for light sources uniforms.
         prog.lightUniform = [];
         // Loop over light sources.
         for (var j = 0; j < illumination.light.length; j++) {
             var lightNb = "light[" + j + "]";
             // Store one object for every light source.
             var l = {};
             l.isOn = gl.getUniformLocation(prog, lightNb + ".isOn");
             l.position = gl.getUniformLocation(prog, lightNb + ".position");
             l.color = gl.getUniformLocation(prog, lightNb + ".color");
             prog.lightUniform[j] = l;
         }
  
         // Material.
         prog.materialKaUniform = gl.getUniformLocation(prog, "material.ka");
         prog.materialKdUniform = gl.getUniformLocation(prog, "material.kd");
         prog.materialKsUniform = gl.getUniformLocation(prog, "material.ks");
         prog.materialKeUniform = gl.getUniformLocation(prog, "material.ke");
     }

    /**
   * @paramter material : objekt with optional ka, kd, ks, ke.
   * @retrun material : objekt with ka, kd, ks, ke.
   */
    createPhongMaterial = (material) => {
        material = material || {};
        // Set some default values,
        // if not defined in material paramter.
        material.ka = material.ka || [ 0.3, 0.3, 0.3 ];
        material.kd = material.kd || [ 0.6, 0.6, 0.6 ];
        material.ks = material.ks || [ 0.8, 0.8, 0.8 ];
        material.ke = material.ke || 10.;
 
        return material;
    }

    initModels = () => {

        // Create some default material.
        var mDefault = this.createPhongMaterial();

        var mRed = this.createPhongMaterial({kd:[1.,0.,0.]});
        var mGreen = this.createPhongMaterial({kd:[0.,1.,0.]});
        var mBlue = this.createPhongMaterial({kd:[0.,0.,1.]});
        var mWhite = this.createPhongMaterial({ka:[1.,1.,1.], kd:[.5,.5,.5],ks:[0.,0.,0.]});

        this.createModel('torus', torus, fill, [1, 1, 1, 1], [0, 0, 0], [1.535, 0, 0,0], [4, 4, 4,4], mRed);
        this.createModel('plane', plane, fill, [1, 1, 1, 1], [0, -3.8, 0], [0, 0, 0,0],[2, 2, 2,2], mDefault);

        this.createModel('sphere', sphere, fill, [1, 1, 1, 1], [.2, -.2, 0], [0, 0, 0,0],[.1, .1, .1, .1], mGreen);
        this.createModel('sphere', sphere, fill, [1, 1, 1, 1], [-.2, .2, 0], [0, 0, 0,0],[.1, .1, .1, .1], mBlue);
        this.createModel('sphere', sphere, fill, [1, 1, 1, 1], [-.2, -.2, 0], [0, 0, 0,0],[.1, .1, .1, .1], mWhite);
        this.createModel('sphere', sphere, fill, [1, 1, 1, 1], [.2, .2, 0], [0, 0, 0,0],[.1, .1, .1, .1], mBlue);

        //light1 position marker
        this.createModel('sphere', sphere, wf, [1, 0, 0, 1], lightPosition1, [0, 0, 0,0],[.5, .5, .5, .5], mDefault);

        //light1 position marker
        this.createModel('sphere', sphere, wf, [1, 0, 0, 1], lightPosition2, [0, 0, 0,0],[.5, .5, .5, .5], mDefault);

        // Select one model that can be manipulated interactively by user.
        this.setState({ interactiveTorus: models[0] });
        this.setState({ interactivePlane: models[1] });
        this.setState({ interactiveSphere1: models[2] });
        this.setState({ interactiveSphere2: models[3] });
        this.setState({ interactiveSphere3: models[4] });
        this.setState({ interactiveSphere4: models[5] });
        this.setState({ lightPosition1Marker: models[6] });
        this.setState({ lightPosition2Marker: models[7] });
    }

    /**
     * Create model object, fill it and push it in models array.
     * 
     * @parameter geometryname: string with name of geometry.
     * @parameter fillstyle: wireframe, fill, fillwireframe.
     */

    createModel = (geometryname, geometry, fillstyle, color, translate, rotate, scale, material) => {
        var model = {};
        model.name = geometryname;
        model.fillstyle = fillstyle;
        model.color = color;
        this.initDataAndBuffers(model, geometry);
        this.initTransformations(model, translate, rotate, scale);
        model.material = material;

        models.push(model);
    }

    initTransformations = (model, translate, rotate, scale) => {
        // Store transformation vectors.
        model.translate = translate;
        model.rotate = rotate;
        model.scale = scale;

        // Create and initialize Model-Matrix.
        model.mMatrix = glmatrix.mat4.create();

        // Create and initialize Model-View-Matrix.
        model.mvMatrix = glmatrix.mat4.create();

        // Create and initialize Normal Matrix.
        model.nMatrix = glmatrix.mat3.create();
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

    calculateCameraOrbit = () => {
        // Calculate x,z position/eye of camera orbiting the center.
        var x = 0, z = 2;
        camera.eye[x] = camera.center[x];
        camera.eye[z] = camera.center[z];
        camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
        camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
    }


    animateModels = () => {

        var xOffset = Math.cos(this.state.angle) * this.state.radius;
        var yOffset = Math.sin(this.state.angle) * this.state.radius;

        var radiusExpension = 4;

        lightPosition1[0] += (yOffset * radiusExpension);
        lightPosition1[2] += (xOffset * radiusExpension);

        if (this.state.angle > (6.499)) {
        lightPosition2[0] -= (yOffset * radiusExpension);
        lightPosition2[2] -= (xOffset * radiusExpension);
        }

        if(this.state.lightPosition1Marker !==null)
        {
            this.state.lightPosition1Marker.translate = 
            [this.state.lightPosition1Marker.translate[0] + (yOffset * radiusExpension),
            this.state.lightPosition1Marker.translate[1],
            this.state.lightPosition1Marker.translate[2] + (xOffset * radiusExpension)]
        }

        if(this.state.lightPosition2Marker !==null)
        {
            if (this.state.angle > (6.499)) {
            this.state.lightPosition2Marker.translate = 
            [this.state.lightPosition2Marker.translate[0] - (yOffset * radiusExpension),
            this.state.lightPosition2Marker.translate[1],
            this.state.lightPosition2Marker.translate[2] - (xOffset * radiusExpension)]
            }
        }

        if (this.state.interactiveTorus !== null) {
            this.state.interactiveTorus.rotate[0] += this.state.deltaTime * 0.5;
        }

        if (this.state.interactiveSphere1 !== null) {
            this.state.interactiveSphere1.translate = [this.state.interactiveSphere1.translate[0] + yOffset,
            this.state.interactiveSphere1.translate[1] + xOffset,
            this.state.interactiveSphere1.translate[2]]

        }


        if (this.state.interactiveSphere2 !== null) {
            if (this.state.angle > (6.499)) {
                this.state.interactiveSphere2.translate = [this.state.interactiveSphere2.translate[0] - yOffset,
                this.state.interactiveSphere2.translate[1] - xOffset,
                this.state.interactiveSphere2.translate[2]]
            }
        }
        if (this.state.interactiveSphere3 !== null) {
            if (this.state.angle > (3.1)) {

                this.state.interactiveSphere3.translate = [this.state.interactiveSphere3.translate[0],
                this.state.interactiveSphere3.translate[1] + yOffset,
                this.state.interactiveSphere3.translate[2] + xOffset]
            }
        }

        if (this.state.interactiveSphere4 !== null) {
            if (this.state.angle > (9.14)) {

                this.state.interactiveSphere4.translate = [this.state.interactiveSphere4.translate[0] + yOffset,
                this.state.interactiveSphere4.translate[1],
                this.state.interactiveSphere4.translate[2] - xOffset]

            }
        }


        if (this.state.interactiveSphere1 !== null &&
            this.state.interactiveSphere2 !== null &&
            this.state.interactiveSphere3 !== null &&
            this.state.interactiveSphere4 !== null) {
            this.setState({ interactiveSphere1Translate: this.state.interactiveSphere1.translate });
            this.setState({ interactiveSphere2Translate: this.state.interactiveSphere2.translate });
            this.setState({ interactiveSphere3Translate: this.state.interactiveSphere3.translate });
            this.setState({ interactiveSphere4Translate: this.state.interactiveSphere4.translate });
        }

    }

    /**
     * Run the rendering pipeline.
     */
    renderWegGL = () => {

        if (camera.projectionType === 'frustum') {
            camera.lrtb = this.state.zoom;
        } else if (camera.projectionType === 'perspective') {
            camera.lrtb = this.state.zoom;
            camera.fovy = this.state.zoom * Math.PI / 180;
        }
        else {
            camera.lrtb = this.state.zoom;
        }


     // Clear framebuffer and depth-/z-buffer.
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.setProjection();

        this.calculateCameraOrbit();

        glmatrix.mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

        // Set light uniforms.
        gl.uniform3fv(prog.ambientLightUniform, illumination.ambientLight);
        // Loop over light sources.
        for (var j = 0; j < illumination.light.length; j++) {
            // bool is transferred as integer.
            gl.uniform1i(prog.lightUniform[j].isOn,
                illumination.light[j].isOn);
            // Tranform light postion in eye coordinates.
            // Copy current light position into a new array.
            var lightPos = [].concat(illumination.light[j].position);
            // Add homogenious coordinate for transformation.
            lightPos.push(1.0);
            glmatrix.vec4.transformMat4(lightPos, lightPos, camera.vMatrix);
            // Remove homogenious coordinate.
            lightPos.pop();
            gl.uniform3fv(prog.lightUniform[j].position, lightPos);
            gl.uniform3fv(prog.lightUniform[j].color,
                illumination.light[j].color);
        }

        // Loop over models.
        for (var i = 0; i < models.length; i++) {
            // Update modelview for model.
            this.updateTransformations(models[i]);
 
            // Set uniforms for model.
            //
            // Transformation matrices.
            gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
                    models[i].mvMatrix);
            gl.uniformMatrix3fv(prog.nMatrixUniform, false,
                    models[i].nMatrix);
            // Color (not used with lights).
            gl.uniform4fv(prog.colorUniform, models[i].color);
            // NEW
            // Material.
            gl.uniform3fv(prog.materialKaUniform, models[i].material.ka);
            gl.uniform3fv(prog.materialKdUniform, models[i].material.kd);
            gl.uniform3fv(prog.materialKsUniform, models[i].material.ks);
            gl.uniform1f(prog.materialKeUniform, models[i].material.ke);
 
            this.draw(models[i]);
        }
    }

    updateTransformations = (model) => {

        // Use shortcut variables.
        var mMatrix = model.mMatrix;
        var mvMatrix = model.mvMatrix;
 
        // Reset matrices to identity.
        glmatrix.mat4.identity(mMatrix);
        glmatrix.mat4.identity(mvMatrix);
 
        // Translate.
        glmatrix.mat4.translate(mMatrix, mMatrix, model.translate);
        // Rotate.
        glmatrix.mat4.rotateX(mMatrix, mMatrix, model.rotate[0]);
        glmatrix.mat4.rotateY(mMatrix, mMatrix, model.rotate[1]);
        glmatrix.mat4.rotateZ(mMatrix, mMatrix, model.rotate[2]);
        // Scale
        glmatrix.mat4.scale(mMatrix, mMatrix, model.scale);
 
        // Combine view and model matrix
        // by matrix multiplication to mvMatrix.
        glmatrix.mat4.multiply(mvMatrix, camera.vMatrix, mMatrix);
 
        // Calculate normal matrix from model matrix.
        glmatrix.mat3.normalFromMat4(model.nMatrix, mvMatrix);
    }

    setProjection = () => {
        // Set projection Matrix.
        switch (camera.projectionType) {
            case ("ortho"):
                var v = camera.lrtb;
                glmatrix.mat4.ortho(camera.pMatrix, -v, v, -v, v, -20, 20);
                break;
            case ("frustum"):
                var v = camera.lrtb;
                glmatrix.mat4.frustum(camera.pMatrix, -v / 2, v / 2, -v / 2, v / 2, 1, 10);
                break;
            case ("perspective"):
                glmatrix.mat4.perspective(camera.pMatrix, camera.fovy, camera.aspect, 1, 100);
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