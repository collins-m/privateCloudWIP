import React from 'react';
import ReactDOM from 'react-dom';

//import "./styles.css"; 
import {Button} from "./components/Button"

function App() {
  return (
    <div className="App">
      <Button onClick={()=>{console.log("You clicked on me")}}
      type = "button"
      buttonStyle = "btn--primary--jf"
      buttonSize="btn--jf"
      >Buy Now </Button>
    </div>
  );
}

const rootElement =  document.getElementById('root'); 
ReactDOM.render(<App/>, rootElement); 
