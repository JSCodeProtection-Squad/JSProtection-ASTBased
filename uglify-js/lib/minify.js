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

// function deepCopyAST(obj, obj_type) {
//   var return_obj = new obj_type();
//   for (var name in obj) {
//     if (typeof obj[name] == 'undefined' || obj[name] === null || typeof obj[name] != 'object') {
//       return_obj[name] = obj[name];
//     } else {
//       return_obj[name] = deepCopyAST(obj[name], obj[name].constructor);
//     }
//   }
//   return return_obj;
// }

function whileFlatten(fs, while_item) {
  var code = fs.readFileSync('./template/while.js', 'utf8');
  var result = parse(code).body[0];
  var length = while_item.body.body.length + 1;
  
  //根据模板改写AST_NODE，假定行数列数不影响结果
  var if_ast_condition = result.body.body[0].condition;
  if_ast_condition.right.end.raw = length.toString();
  if_ast_condition.right.end.value = length;
  if_ast_condition.right.start.raw = length.toString();
  if_ast_condition.right.start.value = length;
  if_ast_condition.right.value = length;
  // //switch
  var switch_ast = result.body.body[1];
  switch_ast.body[0].body[0].condition = while_item.condition;
  
  var first_if_final = switch_ast.body[0].body[0].alternative.body[0].body;
  first_if_final.end.raw = length.toString();
  first_if_final.end.value = length;
  first_if_final.right.end.raw = length.toString();
  first_if_final.right.end.value = length;
  first_if_final.right.start.raw = length.toString();
  first_if_final.right.start.value = length;
  first_if_final.right.value = length;
  
  while_item.body.body.forEach(function (while_body, index) {
    //创建新的case节点，否则会遭遇deep clone问题，比较蛋疼
    
    var temp = new AST_Case({
      end: new AST_Token({
        raw: undefined,
        file: null,
        comments_after: [],
        comments_before: [],
        nlb: false,
        value: ';',
        type: 'punc'
      }),
      start: new AST_Token({
        raw: undefined,
        file: null,
        comments_after: [],
        comments_before: [],
        nlb: true,
        value: 'case',
        type: 'keyword'
      }),
      body: [
        new AST_StatementWithBody({
          end: new AST_Token({
            raw: undefined,
            file: null,
            comments_after: [],
            comments_before: [],
            nlb: false,
            value: ';',
            type: 'punc'
          }),
          start: new AST_Token({
            raw: undefined,
            file: null,
            comments_after: [],
            comments_before: [],
            nlb: true,
            value: 'next',
            type: 'name'
          }),
          body: new AST_Assign({
            end: new AST_Token({
              raw: '1',
              file: null,
              comments_after: [],
              comments_before: [],
              nlb: false,
              value: 1,
              type: 'num'
            }),
            start: new AST_Token({
              raw: undefined,
              file: null,
              comments_after: [],
              comments_before: [],
              nlb: true,
              value: 'next',
              type: 'name'
            }),
            right: new AST_Number({
              end: new AST_Token({
                raw: '1',
                file: null,
                comments_after: [],
                comments_before: [],
                nlb: false,
                value: 1,
                type: 'num'
              }),
              start: new AST_Token({
                raw: '1',
                file: null,
                comments_after: [],
                comments_before: [],
                nlb: false,
                value: 1,
                type: 'num'
              }),
              value: 1
            }),
            left: new AST_Symbol({
              end: new AST_Token({
                raw: undefined,
                file: null,
                comments_after: [],
                comments_before: [],
                nlb: true,
                value: 'next',
                type: 'name'
              }),
              start: new AST_Token({
                raw: undefined,
                file: null,
                comments_after: [],
                comments_before: [],
                nlb: true,
                value: 'next',
                type: 'name'
              }),
              name: 'next'
            }),
            operator: '='
          })
        }),
        new AST_Break({
          end: new AST_Token({
            raw: undefined,
            file: null,
            comments_after: [],
            comments_before: [],
            nlb: false,
            value: ';',
            type: 'punc'
          }),
          start: new AST_Token({
            raw: undefined,
            file: null,
            comments_after: [],
            comments_before: [],
            nlb: true,
            value: 'break',
            type: 'keyword'
          }),
          label: null
        })
      ],
      expression: new AST_Number({
        end: new AST_Token({
          raw: '1',
          file: null,
          comments_after: [],
          comments_before: [],
          nlb: false,
          value: 1,
          type: 'num'
        }),
        start: new AST_Token({
          raw: '1',
          file: null,
          comments_after: [],
          comments_before: [],
          nlb: false,
          value: 1,
          type: 'num'
        }),
        value: 1
      })
    });
    temp.expression.end.raw = (1 + index).toString();
    temp.expression.end.value = 1 + index;
    temp.expression.start.raw = (1 + index).toString();
    temp.expression.start.value = 1 + index;
    temp.expression.value = 1 + index;
    
    var num = 2 + index;
    if (index == while_item.body.body.length - 1) {
      //此处为动态找自构不透明谓词词典
      num = 0;
    }
    temp.body[0].body.end.raw = num.toString();
    temp.body[0].body.end.value = num;
    temp.body[0].body.right.end.raw = num.toString();
    temp.body[0].body.right.end.value = num;
    temp.body[0].body.right.start.raw = num.toString();
    temp.body[0].body.right.start.value = num;
    temp.body[0].body.right.value = num;
    
    temp.body.unshift(while_body);
    switch_ast.body.push(temp);
  });
  
  return result;
}

function functionFlatten(fs, function_item) {
  var code = fs.readFileSync('./template/function.js', 'utf8');
  var result = parse(code).body[0];
  // var length = function_item.body.body.length + 1;
  
  // return result;
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
