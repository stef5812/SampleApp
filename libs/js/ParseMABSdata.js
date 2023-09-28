var iRecords = 0;

function readMABSFile(file)
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
                    var result = getFields(object, "name"); 
                    //console.log("bfffhj");
                    //console.log(result);
                    iRecords = iRecords + 1;
                    return object
                })
                //console.log(iRecords + "stef");

                //go through the array, get lat, lon and add to map
                //let result = '';
                
                FNresult = '';
                SNresult = '';
                    var Link = '';
                    var G247 = '';
                //HOSPdropdown += "<select>";
                
                let i = 0;
                
                do {
                    
                    FNresult = getFields(formedArr, "name");
                    //console.log(FNresult[i]);
                    Address = getFields(formedArr, "Address");
                    //console.log(Address[i]);         
                    Contact = getFields(formedArr, "Contact");
                    //console.log(FNresult[i]);
                    What = getFields(formedArr, "where");
                    //console.log(Address[i]);   
                    //name = getFields(formedArr, "name");
                    //console.log(FNresult[i]);
                    Address = getFields(formedArr, "Address");
                    //console.log(Address[i]);                                                                      
                    //EIRresult = getFields(formedArr, "eircode");

                    varX = getFields(formedArr, "lat");
                    console.log(varX[i] + "STEF1");    
                    varY = getFields(formedArr, "lon");
                    //console.log(varY[i] + "STEF2"); 

                    phone = getFields(formedArr, "Phone");
                    //console.log(phone[i] + "STEF3");    
                     
                    Link = getFields(formedArr, "Website");
                    //console.log(Link[i] + "STEF5");

                    other = getFields(formedArr, "other");
                    //console.log(other[i] + "STEF4");

                    var G247 = "<img src='libs/icons/MABS.png' style='width:40px;height:40px;'>'" ;

                    if (other[i] == ""){
                        extraText = "<a href='" + Link[i] + "' target='_blank'>" + G247 +"</a><br>"+FNresult[i]+"<br>"+"<br>"+What[i]+"<br>"+Address[i]+"<br>"+phone[i]+"<br>";
                    } else {
                        extraText = "<a href='" + Link[i] + "' target='_blank'>" + G247 +"</a><br>"+FNresult[i]+"<br>"+What[i]+"<br>"+Address[i]+"<br>"+phone[i]+"<br>"+other[i]+"<br>";
                    };

                    if(varX[i] != undefined){getMABSLatLon(varX[i], varY[i], FNresult[i], other[i])}

                    //console.log(FNresult, LNresult, EIRresult);
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

  
  function getMABSLatLon(thisLat, thisLng, MABSname, other){
    console.log(MABSname + "mark");
        var MABSDatashow =
        {
          'maxWidth': '400',
          'className' : 'MABS-popup'
        }              

            MABSIcon = L.icon({
                iconUrl: 'libs/icons/MABS247.png',
                iconSize: [35, 35],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
            });

            MABS2Icon = L.icon({
                iconUrl: 'libs/icons/MABS.png',
                iconSize: [35, 35],
              //    iconAnchor: [22, 94],
              //    popupAnchor: [-3, -76],
              //    shadowUrl: 'my-icon-shadow.png',
              //    shadowSize: [68, 95],
              //    shadowAnchor: [22, 94]
            });
            console.log("hhh" + extraText)
            if (other == "24/7"){
                var MABSMarker = L.marker([thisLat, thisLng], {icon: MABSIcon}).addTo(MABSMarkers)
            } else {
                var MABSMarker = L.marker([thisLat, thisLng], {icon: MABS2Icon}).addTo(MABSMarkers)
            };                  
                //var MABSMarker = L.marker([thisLat, thisLng], {icon: MABSIcon}).addTo(MABSMarkers)


//            var OPmarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBMMarkers)
        var markerPopup = MABSMarker.bindPopup(extraText, MABSDatashow)

        varTooltip = MABSname;
        //if (Pets == "Yes"){
        //    varTooltip += "  " + "<img src='libs/icons/dog.png' width='20' />"
        //}
        //if (Smoker == "Yes"){
        //    varTooltip += "<img src='libs/icons/smoker.png' width='20' />"
        //}            
         
        markerPopup = MABSMarker.bindTooltip(varTooltip);
        markerPopup = MABSMarker.on('mouseover', showHideTooltip);
        //OPMarker.on('mouseover', customTip(FNresult+ ' ' + LNresult));
        //markerPopup.addTo(map)   
        //map.closePopup();       

        //console.log(data);
      }
