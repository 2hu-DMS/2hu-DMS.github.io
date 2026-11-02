// SKETCH.JS

let imgMapa;
let banios;
let accesible;
let ascensor;
let ubicacion_objetivo = new URLSearchParams(window.location.search).get('ubicacion_objetivo');

// Paleta de colores para los bordes
const colorEdificio = ['#000000', '#004aac', '#a311c0', '#e45c27'];
let indiceColorActual = 0; 

// 1. Límites geográficos de la imagen del mapa (Calibración)
//const MAPA_NORTE = -34.648710; 
const MAPA_NORTE = -34.649300; 
const MAPA_SUR   = -34.653585; 
//const MAPA_OESTE = -58.777695; 
const MAPA_OESTE = -58.777400; 
const MAPA_ESTE  = -58.772530; 

// Definición de zonas/edificios con sus coordenadas extremas
const ZONAS = [
  {
    nombre: "HISTORICO ALA ESTE",
    latNorte: -34.650754, latSur: -34.651862,
    lonOeste: -58.776526, lonEste: -58.774492,
    colorRelleno: 'rgba(0, 74, 172, 0.35)',
    colorBorde: '#004aac',
    indiceColor: 1
  },
  {
    nombre: "DARACT 1",
    latNorte: -34.650131, latSur: -34.650785,
    lonOeste: -58.775172, lonEste: -58.774890,
    colorRelleno: 'rgba(163, 17, 192, 0.35)',
    colorBorde: '#a311c0',
    indiceColor: 2
  },
  {
    nombre: "DARACT 2",
    latNorte: -34.650727, latSur: -34.651311,
    lonOeste: -58.774560, lonEste: -58.774328,
    colorRelleno: 'rgba(228, 92, 39, 0.35)',
    colorBorde: '#e45c27',
    indiceColor: 3
  }
];

let miLatitud = 0;
let miLongitud = 0;

let posGpsMapa = { x: 0, y: 0 };

const RUTAS = {
  daract1: [
    { x: 5004, y: 3202 },
    { x: 5004, y: 3319 },
    { x: 3533, y: 3317 },
    { x: 3523, y: 2737 },
    { x: 3603, y: 2742 },
    { x: 3638, y: 2177 },
    { x: 4103, y: 2067 },
    { x: 4608, y: 2137 },
    { x: 4953, y: 2002 },
    { x: 5117, y: 1765 },
    { x: 5003, y: 1682 }
  ],
  
  daract2: [
    { x: 5004, y: 3202 },
    { x: 5004, y: 3319 },
    { x: 3533, y: 3317 },
    { x: 3523, y: 2737 },
    { x: 3603, y: 2742 },
    { x: 3638, y: 2177 },
    { x: 4103, y: 2067 },
    { x: 4608, y: 2137 },
    { x: 4953, y: 2002 },
    { x: 5059, y: 2063 },
    { x: 5221, y: 1834 },
    { x: 5325, y: 1902 },
    ]

//Salidas de emergencia y punto de encuentro Salida1:
[ 
{ x: 4256, y: 3315 }, 
{ x: 3879, y: 3315 }, 
{ x: 3879, y: 3243 }, 
{ x: 3809, y: 3243 }, 
{ x: 3809, y: 3150 }, 
{ x: 3597, y: 3150 }, 
{ x: 3597, y: 2199 }, 
{ x: 3866, y: 2126 }, 
{ x: 3866, y: 1608 }, 
] 
Salida2: [ 
{ x: 5006, y: 3315 }, 
{ x: 4631, y: 3315 }, 
{ x: 4631, y: 3264 }, 
{ x: 4560, y: 3264 }, 
{ x: 4560, y: 2900 }, 
{ x: 5432, y: 2900 }, 
{ x: 5432, y: 2862 }, 
{ x: 5481, y: 2862 }, 
{ x: 5481, y: 2610 }, 
{ x: 5514, y: 2610 }, 
]
Salida3: [ 
{ x: 5738, y: 3315 }, 
{ x: 5432, y: 3315 },
{ x: 5432, y: 2864 }, 
{ x: 5481, y: 2862 }, 
{ x: 5481, y: 2610 }, 
{ x: 5514, y: 2610 }, 
] 
//desde el daract 1 salon-H003: 
[ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4676, y: 3315 }, 
{ x: 4676, y: 3354 }, 
] 
salon-H002: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 },
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4567, y: 3315 }, 
{ x: 4568, y: 3349 }, 
] 
salon-H001: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4628, y: 3315 }, 
{ x: 4628, y: 3211 }, 
] 
salon-H004: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 },
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4628, y: 3219 }, 
{ x: 4628, y: 3278 }, 
{ x: 4491, y: 3278 }, 
] 
salon-G004: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4362, y: 3315 }, 
{ x: 4362, y: 3286 }, 
] 
salon-G003: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 },
{ x: 4608, y: 2137 },
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4300, y: 3315 }, 
{ x: 4300, y: 3354 }, 
] 
salon-G002: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4190, y: 3315 }, 
{ x: 4190, y: 3352 }, 
] 
salon-G001: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4258, y: 3315 }, 
{ x: 4258, y: 3210 }, 
] 
salon-F004: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4258, y: 3219 }, 
{ x: 4258, y: 3280 }, 
{ x: 4121, y: 3280 }, 
] 
salon-F003: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4990, y: 3315 }, 
{ x: 4990, y: 3290 }, ] 
salon-F002: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 3919, y: 3315 },
{ x: 3919, y: 3351 }, 
] 
salon-F001: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 3880, y: 3315 }, 
{ x: 3880, y: 3205 }, 
] 
//desde el daract 2 salon-H003: 
[ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4676, y: 3315 }, 
{ x: 4676, y: 3354 }, 
] 
salon-H002: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 },
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4567, y: 3315 }, 
{ x: 4568, y: 3349 }, 
] 
salon-H001: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4628, y: 3315 }, 
{ x: 4628, y: 3211 }, 
] 
salon-H004: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 },
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4628, y: 3219 }, 
{ x: 4628, y: 3278 }, 
{ x: 4491, y: 3278 }, 
] 
salon-G004: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4362, y: 3315 }, 
{ x: 4362, y: 3286 }, 
] 
salon-G003: [
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4300, y: 3315 }, 
{ x: 4300, y: 3354 }, 
] 
salon-G002: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4190, y: 3315 }, 
{ x: 4190, y: 3352 }, 
]
salon-G001: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4258, y: 3315 }, 
{ x: 4258, y: 3210 }, 
] 
salon-F004: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4258, y: 3219 }, 
{ x: 4258, y: 3280 },
{ x: 4121, y: 3280 }, 
] 
salon-F003: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 4990, y: 3315 }, 
{ x: 4990, y: 3290 }, 
] 
salon-F002: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 },
{ x: 3919, y: 3315 }, 
{ x: 3919, y: 3351 }, 
] 
salon-F001: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 },
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 }, 
{ x: 4103, y: 2067 }, 
{ x: 3638, y: 2177 }, 
{ x: 3603, y: 2742 }, 
{ x: 3523, y: 2737 }, 
{ x: 3533, y: 3317 }, 
{ x: 3880, y: 3315 }, 
{ x: 3880, y: 3205 }, 
]

};

