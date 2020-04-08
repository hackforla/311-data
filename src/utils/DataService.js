import DataFrame from 'dataframe-js';

const dataResources = {
  2019: 'pvft-t768',
  2018: 'h65r-yf5i',
  2017: 'd4vt-q4t5',
  2016: 'ndkd-k878',
  2015: 'ms7h-a45h',
};

export function getDataResources() {
  return dataResources;
}

export function getColorMap(discrete) {
  if (discrete) {
    return [
      { title: 'Dead Animal Removal', color: '#3b69a6' },
      { title: 'Other', color: '#0dd311' },
      { title: 'Homeless Encampment', color: '#c1614e' },
      { title: 'Single Streetlight Issue', color: '#304bb5' },
      { title: 'Electronic Waste', color: '#41a84b' },
      { title: 'Feedback', color: '#c2f961' },
      { title: 'Graffiti Removal', color: '#4d6173' },
      { title: 'Multiple Streetlight Issue', color: '#9f2826' },
      { title: 'Metal/Household Appliances', color: '#306088' },
      { title: 'Illegal Dumping Pickup', color: '#b6d4df' },
      { title: 'Bulky Items', color: '#7f2a10' },
      { title: 'Report Water Waste', color: '#f7a6ce' },
    ];
  }
  return {
    'Dead Animal Removal': '#3b69a6',
    Other: '#0dd311',
    'Homeless Encampment': '#c1614e',
    'Single Streetlight Issue': '#304bb5',
    'Electronic Waste': '#41a84b',
    Feedback: '#c2f961',
    'Graffiti Removal': '#4d6173',
    'Multiple Streetlight Issue': '#9f2826',
    'Metal/Household Appliances': '#306088',
    'Illegal Dumping Pickup': '#b6d4df',
    'Bulky Items': '#7f2a10',
    'Report Water Waste': '#f7a6ce',
  };
}

export function getBroadCallVolume(year, startMonth = 0, endMonth = 13, onBroadDataReady) {
  const treemapData = { title: 'Broad 311 Calls Map', color: '#FFFFFF', children: [] };
  const start = Math.min(startMonth, endMonth);
  const end = Math.max(startMonth, endMonth);

  DataFrame.fromJSON(`https://data.lacity.org/resource/${dataResources[year]}.json?$select=count(*)+AS+CallVolume,NCName,RequestType&$where=date_extract_m(CreatedDate)+between+${start}+and+${end}&$group=NCName,RequestType&$order=CallVolume DESC`)
    .then(df => {
      df.show();

      const totalCounts = df.groupBy('ncname').aggregate(group => group.stat.sum('callvolume')).rename('aggregation', 'callvolume');
      const biggestProblems = {};
      df.toCollection().forEach(row => {
        const rhs = parseInt(row.callvolume, 10);
        const lhs = parseInt(biggestProblems[row.ncname], 10);
        if (!lhs) {
          biggestProblems[row.ncname] = rhs;
          biggestProblems[`${row.ncname}_biggestproblem`] = row.requesttype;
        } else if (lhs < rhs) {
          biggestProblems[row.ncname] = rhs;
          biggestProblems[`${row.ncname}_biggestproblem`] = row.requesttype;
        }
      });
      const colorMap = getColorMap(false);
      totalCounts.toCollection().forEach(row => {
        const biggestProblem = biggestProblems[`${row.ncname}_biggestproblem`];
        const dataPoint = {
          title: row.ncname,
          color: colorMap[biggestProblem],
          size: row.callvolume,
        };
        treemapData.children.push(dataPoint);
      });
      onBroadDataReady(treemapData);
    });
}

export function getZoomedCallVolume(
  ncName,
  year,
  startMonth = 0,
  endMonth = 13,
  onZoomedDataReady,
) {
  const treemapData = { title: 'Zoomed 311 Calls Map', color: '#FFFFFF', children: [] };
  const start = Math.min(startMonth, endMonth);
  const end = Math.max(startMonth, endMonth);

  DataFrame.fromJSON(`https://data.lacity.org/resource/${dataResources[year]}.json?$select=count(*)+AS+CallVolume,NCName,RequestType&$where=NCName+=+'${ncName}'+and+date_extract_m(CreatedDate)+between+${start}+and+${end}&$group=NCName,RequestType&$order=CallVolume DESC`).then(df => {
    const colorMap = getColorMap(false);
    df.toCollection().forEach(row => {
      const dataPoint = {
        title: row.requesttype,
        color: colorMap[row.requesttype],
        size: row.callvolume,
      };
      treemapData.children.push(dataPoint);
    });
    onZoomedDataReady(treemapData);
  });
}
