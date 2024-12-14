const btnSearch = document.querySelector('#btnSearch');
const csName = document.querySelector('#citySearchName');
const csBtn = document.querySelector('#citySearchBtn');
const btnGps = document.querySelector('#btnGps');
const myForm = document.querySelector('form');
const pre = document.querySelector('pre');

const lblGps = document.querySelector('#coordGps');
const lblName = document.querySelector('#cityName');
const lblNameInfo = document.querySelector('#cityInfo');


const nome = document.querySelector('h1');
const temp = document.querySelector('#temp');
const weatherNow = document.querySelector('#weatherNow');
const sCurrent = document.querySelector('#sCurrent');

const sForecast = document.querySelector('#sForecast');

// VARIABILI
const currentLocation = {
    latitude: 46.13648,
    longitude: 9.46157,
    name: 'Delebio',
    stato: 'IT',
    regione: 'Lombardia',
    provincia: 'Sondrio',
    comune: 'Delebio',
    localitaMeteo: 'Delebio',
    clear: function(){
        this.latitude = 0;
        this.longitude = 0;
        this.name = '';
        this.stato = '';
        this.regione = '';
        this.provincia = '';
        this.comune = '';
        this.localitaMeteo = '';
    },
    standard: function(){
        this.latitude = 46.13648;
        this.longitude = 9.46157;
        this.name = 'Delebio';
        this.stato = 'IT';
        this.regione = 'Lombardia';
        this.provincia = 'Sondrio';
        this.comune = 'Delebio';
        this.localitaMeteo = 'Delebio';
    },
    setGps: function(latitude, longitude){
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = '';
        this.stato = '';
        this.regione = '';
        this.provincia = '';
        this.comune = '';
        this.localitaMeteo = '';
    },
    toConsole: function (){
        console.log(`${this.name.toLocaleUpperCase()} (${this.provincia} - ${this.stato})`);
    },
    getPlace: function (){
        return `${this.name.toLocaleUpperCase()} (${this.provincia} - ${this.stato})`;
    },
    getPlaceName: function() {
        return `${this.name.toLocaleUpperCase()}`;
    },
    getPlaceInfo: function() {
        return this.provincia == undefined ? this.stato : `${this.provincia} - ${this.stato}`;
    },
    updateUI: function(){
        let myText = `${this.name.toLocaleUpperCase()} (${this.provincia} - ${this.stato})`;
        lblName.innerHTML = myText;
        myText = `GPS - lat: ${this.latitude} - long: ${this.longitude}`;
        lblGps.innerHTML = myText;
    }
}
let previsioni;
let meteoAttuale;

const gpsOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
};

const sCurrentPosition = sCurrent.getBoundingClientRect();

// CERCA PER NOME
// inserisci nome nell'input box
// premi Cerca
// richiesta ad open meteo di fornire le coordinate dal nome della località
// compilazione coordinate

// Cerca dal nome
function searchByName() {
    console.log('searchbyname');
    const villageName = csName.value.replace(/\s+/g,' ').trim();
    csName.value = villageName.at(0).toUpperCase() + villageName.slice(1);
    //csName.value = villageName;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${villageName}&count=10&language=it&format=json`
    const fetchPromise = fetch(url);
    console.log('avvio');
    fetchPromise.then((response) => {
        return response.json();
    })
    .then ((jresponse) => {
        console.log(jresponse);
        if (jresponse.results == undefined) {
            throw new Error(`no result for ${villageName} from open-meteo api`, { cause: "No results", details: "No results from open-meteo api"});
        }
        /*
        console.log(`Regione ${jresponse.results[0].admin1}`);
        console.log(`Provincia di ${jresponse.results[0].admin2}`);
        console.log(`Comune di ${jresponse.results[0].admin3}`);*/
        
        currentLocation.stato = jresponse.results[0].country;
        currentLocation.regione = jresponse.results[0].admin1;
        currentLocation.provincia = jresponse.results[0].admin2;
        currentLocation.comune = jresponse.results[0].admin3;
        currentLocation.name = jresponse.results[0].name;
        currentLocation.latitude = jresponse.results[0].latitude;
        currentLocation.longitude = jresponse.results[0].longitude;
        currentLocation.toConsole();
        //currentLocation.updateUI();

        console.log('searchByName >> chiamo getWeather');
        //csName.blur();
        csBtn.focus();
        getWeather();
    })
    .catch((error) => {
        console.error(error.message);
        //console.log(error);
        console.log(error.cause);
        if (error.cause){
            alert(`Non è stato possibile trovare la località ${villageName}`);
            csName.focus();
        }
    })
}

