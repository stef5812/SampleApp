var iRecords = 0;

function readMOWTextFile(file)
{
    //console.log("stefan11");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                
                //csvOPData = arrData;
                //console.log("steffffffff");
                //console.log(allText);
                //VOLdropdown += "<select>";

                const [keys, ...rest] = allText.trim().split('\n').map((item) => item.split(','))
    
                const formedArr = rest.map((item) => {
                    const object = {}
                    keys.forEach((key, index) => object[key] = item.at(index))
                    //console.log(object);
                    var result = getFields(object, "Service Name"); // returns [ 1, 3, 5 ]
                    //console.log(result);
                    iRecords = iRecords + 1;
                    return object
                })
                //console.log(formedArr);

                //go through the array, get lat, lon and add to map
                //let result = '';
                var coCode = '';
                FNresult = '';
                SNresult = '';
                Visit = '';                
                
                let i = 0;
                
                do {
                      
                    FNresult = getFields(formedArr, "Service Name");
                    //console.log(FNresult[i]);
                    LNresult = getFields(formedArr, " Address");
                    //console.log(FNresult[i]);
                    FNresult = getFields(formedArr, " Country");
                    //console.log(FNresult[i]);                                                                           
                    FNresult = getFields(formedArr, " County");
                    //console.log(FNresult[i]);
                    FNresult = getFields(formedArr, " Phone");
                    //console.log(FNresult[i]);
                    Town = getFields(formedArr, " Town");
                    //console.log(FNresult[i]);                    
                    var EIRresult = getFields(formedArr, " Eircode");
                    coCode = EIRresult[i];
                    //console.log("STEFZZZ" + coCode);
                    var onlyCharacters = coCode.replace(/ /g, "");
                    
                    //console.log("Not" + onlyCharacters);
                    //console.log("passing" + onlyCharacters);
                                     
                    if(coCode.length==0){
                        //VOLdropdown += "<option>VOL Missing Eircode : " + FNresult[i] + " " + LNresult[i] + "</option>";
                    } else {
                        //console.log("passing" + onlyCharacters);
                        getLatLonMOW(onlyCharacters, FNresult[i], LNresult[i]);   
                    }
                    i = i + 1;   
                    
                    //console.log(FNresult, LNresult, EIRresult);
                } while (i < iRecords);

                //var FNresult = getFields(formedArr, "First Name"); // returns [ 1, 3, 5 ]
                //console.log(iRecords + "counted");
                //console.log(result[0]);
                return formedArr;                         
                      
            }
        }
    }
    rawFile.send(null);
}

function getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}

function getLatLonMOW(curCCode, FNresult, LNresult){
        var strSearch = curCCode.toString();
        //console.log(strSearch + "mark");
        $.ajax({
        url: "libs/php/getLocB.php",
        async: true,
        dataType: 'json',
        data: {
            ECode: strSearch,
        },         
        success: function (data) {

      
      var MOWDatashow =
      {
        'maxWidth': '400',
        'className' : 'MOW-popup'
      }        

            //console.log("success");
            var thisLat = (data['data']['results']['0']['geometry']['location']['lat']);
            var thisLng = (data['data']['results']['0']['geometry']['location']['lng']);

        //set the variables
      //console.log(JSON.stringify(data)); 

            MOWIcon = L.icon({
                iconUrl: 'libs/icons/MOW.png',
                iconSize: [25, 25],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
              });   
              var MOWmarker = L.marker([thisLat, thisLng], {icon: MOWIcon}).addTo(MOWMarkers)

            //var markerPopup = OPmarker.bindPopup('Vol Name : ' + FNresult + " " + LNresult, VOLData)
            var markerPopup = MOWmarker.bindPopup('Name : ' + FNresult+ ' ' + LNresult + ":<br><br>Status : " + Status + "<br><br>" + extraText,VOLDatashow)
            markerPopup = MOWmarker.bindTooltip('fxhgh ');
            markerPopup = MOWmarker.on('mouseover', showHideTooltip);            
            //markerPopup.addTo(map)          
  
            //console.log(data);
          }
      });      
}

function getLatLonB(curCCode){
    //console.log(curCCode + "mark");
    $.ajax({
        url: "libs/php/getLocB.php",
        async: true,
        dataType: 'json',
      data: {
          coCode: curCCode,
      },       
        success: function (data) {
          //console.log("success");
          //console.log(data.latitude);
          //console.log(data.longitude);

          var OPmarker = L.marker([data.latitude, data.longitude], {icon: myIcon}).addTo(map)
          var markerPopup = OPmarker.bindPopup('OP1, OP Address ' + OPmarker.getLatLng()).openPopup()
          markerPopup.addTo(map)          

          //console.log(data);
        }
      }); 
  }