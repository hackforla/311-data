const express = require('express');
const path = require('path');
const Socrata = require('node-socrata');

const resource = {
  2016: 'ndkd-k878',
  2017: 'd4vt-q4t5',
};

const config = year => {
  return {
    hostDomain: 'https://data.lacity.org',
    resource: resource[year],
    XAppToken: process.env.SODAPY_APPTOKEN || 'registered-app-token',
  }
};

const request = 'Bulky Items';

const params = {
  $select: ['count(requesttype)'],
  $where: `requesttype="${request}"`,
  $limit: 1000,
}

const port = 3000;

const app = express();
const newSoda = year => new Socrata(config(year));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/soda/:year', (req, res) => {
  const { year } = req.params;
  const soda = newSoda(year);

  soda.get(params, (err, response, data) => {
    if (err) console.error(err);
    else res.send(data);
  });
})

app.listen(port, () => { console.log(`Listening on port: ${port}`)});
