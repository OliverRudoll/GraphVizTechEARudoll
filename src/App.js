import React from 'react';
import './App.css';
import EA1 from './EA1/index.js';
import EA2 from './EA2/index.js';
import EA3 from './EA3/index.js';
import EA4_1 from './EA4_1/index.js';
import EA4_2 from './EA4_2/index.js';
import EA5 from './EA5/index.js';

function App() {
  return (

    <div>

<div className='ea4_row'>
  <div className='ea4_1_box'>
  <EA4_1></EA4_1>
  </div>
  <div className='ea4_2_box'>
  <EA4_2></EA4_2>
  </div>
</div>

      <EA3></EA3>
      <EA2></EA2>
      <EA1></EA1> 
      
      {/*<EA5></EA5>*/}
    </div>
  );
}

export default App;