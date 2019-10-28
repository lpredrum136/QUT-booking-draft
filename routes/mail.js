const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/auth');
require('isomorphic-fetch');
const graph = require('@microsoft/microsoft-graph-client');

/* GET /mail */
router.get('/', async(req, res, next) => {   

    const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

    if (accessIdentity) {
        let parms = {
            title: 'Inbox',
            active: {
                inbox: true
            },
            user: accessIdentity.username
        };

        // Initialize Graph client
        const client = graph.Client.init({
            authProvider: (done) => {
                done(null, accessIdentity.access_token);
            }
        });

        try {
            // Get the 10 newest messages from inbox
            const result = await client.api('/me/mailfolders/inbox/messages')
                                        .top(10)
                                        .select('subject,from,receivedDateTime,isRead')
                                        .orderby('receivedDateTime DESC')
                                        .get();

            console.log(result);
            parms.messages = result.value;
            res.render('mails/index', parms);
        } catch (err) {
            parms.message = 'Error retrieving messages';
            parms.error = {
                status: `${err.code}: ${err.message}`
            };
            parms.debug = JSON.stringify(err.body, null, 2);
            res.render('error', parms);
        }
    } else {
        // Redirect to Home
        res.redirect('/');
    }
});

module.exports = router;