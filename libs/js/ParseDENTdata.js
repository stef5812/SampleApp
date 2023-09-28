var iRecords = 0;

function readDENTFile(file)
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
                    var result = getFields(object, "Service name"); 
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
                extraText = '';  

                //HOSPdropdown += "<select>";
                
                let i = 0;
                
                do {
                    
                    FNresult = getFields(formedArr, "Service name");
                    //console.log(FNresult[i]);
                    Address = getFields(formedArr, "Address");
                    //console.log(Address[i]);                                    
                    //EIRresult = getFields(formedArr, "eircode");

                    varX = getFields(formedArr, "lat");
                    //console.log(varX[i] + "STEF1");    
                    varY = getFields(formedArr, "lon");
                    //console.log(varY[i] + "STEF2"); 

                    if (Link[i] != undefined){
                        //console.log("def" + Link[i])
                        extraText = "<a href='" + Link[i] + "' target='_blank'><img src='libs/icons/dentist.png' style='width:40px;height:40px;'><br>"+FNresult[i]+"<br>"+EIRresult[i]+"<br>";
                    } else {
                        //console.log("undef" + Link[i])
                        extraText = "<img src='libs/icons/dentist.png' style='width:40px;height:40px;'><br>"+FNresult[i]+"<br>"+EIRresult[i]+"<br>";
                    }                       
                    if(varX[i] != undefined){getDENTLatLon(varX[i], varY[i], FNresult[i], Address[i])}

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

  
  function getDENTLatLon(thisLat, thisLng, DENTname){
    //console.log(strSearch + "mark");
        var DENTDatashow =
        {
          'maxWidth': '400',
          'className' : 'DENT-popup'
        }              

                DENTIcon = L.icon({
                    iconUrl: 'libs/icons/dentist.png',
                    iconSize: [25, 25],
                  //    iconAnchor: [22, 94],
                  //    popupAnchor: [-3, -76],
                  //    shadowUrl: 'my-icon-shadow.png',
                  //    shadowSize: [68, 95],
                  //    shadowAnchor: [22, 94]
                });                    
                var DENTMarker = L.marker([thisLat, thisLng], {icon: DENTIcon}).addTo(DENTMarkers)


//            var OPmarker = L.marker([thisLat, thisLng], {icon: OPIcon}).addTo(OpTBMMarkers)
        var markerPopup = DENTMarker.bindPopup(extraText, DENTDatashow)

        varTooltip = DENTname;
        //if (Pets == "Yes"){
        //    varTooltip += "  " + "<img src='libs/icons/dog.png' width='20' />"
        //}
        //if (Smoker == "Yes"){
        //    varTooltip += "<img src='libs/icons/smoker.png' width='20' />"
        //}            
         
        markerPopup = DENTMarker.bindTooltip(varTooltip);
        markerPopup = DENTMarker.on('mouseover', showHideTooltip);
        //OPMarker.on('mouseover', customTip(FNresult+ ' ' + LNresult));
        //markerPopup.addTo(map)   
        //map.closePopup();       

        //console.log(data);
      }
