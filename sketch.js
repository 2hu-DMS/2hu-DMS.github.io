// SKETCH.JS

let imgMapa;
let banios;
let accesible;
let ascensor;
let globo;
const parametrosUbicacion = new URLSearchParams(window.location.search);
let ubicacion_objetivo = parametrosUbicacion.get('ubicacion_objetivo');
let ubicacion_objetivo_aulas = parametrosUbicacion.get('ubicacion_objetivo_aulas');

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

// TEMPORAL: para probar rutas sin GPS, permitir simular la zona actual con teclado.
// Borrar esta sección cuando ya no haga falta la prueba manual.
let zonaSimulada = null;

function simularZonaConTeclado() {
  if (miLatitud !== 0 || miLongitud !== 0) return;

  if (key === '1') {
    zonaSimulada = 'HISTORICO ALA ESTE';
  } else if (key === '2') {
    zonaSimulada = 'DARACT 1';
  } else if (key === '3') {
    zonaSimulada = 'DARACT 2';
  }
}

// TEMPORAL: fin de simulación de zona por teclado.

let posGpsMapa = { x: 0, y: 0 };

function obtenerZonaActual() {
  const zonaActual = ZONAS.find((zona) =>
    miLatitud <= zona.latNorte &&
    miLatitud >= zona.latSur &&
    miLongitud >= zona.lonOeste &&
    miLongitud <= zona.lonEste
  );

  return zonaActual ? zonaActual.nombre : null;
}


