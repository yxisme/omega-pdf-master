/**
 * Created by sfei on 8/10/2016.
 */
'use strict';
var phantom = require('phantom'),
    winston = require('winston'),
    fs = require('fs'),
    async = require('async'),
    _ = require('lodash'),
    config = require('../../config/config'),
    path = require('path'),
    zip = require("node-native-zip"),
    sg = require('sendgrid')(config.SENDGRID_API_KEY),
    percentile = require('../data/percentile').percentile;

var fieldsToTrans = {
    'omega3_index': true,
    'trans_fat_index': true,
    'total_omega3': true,
    'total_omega6': true,
    'total_monounsaturated': true,
    'total_saturated': true,
    'total_trans': true,
    'n6_n3': 'string',
    'aa_epa': 'string'
};

exports.upload = function (req, res, next) {
    var data = req.body.profiles,
        isProfessional = req.body.isProfessional;
    processRawData(data, isProfessional);
    winston.info(data);
    startProcess(data, res);
};

function startProcess(data, res) {
    var page,
        phInstance = null,
        dirName = './file/{0}'.format(new Date().getTime()),
        responseResult = null;

    phantom.create()
        .then(function (instance) {
            // create phantom page
            winston.info(new Date + ': phantom created');
            phInstance = instance;
            return phInstance.createPage();
        })
        .then(function (pg) {
            // set page properties
            winston.info('{0}: page created.'.format(new Date()));
            page = pg;
            return page.property('paperSize', {
                format: 'Letter',
                orientation: 'portrait',
                margin: '0.5cm'
            });
        })
        .then(function () {
            // open template file
            return page.open('template/template.html');
        })
        .then(function () {
            return createPDFs(data, dirName, page)
        })
        .then(function (results) {
            return emailPDFs(results)
        })
        .then(function (results) {
            return createZipFile(results, dirName)
        })
        .then(function (results) {
            responseResult = results;
            return page.close();
        })
        .then(function () {
            return phInstance.exit();
        })
        .then(function () {
            res.json({
                success: true,
                results: responseResult
            });
        })
        .catch(function (err) {
            res.json({
                success: false,
                error: err,
                results: responseResult
            });
        });
}

function createPDFs(data, dirName, page) {
    return new Promise(function (resolve, reject) {
        var asyncTasks = [];
        _.forEach(data, function (item) {
            asyncTasks.push(function (callback) {
                createSinglePDF(item, page, dirName, callback);
            });
        });
        async.series(
            asyncTasks,
            function (err, results) {
                resolve(results);
            }
        );
    })
}

function createSinglePDF(data, page, dirName, callback) {
    var fileName,
        filePath;
    winston.info('{0}: starting process information: {1}'.format(new Date(), data.name));

    var now = new Date();
    //fileName = 'omega-report_{0}_{1}.pdf'.format(data.id, now.getTime());
	fileName ='{0}.pdf'.format(data.name);
    filePath = '{0}/{1}'.format(dirName, fileName);

    page.evaluate(function (data) {
        var $scope = angular.element(document.body).scope();
        $scope.updateData(data);
        $scope.$apply();
    }, data)
        .then(function () {
            return page.render(filePath, {format: 'pdf'});
        })
        .then(function () {
            winston.info('success to process {0}'.format(data.name));
            return callback(null, {
                success: true,
                data: data,
                filePath: filePath
            });
        })
        .catch(function (error) {
            winston.error('failed to process {0}'.format(data.name), error);
            return callback(null, {
                success: false,
                error: 'PDF生成失败。',
                data: data
            });
        });
}

function emailPDFs(results, res) {
    return new Promise(function (resolve, reject) {
        var sendingTasks = [],
            errors = [],
            successTasks = [];
        _.forEach(results, function (pdfResult) {
            if (pdfResult.success) {
                sendingTasks.push(function (callback) {
                    emailSinglePDF(pdfResult.filePath, pdfResult.data, callback);
                })
            } else {
                errors.push({
                    data: pdfResult.data,
                    error: pdfResult.error
                })
            }
        });

        async.parallel(
            sendingTasks,
            function (err, results) {
                _.forEach(results, function (sendingResult) {
                    if (sendingResult.success == false) {
                        errors.push({
                            data: sendingResult.data,
                            error: sendingResult.error
                        });
                    } else {
                        successTasks.push(sendingResult)
                    }
                });
                resolve({
                    successTasks: successTasks,
                    errorTasks: errors
                })
            }
        );
    })

}

