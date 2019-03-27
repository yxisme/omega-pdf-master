/**
 * Created by sfei on 8/10/2016.
 */
'use strict';

var uploadCtrl = require('../controller/UploadController.server.js'),
    downloadCtrl = require('../controller/DownloadController.server.js');

module.exports = function (app) {
    app.route('/api/upload')
        .post(uploadCtrl.upload);
    
    app.route('/api/download')
        .post(downloadCtrl.download);
};