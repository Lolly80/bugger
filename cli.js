// Generated by CoffeeScript 2.0.0-beta4
var DebugServer, forkChrome, forkScript, resolveModule;
resolveModule = require('./bugger').resolveModule;
DebugServer = require('./inspector/server').DebugServer;
forkChrome = require('./forked/chrome');
forkScript = require('./forked/entry_script');
module.exports = {
  run: function () {
    var argv, argvParser, chrome, debugPort, entryScript;
    argvParser = require('optimist').usage('bugger [OPTIONS] FILE_NAME').options({
      version: {
        alias: 'v',
        describe: 'Just show version information',
        boolean: true
      },
      help: {
        alias: 'h',
        describe: 'Show this text',
        boolean: true
      },
      'debug-port': {
        'default': 5858,
        describe: 'Debug port used by node'
      },
      chrome: {
        boolean: true,
        describe: 'Open Chrome with the correct url'
      },
      'debug-brk': {
        describe: 'Break on first line of script',
        boolean: true,
        'default': true
      },
      'web-host': {
        'default': '127.0.0.1',
        describe: 'Web host used by node-inspector'
      },
      'web-port': {
        'default': 8058,
        describe: 'Web port used by node-inspector'
      }
    });
    argv = argvParser.argv;
    if (argv.version) {
      console.log(require('./package.json').version);
      process.exit(0);
    }
    if (argv.help) {
      argvParser.showHelp();
      process.exit(0);
    }
    if (!argv._.length) {
      argvParser.showHelp();
      process.exit(1);
    }
    entryScript = resolveModule(argv._[0]);
    if (!(null != entryScript))
      throw new Error('File not found: ' + argv._[0]);
    debugPort = argv['debug-port'];
    if (argv.chrome) {
      chrome = forkChrome(argv['web-host'], argv['web-port'], debugPort);
      chrome.on('exit', process.exit);
    }
    return forkScript(entryScript, debugPort, argv['debug-brk'], argv._, function (param$) {
      var cache$, debugConnection, debugServer, entryScriptProc;
      {
        cache$ = param$;
        entryScriptProc = cache$.entryScriptProc;
        debugConnection = cache$.debugConnection;
      }
      entryScriptProc.on('exit', process.exit);
      debugServer = new DebugServer().start({
        webHost: argv['web-host'],
        webPort: argv['web-port'],
        debugConnection: debugConnection
      });
      return process.on('exit', function () {
        try {
          if (argv.chrome)
            chrome.kill();
        } catch (e$) {
        }
        try {
          entryScriptProc.kill();
        } catch (e$1) {
        }
        try {
          return debugServer.close();
        } catch (e$2) {
          return;
        }
      });
    });
  }
};
