import React from 'react';
import './Styles/HoverInfo.scss';

const HoverInfo = ({dataTitle, dataCount}) => {
  return (
    <div className="HoverInfo">
      Title: {dataTitle}
      <br/>
      Call Volume: {dataCount}
    </div>
  );
}

export default HoverInfo;
