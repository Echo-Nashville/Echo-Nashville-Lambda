# Nashville Parks and Rec

This project utilizes the Nashville Open Data  to integrate with Alexa. You can ask Alexa different utterances including where to find certain parks, what features parks have, where to find art, etc.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```
-an AWS Account
-an Amazon Developer Account
-Amazon Echo
-Node.js
-npm
-Serverless (optional, but recommended)
```

### Installing


Install the Alexa sdk and request http module in the working directory.
```
npm install
```
Install Serverless to improve the workflow

```
npm install -g serverless
```

## Deployment
Developer needs to register an API token with the * [SODA API](https://github.com/dev.socrata.com) - The SDK for Node.js used
Once, the environment is set up, and amazon developer and AWS are set up, serverless can be used to push deployments to Alexa without the need for uploading code through the AWS site.
## Built With

* [Alexa Skills Kit](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) - The SDK for Node.js used
* [Serverless](https://serverless.com/) - Toolkit for deploying and operating the serverless architecture.
* [AWS Lambda Functions](https://aws.amazon.com/lambda/) - Code upload tool that integrates with Alexa
* [Amazon Developer](https://developer.amazon.com/) - Alexa skill creator

## Challenges
We faced multiple challenges during VandyHacks IV:
* This was our first hackathon ever!
* It was our first time developing with an Echo, AWS, Lambda, Open Data API, and the Alexa-SDK
* Alexa-SDK is complex
* The HTTPS request module took multiple tries to implement
* Two of us were familiar with node.js and software development, while it was the first time coding with node.js for our other 2 members.
* It was our first time using the Open Data API.


## Future Goals
* We would like to implement cards, so that when you ask about a park, a card pushes a picture and an address to your phone
* We would like to add more natural and parametrized utterances.
* We want to see this implemented across other cities! The SODA API has data for other cities.
* We want to be able to query the closest park. We have the proper Google Maps API, but did not have time to implement it.
* Lastly, we would like to implement 2 slots per query.
* We would like to add Alexa to wearables so you can ask about Nashville on the fly.
