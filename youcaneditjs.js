/* 
 *  youcanedit.js
 *  - core javascript client-side application that simulates 'web scraping'
 *  - captures 'Product Name', 'Specifications (names and values)', 'SessionId' details
 *  - sends captured data to a back-end application and displays the response
 *  
 *  Aziz | 16 Jul 2017 | VeAsia Client-side – server-side Assessment
 */



// ensure code is executed in "strict mode"
"use strict";



/**
 * takes an array of specifications as `<td>` elements
 * and returns extracted specifications data as an object 
 * 
 * please note that the elements are expected in a linear format ...
 * ... where the name and value pairs are singular and in succession
 * ... i.e.  arr[0] = "Depth", arr[1] = "2.89", arr[2] = "Height", arr[3] = "3.51" etc  
 */
var toSpecsObject = function (elements) {
    var specsDataObject = {}, name, value;
    for (var i = 0; i < elements.length; i = i + 2) {
        name = elements[i].innerText;
        value = elements[i + 1].innerText;
        specsDataObject[name] = value;
    }
    return specsDataObject;
};


/**
 * parses the html document, and extracts the product name and specifications 
 * to be returned in the form of a js object
 */
var getScrapedData = function () {

    var scrapedDataObj = {},
        headings,
        elements;

    // product name 
    // assuming that there is only one product per page
    // and that the first heading is the product name 
    headings = document.getElementsByTagName('h4');
    scrapedDataObj.name = headings[0].innerText;

    // specifications
    // assuming that the specifications table is always immediately adjacent to the heading i.e. `<h4>`
    // unlike the nutrition table that appears more deeply nested
    // extract the table in a way that the number of specifications can be variable
    // 
    // please note that the `querySelectorAll` method returns a non-live html collection, 
    // ... potentially problematic if page contents change after event handler & before order button clicking ...
    // ... but for the purpose of this example simplicity has been preferred 
    elements = document.querySelectorAll("h4 + table td");
    scrapedDataObj.specifications = toSpecsObject(elements);

    return scrapedDataObj;
};


/**
 * converts data object into a formatted string
 * ready for display in the textarea
 */
var toOrderDisplayText = function (processedDataObject) {

    var orderDisplayText = '',
        processedDate,
        displayTime;

    // prepare product data
    for (var productKey in processedDataObject.order) {
        orderDisplayText += productKey;
        for (var specKey in processedDataObject.order[productKey]) {
            var spec = processedDataObject.order[productKey][specKey];
            orderDisplayText += '\n  ' + specKey + ': ' + spec;
        }
    }

    // prepare time to be displayed
    // assuming the preferred format is dd/mm/yyyy
    processedDate = new Date(processedDataObject.time);
    displayTime = processedDate.getDate()
        + '/' + processedDate.getMonth()
        + '/' + processedDate.getFullYear()
        + ' ' + processedDate.getHours()
        + ':' + processedDate.getMinutes();
    orderDisplayText += '\n' + displayTime;

    return orderDisplayText;
};


/**
 * prepares ajax request using Web API based XMLHttpRequest object (instead of jQuery)
 * to enable sending of a 'PUT' request to the back-end (node.js based server)
 * the URI 'localhost:8080/process?sid=...' also includes the session id
 */
var ajaxRequest = function () {

    // send data to backend
    // using the Web API directly instead of jQuery
    // although debatable, 'PUT' is often used to update a resource
    var request = new XMLHttpRequest();
    request.open('PUT', 'http://localhost:8080/process?sid=' + document.getElementById('session_id').value);
    request.setRequestHeader('Content-Type', 'application/json');

    return request;
}



// iterate through all inputs on the page
// find the button with value 'Order', 
// assuming there is only one, stop iteration once found 
var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].type === 'button' && inputs[i].value === 'Order') {

        // add click handler to enable start of data 'web scraping'
        inputs[i].onclick = function () {
            var scrapedDataObj = getScrapedData();

            // callback to handle a successful ajax response from server
            // displays processed data within “order processed” grey container
            var request = ajaxRequest();
            request.onload = function () {

                // SUCCESS
                if (request.status === 200) {

                    // parse json to facilitate required formatting of textarea display text
                    // response object contains 3 properties: processed order, process time, session id 
                    var processedDataObject = JSON.parse(request.responseText);

                    // assuming only one textarea per page, display data string
                    document.getElementsByTagName('textarea')[0].innerText = toOrderDisplayText(processedDataObject);
                }
            };

            request.send(JSON.stringify(scrapedDataObj));
        }

        break;
    }
}
