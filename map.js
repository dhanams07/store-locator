
// This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
    };
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiaW50ZW50dGVjaGRoYW5hIiwiYSI6ImNrMXZyOG9ibTBxd2EzZW9qdm13M2twY2gifQ.h2KVF4_L_SVemMT82IRVLw';

  // This adds the map
  var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    style: 'mapbox://styles/mapbox/streets-v11',
    // initial position in [long, lat] format
    center: [67.1484375, 15.71859032558816],
    // initial zoom
    zoom: 2,
    scrollZoom: false
  });

  var layerList = document.getElementById('menu');
  var inputs = layerList.getElementsByTagName('input');
 
  function switchLayer(layer) {
  var layerId = layer.target.id;
  map.setStyle('mapbox://styles/mapbox/' + layerId);
  };
   
  for (var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer;
  };

  var stores = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            80.27106195688248,
            13.057701089467892
          ]
        },
        "properties": {
          "phoneFormatted": "+91-44-2848 2069<br>+91-98407 54707, 86080 02222",
          "phone": "+91-44-2848 2069<br>+91-98407 54707, 86080 02222",
          "address": "80, Devarajan Mudali St,<br>Royapettah, Chennai-600 014<br>Tamil Nadu, India",
          "city": "Chennai"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            72.85805314779282,
            19.10861071765276
          ]
        },
        "properties": {
          "phoneFormatted": "+91-22-2839 7380<br>+91-98676 51339",
          "phone": "+91-22-2839 7380<br>+91-98676 51339",
          "address": "Room No.2, Chakala Masjid Compound,<br>Opp.adarsh Apartments,<br>Sahar Road chakala<br>Andheri East, Mumbai - 400 099<br> India",
          "city": "Mumbai"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            77.13529944419861,
            28.538630847072124
          ]
        },
        "properties": {
          "phoneFormatted": "+91-11-2678 1738<br>+91-87459 65825",
          "phone": "+91-11-2678 1738<br>+91-87459 65825",
          "address": "No.15, Shop No.02 Near Army Gate,<br>Masjid Compund Mahipalpur Extension<br>New Delhi – 110 037<br> India",
          "city": "Delhi"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            103.85504990816116,
            1.3081230586394061
          ]
        },
        "properties": {
          "phoneFormatted": "+65-6396 6770<br>+65-8113 9193",
          "phone": "+65-6396 6770<br>+65-8113 9193",
          "address": "BLK 640, Rowell Road #01-54<br>Singapore - 200 640",
          "city": "Singapore"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            101.69793695211409,
            3.1523455615701135
          ]
        },
        "properties": {
          "phoneFormatted": "+60-3269 11418<br>+60-1690 08497",
          "phone": "+60-3269 11418<br>+60-1690 08497",
          "address": "69 Ground Floor, Medan Bunus Off,<br>Jalan Masjid India,<br>Kuala Lumpur - 50100<br>",
          "city": "Malaysia"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            55.30249089002609,
            25.272444294819508
          ]
        },
        "properties": {
          "phoneFormatted": "+60-3269 11418<br>+60-1690 08497",
          "phone": "COURIER:<br>+971-4-355 67 67, +971 55 827 3836<br>CARGO:<br>+971-4-273 7176, +971 50 695 5387",
          "address": "Al Sabkha Road,<br>Deira-Dubai<br>",
          "city": "Dubai"
        }
      }]
    };
  // This adds the data to the map
  map.on('load', function (e) {
    // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
    map.addSource("places", {
      "type": "geojson",
      "data": stores
    });
    // Initialize the list
    buildLocationList(stores);

  });

  // This is where your interactions with the symbol layer used to be
  // Now you have interactions with DOM markers instead
  stores.features.forEach(function(marker, i) {
    // Create an img element for the marker
    var el = document.createElement('div');
    el.id = "marker-" + i;
    el.className = 'marker';
    // Add markers to the map at all points
    new mapboxgl.Marker(el, {offset: [0, -23]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

    el.addEventListener('click', function(e){
        // 1. Fly to the point
        flyToStore(marker);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(marker);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');

        e.stopPropagation();
        if (activeItem[0]) {
           activeItem[0].classList.remove('active');
        }

        var listing = document.getElementById('listing-' + i);
        listing.classList.add('active');

    });
  });


  function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 20
      });
  }

  function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();


    var popup = new mapboxgl.Popup({closeOnClick: false})
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML('<h3>Indian Courier Services</h3>' +
            '<h4>' + currentFeature.properties.address + '</h4>' +
            '<h4 class="mobile">' + currentFeature.properties.phone + '</h4>')
          .addTo(map);
  }


  function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      var prop = currentFeature.properties;

      var listings = document.getElementById('listings');
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = "listing-" + i;

      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.dataPosition = i;
      link.innerHTML = prop.city;

      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop.address;
      // if (prop.phone) {
      //   details.innerHTML += ' &middot; ' + prop.phoneFormatted;
      // }



      link.addEventListener('click', function(e){
        // Update the currentFeature to the store associated with the clicked link
        var clickedListing = data.features[this.dataPosition];

        // 1. Fly to the point
        flyToStore(clickedListing);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedListing);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');

        if (activeItem[0]) {
           activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');

      });
    }
  }

map.addControl(new mapboxgl.NavigationControl());

