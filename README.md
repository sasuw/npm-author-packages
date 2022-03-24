npm package to list all packages for the given author

# Installation and usage

## Global

To use this package anywhere from the terminal, install it globally

    npm install -g @sasuw/npm-author-packages

Then you can list npm packages for a specific author by running

    npm-author-packages [username]

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