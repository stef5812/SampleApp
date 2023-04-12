  
//Map initialisating

const locIcon = L.divIcon({
    html: '<i class="fa fa-search fa-2x" aria-hidden="true"></i>',
    iconSize: [20, 20],
    className: 'myDivIcon'
  });
  
var map = L.map('map').setView([$('#inpLat').val(), $('#inpLng').val()], 13);
map.options.minZoom = 1;
map.options.maxZoom = 14;

var southWest = L.latLng(-89.98155760646617, -180),
northEast = L.latLng(89.99346179538875, 180);
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

async function mapEffect({ leafletelement:map} = {}) {
    if (!map ) return;

    let response;

    try {
        response = await axios.get('https://corona.lmao.ninja/v2/countries');
    } catch(e) {
        console.log('E', e);
        return;
    }
    console.log('response', response);
}


// add osiris
        // Configuration values:
    var api_key= "valenciaconference"  // The identifier used to create the map in OSIRS
    var authorization= "ZGVmYXVsdHVzZXI6bXlwYXNzd29yZA=="  // The base64 enconding of "defaultuser:mypassword"
    var place = [39.496043264768105, -0.40192766277868941]  // The center of the map. Usually a point within your building. 
        
        //Globals        
    var levels = [] // Array of LayerGroups, one layer group for each building level
        
        // Leaflet map creation
        //var mymap = L.map('map').setView(place, 17);  
        
    var osiris = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: 22,
	    maxNativeZoom: 18,
	    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
        
        // First we need to create the levels
//        queryMap(api_key,authorization,"MAP","{properties.indoor:'level' }",createLevels);
        
        // Now it's time to query all the rooms, corridors, elevators...
//        queryMap(api_key, authorization,"MAP","{ $and: [ {properties.indoor:{$exists: true}} , {properties.indoor: {$ne: 'level'}}] }",drawIndoor);
        
        // Let's add the POIs
//        queryMap(api_key, authorization,"FEATURES","{}",drawPOIs);




//for selection of layers, goto https://leaflet-extras.github.io/leaflet-providers/preview/
//Street map layers
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var OPNVKarte = L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// or https://gis.stackexchange.com/questions/225098/using-google-maps-static-tiles-with-leaflet
// for google map layers

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//Hybrid,
var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//satellite,
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//Terrain
var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

googleStreets.addTo(map); 
//borderdata.addTo(map)

//Add a marker
//L.marker([51.743798443277846, -9.913991467392336]).addTo(map)
var myIcon = L.icon({
    iconUrl: 'libs/images/favicon.png',
    iconSize: [25, 25],
  //    iconAnchor: [22, 94],
  //    popupAnchor: [-3, -76],
  //    shadowUrl: 'my-icon-shadow.png',
  //    shadowSize: [68, 95],
  //    shadowAnchor: [22, 94]
  });

  var OPIcon = L.icon({
    iconUrl: 'libs/icons/OPicon.png',
    iconSize: [25, 25],
  //    iconAnchor: [22, 94],
  //    popupAnchor: [-3, -76],
  //    shadowUrl: 'my-icon-shadow.png',
  //    shadowSize: [68, 95],
  //    shadowAnchor: [22, 94]
  });

  var VOLIcon = L.icon({
    iconUrl: 'libs/icons/VOLicon.png',
    iconSize: [25, 25],
  //    iconAnchor: [22, 94],
  //    popupAnchor: [-3, -76],
  //    shadowUrl: 'my-icon-shadow.png',
  //    shadowSize: [68, 95],
  //    shadowAnchor: [22, 94]
  });
  
var homeMarker = L.marker([51.743798443277846, -9.913991467392336], {icon: myIcon}).addTo(map)
var markerPopup = homeMarker.bindPopup('Home, Cleandra bay ' + homeMarker.getLatLng()).openPopup()
markerPopup.addTo(map)

map.on('popupopen', function(e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px),{animate: true}); // pan to new center
});
 
console.log(homeMarker.toGeoJSON())



//layer controller
var OpTBMMarkers = L.featureGroup();  //To be Matched
var OpAMarkers = L.featureGroup();    //Already matched - Active Match
var OpTBRMMarkers = L.featureGroup(); //To be RE-Matched
var VolLMarkers = L.featureGroup();   //Awaiting final stage
var VolAMarkers = L.featureGroup();   //Active
var VolTBMMarkers = L.featureGroup(); //To be matched

