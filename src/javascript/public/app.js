(function(){
  let chartData = [];

  const chart = c3.generate({
    bindto: '#chart',
    data: {
      type: 'bar',
      columns: [],
    },
  });

  function buildChart() {
    const requestType = document.querySelector('.request-dropdown').value;
    const chartType = document.querySelector('.chart-type').value;
    const datasets = document.querySelectorAll('.data-dropdown');

    getData(datasets[0].value, requestType)
      .then(() => { getData(datasets[1].value, requestType)
        .then(() => {
          renderChart(chartData, chartType);
        })
      })
    };

  function renderChart(data, type) {
    let columns = [];
    const newData = data.reduce((acc, cur) => {
      const date = cur.createddate.slice(0, 4);
      if (acc[date]) acc[date].push(parseInt(cur.zipcode));
      else acc[date] = [];
      return acc;
    }, {})

    for (let key in newData) {
      newData[key].unshift(key);
      columns.push(newData[key]);
    }

    chart.load({ columns, type });
  };

  function getData(year, requestType) {
    return fetch(`/soda/${year}/${requestType}`)
      .then(res => res.json())
      .then(data => { chartData.push(...data); })
      .catch(err => { console.error('Fetch Error :-S', err); });
  };

  document.querySelector('button').onclick = e => {
    e.preventDefault();
    chartData = [];
    buildChart();
  };

  buildChart();
})();
