/* eslint-disable prefer-template */

import SnapshotService from './SnapshotService';
import { imageToBlob } from './utils';
import imageToPdf from './ImageToPdf';

/*
  These functions prepare chart images, csvs, and pdfs
  to be exported. Each of the exported functions returns
  a promise that resolves with a Blob (or null).
*/

/* //////////////////// IMAGES ////////////////////// */

export function getImage(componentName) {
  return SnapshotService.snap({
    componentName,
    templateName: 'ChartImage',
    options: {
      scale: 2.0,
    },
  })
    .then(imageToBlob);
}

/* ///////////////////// PDFs //////////////////////// */

export function getSinglePagePdf({ componentName, templateName, pdfTitle }) {
  return SnapshotService.snap({
    componentName,
    templateName,
  })
    .then(snapshot => imageToPdf({
      images: [snapshot],
      title: pdfTitle,
    }));
}

export function getMultiPagePdf() {
  const { snap } = SnapshotService;
  return Promise.all([
    snap({ componentName: 'NumberOfRequests', templateName: 'VisPage' }),
    snap({ componentName: 'TimeToClose', templateName: 'VisPage' }),
    snap({ componentName: 'Frequency', templateName: 'VisPage' }),
    snap({ componentName: 'TotalRequests', templateName: 'VisPage' }),
    snap({ componentName: 'Contact311', templateName: 'VisPageNoLegend' }),
    snap({ componentName: 'TypeOfRequest', templateName: 'VisPage' }),
  ])
    .then(snapshots => imageToPdf({
      images: snapshots,
      title: 'Charts',
    }));
}

/* ////////////////////// CSVs ////////////////////// */

export function getCsv(data) {
  if (!data) return Promise.resolve(null);

  const { header, rows, index } = data;
  const headerRow = (index ? ',' : '') + header.join(',') + '\r\n';
  const otherRows = rows.map((row, i) => (
    (index ? index[i] + ',' : '') + row.join(',')
  )).join('\r\n');

  const blob = new Blob([headerRow + otherRows], {
    type: 'text/csv;charset=utf-8;',
  });

  return Promise.resolve(blob);
}
