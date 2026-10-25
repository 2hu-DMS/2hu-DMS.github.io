// SKETCH.JS

let imgMapa;
let daractI = localStorage.getItem('daractI') === 'true';
let daractII = localStorage.getItem('daractII') === 'true';
let SUM = localStorage.getItem('SUM') === 'true';
let aula1y3 = localStorage.getItem('aula1y3') === 'true';
let aula2 = localStorage.getItem('aula2') === 'true';
let aula4 = localStorage.getItem('aula4') === 'true';
let aula5 = localStorage.getItem('aula5') === 'true';
let aula6 = localStorage.getItem('aula6') === 'true';
let aula8 = localStorage.getItem('aula8') === 'true';
let banos = localStorage.getItem('banos') === 'true';
let Aula1y3 = localStorage.getItem('Aula1y3') === 'true';
let Aula2 = localStorage.getItem('Aula2') === 'true';
let Aula4 = localStorage.getItem('Aula4') === 'true';
let Aula5y7 = localStorage.getItem('Aula5y7') === 'true';
let Aula6 = localStorage.getItem('Aula6') === 'true';
let Aula8 = localStorage.getItem('Aula8') === 'true';
let Banos = localStorage.getItem('Banos') === 'true';
let Biblioteca = localStorage.getItem('Biblioteca') === 'true';

// Paleta de colores para los bordes
const colorEdificio = ['#000000', '#004aac', '#a311c0', '#e45c27'];
let indiceColorActual = 0; // Guardaremos el indice activo aca

// 1. Limites geograficos de la imagen del mapa (Calibracion)
const MAPA_NORTE = -34.648710; 
//const MAPA_NORTE = -34.649210; 
const MAPA_SUR   = -34.653585; 
const MAPA_OESTE = -58.777695; 
const MAPA_ESTE  = -58.772530; 

let miLatitud = 0;
let miLongitud = 0;

let posGpsMapa = { x: 0, y: 0 };

let panX = 0;
let panY = 0;
let zoom = 1.0;
let anguloRotacion = 0;

let distToqueInicial = 0;
let zoomInicial = 1.0;
let anguloInicialToque = 0;
let rotacionInicial = 0;

function preload() {
  imgMapa = loadImage('img/predio.jpg');
}

function setup() {
  const contenedor = document.getElementById('map-container');
  let w = contenedor ? contenedor.clientWidth : windowWidth;
  let h = contenedor ? contenedor.clientHeight : windowHeight;

  let canvas = createCanvas(w, h);
  if (contenedor) canvas.parent('map-container');
  
  panX = width / 2;
  panY = height / 2;

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      actualizarPosicion,
      errorGPS,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  }

  let canvasElem = canvas.elt;
  canvasElem.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  canvasElem.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

