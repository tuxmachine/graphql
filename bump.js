const fs = require('fs'),
  package = require('./package.json'),
  childProcess = require('child_process');
const version = package.version.split('.').map(i => parseInt(i, 10));
version[2]++;
package.version = version.join('.');
fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
childProcess.execSync('git add package.json');
childProcess.execSync('git add dist');
childProcess.execSync(`git commit -m 'Version bump ${version}'`);
childProcess.execSync(`git tag '${version}'`);
childProcess.execSync(`git push --tags feat/github-package`);