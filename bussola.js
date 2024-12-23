const mymain = document.querySelector('main');

const degreesVal = document.querySelector('#degrees');
const note = document.querySelector('#note');

const btnGps = document.querySelector('#btngps');
const btnBussola = document.querySelector('#compass-toggle');
const bussola = document.querySelector('#compass-img');


/* VARIABILI */
let rotationInterval;  //timer ripetitivo per animazione

// Orientamento dispositivo
// alpha coincide con l'azimut.
// Angolo [0° , 360°) rispetto alla direzione nord misurata in senso orario
let alpha = 0; // azimut
let alphaCont = 0; //azimut corretto per non avere salti
let compassActive = false;

// VISUALIZZA A SCHERMO L'ORIENTAMENTO DEL DISPOSITIVO
// Se c'è un parametro è fittizio perchè la bussola non è disponibile
function displayPosition(degrees){
    //let currentOrientation = bussola.style.transform;
    if (degrees == null) {
        //bussola.style.transform = `rotate(${alphaCont}deg)`;
        bussola.style.transform = `rotate(0deg)`;
        degreesVal.innerHTML = `Bussola non disponibile`;
    }
    else {
        bussola.style.transform = `rotate(${alphaCont}deg)`;
        degreesVal.innerHTML = `Azimut: ${Math.floor(alpha)}°`;
    }
}


/* https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained */

// PULSANTE ACCENSIONE-SPEGNIMENTO BUSSOLA
/* Premendo il pulsante accendo o spengo la bussola
   tramite aggiunta o rimozione dell'event listener*/
btnBussola.addEventListener('click', function(){
    if (btnBussola.innerHTML == 'SPEGNI BUSSOLA') {
        //console.log('spegni');
        mylistener();
        window.removeEventListener("deviceorientationabsolute", mylistener, true);
        btnBussola.innerHTML = 'ACCENDI BUSSOLA';
        note.innerHTML = 'BUSSOLA SPENTA';
        compassActive = false;
    }
    else {
        //console.log('accendi');
        mylistener();
        window.addEventListener("deviceorientationabsolute", mylistener, true);
        btnBussola.innerHTML = 'SPEGNI BUSSOLA';
        note.innerHTML = 'BUSSOLA ACCESA';
        compassActive = true;
    }
})

// GESTIONE DELL'EVENTO deviceorientationabsolute
function mylistener (e) {
    // Se non passo l'argomento
    if (e == null) {
        /* Se ho un timer attivo lo spengo*/
        clearInterval(rotationInterval);
        // azzero la bussola
        displayPosition();
    }
    // Se non ho le informazioni sull'orientamento
    else if (e.alpha == null) {
        // animazione della bussola
        let j = 0;
        if (j==0) console.log(e);
        let increment = 10;
        rotationInterval = setInterval(function() {
            oldDeg = j;
            j += increment;
            if (j >= 360) increment = -10;
            if (j <=-360) {
                clearInterval(rotationInterval);
                j = -360;
            }
            bussola.style.transform = `rotate(${(j)}deg)`;
        }, 25/*ms*/);
    }
    // Se conosco le info sull'orientamento
    else {
        let degOld = alpha;
        alpha = e.alpha;
        alphaCont = alphaCont + degVar(degOld, alpha);
        displayPosition(alphaCont);
    }
}


// restituisce la differenza in gradi tra due valori di angolo
// nell'intervallo [-180 , +180]
function degVar(oldVal, newVal) {
    let diff = newVal - oldVal;
    if (diff > 180) {
        diff = diff - 360;
    }
    else if (diff < -180) {
        diff = diff + 360;
    }
    return diff;
}


// CLICK BUSSOLA
bussola.addEventListener('click', function() {
    const newEl = document.createElement('div');
    newEl.innerHTML = 'CLICK';
    mymain.appendChild(newEl);
    setTimeout(() => {
        mymain.removeChild(newEl);
    }, 500);
})