function draw() {
  background(20);

  // --- MAPA Y GPS ---
  push();
  translate(panX, panY);
  rotate(anguloRotacion);
  scale(zoom);
  
  imageMode(CENTER);
  image(imgMapa, 0, 0);


  
  // ruta azul desde la salida
  if (daractI) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line(-1450, 430, -1450, 600); //linea entrada
  line(-1450, 430, -1110, 430); // linea - hasta el buffet 
  line(-1110, 430, -1110, -145); // linea ! hasta el buffet 
  line(-1110, -145, -1050, -145); // linea - hasta afuera
  line(-1050, -145, -1050, -700); // linea ! hasta afuera
  line(-1050, -700, -530, -830); // linea / hasta afuera
  line(-530, -830, -40, -760); // linea / hasta afuera
  line(-40, -760, 160, -830);
  line( 160, -830, 280, -890);
  line( 280, -890, 310, -880);
  line( 310, -880, 470, -1130); //linea hasta el daract I
  line( 470, -1130, 350, -1210); //linea hasta la entrada del daract I

  if (Aula1y3) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 230, -1280); //linea hasta el aula1
  }
  if (Aula2) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  if (Aula4) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  if (Aula5y7) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  if (Aula6) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  if (Aula8) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  if (Banos) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  if (Biblioteca) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line( 350, -1210, 300, -1250); //linea hasta el aula1
  }
  }

  if (daractII) {
  stroke(0, 74, 172); // Color 004aac
  strokeWeight(5 / zoom);
  line(-1450, 430, -1450, 600); //linea entrada
  line(-1450, 430, -1110, 430); // linea - hasta el buffet 
  line(-1110, 430, -1110, -145); // linea ! hasta el buffet 
  line(-1110, -145, -1050, -145); // linea - hasta afuera
  line(-1050, -145, -1050, -700); // linea ! hasta afuera
  line(-1050, -700, -530, -830); // linea / hasta afuera
  line(-530, -830, -40, -760); // linea / hasta afuera
  line(-40, -760, 160, -830);
  line( 160, -830, 280, -890);
  line( 280, -890, 420, -820);
  line( 420, -820, 570, -1050); //linea hasta el daract II
  line( 570, -1050, 670, -1000); //linea hasta la entrada del daract II

  if (aula1y3) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 800, -900); //linea hasta el aula1
    line( 800, -900, 780, -870);
    line( 800, -900, 980, -800); //linea hasta el aula3
    line( 980, -800, 960, -770);
  }

  if (aula2) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 890, -880); //linea hasta el aula2
    line( 890, -880, 910, -905);
  }

  if (aula4) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 910, -860); //linea hasta el aula4
    line( 910, -860, 940, -895);
  }

  if (aula5) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 1015, -780); //linea hasta el aula5
    line( 1015, -780, 990, -750);
    line( 1015, -780, 1180, -660);
    line( 1180, -660, 1150, -625);
  }

  if (aula6) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 1085, -740); //linea hasta el aula6
    line( 1085, -740, 1110, -780);
  }

  if (aula8) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 1110, -730); //linea hasta el aula8
    line( 1110, -730, 1140, -770);
  }

  if (banos) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 750, -950); //linea hasta el baños cerca de la entrada
    line( 750, -950, 720, -910);
    line( 750, -950, 1245, -630); //linea hasta el baños cerca de sum
    line( 1245, -630, 1260, -650);
  }

  if (SUM) {
    stroke(0, 74, 172); // Color 004aac
    strokeWeight(5 / zoom);
    line( 670, -1000, 1280, -600); //linea hasta el SUM

  }
  }


  // Posicionar el círculo relativo al centro del SVG

  let circuloX = posGpsMapa.x - imgMapa.width / 2;
  let circuloY = posGpsMapa.y - imgMapa.height / 2;

  // Halo exterior GPS
  noStroke();
  fill(80, 112, 254, 100);
  circle(circuloX, circuloY, 60 / zoom);

  // Circulo central GPS
  stroke('#ffffff');
  strokeWeight(3 / zoom);
  fill('#5070fe');
  circle(circuloX, circuloY, 24 / zoom);

  pop();

  // --- EVALUACIÓN DE ZONAS / EDIFICIOS ---
  // HISTORICO ALA ESTE
  if (miLatitud <= -34.650754 && miLatitud >= -34.651862 &&
      miLongitud >= -58.776526 && miLongitud <= -58.774492) {
    indiceColorActual = 1;
  }
  // DARACT 1
  else if (miLatitud <= -34.650131 && miLatitud >= -34.650785 &&
           miLongitud >= -58.775172 && miLongitud <= -58.774890) {
    indiceColorActual = 2;
  }
  // DARACT 2
  else if (miLatitud <= -34.650727 && miLatitud >= -34.651311 &&
           miLongitud >= -58.774560 && miLongitud <= -58.774328) {
    indiceColorActual = 3;
  } 
  else {
    indiceColorActual = 0; // Fuera de zonas conocidas
  }

  // --- BORDE MARCADOR DE PANTALLA ---
  stroke(colorEdificio[indiceColorActual]);
  strokeWeight(10);
  noFill(); // Evita que cubra el lienzo con color solido
  rect(0, 0, width, height);

  // --- INTERFAZ ---
  dibujarInterfaz();
}

function actualizarPosicion(position) {
  miLatitud = position.coords.latitude;
  miLongitud = position.coords.longitude;

  if (imgMapa.width > 0 && imgMapa.height > 0) {
    posGpsMapa.x = map(miLongitud, MAPA_OESTE, MAPA_ESTE, 0, imgMapa.width, true);
    posGpsMapa.y = map(miLatitud, MAPA_NORTE, MAPA_SUR, 0, imgMapa.height, true);
  }
}

function touchMoved() {
  if (touches.length === 1) {
    panX += movedX;
    panY += movedY;
  } else if (touches.length === 2) {
    let distActual = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    if (distToqueInicial > 0) {
      let factor = distActual / distToqueInicial;
      zoom = constrain(zoomInicial * factor, 0.2, 5.0);
    }

    let anguloActual = atan2(touches[1].y - touches[0].y, touches[1].x - touches[0].x);
    anguloRotacion = rotacionInicial + (anguloActual - anguloInicialToque);
  }
  return false;
}

function touchStarted() {
  if (touches.length === 2) {
    distToqueInicial = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    zoomInicial = zoom;
    anguloInicialToque = atan2(touches[1].y - touches[0].y, touches[1].x - touches[0].x);
    rotacionInicial = anguloRotacion;
  }
}

function mouseWheel(event) {
  let factorZoom = event.delta > 0 ? 0.9 : 1.1;
  zoom = constrain(zoom * factorZoom, 0.2, 5.0);
  return false;
}

function dibujarInterfaz() {
  noStroke();
  fill(0, 200);
  rect(10, 10, 240, 90, 8);

  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  text(`Latitud: ${miLatitud.toFixed(6)}`, 20, 20);
  text(`Longitud: ${miLongitud.toFixed(6)}`, 20, 38);
  text(`Zoom: ${zoom.toFixed(2)}x`, 20, 56);
  text(`Rotación: ${degrees(anguloRotacion).toFixed(1)}°`, 20, 74);
}

function errorGPS(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function windowResized() {
  const contenedor = document.getElementById('map-container');
  if (contenedor) {
    resizeCanvas(contenedor.clientWidth, contenedor.clientHeight);
  }
}