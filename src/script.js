//Handlers

function handleCity(event) {
  event.preventDefault();
  let input = document.querySelector(`#input-city`);
  city = input.value;
  input.value = null;
  axios.get(`${API_URL}${city}&appid=${API_KEY}&units=${DEFAULT_UNIT}`).then(getWeatherInfo);
}

function getMyWeather() {
  function getMyGeo(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${DEFAULT_UNIT}&appid=${API_KEY}`;

    axios.get(apiUrl).then(getWeatherInfo);
  }

  navigator.geolocation.getCurrentPosition(getMyGeo);

}

function handleCelsius() {
  let unit = `metric`;
  updateElementText(`.wind-unit`, `m/s`);
  let cUnit = document.querySelectorAll(`.temp-unit`);
  cUnit.forEach(element => {
    element.innerHTML = `°C`;
  });
  axios.get(`${API_URL}${city}&appid=${API_KEY}&units=${unit}`).then(getWeatherInfo);
}

function handleFahrenheit() {
  let unit = `imperial`;
  updateElementText(`.wind-unit`, `mph`);
  let fUnit = document.querySelectorAll(`.temp-unit`);
  fUnit.forEach(element => {
    element.innerHTML = `°F`;
  });
  axios.get(`${API_URL}${city}&appid=${API_KEY}&units=${unit}`).then(getWeatherInfo);
}

//Time converters and formaters

function convertEpochToDate(time, timezone) {
  return new Date((time + timezone) * 1000);
}

function timeFormat(time) {
  let hour = time.getUTCHours();
  let minute = time.getUTCMinutes();
  minute = minute > 9 ? minute : '0' + minute;
  return (`${hour}:${minute}`);
}

function dateFormat(myDate) {
  function dateSuffix(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return `st`;
      case 2: return `nd`;
      case 3: return `rd`;
      default: return `th`;
    }
  }

  let weekDayName = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
  let weekDay = weekDayName[myDate.getUTCDay()];

  let monthName = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
  let month = monthName[myDate.getUTCMonth()];

  let date = myDate.getUTCDate();

  let suffix = dateSuffix(date);

  return (`${weekDay}, ${month} ${date}${suffix}`);
  //Fri, Dec 30th
}

//Update text elements

function updateElementText(selector, text) {
  let element = document.querySelector(selector);
  element.innerHTML = text;
}

//Update/Refreshers

function updateTime(date) {
  let formatedTime = timeFormat(date);
  updateElementText(`.top-time`, formatedTime);
}
function updateDate(date) {
  let formatedDate = dateFormat(date);
  updateElementText(`.top-day`, formatedDate);
}
function updateCity(name) {
  city = name;
  updateElementText(`#city`, city);
}

function updateIcon(icon) {
  let iLink = document.querySelector(`.current-icon`);
  iLink.innerHTML = `<img src=http://openweathermap.org/img/wn/${icon}@2x.png>`;
}

function updateTemp(temperature) {
  updateElementText(`.current-temp`, temperature);
}

function updateLow(temperature) {
  updateElementText(`.low-temp`, temperature);
}
function updateHigh(temperature) {
  updateElementText(`.high-temp`, temperature);
}
function updateWind(speed) {
  updateElementText(`.wind`, speed);
}
function updateHumidity(percentage) {
  updateElementText(`.humidity`, percentage);
}
function updateSunrise(date) {
  let formatedTime = timeFormat(date);
  updateElementText(`.sunrise`, formatedTime);
}

function updateSunset(date) {
  let formatedTime = timeFormat(date);
  updateElementText(`.sunset`, formatedTime);
}

// Main refresh function

function getWeatherInfo(response) {

  // top grid: Date, time and city info
  let date = convertEpochToDate(response.data.dt, response.data.timezone);
  updateTime(date);
  updateDate(date);
  updateCity(response.data.name);

  //middle grid: icon, current temperature and details as low, high, wind, humidity, sunrise, sunset
  updateIcon(response.data.weather[0].icon);
  updateTemp(Math.round(response.data.main.temp));
  updateLow(Math.round(response.data.main.temp_min));
  updateHigh(Math.round(response.data.main.temp_max));
  updateWind(Math.round(response.data.wind.speed));
  updateHumidity(response.data.main.humidity);
  let sunriseTime = convertEpochToDate(response.data.sys.sunrise, response.data.timezone)
  updateSunrise(sunriseTime);
  let sunsetTime = convertEpochToDate(response.data.sys.sunset, response.data.timezone)
  updateSunset(sunsetTime);

}

//Listeners

// Search button
let form = document.querySelector(`form`);
form.addEventListener(`submit`, handleCity);

// Current button
let locationArrow = document.querySelector(`#btn-myGeo`);
locationArrow.addEventListener(`click`, getMyWeather);

// Celsius button
let convertCelsius = document.querySelector(`#celsius-selector`);
convertCelsius.addEventListener(`click`, handleCelsius);

// Fahrenheit button
let convertFahrenheit = document.querySelector(`#fahrenheit-selector`);
convertFahrenheit.addEventListener(`click`, handleFahrenheit);

// Default configuration
const API_KEY = `d2c6c2007a695c29ac92861c649fdb75`;
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=`;
const DEFAULT_UNIT = `metric`;

// Global variable to hold current city
var city = ``;

getMyWeather();