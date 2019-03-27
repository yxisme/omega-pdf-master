/**
 * Created by sfei on 8/10/2016.
 */
var app = angular.module('omega');
app.service('MainService', function ($http) {
    var me = this;
    me.generateReport = function (data, isProfessional) {
        return $http({
            url: 'api/upload',
            method: 'POST',
            data: {
                profiles: data,
                isProfessional: isProfessional
            }
        });
    };
    
    me.downloadReport = function (path) {
        return $http({
            url: 'api/download',
            method: 'POST',
            data: {
                path: path
            },
            responseType: 'blob'
        });
    }
});