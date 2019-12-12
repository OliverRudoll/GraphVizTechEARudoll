import React from "react";

export default props => (
  <>
    <p>Einsendeaufgaben{" "}</p>
    <p> 
       <button value={9} onClick={props.clickBtn}>
      EA 8
    </button>{" "}
    </p>
    <p> 
       <button value={8} onClick={props.clickBtn}>
      EA 7
    </button>{" "}
    </p>
    <p> 
       <button value={7} onClick={props.clickBtn}>
      EA 6
    </button>{" "}
    </p>
    <p> 
    <button value={6} onClick={props.clickBtn}>
      EA 5
    </button>{" "}
    </p>
    <p> 
    <button value={5} onClick={props.clickBtn}>
      EA 4-2
    </button>{" "}
    </p>
    <p> 
    <button value={4} onClick={props.clickBtn}>
      EA 4-1
    </button>{" "}
    </p>
    <p> 
    <button value={3} onClick={props.clickBtn}>
      EA 3
    </button>{" "}
    </p>
    <p> 
    <button value={2} onClick={props.clickBtn}>
      EA 2
    </button>{" "}
    </p>
    <p> 
    <button value={1} onClick={props.clickBtn}>
      EA 1
    </button>{" "}
    </p>
  </>
);