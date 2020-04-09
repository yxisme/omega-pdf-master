/**
 * Created by sfei on 8/11/2016.
 */
var app = angular.module('template');
app.service('MainService', function ($http) {
    var me = this;

    me.getOmega3IndexSummaryText = function (n3IndexText, n3n6Text) {
        var index = parseFloat(n3IndexText);
        var n3n6 = parseFloat(n3n6Text);
        if (index > 8) {
            if (n3n6 < 4) {
                return me.omega3SummaryText.high;
            } else {
                return me.omega3SummaryText.highSpare;
            }
        }
        if (index <= 8 && index >= 4) {
            if (n3n6 >= 4) {
                return me.omega3SummaryText.medium;
            } else {
                return me.omega3SummaryText.mediumSpare;
            }
            
        }
        if (index < 4) {
            if (n3n6 >= 4) {
                return me.omega3SummaryText.low;
            } else {
                return me.omega3SummaryText.lowSpare;
            }
        }
    };

    me.getOmega3IndexDetailText = function () {
        return me.omega3DetailText;
    };


    me.getN6N3SummaryText = function (indexText) {
        var index = parseFloat(indexText);
        if (index < 4) {
            return me.n6n3SummaryText.low;
        }
        if (index <= 6 && index >= 4) {
            return me.n6n3SummaryText.mediumSpare;
        }
        if (index > 6) {
            return me.n6n3SummaryText.highSpare;
        }
    };

    me.getN6N3DetailText = function () {
        return me.n6n3DetailText;
    };

    me.getTransFatIndexSummaryText = function (indexText) {
        var index = parseFloat(indexText);
        if (index > 1.65) {
            return me.transFatSummaryText.high;
        }
        if (index <= 1.65 && index >= 1) {
            return me.transFatSummaryText.medium;
        }
        if (index < 1) {
            return me.transFatSummaryText.low;
        }
    };

    me.getTransFatIndexDetailText = function () {
        return me.transFatDetailText;
    };

    me.omega3SummaryText = {
        high: '您的Omega-3（欧米伽3 多不饱和脂肪酸）处在理想范围内，位于超过了8％的区间。 建议您保持目前的Omega-3摄入量。',
        highSpare: '您的Omega-3（欧米伽3 多不饱和脂肪酸）处在理想范围内，位于超过了8％的区间。 建议您保持目前Omega-3脂肪酸中DHA和EPA的摄入量。',
        medium: '您的Omega-3（欧米伽3 多不饱和脂肪酸）在中度范围内位于4-8％的区间。建议您增加Omega-3脂肪酸的摄入量。',
        mediumSpare: '您的Omega-3（欧米伽3 多不饱和脂肪酸）在中度范围内位于4-8％的区间。建议您增加Omega-3脂肪酸中DHA和EPA的摄入量。',
        low: '您的Omega-3（欧米伽3 多不饱和脂肪酸）远低于目标范围所处的8％的区间。 建议您增加Omega-3脂肪酸的摄入量。',
        lowSpare: '您的Omega-3（欧米伽3 多不饱和脂肪酸）远低于目标范围所处的8％的区间。 建议您增加Omega-3脂肪酸中DHA和EPA的摄入量。'
    };

    me.omega3DetailText = '\
        <p>大量的学术研究结果和大群体（数万人以上）人体测试显示Omega-3指数水平<4%时，罹患多种疾病的风险大大升高。这些疾病包括心脏病、中风、癌症、痴呆和抑郁等。相比中等数值以下的人而言，数值达理想水平(>8%)的人比低数值的人更长寿。提高您的Omega-3指数并保持高指标会帮助您减少罹患这些疾病的风险。\
        </p>\
        <br>\
        <p>\
        建议补充含有ALA、DHA、EPA三种成分的欧米伽3制剂。且建议服用高纯度的欧米伽3。单纯服用亚麻籽与紫苏等植物中提取的ɑ亚麻酸（即ALA）对提高血液中的欧米伽3水平不显著。\
        </p>\
        <br>\
        <p>\
        为了让您的Omega-3指标保持在合适的区间，您应该每六个月就复查一次。\
        </p>';

    me.n6n3SummaryText = {
        low: '您的Omega6：Omega3比例处在理想范围内，位于低于4：1的区间。 建议您保持目前的总Omega-3摄入量。',
        medium: '您的Omega6：Omega3比例在中度范围内位于4：1 - 6：1的区间。建议您增加总Omega-3脂肪酸的摄入量。',
        mediumSpare: '您的Omega6：Omega3比例在中度范围内位于4：1 - 6：1的区间。建议您增加目前的总Omega-3摄入量，并减少Omega-6的摄入量',
        high: '您的Omega6：Omega3比例远高于目标范围所处的4：1的区间。 建议您增加总Omega-3脂肪酸的摄入量。',
        highSpare: '您的Omega6：Omega3比例远高于目标范围所处的4：1的区间。 建议您增加目前的总Omega-3摄入量，并减少Omega-6的摄入量。'
    };

    me.n6n3DetailText = '\
        <p>人类在长期的进化过程中体内和饮食中的Omega-6和Omega-3之间的比例一直维持在大约1：1的水平，而近两个世纪由于工业化导致人类食谱的巨大变化，使得人类体内该比例严重失衡。过量的Omega-6和非常高的Omega-6：Omega-3的比例，被发现是促进许多疾病的发病机制。这些疾病包括心血管疾病、癌症、炎症和自身免疫性疾病，而降低Omega-6/Omega-3比率则可以发挥抑制疾病的效果。对心血管疾病，该比例低于4：1会使得总猝死率减少70%；低于2.5：1的比率则会降低大肠癌患者的直肠癌细胞的增殖；对乳腺癌也有类似的结果；低于2-3：1的比例会抑制类风湿性关节炎患者的炎症；低于5：1会对哮喘患者的有益；而10：1的比率则会出现不良后果。</p>\
        <br>\
        <p>研究表明，维持Omega-6：Omega- 3的较低比例有助于减少许多的慢性疾病的风险。在健康的饮食结构中，Omega-6脂肪酸的含量应大约为Omega-3脂肪酸的四倍以内。</p>';

    me.transFatSummaryText = {
        high: '您的反式脂肪酸（Trans Fat）指标远高于目标指数1%。建议您大幅度的减少反式脂肪酸的摄入量。',
        medium: '您的反式脂肪酸（Trans Fat）指标高于目标指数1%。建议您减少反式脂肪酸的摄入量。',
        low: '您的反式脂肪酸（Trans Fat）指标在理想范围内，位于低于1%的区间内。建议您保持目前的膳食结构。'
    };

    me.transFatDetailText = '\
        <p>\
        大量研究显示反式脂肪酸的指标<1%与心血管疾病低发病率相关。多数人都在中间区域，指标大于1.65%的人更容易罹患心血管疾病。</p>\
        <br>\
        <p>\
        反式脂肪酸不能在体内合成。大量的反式脂肪酸是来自于液体植物油氢化。从食物中摄入这些“工业反式脂肪酸”会增加“不健康的”胆固醇水平、降低“健康的”胆固醇水平，更重要的是，这会引起更高的心脏病发病率。2014年美国食品药品管理局（FDA）已禁止在食品加工中使用工业反式脂肪酸。\
        </p>\
        <br>\
        <p>\
            反式脂肪酸的血中浓度反映了饮食摄入程度。因此，降低血液中反式脂肪酸浓度的唯一方法就是从食物中摄取更少的反式脂肪酸。大多数反式脂肪酸的食物包括蛋糕、饼干、派、油酥点心、薯条、玉米粉薄烙饼、薄脆饼干、爆米花和人造黄油棒等。要知道您自己血液中的反式脂肪酸数值的方法只有测量。\
        </p>';
});