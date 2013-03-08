// Generated by CoffeeScript 2.0.0-beta4
var _sourceMaps, coffee, compile, compileAndBreak, compileFile, ext, formatSourcePosition, fs;
fs = require('fs');
coffee = require('coffee-script-redux');
_sourceMaps = {};
Error.prepareStackTrace = function (err, stack) {
  var frames, getSourceMapping, getSourceQuote, sourceFiles;
  sourceFiles = {};
  getSourceMapping = function (filename, line, column) {
    var mapString, sourceMap;
    mapString = _sourceMaps[filename];
    if (mapString) {
      sourceMap = null != sourceFiles[filename] ? sourceFiles[filename] : sourceFiles[filename] = mapString;
      return sourceMap.getSourcePosition([
        line,
        column
      ]);
    }
  };
  getSourceQuote = function () {
    var cache$, color_line, color_red, color_reset, column, errorFile, errorLines, fileLocation, fileName, frame, line, padLineNr, source;
    if (stack.length > 0 && !stack[0].isNative()) {
      frame = stack[0];
      if (frame.isEval()) {
        fileName = frame.getScriptNameOrSourceURL();
        if (!fileName)
          fileLocation = '' + frame.getEvalOrigin() + ', ';
      } else {
        fileName = frame.getFileName();
      }
      if (!(fileName && fileName[0] === '/'))
        return '';
      line = frame.getLineNumber();
      column = frame.getColumnNumber();
      source = getSourceMapping(fileName, line, column);
      if (source) {
        cache$ = source;
        line = cache$[0];
        column = cache$[1];
        ++line;
      }
      errorFile = fs.readFileSync(fileName, 'utf8').split('\n');
      color_red = '';
      color_line = '';
      color_reset = '';
      if (process.stdout.isTTY) {
        color_red = '\x1b[0;31m';
        color_line = '\x1b[0;30m';
        color_reset = '\x1b[0m';
      }
      padLineNr = function (lineNr) {
        return new Array((line + 2).toString().length - lineNr.toString().length + 5).join(' ') + lineNr;
      };
      errorLines = function (accum$) {
        var lineNo, lineNr;
        for (var i$ = 0, length$ = function () {
              var accum$1;
              var accum$1;
              accum$1 = [];
              for (var i$1 = line - 2; line - 2 <= line + 2 ? i$1 <= line + 2 : i$1 >= line + 2; line - 2 <= line + 2 ? ++i$1 : --i$1)
                accum$1.push(i$1);
              return accum$1;
            }.apply(this, arguments).length; i$ < length$; ++i$) {
          lineNr = function () {
            var accum$1;
            var accum$1;
            accum$1 = [];
            for (var i$1 = line - 2; line - 2 <= line + 2 ? i$1 <= line + 2 : i$1 >= line + 2; line - 2 <= line + 2 ? ++i$1 : --i$1)
              accum$1.push(i$1);
            return accum$1;
          }.apply(this, arguments)[i$];
          if (!(null != errorFile[lineNr - 1]))
            break;
          lineNo = '' + padLineNr(lineNr) + ': ';
          accum$.push(lineNr === line ? '  >' + color_line + lineNo.substr(3) + color_red + errorFile[lineNr - 1] + color_reset : '' + color_line + lineNo + color_reset + errorFile[lineNr - 1]);
        }
        return accum$;
      }.call(this, []);
      return errorLines.join('\n') + '\n';
    } else {
      return '';
    }
  };
  frames = function (accum$) {
    var frame;
    for (var i$ = 0, length$ = stack.length; i$ < length$; ++i$) {
      frame = stack[i$];
      if (frame.getFunction() === exports.runMain)
        break;
      accum$.push('  at ' + formatSourcePosition(frame, getSourceMapping));
    }
    return accum$;
  }.call(this, []);
  return '' + err.name + ': ' + (null != err.message ? err.message : '') + '\n' + frames.shift() + '\n' + getSourceQuote() + frames.join('\n') + '\n';
};
formatSourcePosition = function (frame, getSourceMapping) {
  var as, column, fileLocation, fileName, functionName, isConstructor, isMethodCall, line, methodName, source, tp, typeName;
  fileName = void 0;
  fileLocation = '';
  if (frame.isNative()) {
    fileLocation = 'native';
  } else {
    if (frame.isEval()) {
      fileName = frame.getScriptNameOrSourceURL();
      if (!fileName)
        fileLocation = '' + frame.getEvalOrigin() + ', ';
    } else {
      fileName = frame.getFileName();
    }
    fileName || (fileName = '<anonymous>');
    line = frame.getLineNumber();
    column = frame.getColumnNumber();
    source = getSourceMapping(fileName, line, column);
    fileLocation = source ? '' + fileName + ':' + (source[0] + 1) + ':' + source[1] + ', <js>:' + line + ':' + column : '' + fileName + ':' + line + ':' + column;
  }
  functionName = frame.getFunctionName();
  isConstructor = frame.isConstructor();
  isMethodCall = !(frame.isToplevel() || isConstructor);
  if (isMethodCall) {
    methodName = frame.getMethodName();
    typeName = frame.getTypeName();
    if (functionName) {
      tp = as = '';
      if (typeName && functionName.indexOf(typeName))
        tp = '' + typeName + '.';
      if (methodName && functionName.indexOf('.' + methodName) !== functionName.length - methodName.length - 1)
        as = ' [as ' + methodName + ']';
      return '' + tp + functionName + as + ' (' + fileLocation + ')';
    } else {
      return '' + typeName + '.' + (methodName || '<anonymous>') + ' (' + fileLocation + ')';
    }
  } else if (isConstructor) {
    return 'new ' + (functionName || '<anonymous>') + ' (' + fileLocation + ')';
  } else if (functionName) {
    return '' + functionName + ' (' + fileLocation + ')';
  } else {
    return fileLocation;
  }
};
compileFile = function (filename) {
  var cache$, code, coffeeOptions, csAST, input, jsAST, map;
  input = fs.readFileSync(filename, 'utf8');
  coffeeOptions = {
    optimise: false,
    bare: true,
    raw: true
  };
  csAST = coffee.parse(input, coffeeOptions);
  jsAST = coffee.compile(csAST, coffeeOptions);
  cache$ = coffee.jsWithSourceMap(jsAST, filename, coffeeOptions);
  code = cache$.code;
  map = cache$.map;
  console.log(code);
  _sourceMaps[filename] = map;
  code += '\n//@ sourceMappingURL=data:application/json;base64,';
  code += new Buffer('' + map).toString('base64');
  return code += '\n';
};
compile = function (module, filename) {
  var js;
  js = compileFile(filename);
  return module._compile(js, filename);
};
compileAndBreak = function (module, filename) {
  var js;
  js = compileFile(filename);
  js = "console.error('[bugger] Execution stopped at first line');debugger;" + js;
  return module._compile(js, filename);
};
if (require.extensions)
  for (var cache$ = ['.coffee'], i$ = 0, length$ = cache$.length; i$ < length$; ++i$) {
    ext = cache$[i$];
    require.extensions[ext] = compile;
  }
module.exports = {
  compile: compile,
  compileAndBreak: compileAndBreak
};
