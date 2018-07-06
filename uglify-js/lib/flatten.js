"use strict";

function changeAST_NodeAssign(obj, value) {
    obj.end.raw = value.toString();
    obj.end.value = value;
    obj.start.raw = value.toString();
    obj.start.value = value;
    obj.value = value;
    return obj;
}

/**
 * 对while 循环结构实施压扁控制流
 * @param fs 文件操作模块
 * @param while_item AST_While 节点
 * @returns 新节点
 */
function whileFlatten(fs, while_item) {
    // 读取压扁控制流模板文件，通过修改模板文件的AST得到目标
    var code = fs.readFileSync('./template/while.js', 'utf8');
    var result = parse(code).body[0];
    // while循环内的代码块数目
    var length = while_item.body.body.length + 1;
    // 模板文件的if判断条件
    var if_ast_condition = result.body.body[0].condition;
    // 修改判断条件为代码块数目
    if_ast_condition.right = changeAST_NodeAssign(if_ast_condition.right, length);
    // 模板文件中witch语句
    var switch_ast = result.body.body[1];
    // 模板文件switch语句中的if条件替换为while循环的条件
    switch_ast.body[0].body[0].condition = while_item.condition;
    // 模板文件中，case 0中if语句的else语句节点
    var first_if_final = switch_ast.body[0].body[0].alternative.body[0].body;
    // 修改else中赋值语句的右值，即是根据while更新next赋值语句
    first_if_final.end.raw = length.toString();
    first_if_final.end.value = length;
    first_if_final.right = changeAST_NodeAssign(first_if_final.right, length);

    var case_template = switch_ast.body.pop();
    //为while循环的每个语句块创建case节点
    while_item.body.body.forEach(function (while_body, index) {
        var temp = case_template.clone(true);
        temp.expression = changeAST_NodeAssign(temp.expression, 1 + index);

        var num = 2 + index;
        if (index == while_item.body.body.length - 1) {
            //此处为动态找自构不透明谓词词典
            num = 0;
        }
        temp.body[0].body.end.raw = num.toString();
        temp.body[0].body.end.value = num;
        temp.body[0].body.right = changeAST_NodeAssign(temp.body[0].body.right, num);
        // 递归调用
        temp.body.unshift(flowflatten(fs, while_body));
        switch_ast.body.push(temp);
    });

    return result;
}

/**
 * 对函数定义实施压扁控制流算法
 * @param fs 文件操作模块
 * @param function_item AST_DefFun
 * @returns 新的节点
 */
function functionFlatten(fs, function_item) {
    // 读取模板文件生成模板AST
    var code = fs.readFileSync('./template/function.js', 'utf8');
    var result = parse(code).body[0];
    // 变量定义语句
    var definitions = result.definitions[0];
    // 定义语句以变量名作为开始，这里将函数名赋值给变量名
    definitions.start.value = function_item.name.name;

    // 更新变量定义语句中的变量名token
    definitions.name.end.value = function_item.name.name;
    definitions.name.start.value = function_item.name.name;
    definitions.name.name = function_item.name.name;

    // 函数头以及函数体
    var func = definitions.value;
    // 更新模板中函数参数
    func.argnames = function_item.argnames;
    // 模板中函数体内for循环
    var func_body = func.body[1];
    var length = function_item.body.length + 1;

    // for循环内if语句判断条件
    var if_ast_condition = func_body.body.body[0].condition;
    // 修改判断条件右操作数为函数体中的语句数目
    if_ast_condition.right = changeAST_NodeAssign(if_ast_condition.right, length);

    // 模板中的switch语句块
    var switch_ast = func_body.body.body[1];

    function_item.body.forEach(function (function_body, index) {
        var temp = switch_ast.body[0].clone(true);
        temp.expression = changeAST_NodeAssign(temp.expression, 1 + index);

        var num = 2 + index;

        temp.body[0].body.end.raw = num.toString();
        temp.body[0].body.end.value = num;
        temp.body[0].body.right = changeAST_NodeAssign(temp.body[0].body.right, num);
        // 递归调用
        temp.body.unshift(flowflatten(fs, function_body));
        switch_ast.body.push(temp);
    });

    return result;
}

/**
 * 压扁控制流算法入口
 * @param fs 文件操作模块
 * @param node 需要操作的节点
 * @returns 新的节点
 */
function flowflatten(fs, node) {
    if (node instanceof  AST_While)
        return whileFlatten(fs, node);
    else if (node instanceof AST_Defun)
        return functionFlatten(fs, node);
    return node;
}
