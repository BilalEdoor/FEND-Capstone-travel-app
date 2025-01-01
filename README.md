# ~v1.0

# Front End Web Developer Nanodegree - Capstone Project: Travel Planner Web App

This is a project to [Udacity](https://www.udacity.com/us)'s Front End Web Developer nanodegree.

## Overview

This is a single page web app, which includes a simple form where you enter the location you are traveling to and the date you are leaving. If the trip is within a week, you will get the current weather forecast. If the trip is in the future, you will get a predicted forecast.

It works by getting a desired trip location and date from the user, then displaying weather and an image of the location using information obtained from external APIs.

### 👀 Check it Out:
### https://gotaplan.onrender.com

![got-a-plan-demonstration](https://user-images.githubusercontent.com/78409024/128229001-19e0ad3e-760d-42ee-b415-975ce8d46922.gif)


## Project Intro

* Building a web app that allows users to to plan their trips based on predicted weather forecasts for the location they are travelling to.

* The goal of this project is to get practice with:
  - Setting up a server environment
  - Setting up Webpack
  - Sass styles
  - Webpack Loaders and Plugins
  - Targeting the DOM, working with objects
  - Creating layouts and page design
  - Service workers
  - Using APIs and creating requests to external urls
  - Working with Testing units 

* Language and tools for this project:
  - Node & Express: For server side development
  - js: For client side development
  - Webpack: Build tool
  - Service workers: Offline functionality
  - Jest: Testing unit

* Project rubric: 

Check out the specifications [here](https://review.udacity.com/#!/rubrics/2669/view).

## Project Extension

Some extra features were included in this project:

- Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
- Allow the user to remove the trip.

## Getting Started

Follow the steps below to get the project running.

Clone this Github repository and use [NPM](https://www.w3schools.com/whatis/whatis_npm.asp) to install all the dependencies listed in the _package.json_ file:

```
$ git clone https://github.com/Janaina-MJ/FEND-Capstone-travel-app.git
$ cd FEND-Capstone-travel-app
$ npm install
```

Then, start the local server:

```
$ npm run build-prod
$ npm start
```

The app will be running in your browser on localhost:8081

### Runnning the development mode

After completing the steps above, open a second terminal and start the webpack dev server:

`$ npm run build-dev`

The development version of the app will be running in your browser on localhost:8080  
(the page will automatically update in the browser after any code change)


### Testing Unit

This project has a Testing Unit to check if the main functions are working correctly.
Testing is done with [Jest](https://jestjs.io/). 

To run tests you can use the following NPM command:

`$ npm run test`

The test results will be displayed on the terminal.
