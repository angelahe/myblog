require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const Sequelize = require('sequelize');
const epilogue = require('epilogue'), ForbiddenError = epilogue.Errors.ForbiddenError;
const app = express();
const port = 3000;

// session support is required to use ExpressOIDC
// creates session middleware with the options we passed it
app.use(session({
    secret: process.env.RANDOM_SECRET_WORD,
    resave: true,
    saveUninitialized: false
}));

//create instance of express OIDC for auth code flow 
//by redirect user to Okta for auth
// local session created and user context saved for duration of session
const oidc = new ExpressOIDC({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URL,
    scope: 'openid profile',
    routes: {
        callback: {
            path: '/authorization-code/callback',
            defaultRedirect: '/admin'
        }
    }
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
// adds /login redirect to Okta sign in page by default
// adds /authorization-code/callback to process OIDC response then attach user info to session
app.use(oidc.router);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, './public/home.html'));
 });

app.get('/admin', oidc.ensureAuthenticated(), (req, res) => {
    res.sendFile(path.join(__dirname, './public/admin.html'));
 });

app.get ('/logout', (req, res) => {
  req.logout ();
  res.redirect ('/home');
});

app.get ('/', (req, res) => {
  res.redirect ('/home');
});

// set up the connection to the sqlite db
const database = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    operatorsAliases: false,
});

// define the model which represents a table in the database
const Post = database.define('posts', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
});

// initialize Epilogue with our Express.js app and the database
epilogue.initialize({ app, sequelize: database });

// create the the REST resource, so now we have the 
// create, list, read, update, and delete controllers with corresponding endpoints for our post.
const PostResource = epilogue.resource({
    model: Post,
    endpoints: ['/posts', '/posts/:id'],
});

// authentication check to all CRUD routes to protect all endpoints
PostResource.all.auth(function (req, res, context) {
    return new Promise(function (resolve, reject) {
        if (!req.isAuthenticated()) {
            res.status(401).send({ message: "Unauthorized" });
            resolve(context.stop);
        } else {
            resolve(context.continue);
        }
    })
});

database.sync().then(() => {
    oidc.on('ready', () => {
        app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))
    });
});

oidc.on('error', err => {
    // An error occurred while setting up OIDC
    console.log("oidc error: ", err);
});

// deprecated with above
// app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))