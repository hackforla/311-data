import React from 'react';
import { renderToString } from 'react-dom/server';

export default function RequestPopup({
  addPopup,
  requestId,
  pinsInfo,
  getPinInfo
}) {
  const loadingContent = () => {
    return renderToString(
      <div>loading</div>
    );
  }

  const requestContent = pinInfo => {
    return renderToString(
      <div>{ pinInfo.srnumber }</div>
    );
  }

  if (pinsInfo[requestId])
    addPopup(requestContent(pinsInfo[requestId]));
  else {
    const popup = addPopup(loadingContent());
    getPinInfo(requestId).then(() => {
      popup.setHTML(requestContent(pinsInfo[requestId]));
    });
  }
}
