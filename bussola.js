const degreesVal = document.querySelector('#degrees');
const note = document.querySelector('#note');
const btnGps = document.querySelector('#btngps');
const btnBussola = document.querySelector('#compass-toggle');
const bussola = document.querySelector('#compass-img');

let rotationInterval;


function displayPosition(degrees){
    bussola.style.transform = `rotate(${degrees}deg)`;
    degreesVal.innerHTML = `Azimut: ${Math.floor(degrees==360 ? 0 : degrees)}°`;
}

/* Premendo il pulsante accendo o spengo la bussola */
btnBussola.addEventListener('click', function(){
    if (btnBussola.innerHTML == 'SPEGNI BUSSOLA') {
        window.removeEventListener("deviceorientationabsolute", mylistener);
        btnBussola.innerHTML = 'ACCENDI BUSSOLA';
    }
    else {
        window.addEventListener("deviceorientationabsolute", mylistener, true);
        btnBussola.innerHTML = 'SPEGNI BUSSOLA';
    }
})


let eventNumber = 0;

/* https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained */

function mylistener (e) {
    /* Se ho un timer attivo devo come prima cosa spegnerlo*/
    clearInterval(rotationInterval);
    if (e.alpha == null) {
        degreesVal.innerHTML = ++eventNumber + ') alpha not available - ' + (e.absolute ? "assoluta" : "relativa");
        let j = 0;
        rotationInterval = setInterval(function() {
            if (j>=360) clearInterval(rotationInterval);
            bussola.style.transform = `rotate(${j++}deg)`;
        }, 30);
    }
    else {
        displayPosition(e.alpha);
        /*
        degreesVal.innerHTML = ++eventNumber + ') alpha: ' + Math.floor(e.alpha) + ' - ' + (e.absolute ? "assoluta" : "relativa");
        bussola.style.transform = `rotate(${e.alpha}deg)`;
        */
    }
}
