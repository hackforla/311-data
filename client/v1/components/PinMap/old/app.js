// (function () {
//   let chartData = [];
//
//   const chart = c3.generate({
//     bindto: '#chart',
//     data: {
//       type: getChartTypeDisplay(),
//       columns: [],
//     },
//     axis: {
//       x: {
//         show: false,
//       },
//     },
//   });
//
//   function getChartTypeDisplay() {
//     return document.querySelector('.chart-type').value;
//   }
//
//   function getDatasetsToDisplay() {
//     return document.querySelectorAll('.data-dropdown');
//   }
//
//   function getRequestType() {
//     return document.querySelector('.request-dropdown').value;
//   }
//
//   function getDisplayTotal() {
//     return document.querySelector('input[name="total"]').checked;
//   }
//
//   function getData(year, requestType) {
//     return fetch(`/soda/${year}/${requestType}`)
//       .then((res) => res.json())
//       .then((data) => { chartData.push(...data); })
//       .catch((err) => { console.error('Fetch Error :-S', err); });
//   }
//
//   function getTotal(year, requestType) {
//     return fetch(`/soda/${year}/${requestType}/total`)
//       .then((res) => res.json())
//       .then((data) => { chartData.push(data); })
//       .catch((err) => { console.error('Fetch Error :-S', err); });
//   }
//
//   function buildChart() {
//     const requestType = getRequestType();
//     const chartType = getChartTypeDisplay();
//     const displayTotal = getDisplayTotal();
//     const datasets = [...getDatasetsToDisplay()]
//       .map((dataset) => {
//         const { value } = dataset;
//         if (!displayTotal) return getData(value, requestType);
//         return getTotal(value, requestType);
//       });
//
//     Promise.all(datasets)
//       .then(() => { renderChart(chartData, chartType); })
//       .catch((err) => { console.error('Render Error :-S', err); });
//   }
//
//   function renderChart(columns, type) {
//     chart.load({ columns, type });
//   }
//
//   document.querySelector('button').onclick = (e) => {
//     e.preventDefault();
//     chart.unload();
//     chartData = [];
//     buildChart();
//   };
//
//   buildChart();
// }());
