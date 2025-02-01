# TravelApp

The project include a simple form where you enter a location and also select departure and return dates. This info is passed on to the api to get image data from pixabay, weather forcast from weatherbit and location coordinates from geonames. Additionally, it helps to display the 

## Project goal

This project aims to gives the opportunity to put all of the skills learned into one project to build a custom travel app. Due to the nature of the course, it is very JavaScript heavy, but it is still expected to create clean and appealing HTML/CSS. It includes targeting the DOM, working with objects, and retrieving data from 3 APIs in which one of those is reliant on another to work. Finally, this is all going to be done in a Webpack environment, using an express server, and wrapped up with service workers.

## Run project
Below shows how to run in development and production mode.

## Run in development mode
To start the webpack dev server at port 8080

$ npm run build-dev

run in production mode
Generate the dist files and then start server at port 8082

$ npm run build-prod

$ npm run start

## APIs in server backend
* port we use is `8082`
* `/geonames`
* `/weatherbit`
* `/pixabay`

## Services we use
* [Geonames](http://www.geonames.org/export/web-services.html)
* [Weatherbit](https://www.weatherbit.io/api)
* [Pixabay](https://pixabay.com/api/docs/)

## Screenshots

![](https://screenshot.click/29-12-i4i6f-13aly.jpg)

![](https://screenshot.click/29-13-mcr55-z0xpo.jpg)