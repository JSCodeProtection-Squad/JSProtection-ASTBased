var express = require('express');
var router = express.Router();
var fs = require('fs');
var UglifyJS = require("../uglify-js/tools/node");

// function whileFlatten(while_item) {
//     var code = fs.readFileSync('./test/test.js', 'utf8');
//     var result = UglifyJS.parse(code);
//     var length = while_item.body.body.length + 1;
//
//     result.body.forEach(function (item, index) {
//         if (item.start.value === 'for') {
//             result = item;
//
//             //根据模板改写AST_NODE，假定行数列数不影响结果
//             var if_ast_condition = result.body.body[0].condition;
//             if_ast_condition.right.end.raw = length.toString();
//             if_ast_condition.right.end.value = length;
//             if_ast_condition.right.start.raw = length.toString();
//             if_ast_condition.right.start.value = length;
//             if_ast_condition.right.value = length;
//             //switch
//             var switch_ast = result.body.body[1];
//             switch_ast.body[0].body[0].condition = while_item.condition;
//             //case = 1 的AST_NODE开始拷贝
//             var case_node = switch_ast.body[1];
//             switch_ast.body.splice(1);
//
//             while_item.body.body.forEach(function (while_body, index) {
//                 var temp = case_node;
//
//                 temp.expression.end.raw = (1 + index).toString();
//                 temp.expression.end.value = 1 + index;
//                 temp.expression.start.raw = (1 + index).toString();
//                 temp.expression.start.value = 1 + index;
//                 temp.expression.value = 1 + index;
//
//                 temp.body[0].body.end.raw = (1 + index).toString();
//                 temp.body[0].body.end.value = 1 + index;
//                 temp.body[0].body.right.end.raw = (1 + index).toString();
//                 temp.body[0].body.right.end.value = 1 + index;
//                 temp.body[0].body.right.start.raw = (1 + index).toString();
//                 temp.body[0].body.right.start.value = 1 + index;
//                 temp.body[0].body.right.value = 1 + index;
//
//                 temp.body.unshift(while_body);
//                 switch_ast.body.push(temp)
// //                     闭包对象引用问题未解决
//             });
//         }
//     });
//
//     return result;
// }

// var code = fs.readFileSync('./test/test.js', 'utf8');
// var ast = UglifyJS.parse(code);
// ast.body.forEach(function (item, index) {
//
//     if (item.start.value === 'while') {
//         ast.body[index].body.body = whileFlatten(item);
//     }
// });
//
// console.log(result);
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express',
        env: 'dev',
        uglifyjs: result
    });
});

module.exports = router;
