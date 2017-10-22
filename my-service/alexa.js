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
const couldNotFind = 'I could not find a park matching your search.';
const errorSpeechlet = 'An error has occured while trying to retrieve the data.';

function getRequestOpt(url) {
    return {
        url: url,
        method: 'GET',
        headers: {
            'X-App-Token': config.appToken
        }
    };
};

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
    'OldestParkIntent': function() {
        var self = this;

        var opt = getRequestOpt(getOldestParkUrl());

        getOldestPark(opt, function(text) {
            self.emit(':ask', text);
        });
    },
    'BiggestParkIntent': function() {
        var self = this;

        var opt = getRequestOpt(getBiggestParkUrl());

        getBiggestPark(opt, function(text) {
            self.emit(':ask', text);
        });
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

function getOldestPark(opt, callback) {

    request(opt, function(err, resp, body) {
        var speechlet = null;

        if (err) {
            speechlet = errorSpeechlet;
        } else {
            speechlet = makeOldestParkSpeechlet(JSON.parse(body)[1]);  //Account for invalid data in dataset
        }

        return callback(speechlet);
    })
};

function getBiggestPark(opt, callback) {

    request(opt, function(err, resp, body) {
        var speechlet = null;

        if (err) {
            speechlet = errorSpeechlet;
        } else {
            speechlet = makeBiggestParkSpeechlet(JSON.parse(body)[0]);
        }

        return callback(speechlet);
    })
}

function getParksWithPicnicsUrl() {
    return 'https://data.nashville.gov/resource/xbru-cfzi.json?$query=SELECT%20park_name,%20picnic_shelters_quantity%20WHERE%20picnic_shelters=%22Yes%22';
};

function getOldestParkUrl() {
    return 'https://data.nashville.gov/resource/xbru-cfzi.json?$query=SELECT%20park_name,year_established%20ORDER%20BY%20year_established%20LIMIT%202';
};

function getBiggestParkUrl() {
    return 'https://data.nashville.gov/resource/xbru-cfzi.json?$query=SELECT%20park_name,acres%20ORDER%20BY%20acres%20DESC%20LIMIT%201';
}

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
        return couldNotFind;
    }
}

function makeOldestParkSpeechlet(park) {
    if (park.park_name) {
        var res = `The oldest park in Nashville is ${park.park_name}.  It was established in ${park.year_established}`;
        return res;
    } else {
        return couldNotFind;
    }
    
};

function makeBiggestParkSpeechlet(park) {
    if (park != undefined) {
        var res = `The biggest park in Nashville is ${park.park_name}, at ${park.acres} acres.`;
        return res;
    } else {
        return couldNotFind;
    }
};