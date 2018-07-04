"use strict";

var to_ascii = typeof atob == "undefined" ? function (b64) {
  return new Buffer(b64, "base64").toString();
} : atob;
var to_base64 = typeof btoa == "undefined" ? function (str) {
  return new Buffer(str).toString("base64");
} : btoa;

function read_source_map(code) {
  var match = /\n\/\/# sourceMappingURL=data:application\/json(;.*?)?;base64,(.*)/.exec(code);
  if (!match) {
    AST_Node.warn("inline source map not found");
    return null;
  }
  return to_ascii(match[2]);
}

/**
 * 将name配置项添加到keys的子配置中
 * @param {string} name 需要添加的配置项
 * @param {Dictionary} options 配置
 * @param {Array} keys 目标配置项列表
 */
function set_shorthand(name, options, keys) {
  if (options[name]) {
    keys.forEach(function (key) {
      if (options[key]) {
        if (typeof options[key] != "object") options[key] = {};
        if (!(name in options[key])) options[key][name] = options[name];
      }
    });
  }
}

function init_cache(cache) {
  if (!cache) return;
  if (!("cname" in cache)) cache.cname = -1;
  if (!("props" in cache)) {
    cache.props = new Dictionary();
  } else if (!(cache.props instanceof Dictionary)) {
    cache.props = Dictionary.fromObject(cache.props);
  }
}

function to_json(cache) {
  return {
    cname: cache.cname,
    props: cache.props.toObject()
  };
}


function changeAST_NodeAssign(obj, value) {
  obj.end.raw = value.toString();
  obj.end.value = value;
  obj.start.raw = value.toString();
  obj.start.value = value;
  obj.value = value;
  return obj;
}

function whileFlatten(fs, while_item) {
  // 读取压扁控制流模板文件，通过修改模板文件的AST得到目标
  var code = fs.readFileSync('./template/while.js', 'utf8');
  var result = parse(code).body[0];
  // while循环内的代码块数目
  var length = while_item.body.body.length + 1;
  // 模板文件的if判断条件
  var if_ast_condition = result.body.body[0].condition;
  // 修改判断条件为代码块数目
  if_ast_condition.right = changeAST_NodeAssign(if_ast_condition.right, length)
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
    //创建新的case节点，否则会遭遇deep clone问题，比较蛋疼

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

    temp.body.unshift(while_body);
    switch_ast.body.push(temp);
  });

  return result;
}

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
        //创建新的case节点，否则会遭遇deep clone问题，比较蛋疼

        var temp = switch_ast.body[0].clone(true);
        temp.expression = changeAST_NodeAssign(temp.expression, 1 + index);

        var num = 2 + index;

        temp.body[0].body.end.raw = num.toString();
        temp.body[0].body.end.value = num;
        temp.body[0].body.right = changeAST_NodeAssign(temp.body[0].body.right, num);

        temp.body.unshift(function_body);
        switch_ast.body.push(temp);
    });

    return result;
}

