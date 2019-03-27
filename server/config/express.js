/**
 * Created by sfei on 8/9/2016.
 */
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static');

module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(serveStatic('../public'));
    
    require('../app/route/route.server.js')(app);
    return app;
};