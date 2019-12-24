import React from 'react';
import { DiscreteColorLegend } from 'react-vis';
import { getColorMap } from '../../../Util/DataService';

const Legend = () => {
  const colorData = getColorMap(true);

  return (
    <div className="Legend">
      <DiscreteColorLegend
        items={colorData}
        orientation="vertical"
      />
    </div>
  );
};

export default Legend;
