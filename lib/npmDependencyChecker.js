const { spawn } = require('child_process');

class NpmDependencyChecker {

    /**
     * Executes command npm --all --parseable and returns all packages found from the output as an 
     * one-dimensional array of strings
     * 
     * @returns Array of strings
     */
    static async readDependencies() {
        let cwd = process.cwd();
        const npmListAll = spawn('npm', ['list', '--all', '--parseable']);

        let rawdata = '';
        for await (const chunk of npmListAll.stdout) {
            rawdata += chunk;
        }

        let nodeModules = [];
        let nodeModuleStr = '/node_modules/';
        let lineData = rawdata.split('\n');
        for(let i = 0; i < lineData.length; i++){
            let line = lineData[i];
            if(line.indexOf(nodeModuleStr) > 0){
                nodeModules.push(line.substring(line.lastIndexOf(nodeModuleStr) + nodeModuleStr.length));
            }
        }

        /*
        npmListAll.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        npmListAll.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        npmListAll.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });
        */

        return nodeModules;
    }
}

module.exports = NpmDependencyChecker;