#!/usr/bin/env node

const readNpmPackageAuthors = require('../lib/readNpmPackageAuthors.js');
const ObjectUtils = require('../lib/objectUtils');
const { spawn } = require('child_process');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const chalk = require('chalk');

function printToConsole(msg){
    process.stdout.write(msg + '\n');
}

async function fetchAuthorPackages(npmUser) {
    return readNpmPackageAuthors.readNpmPackageAuthors(npmUser);
}

function printAuthorPackages(authorPackages, quietOptionEnabled) {
    if (authorPackages.length === 0) {  
        printToConsole('No packages found.');
    } else {
        let packageNoun = 'packages';
        if (authorPackages.length === 1) {
            packageNoun = 'package';
        }
        if(!quietOptionEnabled){
            let foundStr = authorPackages.length + ' ' + packageNoun + ' found';
            printToConsole(chalk.underline(foundStr));
        }
    }  

    authorPackages.forEach(element => {
        printToConsole(element);
    });
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

(async function () {
    const optionDefinitions = [
        { name: 'quiet', alias: 'q', type: Boolean },
        { name: 'author', alias: 'a', type: String, multiple: false, defaultOption: true },
        { name: 'package', alias: 'p', type: String },
        { name: 'help', alias: 'h', type: String },
        { name: 'version', alias: 'v', type: String }
    ]

    const options = commandLineArgs(optionDefinitions);

    //console.log(options);

    if (ObjectUtils.isEmpty(options) || options.help !== undefined) {
        const sections = [
            {
                header: 'npm-author-packages',
                content: 'outputs npm author package relations'
            },
            {
                header: 'Options',
                optionList: [
                    {
                        name: 'quiet',
                        alias: 'q',
                        description: 'does not output any extraneous information'
                    },
                    {
                        name: 'npm-author',
                        alias: 'a',
                        typeLabel: '{underline npm-author-username}',
                        description: 'Username of npm-author, whose packages you want to list'
                    },
                    {
                        name: 'package',
                        alias: 'p',
                        typeLabel: '{underline npm-package-name}',
                        description: 'Name of npm package, for which you want to find out whether the given npm-author has been involved in. Requires --author option to be supplied.'
                    },
                    {
                        name: 'help',
                        alias: 'h',
                        description: 'Print this usage guide.'
                    },
                    {
                        name: 'version',
                        alias: 'v',
                        description: 'Prints version number of npm-author-package'
                    }
                ]
            }
        ]
        const usage = commandLineUsage(sections);
        printToConsole(usage);
        process.exit(0);
    }

    //process.exit(0);
    if (options.author == null) {
        printToConsole('You have to provide a npm author.');
        process.exit(3);
    }

    let quietOptionEnabled = (options.quiet !== undefined);
    if(!quietOptionEnabled){
        var t1 = process.hrtime.bigint();
    }
    let authorPackages = await fetchAuthorPackages(options.author);
    if(!quietOptionEnabled){
        let t2 = process.hrtime.bigint();
        let elapsedTimeNs = t2 - t1;
        let elapsedTime = (elapsedTimeNs.toString().slice(0, -6) + ' ms');
        printToConsole('Executing npm-author-packages took ' + elapsedTime + '\n');
    }
    printAuthorPackages(authorPackages, quietOptionEnabled);
})();