function minify(fs, files, options) {
  var warn_function = AST_Node.warn_function;
  try {
    options = defaults(options, {
      compress: {},
      ie8: false,
      keep_fnames: false,
      mangle: {},
      nameCache: null,
      output: {},
      parse: {},
      rename: undefined,
      sourceMap: false,
      timings: false,
      toplevel: false,
      warnings: false,
      wrap: false,
    }, true);
    var timings = options.timings && {
      start: Date.now()
    };
    if (options.rename === undefined) {
      // 逻辑与，expr1 && expr2，如果expr1 能转换成false则返回expr1，否则返回expr2。
      // 能够转换为false的表达式有：
      // null；
      // NaN；
      // 0；
      // 空字符串（""）；
      // undefined。
      options.rename = options.compress && options.mangle;
    }
    set_shorthand("ie8", options, ["compress", "mangle", "output"]);
    set_shorthand("keep_fnames", options, ["compress", "mangle"]);
    set_shorthand("toplevel", options, ["compress", "mangle"]);
    set_shorthand("warnings", options, ["compress"]);
    var quoted_props;
    if (options.mangle) {
      options.mangle = defaults(options.mangle, {
        cache: options.nameCache && (options.nameCache.vars || {}),
        eval: false,
        ie8: false,
        keep_fnames: false,
        properties: false,
        reserved: [],
        toplevel: false,
      }, true);
      if (options.mangle.properties) {
        if (typeof options.mangle.properties != "object") {
          options.mangle.properties = {};
        }
        if (options.mangle.properties.keep_quoted) {
          quoted_props = options.mangle.properties.reserved;
          if (!Array.isArray(quoted_props)) quoted_props = [];
          options.mangle.properties.reserved = quoted_props;
        }
        if (options.nameCache && !("cache" in options.mangle.properties)) {
          options.mangle.properties.cache = options.nameCache.props || {};
        }
      }
      init_cache(options.mangle.cache);
      init_cache(options.mangle.properties.cache);
    }
    if (options.sourceMap) {
      options.sourceMap = defaults(options.sourceMap, {
        content: null,
        filename: null,
        includeSources: false,
        root: null,
        url: null,
      }, true);
    }
    var warnings = [];
    if (options.warnings && !AST_Node.warn_function) {
      AST_Node.warn_function = function (warning) {
        warnings.push(warning);
      };
    }
    if (timings) timings.parse = Date.now();
    var toplevel;
    if (files instanceof AST_Toplevel) {
      toplevel = files;
    } else {
      if (typeof files == "string") {
        files = [files];
      }
      options.parse = options.parse || {};
      options.parse.toplevel = null;
      for (var name in files) if (HOP(files, name)) {
        options.parse.filename = name;
        options.parse.toplevel = parse(files[name], options.parse);


        options.parse.toplevel.body.forEach(function (item, index) {
          //应该使用递归
          if (item.start.value === 'while') {
            //可以使用在while上，更可以使用在整个文件上
            options.parse.toplevel.body[index] = whileFlatten(fs, item);
          } else if (item.start.value === 'function') {
            options.parse.toplevel.body[index] = functionFlatten(fs, item);
          }
        });

        if (options.sourceMap && options.sourceMap.content == "inline") {
          if (Object.keys(files).length > 1)
            throw new Error("inline source map only works with singular input");
          options.sourceMap.content = read_source_map(files[name]);
        }
      }
      toplevel = options.parse.toplevel;
    }
    if (quoted_props) {
      reserve_quoted_keys(toplevel, quoted_props);
    }
    if (options.wrap) {
      toplevel = toplevel.wrap_commonjs(options.wrap);
    }
    if (timings) timings.rename = Date.now();
    if (options.rename) {
      toplevel.figure_out_scope(options.mangle);
      toplevel.expand_names(options.mangle);
    }
    if (timings) timings.compress = Date.now();
    if (options.compress) toplevel = new Compressor(options.compress).compress(toplevel);
    if (timings) timings.scope = Date.now();
    if (options.mangle) toplevel.figure_out_scope(options.mangle);
    if (timings) timings.mangle = Date.now();
    if (options.mangle) {
      base54.reset();
      toplevel.compute_char_frequency(options.mangle);
      toplevel.mangle_names(options.mangle);
    }
    if (timings) timings.properties = Date.now();
    if (options.mangle && options.mangle.properties) {
      toplevel = mangle_properties(toplevel, options.mangle.properties);
    }
    if (timings) timings.output = Date.now();
    var result = {};
    if (options.output.ast) {
      result.ast = toplevel;
    }
    if (!HOP(options.output, "code") || options.output.code) {
      if (options.sourceMap) {
        if (typeof options.sourceMap.content == "string") {
          options.sourceMap.content = JSON.parse(options.sourceMap.content);
        }
        options.output.source_map = SourceMap({
          file: options.sourceMap.filename,
          orig: options.sourceMap.content,
          root: options.sourceMap.root
        });
        if (options.sourceMap.includeSources) {
          if (files instanceof AST_Toplevel) {
            throw new Error("original source content unavailable");
          } else for (var name in files) if (HOP(files, name)) {
            options.output.source_map.get().setSourceContent(name, files[name]);
          }
        }
      }
      delete options.output.ast;
      delete options.output.code;
      var stream = OutputStream(options.output);
      toplevel.print(stream);
      result.code = stream.get();
      if (options.sourceMap) {
        result.map = options.output.source_map.toString();
        if (options.sourceMap.url == "inline") {
          result.code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + to_base64(result.map);
        } else if (options.sourceMap.url) {
          result.code += "\n//# sourceMappingURL=" + options.sourceMap.url;
        }
      }
    }
    if (options.nameCache && options.mangle) {
      if (options.mangle.cache) options.nameCache.vars = to_json(options.mangle.cache);
      if (options.mangle.properties && options.mangle.properties.cache) {
        options.nameCache.props = to_json(options.mangle.properties.cache);
      }
    }
    if (timings) {
      timings.end = Date.now();
      result.timings = {
        parse: 1e-3 * (timings.rename - timings.parse),
        rename: 1e-3 * (timings.compress - timings.rename),
        compress: 1e-3 * (timings.scope - timings.compress),
        scope: 1e-3 * (timings.mangle - timings.scope),
        mangle: 1e-3 * (timings.properties - timings.mangle),
        properties: 1e-3 * (timings.output - timings.properties),
        output: 1e-3 * (timings.end - timings.output),
        total: 1e-3 * (timings.end - timings.start)
      }
    }
    if (warnings.length) {
      result.warnings = warnings;
    }
    return result;
  } catch (ex) {
    return {error: ex};
  } finally {
    AST_Node.warn_function = warn_function;
  }
}