let panX = 0;
let panY = 0;
let zoom = 1.0;
let anguloRotacion = 0;

// TEMPORAL: captura las coordenadas del ultimo clic en el espacio de la imagen.
let puntoClickMapa = null;

let distToqueInicial = 0;
let zoomInicial = 1.0;
let anguloInicialToque = 0;
let rotacionInicial = 0;

function preload() {
  imgMapa = loadImage('img/predio.jpg');
  banios = loadImage('img/servicios/banios.png');
  accesible = loadImage('img/servicios/accesible.png');
  ascensor = loadImage('img/servicios/ascensor.png');
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

  // --- MAPA, RECTÁNGULOS Y GPS ---
  push();
  translate(panX, panY);
  scale(zoom);
  rotate(anguloRotacion);

  
  imageMode(CENTER);
  image(imgMapa, 0, 0);

  // 1. DIBUJAR RECTÁNGULOS DE EDIFICIOS BASADOS EN COORDENADAS
  /*if (imgMapa.width > 0 && imgMapa.height > 0) {
    for (let zona of ZONAS) {
      dibujarRectanguloGeo(
        zona.latNorte, 
        zona.latSur, 
        zona.lonOeste, 
        zona.lonEste, 
        zona.colorRelleno, 
        zona.colorBorde
      );
    }
  }*/

  if (ubicacion_objetivo === 'daract1') {
    const ruta = RUTAS.daract1;
    noFill();
    stroke('#014BAC');
    strokeWeight(6 / zoom);
    beginShape();
    for (const punto of ruta) {
      vertex(punto.x - imgMapa.width / 2, punto.y - imgMapa.height / 2);
    }
    endShape();
  }

  // 2. DIBUJAR MARCADOR DE GPS
  let circuloX = posGpsMapa.x - imgMapa.width / 2;
  let circuloY = posGpsMapa.y - imgMapa.height / 2;

  // Halo exterior GPS
  noStroke();
  fill(80, 112, 254, 100);
  circle(circuloX, circuloY, 60 / zoom);

  // Círculo central GPS
  stroke('#ffffff');
  strokeWeight(3 / zoom);
  fill('#5070fe');
  circle(circuloX, circuloY, 24 / zoom);

  //000000000000000000000000000000000000000000000000000000000 CARTELES
  
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont('inter');
  textSize(30);
  noStroke();

  //DARACT 2
  image(banios, 700, -880, 50, 50);
  image(ascensor, 765, -1045, 50, 50);

  fill('#004aac');
  rect(840, -790, 130, 60, 7);
  fill(255);
  text(`Aula 1/3`, 840, -790);

  fill('#004aac');
  rect(1040, -660, 110, 60, 7);
  fill(255);
  text(`Aula 5`, 1040, -660);

  fill('#004aac');
  rect(900, -970, 110, 60, 7);
  fill(255);
  text(`Aula 2`, 900, -970);

  fill('#004aac');
  rect(1000, -900, 110, 60, 7);
  fill(255);
  text(`Aula 4`, 1000, -900);

  fill('#004aac');
  rect(1090, -830, 110, 60, 7);
  fill(255);
  text(`Aula 6`, 1090, -830);

  fill('#004aac');
  rect(1190, -760, 110, 60, 7);
  fill(255);
  text(`Aula 8`, 1190, -760);

  image(banios, 1300, -700, 50, 50);
  image(accesible, 1235, -700, 30, 30);

  fill('#004aac');
  rect(1370, -510, 90, 60, 7);
  fill(255);
  text(`SUM`, 1370, -510);

  //DARACT 1

  pop();

  // --- EVALUACIÓN DE ZONAS / EDIFICIOS ---
  indiceColorActual = 0; // Por defecto fuera de zonas
  for (let zona of ZONAS) {
    if (miLatitud <= zona.latNorte && miLatitud >= zona.latSur &&
        miLongitud >= zona.lonOeste && miLongitud <= zona.lonEste) {
      indiceColorActual = zona.indiceColor;
      break;
    }
  }

  // --- BORDE MARCADOR DE PANTALLA ---
  stroke(colorEdificio[indiceColorActual]);
  strokeWeight(10);
  noFill();
  rect(0, 0, width, height);

  // --- INTERFAZ ---
  dibujarInterfaz();
  dibujarPuntoClick();
}

