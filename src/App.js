import React from 'react';
import './App.css';
import TreeMapVis from './components/TreeMapVis/TreeMapVis.js';
import PinMap from './components/TreeMapVis/TreeMapVis.jsx';

function App() {
  return (
    <div className="App">
      <TreeMapVis />
      <PinMap />
    </div>
  );
}

export default App;
