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

                FNresult = '';
                SNresult = '';
                Status = '';
               
                extraText = ' ';                
                let i = 0;
                
                do {
                      
                    FNresult = getFields(formedArr, "Service Name");
                    //console.log(FNresult[i]);
                    LNresult = getFields(formedArr, " Address");
                    //console.log(LNresult[i]);                                                         
                    county = getFields(formedArr, " County");
                    //console.log(county[i]);
                    phone = getFields(formedArr, " Phone");
                    //console.log(phone[i]);
                    Lat = getFields(formedArr, "Lat");
                    //console.log(Lat[i]);
                    Lon = getFields(formedArr, "Lon");
                    //console.log(Lon[i]);   
                    Link = getFields(formedArr, "Link");
                    //console.log(Link[i]);                                                       

                    //console.log("passing");

                    
                    if (Link[i] != undefined){
                        //console.log("def" + Link[i])
                        extraText = "<a href='" + Link[i] + "' target='_blank'><img src='libs/icons/MOW.png' style='width:40px;height:40px;'></a><br>"+FNresult[i]+"<br>"+LNresult[i]+"<br>"+phone[i]+"<br>";
                    } else {
                        //console.log("undef" + Link[i])
                        extraText = "<img src='libs/icons/MOW.png' style='width:40px;height:40px;'><br>"+FNresult[i]+"<br>"+LNresult[i]+"<br>"+phone[i]+"<br>";
                    }                       
                    if(Lat[i] != undefined){getLatLonMOW(FNresult[i], LNresult[i], Lat[i], Lon[i])};   
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

function getLatLonMOW(FNresult, LNresult, thisLat, thisLng){
        
      var MOWDatashow =
      {
        'maxWidth': '400',
        'className' : 'MOW-popup'
      }      
        
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
            var markerPopup = MOWmarker.bindPopup(extraText,MOWDatashow)

            markerPopup = MOWmarker.bindTooltip(FNresult + ' ' + LNresult);
            markerPopup = MOWmarker.on('mouseover', showHideTooltip);            
            //markerPopup.addTo(map)          
          }