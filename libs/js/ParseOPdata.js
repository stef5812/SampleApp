var iRecords = 0;

function readTextFile(file)
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
                //console.log("bfffhj");
                //console.log(allText);

                const [keys, ...rest] = allText.trim().split('\n').map((item) => item.split(','))
    
                const formedArr = rest.map((item) => {
                    const object = {}
                    keys.forEach((key, index) => object[key] = item.at(index))
                    //console.log(object);
                    var result = getFields(object, "First Name"); 
                    //console.log(result);
                    iRecords = iRecords + 1;
                    return object
                })
                //console.log(formedArr);

                //go through the array, get lat, lon and add to map
                //let result = '';
                
                FNresult = '';
                SNresult = '';

                OPdropdown += "<select>";
                
                let i = 0;
                
                do {
                    
                    pets = getFields(formedArr, "Do they have pets?");
                    //console.log("Pets" + pets[i]);                    
                    FNresult = getFields(formedArr, "First Name");
                    //console.log(FNresult[i]);
                    LNresult = getFields(formedArr, "Last Name");
                    //console.log(LNresult[i]);                                    
                    EIRresult = getFields(formedArr, "Eircode");

                    Status = getFields(formedArr, "Status in Role");
                    //console.log(Status[i]);    
                    Support = getFields(formedArr, '"Support Coordinator "');
                    //console.log(Support[i]);
                
                    smoker = getFields(formedArr, "Smoker?");
                    //console.log("smoker" + smoker[i]);                    

                    coCode = EIRresult[i];
                    
                    if(coCode != undefined){
                        if(coCode.length==0){
                            //console.log("OP Missing Eircode : " + FNresult[i] + " " + LNresult[i]);
                            OPdropdown += "<option>OP Missing Eircode : " + FNresult[i] + " " + LNresult[i] + "</option>";
                        } else {
                            let onlyCharacters = coCode.replace(/ /g, "");
                            getLatLon(onlyCharacters, FNresult[i], LNresult[i],Status[i], pets[i], smoker[i]);
                        }  
                    }                
                    i = i + 1;
                    //console.log(FNresult, LNresult, EIRresult);
                } while (i < iRecords);

                markerPopup.addTo(map)   
                //var FNresult = getFields(formedArr, "First Name"); // returns [ 1, 3, 5 ]
                //console.log(iRecords + "counted");
                //console.log(result[0]);
                return formedArr;                         
                      
            }
        }
    }
    rawFile.send(null);
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

function getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}

function customTip(ShortTip) {
    this.unbindTooltip();
    if(!this.isPopupOpen()) this.bindTooltip(ShortTip).openTooltip();
  }

  function customPop() {
      this.unbindTooltip();
  }

function getLatLon(curCCode, FNresult, LNresult, Status, Pets, Smoker){
        var customtip = FNresult + ' ' + LNresult;
        var strSearch = curCCode.toString();
        
        $.ajax({
        url: "libs/php/getLocB.php",
        async: true,
        dataType: 'json',
        data: {
            ECode: strSearch,
        },         
        success: function (data) {

            var OPDatashow =
            {
              'maxWidth': '400',
              'className' : 'OP-popup'
            }              

            //console.log("success");
            var thisLat = (data['data']['results']['0']['geometry']['location']['lat']);
            var thisLng = (data['data']['results']['0']['geometry']['location']['lng']);

            switch (Status) {
                case "Active":
                    OPIcon = L.icon({
                        iconUrl: 'libs/icons/OPicon-active.png',
                        iconSize: [25, 25],
                      //    iconAnchor: [22, 94],
                      //    popupAnchor: [-3, -76],
                      //    shadowUrl: 'my-icon-shadow.png',
                      //    shadowSize: [68, 95],
                      //    shadowAnchor: [22, 94]
                    });                    
                    var OPMarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpAMarkers)
                    break;
                case "To be Re-matched":
                    OPIcon = L.icon({
                        iconUrl: 'libs/icons/OPicon-re.png',
                        iconSize: [25, 25],
                      //    iconAnchor: [22, 94],
                      //    popupAnchor: [-3, -76],
                      //    shadowUrl: 'my-icon-shadow.png',
                      //    shadowSize: [68, 95],
                      //    shadowAnchor: [22, 94]
                      }); 
                    var OPMarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBRMMarkers)
                    break;
                default:
                    OPIcon = L.icon({
                        iconUrl: 'libs/icons/OPicon.png',
                        iconSize: [25, 25],
                      //    iconAnchor: [22, 94],
                      //    popupAnchor: [-3, -76],
                      //    shadowUrl: 'my-icon-shadow.png',
                      //    shadowSize: [68, 95],
                      //    shadowAnchor: [22, 94]
                      });                     
                    var OPMarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBMMarkers)
                    break;
            }            
  
//            var OPmarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBMMarkers)
            var markerPopup = OPMarker.bindPopup('Name : ' + FNresult+ ' ' + LNresult + ":<br><br>Status : " + Status + "<br><br>" + extraText,OPDatashow)
            console.log(curCCode + "mark");
            varTooltip = FNresult + ' ' + LNresult
            if (Pets == "Yes"){
                console.log("ghghghgghttttt")
                varTooltip += "  " + "<img src='libs/icons/dog.png' width='20' />"
            }
            if (Smoker == "Yes"){
                varTooltip += "<img src='libs/icons/smoker.png' width='20' />"
            }            
             
            markerPopup = OPMarker.bindTooltip(varTooltip);
            markerPopup = OPMarker.on('mouseover', showHideTooltip);
            //OPMarker.on('mouseover', customTip(FNresult+ ' ' + LNresult));
            //markerPopup.addTo(map)   
            //map.closePopup();       
  
            //console.log(data);
          }
      });      
}