/**
 * Función para proyectar y dibujar un rectángulo basado en coordenadas GPS
 */
/*
function dibujarRectanguloGeo(latNorte, latSur, lonOeste, lonEste, colorRelleno, colorBorde) {
  // Convertir esquinas geograficas a pixeles de la imagen
  let xMin = map(lonOeste, MAPA_OESTE, MAPA_ESTE, 0, imgMapa.width, true);
  let xMax = map(lonEste, MAPA_OESTE, MAPA_ESTE, 0, imgMapa.width, true);
  let yMin = map(latNorte, MAPA_NORTE, MAPA_SUR, 0, imgMapa.height, true);
  let yMax = map(latSur, MAPA_NORTE, MAPA_SUR, 0, imgMapa.height, true);

  // Trasladar origen al centro del mapa (ya que la imagen se dibuja con imageMode(CENTER))
  let rectX = xMin - imgMapa.width / 2;
  let rectY = yMin - imgMapa.height / 2;
  let rectW = xMax - xMin;
  let rectH = yMax - yMin;

  // Dibujar rectángulo
  fill(colorRelleno);
  stroke(colorBorde);
  strokeWeight(2 / zoom); // Mantiene el grosor del borde legible independiente del zoom
  rect(rectX, rectY, rectW, rectH);
}*/

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

// TEMPORAL: quitar esta funcion y la variable puntoClickMapa cuando ya no se necesiten.
function mousePressed() {
  const dx = mouseX - panX;
  const dy = mouseY - panY;
  const cosRotacion = cos(anguloRotacion);
  const sinRotacion = sin(anguloRotacion);

  puntoClickMapa = {
    x: (cosRotacion * dx + sinRotacion * dy) / zoom + imgMapa.width / 2,
    y: (-sinRotacion * dx + cosRotacion * dy) / zoom + imgMapa.height / 2
  };
}

function mouseDragged() {
  panX += movedX;
  panY += movedY;
  return false;
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

// TEMPORAL: muestra las coordenadas del ultimo clic, separadas del panel GPS.
function dibujarPuntoClick() {
  if (!puntoClickMapa) return;

  const ancho = 230;
  const alto = 58;
  const margenDerecho = 10;
  const margenInferior = 80;
  const x = width - ancho - margenDerecho;
  const y = height - alto - margenInferior;

  noStroke();
  fill('#004aac');
  rect(x, y, ancho, alto, 8);

  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  text('PUNTO CLICKEADO (px)', x + 12, y + 9);
  text(
    `X: ${puntoClickMapa.x.toFixed(1)}   Y: ${puntoClickMapa.y.toFixed(1)}`,
    x + 12,
    y + 32
  );
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