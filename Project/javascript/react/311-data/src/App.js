import React from 'react';
import './App.css';
import ApiButtons from './components/ApiButtons.js';
import TreeMapVis from './components/TreeMapVis.js';
import Legend from './components/Legend.js';

function App() {
  return (
    <div className="App">
      <Legend />
      <TreeMapVis />
    </div>
  );
}

export default App;
