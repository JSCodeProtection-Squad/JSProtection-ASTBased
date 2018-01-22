var express = require('express');
var router = express.Router();
var fs = require('fs');
var UglifyJS = require("../uglify-js/tools/node");

var code = fs.readFileSync('./test/test.js', 'utf8');
var result = UglifyJS.minify(fs, code);
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    env: 'dev',
    uglifyjs: result.code
  });
});

module.exports = router;
