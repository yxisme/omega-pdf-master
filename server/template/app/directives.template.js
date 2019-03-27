/**
 * Created by sfei on 8/11/2016.
 */
var app = angular.module('template');
app.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: function (scope, element) {
            if (scope.options) {
                Highcharts.chart(element[0], scope.options);
            }
        }
    };
});

app.directive('pageBreak', function () {
    return {
        restrict: 'E',
        template: '<div class="page-break-after"></div>'
    };
});