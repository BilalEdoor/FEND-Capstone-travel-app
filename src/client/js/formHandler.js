
var moment = require('moment');// require momentjs

//const form = document.querySelector("#form");



  //event listener
  //form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault()

    // remove hide classes
    document.querySelector('.city-section').classList.remove('hide');
    document.querySelector('.forecast-section').classList.remove('hide');
    document.querySelector('.itin-section').classList.remove('hide');
  

  // check what text was put into the form field
  let destination = document.getElementById('destination').value
  let startDate = document.getElementById('start-date').value
  let endDate = document.getElementById('end-date').value
  // total days of forecast
  let daysOfForecast = 5; 

  let daysSingularOrPlural="";

  // dates
  let todaysDate = new Date().getTime(); 
  let departDate = new Date(startDate).getTime();
  let returnDate = new Date(endDate).getTime();
  let msInDay = 1000 * 3600 * 24;
  let timeLeft = Math.floor((departDate - todaysDate) / msInDay);
  let travelLength = Math.floor((returnDate - departDate ) / msInDay);

  //check for valid dates
  if (timeLeft === -1){
    timeLeft = "Your trip starts today";
  }else if (timeLeft < -1){
    timeLeft = "Select a future departure date";
  } else{
    timeLeft ++;
  }

  //condition to pluralizes days
  if (travelLength > 1){
    daysSingularOrPlural ="days";
  }else if (travelLength < 0){
    travelLength ="Select a future return date";
    daysSingularOrPlural = "";
  }else{
    daysSingularOrPlural ="day";
  } 

  //weathebit
  console.log("::: Form Submitted :::")
  fetch('http://localhost:8082/weatherbit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      destination:  destination,
      daysOfForecast: daysOfForecast

    })
    
  })
  .then(res => res.json()).then(data => {
    
    document.querySelector('[data-depart-date]').innerHTML = moment(startDate).format("MMM Do YYYY");
    document.querySelector('[data-return-date]').innerHTML = moment(endDate).format("MMM Do YYYY");
    document.querySelector('[data-travel-length]').innerHTML = `${travelLength} ${daysSingularOrPlural}`
    document.querySelector('[data-day-left]').innerHTML = timeLeft;
    document.querySelector('[data-today-date]').innerHTML = moment(data.data[0].valid_date).format("MMM Do YYYY");
    document.querySelector('[data-today-desc]').innerHTML = data.data[0].weather.description;
    document.querySelector('[data-today-weather]').innerHTML =`${data.data[0].temp}<span class="temp-unit">&#8451;</span>`
    
   
    // reset dom
    document.querySelector('[data-forecast]').innerHTML=""; 
    let positionOnDom = document.querySelector('[data-forecast]');
    // set weather icon
    document.querySelector('[data-weather-icon]').src = `icons/${data.data[0].weather.icon}.png`
    for (let i= 1; i <= daysOfForecast; i++){
      let weatherCard = `<div class="weather-card">
                            <p class="weather-card-desc">${moment(data.data[i].valid_date).format("MMM Do YYYY")}</p>
                            <img class="weather-icon" src="icons/${data.data[i].weather.icon}.png">
                            <p class="minmax-temp">${data.data[0].min_temp}&#8451; - ${data.data[0].max_temp}&#8451;</p>
                            <p class="weather-card-desc">${data.data[i].weather.description}</p>
                        </div>`;
      
                    positionOnDom.insertAdjacentHTML('beforeend', weatherCard);
    }
    
  }).catch(console.log("error - weatherbit"));
  
  //pixabay
  console.log("::: Form Submitted :::")
  fetch('http://localhost:8082/pixabay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      destination:  destination,
      daysOfForecast: daysOfForecast,
    })
    
  })
  .then(res => res.json()).then(data => {
    //get city image from api and as src url for bg image
    document.querySelector('.city-card').style.backgroundImage = `url('${data.hits[0].largeImageURL}')`;

    
  }).catch(err => alert("error - pixabay"));
 

  fetch('http://localhost:8082/geonames', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      destination:  destination

    })
    
  })
  .then(res => res.json()).then(data => {
  
    document.querySelector('[data-lat]').innerHTML =`lat: ${data.postalCodes[0].lat}`;
    document.querySelector('[data-lng]').innerHTML =`lon: ${data.postalCodes[0].lng}`;
    document.querySelector('[data-city]').innerHTML =`${data.postalCodes[0].placeName}, ${data.postalCodes[0].countryCode}`;

  }).catch(err => alert("error - geonames"));

};


   export { 
    handleSubmit
}

