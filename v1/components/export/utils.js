import html2canvas from 'html2canvas';

function addBackgroundToCanvas(canvas, color) {
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function elementToCanvas(element, options = {}) {
  return html2canvas(element, options);
}

export function canvasToImage(canvas, options = {}) {
  if (options.backgroundColor) {
    addBackgroundToCanvas(canvas, options.backgroundColor);
  }
  return Promise.resolve(canvas.toDataURL());
}

export function elementToImage(element, options = {}) {
  return elementToCanvas(element, options).then(canvasToImage);
}

// https://stackoverflow.com/questions/6850276/
export function imageToBlob(dataUrl) {
  const mime = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const binary = atob(dataUrl.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i += 1) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: mime });
  return Promise.resolve(blob);
}

export function openBlob(blob) {
  const objectUrl = URL.createObjectURL(blob);
  window.open(objectUrl);
  URL.revokeObjectURL(objectUrl);
}

export function downloadBlob(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = objectUrl;
  downloadLink.download = filename;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(objectUrl);
}
