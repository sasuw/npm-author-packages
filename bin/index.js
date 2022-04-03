#!/usr/bin/env node

const readNpmPackageAuthors = require('../lib/readNpmPackageAuthors.js');
const ObjectUtils = require('../lib/objectUtils');
const { spawn } = require('child_process');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const chalk = require('chalk');
const getPackageVersion = require('../lib/version');

function printToConsole(msg) {
    process.stdout.write(msg + '\n');
}

async function fetchAuthorPackages(npmUser) {
    return readNpmPackageAuthors.readNpmPackageAuthors(npmUser);
}

async function printAuthorPackageInvolvement(npmUser, npmPackage, quietOptionEnabled){
    let authorPackages = await readNpmPackageAuthors.readNpmPackageAuthors(npmUser);
    let authorFound = authorPackages.includes(npmPackage.trim()) ||
        authorPackages.includes('@' + npmUser + '/' + npmPackage.trim());
    if(quietOptionEnabled){
        printToConsole(authorFound);
        process.exit(0);
    }
    if(authorFound){
        printToConsole(npmUser + ' is a (co)author of package ' + npmPackage);
    }else{
        printToConsole(npmUser + ' is not a (co)author of package ' + npmPackage);
    }
    process.exit(0);
}

function printAuthorListPackageInvolvement(authorList){
    printToConsole('Option --authorlist has not been implemented yet.');
}

function printDefaultBlockListPackageInvolvement(authorList){
    printToConsole('Option --default-blocklist has not been implemented yet.');
}

function printAuthorPackages(authorPackages, quietOptionEnabled) {
    if (authorPackages.length === 0) {
        printToConsole('No packages found.');
    } else {
        let packageNoun = 'packages';
        if (authorPackages.length === 1) {
            packageNoun = 'package';
        }
        if (!quietOptionEnabled) {
            let foundStr = authorPackages.length + ' ' + packageNoun + ' found';
            printToConsole(chalk.underline(foundStr));
        }
    }

    authorPackages.forEach(element => {
        printToConsole(element);
    });
}

(async function () {
    const optionDefinitions = [
        { name: 'quiet', alias: 'q', type: Boolean },
        { name: 'author', alias: 'a', type: String, multiple: false, defaultOption: true },
        { name: 'package', alias: 'p', type: String },
        { name: 'ishere', alias: 'i', type: Boolean},
        { name: 'authorlist', alias: 'l', type: String},
        { name: 'default-blocklist', alias: 'd', type: Boolean},
        { name: 'help', alias: 'h', type: Boolean },
        { name: 'version', alias: 'v', type: Boolean }
    ]

    const options = commandLineArgs(optionDefinitions);

    console.log(options);

    if (ObjectUtils.isEmpty(options) || options.help) {
        displayHelp();
        process.exit(0);
    }

    if (options.version) {
        printToConsole('npm-package-authors v. ' + getPackageVersion());
        process.exit(0);
    }

    if (options.ishere != null && options.author == null) {
        printToConsole('Option --ishere (-i) requires that you also supply the npm author with the --author (-a) option. For more information, run this command with --help.');
        process.exit(4);
    }

    if (options.package != null && options.author == null) {
        printToConsole('Option --package (-p) requires that you also supply the npm author with the --author (-a) option. For more information, run this command with --help.');
        process.exit(4);
    }

    if (options.authorlist != null){
        printAuthorListPackageInvolvement(options.authorList);
        process.exit(0);
    }

    if (options['default-blocklist'] != null){
        printDefaultBlockListPackageInvolvement();
        process.exit(0);
    }

    //process.exit(0);
    if (options.author == null) {
        printToConsole('You have to provide a npm author.');
        process.exit(3);
    }

    if (options.package != null && options.author != null) {
        printAuthorPackageInvolvement(options.author, options.package, options.quiet);
    }else{
        if (!options.quiet) {
            var t1 = process.hrtime.bigint();
        }
        let authorPackages = await fetchAuthorPackages(options.author);
        if (!options.quiet) {
            let t2 = process.hrtime.bigint();
            let elapsedTimeNs = t2 - t1;
            let elapsedTime = (elapsedTimeNs.toString().slice(0, -6) + ' ms');
            printToConsole('Executing npm-author-packages took ' + elapsedTime + '\n');
        }
        printAuthorPackages(authorPackages, options.quiet);
    }
})();

function displayHelp() {
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
                    description: 'TBD: Name of npm package, for which you want to find out whether the given npm-author has been involved in. Requires --author option to be supplied.'
                },
                {
                    name: 'ishere',
                    alias: 'i',
                    description: 'TBD: Checks if the given author is the author of any dependency in the current project (as determined by the package.json file in the current directory). Requires --author option to be supplied.'
                },
                {
                    name: 'authorlist',
                    alias: 'l',
                    typeLabel: '{underline url or file}',
                    description: 'TBD: URL or file path of a text file containing the npm usernames of authors whose package involvement you want to check'
                },
                {
                    name: 'default-blocklist',
                    alias: 'd',
                    description: 'TBD: When enabled, checks if the current project (as determined by the package.json file in the current directory) has any dependencies where a known malware author has been involved.'
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
}