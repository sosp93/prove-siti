const degreesVal = document.querySelector('#degrees');
const btnGps = document.querySelector('#btngps');

function displayPosition(){
    
}

// Localizzami con GPS
function locationSuccess(position){
    console.log('LOCALIZZAZIONE RIUSCITA');
    console.log(position);
    if (position.coords.heading == null) 
        degreesVal.innerHTML = 'not available - ' + position.timestamp + ' - accuracy: ' + position.coords.accuracy;
    else
        degreesVal.innerHTML = position.coords.heading
}

function locationFail(error){
    console.error('IMPOSSIBILE LOCALIZZARE');
    pre.innerText = 'LOCALIZZAZIONE FALLITA\nCIAO';
    switch(error.code) {
		case error.PERMISSION_DENIED:
			console.log("Permesso negato dall'utente");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Impossibile determinare la posizione corrente");
			break;
		case error.TIMEOUT:
			console.log("Il rilevamento della posizione impiega troppo tempo");
			break;
		case error.UNKNOWN_ERROR:
			console.log("Si è verificato un errore sconosciuto");
			break;
	}

}


// let watchPositionID = null;

// btnGps.addEventListener('click', function(){
//     // getCurrentPosition è una funzione basata sulle callback
//     console.log('ciao');
//     if (!navigator.geolocation) alert('gps non supportato');
//     watchPositionID = navigator.geolocation.watchPosition(locationSuccess, locationFail/*, gpsOptions*/);
//     //navigator.geolocation.watchPosition(locationSuccess, locationFail/*, gpsOptions*/);
// })

window.addEventListener("deviceorientationabsolute",mylistener,true);

function mylistener (e) {
    console.log(e);
    if (e.alpha == null) {
        degreesVal.innerHTML = 'alpha not available - ' + e.timeStamp;
    }
    else {
        degreesVal.innerHTML = 'alpha: ' + e.alpha + ' - ' + e.timeStamp;
    }
}
