import React from 'react';

const HeatMap = () => {
  return (
    <div>
      <img src={process.env.PUBLIC_URL + '/heatmap.png'} alt="heatmap"/>
    </div>
  );
}

export default HeatMap;
