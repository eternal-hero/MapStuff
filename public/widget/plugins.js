document.writeln(
  "<script src='https://unpkg.com/realm-web@0.8.0/dist/bundle.iife.js'></script>"
);
document.writeln(
  "<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.js'></script>"
);

var link = document.createElement("link");
link.href = "https://api.tiles.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var link2 = document.createElement("link");
link2.href =
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css";
link2.rel = "stylesheet";
link2.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(link2);

// update to link3.href = "https://cdn.gangnam.club/widget/mapbox.css"; on live
// update to link3.href = "http://localhost:3000/widget/mapbox.css"; on local
var link3 = document.createElement("link");
link3.href = "https://cdn.gangnam.club/widget/mapbox.css";
link3.rel = "stylesheet";
link3.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(link3);

var script1 = document.createElement("script");
script1.src =
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.min.js";
document.getElementsByTagName("head")[0].appendChild(script1);

var script2 = document.createElement("script");
script2.src = "https://npmcdn.com/@turf/turf/turf.min.js";
document.getElementsByTagName("head")[0].appendChild(script2);

var script3 = document.createElement("script");
script3.src =
  "https://api.mapbox.com/mapbox.js/plugins/geojson-extent/v1.0.0/geojson-extent.js";
document.getElementsByTagName("head")[0].appendChild(script3);

var script4 = document.createElement("script");
script4.src =
  "https://api.mapbox.com/mapbox.js/plugins/geo-viewport/v0.4.1/geo-viewport.js";
document.getElementsByTagName("head")[0].appendChild(script4);
