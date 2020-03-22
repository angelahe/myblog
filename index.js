require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const app = express();
const port = 3002;

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

app.get('/', (req, res) => {
  res.send('<h1>Welcome!!</h1>');
});

app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))