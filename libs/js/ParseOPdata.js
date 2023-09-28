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

                iRecords = 0

                const [keys, ...rest] = allText.trim().split('\n').map((item) => item.split(','))
    
                const formedArr = rest.map((item) => {
                    const object = {}
                    keys.forEach((key, index) => object[key] = item.at(index))
                    //console.log(object);
                    var result = getFields(object, "Surname"); 
                    //console.log("bfffhj");
                    //console.log(result);
                    iRecords = iRecords + 1;
                    return object
                })
                //console.log(formedArr);

                //go through the array, get lat, lon and add to map
                //let result = '';
                
                FNresult = '';
                SNresult = '';
                extraText = '';

                
                let i = 0;
                
                do {
                    imgPets = "";
                    imgSmk = '';
                                     
                    FNresult = getFields(formedArr, "First");
                    //console.log(FNresult[i]);
                    LNresult = getFields(formedArr, "Surname");
                    //console.log(LNresult[i]);                                    
                    Lat = getFields(formedArr, "Lat");
                    //console.log(Lat[i]);
                    Lon = getFields(formedArr, "Lon");
                    //console.log(Lon[i]);                   

                    Status = getFields(formedArr, "Status");
                    Age = getFields(formedArr, "Age");
                    Sex = getFields(formedArr, "Sex");
                        
                    Support = getFields(formedArr, "CHN");
                    //console.log("SC" + Support[i]);
                
                    smoker = getFields(formedArr, "Smoker");
                    //console.log("smoker" + smoker[i]); 
                    if (smoker[i] == "Yes") {
                        imgSmk = "<img src='libs/icons/smoker.png' style='width:40px;height:40px;'>"
                    } else {
                        imgSmk = ""
                    }  
                    
                    pets = getFields(formedArr, "Pets");
                    //console.log(LNresult[i] + "Pets" + pets[i]);     
                    if (pets[i] == "Yes") {
                        imgPets = "<img src='libs/icons/yPets.png' style='width:40px;height:40px;'>";
                    } else {
                        imgPets = "";
                    };                     
                    
                    Link = getFields(formedArr, "Link");
                    //console.log("Link" + smoker[i]); 
                    if (Link[i]){
                        Link = "<a href='" + Link[i] + "' target='_blank'>"
                    } else {
                        Link = "";
                    }

                    var theIcon = "";

                    switch(Status[i]){
                    case "Matched":
                        theIcon = "libs/icons/OPicon-active.png";
                        break;
                    case "Re-match":
                        theIcon = "libs/icons/OPicon-re.png";
                        break;
                    default :
                        theIcon = "libs/icons/OPicon.png";
                        break;
                    };

                    
                    extraText = Link + "<img src=" + theIcon + " style='width:40px;height:40px;'></a>"+ imgPets+imgSmk+"<br>Name : "+FNresult[i]+LNresult[i] + "<br>Age : "+Age[i]+ "<br>Sex : "+Sex[i]+ "<br>SC : "+Support[i];    
                    extraText += "<br><br>We have the capability to incorporate additional data, including the latest information sourced directly from Salesforce as it undergoes updates. For illustrative purposes, we have not yet implemented this feature. This supplementary data may encompass details such as the Inventory/Status of tech deliveries, along with the most recent case notes";

                    if(Lat[i] != undefined){getOPLatLon(Lat[i], Lon[i], FNresult[i], LNresult[i], Status[i])}

                    i = i + 1;
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

              function getOPLatLon(thisLat, thisLng, FNresult, LNresult, Status){
                var OPDatashow =
                {
                  'maxWidth': '200',
                  'className' : 'OP-popup'
                }             
                    switch (Status) {
                        case "Matched":
                            
                            OPIcon = L.icon({
                                iconUrl: 'libs/icons/OPicon-active.png',
                                iconSize: [35, 35],
                              //    iconAnchor: [22, 94],
                              //    popupAnchor: [-3, -76],
                              //    shadowUrl: 'my-icon-shadow.png',
                              //    shadowSize: [68, 95],
                              //    shadowAnchor: [22, 94]
                            });                    
                            var OPMarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpAMarkers)
                            break;
                        case "Re-match":
                            
                            OPIcon = L.icon({
                                iconUrl: 'libs/icons/OPicon-re.png',
                                iconSize: [35, 35],
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
                                iconSize: [35, 35],
                              //    iconAnchor: [22, 94],
                              //    popupAnchor: [-3, -76],
                              //    shadowUrl: 'my-icon-shadow.png',
                              //    shadowSize: [68, 95],
                              //    shadowAnchor: [22, 94]
                              });                     
                            var OPMarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBMMarkers)
                            break;
                            }
            
              //OPmarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBMMarkers)
              var markerPopup = OPMarker.bindPopup(extraText, OPDatashow)
              //console.log(curCCode + "mark");
              var Tooltip = FNresult + ' ' + LNresult
              // if (Pets == "Yes"){
              //     console.log("ghghghgghttttt")
              //     varTooltip += "  " + "<img src='libs/icons/dog.png' width='20' />"
              // }
              // if (Smoker == "Yes"){
              //     varTooltip += "<img src='libs/icons/smoker.png' width='20' />"
              // }            
               
              markerPopup = OPMarker.bindTooltip(Tooltip);
              markerPopup = OPMarker.on('mouseover', showHideTooltip);
            //   OPMarker.on('mouseover', customTip(FNresult+ ' ' + LNresult));
            //   markerPopup.addTo(map)   
            //   map.closePopup();       
    
              //console.log(data);
                  
            }