csBtn.addEventListener('click', searchByName);
csName.addEventListener('keydown', function(event) {
    if (event.code == 'Enter'){
        event.preventDefault();
        searchByName();
    }
    else {
        //btnGps.innerHTML = event.code;
    }
})
/*
csName.addEventListener('keyup', (event) => {
    btnGps.innerHTML = event.code;
})*/
/*csName.addEventListener('input', (event) => {
    btnGps.innerHTML = '#' + event.data + '#';
})*/

myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchByName();
})
csName.addEventListener('focus', (event) => {
    csName.select();
})



// LOCALIZZAZIONE CON GPS
// richiedi coordinate al browser

// Localizzami con GPS
async function locationSuccess(position){
    console.log('LOCALIZZAZIONE RIUSCITA');
    console.log(position);
    pre.innerText = 'LOCALIZZAZIONE RIUSCITA\n';
    currentLocation.setGps(position.coords.latitude, position.coords.longitude);
    //currentLocation.updateUI();
    await getPlaceInfo();
    await getWeather();
    //updateDashboard();
}

function locationFail(error){
    console.error('IMPOSSIBILE LOCALIZZARE');
    pre.innerText = 'LOCALIZZAZIONE FALLITA\nCIAO';
    switch(error.code) {
		case error.PERMISSION_DENIED:
			console.log("Permesso negato dall'utente");
            pre.innerText = pre.innerText + '\n' + 'Permesso negato dall\'utente';
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Impossibile determinare la posizione corrente");
            pre.innerText = pre.innerText + '\n' + 'Impossibile determinare la posizione corrente';

			break;
		case error.TIMEOUT:
			console.log("Il rilevamento della posizione impiega troppo tempo");
            pre.innerText = pre.innerText + '\n' + 'Il rilevamento della posizione impiega troppo tempo';

			break;
		case error.UNKNOWN_ERROR:
			console.log("Si è verificato un errore sconosciuto");
            pre.innerText = pre.innerText + '\n' + 'Errore sconosciuto';

			break;
	}

}

btnGps.addEventListener('click', function(){
    // getCurrentPosition è una funzione basata sulle callback
    if (!navigator.geolocation) alert('gps non supportato');
    navigator.geolocation.getCurrentPosition(locationSuccess, locationFail/*, gpsOptions*/);
    //navigator.geolocation.watchPosition(locationSuccess, locationFail/*, gpsOptions*/);
})


