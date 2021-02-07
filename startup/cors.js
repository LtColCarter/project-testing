const config = require('config');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*' );
        res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}