//Functions run on loading of html

  //Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(1000).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });	

  const locIcon = L.divIcon({
    html: '<i class="fa fa-search fa-2x" aria-hidden="true"></i>',
    iconSize: [20, 20],
    className: 'myDivIcon'
  });
  

  //gLobal variables set 
  var globCurLat = '';
  var globCurLng = '';
  var globCityLat = '';
  var globCityLng = '';
  var globName = '';
  var globCapCity = '';
  var globCurrCountryCode = '';
  var globFlag = '';
  var globCurrSymbol = '';

  var curLat = '';
  var curLng = '';
  var currency = '';
  var mycurrData = '';
  var myCountryName = '';
  var globCurrency = '';

  //Function to get users location if allowed
  async function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }else{
        console.warn("Can't geolocate!");
        //this would be a good place to fall back on geolocation by IP (AJAX necessary)
      }

  }

  function showPosition(position) {
      //check return, add to input textbox for future use
    globCurLat = position.coords.latitude;
    console.log("now my new CurLat is = " + globCurLat);
      
      //check return, add to input text for future use
    globCurLng = position.coords.longitude;
    console.log("now my new curLng is = " + globCurLng);
  }


  //On load, get current country code, fill in the select dropdown and set it to current country, set map borders for current country
  function onloadGetCountry() {

    var phpSelector = 'getCountryDetail';
    $.ajax({
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
        //set in function above, passed to php file
          mylat: globCurLat,
          mylong: globCurLng,
          //used to select which api to call
          selector: phpSelector,
      },
      success: function(result) {

          //console.log(JSON.stringify(result));
        console.log("now my final CurLat is = " + globCurLat);

        if (result.status.name == "ok") {
            //setup html page
            globCurrCountryCode = result['data']['countryCode'];
          //initialise country dropdown
          loadDropdown(result['data']['countryCode']);
          //Get users/default country data
          getCountryData(result['data']['countryCode']);
          //set_up polygon shape for countries
          getBorders(result['data']['countryCode']);
          //get Default countrys capital city data
          getCityData(result['data']['countryCode']);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          //error code
        console.log("error ");
        console.log(globCurLat, globCurLng, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    });
  };

  //Loads dropdown 
  function loadDropdown(myCountryCode) {

    var phpSelector = 'loadDropdown';
    $.ajax({
      //url: "libs/php/getLoc.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
        selector: phpSelector,
      },
      success: function(result) {
    
        //console.log(JSON.stringify(result));
    
        if (result.status.name == "ok") {
          //create Country dropdown, loop through data setecting data for dropdown options
          
          var row = "<br><div><select class='form-select' id='countriesjson' name='countriesjson'>";
    
          for(var i = 0; i<result.data.length; i++) {
            row += '<option value="';
            row += result['data'][i]['iso_a2'];
            if (myCountryCode == result['data'][i]['iso_a2']) {
              row += '" selected>';
              myCountryName = result['data'][i]['name'];
            } else {
              row += '">';
            }
            row += result['data'][i]['name'];
            row += '</option>';
            //console.log(row);
          }

          // add dropdown using leaflets legend 
          var legend = L.control({position: 'topleft'});
          legend.onAdd = function (map) {
              var div = L.DomUtil.create('div', 'info legend');
              div.innerHTML = row + '</select></div>';
              div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
              return div;
          };
          legend.addTo(map); 

          document.getElementById("countriesjson").addEventListener("change", function(){ 
            dropdownChoose(this.value); 
          });
/* 
          //create Distances dropdown to select foursquare data, setting default distance at 500m
          var amenityDist = "<div><select class='form-select' id='fourSquareDist' name='myfourSquareDist'>";  

          var distance = L.control({position: 'topleft'});
          distance.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = amenityDist + '<option value="500">Distance</option><option value="500">500 M</option><option value="1000">1 Km</option><option value="10000">10 Km</option></select>';
            div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
            return div;
          };
          distance.addTo(map);  
          
          document.getElementById("fourSquareDist").addEventListener("change", function(){ 
            getFoursquareData(" + $('#fourSquareChoose').val() + ", this.value); 
          });
          
          //create options for tourist selection dropdown to select foursquare data, setting default Option as Cafe
          var amenityDrop = "<div><select class='form-select' id='fourSquareChoose' name='myfourSquareChoose'>";  

          var amenity = L.control({position: 'topleft'});
          amenity.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = amenityDrop + '<option value="Cafe">Please choose your search</option><option value="Tourist Spot">Tourist Spot</option><option value="Cafe">Cafe</option><option value="Restaurant">Restaurant</option><option value="Hotel">Hotel</option><option value="Castle">Castle</option><option value="Church">Church</option></select>';
            div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
            return div;
          };
          amenity.addTo(map); 
          
          document.getElementById("fourSquareChoose").addEventListener("change", function(){ 
            getFoursquareData(this.value, " + $('#fourSquareDist').val() + "); 
          });     */      

          //Add buttons for user to select data required to highlight
          L.easyButton('<i class="fa fa-suitcase fa-lg" aria-hidden="true"></i>', function(btn, map){
            getTriposoData(globCapCity);
          }).addTo(map);         
        
          L.easyButton('<i class="fa fa-money fa-lg" aria-hidden="true"></i>', function(btn, map){
            getCurrencyData(globCurrency);
          }).addTo(map);

          L.easyButton('<i class="fa fa-thermometer-three-quarters fa-2x" aria-hidden="true"></i>', function(btn, map){
            getweather(globCityLat, globCityLng);
          }).addTo(map);    

          L.easyButton('<i class="fa fa-plus-square fa-2x" aria-hidden="true"></i>', function(btn, map){
            getCoronaData(globCurrCountryCode);
          }).addTo(map);   

          L.easyButton('<i class="fa fa-newspaper-o fa-lg" aria-hidden="true"></i>', function(btn, map){
            getNewsData(globCurrCountryCode)
          }).addTo(map);
          
          L.easyButton('<i class="fa fa-binoculars fa-lg" aria-hidden="true"></i>', function(btn, map){
            getHols(globCurrCountryCode)
          }).addTo(map);          

          L.easyButton('<i class="fa fa-space-shuttle fa-lg" aria-hidden="true"></i>', function(btn, map){
            getIssData();
          }).addTo(map);  
        }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log("error ");
        console.log(jqXHR, textStatus, errorThrown);
      }
    });    
  }
//End of on-load


//Setup the leaflet map
  document.addEventListener('DOMContentLoaded', () => {
    //Set the default current location
    globCurLat = 51.743798;
    globCurLng = -9.913991;
    console.log("now my default curLat is = " + globCurLat);
    
    //call goelocation for current location
    getLocation();

    //should use await, for now, wait then run onloadcountry
    setTimeout(function() { onloadGetCountry(); }, 100); 
  });



  //Map using leaflets api and tiling features
  //Get borders for chosen country and add marker on capital city with basic country details
  function getBorders(curCCode) {

    var phpSelector = 'getBorders';
    $.ajax({
        //url: "libs/php/getBorders.php",
        url: "libs/php/getCurrCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            coCode: curCCode,
            selector: phpSelector,
        },
        success: function(result) {

            getCityData(curCCode);
            getCountryData(curCCode);

            var myStyle = {
              "color": "#ff7800",
              "weight": 0.5,
              "opacity": 0.65
            };
            
            var border = L.geoJSON(result.data, {style: myStyle}).addTo(map);       
            map.fitBounds(border.getBounds());
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("error ");
            console.log(curCCode, phpSelector);
            console.log(jqXHR, textStatus, errorThrown);
        }
    }); 	
  };

  //Map initialisating
  var map = L.map('map').setView([globCurLat, globCurLng], 13);
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

