(function(){
  let chartData = [];

  const selectors = document.querySelectorAll('.data-dropdown');
  const chartType = document.querySelector('.chart-type');
  const submitButton = document.querySelector('button');
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      type: chartType.value,
      columns: [],
    },
  });

  function displayChart() {
    getData(selectors[0].value)
      .then(() => { getData(selectors[1].value)
        .then(() => {
          console.log(chartData);
          updateChart(chartData, chartType.value);
        })
      })
    };

  function updateChart(data, type) {
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

  function getData(action) {
    return fetch(`/soda/${action}`)
      .then(res => res.json())
      .then(data => { chartData.push(...data); })
      .catch(err => { console.error('Fetch Error :-S', err); });
  };

  submitButton.onclick = e => {
    e.preventDefault();
    // chartData = [];
    updateChart(chartData, chartType.value);
  };

  displayChart();
})();
