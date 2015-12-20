/** REQS **/
var pg = require('pg');
var express = require('express');
var app = express();
var request = require('request');
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
* API Invite a friend based on their phone number, & dispatch [code generate, sms]
* @param   user  The user id of the inviter
* @param   phone The phone number of the invitee
*/
app.get('/invite/:user/:phone', function (req, res) {
    var response = res;
    // Make query
    var sql = 'select * from users where "id" = $1';
    // Pass parameterized variables
    var user = query(sql, [req.params.user], function(user) {

        // Expecting only one user record
        user = user[0];

        // Make payload for branch's api.
        // TODO: Turn this into a model of some kind later.
        var payload = {
            "branch_key":config().branch_key,
            "branch_secret":config().branch_secret,
            "campaign":"flare_signups",
            "channel":"webapp",
            "data": {
                date: Date(),
                name: user.name,
                email: user.email,
                user_id: user.id,
                image: user.image,
                telephone: req.params.phone,
                $deeplink_path: 'signup',
                $desktop_url: config().service_path + 'signup'
            }
        }

        // Send payload to Branch's deeplink creation endpoint
        request.post({
            url: config().branch_api,
            form: JSON.stringify(payload),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            },
            body: 'Incoming payload!'
        }, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                // We now have a deeplink. Yay.
                console.log("Successfully created deeplink");
                b = JSON.parse(body);

                // Add to invites db record for our own recordkeeping & linking
                var insert = query('insert into invites (user_id, code, telephone) VALUES ($1, $2, $3) returning id', [user.id, b.url, req.params.phone], function() {
                    // Output json of share code
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(body);
                });

                // Twilio Credentials
                var accountSid = config().twilio_sid;
                var authToken = config().twilio_token;

                //require the Twilio module and create a REST client
                var client = require('twilio')(accountSid, authToken);

                client.messages.create({
                    to: "+" + req.params.phone.length == 10 ? "1" + req.params.phone : req.params.phone,
                    from: "+16504698850",
                    body: "Yo! You're invited to Flare. Complete your registration now " + b.url,
                    mediaUrl: "http://farm2.static.flickr.com/1075/1404618563_3ed9a44a3a.jpg",
                }, function(err, message) {
                    console.log(message.sid);
                });
            }
            else {
                // Error
                console.log("Error with Branch's API. :(");
                console.log(error);
                res.status(500);
                res.render('error', { error: error });
            }
        });
    });
});

/**
* Sign up form. To be populated from referral data. Should be invoked from callback.
*/
app.get('/signup', function (req, res) {
    // Render signup page. Signup has client side connecting handler for Branch.io object
    res.render('pages/signup', {
        config: config(),
        _branch_match_id: req.query._branch_match_id
    });
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
* Connects to db using env var, and executes query. Force SSL for heroku postgres connection
* @param   queryString string   SQL Expression
* @param   params      string   Query parameters, safe from injection
* @param   callback    function successful function
* @returns boolean success
*/
var query = function(queryString, params, callback) {
    pg.connect(process.env.DATABASE_URL + '?ssl=true', function(err, client, done) {
        client.query(queryString, params, function(err, result) {
            if (err) {
                console.error(err);

                return "Error " + err;
            }
            else {
                if (result.rows) {
                    callback(result.rows);
                }
                else if (typeof callback !== 'undefined' && typeof callback === 'function') {
                    callback();
                }

                return true;
            }

            done();
        });
    });
}