// Ricavo le informazioni sul luogo partendo dalle coordinate gps
function getPlaceInfoApiUrl(latitude, longitude) {
    return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=it`;
}
function getPlaceInfo(){
    return new Promise((resolve, reject) => {
        fetch(getPlaceInfoApiUrl(currentLocation.latitude, currentLocation.longitude))
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                console.log(response);
                console.log(response.status);
                return response.json();
            })
            .then((jresponse) => {
                console.log('INFO LOCALITA\' RICEVUTE');
                console.log(jresponse);/*
                console.log(`località: ${jresponse.locality}`);
                console.log(jresponse.latitude);
                console.log(jresponse.longitude);*/
                currentLocation.name = jresponse.locality;
                currentLocation.comune = jresponse.locality;
                currentLocation.stato = jresponse.countryName;
                currentLocation.regione = jresponse.localityInfo.administrative[2].name;
                currentLocation.provincia = jresponse.localityInfo.administrative[3].name;
                resolve('fatto');
            })
            .catch((error) => {
                console.error(`Could not get products: ${error} >> ${error.message}`);
                reject('errore');
            })
    })
}

/*
function getPlaceInfo(){
    fetch(getPlaceInfoApiUrl(currentLocation.latitude, currentLocation.longitude))
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            console.log(response);
            console.log(response.status);
            return response.json();
        })
        .then((jresponse) => {
            console.log('INFO LOCALITA\' RICEVUTE');
            console.log(jresponse);
            currentLocation.name = jresponse.locality;
            currentLocation.comune = jresponse.locality;
            currentLocation.stato = jresponse.countryName;
            currentLocation.regione = jresponse.localityInfo.administrative[2].name;
            currentLocation.provincia = jresponse.localityInfo.administrative[3].name;
        })
        .catch((error) => {
            console.error(`Could not get products: ${error} >> ${error.message}`);
        })
}*/




//oggetto info meteo - contiene le info meteo reletive ad un certo orario
function WeatherInfo(
    cloud_cover,
    precipitation_probability,
    relative_humidity_2m,
    temperature_2m,
    time,
    weather_code){
    
    this.cloud_cover = cloud_cover;
    this.precipitation_probability = precipitation_probability;
    this.relative_humidity_2m = relative_humidity_2m;
    this.temperature_2m = temperature_2m;
    this.time = new Date(time);
    this.weather_code = weather_code;

    this.getDate = function() {
        return `${this.time.getDate()}/${this.time.getMonth()}/${this.time.getFullYear()}`;
    }

    this.getTime = function(){
        const h = this.time.getHours();
        return h;
    }

    this.getDiv = function() {
        return 'prova ' + this.time;
    }

    this.newDay = function(){
        return (this.time.getHours() == 0 && this.time.getMinutes() == 0);
    }
}




// RICERCA INFO METEO
// Usa le coordinate salvate in currentLocation
function getWeather(){
    //const weatherInfoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&hourly=temperature_2m&hourly=relative_humidity_2m&hourly=cloud_cover&hourly=precipitation_probability&hourly=weather_code`
    const weatherInfoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&current=temperature_2m,relative_humidity_2m,cloud_cover,precipitation_probability,weather_code&hourly=temperature_2m&hourly=relative_humidity_2m&hourly=cloud_cover&hourly=precipitation_probability&hourly=weather_code`
    return new Promise( function (resolve, reject) {
        fetch(weatherInfoUrl)
        .then ((response) => {
            return response.json()
        })
        .then ((jresponse) => {
            console.log('RISPOSTA METEO:'); console.log(jresponse);
            // meteo attuale
            meteoAttuale = new WeatherInfo (
                jresponse.current.cloud_cover,
                jresponse.current.precipitation_probability,
                jresponse.current.relative_humidity_2m,
                jresponse.current.temperature_2m,
                jresponse.current.time,
                jresponse.current.weather_code
            )
            // previsioni
            const len = jresponse.hourly.time.length;
            previsioni = new Array();
            //creo gli oggetti di previsioni
            for (let i=0; i< len ; i++){
                previsioni.push(
                    new WeatherInfo(
                        jresponse.hourly.cloud_cover[i],
                        jresponse.hourly.precipitation_probability[i],
                        jresponse.hourly.relative_humidity_2m[i],
                        jresponse.hourly.temperature_2m[i],
                        jresponse.hourly.time[i],
                        jresponse.hourly.weather_code[i]
                    )
                )
                /*const nuovoElemento = document.createElement('div');
                nuovoElemento.innerHTML = `${i+1}) ${jresponse.hourly.time[i]}`;
                if (previsioni[i].newDay()) nuovoElemento.innerHTML = 'NEW DAY ' + nuovoElemento.innerHTML;
                nuovoElemento.classList.add('weatherBlock');
                document.body.append(nuovoElemento);*/
            }
            updateDashboard();
            resolve('ok');
        })
        .catch ((error) => {
            console.error(error.message);
            reject('fail');
        })
    }) ;
}



function getDayName(dayNumber){
    switch (dayNumber){
        case 0:
            return 'Domenica';
        case 1:
            return 'Lunedì';
        case 2:
            return 'Martedì';
        case 3:
            return 'Mercoledì';
        case 4:
            return 'Giovedì';
        case 5:
            return 'Venerdì';
        case 6:
            return 'Sabato';
        default:
            return '';
    }

}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function isTomorrow(date) {
    const tomorrow = new Date(Date.now()+(24*60*60*1000));
    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
}
  
  



function updateDashboard(){
    // Aggiorno i valori della mia posizione
    //nome.innerHTML = currentLocation.getPlace();
    lblName.innerHTML = currentLocation.getPlaceName();
    lblNameInfo.innerHTML = currentLocation.getPlaceInfo();
    //currentLocation.toConsole();
    console.log('***UPDATE DASHBOARD***');
    temp.innerHTML = '--°C';
    // METEO ATTUALE
    weatherNow.src = `meteo_img/${meteoAttuale.weather_code}.svg`
    temp.innerHTML = `${meteoAttuale.temperature_2m}°C`

    //PREVISIONI
    // Creo blocchi di previsione meteo
    const len = previsioni.length;
    const nowH = (new Date()).getHours();
    
    // Blocchi giorno
    const fDays = new Array();
    let currentDay = -1;
    let dayTitle;
    //devo scorrere tutto l'array delle previsioni orarie
    for (let i = 0; i < len; i++){
        // se cambio giorno devo fare un nuovo riquadro
        if (previsioni[i].getTime() == 0) {
            fDays.push(document.createElement('div'));
            fDays[++currentDay].classList.add('forecastDay');
            dayTitle = '';
            if (isToday(previsioni[i].time)){
                dayTitle = 'Oggi';
            } else if (isTomorrow(previsioni[i].time)){
                dayTitle = 'Domani';
            } else {
                dayTitle = `${getDayName(previsioni[i].time.getDay())} ${previsioni[i].getDate()}`
            }
            fDays[currentDay].innerHTML = `<div class="cardName">${dayTitle}</div>`;
            fDays[currentDay].appendChild(document.createElement('div'));
            fDays[currentDay].lastElementChild.classList.add('cards');
            
        }
        // non considero le previsioni relative al passato
        //if (i<23 && previsioni[i].getTime() < nowH) continue;
        if (i<27 && previsioni[i].time < Date.now()) continue;  //prima dell'una di notte arrivano anche le info del giorno precedente.
        //quindi si crea un riquadro di quel giorno ma completamente vuoto.
        

        // creo le card
        let card;
        let cardElements = new Array();
        card = document.createElement('div');
        card.classList.add('card');
        
        //creo orario e lo aggiungo
        cardElements.push(document.createElement('div'));
        cardElements[0].classList.add('fTime');
        cardElements[0].innerHTML = previsioni[i].getTime() + ':00';
        card.appendChild(cardElements[0]);

        //aggiungo l'icona del meteo
        cardElements.push(document.createElement('div'));
        cardElements[1].classList.add('fWeather');
        cardElements[1].innerHTML = `<img src="meteo_img/${previsioni[i].weather_code}.svg" alt="${previsioni[i].weather_code}">`;
        card.appendChild(cardElements[1]);

        //aggiungo la temperatura prevista
        cardElements.push(document.createElement('div'));
        cardElements[2].classList.add('fTemp');
        cardElements[2].innerHTML = `${previsioni[i].temperature_2m}°C`;
        card.appendChild(cardElements[2]);

        //aggiungo la probabilità di pioggia
        cardElements.push(document.createElement('div'));
        cardElements[3].classList.add('fPrecipit');
        cardElements[3].innerHTML = `<div><img src="meteo_img/drop.svg" alt="goccia"></div><div class="fPrecipitProb">${previsioni[i]["precipitation_probability"]}%</div>`
        card.appendChild(cardElements[3]);

        //dToday.appendChild(card);

        //aggiungo la card all'elemento "div.cards" del forecastDay corrente
        fDays[currentDay].lastElementChild.appendChild(card);
    }

    // Elimino tutte le previsioni e aggiungo le nuove
    while (sForecast.firstChild) {
        sForecast.removeChild(sForecast.firstChild);
    }
    for (let i = 0; i < fDays.length; i++){
        if (! fDays[i].lastElementChild.hasChildNodes()) continue;
        sForecast.appendChild(fDays[i]);
    }

    // Scorro in su la pagina
    window.scrollTo({
        top: sCurrentPosition.y,
        left: sCurrentPosition.x,
        behavior: "smooth"
    });
}


//pulsante avvia ricerca
btnSearch.addEventListener('click', getWeather);

