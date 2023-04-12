var iRecords = 0;

function readVOLTextFile(file)
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
                VOLdropdown += "<select>";

                const [keys, ...rest] = allText.trim().split('\n').map((item) => item.split(','))
    
                const formedArr = rest.map((item) => {
                    const object = {}
                    keys.forEach((key, index) => object[key] = item.at(index))
                    //console.log(object);
                    var result = getFields(object, "First Name"); // returns [ 1, 3, 5 ]
                    //console.log(result);
                    iRecords = iRecords + 1;
                    return object
                })
                console.log(iRecords);

                //go through the array, get lat, lon and add to map
                //let result = '';
                var coCode = '';
                FNresult = '';
                SNresult = '';
                Visit = '';                
                
                let i = 0;
                
                do {
                                     
                    FNresult = getFields(formedArr, "First Name");
                    //console.log(FNresult[i]);
                    LNresult = getFields(formedArr, "Last Name");
                    //console.log(LNresult[i]);
                    Visit = getFields(formedArr, "Visitation Role Status");
                    //console.log(Visit[i]);                    
                    var EIRresult = getFields(formedArr, "Eircode");
                    coCode = EIRresult[i];
                    //console.log(coCode);
                    
                    
                    //console.log("Not" + onlyCharacters);
                    //console.log("passing" + onlyCharacters);
                    

                    if(coCode != undefined){                 
                        if(coCode.length==0){
                            VOLdropdown += "<option>VOL Missing Eircode : " + FNresult[i] + " " + LNresult[i] + "</option>";
                        } else {
                            var onlyCharacters = coCode.replace(/ /g, "");
                            //console.log("passing" + onlyCharacters);
                            getLatLonf(onlyCharacters, FNresult[i], LNresult[i],Visit[i]);   
                        }
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

function getLatLonf(curCCode, FNresult, LNresult,Status){
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

      
      var VOLDatashow =
      {
        'maxWidth': '400',
        'className' : 'VOL-popup'
      }        

            //console.log("success");
            var thisLat = (data['data']['results']['0']['geometry']['location']['lat']);
            var thisLng = (data['data']['results']['0']['geometry']['location']['lng']);

        //set the variables
      //console.log(JSON.stringify(data)); 
      switch(Status){
        case "Active":
            VOLIcon = L.icon({
                iconUrl: 'libs/icons/VOLicon-active.png',
                iconSize: [25, 25],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
              });   
              var VOLmarker = L.marker([thisLat, thisLng], {icon: VOLIcon}).addTo(VolAMarkers)
            break;

        case "Fully trained/Awaiting checks":
            VOLIcon = L.icon({
                iconUrl: 'libs/icons/VOLicon-L.png',
                iconSize: [25, 25],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
              });          
              var VOLmarker = L.marker([thisLat, thisLng], {icon: VOLIcon}).addTo(VolLMarkers)           
            break;
        default:
            VOLIcon = L.icon({
                iconUrl: 'libs/icons/VOLicon.png',
                iconSize: [25, 25],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
              });   
              var VOLmarker = L.marker([thisLat, thisLng], {icon: VOLIcon}).addTo(VolTBMMarkers) 
              break;                    
    }             
  

            //var markerPopup = OPmarker.bindPopup('Vol Name : ' + FNresult + " " + LNresult, VOLData)
            var markerPopup = VOLmarker.bindPopup('Name : ' + FNresult+ ' ' + LNresult + ":<br><br>Status : " + Status + "<br><br>" + extraText,VOLDatashow)
            markerPopup = VOLmarker.bindTooltip(FNresult + ' ' + LNresult);
            markerPopup = VOLmarker.on('mouseover', showHideTooltip);            
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