var HOSPAMarkers = L.featureGroup();    //Already matched - Active Match
var PHARMAMarkers = L.featureGroup(); 
var DENTMarkers = L.featureGroup();
var HEALTHMarkers = L.featureGroup();
var NURSEMarkers = L.featureGroup();
var MOWMarkers = L.featureGroup();

var baseLayer = {
    "osm": osm,
    "googleStreets": googleStreets
};

var myMapLayers1 = {

};

var overlay1 = {
    "homeMarker": homeMarker,
    "OP To be matched": OpTBMMarkers,
    "OP To be re-matched": OpTBRMMarkers,
    "OP's with Active Matches": OpAMarkers,
    "Vol To be matched": VolTBMMarkers,
    "Vol FInished Training": VolLMarkers,
    "Vol with Active Matches": VolAMarkers,    
};

var overlay2 = {
    "Hospitals": HOSPAMarkers,
    "Pharmacies": PHARMAMarkers,
    "Dentists": DENTMarkers,
    "Health Centres": HEALTHMarkers,
    "Nursing Homes": NURSEMarkers,
    "Meals on Wheels": MOWMarkers,
};

var myMapLayers = {
    "osiris": osiris,
    "Open Street Map": osm,
    "OPNVKarte": OPNVKarte,
    "Open Topographical": OpenTopoMap,
    "Google streets": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain
};

var overlay = {

};


//L.control.layers(overlay, {collapsed : true}).addTo(map);



map.on('locationfound', onLocationFound);

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

        $('#inpLat').val(e.latlng.lat);
        console.log("elon is : " + e.latlng.lat);
        
        $('#inpLng').val(e.latlng.lng);
        console.log("elat is : " + e.latlng.lng)

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);
  

map.locate({setView: true, maxZoom: 16});

L.control.layers(myMapLayers, overlay, {collapsed : true}).addTo(map);
L.control.layers(myMapLayers1, overlay1, {collapsed : true}).addTo(map);
L.control.layers(myMapLayers1, overlay2, {collapsed : true}).addTo(map);

function setSelectZoom(zLat, zLng) {
    map.setView([zLat, zLng], zoom);
}

//Adding markers to toolbox...

var greenIcon = L.icon({
    iconUrl: 'libs/icons/leaf-green.png',
    shadowUrl: 'libs/icons/leaf-shadow.png',
  
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  var redIcon = L.icon({
    iconUrl: 'libs/icons/leaf-red.png',
    shadowUrl: 'libs/icons/leaf-shadow.png',
  
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  var yellowIcon = L.icon({
    iconUrl: 'libs/icons/leaf-yellow.png',
    shadowUrl: 'libs/icons/leaf-shadow.png',
  
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  }); 

  //add marker to map               

//var helloPopup = L.popup().setContent('Hello World!');
 
L.easyButton('fa-globe', function(btn, map){
    const fileInput = document.getElementById('csv')
    const readFile = () => {
      const reader = new FileReader()
      reader.onload = () => {
        document.getElementById('out').innerHTML = reader.result
      }
      // start reading the file. When it is done, calls the onload event defined above.
      reader.readAsBinaryString(fileInput.files[0])
    }
    
    fileInput.addEventListener('change', readFile)
}).addTo(map);


var mylegend = L.control({ position: "bottomleft" });

mylegend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.style.backgroundColor = "white";
  div.style.border = "1px solid black";
  div.style.borderRadius = "5px";
  div.innerHTML += '<i style="background: #477AC2"></i><span><img src=\'libs/icons/OPicon.png\' width=\'25px\' > Ops </span><br>';
  div.innerHTML += '<i style="background: #448D40"></i><span><img src=\'libs/icons/VOLicon.png\' width=\'25px\' > Vols</span><br>';
  div.innerHTML += '<i style="background: #E6E696"></i><span><img src=\'libs/icons/hospital.png\' width=\'25px\' > Hospitals</span><br>';
  div.innerHTML += '<i style="background: #E6E696"></i><span><img src=\'libs/icons/pharm.jpg\' width=\'25px\' > Pharmacy</span><br>';
  div.innerHTML += '<i style="background: #E8E6E0"></i><span><img src=\'libs/icons/dentist.png\' width=\'25px\' > Dentists</span><br>';
  div.innerHTML += '<i style="background: #FFFFFF"></i><span><img src=\'libs/icons/nursing.png\' width=\'25px\' > Care homes</span><br>';
  div.innerHTML += '<i style="background: #FFFFFF"></i><span><img src=\'libs/icons/MOW.png\' width=\'25px\' > Meals on wheels</span><br>';
  
  
  

  return div;
};

mylegend.addTo(map);