/// RUTAS DESDE EL HISTORICO ///
const RUTASHIS = {
  historico: [
    { x: 3533, y: 3317 },
  ],

  daract1: [
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
};

/// RUTAS DE AULAS GENERALES ///
const RUTASAULAS = {
  // desde la entrada del daract1
  d1aula1y3: [
    { x: 5003, y: 1682 },
    { x: 4870, y: 1597 },
    { x: 4689, y: 1479 },
    { x: 4665, y: 1522 },
    ],
  d1aula2: [
    { x: 5003, y: 1682 },
    { x: 4795, y: 1543 },
    { x: 4814, y: 1498 }
    ],
  d1aula4: [
    { x: 5003, y: 1682 },
    { x: 4770, y: 1515 },
    { x: 4790, y: 1480 },
    ],
  d1aula5y7: [
    { x: 5003, y: 1682 },
    { x: 4666, y: 1468 },
    { x: 4638, y: 1504 },
    ],
  d1aula6: [
    { x: 5003, y: 1682 },
    { x: 4595, y: 1408 },
    { x: 4611, y: 1373 },
    ],
  d1aula8: [
    { x: 5003, y: 1682 },
    { x: 4572, y: 1389 },
    { x: 4588, y: 1358 },
    ],
  d1biblioteca: [
    { x: 5003, y: 1682 },
    { x: 4362, y: 1287 },
    ],
  d1banos: [
    { x: 5003, y: 1682 },
    { x: 4917, y: 1643 },
    { x: 4885, y: 1686 },
    ],
  
  // desde la entrada del daract2
  d2aula1y3: [
    { x: 5325, y: 1902 },
    { x: 5450, y: 1980 },
    { x: 5415, y: 2033 },
    ],
  d2aula2: [
    { x: 5325, y: 1902 },
    { x: 5535, y: 2017 },
    { x: 5561, y: 1977 },
    ],
  d2aula4: [
    { x: 5325, y: 1902 },
    { x: 5556, y: 2034 },
    { x: 5586, y: 1993 },
    ],
  d2aula5: [
    { x: 5325, y: 1902 },
    { x: 5653, y: 2104 },
    { x: 5629, y: 2144 },
    { x: 5653, y: 2104 },
    { x: 5817, y: 2216 },
    { x: 5788, y: 2272 },
    ],
  d2aula6: [
    { x: 5325, y: 1902 },
    { x: 5728, y: 2150 },
    { x: 5757, y: 2111 },
    ],
  d2aula8: [
    { x: 5325, y: 1902 },
    { x: 5756, y: 2167 },
    { x: 5780, y: 2126 },
    ],
  d2sum: [
    { x: 5325, y: 1902 },
    { x: 5946, y: 2308 },
    ],
  d2banos: [
    { x: 5325, y: 1902 },
    { x: 5387, y: 1944 },
    { x: 5360, y: 1990 },
    ],

  //desde la entrada del historico
  salonH003: [
    { x: 3535, y: 3317 },
    { x: 4676, y: 3315 },
    { x: 4676, y: 3354 },
    ],
  salonH002: [
    { x: 3535, y: 3317 },
    { x: 4567, y: 3315 },
    { x: 4568, y: 3349 },
    ],
  salonH001: [
    { x: 3535, y: 3317 },
    { x: 4628, y: 3315 },
    { x: 4628, y: 3211 },
    ],
  salonH004: [
    { x: 3535, y: 3317 },
    { x: 4628, y: 3319 },
    { x: 4628, y: 3278 },
    { x: 4491, y: 3278 },
    ],
  salonG004: [
    { x: 3535, y: 3317 },
    { x: 4362, y: 3315 },
    { x: 4362, y: 3286 },
    ],
  salonG003: [
    { x: 3535, y: 3317 },
    { x: 4300, y: 3315 },
    { x: 4300, y: 3354 },
    ],
  salonG002: [
    { x: 3535, y: 3317 },
    { x: 4190, y: 3315 },
    { x: 4190, y: 3352 },
    ],
  salonG001: [
    { x: 3535, y: 3317 },
    { x: 4258, y: 3315 },
    { x: 4258, y: 3210 },
    ],
  salonF004: [
    { x: 3535, y: 3317 },
    { x: 4258, y: 3319 },
    { x: 4258, y: 3280 },
    { x: 4121, y: 3280 },
    ],
  salonF003: [
    { x: 3535, y: 3317 },
    { x: 4990, y: 3315 },
    { x: 4990, y: 3290 },
    ],
  salonF002: [
    { x: 3535, y: 3317 },
    { x: 3919, y: 3315 },
    { x: 3919, y: 3351 },
    ],
  salonF001: [
    { x: 3535, y: 3317 },
    { x: 3880, y: 3315 },
    { x: 3880, y: 3205 },
    ]
};


///ACTUALIZACION NUEVA 7-11-2026 INICIO///
/// RUTAS DESDE EL DARACT 1///
const RUTASD1 = {
  historico: [
    { x: 5003, y: 1682 },
    { x: 5117, y: 1765 },
    { x: 4953, y: 2002 },
    { x: 4608, y: 2137 },
    { x: 4103, y: 2067 },
    { x: 3638, y: 2177 },
    { x: 3603, y: 2742 },
    { x: 3523, y: 2737 },
    { x: 3533, y: 3317 }
  ],

  daract1: [
    { x: 5003, y: 1682 },
  ],
  
  daract2: [
    { x: 5003, y: 1682 },
    { x: 5325, y: 1902 },
    ]
};

/// RUTAS DESDE EL DARACT 2///
const RUTASD2 = {
  historico: [
    { x: 5325, y: 1902 },
    { x: 5221, y: 1834 },
    { x: 5059, y: 2063 },
    { x: 4953, y: 2002 },
    { x: 4608, y: 2137 },
    { x: 4103, y: 2067 },
    { x: 3638, y: 2177 },
    { x: 3603, y: 2742 },
    { x: 3523, y: 2737 },
    { x: 3533, y: 3317 }
  ],

  daract1: [
    { x: 5325, y: 1902 },
    { x: 5003, y: 1682 },
  ],
  
  daract2: [
    { x: 5325, y: 1902 },
    ]
};
///ACTUALIZACION NUEVA 7-11-2026 FIN///

//SALIDASALIDASALIDASALIDASALIDASALIDASALIDASALIDASALIDASALIDASALIDASALIDASALIDA
/*const RUTASALIDAS = {
S1: [ 
{ x: 4256, y: 3315 }, //salida desde el G hasta el punto de encuentro
{ x: 3879, y: 3315 }, 
{ x: 3879, y: 3243 },
{ x: 3597, y: 2199 }, 
{ x: 3866, y: 2126 }, 
{ x: 3866, y: 1608 }, 
],

S2: [ 
{ x: 5006, y: 3315 }, //salida desde el I hasta el puento de encuentro
{ x: 4631, y: 3315 }, 
{ x: 4631, y: 3264 }, 
{ x: 5481, y: 2862 }, 
{ x: 5481, y: 2610 }, 
{ x: 5514, y: 2610 }, 
],

S3: [ 
{ x: 5644, y: 2096 }, //salida desde el J hasta el punto de encuentro
{ x: 5432, y: 3315 },
{ x: 5432, y: 2864 }, 
{ x: 5481, y: 2862 }, 
{ x: 5481, y: 2610 }, 
{ x: 5514, y: 2610 }, 
],

S4: [ 
{ x: 4677, y: 1470 }, //salida principal desde el daractI hasta el punto de encuentro
{ x: 5117, y: 1765 },
{ x: 4953, y: 2002 }, 
{ x: 4640, y: 1797 }, 
{ x: 4245, y: 1718 }, 
{ x: 3866, y: 1608 },
],

S5: [ 
{ x: 4677, y: 1470 }, //salida desde el daractI hasta el punto de encuentro
{ x: 4392, y: 1315 },
{ x: 4243, y: 1548 },
{ x: 4640, y: 1797 }, 
{ x: 4245, y: 1718 }, 
{ x: 3866, y: 1608 }, 
],

S6: [ 
{ x: 5642, y: 2097 }, //salida principal desde el daractII hasta el punto de encuentro
{ x: 5221, y: 1834 },
{ x: 5059, y: 2063 }, 
{ x: 5870, y: 2603 }, 
{ x: 5514, y: 2741 }, 
{ x: 5514, y: 2610 }, 
],

S7: [ 
{ x: 4677, y: 1470 }, //salida desde el daractII hasta el punto de encuentro
{ x: 5905, y: 2279 },
{ x: 5746, y: 2516 }, 
{ x: 5870, y: 2603 }, 
{ x: 5514, y: 2741 }, 
{ x: 5514, y: 2610 }, 
],

//daract 1 hasta el salon
SD1-H003: [ 
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
],

SD1-H002: [ 
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
],

SD1-H001: [ 
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
], 

SD1-H004: [ 
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
],

SD1-G004: [ 
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
],

SD1-G003: [ 
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
],

SD1-G002: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 3533, y: 3317 }, 
{ x: 4190, y: 3315 }, 
{ x: 4190, y: 3352 }, 
], 

SD1-G001: [ 
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
], 

SD1-F004: [ 
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
], 

SD1-F003: [ 
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
{ x: 4990, y: 3290 }, 
],

SD1-F002: [ 
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
],

SD1-F001: [ 
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
], 

SD1-I001: [ 
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
{ x: 5003, y: 3315 }, 
{ x: 5003, y: 3201 }, 
],

SD1-J001: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 },
{ x: 4608, y: 2137 },
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 },
{ x: 3523, y: 2737 },
{ x: 3533, y: 3317 },
{ x: 5597, y: 3315 }, 
{ x: 5597, y: 3276 }, 
],

SD1-J002: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 },
{ x: 4608, y: 2137 },
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 },
{ x: 3523, y: 2737 },
{ x: 3533, y: 3317 },
{ x: 5692, y: 3315 }, 
{ x: 5692, y: 3276 }, 
],

SD1-J003: [ 
{ x: 5003, y: 1682 }, 
{ x: 5117, y: 1765 }, 
{ x: 4953, y: 2002 }, 
{ x: 4608, y: 2137 },
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 },
{ x: 3523, y: 2737 },
{ x: 3533, y: 3317 },
{ x: 5741, y: 3315 }, 
{ x: 5741, y: 3204 },
], 


//daract 2 hasta el salon
SD2-H003: [ 
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
], 

SD2-H002: [ 
{ x: 5325, y: 1902 }, 
{ x: 5221, y: 1834 }, 
{ x: 5059, y: 2063 },
{ x: 4953, y: 2002 },
{ x: 4608, y: 2137 },
{ x: 4103, y: 2067 },
{ x: 3638, y: 2177 },
{ x: 3603, y: 2742 },
{ x: 3523, y: 2737 }, 
{ x: 4567, y: 3315 }, 
{ x: 4568, y: 3349 }, 
],

SD2-H001: [ 
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
], 

SD2-H004: [ 
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
], 

SD2-G004: [ 
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
], 

SD2-G003: [
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
], 

SD2-G002: [ 
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
],

SD2-G001: [ 
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
], 

SD2-F004: [ 
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
], 

SD2-F003: [ 
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
],

SD2-F002: [ 
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
], 

SD2-F001: [ 
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
],

SD2-I001: [ 
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
{ x: 5003, y: 3315 }, 
{ x: 5003, y: 3201 }, 
],

SD2-J001: [ 
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
{ x: 5597, y: 3315 }, 
{ x: 5597, y: 3276 }, 
],

SD2-J002: [ 
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
{ x: 5692, y: 3315 }, 
{ x: 5692, y: 3276 }, 
],

SD2-J003: [ 
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
{ x: 5741, y: 3315 }, 
{ x: 5741, y: 3204 }, 
],

//salida mas cercana, salida 1 hasta el daract 2
SD2-S1-F001: [ 
{ x: 3880, y: 3205 },
{ x: 3880, y: 3238 },
{ x: 3810, y: 3238 }, 
{ x: 3810, y: 2900 }, 
{ x: 3609, y: 2900 },
{ x: 3609, y: 2182 }, 
{ x: 3638, y: 2177 },
{ x: 4103, y: 2067 }, 
{ x: 4608, y: 2137 }, 
{ x: 4953, y: 2002 },
{ x: 5059, y: 2063 },
{ x: 5221, y: 1834 }, 
{ x: 5325, y: 1902 }, 
 
SD2-S1-F002: [ 
{ x: 3919, y: 3351 },
{ x: 3919, y: 3315 },
{ x: 3880, y: 3315 },
{ x: 3880, y: 3238 },
{ x: 3810, y: 3238 }, 
{ x: 3810, y: 2900 }, 
{ x: 3609, y: 2900 },
{ x: 3609, y: 2182 }, 
{ x: 3638, y: 2177 },
{ x: 4103, y: 2067 }, 
{ x: 4608, y: 2137 }, 
{ x: 4953, y: 2002 },
{ x: 5059, y: 2063 },
{ x: 5221, y: 1834 }, 
{ x: 5325, y: 1902 },

SD2-S1-F003: [ 
{ x: 4990, y: 3290 },
{ x: 4990, y: 3315 },
{ x: 3880, y: 3315 },
{ x: 3880, y: 3238 },
{ x: 3810, y: 3238 }, 
{ x: 3810, y: 2900 }, 
{ x: 3609, y: 2900 },
{ x: 3609, y: 2182 }, 
{ x: 3638, y: 2177 },
{ x: 4103, y: 2067 }, 
{ x: 4608, y: 2137 }, 
{ x: 4953, y: 2002 },
{ x: 5059, y: 2063 },
{ x: 5221, y: 1834 }, 
{ x: 5325, y: 1902 },

SD2-S1-F004: [ 
{ x: 4121, y: 3280 },
{ x: 4258, y: 3280 },
{ x: 4258, y: 3315 },
{ x: 3880, y: 3315 },
{ x: 3880, y: 3238 },
{ x: 3810, y: 3238 }, 
{ x: 3810, y: 2900 }, 
{ x: 3609, y: 2900 },
{ x: 3609, y: 2182 }, 
{ x: 3638, y: 2177 },
{ x: 4103, y: 2067 }, 
{ x: 4608, y: 2137 }, 
{ x: 4953, y: 2002 },
{ x: 5059, y: 2063 },
{ x: 5221, y: 1834 }, 
{ x: 5325, y: 1902 },

SD2-S1-G001: [ 
{ x: 4258, y: 3210 },
{ x: 4258, y: 3315 },
{ x: 3880, y: 3315 },
{ x: 3880, y: 3238 },
{ x: 3810, y: 3238 }, 
{ x: 3810, y: 2900 }, 
{ x: 3609, y: 2900 },
{ x: 3609, y: 2182 }, 
{ x: 3638, y: 2177 },
{ x: 4103, y: 2067 }, 
{ x: 4608, y: 2137 }, 
{ x: 4953, y: 2002 },
{ x: 5059, y: 2063 },
{ x: 5221, y: 1834 }, 
{ x: 5325, y: 1902 },

SD2-S1-G002: [ 
{ x: 4190, y: 3352 },
{ x: 4190, y: 3315 },
{ x: 3880, y: 3315 },
{ x: 3880, y: 3238 },
{ x: 3810, y: 3238 }, 
{ x: 3810, y: 2900 }, 
{ x: 3609, y: 2900 },
{ x: 3609, y: 2182 }, 
{ x: 3638, y: 2177 },
{ x: 4103, y: 2067 }, 
{ x: 4608, y: 2137 }, 
{ x: 4953, y: 2002 },
{ x: 5059, y: 2063 },
{ x: 5221, y: 1834 }, 
{ x: 5325, y: 1902 },

//salida mas cercana, salida 2 hasta el daract 2
SD2-S2-G003: [ 
{ x: 4300, y: 3354 },
{ x: 4300, y: 3315 },
{ x: 4628, y: 3315 },
{ x: 4628, y: 3246 },
{ x: 4560, y: 3246 }, 
{ x: 4560, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 

SD2-S2-G004: [ 
{ x: 4362, y: 3286 },
{ x: 4362, y: 3315 },
{ x: 4628, y: 3315 },
{ x: 4628, y: 3246 },
{ x: 4560, y: 3246 }, 
{ x: 4560, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

SD2-S2-H004: [ 
{ x: 4491, y: 3278 },
{ x: 4560, y: 3278 },
{ x: 4560, y: 3246 }, 
{ x: 4560, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

SD2-S2-H001: [ 
{ x: 4628, y: 3185 },
{ x: 4628, y: 3246 },
{ x: 4560, y: 3246 }, 
{ x: 4560, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

SD2-S2-H002: [ 
{ x: 4568, y: 3349 },
{ x: 4568, y: 3315 },
{ x: 4628, y: 3315 },
{ x: 4628, y: 3246 },
{ x: 4560, y: 3246 }, 
{ x: 4560, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

//salida mas cercana, salida 3 hasta el daract 2
SD2-S3-I001: [ 
{ x: 5003, y: 3201 },
{ x: 5003, y: 3315 }, 
{ x: 5430, y: 3315 }, 
{ x: 5430, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

SD2-S3-J001: [ 
{ x: 5597, y: 3276 },
{ x: 5597, y: 3315 }, 
{ x: 5430, y: 3315 }, 
{ x: 5430, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

SD2-S3-J002: [ 
{ x: 5692, y: 3276 }, 
{ x: 5692, y: 3315 }, 
{ x: 5430, y: 3315 }, 
{ x: 5430, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

SD2-S3-J003: [ 
{ x: 5741, y: 3204 }, 
{ x: 5692, y: 3315 }, 
{ x: 5430, y: 3315 }, 
{ x: 5430, y: 2900 },
{ x: 6008, y: 2900 },
{ x: 6100, y: 2750 }, 
{ x: 5750, y: 2516 }, 
{ x: 5905, y: 2279 },
{ x: 4677, y: 1470 }, 
],

}*/

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
  globo = loadImage('img/icons/globo.png');
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


///ACTUALIZACION NUEVA 7-11-2026 INICIO///
  const zonaActual = obtenerZonaActual();

  // TEMPORAL: para pruebas sin GPS, si miLatitud/miLongitud están en 0 se usa la zona simulada por teclado.
  const zonaActiva = (miLatitud === 0 && miLongitud === 0) ? zonaSimulada : zonaActual;

  const RUTAS_POR_ZONA = {
    'HISTORICO ALA ESTE': {
      rutas: RUTASHIS,
      aulas: RUTASAULAS
    },
    'DARACT 1': {
      rutas: RUTASD1,
      aulas: RUTASAULAS
    },
    'DARACT 2': {
      rutas: RUTASD2,
      aulas: RUTASAULAS
    }
  };

  const rutasZona = RUTAS_POR_ZONA[zonaActiva] || { rutas: {}, aulas: {} };

  if (ubicacion_objetivo && rutasZona.rutas[ubicacion_objetivo]) {
    const ruta = rutasZona.rutas[ubicacion_objetivo];
    noFill();
    stroke('#014BAC');
    strokeWeight(6 / zoom);
    beginShape();
    for (const punto of ruta) {
      vertex(punto.x - imgMapa.width / 2, punto.y - imgMapa.height / 2);
    }
    endShape();
  }

  if (ubicacion_objetivo_aulas !== null && rutasZona.aulas[ubicacion_objetivo_aulas]) {
    const ruta = rutasZona.aulas[ubicacion_objetivo_aulas];
    noFill();
    stroke('#014BAC');
    strokeWeight(6 / zoom);
    beginShape();
    for (const punto of ruta) {
      vertex(punto.x - imgMapa.width / 2, punto.y - imgMapa.height / 2);
    }
    endShape();
  }

  const rutaObjetivo = ubicacion_objetivo_aulas !== null
    ? rutasZona.aulas[ubicacion_objetivo_aulas]
    : ubicacion_objetivo !== null
      ? rutasZona.rutas[ubicacion_objetivo]
      : null;
  if (rutaObjetivo && rutaObjetivo.length > 0) {
    const destino = rutaObjetivo[rutaObjetivo.length - 1];
    image(
      globo,
      destino.x - imgMapa.width / 2,
      destino.y - imgMapa.height / 2,
      66,
      132
    );
  }
  ///ACTUALIZACION NUEVA 7-11-2026 FIN///

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

// TEMPORAL: para probar la zona sin GPS y sin ubicar el teléfono, se usa el teclado.
// Presionar: 1 = HISTORICO ALA ESTE, 2 = DARACT 1, 3 = DARACT 2.
function keyPressed() {
  if (miLatitud !== 0 || miLongitud !== 0) return;

  if (key === '1') {
    zonaSimulada = 'HISTORICO ALA ESTE';
  } else if (key === '2') {
    zonaSimulada = 'DARACT 1';
  } else if (key === '3') {
    zonaSimulada = 'DARACT 2';
  }
}
// TEMPORAL: fin de prueba por teclado.

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