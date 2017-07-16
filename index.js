/* 
 *  app.js
 *  - simple node.js back-end that receives data
 *  - and returns it after processing (i.e. capitalize)
 *  
 *  please note ...
 *  ... that in order for the project to work properly ...
 *  ... this server code must be executed (i.e. 'node index.js') beforehand
 *  
 *  Aziz | 16 Jul 2017 | VeAsia Client-side – server-side Assessment
 */



// core dependencies and requirements
var express = require('express');
var router = express.Router();
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 8080;


// basic application setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});


// define route to capture localhost:8080/process
router.put('/process', function (req, res) {

    /**
     * return processed product name (i.e. capitilized)
     */
    var processName = function () {
        return req.body.name.toUpperCase();
    };

    /**
     * return processed specifications object (i.e. capitilized)
     */
    var processSpecs = function () {
        var processedSpecs = {};
        for (var key in req.body.specifications) {
            processedSpecs[key.toUpperCase()] = req.body.specifications[key].toUpperCase();
        }
        return processedSpecs;
    };

    var processedDataObject = {};
    processedDataObject[processName()] = processSpecs();

    res.json({
        order: processedDataObject,
        time: new Date().getTime(),
        sid: req.query.sid
    });
});
app.use('/', router);


// execute server
module.exports = app;
app.listen(port);
console.log('Running on port: ' + port);