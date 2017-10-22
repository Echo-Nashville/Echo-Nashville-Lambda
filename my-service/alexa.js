'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');
const config = require('./config');

const listLimit = 5;

const states = {
    MENU_STATE: '_MENU_STATE',
    PARK_STATE: '_PARK_STATE',
    ART_STATE: '_ART_STATE'
};

const welcomeMessage = 'Welcome to the Nashville Open Data Query Service.  Begin?';

module.exports.alexa = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = config.appId;
    alexa.registerHandlers(newSessionHandlers, 
                           menuStateHandlers, 
                           parkStateHandlers,
                           artStatehandlers, 
                           asyncHandlers);
    alexa.execute();
};

const newSessionHandlers = {
    'NewSession': function() {
        this.emit(':ask', welcomeMessage);
    },
    'AMAZON.YesIntent': function() {
        this.handler.state = states.MENU_STATE
        this.emitWithState('NewSession');
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        this.emit(':tell', 'What was that?');
    }
};

const menuStateHandlers = Alexa.CreateStateHandler(states.MENU_STATE, {
    'NewSession': function() {
        this.emit(':ask', 'Please select from the menu.');
    },
    'SelectPark': function() {
        this.handler.state = states.PARK_STATE
        this.emitWithState('NewSession');
    },
    'SelectArt': function() {
        this.handler.state = states.ART_STATE;
        this.emitWithState('NewSession');
    }
});

const parkStateHandlers = Alexa.CreateStateHandler(states.PARK_STATE, {
    'NewSession': function() {
        this.emit(':ask', 'Now in the park state.  Make selection.');
    },
    'MenuIntent': function() {
        this.handler.state = states.MENU_STATE;
        this.emitWithState('NewSession');
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
            self.emit(':ask', text);
        })
    },
    'Unhandled': function() {
        this.emit(':tell', 'What was that?');
    }
});

const artStatehandlers = Alexa.CreateStateHandler(states.ART_STATE, {
    'NewSession': function() {
        this.emit(':ask', 'Now in the art state.  Make selection.');
    },
    'MenuIntent': function() {
        this.handler.state = states.MENU_STATE;
        this.emitWithState('NewSession');
    },
    'Unhandled': function() {
        this.emit(':tell', 'What was that?');
    }
})

const asyncHandlers = {
    'MenuIntent': function() {
        this.handler.state = states.MENU_STATE;
        this.emitWithState('NewSession');
    }
}

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