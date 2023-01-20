// var plugins = document.createElement("script");
// plugins.src = "http://localhost:3000/widget/plugins.js";

// document.getElementsByTagName("head")[0].appendChild(plugins);

// map.style.height = "500px";

// console.log(document.getElementsByTagName("head")[0]);

// document.getElementById("main").appendChild(div);

const app_id = document
  .querySelector('script[data-id="dev-store-locator-react"][data-app]')
  .getAttribute("data-app");

const api_key = document
  .querySelector('script[data-id="dev-store-locator-react"][data-key]')
  .getAttribute("data-key");

const app = new Realm.App({ id: "mapstuff-ukaxa" });

/* This will let you use the .remove() function later on */
if (!("remove" in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

async function loginApiKey(apiKey) {
  // Create an API Key credential
  const credentials = Realm.Credentials.apiKey(apiKey);
  try {
    // Authenticate the user
    const user = await app.logIn(credentials);
    // `App.currentUser` updates to match the logged in user
    return user;
  } catch (err) {
    console.error("Failed to log in", err);
  }
}

//function for changing the marker value
// Params: marker and color
function setMarkerColorValue(marker, color) {
  if (!!marker) {
    let markerElement = marker.getElement();
    markerElement
      .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
      .setAttribute("fill", color);
    marker._color = color;
  }
}

async function getMapboxApiKey() {
  const graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`;
  const accessToken = (await loginApiKey(api_key)).accessToken;

  const response = await fetch(graphql_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
            query {
                app(query: {_id: "${app_id}"}) {
                   map_api_key
                 }
               }
            `,
    }),
  });

  const json = await response.json();

  return json.data.app.map_api_key;
}

async function getStoreLocations() {
  const graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`;
  const accessToken = (await loginApiKey(api_key)).accessToken;
  // const mapbox_api_key = await getMapboxApiKey();
  const response = await fetch(graphql_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `query { locations (query:{app_id:"${app_id}",status: "Published"}, limit:0){ name geometry { coordinates type } properties { address city phone url postalCode email phone state country } tags } }`,
    }),
  });

  const json = await response.json();

  var stores = {
    type: "FeatureCollection",
    features: json?.data?.locations?.map((feature) => ({
      properties: {
        phone: feature.properties.phone,
        city: feature.properties.city,
        address: feature.properties.address,
        name: feature.name,
        email: feature.properties.email,
        url: feature.properties.url,
        state: feature.properties.state,
        postalCode: feature.properties.postalCode,
        country: feature.properties.country,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(feature.geometry.coordinates[1]),
          parseFloat(feature.geometry.coordinates[0]),
        ],
      },
      tags: feature.tags,
    })),
  };
  return stores;
}

async function getApp() {
  const graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`;
  const accessToken = (await loginApiKey(api_key)).accessToken;

  const response = await fetch(graphql_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `query { app (query:{_id:"${app_id}"}){ _id app_url map_api_key map_zoom map_style map_height map_header mapbox_language filter_button map_center heading_background_color marker_icon marker_color font_color_1 filters{ tags title  } } } `,
    }),
  });

  const json = await response.json();
  return json.data.app;
}

