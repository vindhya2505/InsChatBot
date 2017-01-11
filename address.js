var builder = require('botbuilder');
var Store = require('./store');

module.exports = {
    Label: 'Address',
    Dialog: [
        // name
        function (session) {
            session.send('Hi ! Welcome to Insurance Chatbot!');
			session.send('Are you looking for the Auto Insurance Cover? I can help you to decide on best covers available');
            builder.Prompts.text(session, 'Ready ! Please enter your name');
        },
        function (session, results, next) {
            session.dialogData.name = results.response;
            session.send('Welcome %s', results.response);
            next();
        },

        // Check-in
        function (session) {
            builder.Prompts.text(session, 'What is your email id?');
        },
        function (session, results, next) {
            session.dialogData.email = results.response;
            next();
        },

        // Nights
        function (session) {
            builder.Prompts.number(session, 'How many nights do you want to stay?');
        },
        function (session, results, next) {
            session.dialogData.nights = results.response;
            next();
        },

        // Search...
        function (session) {
            var name = session.dialogData.name;
            var email = session.dialogData.email;
           

            session.send('Ok. Searching for details in %s from %d/%d to %d/%d...',name,email);

            // Async search
            Store
                .searchCustomer(name, email)
                .then((customers) => {
                    // Results
                    session.send('I found your details:', customers.name,customers.email,customers.address);

                  /*  var message = new builder.Message()
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .attachments(customer.map(customerAsAttachment));*/

                    session.send("you are an existing customer");

                    // End
                    session.endDialog();
                });
        }
    ]
};

// Helpers
/*function customerAsAttachment(customer) {
    return new builder.HeroCard()
        .title(customer.name)
        .subtitle('%d name. %d email. From $%d address.', customer.name, customer.email, customer.address)
        .images([new builder.CardImage().url(customer.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.bing.com/search?q=customer+in+' + encodeURIComponent(customer.address))
        ]);
}*/

