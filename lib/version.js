const pkg = require('../package.json');

function getPackageVersion() {
  return pkg.version;
}

module.exports = getPackageVersion;
