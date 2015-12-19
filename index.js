/** REQS **/
var pg = require('pg');
var express = require('express');
var app = express();
var config = require('./config');

/** INIT **/

// Initialize listen port for heroku. We'll use 5000 locally
app.set('port', (process.env.PORT || 5000));

// Point to assets
app.use(express.static(__dirname + '/public'));

// Use ejs rendering, and point to templates
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Start listening
app.listen(app.get('port'), function() {
    console.log('Node is now running on port: ' + app.get('port'));
});


/** ROUTING **/

// App entry page
app.get('/', function(req, res) {
    res.render('pages/index', {
        config: config()
    });
});

/**
* Invite a friend based on their phone number, generate codes, and sms
* @param   user  The user id of the inviter
* @param   phone The phone number of the invitee
*/
/*app.get('/invite/:user/:phone', function (req, res) {
    res.end("TEST");
});*/
app.get('/invite/:branch_match_id', function (req, res) {
    res.end('yo ' + req.params.branch_match_id);
});


/**
* Retrieve a referral code and retrieve & render the inviter's profile
* @param code The referral code
*/
app.get('/referral/:code', function (req, res) {

});


/** UTILITY METHODS **/

/**
* Query interface
* Connects to db using env var, and executes query
* @param   queryString string SQL Expression
* @returns array result rows from query
*/
var query = function(queryString, page) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(queryString, function(err, result) {
            done();

            if (err) {
                console.error(err);
                return "Error " + err;
            }
            else {
                return result.rows;
            }
        });
    });
}

