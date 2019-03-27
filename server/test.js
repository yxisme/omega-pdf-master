/**
 * Created by sfei on 8/11/2016.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

var phantom = require('phantom'),
    winston = require('winston'),
    fs = require('fs'),
    async = require('async'),
    _ = require('lodash'),
    config = require('./config/config'),
    path = require('path'),
    zip = require("node-native-zip"),
    sg = require('sendgrid')(config.SENDGRID_API_KEY);
require('./config/override');

winston.info(new Date + ': TASK STARTED');
startProcess([{
    "email": "sfei1001@gmail.com",
    "id": "A00099999",
    "name": "李明",
    "dob": "11/09/1988",
    "collection_date": "09/29/2015",
    "result_date": "08/23/2016",
    "provider": "赵锋体检中心",
    "account": "个人账户",
    "omega3_index": 12,
    "omega3_reference_range_low": "2%",
    "omega3_reference_range_high": "12%",
    "trans_fat_index": 2.5,
    "trans_fat_reference_range_low": "0%",
    "trans_fat_reference_range_high": "1.65%",
    "omega3_fatty_acids": "15.42%",
    "omega3_fatty_rank": ">80%",
    "omega3_fatty_ref_range": "2.9-3.9%",
    "omega3_index_rank": ">99%",
    "omega3_index_ref_range": "2.9-12.9%",
    "C18_3n3": "0.90%",
    "C20_5n3": "7.12%",
    "C22_5n3": "2.32%",
    "C22_6n3": "5.08%",
    "omega6_fatty_acids": "32.74%",
    "omega6_fatty_acids_rank": "13th",
    "omega6_fatty_acids_ref_range": "26.3-28.3%",
    "C18_2n6": "22.69%",
    "C18_3n6": "0.10%",
    "C20_2n6": "0.20%",
    "C20_3n6": "0.30%",
    "C20_4n6": "0.40%",
    "C22_4n6": "0.50%",
    "C22_5n6": "0.20%",
    "cis_fatty_acids": "16.69%",
    "cis_fatty_acids_rank": "5th",
    "cis_fatty_acids_ref_range": "15-32%",
    "C16_1n7": "0.10%",
    "C18_1n9": "0.20%",
    "C20_1n9": "0.30%",
    "C24_1n9": "0.40%",
    "saturated_fatty_acids": "0.50%",
    "saturated_fatty_acids_rank": "79%",
    "saturated_fatty_acids_ref_range": "29-32%",
    "C14_0": "0.10%",
    "C16_0": "0.20%",
    "C18_0": "0.30%",
    "C20_0": "0.40%",
    "C22_0": "0.50%",
    "C24_0": "0.50%",
    "trans_fatty_acids": "0.51%",
    "trans_fatty_acids_rank": "5th",
    "trans_fatty_acids_ref_range": "0.3-0.5%",
    "C16_1n7t": "0.10%",
    "C18_1t": "0.20%",
    "C18_2n6t": "0.30%",
    "trans_fat_index_rank": "4th",
    "trans_fat_index_ref_range": "0.5-0.9%",
    "AA_EPA": "1:2:1",
    "AA_EPA_rank": "<1%",
    "AA_EPA_ref_range": "1.4-1.6%",
    "omega6_omega3": "1:2:1",
    "omega6_omega3_rank": "<1%",
    "omega6_omega3_ref_range": "2.3-33.4%"
}]);


function startProcess(data, res) {
    var page,
        phInstance = null,
        dirName = '/file/{0}'.format(new Date().getTime()),
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
    fileName = 'omega-report_{0}_{1}.pdf'.format(data.id, now.getTime());
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
