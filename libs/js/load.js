//Functions run on loading of html

  //Preloader
  $(window).on('load', function () {
    
    if ($('#preloader').length) {
      $('#preloader').delay(1000).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });
  
  //trigger Main loader

  document.addEventListener('DOMContentLoaded', () => {
    //get the current location using geolocation
    //console.log("Just checking");
    getLocation();
    //getLatLon();
    //getLatLonB();
    readTextFile("libs/data/new-OP-data.csv");

    //console.log(OPdropdown);    
    readVOLTextFile("libs/data/VOLData.csv");
    //VOLdropdown += '</select>';
    
    //console.log(VOLdropdown);
    readHospitalsFile("libs/data/listofhospitalsinireland.csv"); 
    readPHARMFile("libs/data/pharmacies.csv");   
    readDENTFile("libs/data/dental_practices.csv");
    readHEALTHFile("libs/data/listofhealthcentresinireland.csv");
    readNursingFile("libs/data/nursing_homes.csv");
    
    readMOWTextFile("libs/data/MOW.csv");
    
    readGARDAFile("libs/data/Garda.csv");

    readAUTHFile("libs/data/Council.csv");    

    readCHIMEFile("libs/data/Chime.csv");    
    readWHEELFile("libs/data/wheelchair.csv");    
    readNCBIFile("libs/data/NCBI.csv");    
    readALZFile("libs/data/ALZ.csv");    
    readMABSFile("libs/data/MABS.csv"); 
    //console.log(OPArray);
    //CSVToArray(csvOPData, ",");

    //L.marker([52.9, -8.49], {icon: greenIcon}).addTo(map); 

    var OPlegend = L.control({position: 'topright'});
    OPlegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        //console.log("jgbdjkfxol" + OPdropdown);
        div.innerHTML = OPdropdown;
        //div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };
    OPlegend.addTo(map);
    
    var VOLlegend = L.control({position: 'topright'});
    VOLlegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        //console.log(VOLdropdown);
        div.innerHTML = VOLdropdown;

        //div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };  
    VOLlegend.addTo(map)  

    //OPPopup.addTo(map)   
    //VolPopup.addTo(map)   
    map.closePopup();       
  });




  function showHideTooltip()
  {
          var mytooltip = this.getTooltip();
          if(this.isPopupOpen())
          {      
              // Popup is open, set opacity to 0 (invisible)
              mytooltip.setOpacity(0.0);
          }
          else
          {
              // Popup is cosed, set opacity back to visible
              mytooltip.setOpacity(0.9);
          }
  }
  
  function clickHideTooltip()
  {
          var mytooltip = this.getTooltip();
          mytooltip.setOpacity(0.0);
  }
  //vol retreive data
  
  

  //gLobal variables set 
  var varTooltip = '';

  var extraText = "There can be more text added to these boxes, at the moment i haven't added any <br><br>It might be useful just to give more details before a link to the OP or vol themselves";

  var FNresult = '';
  var LNresult = '';
  var EIRresult = '';
  var Status = '';
  var coCode = '';

  var Address = '';
  var varX = '';
  var varY = '';

  var OPdropdown = '';
  var VOLdropdown = '';
  var HOSPdropdown = '';

  var Visit = '';
    
  var Addr1 = '';
  var Addr2 = '';
  var Addr3 = '';
  var SetCountryCode = 'IE';
  var csvOPData = '';
  var strDelimiter = '';

  var globCurLat = '';
  var globCurLng = '';


  //Function to get users location if allowed
  async function getLocation() {
    //console.log("stefan10");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }else{
        console.warn("Can't geolocate!");
        //this would be a good place to fall back on geolocation by IP (AJAX necessary)
      }

  }

  //setting up other onload options
  function showPosition(position) {
    //check return, add to input text for future use
    curLat = position.coords.latitude;
    $('#inpLat').val(curLat);
    //console.log('Latitude: ' + curLat);
    //console.log($('#inpLat').val())

    //check return, add to input text for future use
    curLng = position.coords.longitude;
    $('#inpLng').val(curLng);
    //console.log('Longitude: ' + curLng);
    //console.log($('#inpLng').val())
  }

