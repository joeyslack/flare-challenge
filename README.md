Flare Challenge
====================
Joseph Slack
@SlackJoe


Description
---------------------

Based on the provided [Challenge Instructions](CHALLENGE.md), the included files provide a backend and a front end implementation.

This project uses native css & javascript on the client side, and nodejs w/ express, postgres and request on the server side. 3rd party integration with Branch.io (https://dev.branch.io/) for referral link generation and twilio (https://www.twilio.com) for sms messaging.

Appflow goes something like this:
* Request invite on endpoint (https://boiling-gorge-3368.herokuapp.com/invite/1/PHONE_NUMBER_GOES_HERE). This fetches user_id of 1 from the database, and stores the user data in branch.io, associated with the phone number provided.
* Connect to twilio and send message to user with referral link included
* Client clicks on referral link, and is requested to enter phone number. If phone number matches what was on record for the original request, we succeed.

**Notes**
Branch actually supports SMS messenging, so it's duplicate work to have both Branch and Twilio. Just a fun thing to have both I guess.


Deliverables
---------------------

* RESTful API endpoint (https://boiling-gorge-3368.herokuapp.com/invite/1/PHONE_NUMBER_GOES_HERE)
* Backend database in postgres. [Dump available here](latest.dump)
* Frontend
    * https://boiling-gorge-3368.herokuapp.com
    * Referral link (to be provided)
* Extra credit. Twilio implemented


HOSTING & CONFIG
---------------------

This application is hosted on heroku, and should be super easy to host yourself. You'll need to `npm install`, and host a db.

You'll need an envinment variable: `DATABASE_URL=postgres://USERNAME:mq_-PASSWORD@eYOUR_HOST.com/YOUR_DB` in order to connect to the appropriate db.

For Twilio's SMS feature to work, you'll need to verify your phone number with twilio (since this app is using a trial account): https://www.twilio.com/user/account/phone-numbers/verified
