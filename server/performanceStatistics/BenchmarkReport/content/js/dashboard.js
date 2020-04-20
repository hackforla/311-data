/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 66.74, "KoPercent": 33.26};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4892, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Prod_Request frequency"], "isController": false}, {"data": [0.967, 500, 1500, "Local_Base Pins"], "isController": false}, {"data": [0.998, 500, 1500, "Local_Healthcheck"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Healthcheck"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Time to close"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Request counts"], "isController": false}, {"data": [0.981, 500, 1500, "Local_Request counts"], "isController": false}, {"data": [0.977, 500, 1500, "Local_Request frequency"], "isController": false}, {"data": [0.969, 500, 1500, "Local_Time to close"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Base Pins"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5000, 1663, 33.26, 2853.2102000000054, 0, 39429, 14006.30000000001, 16587.9, 24825.879999999997, 1.6789335145686097, 67.56056663460463, 0.522773988098376], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Prod_Request frequency", 500, 293, 58.6, 6721.280000000001, 90, 30310, 17396.000000000004, 20042.5, 27664.780000000002, 0.16795048013683261, 0.07814847370382537, 0.06046709327348249], "isController": false}, {"data": ["Local_Base Pins", 500, 0, 0.0, 112.82200000000003, 10, 3722, 340.9000000000007, 573.3999999999994, 1910.8400000000038, 10.875948926543842, 2170.1111207597396, 3.655699575022296], "isController": false}, {"data": ["Local_Healthcheck", 500, 0, 0.0, 15.047999999999998, 0, 809, 29.800000000000068, 50.0, 411.7800000000002, 10.871219533407258, 2.622257055421477, 1.327053165699128], "isController": false}, {"data": ["Prod_Healthcheck", 500, 500, 100.0, 1020.3839999999997, 67, 15045, 3404.8000000000047, 5830.949999999999, 13101.900000000003, 0.16832936805451984, 0.041589189568157735, 0.022685012491722403], "isController": false}, {"data": ["Prod_Time to close", 500, 288, 57.6, 6905.382, 87, 30311, 18249.2, 20896.0, 26201.790000000005, 0.16796351295015483, 0.06288068405324175, 0.059651651127522264], "isController": false}, {"data": ["Prod_Request counts", 500, 295, 59.0, 6829.197999999998, 87, 30311, 18320.7, 20908.5, 26500.81000000001, 0.1679514391926776, 0.05304936464390432, 0.06538789088178201], "isController": false}, {"data": ["Local_Request counts", 500, 0, 0.0, 83.786, 10, 1913, 329.10000000000065, 440.79999999999995, 752.4900000000005, 10.87311079699902, 2.5706624782537784, 4.100713038218984], "isController": false}, {"data": ["Local_Request frequency", 500, 0, 0.0, 93.98000000000009, 15, 2418, 323.80000000000075, 460.9, 781.98, 10.87429317094389, 6.7047875774793395, 3.782576154034363], "isController": false}, {"data": ["Local_Time to close", 500, 0, 0.0, 106.29800000000003, 19, 1345, 398.7000000000018, 578.1999999999998, 915.9300000000001, 10.873347251217814, 4.328802715346642, 3.72915460404706], "isController": false}, {"data": ["Prod_Base Pins", 500, 287, 57.4, 6643.9239999999945, 86, 39429, 15768.100000000002, 20759.549999999996, 30380.29, 0.16816060548580256, 33.62770096937022, 0.05857211245959101], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 9, 0.5411906193625977, 0.18], "isController": false}, {"data": ["500\/Internal Server Error", 1154, 69.39266386049309, 23.08], "isController": false}, {"data": ["404\/Not Found", 500, 30.066145520144318, 10.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5000, 1663, "500\/Internal Server Error", 1154, "404\/Not Found", 500, "503\/Service Unavailable", 9, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Prod_Request frequency", 500, 293, "500\/Internal Server Error", 290, "503\/Service Unavailable", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Prod_Healthcheck", 500, 500, "404\/Not Found", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Prod_Time to close", 500, 288, "500\/Internal Server Error", 286, "503\/Service Unavailable", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Prod_Request counts", 500, 295, "500\/Internal Server Error", 293, "503\/Service Unavailable", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Prod_Base Pins", 500, 287, "500\/Internal Server Error", 285, "503\/Service Unavailable", 2, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