function emailSinglePDF(filePath, data, callback) {
    if (!data.email || data.email == '') {
        callback(null, {
            success: true,
            data: data,
            filePath: filePath
        });
        return;
    }
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: data.email
                        }
                    ],

                    cc: [{
                        email: config.emailCC
                    }],
                    subject: 'Omega-3健康检测报告'
                }
            ],
            from: {
                email: config.emailFrom
            },
            reply_to: {
                email: config.emailReplyTo,
                name: config.emailReplyToName
            },
            content: [
                {
                    type: 'text/plain',
                    value: '{0}, 请查阅您的体检报告。'.format(data.name)
                }
            ],
            attachments: [
                {
                    content: base64_encode(filePath),
                    type: 'application/pdf',
                    filename: 'omega3-health-index.pdf'
                }
            ]
        }
    });
    sg.API(request)
        .then(function (response) {
            winston.info(response.statusCode);
            callback(null, {
                success: true,
                data: data,
                filePath: filePath
            });
        })
        .catch(function (error) {
            winston.error(error.response.statusCode);
            callback(null, {
                success: false,
                error: 'Email寄送失败',
                data: data,
                filePath: filePath
            });
        });
}

function createZipFile(results, dirName) {
    return new Promise(function (resolve, reject) {
        var archive = new zip(),
            location = '{0}.zip'.format(dirName),
            files = [];
        _.forEach(results.successTasks, function (task) {
            files.push({
                    name: path.basename(task.filePath),
                    path: task.filePath
                }
            )
        });
        archive.addFiles(files, function (err) {
            var buff = archive.toBuffer();
            if (err) {
                reject(err);
            }
            fs.writeFile(location, buff, function () {
                winston.info('zip completed');
                results.zipPath = location;
                resolve(results);
            });
        });
    })
}

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

function processRawData(raw, isProfessional) {
    _.forEach(raw, function (item) {
        item.is_professional = isProfessional;
    });

    // transfer necessary percentage strings to float numbers
    _.forEach(raw, function (item) {
        _.forEach(item, function (value, key) {
            if (fieldsToTrans[key]) {
                item[key] = parseFloat(value);
            }
        });
    });

    // calculate percentile ranks and reference ranges
    _.forEach(raw, function (item) {
        getSingleRowPercentile(item)
    });

    // transfer necessary float numbers back to percentage string
    _.forEach(raw, function (item) {
        _.forEach(item, function (value, key) {
            if (fieldsToTrans[key] && fieldsToTrans[key] != 'string') {
                item[key] = value + '%';
            }
        });
    });
}

function getSingleRowPercentile(item) {
    var len = percentile.length,
        singlePercentile,
        nextPercentile,
        i;
    _.forEach(item, function (value, key) {
        if (fieldsToTrans[key]) {
            if (fieldsToTrans[key] != 'string') {
                item[key + '_ref_range'] = '{0}% - {1}%'.format(percentile[0][key], percentile[len - 1][key]);
            } else {
                item[key + '_ref_range'] = '{0} - {1}'.format(percentile[0][key], percentile[len - 1][key]);
            }
            for (i = 0; i < len; i++) {
                singlePercentile = percentile[i];
                nextPercentile = percentile[i + 1];
                if (!nextPercentile) {
                    item[key + '_rank'] = singlePercentile.percentile + '%';
                    break;
                }
                if (i == 0 && singlePercentile[key] >= value) {
                    item[key + '_rank'] = singlePercentile.percentile + '%';
                    break;
                }
                if (singlePercentile[key] == value) {
                    item[key + '_rank'] = singlePercentile.percentile + '%';
                    break;
                }

                if (singlePercentile[key] < value && nextPercentile[key] > value) {
                    item[key + '_rank'] = singlePercentile.percentile + '%';
                    break;
                }
            }
        }
    })
}