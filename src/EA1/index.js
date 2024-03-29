import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Menu from '../Menu.js';
import './ea1.css';

export default class EA1 extends Component {
    static propTypes = {}
    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = { // state keys go here
            yOffset: 0,
            eventKey: " "
        }
    }

    handleKeyDown = (key,refName) => {

        console.log(key + "is down");

        var tempKey = key + " " + this.state.eventKey;

        this.setState(
            {
                eventKey: tempKey
            })

        if (key === 'l') {
            console.log('L pressed ! ')

            if (this.state.yOffset >= 512) {
                this.setState(
                    {
                        yOffset: this.state.yOffset - 512
                    })
            }

        } else if (key === 'r') {
            console.log('R pressed ! ')


            this.setState(
                {
                    yOffset: this.state.yOffset + 512
                })
        }

        var string = `url("https://i.ibb.co/b7HgSFy/Graph-Viz-Tech-EA1.png") 0px ${this.state.yOffset}px`;
        this[refName].style.background = string.toString();
    }

     //background: 'url("images/GraphVizTechEA1.png") 0 0'},} 
     //src={process.env.PUBLIC_URL + '/images/placeholder1x1.png'} alt="circle" width="1" height="1"></img>

    render() {

        //TODO change clippingrect css by jscript code on key input left right
        let refName = 'clippingrect';

        return (
            <div>
                <div><h2>EA1</h2></div>

                <img 
                ref={ref => this[refName] = ref}
                style= {{position: 'relative',
                width: '512px',
                height: '512px',
                background: 'url("https://i.ibb.co/b7HgSFy/Graph-Viz-Tech-EA1.png") 0 0'}}
                src={'https://i.ibb.co/Yc3S8ZW/placeholder1x1.png'} alt="circle" width="1" height="1"></img>
                
                <div>Input Key detected: {this.state.eventKey}</div>

                <KeyboardEventHandler
                    handleKeys={['l', 'r']}
                    onKeyEvent={(key, e) => this.handleKeyDown(key,refName)} />

                    <div style= {{position: 'relative', height: '30px'}}></div>
                    <a href='https://www.searchpng.com/2019/01/07/blue-circle-glow-png-free-download/'>Circle Image Reference</a>
            </div>
        );
    }
}