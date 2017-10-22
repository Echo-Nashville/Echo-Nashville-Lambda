'use strict';

const request = require('request');
const Alexa = require("alexa-sdk");

module.exports = {
    'LaunchRequest': () => {
        this.emit('PicnicIntent');
    },
    'PicnicIntent': () => {
        request
            .get('http://google.com')
            .on('response', (response) => {
                this.emit(':tell', 'Getting parks with picnics');
            })
            .on('error', (err) => {
                console.log(err);
                this.emit('Unhandled');
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