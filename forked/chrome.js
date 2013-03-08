// Generated by CoffeeScript 2.0.0-beta4
var execFile, findChrome, firstExistingPath, fs, path;
path = require('path');
fs = require('fs');
execFile = require('child_process').execFile;
firstExistingPath = function (paths) {
  for (var i$ = 0, length$ = paths.length; i$ < length$; ++i$) {
    path = paths[i$];
    if (fs.existsSync(path))
      return path;
  }
  return null;
};
findChrome = function () {
  var paths;
  paths = function () {
    switch (process.platform) {
    case 'win32':
      return [
        path.join(process.env.LocalAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(process.env['ProgramFiles(x86)'], 'Google', 'Chrome', 'Application', 'chrome.exe')
      ];
    case 'darwin':
      return [path.join('/', 'Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome')];
    default:
      return [path.join('/', 'opt', 'google', 'chrome', 'google-chrome')];
    }
  }.call(this);
  return firstExistingPath(paths);
};
module.exports = function (host, port, debugPort) {
  var args, chromePath, chromeProfilePath;
  chromeProfilePath = path.join(__dirname, '..', 'ChromeProfile');
  args = [
    '--app=http://' + host + ':' + port + '/inspector.html?port=' + debugPort,
    '--user-data-dir=' + chromeProfilePath
  ];
  chromePath = findChrome();
  if (!chromePath)
    throw new Error('Chrome not found');
  return execFile(chromePath, args);
};
