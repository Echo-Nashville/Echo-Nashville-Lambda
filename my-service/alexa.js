'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

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
        var self = this;

        getParksWithPicnics('http://google.com', function(text) {
            self.emit(':tell', text);
        })
    },
    'Unhandled': function () {
        this.emit(':tell', 'Sorry, I did not get that.');
    }
};

function getParksWithPicnics(url, callback) {
    request
        .get(url)
        .on('response', function (response) {
            return callback('Getting parks with picnics.');
        })
        .on('error', function(err) {
            console.log(err);
        });
};