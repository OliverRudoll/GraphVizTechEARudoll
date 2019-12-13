import React, { Component } from 'react';

import Buttons from "./Buttons.js";

import EA1 from './EA1/index.js';
import EA2 from './EA2/index.js';
import EA3 from './EA3/index.js';
import EA4_1 from './EA4_1/index.js';
import EA4_2 from './EA4_2/index.js';
import EA5 from './EA5/index.js';
import EA6 from './EA6/index.js';
import EA7 from './EA7/index.js';
import EA8 from './EA8/index.js';
import EA9 from './EA9/index.js';
import EA10 from './EA10/index.js';

class Menu extends Component {
  state = {
    renderView: 0
  };

  clickBtn = e => {
    this.setState({
      renderView: +e.target.value
    });
  };

  render() {
    switch (this.state.renderView) {
      case 1:
        return <EA1/>;
      case 2:
        return <EA2 />;
      case 3:
        return <EA3 />;
      case 4:
        return <EA4_1 />;
      case 5:
        return <EA4_2 />;
      case 6:
        return <EA5 />;
      case 7:
        return <EA6 />;
      case 8:
        return <EA7 />;
      case 9:
        return <EA8 />;
      case 10:
        return <EA9 />;
      case 11:
        return <EA10 />;
      default:
        return <Buttons clickBtn={this.clickBtn} />;
    }
  }
}

export default Menu;