async function generateMap() {
  console.log('asdadassa')
  var activeMarkers = [];
  /* CD (EV on 20200204): get store loactions*/
  const stores = await getStoreLocations();
  /* CD (EV on 20200204): get app for map settings*/
  const app = await getApp();

  /* CD (EV on 20200219): generate map html element*/
  var sidebar = document.createElement("div");
  sidebar.className = "sidebar w-full lg:w-1/3";
  sidebar.id = "mapstuff-listings";
  document.getElementById("map-mapstuff").appendChild(sidebar);

  document.getElementById("map-mapstuff").className = "";

  var heading = document.createElement("div");
  heading.className = "mapstuff heading";
  heading.id = "mapstuff-heading";
  heading.innerHTML = `<h1>${app?.map_header || "Our locations"}</h1>`;
  sidebar.appendChild(heading);
  var filter = document.createElement("div");
  filter.className = "filter";
  filter.id = "mapstuff-filter";

  sidebar.appendChild(filter);

  var listings = document.createElement("div");
  listings.className = "listings";
  listings.id = "listings";
  listings.style.padding = 0;
  sidebar.appendChild(listings);

  var map = document.createElement("div");
  map.id = "mapstuff-map";

  var filterButton = document.createElement("button");
  filterButton.className = "filter-button";
  filterButton.id = "mapstuff-filter-btn";
  filterButton.innerHTML = app?.filter_button || "Show Filters";

  const toggleFilterButton = (e) => {
    var mapboxFilterMenu = document.getElementById("mapstuff-map-filter-box");
    mapboxFilterMenu.style.zIndex = 99999;
    if (mapboxFilterMenu.style.display === "none") {
      const width = window.innerWidth;
      if (width < 1024) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
      mapboxFilterMenu.style.display = "block";
    } else {
      mapboxFilterMenu.style.display = "none";
    }
  };

  filterButton.addEventListener("click", toggleFilterButton);

  filter.appendChild(filterButton);

  if (stores.features.length < 1) {
    filterButton.style.display = "none";
  }

  /* CD (EV on 20210419): div of the filter */
  var z = document.createElement("div");
  /* CD (EV on 20210419): add id on the div */
  z.id = "mapstuff-map-filter-box";
  z.style.display = "none";
  /* CD (EV on 20210419): close button of the filter icon */
  var close_button = document.createElement("span");
  close_button.className = "filter-close-icon";
  close_button.id = "mapstuff-map-filter-box-close";
  close_button.style.cursor = "pointer";
  close_button.style.right = 0;

  close_button.style.position = "absolute";
  close_button.style.marginRight = "10px";

  /* CD (EV on 20210419): close the filter when click the icon */
  close_button.addEventListener("click", function (e) {
    console.log("hello");
    var mapboxFilterMenu = document.getElementById("mapstuff-map-filter-box");

    mapboxFilterMenu.style.display = "none";
  });
  /* CD (EV on 20210419): append the close button to div id ="mapboxmenufilter"*/
  z.appendChild(close_button);

  var br = document.createElement("div");
  br.style.height = "10px";
  z.appendChild(br);

  /* CD (EV on 20210419): filter checkbox*/
  app?.filters?.map((filter, index) => {
    /* CD (EV on 20210419): filter title*/
    var title = document.createElement("h3");
    title.innerHTML = filter.title;
    title.id = "mapstuff-map-filter-box-heading";
    z.appendChild(title);
    filter?.tags?.map((tag, index) => {
      var label = document.createElement("label");

      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = tag;
      input.className = "filter-checkbox";
      input.id = "mapstuff-map-filter-box-filter-checkbox";

      input.addEventListener("change", function (e) {
        const checkedBoxes = document.querySelectorAll(
          "input[class=filter-checkbox]:checked"
        );
        let tags = [];
        for (var checkbox of checkedBoxes) {
          tags.push(checkbox.value);
        }

        /**
         * Rebuild the listings:
         * Remove the existing listings and build the location
         * list again using the newly sorted stores.
         */
        var listings = document.getElementById("listings");
        while (listings.firstChild) {
          listings.removeChild(listings.firstChild);
        }

        activeMarkers.forEach(function (marker) {
          marker.remove();
        });

        let checker = (arr, target) => target.every((v) => arr.includes(v));

        var tempStores = stores;
        /* CD (EV on 20210419): new features //filter function */
        var newFeatures = tempStores.features.filter(function (feature) {
          return checker(feature.tags, tags);
        });

        /* CD (EV on 20210419): recreate stores */
        var newStores = {
          type: "FeatureCollection",
          features: newFeatures,
        };

        /* CD (EV on 20210419): regenerate markers*/
        function addMarkers(stores) {
          /* For each feature in the GeoJSON object above: */
          stores.features.forEach(function (marker) {
            /* Create a div element for the marker. */
            var el = document.createElement("div");
            /* Assign a unique `id` to the marker. */
            el.id = "marker-" + marker.properties.id;
            /* Assign the `marker` class to each marker for styling. */
            el.className = "marker";
            // el.style.backgroundImage = "url(" + map_location_icon + ")";

            /**
             * Create a marker using the div element
             * defined above and add it to the map.
             **/
            const marker1 = new mapboxgl.Marker({ offset: [0, -23] })
              .setLngLat(marker.geometry.coordinates)
              .addTo(map);

            setMarkerColorValue(marker1, app.marker_color);
            activeMarkers.push(marker1);
            /**
             * Listen to the element and when it is clicked, do three things:
             * 1. Fly to the point
             * 2. Close all other popups and display popup for clicked store
             * 3. Highlight listing in sidebar (and remove highlight for all other listings)
             **/
            marker1.getElement().addEventListener("click", function (e) {
              flyToStore(marker);
              createPopUp(marker);
              var activeItem = document.getElementsByClassName("active");

              e.stopPropagation();
              if (activeItem[0]) {
                activeItem[0].classList.remove("active");
              }
              var listing = document.getElementById(
                "listing-" + marker.properties.id
              );
              listing.classList.add("active");
            });
          });
        }

        buildLocationList(newStores);
        activeMarkers = [];
        addMarkers(newStores);
        var activeItem = document.getElementsByClassName("active");

        /* CD (EV on 20210419): remove current selected pop up*/
        var popUps = document.getElementsByClassName("mapboxgl-popup");

        if (popUps[0]) popUps[0].remove();
      });

      label.appendChild(input);
      label.id = "mapstuff-map-filter-box-filter-label";

      var labelText = document.createElement("span");
      labelText.innerHTML = tag;
      labelText.style.paddingLeft = "10px";

      label.appendChild(labelText);

      z.appendChild(label);
      var br = document.createElement("br");
      z.appendChild(br);
    });
  });

  map.appendChild(z);

  document.getElementById("map-mapstuff").appendChild(map);

  /* CD (EV on 20200204): change height of map*/
  document.getElementById("mapstuff-map").style.height = app.map_height + "px";
  document.getElementById("mapstuff-map").className = "w-full lg:w-2/3";
  /* CD (EV on 20200204): change height of sidebar*/
  document.getElementById("mapstuff-listings").style.height =
    app.map_height + "px";
  /* CD (EV on 20200204): change backgroundd of heading*/
  // document.getElementById("mapstuff-heading").style.backgroundColor =
  //   app.heading_background_color;
  document.getElementById("mapstuff-heading").style.backgroundColor =
    app.heading_background_color;
  // console.log(document.getElementById("mapstuff-heading"))

  mapboxgl.accessToken = await getMapboxApiKey();
  /**
   * Add the map to the page
   */
  var map = new mapboxgl.Map({
    container: "mapstuff-map",
    style: `mapbox://styles/mapbox/${app.map_style}`, // stylesheet location
    center: [app.map_center[1], app.map_center[0]],
    zoom: app.map_zoom,
  });

  // Calculate a bounding box in west, south, east, north order.

  /* CD (EV on 20200204): declare geojson stores*/

  // Calculate a bounding box in west, south, east, north order.
  // var bounds = geojsonExtent(stores);
  /**
   * Assign a unique id to each store. You'll use this `id`
   * later to associate each point on the map with a listing
   * in the sidebar.
   */
  let hasTags = false;

  stores.features.forEach(function (store, i) {
    store.properties.id = i;
    if (store?.tags?.length > 0) {
      hasTags = true;
    }
  });

  if (!hasTags) {
    filterButton.style.display = "none";
    filter.style.display = "none";
  }

  listings.style.height = `${app.map_height - getOtherElementHeight()}px`;

  // console.log(stores);
  // /* CD (EV on 20200204): Calculate a bounding box in west, south, east, north order*/
  // var bounds = await geojsonExtent(stores);

  /**
   * Wait until the map loads to make changes to the map.
   */
  map.on("load", function (e) {
    /**
     * This is where your '.addLayer()' used to be, instead
     * add only the source without styling a layer
     */
    map.addSource("places", {
      type: "geojson",
      data: stores,
    });
    const mapbox_language = app?.mapbox_language || "en";

    map.setLayoutProperty("country-label", "text-field", [
      "get",
      `name_${mapbox_language}`,
    ]);
    map.setLayoutProperty("state-label", "text-field", [
      "get",
      `name_${mapbox_language}`,
    ]);
    map.setLayoutProperty("settlement-label", "text-field", [
      "get",
      `name_${mapbox_language}`,
    ]);
    map.setLayoutProperty("settlement-subdivision-label", "text-field", [
      "get",
      `name_${mapbox_language}`,
    ]);

    /**
     * Create a new MapboxGeocoder instance.
     */
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      // bbox: bounds,
    });

    /**
     * Add all the things to the page:
     * - The location listings on the side of the page
     * - The search box (MapboxGeocoder) onto the map
     * - The markers onto the map
     */
    buildLocationList(stores);
    map.addControl(geocoder, "top-left");
    addMarkers();

    /**
     * Listen for when a geocoder result is returned. When one is returned:
     * - Calculate distances
     * - Sort stores by distance
     * - Rebuild the listings
     * - Adjust the map camera
     * - Open a popup for the closest store
     * - Highlight the listing for the closest store.
     */
    geocoder.on("result", function (ev) {
      /* Get the coordinate of the search result */
      var searchResult = ev.result.geometry;

      /**
       * Calculate distances:
       * For each store, use turf.disance to calculate the distance
       * in miles between the searchResult and the store. Assign the
       * calculated value to a property called `distance`.
       */
      var options = { units: "miles" };
      stores.features.forEach(function (store) {
        Object.defineProperty(store.properties, "distance", {
          value: turf.distance(searchResult, store.geometry, options),
          writable: true,
          enumerable: true,
          configurable: true,
        });
      });

      /**
       * Sort stores by distance from closest to the `searchResult`
       * to furthest.
       */
      stores.features.sort(function (a, b) {
        if (a.properties.distance > b.properties.distance) {
          return 1;
        }
        if (a.properties.distance < b.properties.distance) {
          return -1;
        }
        return 0; // a must be equal to b
      });

      geocoder.clear();
      // save marker in the state
      var marker1 = new mapboxgl.Marker({})
        .setLngLat(ev.result.center)
        .addTo(map);
      setMarkerColorValue(marker1, app.marker_color);

      activeMarkers.push(marker1);
      /**
       * Rebuild the listings:
       * Remove the existing listings and build the location
       * list again using the newly sorted stores.
       */
      var listings = document.getElementById("listings");
      while (listings.firstChild) {
        listings.removeChild(listings.firstChild);
      }
      buildLocationList(stores);

      /* Open a popup for the closest store. */
      createPopUp(stores.features[0]);

      /** Highlight the listing for the closest store. */
      var activeListing = document.getElementById(
        "listing-" + stores.features[0].properties.id
      );
      activeListing.classList.add("active");

      /**
       * Adjust the map camera:
       * Get a bbox that contains both the geocoder result and
       * the closest store. Fit the bounds to that bbox.
       */
      var bbox = getBbox(stores, 0, searchResult);
      map.fitBounds(bbox, {
        padding: 100,
      });
    });
  });

  /**
   * Using the coordinates (lng, lat) for
   * (1) the search result and
   * (2) the closest store
   * construct a bbox that will contain both points
   */
  function getBbox(sortedStores, storeIdentifier, searchResult) {
    var lats = [
      sortedStores.features[storeIdentifier].geometry.coordinates[1],
      searchResult.coordinates[1],
    ];
    var lons = [
      sortedStores.features[storeIdentifier].geometry.coordinates[0],
      searchResult.coordinates[0],
    ];
    var sortedLons = lons.sort(function (a, b) {
      if (a > b) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });
    var sortedLats = lats.sort(function (a, b) {
      if (a > b) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });
    return [
      [sortedLons[0], sortedLats[0]],
      [sortedLons[1], sortedLats[1]],
    ];
  }

  /**
   * Add a marker to the map for every store listing.
   **/
  function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    stores.features.forEach(function (marker) {
      /* Create a div element for the marker. */
      var el = document.createElement("div");
      /* Assign a unique `id` to the marker. */
      el.id = "marker-" + marker.properties.id;
      /* Assign the `marker` class to each marker for styling. */
      el.className = "marker";
      // el.style.backgroundImage = "url(" + app.marker_icon + ")";
      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      const marker1 = new mapboxgl.Marker({ offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      setMarkerColorValue(marker1, app.marker_color);
      activeMarkers.push(marker1);
      /**
       * Listen to the element and when it is clicked, do three things:
       * 1. Fly to the point
       * 2. Close all other popups and display popup for clicked store
       * 3. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      marker1.getElement().addEventListener("click", function (e) {
        flyToStore(marker);
        createPopUp(marker);
        var activeItem = document.getElementsByClassName("active");
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        var listing = document.getElementById(
          "listing-" + marker.properties.id
        );
        listing.classList.add("active");
      });
    });
  }

  /**
   * Add a listing for each store to the sidebar.
   **/
  function buildLocationList(data) {
    data.features.forEach(function (store, i) {
      /**
       * Create a shortcut for `store.properties`,
       * which will be used several times below.
       **/
      var prop = store.properties;
      var tags = store.tags;
      /* Add a new listing section to the sidebar. */
      var listings = document.getElementById("listings");
      var listing = listings.appendChild(document.createElement("div"));
      /* Assign a unique `id` to the listing. */
      listing.id = "listing-" + prop.id;
      /* Assign the `item` class to each listing for styling. */
      listing.className = "item";

      /* Add the link to the individual listing created above. */
      var link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.id = "link-" + prop.id;
      link.innerHTML = prop.name ? prop.name : "no location name";
      /*font color 1 */
      if (app.font_color_1) {
        link.style.color = app.font_color_1;
      }
  
      /* CD (EV on 20200204): Add details to the individual listing. */
      var details = listing.appendChild(document.createElement("div"));
      {
        prop.address
          ? (details.innerHTML =
              "<div id='mapstuff-listing-address'>" + prop.address + "</div> ")
          : null;
      }
      details.innerHTML +=
        "<span id='mapstuff-listing-city'>" + prop.city + "</span>, ";
      details.innerHTML +=
        "<span id='mapstuff-listing-state'>" + prop.state + "</span> ";
      details.innerHTML +=
        "<span id='mapstuff-listing-postal-code'>" +
        prop.postalCode +
        "</span>";
      details.innerHTML +=
        "<div id='mapstuff-listing-country'>" + prop.country + "</div>";
      if (prop.phone) {
        details.innerHTML +=
          "<a href='tel:" + prop.phone + "' id='mapstuff-listing-phone' target='_blank'>" + prop.phone + "</a></br>";
      }
      if (prop.url) {
        details.innerHTML +=
          "<a href='" + prop.url + "' id='mapstuff-listing-url' target='_blank'>" + prop.url + "</a></br>";
      }
      if (prop.email) {
        details.innerHTML +=
          "<a href='mailto:" + prop.email +  "' id='mapstuff-listing-email' target='_blank'>" + prop.email + "</a></br>";
      }
      if (tags) {
        /* update on styles\mapbox.css find filter-badge*/
        details.innerHTML += "<br>";
        for (var i = 0; i < tags.length; i++) {
          details.innerHTML +=
            "<span class='filter-badge' id='mapstuff-listing-tag'><small>" +
            tags[i] +
            "</small></span>";
        }
      }
      if (prop.distance) {
        var roundedDistance = Math.round(prop.distance * 100) / 100;
        details.innerHTML +=
          "<p><strong>" + roundedDistance + " miles away</strong></p>";
      }

      /**
       * Listen to the element and when it is clicked, do four things:
       * 1. Update the `currentFeature` to the store associated with the clicked link
       * 2. Fly to the point
       * 3. Close all other popups and display popup for clicked store
       * 4. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      link.addEventListener("click", function (e) {
        for (var i = 0; i < data.features.length; i++) {
          if (this.id === "link-" + data.features[i].properties.id) {
            var clickedListing = data.features[i];
            flyToStore(clickedListing);
            createPopUp(clickedListing);
          }
        }
        var activeItem = document.getElementsByClassName("active");
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        this.parentNode.classList.add("active");
      });
    });
  }

  /**
   * Use Mapbox GL JS's `flyTo` to move the camera smoothly
   * a given center point.
   **/
  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15,
    });
  }

  /**
   * Create a Mapbox GL JS `Popup`.
   **/
  function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<h3 id="mapstuff-popup-name">${currentFeature.properties.name}</h3>
<div>
  <span className="mapstuff-popup-container">
    ${
      !!currentFeature.properties.address
        ? `<span id="mapstuff-popup-address"> ${currentFeature.properties.address} </span> <br />`
        : ""
    }
    <span id="mapstuff-popup-city"> ${
      currentFeature.properties.city
    }</span>, <span id="mapstuff-popup-state"> ${
          currentFeature.properties.state
        } ${currentFeature.properties.postalCode} </span>
    <br />
    <span> ${currentFeature.properties.country}</span>
    <br />
    ${
      !!currentFeature.properties.phone
        ? ` <a href="tel::${currentFeature.properties.phone}" target="_blank" id="mapstuff-popup-phone" style="word-break:break-all">${currentFeature.properties.phone} </a> <br />`
        : ""
    }
    ${
      !!currentFeature.properties.url
        ? ` <a href="${currentFeature.properties.url}" target="_blank" id="mapstuff-popup-url" style="word-break:break-all">${currentFeature.properties.url} </a> <br />`
        : ""
    }
    ${
      !!currentFeature.properties.email
        ? `<a href="mailto:${currentFeature.properties.email}" target="_blank" id="mapstuff-popup-email" style="word-break:break-all">${currentFeature.properties.email} </a> <br />`
        : ""
    }

  </span>
  </div>`
      )
      .addTo(map);

    var x = document.getElementsByClassName("mapboxgl-popup-content")[0];
    x.querySelectorAll("h3")[0].style.backgroundColor =
      app.heading_background_color;
  }
}

const getOtherElementHeight = () => {
  const filterHeight =
    document.getElementById("mapstuff-filter")?.clientHeight || 0;
  const headingHeight =
    document.getElementById("mapstuff-heading")?.clientHeight || 0;
  return filterHeight + headingHeight;
};

generateMap();
