import React from 'react';
import './App.css';
import TreeMapVis from './components/TreeMapVis/TreeMapVis.js';
import CandleStick from './components/CandleStick/CandleStick.js';
import PinMap from './components/PinMap/PinMap.js';
import HeatMap from './components/HeatMap/HeatMap.js';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.js';

 class App extends React.Component{
   constructor(props){
     super(props);
     this.state = {
       selectedId: "",
       loading:false
     }
   }

   handleMockSelected = (e) => {
    this.setState({selectedId: e.target.value});
   }

   handleLoadingChanged = (loadingState) => {
     this.setState({loading:loadingState});
   }

  render(){
    const prototypeMap = {
      TreeMapVis: <TreeMapVis loadingChanged={this.handleLoadingChanged}/>,
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
        { this.state.loading &&
          <LoadingSpinner/>}
      </div>
    );
  }
}

export default App;
