var express = require('express');
var router = express.Router();

//以下为功能测试
var UglifyJS = require('../uglify-js');
code = "function f(){ var u; return 2 + 3; }";
var result = UglifyJS.minify(code);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express',
        env: 'dev',
        uglifyjs: result.code
    });
});

module.exports = router;
