

var Ciudad;
var Pais;
var Provincia;
var fotos;
var Carrusel = null;
var tiempo;
var coordenadasGanadoras = "";
var nombreGanador;
var contador = 1;
var estadoJuego = 0;
var TipoJuego;
var TipoDificultad;
var map;  
var markers = []
var marker;
var marker1;


  $(document).ready(function () { 
   map = L.map('map').setView([20, -2], 2);
   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href= "http://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map); 
  PantallaInicio()
  var trigger = $('.hamburger'), overlay = $('.overlay'), isClosed = false;
  trigger.click(function () { hamburger_cross(); });
  function hamburger_cross() {
      if (isClosed == true) {          
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {   
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }
  
  
  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');   });  

   var popup = L.popup();   
   map.on('click', function(e) {
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);      
        var respuesta = window.confirm("¿Quieres Confirmar esta posicion?") 
        markers.push(marker);
        if(respuesta)
        {              
          var marker1 = L.marker([coordenadasGanadoras[0], coordenadasGanadoras[1]]).addTo(map);
          markers.push(marker1);
          var pointList = [coordenadasGanadoras, e.latlng];
          var firstpolyline = new L.Polyline(pointList ,{
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1   
            });    
     map.addLayer(firstpolyline);
     markers.push(firstpolyline);
     var distancia = e.latlng.distanceTo(coordenadasGanadoras);
     var puntuacionTotal = (distancia * contador)/1000;
     var intvalue = parseInt(puntuacionTotal);
     var Hora = new Date()
     alert("Final del Juego!!!\nHas Conseguido: " + intvalue + " puntos \nLa ciudad Correcta era: " + nombreGanador);
     
     estadoJuego++;
     $("#history").append('<a href = "javascript:jugarotravez('+ estadoJuego +')">' +  Hora.toString() + " - " + TipoJuego + ' - '  + TipoDificultad + " : "   + intvalue +'</a><br>');
     var datos = {nombre:TipoJuego,fecha: Hora.toString()};
     history.pushState(datos,'','?'+ estadoJuego );
     cleanMap();
     PantallaInicio();       
        }
        else{
          map.removeLayer(marker);
        }
    });
     });  

  $("#CiudadesFacil").click(function(){
        Ciudades("Facil");
  });
  $("#CiudadesIntermedio").click(function(){
        Ciudades("Intermedio");
 });   
  
  $("#CiudadesDificil").click(function(){
        Ciudades("Dificil");
  });
    $("#PaisesFacil").click(function(){
        Paises("Facil");
  });
  $("#PaisesIntermedio").click(function(){
        Paises("Intermedio");
 });   
  $("#PaisesDificil").click(function(){
        Paises("Dificil");
  });
  $("#ProvinciasFacil").click(function(){
        Provincias("Facil");
  });
  $("#ProvinciasIntermedio").click(function(){
        Provincias("Intermedio");
 });   
  $("#ProvinciasDificil").click(function(){
        Provincias("Dificil");
  });  
    $("#PararJuego").click(function(){
        cleanMap();
        PantallaInicio();
  });  
 function    pantallaJuego(){
  Carrusel = null;
  $("#PantallaInicio").hide();
  $("#TextoInicio").hide(); 
  $('#wrapper').toggleClass('toggled');
  $("#contenedor").show(); 
  contador = 1;
  
  
} 
function    PantallaInicio(){
  $("#PantallaInicio").show();
  $("#TextoInicio").show(); 
  $('#wrapper').toggleClass('toggled');
 $("#contenedor").hide(1000); 
  
} 
    
    
function Ciudades(dificultad) {
  pantallaJuego();
  $.getJSON("juegos/Ciudades.json", function(data) { 
      Ciudad = data}).done(function(){
      TipoJuego = "Ciudades";
      TipoDificultad = dificultad;
      Elegimos(Ciudad,dificultad);
      });
  }

function Paises(dificultad) {
    pantallaJuego();
    $.getJSON("juegos/Paises.json", function(data) { 
      Pais = data}).done(function(){
      TipoJuego = "Paises";
      TipoDificultad = dificultad;
      Elegimos(Pais,dificultad);});
  }
function Provincias(dificultad) {
    pantallaJuego();
    $.getJSON("juegos/Provincias.json", function(data) { 
      Provincia = data}).done(function(){
      TipoJuego = "Provincias";
      TipoDificultad = dificultad;
      Elegimos(Provincia,dificultad);
      });
  }
  
function Elegimos(Json, nivel){
 
  var posicion = Math.floor(Math.random() * Json.features.length);
  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  coordenadasGanadoras = Json.features[posicion].geometry.coordinates;
  nombreGanador =  Json.features[posicion].properties.name;
  if(nivel == "Facil"){
    tiempo = 5000;
  }
  else if(nivel == "Intermedio"){
    tiempo = 3500;
  }
  else if(nivel == "Dificil"){
    tiempo = 2000;
  }  
  $.getJSON( flickerAPI, {tags: nombreGanador, tagmode: "any",format: "json"}).done(function( data ) {
  fotos = data;
  Carrusel = setInterval("cambiofotos(fotos);", tiempo);  

  });
  
}
function jugarotravez(id){
    var NewGame = id - estadoJuego
    estadoJuego = id;
    if (NewGame == 0){
       pantallaJuego();
    }else{
        history.go(NewGame);
    }

  
  
  
}
function cleanMap() {
    $.each(markers, function(i, marker){
        map.removeLayer(marker);
    });
    markers = [];
    map.setView([0, 0], 2);
}
function changer(newValue) {
  var element = document.getElementById("imagen1");
  element.style.display = 'inline';
  element.setAttribute('src', newValue);
 
}   

function cambiofotos(fotos){
  var aleat = parseInt(Math.random() * fotos.items.length);
  changer(fotos.items[aleat].media.m);
  contador++;
} 
     