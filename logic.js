var EquakeQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function markerSize(mags) {
    return mags *18000;
};


var earthquakes = new L.LayerGroup();

d3.json(EquakeQuery, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circle(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.4,
                color: 'dark gray'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }

        
    }).addTo(earthquakes);
    createMap(earthquakes);
});





function Color(mags) {
    if (mags > 4.5) {
        return 'red'
    } else if (mags > 2.5) {
        return 'orange'
      } else if (mags > 1.0) {
        return 'yellow'
    }  else {
        return 'blue'
    }
};

function createMap() {

   

  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });

    var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    


    var baseLayers = {
      "Satellite": satelliteMap ,  
      "Street": streetMap,
        "Dark": darkMap, 
        
    };

    var overlays = {
        "Earthquakes": earthquakes,
            };

    var mymap = L.map('map', {
        center: [40.7, -73.95],
        zoom: 4,
        layers: [satelliteMap, earthquakes]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
   
}

