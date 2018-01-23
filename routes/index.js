var express = require('express');
var router = express.Router();
var fs = require('fs');
var UglifyJS = require("../uglify-js/tools/node");

// for：控制流平坦化，while：化成for->控制流平坦化，
// for-in：化成for->控制流平坦化，function：写成var+匿名函数->匿名函数内部控制流平坦化，else-if：，
// var&所有statement&所有不透明谓词：unicode/与&或&非&亦或&位运算（信息论与编码）。

var code = fs.readFileSync('./test/test.js', 'utf8');
var result = UglifyJS.minify(fs, code);
console.log(result.code);

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    env: 'dev',
    uglifyjs: result.code
  });
});

module.exports = router;
