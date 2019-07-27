(function(){
  let chartData = [];
  let countRequestType = [];

  const chart = c3.generate({
    bindto: '#chart',
    data: {
      type: document.querySelector('.chart-type').value,
      columns: [],
    },
    axis: {
        x: {
          show: false,
        }
      }
  });

  function buildChart() {
    const requestType = document.querySelector('.request-dropdown').value;
    const chartType = document.querySelector('.chart-type').value;
    const datasets = document.querySelectorAll('.data-dropdown');

    getData(datasets[0].value, requestType)
      .then(() => {
        getTotal(datasets[0].value, requestType)
          .then(() => {
            getData(datasets[1].value, requestType)
              .then(() => {
                getTotal(datasets[1].value, requestType)
                  .then(() => {
                    renderChart(chartData, countRequestType, chartType);
                  })
              })
          })
      })
   };

  function renderChart(chartData, countRequestType, type) {
    const isDisplayTotal = document.querySelector('input[name="total"]').checked;
    let columns = [];

    if (!isDisplayTotal) {
      const newData = chartData.reduce((acc, cur) => {
        const date = cur.createddate.slice(0, 4);
        if (acc[date]) acc[date].push(parseInt(cur.zipcode));
        else acc[date] = [];
        return acc;
      }, {})

      for (let key in newData) {
        newData[key].unshift(key);
        columns.push(newData[key]);
      }
    } else {
      columns = countRequestType;
    }

    chart.load({ columns, type });
  };

  function getData(year, requestType) {
    return fetch(`/soda/${year}/${requestType}`)
      .then(res => res.json())
      .then(data => { chartData.push(...data); })
      .catch(err => { console.error('Fetch Error :-S', err); });
  };

  function getTotal(year, requestType) {
    return fetch(`/soda/${year}/${requestType}/total`)
      .then(res => res.json())
      .then(data => { countRequestType.push([year, parseInt(data[0].count_requesttype)]); })
      .catch(err => { console.error('Fetch Error :-S', err); })
  }

  document.querySelector('button').onclick = e => {
    e.preventDefault();
    chartData = [];
    countRequestType = [];
    buildChart();
  };

  buildChart();
})();
