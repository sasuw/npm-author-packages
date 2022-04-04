# About npm-author-packages

npm-author-packages is an npm package for accessing various npm author/package related information, such as
- which packages has an author created
- is a specific author the creator of a package
- is an author involved in creation of any of the packages in a project

## Why?
According to the [documentation of npm-search](https://docs.npmjs.com/cli/v7/commands/npm-search) it should be possible to search for an npm package with the npm username. However, this seems currently not to work (in April 2022), so I decided to create my own solution for accomplishing this. Initially my motivation was sparked by the [peacenotwar npm malware](https://en.wikipedia.org/wiki/Peacenotwar) and my desire to check if that specific author was involved in any of packages my projects are using.

## How does it work
For reading the npm packages of an author, I use screenscraping techniques. Because of this the command for listing author packages may be slow when there are very many packages, like for user [sindresorhus](https://www.npmjs.com/~sindresorhus). For determining project dependencies [npm-ls](https://docs.npmjs.com/cli/v8/commands/npm-ls) is used.

# Installation and usage

## As a terminal utility

To use this package anywhere from the terminal, install it globally

    npm install -g @sasuw/npm-author-packages

Then you can list npm packages for a specific author by running

    npm-author-packages [username]

To find out if any dependency (or sub-dependency) in your npm project involves a specicic author, run this in your project directory

    npm-author-packages -a [username] -i

To find out if a specicic author is a (co)author of a specific package, execute

    npm-author-packages -a [username] -p [package name]

For all options, run

    npm-author-packages -h

## In code

To use this package in your own project

    npm i --save @sasuw/npm-author-packages

Code example to print all packages for an npm author with username *sasuw*

    const npmAuthorPackages = require("@sasuw/npm-author-packages");

    (async function () {
        let authorPackages = await npmAuthorPackages.readNpmPackageAuthors('sasuw');
        authorPackages.forEach(element => {
            console.log(element);
        });
    })();
