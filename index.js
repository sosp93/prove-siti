const itemClock = document.querySelector('#item-clock');
const itemWeather = document.querySelector('#item-weather');
const itemSs36 = document.querySelector('#item-ss36');
const itemCompass = document.querySelector('#item-compass');

itemClock.addEventListener('click', function() {
    location.href = "orologio.html"
})

itemWeather.addEventListener('click', function() {
    location.href = "meteo.html"
})

/* https://www.gallerieleccocolico.it/ */

itemSs36.addEventListener('click', function() {
    location.href = itemSs36.attributes.goto.value;
})

itemCompass.addEventListener('click', function() {
    location.href = itemCompass.attributes.goto.value;
})