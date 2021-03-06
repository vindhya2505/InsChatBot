var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8000, function () {
    console.log('%s listening to %s', server.name, server.url);
});

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Dialogs
var Policy = require('./policy');
var Address = require('./address');
var Support = require('./support');

// Setup dialogs
bot.dialog('/address', Address.Dialog);
bot.dialog('/policy', Policy.Dialog);
bot.dialog('/support', Support.Dialog);


// Root dialog
bot.dialog('/', new builder.IntentDialog()
    .matchesAny([/help/i, /support/i, /problem/i], [
        function (session) {
            session.beginDialog('/support');
        },
        function (session, result) {
            var tickerNumber = result.response;
            session.send('Thanks for contacting our support team. Your ticket number is %s.', tickerNumber);
            session.endDialog();
        }
    ])
    .onDefault([
        function (session) {
            // prompt for search option
            builder.Prompts.choice(
                session,
                'Are you looking for Address Update or new auto Insurance Policy?',
                [Address.Label, Policy.Label],
                {
                    maxRetries: 3,
                    retryPrompt: 'Not a valid option'
                });
        },
        function (session, result) {
            if (!result.response) {
                // exhausted attemps and no selection, start over
                session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
                return session.endDialog();
            }

            // on error, start over
            session.on('error', function (err) {
                session.send('Failed with message: %s', err.message);
                session.endDialog();
            });

            // continue on proper dialog
            var selection = result.response.entity;
            switch (selection) {
                case Address.Label:
                    return session.beginDialog('/address')
                case Policy.Label:
                    return session.beginDialog('/policy')
            }
        }
    ]));