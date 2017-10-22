'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');
const config = require('./config');

const listLimit = 5;

module.exports.alexa = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('PicnicIntent');
    },
    'PicnicIntent': function () {
        var self = this;

        var opt = {
            url: getParksWithPicnicsUrl(),
            method: 'GET',
            headers: {
                'X-App-Token': config.appToken
            }
        };

        getParksWithPicnics(opt, function(text) {
            self.emit(':tell', text);
        })
    },
    'Unhandled': function () {
        this.emit(':tell', 'Sorry, I did not get that.');
    }
};

function getParksWithPicnics(opt, callback) {

    request(opt, function(err, resp, body) {
        var speechlet = null;

        if (err) {
            speechlet = makeParksWithPicnicsSpeechlet([]);
        } else {
            speechlet = makeParksWithPicnicsSpeechlet(JSON.parse(body));
        }

        return callback(speechlet);
    });
};

function getParksWithPicnicsUrl() {
    return 'https://data.nashville.gov/resource/xbru-cfzi.json?$query=SELECT%20park_name,%20picnic_shelters_quantity%20WHERE%20picnic_shelters=%22Yes%22';
};

function makeParksWithPicnicsSpeechlet(parks) {
    var parksList = "";

    if (parks.length > 0) {

        for (var i = 0; i < listLimit; i++) {
            if (i === listLimit - 1) {
                parksList += ' and ';
            }

            parksList += parks[i].park_name + ',';
        }

        var res = `The parks with picnic areas are ${parksList}.`;
        return res;
    } else {
        return 'I could not find any parks with picnic areas.';
    }
}