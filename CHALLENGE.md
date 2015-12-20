Coding Challenge: Personalized Onboarding Flow

Flare is the most authentic and simple way to share your day with the people you care about. In order to add and convert these people into Flare users we plan to enable a personalized on boarding flow. This means existing users invite people by sending a referral link to their friend’s via a phone number.  Once the friend receives the referral link, the person can click on the link, be redirected to a website which will show the name of the person who sent the invite. They will be asked to enter their phone number to display the profile image of the person who wants them to join Flare.

Resources:
  •    Sketch file and PDF file with example wireframe of front end

Deliverables:


•    RESTful API endpoint
    1.  Invite a friend based on their phone number
    2.  New user sign up, return the profile image for the person who sent the referral link

•    Backend
    1.  Tables to support invite and sign up flow
    ⁃  For example, a User table with profile image (see below)
    2.  Referral link
    ⁃  Generate a referral link that will attribute/deep link a user and device
             ⁃  Use a 3rd party services such as Branch Metrics (https://dev.branch.io/) or Adjust (https://www.adjust.com/attribution/) to generate a referral link
     ⁃  Extra Credit: Send referral link to a phone number via Twilio (https://www.twilio.com/api)
    3.  Support live REST API and service

•    Frontend
    1.  When a person clicks on the referral link, they will be redirected to the live site and display the ONLY the name of the user who referred this person.  (see attached Sketch file or PDF wireframe)
    2.  Ask the person to enter their phone number (see attached Sketch file or PDF wireframe)
    ⁃  Upon entering a valid phone number, display the profile image of the user who referred this person.

Submission:
 •    Host the live website and support RESTful API (we may try to call the API from our client code :)
 •    Source code and documentation
 •    Create a github/bitbucket repo and share the link

