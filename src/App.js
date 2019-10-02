import React from 'react';
import './App.css';
import TreeMapVis from './components/TreeMapVis/TreeMapVis.js';
import CandleStick from './components/CandleStick/CandleStick.js';
import PinMap from './components/PinMap/PinMap.jsx';
import HeatMap from './components/HeatMap/HeatMap.js';

 class App extends React.Component{
   constructor(props){
     super(props);
     this.state = {
       selectedId: "TreeMapVis"
      }
   }

   handleMockSelected = (e) => {
    this.setState({selectedId: e.target.value});
   }

  render(){
    const prototypeMap = {
      TreeMapVis: <TreeMapVis/>,
      CandleStick: <CandleStick/>,
      PinMap: <PinMap/>,
      HeatMap:<HeatMap/>
    }

    return (
      <div className="App" >
        {Object.keys(prototypeMap).map( proto =>
          <div key={proto}>
            <input type="radio" name="prototypes" value={proto} onClick={this.handleMockSelected}/>{proto}<br/>
          </div>
        )}
        { prototypeMap[this.state.selectedId] }
      </div>
    );
  }
}

export default App;
