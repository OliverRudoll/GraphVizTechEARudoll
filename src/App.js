import React, { Component } from 'react';
import './App.css';
import Menu from './Menu.js';

class App extends Component {

  _refreshPage() {
    console.log("Clicked");
    window.location.reload();
  }

  render() {
    return (
      <div>
       <button onClick = {this._refreshPage} > Home </button>
      <Menu />
      </div>
    )
  }
}

export default App;