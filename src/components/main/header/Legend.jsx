import React from 'react';
import {DiscreteColorLegend} from 'react-vis';
import {getColorMap} from '../../../Util/DataService.js';


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
