/**
 * Created by sfei on 8/10/2016.
 */
var app = angular.module('omega');
app.controller('MainController', function ($scope, MainService, toastr, blockUI) {
    var me = this;
    $scope.errorMsg = null;
    $scope.successMsg = null;
    $scope.fileValid = false;
    $scope.fileData = null;
    $scope.fileSelected = null;
    $scope.isProfessional = '0';

    $scope.$watch('fileSelected', function (newValue, oldValue) {
        $scope.onFileChange(newValue)
    });

    $scope.onFileChange = function (file) {
        var validationResult;
        $scope.refreshFileData();
        if (file && file.name.split('.')[1] == 'csv') {
            Papa.parse(file, {
                header: true,
                complete: function (results) {
                    validationResult = $scope.validateCSVFile(results);
                    $scope.refreshFileData();
                    $scope.fileValid = true;
                    $scope.fileData = results.data;
                }
            });
        } else if (file) {
            toastr.error('请选择一个有效的CSV文件。');
        }
    };

    $scope.onFileRemoveClick = function () {
        $scope.fileSelected = null;
    };

    $scope.onSubmitBtnClick = function () {
        var errorMsg = null,
            errorTasks,
            successTasks,
            errorData = null,
            isProfessional = $scope.isProfessional != '0';
        if ($scope.fileValid && $scope.fileData) {
            blockUI.start();
            MainService.generateReport($scope.fileData, isProfessional)
                .then(function (res) {
                        blockUI.stop();
                        var response = res.data;
                        if (response.success) {
                            if (response.results) {
                                errorTasks = response.results.errorTasks;
                                successTasks = response.results.successTasks;
                                if (errorTasks && errorTasks.length > 0) {
                                    var errorMsgs = [];
                                    _.forEach(errorTasks, function (err) {
                                        errorData = err.data || {};
                                        errorMsgs.push('{0}-报告生成失败。原因: {1}'.format(err.data.id, err.error))
                                    });
                                    errorMsg = errorMsgs.join('<br>');
                                    $scope.errorMsg = errorMsg;
                                }
                                if (successTasks && successTasks.length > 0) {
                                    $scope.successMsg = '{0}份报告被生成，ZIP文件将被下载以供留档。'.format(successTasks.length);
                                }
                                if (response.results.zipPath) {
                                    $scope.downLoadZip(response.results.zipPath);
                                }
                            } else {
                                errorMsg = '报告生成失败。';
                                $scope.showErrorResult(errorMsg);
                            }
                        }
                    }
                )
                .catch(function (res) {
                    blockUI.stop();
                    errorMsg = '报告生成失败。';
                    $scope.showErrorResult(errorMsg);
                })
        } else {
            toastr.error('请选择一个有效的CSV文件。');
        }
    };

    $scope.downLoadZip = function (path) {
        var fileName;
        MainService.downloadReport(path)
            .then(function (res) {
                if (res) {
                    fileName = $scope.getFileName(res);
                    file = new Blob([res.data], {type: "application/zip"});
                    saveAs(file, fileName);
                }
            })
    };

    $scope.refreshFileData = function () {
        $scope.errorMsg = null;
        $scope.successMsg = null;
        $scope.fileValid = false;
        $scope.fileData = null;
    };

    $scope.showErrorResult = function (error) {
        toastr.error('报告生成出现错误。');
        $scope.errorMsg = error;
    };

    $scope.validateCSVFile = function (results) {
        //TODO: add more validation rules using regex
        return {
            valid: true,
            errors: []
        };
    };

    $scope.getFileName = function (res) {
        var fileName;
        try {
            fileName = res.headers()['content-disposition'].split('filename=')[1].replace('"', '').replace('"', '');
        } catch (e) {
            console.error('failed to get file name from server response header');
            fileName = new Date().getTime() + '.pdf'
        }
        return fileName;
    };
});