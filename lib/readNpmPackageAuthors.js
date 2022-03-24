const axios = require('axios').default;

const npmBaseUrl = 'https://www.npmjs.com/~';

function getMatchPackageName(argMatch) {
    if (argMatch == null || argMatch.value == null || argMatch.value.length == null || argMatch.value.length < 2) {
        return null;
    }
    return argMatch.value[2];
}

async function getNpmPackagesForUser(npmUser, page, existingPackages) {
    let npmUrl = npmBaseUrl + npmUser;
    if (page != null) {
        npmUrl = npmUrl + '?page=' + page;
    }else{
        page = 0;
    }

    if(existingPackages == null){
        existingPackages = [];
    }

    const response = await axios.get(npmUrl).catch(reason => {
        if(reason.response.status === 404){
            console.log('NPM author not found');
            process.exit(1);
        }

        console.log('Error: ' + reason.response.status);
        process.exit(2);
    });

    let npmUserHtml = response.data;

    const b = npmUserHtml.matchAll(/(href="\/package\/)(.*?)(")/g);

    let npmPackageName = null;

    let packagesAddedCount = 0;

    while ((npmPackageName = getMatchPackageName(b.next())) != null) {
        if (npmPackageName != null) {
            existingPackages.push(npmPackageName);
            packagesAddedCount++;
        }
    }

    if(packagesAddedCount === 25){
        await getNpmPackagesForUser(npmUser, (page + 1), existingPackages);
    }

    
    return existingPackages;
}

exports.readNpmPackageAuthors =  async function readNpmPackageAuthors(npmUser){
    try {
        return getNpmPackagesForUser(npmUser);
    } catch (error) {
        console.log(error);
    }
}