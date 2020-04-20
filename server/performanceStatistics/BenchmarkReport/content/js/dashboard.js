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

    var data = {"OkPercent": 82.08, "KoPercent": 17.92};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4016, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Prod_Request frequency"], "isController": false}, {"data": [0.754, 500, 1500, "Local_Base Pins"], "isController": false}, {"data": [0.96, 500, 1500, "Local_Healthcheck"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Healthcheck"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Time to close"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Request counts"], "isController": false}, {"data": [0.8, 500, 1500, "Local_Request counts"], "isController": false}, {"data": [0.777, 500, 1500, "Local_Request frequency"], "isController": false}, {"data": [0.725, 500, 1500, "Local_Time to close"], "isController": false}, {"data": [0.0, 500, 1500, "Prod_Base Pins"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5000, 896, 17.92, 7250.049000000013, 0, 83462, 22807.200000000004, 29850.349999999988, 34845.56999999997, 0.702124023468355, 657.2849487750938, 0.2307514147096949], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Prod_Request frequency", 500, 109, 21.8, 16148.139999999987, 100, 31843, 30233.300000000014, 30412.0, 30622.99, 0.07086288315560922, 0.04460015751047353, 0.027000557735179734], "isController": false}, {"data": ["Local_Base Pins", 500, 0, 0.0, 500.75399999999996, 8, 4494, 1506.1000000000004, 1800.2999999999997, 2649.000000000001, 2.149955065939122, 6921.3867796374, 0.7703683719572761], "isController": false}, {"data": ["Local_Healthcheck", 500, 0, 0.0, 77.29999999999997, 0, 1885, 39.900000000000034, 659.6499999999996, 1585.88, 2.1497424608531897, 0.5185413943659549, 0.2624197339908679], "isController": false}, {"data": ["Prod_Healthcheck", 500, 500, 100.0, 3621.2419999999997, 66, 33791, 10906.800000000003, 16877.1, 30412.99, 0.07038867924793919, 0.017899071256571662, 0.009485974351773056], "isController": false}, {"data": ["Prod_Time to close", 500, 99, 19.8, 16485.728000000006, 100, 50956, 29707.4, 30387.85, 31020.010000000002, 0.07059491606476265, 0.037879825577258164, 0.026553753731117805], "isController": false}, {"data": ["Prod_Request counts", 500, 108, 21.6, 16201.674000000006, 108, 52114, 30000.600000000002, 30411.65, 30618.98, 0.07113231549628875, 0.023846691979219688, 0.02918717285358949], "isController": false}, {"data": ["Local_Request counts", 500, 0, 0.0, 414.2040000000003, 9, 2670, 1182.9, 1389.5, 2027.95, 2.150889177586014, 0.6185066672187283, 0.85892314523449], "isController": false}, {"data": ["Local_Request frequency", 500, 0, 0.0, 480.66800000000006, 14, 3133, 1386.1000000000004, 1530.9, 2393.750000000001, 2.1507874032683367, 1.4052035075040972, 0.7958711535855776], "isController": false}, {"data": ["Local_Time to close", 500, 0, 0.0, 552.726, 17, 3092, 1643.9, 1846.1, 2608.0600000000018, 2.1505746335420826, 1.3184492622991362, 0.7852915681882698], "isController": false}, {"data": ["Prod_Base Pins", 500, 80, 16.0, 18018.053999999996, 97, 83462, 33280.20000000002, 39541.799999999996, 51884.66, 0.07033333075444453, 431.74199057766344, 0.02597456610489091], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 162, 18.080357142857142, 3.24], "isController": false}, {"data": ["500\/Internal Server Error", 242, 27.008928571428573, 4.84], "isController": false}, {"data": ["404\/Not Found", 492, 54.910714285714285, 9.84], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5000, 896, "404\/Not Found", 492, "500\/Internal Server Error", 242, "503\/Service Unavailable", 162, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Prod_Request frequency", 500, 109, "500\/Internal Server Error", 63, "503\/Service Unavailable", 46, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Prod_Healthcheck", 500, 500, "404\/Not Found", 492, "503\/Service Unavailable", 8, null, null, null, null, null, null], "isController": false}, {"data": ["Prod_Time to close", 500, 99, "500\/Internal Server Error", 56, "503\/Service Unavailable", 43, null, null, null, null, null, null], "isController": false}, {"data": ["Prod_Request counts", 500, 108, "500\/Internal Server Error", 66, "503\/Service Unavailable", 42, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Prod_Base Pins", 500, 80, "500\/Internal Server Error", 57, "503\/Service Unavailable", 23, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
