require("./nodeGlobals.js");
const express = require('express');
const bodyParser = require('body-parser');
const {ApogeeManager} = require("./ApogeeManager");

const FILE_ROOT = "/file";
const APOGEE_DESCRIPTOR_LOCATION = "deploy/descriptor.json";

//===========================
// Set up handlers
//===========================
const app = express();

//--------------
//file server
//--------------
app.use(FILE_ROOT,express.static("file"));

//---------------
//apogee server
//---------------

//parse json body of requests
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.text()); //for parsing plain.text

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type","application/json");
    next();
  });


//apogee endpoint initialization
const apogeeManager = new ApogeeManager();
var initPromise = apogeeManager.getInitPromise(app,APOGEE_DESCRIPTOR_LOCATION);

//---------------------
// listener
//---------------------

//start listener after pogee initialization
const port = getPort();
var startListener = () => {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

let errorHandler = errorMsg => {
    console.log("Server failed to start: " + errorMsg);
} 

initPromise.then(startListener).catch(errorHandler);

//============================
// Utility Functions
//============================

function getPort() {
    if(process.argv.length === 3) {
        var portString = process.argv[2];
        try {
            return parseInt(portString);
        }  
        catch(error) {
            console.error("Errror reading port: " + error.message);
        }
    }

    //default port
    return 30001;
}
