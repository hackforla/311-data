/* eslint-disable prefer-template */

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import COLORS from '@styles/COLORS';
import SnapshotService from './SnapshotService';
import PdfTemplate from './PdfTemplate';
import { imageToBlob } from './utils';

/*
  These functions prepare chart images, csvs, and pdfs
  to be exported. Each of the exported functions returns
  a promise that resolves with a Blob (or null).
*/

/* //////////////////// IMAGES ////////////////////// */

export function getImage(chartId) {
  return SnapshotService.snap({
    component: 'Visualizations',
    selectors: [`.chart.${chartId}`],
    options: {
      scale: 2.0,
      backgroundColor: COLORS.BACKGROUND,
    },
  })
    .then(([snapshot]) => imageToBlob(snapshot));
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

/* ///////////////////// PDFs //////////////////////// */

const chartStyle = { width: '90%' };
const pieStyle = { width: '55%' };

export function getSinglePagePdf(chartId, chartTitle) {
  const selector = ['contact-311', 'type-of-request'].includes(chartId)
    ? `.chart.${chartId}`
    : `.chart.${chartId} canvas`;

  return SnapshotService.snap({
    component: 'Visualizations',
    selectors: [
      '.criteria',
      '.legend',
      selector,
    ],
  })
    .then(([
      criteria,
      legend,
      chart,
    ]) => {
      const page = (() => {
        switch (chartId) {
          case 'time-to-close':
          case 'frequency':
          case 'total-requests':
            return [
              { img: criteria },
              { img: legend },
              { img: chart, style: chartStyle },
            ];
          case 'contact-311':
            return [
              { img: criteria },
              { img: chart, style: pieStyle },
            ];
          case 'type-of-request':
            return [
              { img: criteria },
              { img: legend },
              { img: chart, style: pieStyle },
            ];
          default:
            return [];
        }
      })();

      return pdf(
        <PdfTemplate
          pages={[page]}
          title={chartTitle}
        />,
      ).toBlob();
    });
}

export function getMultiPagePdf() {
  return SnapshotService.snap({
    component: 'Visualizations',
    selectors: [
      '.criteria',
      '.legend',
      '.number-of-requests',
      '.chart.time-to-close canvas',
      '.chart.frequency canvas',
      '.chart.total-requests canvas',
      '.chart.contact-311',
      '.chart.type-of-request',
    ],
  })
    .then(([
      criteria,
      legend,
      numberOfRequests,
      timeToClose,
      frequency,
      totalRequests,
      contact311,
      typeOfRequest,
    ]) => {
      const pages = [
        [
          { img: criteria },
          { img: legend },
          { img: numberOfRequests },
        ],
        [
          { img: criteria },
          { img: legend },
          { img: timeToClose, style: chartStyle },
        ],
        [
          { img: criteria },
          { img: legend },
          { img: frequency, style: chartStyle },
        ],
        [
          { img: criteria },
          { img: legend },
          { img: totalRequests, style: chartStyle },
        ],
        [
          { img: criteria },
          { img: contact311, style: pieStyle },
        ],
        [
          { img: criteria },
          { img: legend },
          { img: typeOfRequest, style: pieStyle },
        ],
      ];

      return pdf(
        <PdfTemplate
          pages={pages}
          title="Charts"
        />,
      ).toBlob();
    });
}
