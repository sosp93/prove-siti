const degreesVal = document.querySelector('#degrees');
const note = document.querySelector('#note');
const btnGps = document.querySelector('#btngps');
const btnBussola = document.querySelector('#compass-toggle');
const bussola = document.querySelector('#compass-img');

let rotationInterval;
let degreesBase = 0;

function displayPosition(degrees){
    /* correggere ed evitare il salto */
    let customDegrees = degrees;
    let currentOrientation = bussola.style.transform;
    console.log(currentOrientation);
    if (degrees > 180) {
        console.log('oltre 180');
    }
    else {
        console.log('prima 180');
    }

    bussola.style.transform = `rotate(${degrees}deg)`;
    degreesVal.innerHTML = `Azimut: ${Math.floor(degrees==360 ? 0 : 360 - degrees)}°`;
}

/* Premendo il pulsante accendo o spengo la bussola */
btnBussola.addEventListener('click', function(){
    if (btnBussola.innerHTML == 'SPEGNI BUSSOLA') {
        console.log('spegni');
        mylistener();
        window.removeEventListener("deviceorientationabsolute", mylistener, true);
        btnBussola.innerHTML = 'ACCENDI BUSSOLA';
    }
    else {
        console.log('accendi');
        window.addEventListener("deviceorientationabsolute", mylistener, true);
        btnBussola.innerHTML = 'SPEGNI BUSSOLA';
    }
})


let eventNumber = 0;

let degOld = 0;
let degCurrent = 0;
let degCurrentCont = 0;

/* https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained */

function mylistener (e) {
    /* Se ho un timer attivo devo come prima cosa spegnerlo*/
    clearInterval(rotationInterval);
    if (e == null) console.log('myListener()');
    else if (e.alpha == null) {
        degreesVal.innerHTML = ++eventNumber + ') alpha not available - ' + (e.absolute ? "assoluta" : "relativa");
        let j = 0;
        let increment = 10;
        rotationInterval = setInterval(function() {
            oldDeg = j;
            j += increment;
            console.log('j) ' + j + ' - oldDeg) ' + oldDeg + ' - diff: '+ degVar(oldDeg, j));
            if (j >= 360) increment = -10;
            if (j <-20) clearInterval(rotationInterval);
            bussola.style.transform = `rotate(${(j)}deg)`;
            //getNegativeDeg(j);
        }, 30);
    }
    else {
        let degOld = degCurrent;
        degCurrent = e.alpha;
        degContinuous = degCurrentCont + degVar(degOld, degCurrent);
        displayPosition(degCurrentCont);
        /*
        degreesVal.innerHTML = ++eventNumber + ') alpha: ' + Math.floor(e.alpha) + ' - ' + (e.absolute ? "assoluta" : "relativa");
        bussola.style.transform = `rotate(${e.alpha}deg)`;
        */
    }
}

function getNegativeDeg(deg) {
    console.log (deg + ' >> ' + (deg === 0 ? 0 : deg - 360));
    return deg === 0 ? 0 : deg - 360;
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


let x, y;
x = 180; y = 45;
console.log (`x old ${x} | y new ${y} | diff x y ${degVar(x,y)}`);
y = 190;
console.log (`x old ${x} | y new ${y} | diff x y ${degVar(x,y)}`);
y = 359;
console.log (`x old ${x} | y new ${y} | diff x y ${degVar(x,y)}`);
y = 360;
console.log (`x old ${x} | y new ${y} | diff x y ${degVar(x,y)}`);
y = -180;
console.log (`x old ${x} | y new ${y} | diff x y ${degVar(x,y)}`);
y = -150;
console.log (`x old ${x} | y new ${y} | diff x y ${degVar(x,y)}`);

