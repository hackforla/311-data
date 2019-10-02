import React from 'react';

const CandleStick = () => {
  return (
    <div>
      <img src={process.env.PUBLIC_URL + '/candlestick.png'} alt="candlestick"/>
    </div>
  );
}

export default CandleStick;
