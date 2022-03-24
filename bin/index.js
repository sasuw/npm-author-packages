#!/usr/bin/env node

const readNpmPackageAuthors = require("../lib/readNpmPackageAuthors.js");

(async function () {
    if (process.argv.length < 2) {
        console.log('You have to provide a npm author.');
        process.exit(3);
    }

    if (process.argv.length > 3) {
        console.log('Too many arguments.');
        process.exit(4);
    }

    let npmUser = process.argv[2];
    let authorPackages = await readNpmPackageAuthors.readNpmPackageAuthors(npmUser);

    if (authorPackages.length === 0) {
        console.log('No packages found.');
    } else {
        let packageNoun = 'packages';
        if (authorPackages.length === 1) {
            packageNoun = 'package';
        }
        console.log(authorPackages.length + ' ' + packageNoun + ' found:');
    }

    authorPackages.forEach(element => {
        console.log(element);
    });
})();