'use strict';
const Alexa = require("alexa-sdk");
const request = require('request');

// const picnicHandlers = require('./picnicHandlers');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {    
    'LaunchRequest': () => {
        this.emit('PicnicIntent');
    },
    'PicnicIntent': () => {
        var self = this;

        getPicnic('http://google.com', function (text) {
            self.response.speak(text);
            self.emit(':responseReady');
        });
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('See you later!');
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Sorry, I didn\'t get that.');
    }
};

function getPicnic(url, callback) {
    request
        .get(url)
        .on('response', (response) => {
            return callback('getting parks with picnics');
        })
        .on('error', (err) => {
            console.log(err);
        });
}