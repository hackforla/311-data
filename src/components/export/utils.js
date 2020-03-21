import html2canvas from 'html2canvas';

/* /////////// CANVAS MANIPULATION /////////// */

function addBackgroundToCanvas(canvas, color) {
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/* //////////// BLOB CONVERSION ////////////// */

// https://stackoverflow.com/questions/6850276/
function dataUrltoBlob(dataUrl) {
  const mime = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const binary = atob(dataUrl.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i += 1) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

export function canvasToBlob(canvas, options = {}) {
  if (options.backgroundColor) {
    addBackgroundToCanvas(canvas, options.backgroundColor);
  }
  const dataUrl = canvas.toDataURL();
  return dataUrltoBlob(dataUrl);
}

export function elementToBlob(element, options = {}) {
  return html2canvas(element, options).then(canvas => {
    const dataUrl = canvas.toDataURL();
    return dataUrltoBlob(dataUrl);
  });
}

/* ///////// OPENING and DOWNLOADING //////////// */

function openObjectUrl(objectUrl) {
  window.open(objectUrl);
  URL.revokeObjectURL(objectUrl);
}

function downloadObjectUrl(objectUrl, filename) {
  const downloadLink = document.createElement('a');
  downloadLink.href = objectUrl;
  downloadLink.download = filename;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(objectUrl);
}

export const openWindow = {
  canvas: canvas => {
    const dataUrl = canvas.toDataURL();
    const blob = dataUrltoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    openObjectUrl(url);
  },
  blob: blob => {
    const url = URL.createObjectURL(blob);
    openObjectUrl(url);
  },
};

export const download = {
  canvas: (canvas, filename) => {
    const dataUrl = canvas.toDataURL();
    const blob = dataUrltoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    downloadObjectUrl(url, filename);
  },
  blob: (blob, filename) => {
    const url = URL.createObjectURL(blob);
    downloadObjectUrl(url, filename);
  },
};
