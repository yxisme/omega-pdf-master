/**
 * Created by sfei on 8/11/2016.
 */

var app = angular.module('template');
app.controller('MainController', function ($scope, MainService) {
    var me = this;
    $scope.updateData = function (data) {
        $scope.report = processData(data);
    };

    $scope.report = processData({
        "id": "1",
        "name": "李阿娣",
        "dob": "1942.8.1",
        "gender": "女",
        "collection_date": "",
        "result_date": "9/6/2016",
        "C14:0": "0.32%",
        "C16:0": "20.87%",
        "C16:1n7t": "0.09%",
        "C16:1n7": "0.55%",
        "C18:0": "13.09%",
        "C18:1t": "0.22%",
        "C18:1n9": "15.91%",
        "C18:2n6t": "0.30%",
        "C18:2n6": "24.10%",
        "C20:0": "0.29%",
        "C18:3n6": "0.20%",
        "C20:1n9": "0.43%",
        "C18:3n3": "0.46%",
        "C20:2n6": "0.35%",
        "C22:0": "0.78%",
        "C20:3n6": "0.83%",
        "C20:4n6": "10.27%",
        "C24:0": "1.33%",
        "C20:5n3": "1.27%",
        "C24:1n9": "1.11%",
        "C22:4n6": "0.89%",
        "C22:5n6": "0.23%",
        "C22:5n3": "1.45%",
        "C22:6n3": "4.66%",
        "omega3_index": "8.07%",
        "n6_n3": 4.7,
        "aa_epa": 8.1,
        "trans_fat_index": "0.52%",
        "total_saturated": "36.67%",
        "total_monounsaturated": "18%",
        "total_trans": "0.61%",
        "total_omega6": "36.87%",
        "total_omega3": "7.84%",
        "is_professional": false,
        "omega3_index_ref_range": "2.9% - 14.8%",
        "omega3_index_rank": "80%",
        "n6_n3_ref_range": "2 - 14.3",
        "n6_n3_rank": "23%",
        "aa_epa_ref_range": "1.1 - 65",
        "aa_epa_rank": "31%",
        "trans_fat_index_ref_range": "0.3% - 2.2%",
        "trans_fat_index_rank": "12%",
        "total_saturated_ref_range": "30.5% - 40.7%",
        "total_saturated_rank": "80%",
        "total_monounsaturated_ref_range": "16.1% - 30.1%",
        "total_monounsaturated_rank": "9%",
        "total_trans_ref_range": "0.4% - 2.4%",
        "total_trans_rank": "12%",
        "total_omega6_ref_range": "26.2% - 44.2%",
        "total_omega6_rank": "50%",
        "total_omega3_ref_range": "2.7% - 14.6%",
        "total_omega3_rank": "80%"
    });

    function processData(raw) {
        var processed;
        processed = angular.copy(raw);
        processOmega3IndexText(processed);
        processN6N3Text(processed);
        processTransFatIndexText(processed);
        processIndexPosition(processed);
        return processed;
    }

    function processOmega3IndexText(data) {
        data['omega3_index_summary_text'] = MainService.getOmega3IndexSummaryText(data['omega3_index']);
        data['omega3_index_detail_text'] = MainService.getOmega3IndexDetailText(data['omega3_index']);
    }
    
    function processN6N3Text(data) {
        data['n6_n3_summary_text'] = MainService.getN6N3SummaryText(data['n6_n3']);
        data['n6_n3_detail_text'] = MainService.getN6N3DetailText();
    }

    function processTransFatIndexText(data) {
        data['trans_fat_index_summary_text'] = MainService.getTransFatIndexSummaryText(data['trans_fat_index']);
        data['trans_fat_index_detail_text'] = MainService.getTransFatIndexDetailText(data['trans_fat_index']);
    }

    function processIndexPosition(data) {
        var minPos = 10,
            maxPos = 90,
            omega3Pos,
            n6n3Pos,
            transFatPos,
            omega3RangeLow = 2,
            omega3RangeHigh = 12,
            n6n3RangeLow = 2,
            n6n3RangeHigh = 12,
            transFatRangeLow = 0,
            transFatRangeHigh = 2.5,
            omega3_index = parseFloat(data.omega3_index),
            n6_n3 = parseFloat(data.n6_n3),
            trans_fat_index = parseFloat(data.trans_fat_index);
        if (omega3_index < omega3RangeLow) {
            omega3Pos = minPos;
        } else if (omega3_index > omega3RangeHigh) {
            omega3Pos = maxPos;
        } else {
            omega3Pos = (maxPos * omega3_index - maxPos * omega3RangeLow + minPos * omega3RangeHigh - minPos * omega3_index) / (omega3RangeHigh - omega3RangeLow);
        }

        if (trans_fat_index < transFatRangeLow) {
            transFatPos = minPos;
        } else if (trans_fat_index > transFatRangeHigh) {
            transFatPos = maxPos;
        } else {
            transFatPos = (maxPos * trans_fat_index - maxPos * transFatRangeLow + minPos * transFatRangeHigh - minPos * trans_fat_index) / (transFatRangeHigh - transFatRangeLow);
        }

        if (n6_n3 < n6n3RangeLow) {
            n6n3Pos = minPos;
        } else if (n6_n3 > n6n3RangeHigh) {
            n6n3Pos = maxPos;
        } else {
            n6n3Pos = (maxPos * n6_n3 - maxPos * n6n3RangeLow + minPos * n6n3RangeHigh - minPos * n6_n3) / (n6n3RangeHigh - n6n3RangeLow);
        }
        $scope.omega_3_index_position_style = {"padding-left": omega3Pos + "%"};
        $scope.n6_n3_position_style = {"padding-left": n6n3Pos + "%"};
        $scope.trans_fat_index_position_style = {"padding-left": transFatPos + "%"};
    }
});