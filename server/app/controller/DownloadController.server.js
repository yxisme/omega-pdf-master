/**
 * Created by sfei on 8/10/2016.
 */
'use strict';
var winston = require('winston'),
    fs = require('fs'),
    path = require('path');

exports.download = function (req, res, next) {
    var data = req.body,
        filePath = data.path,
        fileName;
    fs.stat(filePath, function (err, stat) {
        if (!err) {
            fileName = path.basename(filePath);
            res.download(filePath, fileName, function (err) {
                if (err) {
                    winston.error(err)
                } else {
                    winston.info('{0}: {1} download completed'.format(new Date(), filePath));
                }
            });
        } else {
            res.status(500).send({error: 'File does not exist'});
        }
    });
};
