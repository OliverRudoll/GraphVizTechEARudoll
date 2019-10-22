import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import './ea2.css';


export default class EA2 extends Component {

    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            eventKey: " ",
            gui: null,
            wireframe: null,
            renderer: null,
            scene: null,
            camera: null,
            camera2: null,
            controls: null,
            wireframe1: null,
            matLine: null,
            matLineBasic: null,
            matLineDashed: null,
            stats: null,
            insetWidth: null,
            insetHeight: null
        }
    }

    componentDidMount() {

        'use strict'; 
        const gl =  this['webGLCanvas'].getContext('webgl');

        gl.enable(gl.SCISSOR_TEST);
        
        function drawRect(x, y, width, height, color) {
          gl.scissor(x, y, width, height);
          gl.clearColor(...color);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        
        for (let i = 0; i < 100; ++i) {
          const x = rand(0, 300);
          const y = rand(0, 150);
          const width = rand(0, 300 - x);
          const height = rand(0, 150 - y);
          drawRect(x, y, width, height, [rand(1), rand(1), rand(1), 1]);
        }
        
        function rand(min, max) {
          if (max === undefined) {
            max = min;
            min = 0;
          }
          return Math.random() * (max - min) + min;
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

                <canvas ref={ref => this['webGLCanvas'] = ref}></canvas>

                <div>Input Key detected: {this.state.eventKey}</div>
                <KeyboardEventHandler
                    handleKeys={['?']}
                    onKeyEvent={(key, e) => this.handleKeyDown(key)} />

                    <div style= {{position: 'relative', height: '30px'}}></div>
            </div>
        );
    }
}



/*NODE.JS headless webgl Code

//Create context
var width   = 64
var height  = 64
var gl = require('gl')(width, height, { preserveDrawingBuffer: true })

//Clear screen to red
gl.clearColor(1, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

//Write output as a PPM formatted image
var pixels = new Uint8Array(width * height * 4)

gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

process.stdout.write(['P3\n# gl.ppm\n', width, " ", height, '\n255\n'].join(''))
for(var i=0; i<pixels.length; i+=4) {
  for(var j=0; j<3; ++j) {
    process.stdout.write(pixels[i+j] + ' ')
  }
}

*/