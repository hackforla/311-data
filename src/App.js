import React from 'react';
import Header from './components/main/header/Header';
import Body from './components/main/body/Body';
import Footer from './components/main/footer/Footer';
// import MapContainer from './containers/Map/MapContainer.jsx'
// import FrequencyContainer from './containers/Graphs/FrequencyContainer.jsx'
// import TimeToCloseContainer from './containers/Graphs/TimeToCloseContainer.jsx'
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

  render() {
    return (
      <div className="main">
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}
export default App;
