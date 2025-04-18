npm package to list all packages for the given author

# Installation and usage

## Global

To use this package anywhere from the terminal, install it globally

    npm install -g @sasuw/npm-author-packages

Then you can list npm packages for a specific author by running

    npmap [username]

To find out if any dependency (or sub-dependency) in your npm project involves a specific author, run this in your project directory

    npmap -a [username] -i

To find out if a specific author is a (co)author of a specific package, execute

    npmap -a [username] -p [package name]

For all options, run

    npmap -h

For more information see the [project Github page](https://github.com/sasuw/npm-author-packages)

## Local

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