import DataFrame from 'dataframe-js';
import { Row } from 'dataframe-js';

const colorMap = {
        "Dead Animal Removal":"#FFB0AA",
        "Other":"#552900",
        "Homeless Encampment":"#427A82",
        "Single Streetlight Issue":"#D4726A",
        "Electronic Waste":"#69969C",
        "Feedback":"#82C38D",
        "Graffiti Removal":"#801D15",
        "Multiple Streetlight Issue":"#AA4139",
        "Metal/Household Appliances":"#D49D6A",
        "Illegal Dumping Pickup":"#804815",
        "Bulky Items":"#51A35F",
        "Report Water Waste":"#012E34"
    };

export function getBroadCallVolume(onBroadDataReady){
  let treemap_data = {"title": "Broad 311 Calls Map", "color": "#000000", "children": []};

  const SR_Data = DataFrame.fromJSON('https://data.lacity.org/resource/h65r-yf5i.json?$select=count(*)+AS+CallVolume,NCName,RequestType&$group=NCName,RequestType&$order=CallVolume DESC').then(df => {
    df.show();

    const totalCounts = df.groupBy("ncname").aggregate(group => group.stat.sum("callvolume")).rename("aggregation", "callvolume");
    let biggestProblems = {};
    df.toCollection().forEach(row => {
      const rhs = parseInt(row.callvolume);
      const lhs = parseInt(biggestProblems[row.ncname]);
      if(!lhs){
        biggestProblems[row.ncname] = rhs;
        biggestProblems[`${row.ncname}_biggestproblem`] = row.requesttype;
      }
      else if (lhs < rhs){
        biggestProblems[row.ncname] = rhs;
        biggestProblems[`${row.ncname}_biggestproblem`] = row.requesttype;
      }
    });

    totalCounts.toCollection().forEach(row => {
      const biggestProblem = biggestProblems[`${row.ncname}_biggestproblem`];
      const data_point = {"title": row.ncname, "color": colorMap[biggestProblem] , "size": row.callvolume};
      treemap_data["children"].push(data_point);
    })
    onBroadDataReady(treemap_data);
  });
}

export function getZoomedCallVolume(ncName, onZoomedDataReady){
  let treemap_data = {"title": "Zoomed 311 Calls Map", "color": "#000000", "children": []};

  const SR_Data = DataFrame.fromJSON(`https://data.lacity.org/resource/h65r-yf5i.json?$select=count(*)+AS+CallVolume,NCName,RequestType&$where=NCName+=+'${ncName}'&$group=NCName,RequestType&$order=CallVolume DESC`).then(df => {
    df.toCollection().forEach(row => {
      const data_point = {"title": row.requesttype, "color": colorMap[row.requesttype] , "size": row.callvolume};
      treemap_data["children"].push(data_point);
    })
    onZoomedDataReady(treemap_data);
  });
}
