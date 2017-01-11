var Promise = require('bluebird');

module.exports = {
    searchCustomer: function (name, email) {
        return new Promise(function (resolve) {

            // Filling the customer details manually just for demo purposes
            var customers = [];
            for (var i = 1; i <= 5; i++) {
                customers.push({
                    name: name + ' Customer ' + i,
                    email: email,
                    address: 'Address' +i,
                    image: 'https://placeholdit.imgix.net/~text?txtsize=35&txt=Hotel+' + i + '&w=500&h=260'
                });
            }

            setTimeout(() => resolve(customers), 1000);
        });
    }
};