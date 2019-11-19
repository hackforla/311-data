import React from 'react';
import {DiscreteColorLegend} from 'react-vis';
import {getColorMap} from '../../Util/DataService.js';
// import './Styles/Legend.scss'


export default () => {
  const colorData = getColorMap(true);

  return (
    <div className="Legend">
      <DiscreteColorLegend
        items={colorData}
        
        orientation="horizontal" />
    </div>
  )
}
