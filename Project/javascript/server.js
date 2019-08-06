const express = require('express');
const path = require('path');
const Socrata = require('node-socrata');

const app = express();
const port = 3000;

const resource = {
  2015: 'ms7h-a45h',
  2016: 'ndkd-k878',
  2017: 'd4vt-q4t5',
  2018: 'h65r-yf5i',
  2019: 'pvft-t768',
};

const config = year => {
  return {
    hostDomain: 'https://data.lacity.org',
    resource: resource[year],
    // XAppToken: process.env.SODAPY_APPTOKEN || 'registered-app-token',
  }
};

const params = (requestType = 'Bulky Items', total = false) => {
  return {
    $select: total ? ['count(requesttype)'] : ['createddate', 'zipcode', 'requesttype'],
    $where: `requesttype="${requestType}"`,
    $limit: 100,
  };
}

const newSoda = year => new Socrata(config(year));

const parseDataByYear = (data, type) => {
  const returnData = [];
  const parsedData = data.reduce((acc, cur) => {
    const year = cur.createddate.slice(0, 4);
    if (acc[year]) acc[year].push(parseInt(cur[type]));
    else acc[year] = [];
    return acc;
  }, {});

  for (let key in parsedData) {
    parsedData[key].unshift(key);
    returnData.push(parsedData[key]);
  }

  return returnData;
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/soda/:year/:requestType', (req, res) => {
  const { year, requestType } = req.params;
  const soda = newSoda(year);

  soda.get(params(requestType), (err, response, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const toSend = parseDataByYear(data, 'zipcode');
      res.send(toSend);
    }
  });
})

app.get('/soda/:year/:requestType/total', (req, res) => {
  const { year, requestType } = req.params;
  const soda = newSoda(year);

  soda.get(params(requestType, true), (err, response, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const toSend = [year, parseInt(data[0].count_requesttype)];
      res.send(toSend);
    }
  })
});

app.listen(port, () => { console.log(`Listening on port: ${port}`)});

