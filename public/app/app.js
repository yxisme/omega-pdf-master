/**
 * Created by sfei on 8/10/2016.
 */
angular.module('omega', [
    'ngAnimate',
    'toastr',
    'ngSanitize',
    'blockUI'
]);

angular.module('omega').config(function(blockUIConfig) {
    blockUIConfig.message = '报告生成中，请稍等...';
});