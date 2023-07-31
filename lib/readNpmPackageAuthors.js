const axios = require('axios').default;

const NPM_BASE_URL = 'https://www.npmjs.com/~';
const NPM_DEFAULT_ENTRIES_PER_PAGE = 25;

function getMatchPackageName(argMatch) {
    if (argMatch == null || argMatch.value == null || argMatch.value.length == null || argMatch.value.length < 2) {
        return null;
    }
    return argMatch.value[2];
}

async function getNpmPackagesForUser(npmUser, page, existingPackages) {
    let npmUrl = NPM_BASE_URL + npmUser;
    if (page != null) {
        npmUrl = npmUrl + '?page=' + page;
    }else{
        page = 0;
    }

    if(existingPackages == null){
        existingPackages = [];
    }

    const response = await axios.get(npmUrl).catch(reason => {
        if(page === 0 && reason.response.status === 404){
            console.log('NPM author not found');
            process.exit(1);
        }
        
        console.log('Error: ' + reason.response.status);
        process.exit(2);
    });

    const npmUserHtml = response.data;
    const matchIterator = npmUserHtml.matchAll(/(href="\/package\/)(.*?)(")/g);

    let npmPackageName = null;
    let packagesAddedCount = 0;
    while ((npmPackageName = getMatchPackageName(matchIterator.next())) != null) {
        if (npmPackageName != null) {
            existingPackages.push(npmPackageName);
            packagesAddedCount++;
        }
    }

    if(packagesAddedCount === NPM_DEFAULT_ENTRIES_PER_PAGE){
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