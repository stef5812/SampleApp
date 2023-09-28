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
                
                const [keys, ...rest] = allText.trim().split('\n').map((item) => item.split(','))
    
                const formedArr = rest.map((item) => {
                    const object = {}
                    keys.forEach((key, index) => object[key] = item.at(index))
                    //console.log(object);
                    var result = getFields(object, "Surname"); // returns [ 1, 3, 5 ]
                    //console.log("RES" + result);
                    iRecords = iRecords + 1;
                    return object
                })
                //console.log("Formed" + formedArr);
                FNresult = '';
                SNresult = ''; 
                var imgPets = '';          
                var imgSmk = '';
                extraText = '';
                
                let i = 0;
                
                do {
                    imgPets = '';          
                    imgSmk = '';                 
                    pets = getFields(formedArr, "Pets"); 
                    
                    Age = getFields(formedArr, "Age");
                    Sex = getFields(formedArr, "Sex");

                    FNresult = getFields(formedArr, "First");
                    //console.log(FNresult[i]);
                    LNresult = getFields(formedArr, "Surname");
                    //console.log(LNresult[i]);                                    
                    Lat = getFields(formedArr, "Lat");
                    //console.log(Lat[i]);
                    Lon = getFields(formedArr, "Lon");
                    //console.log(Lon[i]);                   

                    Status = getFields(formedArr, "Status");
                    //console.log("Status" + Status[i]);    
                
                    Smoking = getFields(formedArr, "Smoking");
                    //console.log("Smoking" + Smoking[i] + LNresult[i]); 

                    if (Smoking[i] == "No") {
                        imgSmk = "<img src='libs/icons/nSmk.png' style='width:40px;height:40px;'>"
                    } else {
                        imgSmk = ""
                    }  
                    //console.log(LNresult[i] + "Pets" + pets[i]);   
                    if (pets[i] == "No"){
                        imgPets = "<img src='libs/icons/noPets.png' style='width:40px;height:40px;'>";
                    } else {
                        imgPets = "";
                    }                                          
                    Link = getFields(formedArr, "Link");
                    //console.log("Link" + smoker[i]); 
                    if (Link[i]){
                        Link = "<a href='" + Link[i] + "' target='_blank'>"
                    } else {
                        Link = "";
                    }                    
                    
                    //console.log("Not" + onlyCharacters);
                    //console.log("passing" + onlyCharacters);
                    
                    
                    //console.log("passing" + onlyCharacters);
                    var theIcon = "";
                    switch(Status[i]){
                        case "Active":
                            theIcon = "libs/icons/VOLicon-active.png";
                            break;
                        case "FtAc":
                            theIcon = "libs/icons/VOLicon-L.png";
                            break;
                        default :
                            theIcon = "libs/icons/VOLicon.png";
                            break;
                    }
    
                    extraText = Link + "<img src=" + theIcon + " style='width:40px;height:40px;'>" + imgPets + imgSmk + "<br>Name : "+FNresult[i]+LNresult[i]+ "<br> Sex : "+Sex[i]+"<br> Age : "+Age[i];    
                    extraText += "<br><br>We can add-in more data, latest information directly from salesforce as it is updated, for demonstration ourposes, we haven't";

                    if(Lat[i] != undefined){getLatLonf(Lat[i], Lon[i], FNresult[i], LNresult[i], Status[i])}
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

function getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}

function getLatLonf(thisLat, thisLng, FNresult, LNresult, Status){
      
      var VOLDatashow =
      {
        'maxWidth': '400',
        'className' : 'VOL-popup'
      }        

      switch(Status){
        case "Active":
            VOLIcon = L.icon({
                iconUrl: 'libs/icons/VOLicon-active.png',
                iconSize: [35, 35],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
              });   
              
              var VOLmarker = L.marker([thisLat, thisLng], {icon: VOLIcon}).addTo(VolAMarkers)
            break;

        case "FtAc":
            VOLIcon = L.icon({
                iconUrl: 'libs/icons/VOLicon-L.png',
                iconSize: [35, 35],
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
                iconSize: [35, 35],
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
            
            var markerPopup = VOLmarker.bindPopup(extraText,VOLDatashow)
            markerPopup = VOLmarker.bindTooltip(FNresult + ' ' + LNresult);
            markerPopup = VOLmarker.on('mouseover', showHideTooltip);            
            //markerPopup.addTo(map)          
  
            //console.log(data);
          }
