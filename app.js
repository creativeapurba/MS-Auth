require('dotenv').config()
const express = require("express")
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const passport = require("passport")
// const session = require('express-session');

const app = express()

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const secretVal = process.env.MS_SECRET_VAL

passport.use(new MicrosoftStrategy({
    // Standard OAuth2 options
    clientID: process.env.MS_CLIENT_ID,
    clientSecret: secretVal,
    callbackURL: "http://localhost:5000/auth/microsoft/callback",
    scope: ['user.read'],

    // Microsoft specific options

    // [Optional] The tenant for the application. Defaults to 'common'. 
    // Used to construct the authorizationURL and tokenURL
    tenant: 'common',

    // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
    authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

    // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
    tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
},
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ userId: profile.id }, function (err, user) {
            console.log(profile.displayName);
            return done(profile.displayName);
        // });
    }
));

app.get('/auth/microsoft',
    passport.authenticate('microsoft', {
        // Optionally define any authentication parameters here
        // For example, the ones in https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

        prompt: 'select_account',
    }));

app.get('/auth/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.send('Login Successfull');
    });

app.listen(5000, () => {
    console.log("App is running on port 5000");
})