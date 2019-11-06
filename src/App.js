import React from 'react';
import './App.css';
import Header from './containers/Header/Header.jsx'
import MapContainer from './containers/Map/MapContainer.jsx'
import FrequencyContainer from './containers/Graphs/FrequencyContainer.jsx'
import TimeToCloseContainer from './containers/Graphs/TimeToCloseContainer.jsx'
// import TreeMapVis from './components/TreeMapVis/TreeMapVis.js';
// import CandleStick from './components/CandleStick/CandleStick.js';
// import PinMap from './components/PinMap/PinMap.jsx';
// import HeatMap from './components/HeatMap/HeatMap.js';
// import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.js';


 class App extends React.Component{
   constructor(props){
     super(props);
     this.state = {
       loading:false
     }
   }

   handleLoadingChanged = (loadingState) => {
     this.setState({loading:loadingState});
   }

  render(){
    return (
      <div className="App" >
        <Header/>
        <MapContainer/>
        <TimeToCloseContainer/>
        <FrequencyContainer/>
      </div>
    );
  }
}
export default App;
