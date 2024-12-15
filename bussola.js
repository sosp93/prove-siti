const degreesVal = document.querySelector('#degrees');
const speedVal = document.querySelector('#speed');
const btnGps = document.querySelector('#btngps');

function displayPosition(){
    
}

// Localizzami con GPS
function locationSuccess(position){
    console.log('LOCALIZZAZIONE RIUSCITA');
    console.log(position);
    if (position.coords.speed == null) 
        speedVal.innerHTML = 'speed not available - ' + position.timestamp + ' - accuracy: ' + position.coords.accuracy;
    else
        speedVal.innerHTML = position.coords.speed
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


let watchPositionID = null;

btnGps.addEventListener('click', function(){
    // getCurrentPosition è una funzione basata sulle callback
    console.log('ciao');
    speedVal.innerHTML = "velocità richiesta...s"
    if (!navigator.geolocation) alert('gps non supportato');
    watchPositionID = navigator.geolocation.watchPosition(locationSuccess, locationFail/*, gpsOptions*/);
    //navigator.geolocation.watchPosition(locationSuccess, locationFail/*, gpsOptions*/);
})



window.addEventListener("deviceorientationabsolute",mylistener,true);

let i = 0;

/* https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained */

function mylistener (e) {
    console.log(e);
    if (e.alpha == null) {
        degreesVal.innerHTML = ++i + ') alpha not available - ' + (e.absolute ? "assoluta" : "relativa");
    }
    else {
        degreesVal.innerHTML = ++i + ') alpha: ' + Math.floor(e.alpha) + ' - ' + (e.absolute ? "assoluta" : "relativa");
    }
}
