import React from 'react';
import './App.css';
import TreeMapVis from './components/TreeMapVis/TreeMapVis.js';

 class App extends React.Component{
   constructor(props){
     super(props);
     this.state = {selectedId: ""}
   }

   handleMockSelected = (e) => {
    this.setState({selectedId: e.target.value});
   }

  render(){
    const prototypeMap = {
      TreeMapVis: <TreeMapVis/>,
      // PinMap: <PinMap/>
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
