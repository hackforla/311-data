
const fs = require('fs');
const openRequests = require('../src/data/open_requests_new.json');

function getCounts(idField) {
  const counts = {};

  openRequests.forEach(req => {
    let { requesttype } = req;
    let districtId = req[idField];

    if (!districtId)
      return;

    districtId = Number(districtId);

    if (!counts[districtId])
      counts[districtId] = {
        [requesttype]: 1
      };
    else
      counts[districtId][requesttype] = (counts[districtId][requesttype] || 0) + 1;
  });

  return counts;
}

fs.writeFileSync(__dirname + '/../src/data/ncCounts.json', JSON.stringify(getCounts('nc')));
fs.writeFileSync(__dirname + '/../src/data/ccCounts.json', JSON.stringify(getCounts('cd')));
