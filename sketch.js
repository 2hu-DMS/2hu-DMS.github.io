let imgMapa;

//1. Limites geograficos de la imagen del mapa (Calibracion)
//Estos son los limites del predio. Forman un rectangulo de lineas/limites invisibles
const MAPA_NORTE = -34.648710; // Latitud superior = la "y = 0" de la imagen
const MAPA_SUR   = -34.653585; // Latitud inferior = la altura maxima de la imagen
const MAPA_OESTE = -58.777695; // Longitud izquierda = el "x = 0" de la imagen
const MAPA_ESTE  = -58.772530; // Longitud derecha = el ancho maximo de la imagen

//Coordenadas de mi casa XD NO LO BORREN
/*
const MAPA_NORTE = -34.685658; 
const MAPA_SUR   = -34.685849; 
const MAPA_OESTE = -58.714808; 
const MAPA_ESTE  = -58.714650;*/

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
  
  // Crear canvas del tamanio exacto del contenedor
  let canvas = createCanvas(contenedor.clientWidth, contenedor.clientHeight);
  canvas.parent('map-container'); // Adjuntar el lienzo dentro del contenedor
  
  panX = width / 2;
  panY = height / 2;

  // Iniciar geolocalizacion
  //if ("geolocation" in navigator) {
    //navigator.geolocation.watchPosition(
      //actualizarPosicion,
      //errorGPS,
      //{ enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    //);
  //}

  // Prevenir gestos tactiles por defecto en el lienzo
  let canvasElem = canvas.elt;
  canvasElem.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  canvasElem.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

function draw() {
  background(20);

  push();
  translate(panX, panY);
  rotate(anguloRotacion);
  scale(zoom);
  
  imageMode(CENTER);
  image(imgMapa, 0, 0);

  // Posicionar el círculo relativo al centro del SVG
  let circuloX = posGpsMapa.x - imgMapa.width / 2;
  let circuloY = posGpsMapa.y - imgMapa.height / 2;

  stroke(255);
  strokeWeight(2 / zoom);
  fill(0, 255, 150);
  circle(circuloX, circuloY, 24 / zoom);

  pop();

  dibujarInterfaz();
}

function actualizarPosicion(position) {
  miLatitud = position.coords.latitude;
  miLongitud = position.coords.longitude;

  // Aseguramos que la imagen esté cargada antes de mapear
  if (imgMapa.width > 0 && imgMapa.height > 0) {
    // El 'true' al final restringe el valor dentro de los bordes del mapa
    posGpsMapa.x = map(miLongitud, MAPA_OESTE, MAPA_ESTE, 0, imgMapa.width, true);
    posGpsMapa.y = map(miLatitud, MAPA_NORTE, MAPA_SUR, 0, imgMapa.height, true);
  }
}

function touchMoved() {
  if (touches.length === 1) {
    // Arrastre fluido usando movedX / movedY
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