const config = require('config');

module.exports = function() {
    let undefined = [];
    if (!config.get('jwtPrivateKey')) undefined.push('jwtPrivateKey');
    if (!config.get('dbPassword')) undefined.push('dbPassword');
    if (!config.get('dbLogin')) undefined.push('dbLogin');
    if (undefined.length !== 0) {
        throw new Error(`FATAL ERROR: the following environment variables are not defined: ${undefined}`);
    }
};