//End of loading


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
  const myIcon = L.divIcon({
    html: '<i class="fa fa-building fa-2x" aria-hidden="true"></i>',
    iconSize: [20, 20],
    className: 'myDivIcon'
  });

/*   var homeMarker = L.marker([51.743798443277846, -9.913991467392336], {icon: myIcon}).addTo(map)
  var markerPopup = homeMarker.bindPopup('Home, Cleandra bay ' + homeMarker.getLatLng()).openPopup()
  markerPopup.addTo(map) */

  map.on('popupopen', function(e) {
    var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    map.panTo(map.unproject(px),{animate: true}); // pan to new center
  });

  //console.log(homeMarker.toGeoJSON())

  //layer controller
  var baseLayer = {
    "osm": osm,
    "googleStreets": googleStreets
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

  //L.control.layers(myMapLayers, overlay, {collapsed : true}).addTo(map);



  function onLocationFound(e) {
    var radius = e.accuracy;
    radius = radius.toLocaleString();

    L.marker(e.latlng, {icon: locIcon}).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup;

        globCurLat = e.latlng.lat;
        console.log("elon is : " + e.latlng.lat);
        
        globCurLng = e.latlng.lng;
        console.log("elat is : " + e.latlng.lng)

/*     L.circle(e.latlng, radius).addTo(map); */
  }

  map.on('locationfound', onLocationFound);

  function onLocationError(e) {
    alert(e.message);
  }

  map.on('locationerror', onLocationError);
  map.locate({setView: true, maxZoom: 16});

  //L.control.layers(myMapLayers, overlay, {collapsed : true}).addTo(map);

  function setSelectZoom(zLat, zLng) {
    map.setView([zLat, zLng], zoom);
  }

//End of leaflet map initialisation
//Functions setting variables for new country selected

  //When the country dropdown selection is change
  function dropdownChoose(curCCode){
    getCityData(curCCode);
    getBorders(curCCode);
    getCountryData(curCCode);
    setTimeout(function() { getCityData(curCCode); }, 100);
  }

  //Get the Api with Country Detail Data
  function getCountryData(curCCode, variant) {

    var phpSelector = 'getCountryDatav2';

    $.ajax({
      //url: "libs/php/getCountryDetail.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //variables passed to API
          coCode: curCCode,
          //used to select which api to call
          selector: phpSelector,
      },
      success: function(resultCountry) {
        // specify popup options 
        var countryOptions =
          {
            'maxWidth': '400',
            'className' : 'country-popup'
          }

          //set the variables
        console.log(JSON.stringify(curCCode));
        globFlag = resultCountry['data']['flags']['svg'];
        console.log(JSON.stringify(resultCountry['data']['currencies']['0']['symbol']));
        var curCurrencyCode = JSON.stringify(resultCountry['data']['currencies']['0']['code']);
        curCurrencyCode = curCurrencyCode.replace(/['"]+/g, '');
        var langname = JSON.stringify(resultCountry['data']['languages']['0']['name']);
        langname = langname.replace(/['"]+/g, '');
        var currSymbol = JSON.stringify(resultCountry['data']['currencies']['0']['symbol']);
        currSymbol = currSymbol.replace(/['"]+/g, '');
        globCurrSymbol = currSymbol;
        globCurrency = curCurrencyCode;
        globName = resultCountry['data']['name'];
        console.log(resultCountry['data']['name']);
        globCurrCountryCode = curCCode;
        globCapCity = resultCountry['data']['capital']; 

        console.log("The globname is : " + globName);

        getRadioData(globName);           

                
          //fill in the datablock

        mycurrData = '<table class="table table-info table-striped">';
        mycurrData += '<thead>';
        mycurrData += '<tr><td colspan="3" style="font-size: 35px;">';
        mycurrData += "<img src='" + globFlag + "' alt='country Flag' style='width:50px;height:30px;'><br>" + resultCountry['data']['name'];
        mycurrData += '</td></tr>';
        mycurrData += '<tr>';
        mycurrData += '<th scope="col">Icon</th>';
        mycurrData += '<th scope="col">Catagory</th>';
        mycurrData += '<th scope="col">Result</th>';
        mycurrData += '</tr>';
        mycurrData += '</thead>';
        mycurrData += '<tbody>';
        mycurrData += '<tr><th scope="row">Icon</th><td>Population</td><td>' + resultCountry['data']['population'].toLocaleString() + '</td></tr>';
        mycurrData += '<tr><th scope="row">Icon</th><td>Language</td><td>' + langname + '</td></tr>';
        mycurrData += '<tr><th scope="row">Icon</th><td>Capital City</td><td>' + resultCountry['data']['capital'] + '</td></tr>';
        mycurrData += '<tr><th scope="row">Icon</th><td>Region</td><td>' + resultCountry['data']['region'] + '</td></tr>';
        mycurrData += '<tr><th scope="row">Icon</th><td>Bordering</td><td>' + resultCountry['data']['borders'] + '</td></tr>';
        mycurrData += '<tr><th scope="row">Icon</th><td>Currencies</td><td>' + curCurrencyCode + '</td></tr>';
        mycurrData += '<tr><th scope="row">Icon</th><td>WIKI</td><td><a href="https://wikipedia.org/wiki/' + resultCountry['data']['capital'] + '" target="_blank">' + resultCountry['data']['capital'] + '</a></td></tr>';
        mycurrData += '</tbody></table>';

        console.log("my new city lat : " + globCityLat);
        console.log("my new city lng : " + globCityLng);

          //Add the Currency Marker
        var newMarker = L.marker([globCityLat, globCityLng], {icon: myIcon}).addTo(map);
          //var markerPopup = newMarker.bindPopup(mycurrData,countryOptions).openPopup()

          //if function comes from btn to see country data, popup
        //if (variant == '0') {
            var markerPopup = newMarker.bindPopup(mycurrData, {
              className: 'styleCountryPopup'
            });
          markerPopup.addTo(map); 

          getMajorCitiesData(curCCode);
        //}  
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("error ");
          console.log(curCCode, phpSelector);
          console.log(jqXHR, textStatus, errorThrown);
      }
    }); 	
  };

  function getCityData(curCCode) {

    var phpSelector = 'getCityData';
    $.ajax({
      //url: "libs/php/getCityData.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          coCode: curCCode,
          selector: phpSelector,
      },
      success: function(resultCity) {         

        //console.log(JSON.stringify(resultCity));
                  // correct new lat and long, get the data, and create the new marker
        globCityLat = Number([resultCity['data']['capitalInfo']['latlng'][0]]);
        globCityLng = Number([resultCity['data']['capitalInfo']['latlng'][1]]);
        globName = resultCity['data']['name']['common'];
        globCapCity = [resultCity['data']['capital']];            
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("error ");
          console.log(curCCode, phpSelector);
          console.log(jqXHR, textStatus, errorThrown);
      }
    }); 
  }

// End of Country data selection

//Get the Api with Corona Data
  function getCoronaData(countryCode) {
    
    //Setup the covid data block
    var covidIcon = L.icon({
      iconUrl: 'libs/images/covid.png',
      iconSize: [25, 25],
    });    
    var covidOptions =
    {
      'className' : 'covid-popup'
    }

    //Using the fetch command, get the Covid Data
    fetch('https://corona.lmao.ninja/v2/countries').then(res => {
      return res.json();
    }).then(data => {
      data.forEach(country => {
        if (country.countryInfo.iso2 == countryCode) {          
          console.log("lat : " + country.countryInfo.lat);
          console.log("long : " + country.countryInfo.long);
          console.log("country : " + country.country);
          console.log("cases : " + country.cases);
          console.log("todaycases : " + country.todayCases);
          console.log("deaths : " + country.deaths);

          var mycovData = '<table class="table table-dark table-striped">';
          mycovData += '<thead>';
          mycovData += '<tr><td colspan="3" style="font-size: 35px;">';
          mycovData += "<img src='./libs/images/covid.png' alt='covid' style='width:50px;height:50px;'>COVID 19";
          mycovData += '</td></tr>';
          mycovData += '<tr>';
          mycovData += '<th scope="col">Icon</th>';
          mycovData += '<th scope="col">Catagory</th>';
          mycovData += '<th scope="col">Result</th>';
          mycovData += '</tr>';
          mycovData += '</thead>';
          mycovData += '<tbody>';
          mycovData += '<tr><th scope="row">Icon</th><td>Total cases</td><td>' + country.cases.toLocaleString() + '</td></tr>';
          mycovData += '<tr><th scope="row">Icon</th><td>Total cases today</td><td>' + country.todayCases.toLocaleString() + '</td></tr>';
          mycovData += '<tr><th scope="row">Icon</th><td>Total deaths</td><td>' + country.deaths.toLocaleString() + '</td></tr>';
          mycovData += '<tr><th scope="row">Icon</th><td>Total deaths today</td><td>' + country.todayDeaths.toLocaleString() + '</td></tr>';
          mycovData += '<tr><th scope="row">Icon</th><td>Total recovered</td><td>' + country.recovered.toLocaleString() + '</td></tr>';
          mycovData += '<tr><th scope="row">Icon</th><td>Total test / mil</td><td>' + country.testsPerOneMillion.toLocaleString() + '</td></tr>';
          mycovData += '</tbody></table>';

          var newCovidMarker = L.marker([country.countryInfo.lat, country.countryInfo.long], {icon: covidIcon}).addTo(map)
          var CovidmarkerPopup = newCovidMarker.bindPopup(mycovData, covidOptions).openPopup()
          CovidmarkerPopup.addTo(map)           
            //break;
        }          
      })
    }).catch(err => {
      console.log(err);
    })	
  };
    
  function killCoronaData(){
    map.removeLayer(covidLayer)
  }

//End of corona data call

//Get the Api with currency Data
  function getCurrencyData(curCurrencyCode) {
    
    curCurrencyCode = curCurrencyCode.replace(/['"]+/g, '');
    console.log("my curr is : " + curCurrencyCode);
    var phpSelector = 'getCurrencyData';
    $.ajax({
      //url: "libs/php/getCurrencyData.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
            //variables passed to API
        coCurr: curCurrencyCode,
            //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultCurr) {

        //Setup the display icon and Div
        var currIcon = L.icon({
          iconUrl: 'libs/images/coin.png',
          iconSize: [60, 40],
        });
        var currOptions =
          {
            'className' : 'currency-popup'
          }      
    
            //Setup the data block
        var myCurrencyData = '<table class="table table-dark table-striped">';
        myCurrencyData += '<thead>';
        myCurrencyData += '<tr><td colspan="3" style="font-size: 35px;">';
        myCurrencyData += globCurrSymbol;
        myCurrencyData += ' Currency</td></tr>';
        myCurrencyData += '<tr>';
        myCurrencyData += '<th scope="col">Icon</th>';
        myCurrencyData += '<th scope="col">Catagory</th>';
        myCurrencyData += '<th scope="col">Result</th>';
        myCurrencyData += '</tr>';
        myCurrencyData += '</thead>';
        myCurrencyData += '<tbody>';
        myCurrencyData += '<tr><th scope="row"><span>&#163;</span></th><td>Pound Sterling</td><td>' + resultCurr['data']['GBP'] + '</td></tr>';
        myCurrencyData += '<tr><th scope="row"><span>&#36;</span></th><td>US Dollar</td><td>' + resultCurr['data']['USD'] + '</td></tr>';
        myCurrencyData += '<tr><th scope="row"><span>&#8364;</span></th><td>Euro</td><td>' + resultCurr['data']['EUR'] + '</td></tr>';
        myCurrencyData += '</tbody></table>';        

        //Add the Currency Marker
        var newCMarker = L.marker([globCityLat, globCityLng], {icon: currIcon}).addTo(map)
        var CmarkerPopup = newCMarker.bindPopup(myCurrencyData,currOptions).openPopup()
        CmarkerPopup.addTo(map)          
    
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(curCurrencyCode, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    }); 	
  };
//End of currency data retrieval


//Get the Api with Four square Data
  function getFoursquareData(searchItem, searchDist) {

    console.log("the search : " + $('#fourSquareChoose').val() + " the dist : " + searchDist.toString() + globCityLat + globCityLng);
    var strSearchDist = searchDist.toString();
    var phpSelector = 'getFoursquareData';
    $.ajax({
      url: "libs/php/getFoursquare.php",
      //url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //variables passed to API
        thesearchItem: $('#fourSquareChoose').val(),
        theDist: strSearchDist,
        lat: globCityLat,
        long: globCityLng,
          //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultfour) {

        //Select which item was search by to set icon to use
        switch(searchItem) {
          case 'Tourist Spot':
            var fourSqrIcon = L.icon({
              iconUrl: 'libs/images/tourist.png',
              iconSize: [25, 25],
            }); 
            var fourSqrIconx = L.icon({
              iconUrl: 'libs/images/tourist-x.jpg',
              iconSize: [25, 25],
            });                                
            break;          
          case 'Cafe':
            var fourSqrIcon = L.icon({
              iconUrl: 'libs/images/cafe.gif',
              iconSize: [25, 25],
            });  
            var fourSqrIconx = L.icon({
              iconUrl: 'libs/images/cafe-x.jpg',
              iconSize: [25, 25],
            });                            
            break;
          case 'Restaurant':
            var fourSqrIcon = L.icon({
              iconUrl: 'libs/images/restau.png',
              iconSize: [25, 25],
            });               
            var fourSqrIconx = L.icon({
              iconUrl: 'libs/images/restau-x.jpg',
              iconSize: [25, 25],
            });                
            break;              
          case 'Hotel':
            var fourSqrIcon = L.icon({
              iconUrl: 'libs/images/hotel.jpg',
              iconSize: [25, 25],
            });   
            var fourSqrIconx = L.icon({
              iconUrl: 'libs/images/hotel-x.jpg',
              iconSize: [25, 25],
            });                            
            break;          
          case 'Castle':
            var fourSqrIcon = L.icon({
              iconUrl: 'libs/images/castle.jpg',
              iconSize: [25, 25],
            });    
            var fourSqrIconx = L.icon({
              iconUrl: 'libs/images/castle-x.jpg',
              iconSize: [25, 25],
            });                            
            break;
          case 'Church':
            var fourSqrIcon = L.icon({
              iconUrl: 'libs/images/church.png',
              iconSize: [25, 25],
            });   
            var fourSqrIconx = L.icon({
              iconUrl: 'libs/images/church-x.jpg',
              iconSize: [25, 25],
            });                          
            break;              

          default:
              // code block
        }     
          
        //reset default data block
        var fourDataNoLatLng = "";
        //Check how many records are returned, if none, catch the error
        try {
          console.log("number of records : " + resultfour['data']['results'].length);
        }
        catch (e) {
          //Inform the user there are no records for their selection
          alert("there are no records for " + $('#fourSquareChoose').val() + " within " + strSearchDist + " Metres");
        }

        for (let i = 0; i < resultfour['data']['results'].length; i++) {

          console.log("record no : " + i + " " + JSON.stringify(resultfour['data']['results'][i]['text']['primary']));
          //Reset the variables
          var plcLat = 0;
          var plcLng = 0;
          var plcname = "";
          var plcLink = "";
          var fourSqrData = "";          

          try {
              //console.log("Name : " +JSON.stringify(resultfour['data']['results'][i]['text']['primary']));
              //console.log("place : " + JSON.stringify(resultfour['data']['results'][i]['place']['categories']));
              //console.log("geo-lat : " +JSON.stringify(resultfour['data']['results'][i]['place']['geocodes']['main']['latitude']));
              //console.log("geo-lon : " +JSON.stringify(resultfour['data']['results'][i]['place']['geocodes']['main']['longitude']));
              //console.log("link : " +JSON.stringify(resultfour['data']['results'][i]['geocodes']));

              //Set the datablock, coordinates
            plcLat = JSON.stringify(resultfour['data']['results'][i]['place']['geocodes']['main']['latitude']);
            plcLng = JSON.stringify(resultfour['data']['results'][i]['place']['geocodes']['main']['longitude']);
            plcname = JSON.stringify(resultfour['data']['results'][i]['text']['primary']);
            plcLink = JSON.stringify(resultfour['data']['results'][i]['geocodes']);  
  
            fourSqrData = JSON.stringify(resultfour['data']['results'][i]['place']['categories']['0']['name']) + " : " + plcname; 
                          
      //if they have a lat and long, add as markers, else add list of names as one marker
            if (plcLat != 0) {             
              var newFourMarker = L.marker([plcLat, plcLng], {icon: fourSqrIcon}).addTo(map);
              var fourmarkerPopup = newFourMarker.bindPopup(fourSqrData);
              fourmarkerPopup.addTo(map); 
            };
          }
          catch (e) {
              //Data block for those that have no coordinates
            console.log("Name : " +JSON.stringify(resultfour['data']['results'][i]))
            fourDataNoLatLng += JSON.stringify(resultfour['data']['results'][i]['text']['primary']) + "<br>";
          }
        };
        //Add marker for those that have no coordinates
        var newFourMarker = L.marker([globCityLat, globCityLng], {icon: fourSqrIconx}).addTo(map);
        var fourmarkerPopup = newFourMarker.bindPopup("Within your search area, there is/are also : " + fourDataNoLatLng + " without an address!!");
        fourmarkerPopup.addTo(map);
        map.setView([globCityLat, globCityLng], 16);
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(searchItem, strSearchDist, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    });   
  };

// End of foursquare data retrieval


//GEt the Api with details of the ISS
  function getIssData() {

    var phpSelector = 'geIssData';

    $.ajax({
        //url: "libs/php/getIss.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //used to select which api to call
        selector: phpSelector,
      },
      
      //if the returned data is OK
      success: function(result) {

        //setup the display Div - see map.css
        myIssData = "<div class='issFooter'><u>Location of the ISS</u><br>";
        myIssData += 'altitude : ' + (Math.round(result['data']['altitude'] * 100) / 100).toFixed(2) + ' Miles<br>';
        myIssData += 'velocity : ' + (Math.round(result['data']['velocity'] * 100) / 100).toFixed(2) + ' Km/h<br>';
        myIssData += 'Space Days: ' + (Math.round(result['data']['daynum'] * 100) / 100).toFixed(0) + '   </div>';

        const issIcon = L.divIcon({
          html: '<i class="fa fa-space-shuttle fa-3x" aria-hidden="true"></i>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        });

        var issOptions =
        {
          'className' : 'iss-popup'
        }

        var newCMarker = L.marker([result['data']['latitude'], result['data']['longitude']], {icon: issIcon}).addTo(map)
        var CmarkerPopup = newCMarker.bindPopup(myIssData, issOptions).openPopup();
        CmarkerPopup.addTo(map);      
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    }); 	
  };
  
//End of getting ISS Data retrieval


//Function to pull out the data from gardenradio Api
  function getRadioData(CountryName) {

    var phpSelector = 'getRadioData';
      $.ajax({
        //url: "libs/php/getRadioData.php",
        url: "libs/php/getCurrCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
          //used to select which api to call
          selector: phpSelector,
        },

        //if the returned data is OK
        success: function(resultRadio) {
          var i = 0;
          //setup the display Div - see map.css
          var radioOptions =
          {
            'className' : 'radio-popup'
          }     

          //setup the icon
        const radioIcon = L.divIcon({
          html: '<i class="fa fa-music fa-2x" aria-hidden="true"></i>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        });         

          //If name of country selected doesn't match that used in the Api, change it to one that does
          switch (CountryName) {
            case 'United Kingdom of Great Britain and Northern Ireland':
              CountryName = "United Kingdom";
              break;
          }

          console.log(JSON.stringify(resultRadio['data']['data']['list'][i]['country'])); 
          console.log("syef country name : " + resultRadio['data']['data']['list'].length);
          console.log("to put in order : " + resultRadio['data']['data']['list'][i]['country']);

          //sort the radio data by country
          const obj = resultRadio;
          const sortObject = resultRadio => {
            const arr = Object.keys(resultRadio['data']['data']['list'][i]['country']).map(el => {
              return obj[el];
            });
            arr.sort((a, b) => {
              return a - b;
            });
            return arr;
          };
          console.log(sortObject(obj));

          //Loop through the data adding an icon for radio stations found in selected country
          for (i = 0; i < resultRadio['data']['data']['list'].length; i++){   
              //If this is the country 
            if (resultRadio['data']['data']['list'][i]['country'] == CountryName){  
              while (resultRadio['data']['data']['list'][i]['country'] == CountryName) {
                //Set the radio stations Coordinates and url 
                var radioLat = JSON.stringify(resultRadio['data']['data']['list'][i]['geo'][1]);
                var radioLng = JSON.stringify(resultRadio['data']['data']['list'][i]['geo'][0]); 
                var radioUrl = JSON.stringify(resultRadio['data']['data']['list'][i]['url']).replace(/['"]+/g, '')
                console.log("url : " + radioUrl + "me"); 

                var myradioData = '<table class="table">';
                myradioData += '<thead>';
                myradioData += '<tr><td colspan="2" style="font-size: 35px;">';
                myradioData += JSON.stringify(resultRadio['data']['data']['list'][i]['title']) + '</td></tr>';

                myradioData += '</thead>';
                myradioData += '<tbody>';        

                myradioData += '<tr><td colspan="2" style="font-size: 15px;">';
                myradioData += '<a href="http://radio.garden' + radioUrl + '" target="_blank">Radio Garden</a>';
                myradioData += '<tr>'; 
                myradioData += '</tbody></table>';                

                //Add the radio markers
                var newradioMarker = L.marker([radioLat, radioLng], {icon: radioIcon}).addTo(map);
                var radiomarkerPopup = newradioMarker.bindPopup(myradioData);
                radiomarkerPopup.addTo(map);       
                i++;               
              }        
              //when current country radio markers added, stop loop  
              break;
            } else {
              console.log("errr");
            }
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
          console.log("error ");
          console.log(phpSelector);
          console.log(jqXHR, textStatus, errorThrown);
        }
      }); 
  };

//End of garden radio data retrieval


//Get tourist Photos/Information from Triposo Api
  function getTriposoData(CityName) {

    console.log("thecity : " + CityName);
    var phpSelector = 'getTriposoData';
    $.ajax({
        //url: "libs/php/getTriposoData.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
        //Pass the capital city variable 
        thecityName: CityName,
        //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultTriposo) {
        var i = 0;
        //setup the display Div - see map.css
        var TriposoOptions =
        {
          'className' : 'triposo-popup'
        }     

        //setup the icon   
        const TriposoIcon = L.divIcon({
          html: '<i class="<i class="fa fa-suitcase fa-lg" aria-hidden="true"></i>"></i>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        });                

          //console.log("stef " + JSON.stringify(resultTriposo['data']));

            //Setup the Lat and Long coordinates
          var triposoLat = JSON.stringify(resultTriposo['data']['results']['0']['coordinates']['latitude']);
          var triposoLng = JSON.stringify(resultTriposo['data']['results']['0']['coordinates']['longitude']); 

          //Empty/Init the variable to hold the data
          var myTriposoData = "";
          
          //Loop throught the records picking out the data required
          for (let i = 0; i < 3; i++) {
            myTriposoData += "<div class='figure'><a href='" + JSON.stringify(resultTriposo['data']['results']['0']['images'][i]['source_url']).replace(/['"]+/g, '') + "' target='_blank'><p><img src='" + resultTriposo['data']['results']['0']['images'][i]['source_url'] + "' width='245'><p></a>";
            myTriposoData += JSON.stringify(resultTriposo['data']['results']['0']['images'][i]['caption']) + "</div>";  
          };

          //Add the Marker to the map
          var newTriposoMarker = L.marker([triposoLat, triposoLng], {icon: TriposoIcon}).addTo(map);
          var triposomarkerPopup = newTriposoMarker.bindPopup(myTriposoData, TriposoOptions).openPopup();
          triposomarkerPopup.addTo(map); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("error ");
            console.log(CityName, phpSelector);
            console.log(jqXHR, textStatus, errorThrown);
        }
      }); 
    
    };

//End of Triposo data retrieval

//Get weather data
  function getweather(ctyLat, ctyLng) {

    console.log("Weather city lat :" + ctyLat)
    console.log("Weather city lng :" + ctyLng)

    var phpSelector = 'getweather';

    $.ajax({
      //url: "libs/php/getCountryWeather.php",
      url: "libs/php/getCurrCountry.php",
      type: 'POST',            
      dataType: 'json',
      data: {
        lat: ctyLat,
        lon: ctyLng,
        //used to select which api to call
        selector: phpSelector,
      },            
      success: function(resultWeather) {

        //console.log(globCurrCountryCodes);
          //resultWeather['data']['countryCode']

          //If data returned is good
        if (resultWeather.status.name == "ok") {

          console.log(resultWeather);
          console.log(resultWeather['data']['currentConditions']['icon']);
          var wicon = resultWeather['data']['currentConditions']['icon']

          //Setup weather icon       
          var weatherIcon = L.icon({
            iconUrl: 'libs/images/weather.ico',
            iconSize: [60, 40],
          });

          var countrycode = resultWeather['data']['countryCode'];
          var weathericon = "";

            //Select which icon to show depending on forcast
          switch(wicon) {
            case 'clear-night':
              weathericon = "<img src='libs/images/clear-nt.png' alt='clear night' style='width:120px;height:80px;'>"
            case 'clear-day':
              weathericon = "<img src='libs/images/clear.png' alt='clear night' style='width:120px;height:80px;'>"
            case 'overcast-night':
              weathericon = "<img src='libs/images/overcast-nt.png' alt='clear night' style='width:120px;height:80px;'>"
            case 'overcast':
              weathericon = "<img src='libs/images/overcast.png' alt='clear night' style='width:120px;height:80px;'>"
            case 'partly-cloudy-night':
              weathericon = "<img src='libs/images/cloudy-nt.png' alt='clear night' style='width:120px;height:80px;'>"
            case 'partly-cloudy':
              weathericon = "<img src='libs/images/cloudy-nt.png' alt='clear night' style='width:120px;height:80px;'>"
          }

            //mycurrData += "<div class='innerLayer1'>" + result['data']['name'] + "<br><img src='" + globFlag + "' alt='country Flag' style='width:50px;height:30px;'></div>";
          var myWeatherData = "<div class='weathertitle'>Weather for : <br>" + globCapCity + '</div>';

          myWeatherData += "<div class='weatherLayer1'>" + weathericon + resultWeather['data']['currentConditions']['conditions'] + '</div>';
          myWeatherData += "<div class='weatherLayer2'><img src='libs/images/cloudcover.png' alt='cloud Cover' style='width:100px;height:80px;'><br>" + resultWeather['data']['currentConditions']['cloudcover'] + '%</div>';
          myWeatherData += "<div class='weathertemp'><img src='libs/images/temp.png' alt='cloud Cover' style='width:40px;height:80px;'><br>" + resultWeather['data']['currentConditions']['temp'] + '°C</div>';
          myWeatherData += "<div class='weatherspeed'><img src='libs/images/windspeed.png' alt='windspeed' style='width:120px;height:80px;'><br>" + resultWeather['data']['currentConditions']['windspeed'] + 'km</div>';
          myWeatherData += "<div class='weatherfooter'><a href='https://www.accuweather.com/en/" + countrycode + "/national/weather-radar' a target='_blank'>accu weather</a></div>"

            // specify popup options 
          var weatherOptions =
          {
            'maxWidth': '400',
            'className' : 'weather-popup'
          }
            //Add Weather marker
          var newWMarker = L.marker([globCityLat, globCityLng, {icon: weatherIcon}]).addTo(map)
          var WmarkerPopup = newWMarker.bindPopup(myWeatherData,weatherOptions).openPopup()
          WmarkerPopup.addTo(map)                     

          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
        console.log("error ");
        console.log(ctyLat, ctyLng, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    }); 	
  };

//End of weather data retrieval

//Get the Api with Major City Data
  function getMajorCitiesData(curCCode) {

    console.log("the search : " + curCCode);
    
    var phpSelector = 'getMajorData';
    $.ajax({
      url: "libs/php/getMajorCities.php",
      //url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //variables passed to API
          coCode: curCCode,
          //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultMajor) {

        const cityIcon = L.divIcon({
          html: '<i class="fa fa-thumb-tack fa-2x" aria-hidden="true"></i>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        });        

// a and b are object elements of your array
        function mycomparator(a,b) {
          return parseInt(b.population, 10) - parseInt(a.population, 10);
        }

        var resultmajorsort = resultMajor['data']['cities'];
        resultmajorsort.sort(mycomparator);
        console.log(resultmajorsort);

        //work out how many loops
        if (resultmajorsort.length < 10) {
          var count = resultmajorsort.length;
        } else {
          var count = 10;
        }

        for (let i = 0; i < count; i++) {
            var cityData = "";

            var cityPopulation = parseInt(JSON.stringify(resultmajorsort[i]['population']));
            cityPopulation = cityPopulation.toLocaleString();

            console.log(JSON.stringify(resultmajorsort[i]['name']) + parseInt(JSON.stringify(resultmajorsort[i]['population'])));

                cityData = '<table class="table">';
                cityData += '<thead>';
                cityData += '<tr><td colspan="2" style="font-size: 35px;">';
                cityData += '<i class="fa fa-thumb-tack fa-lg" aria-hidden="true">' + " Major City" + '</i></td></tr>';
                cityData += '</thead>';
                cityData += '<tbody>';        
                cityData += '<tr><td colspan="2" style="font-size: 35px;">' + JSON.stringify(resultmajorsort[i]['name']) + '</td></tr>';
                cityData += '<tr><td colspan="2" style="font-size: 15px;">';
                cityData += 'Population : ' + cityPopulation;
                cityData += '<tr>'; 
                cityData += '</tbody></table>';            

            var newCityMarker = L.marker([JSON.stringify(resultMajor['data']['cities'][i]['latitude']), JSON.stringify(resultMajor['data']['cities'][i]['longitude'])], {icon: cityIcon}).addTo(map);
            var citymarkerPopup = newCityMarker.bindPopup(cityData);
            citymarkerPopup.addTo(map); 

            getNatureData(JSON.stringify(resultMajor['data']['cities'][i]['latitude']), JSON.stringify(resultMajor['data']['cities'][i]['longitude']))
            
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(curCCode, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    });   
  };

// End of majorcities data retrieval

//Get the Api with Nature spots Data
function getNatureData(natureLat, natureLon) {

  const natureIcon = L.divIcon({
    html: '<i class="fa fa-leaf fa-2x" aria-hidden="true"></i>',
    iconSize: [20, 20],
    className: 'myDivIcon'
  });

  console.log("the search : " + natureLat + natureLon);
    
    var phpSelector = 'getMajorData';
    $.ajax({
      url: "libs/php/getNature2.php",
      //url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //variables passed to API
          mynatureLat: natureLat,
          mynatureLon: natureLon,
          //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultNature) {

        console.log("Nature" + JSON.stringify(resultNature['data']['getPlaces']['0']));
        console.log("Name" + JSON.stringify(resultNature['data']['getPlaces']['0']['name']));
        console.log("lat" + JSON.stringify(resultNature['data']['getPlaces']['0']['lat']));
        console.log("lon" + JSON.stringify(resultNature['data']['getPlaces']['0']['lng']));
        console.log("cat" + JSON.stringify(resultNature['data']['getPlaces']['0']['categories']));

                var natureData = '<table class="table">';
                natureData += '<thead>';
                natureData += '<tr><td colspan="2" style="font-size: 35px;">';
                natureData += '<i class="fa fa-leaf fa-2x" aria-hidden="true"></i>' + ' Parks</td></tr>';

                natureData += '</thead>';
                natureData += '<tbody>';        
                natureData += '<tr><td colspan="2" style="font-size: 35px;">' + JSON.stringify(resultNature['data']['getPlaces']['0']['name']) + '</td></tr>';
                natureData += '<tr><td colspan="2" style="font-size: 15px;">';
                natureData += "categories : " + JSON.stringify(resultNature['data']['getPlaces']['0']['categories']);
                natureData += '<tr>'; 
                natureData += '</tbody></table>';         

        var natureMarker = L.marker([JSON.stringify(resultNature['data']['getPlaces']['0']['lat']), JSON.stringify(resultNature['data']['getPlaces']['0']['lng'])], {icon: natureIcon}).addTo(map);
        var naturemarkerPopup = natureMarker.bindPopup(natureData);
        naturemarkerPopup.addTo(map);         
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(natureLat, natureLon, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    });   
  };

// End of Nature spots  data retrieval

//Get the Api with news Headlines Data
function getNewsData(curCCode) {

  console.log("the search : " + curCCode);
    
    var phpSelector = 'getMajorData';
    $.ajax({
      url: "libs/php/getNewsData.php",
      //url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //variables passed to API
          coCode: curCCode,
          //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultNews) {
        try {

          console.log("News" + JSON.stringify(resultNews['data']['articles']['0']['source']['name']));
          console.log("author" + JSON.stringify(resultNews['data']['articles']['0']['author']));
          console.log("title" + JSON.stringify(resultNews['data']['articles']['0']['title']));
          console.log("url" + JSON.stringify(resultNews['data']['articles']['0']['url']));
          console.log("image" + resultNews['data']['articles']['0']['urlToImage']);

          var newsData = '<table class="table">';
          newsData += '<thead>';
          newsData += '<tr><td colspan="2" style="font-size: 35px;">';
          newsData += resultNews['data']['articles']['0']['source']['name'] + '</td></tr>';

          newsData += '</thead>';
          newsData += '<tbody>';        

          newsData += '<tr><td colspan="3" style="font-size: 15px;">';
          newsData += resultNews['data']['articles']['0']['title'];
          newsData += '<tr>'; 
          newsData += '<tr><td colspan="2" style="font-size: 15px;">';
          newsData += "<img src='" + resultNews['data']['articles']['0']['urlToImage'] + "' alt='News story' style='display:block;' width='280px'>";
          newsData += '<tr>'; 
          newsData += '<tr>';
          newsData += '<th scope="col">Author</th>';
          newsData += '<th scope="col"></th>';
          newsData += '</tr>';          
          newsData += '<tr><th scope="row">'+ resultNews['data']['articles']['0']['author'] + '</th><td><a href="' + resultNews['data']['articles']['0']['url'] + '" target="_blank">Link</a></td></tr>';          

          newsData += '</tbody></table>';

        //Setup the display icon and Div
        var newsOptions =
          {
            'className' : 'news-popup'
          }      

                //Add Weather marker
          var newsMarker = L.marker([globCityLat, globCityLng]).addTo(map)
          var newsmarkerPopup = newsMarker.bindPopup(newsData).openPopup()
          //newsmarkerPopup.addTo(map) 
        }
        catch(err) {
          alert("There doesn't appear to be a headline for this country");
        }          
 
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(curCCode, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    });   
  };

// End of news headlines data retrieval

function nth(n){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//Get the Api with public holidays Data
function getHols(curCCode) {

  console.log("the search : " + curCCode);

  var todaysDate = new Date();
  var yyear = todaysDate.getFullYear().toString();
  console.log("year : " + yyear);
    
    var phpSelector = 'getMajorData';
    $.ajax({
      url: "libs/php/getHolidays.php",
      //url: "libs/php/getCurrCountry.php",
      type: 'POST',
      dataType: 'json',
      data: {
          //variables passed to API
          coCode: curCCode,
          myYear: yyear,
          //used to select which api to call
        selector: phpSelector,
      },

      //if the returned data is OK
      success: function(resultHols) {
       console.log(resultHols);

       try {
        console.log("date " +  JSON.stringify(resultHols['0']));
        console.log("date : " +  JSON.stringify(resultHols['0']['date']));
        console.log("date : " +  JSON.stringify(resultHols['0']['localName']));
        console.log("date : " +  JSON.stringify(resultHols['0']['name']));
        console.log("date : " +  JSON.stringify(resultHols['0']['type']));
 
        var holsData = '<table class="table table-striped" style="width:300px">';
        holsData += '<thead>';
        holsData += '<tr><td colspan="4" style="font-size: 35px;">';
        holsData += "<img src='./libs/images/holiday.jpg' alt='News story' style='display:block;' width='50px'>";
        holsData += '</td></tr>';
        holsData += '<tr>';
        holsData += '<th scope="col">Name</th>';
        holsData += '<th scope="col">Local Name</th>';
        holsData += '<th scope="col">type</th>';
        holsData += '<th scope="col">date</th>';
        holsData += '</tr>';
        holsData += '</thead>';
        holsData += '<tbody>';        
        
      //Loop throught the records picking out the data required
      for (let i = 0; i < resultHols.length; i++) {
        const d = new Date(resultHols[i]['date']);
        let month = months[d.getMonth()];
        let day = d.getDate();
        day = day + nth(day);
        var holdate = day + " of " + month;
        // + months[resultHols[i]['date'].getMonth()]
        holsData += '<tr><th scope="row">' + resultHols[i]['name'] + '</th><td>' + resultHols[i]['localName'] + '</td><td>' + resultHols[i]['type'] + '</td><td>' + holdate + '</td></tr>';
      };    
      
        holsData += '</tbody></table>';   

              //Add Weather marker
        var newsMarker = L.marker([globCityLat, globCityLng]).addTo(map)
        var newsmarkerPopup = newsMarker.bindPopup(holsData, {
          className: 'hols-popup'
        }).openPopup()
        //newsmarkerPopup.addTo(map)  
      }
      catch(err) {
        alert("There doesn't appear to be a list of public holidays for this country");
      }        
      },
      error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        console.log("error ");
        console.log(curCCode, yyear, phpSelector);
        console.log(jqXHR, textStatus, errorThrown);
      }
    });   
  };

// End of public holidays data retrieval