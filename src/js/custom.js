//---- Función Init ----
function init(){
    initMap();
    createOptions();
    createVehiculos();
}
//---- Validación de los botones -----
$(".submit").click(validToo);
$(".enviar").click(maxPasajeros);
//---- Función del Mapa ----
function initMap() {
 var directionsService = new google.maps.DirectionsService;
 var directionsDisplay = new google.maps.DirectionsRenderer;
 var map = new google.maps.Map(document.getElementById('map'), {
   zoom: 2,
   center: {lat: -33.4488897,
   lng: -70.6692655},
 });
 directionsDisplay.setMap(map);

 var onChangeHandler = function() {
   calculateAndDisplayRoute(directionsService, directionsDisplay);
 };
 document.getElementById('start').addEventListener('change', onChangeHandler);
 document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
 directionsService.route({
   origin: document.getElementById("start").value,
   destination: document.getElementById('end').value,
   travelMode: google.maps.TravelMode.DRIVING
 }, function(response, status) {
   if (status === google.maps.DirectionsStatus.OK) {
     directionsDisplay.setDirections(response);
   } 
 });
}
//---- Dibujo de opciones ----
function createOptions(){
    var ciudades = get_regiones();
    var lista = $("select");
    for(var i in ciudades){
        var html= '<option value="' + ciudades[i].distance + '">' + ciudades[i].name + '</option>'
         lista.append(html); 
    }
}
//---- Dibujo de lista de vehículos ----
function createVehiculos(){
    var lista = $(".carros");
    for(var i in vehiculos){
        var html= 
        '<li>' +
        '<input name="radio" type="radio">' +
        '<img src="' + vehiculos[i].srcImg + '" width="50px;" class="img-responsive" alt=""><p>' + vehiculos[i].name + '<br><small>Máximo <small class="maximo">' + vehiculos[i].max + '</small> Pasajeros</small></p><span class="consumo">' + vehiculos[i].consumo + '</li>'
        lista.append(html); 
    }
    $("li").click(theclick);
}
//-- Funcion para validar el botón buscar ----
function validToo(){
    var origen = $(".origen").val();
    localStorage.setItem("origen", origen);
    var destino = $(".destino").val();
    localStorage.setItem("destino", destino);
    if (origen != destino){
        $("#info").show();
        //---- Para aceptar solo números positivos ----
        $(".pasajeros").keyup(function(){
        this.value = (this.value + '').replace(/[^1-9]/g,"");
        });
    }
}
//------ Función para hacer click en las opciones ----
function theclick(){
    $(".total").remove();
    var consumo = $(this).find('.consumo').text();
    localStorage.setItem("consumo", consumo);
    var personas = $(this).find('.maximo').text();
    localStorage.setItem("personas", personas);
    var imagen = $(this).find('img').attr("src");
    localStorage.setItem("imagen", imagen);
    calculo();
    var costoGeneral = $(this).find('.costoTotal').text();
    localStorage.setItem("general", costoGeneral);
}
//---- Función para calcular el precio total ----
function calculo(){
    var origenGet = localStorage.getItem("origen");
    var destinoGet = localStorage.getItem("destino");
    var consumoGet = localStorage.getItem("consumo");
    //---- Cálculo de Precio ----
    var distancia = parseInt(origenGet) - parseInt(destinoGet);
  	var precio= distancia * parseInt(consumoGet);
    $("li").append("<span class='total'>Precio Total: <small class='costoTotal'>"+ precio + "</small></span>");
}
//---- Función para validar input (pasajeros) ----
function maxPasajeros(){
    var input = $(".pasajeros").val();
    var costoTotal = localStorage.getItem("general");
    var personasGet = localStorage.getItem("personas");
    var img = localStorage.getItem("imagen");
    if(input <= personasGet){
        var costoPersona = costoTotal / input;
        swal({
          title: "Carrocomp!",
          imageUrl: img,
          text: "Costo por persona " + costoPersona
        });
    }else{
        sweetAlert("El número de pasajeros excede del máximo.!");
    }
}