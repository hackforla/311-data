import DataFrame from 'dataframe-js';
import colors from '@theme/colors';

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
  const discreteItems = [
    { title: 'Dead Animal Removal', color: colors.requestTypes.animalRemains },
    { title: 'Other', color: colors.requestTypes.other },
    { title: 'Homeless Encampment', color: colors.requestTypes.eWaste },
    { title: 'Single Streetlight Issue', color: colors.requestTypes.singleStreetlight },
    { title: 'Electronic Waste', color: colors.requestTypes.eWaste },
    { title: 'Feedback', color: colors.requestTypes.feedback },
    { title: 'Graffiti Removal', color: colors.requestTypes.graffiti },
    { title: 'Multiple Streetlight Issue', color: colors.requestTypes.multiStreetlight },
    { title: 'Metal/Household Appliances', color: colors.requestTypes.metalHouseholdAppliance },
    { title: 'Illegal Dumping Pickup', color: colors.requestTypes.illegalDumping },
    { title: 'Bulky Items', color: colors.requestTypes.bulkyItems },
    { title: 'Report Water Waste', color: colors.requestTypes.waterWaste },
  ];

  if (discrete) {
    return discreteItems;
  }

  const nonDiscreteItems = {};
  Object.values(discreteItems).forEach(item => {
    nonDiscreteItems[`'${item.title}'`] = item.color;
  });

  return nonDiscreteItems;
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
