'use strict';
const Alexa = require('alexa-sdk');

module.exports.alexa = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('TestIntent');
    },
    'TestIntent': function () {
        this.emit(':tell', 'Hello My Man Hannah');
    },
    'Unhandled': function () {
        this.emit(':tell', 'Sorry, I did not get that.');
    }
};