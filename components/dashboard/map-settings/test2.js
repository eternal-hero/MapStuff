import React, { useEffect, useState, useRef } from "react";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import AppForm from "../../../components/global/AppForm";
import AppButton from "../../../components/global/AppButton";

import { LOCATIONS_MAP_QUERY } from "../../../graphql/dashboard/[app_url]/map-settings/location.query";
import { APP_QUERY } from "../../../graphql/dashboard/[app_url]/map-settings/app.query";

import { APP_UPDATE_ONE_MUTATION } from "../../../graphql/dashboard/[app_url]/map-settings/app.mutation";
import { useQuery, useMutation } from "@apollo/client";

/* CD (EV on 20200204): import APPS_QUERY graphql */
import { APPS_QUERY } from "../../../graphql/dashboard/locations/app.query";

import { PLAN_QUERY } from "../../../graphql/dashboard/map-settings/plan.query";

import { useRouter } from "next/router";
import AppNotification from "../../global/AppNotification";

const MapSettings = (props) => {
  /* CD (EV on 20200204): declare session*/
  const { session } = props;
  /* CD (EV on 20200204): initial selected app null*/
  const [app_id, setAppId] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [appNotifContent, setAppNotifContent] = useState(null);
  const [appNotifTitle, setAppNotifTitle] = useState(null);

  const [mapStyles, setMapStyles] = useState([]);

  /* CD (EV on 20200204): query max location*/
  const { planLoading, planError, data: planData } = useQuery(PLAN_QUERY, {
    variables: {
      query: {
        price_id:
          session.user.role_id == 1
            ? process.env.STRIPE_PRICE_PLUS
            : session.user.plan.id,
      },
    },
  });

  useEffect(() => {
    if (!planLoading && planData) {
      var filteredMapStyles = planData.plansAcl.cms.mapBoxMapSettings.mapStyles.filter(
        function (item) {
          return item.enable == true;
        }
      );

      setMapStyles(filteredMapStyles);
    }
  }, [planLoading, planData]);

  const SelecApp = () => {
    var query = { created_by_id: session.user._id };
    /* CD (EV on 20200225): if admin query all apps*/
    if (session.user.role_id == 1) {
      query = null;
    }

    /* CD (EV on 20200204): fetch apps*/
    const { loading, error, data } = useQuery(APPS_QUERY, {
      variables: {
        input: query,
      },
    });

    useEffect(() => {
      if (!app_id && !loading && data) {
        /* CD (EV on 20200204): set initial selected app*/
        setAppId(data.apps[0]._id);
      }
    }, [loading, data, app_id]);

    /* CD (EV on 20200204): wait fetch apps*/
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;
    return (
      <>
        <div>
          <select
            defaultValue={app_id}
            onChange={(event) => setAppId(event.target.value)}
          >
            {data.apps.map((app) => (
              <option key={app._id} value={app._id}>
                {app.app_url}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  };
  const Settings = () => {
    /* CD (EV on 20200204): declare leaving page variables --incomplete cant trace if editing*/
    const [editing, setEditing] = useState(false);
    const router = useRouter();

    /* CD (EV on 20200204): initialize map*/
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    /* CD (EV on 20200204): initialize editable fields*/
    const [app_url, setAppUrl] = useState("");
    const [map_api_key, setMapApiKey] = useState("");
    const [map_height, setMapHeight] = useState(500);
    const [map_zoom, setMapZoom] = useState(15);
    const [map_lat, setMapLat] = useState(-77.034084);
    const [map_lng, setMapLng] = useState(38.909671);
    const [heading_background_color, setHeadingBackgroundColor] = useState(
      "#00853e"
    );
    const [font_color_1, setFontColor1] = useState("#00853e");

    const [map_location_icon, setLocationIcon] = useState(
      process.env.MAPBOX_MARKER_ICON
    );

    const [map_style, setMapStyle] = useState("");

    /* CD (EV on 20200204): fetch locations of the app*/
    const { loading, error, data } = useQuery(LOCATIONS_MAP_QUERY, {
      variables: { input: { app_id: app_id, status: "Published" } },
    });

    /* CD (EV on 20200204): fetch the app */
    const { data: dataApp, loading: loadingApp, error: errorApp } = useQuery(
      APP_QUERY,
      {
        variables: { input: { _id: app_id } },
      }
    );

    /* CD (EV on 20200204): update app map settings */
    const [
      updateApp,
      { data: mutationData, loading: mutationLoading, error: mutationError },
    ] = useMutation(APP_UPDATE_ONE_MUTATION, {
      onCompleted(data) {
        if (data.updateOneApp) {
          setIsSuccess(true);
          setAppNotifContent(
            <p>
              Your changes have been applied to your map.</a>
            </p>
          );
          setAppNotifTitle("MAP SETTINGS SAVED");
          location.reload();
        }
      },
    });

    /* CD (EV on 20200204): function to initialize the app */
    const initializeMap = ({
      setMap,
      mapContainer,
      data,
      dataApp,
      heading_background_color,
    }) => {
      /* CD (EV on 20200204): redeclare locations */
      var locations = data.locations;

      /* CD (EV on 20200204): if the app has locations  */
      if (locations.length != 0) {
        /* CD (EV on 20200204): mapped locations to usable geojson*/

        var store_locations = locations.map((feature) => ({
          type: feature.type,
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
        }));

        /* CD (EV on 20200204): declare geojson stores*/
        var stores = {
          type: "FeatureCollection",
          features: store_locations,
        };

        /** CD (EV on 20200204):
         * Assign a unique id to each store. You'll use this `id`
         * later to associate each point on the map with a listing
         * in the sidebar.
         */
        stores.features.forEach(function (store, i) {
          store.properties.id = i;
        });

        /* CD (EV on 20200204): Calculate a bounding box in west, south, east, north order*/
        var bounds = geojsonExtent(stores);

        /* CD (EV on 20200204): The size of the desired map.*/
        var size = [750, 400];

        /* CD (EV on 20200204): Calculate a zoom level and centerpoint for this map*/
        var vp = geoViewport.viewport(bounds, size, 0, 19, 512);

        /* CD (EV on 20200204): check if app has already map center settings*/
        if (dataApp.app.map_center) {
          setMapLat(dataApp.app.map_center[0]);
          setMapLng(dataApp.app.map_center[1]);
        } else {
          /* CD (EV on 20200204): if no map center create based on locations (suggested center)*/
          setMapLat(vp.center[1]);
          setMapLng(vp.center[0]);
        }
        /* CD (EV on 20200204): check if app has map settings zoom*/
        if (dataApp.app.map_zoom) {
          setMapZoom(dataApp.app.map_zoom);
        }

        /**CD (EV on 20200204):
         * Add the map to the page
         */

        var map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/" + dataApp.app.map_style, // stylesheet location
          center: dataApp.app.map_center
            ? [dataApp.app.map_center[1], dataApp.app.map_center[0]]
            : vp.center,
          zoom: dataApp.app.map_zoom ? dataApp.app.map_zoom : vp.zoom,
        });
        setMap(map);

        /**CD (EV on 20200204):
         * Wait until the map loads to make changes to the map.
         */
        map.on("load", function (e) {
          /**CD (EV on 20200204):
           * This is where your '.addLayer()' used to be, instead
           * add only the source without styling a layer
           */
          map.addSource("places", {
            type: "geojson",
            data: stores,
          });

          /**CD (EV on 20200204):
           * Create a new MapboxGeocoder instance.
           */
          var geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: true,
            bbox: bounds,
          });

          /**CD (EV on 20200204):
           * Add all the things to the page:
           * - The location listings on the side of the page
           * - The search box (MapboxGeocoder) onto the map
           * - The markers onto the map
           */
          buildLocationList(stores);
          map.addControl(geocoder, "top-left");
          addMarkers();

          /**CD (EV on 20200204):
           * Listen for when a geocoder result is returned. When one is returned:
           * - Calculate distances
           * - Sort stores by distance
           * - Rebuild the listings
           * - Adjust the map camera
           * - Open a popup for the closest store
           * - Highlight the listing for the closest store.
           */
          geocoder.on("result", function (ev) {
            /* CD (EV on 20200204): Get the coordinate of the search result */
            var searchResult = ev.result.geometry;

            /**CD (EV on 20200204):
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

            /**CD (EV on 20200204):
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

            /**CD (EV on 20200204):
             * Rebuild the listings:
             * Remove the existing listings and build the location
             * list again using the newly sorted stores.
             */
            var listings = document.getElementById("listings");
            while (listings.firstChild) {
              listings.removeChild(listings.firstChild);
            }
            buildLocationList(stores);

            /* CD (EV on 20200204): Open a popup for the closest store. */
            createPopUp(stores.features[0]);

            /** CD (EV on 20200204): Highlight the listing for the closest store. */
            var activeListing = document.getElementById(
              "listing-" + stores.features[0].properties.id
            );
            activeListing.classList.add("active");

            /**CD (EV on 20200204):
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

        /**CD (EV on 20200204):
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

        /**CD (EV on 20200204):
         * Add a marker to the map for every store listing.
         **/
        function addMarkers() {
          /*CD (EV on 20200204):  For each feature in the GeoJSON object above: */
          stores.features.forEach(function (marker) {
            /* Create a div element for the marker. */
            var el = document.createElement("div");
            /* Assign a unique `id` to the marker. */
            el.id = "marker-" + marker.properties.id;
            /* Assign the `marker` class to each marker for styling. */
            el.className = "marker";
            el.style.backgroundImage = "url(" + map_location_icon + ")";

            /**CD (EV on 20200204):
             * Create a marker using the div element
             * defined above and add it to the map.
             **/
            new mapboxgl.Marker(el, { offset: [0, -23] })
              .setLngLat(marker.geometry.coordinates)
              .addTo(map);

            /**CD (EV on 20200204):
             * Listen to the element and when it is clicked, do three things:
             * 1. Fly to the point
             * 2. Close all other popups and display popup for clicked store
             * 3. Highlight listing in sidebar (and remove highlight for all other listings)
             **/
            el.addEventListener("click", function (e) {
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

        /**CD (EV on 20200204):
         * Add a listing for each store to the sidebar.
         **/
        function buildLocationList(data) {
          data.features.forEach(function (store, i) {
            /**CD (EV on 20200204):
             * Create a shortcut for `store.properties`,
             * which will be used several times below.
             **/
            var prop = store.properties;

            /* CD (EV on 20200204): Add a new listing section to the sidebar. */
            var listings = document.getElementById("listings");
            var listing = listings.appendChild(document.createElement("div"));
            /* CD (EV on 20200204): Assign a unique `id` to the listing. */
            listing.id = "listing-" + prop.id;
            /* Assign the `item` class to each listing for styling. */
            listing.className = "item";

            /* CD (EV on 20200204): Add the link to the individual listing created above. */
            var link = listing.appendChild(document.createElement("a"));
            link.href = "#";
            link.className = "title";
            link.id = "link-" + prop.id;
            link.innerHTML = prop.name ? prop.name : "no location name";
            /* CD (EV on 20200218): check if map settings has font_color_1 if there is update it */
            if (dataApp.app.font_color_1) {
              link.style.color = dataApp.app.font_color_1;
            }

            /* CD (EV on 20200204): Add details to the individual listing. */
            var details = listing.appendChild(document.createElement("div"));
            details.innerHTML = "<small>" + prop.address + "</small> ";
            details.innerHTML += "<br><small>" + prop.city + "</small>, ";
            details.innerHTML += "<small>" + prop.state + "</small> ";
            details.innerHTML += "<small>" + prop.postalCode + "</small>";
            details.innerHTML += "<br><small>" + prop.country + "</small>";
            if (prop.phone) {
              details.innerHTML += "<br><small>" + prop.phone + "</small>";
            }
            if (prop.url) {
              details.innerHTML += "<br><small>" + prop.url + "</small>";
            }
            if (prop.email) {
              details.innerHTML += "<br><small>" + prop.email + "</small>";
            }
            if (prop.distance) {
              var roundedDistance = Math.round(prop.distance * 100) / 100;
              details.innerHTML +=
                "<p><strong>" + roundedDistance + " miles away</strong></p>";
            }

            /**CD (EV on 20200204):
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

        /**CD (EV on 20200204):
         * Use Mapbox GL JS's `flyTo` to move the camera smoothly
         * a given center point.
         **/
        function flyToStore(currentFeature) {
          map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 15,
          });
        }

        /**CD (EV on 20200204):
         * Create a Mapbox GL JS `Popup`.
         **/

        function createPopUp(currentFeature) {
          var popUps = document.getElementsByClassName("mapboxgl-popup");
          if (popUps[0]) popUps[0].remove();

          var popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(currentFeature.geometry.coordinates)
            .setHTML(
              "<h3>" +
                currentFeature.properties.name +
                "</h3>" +
                "<small>" +
                currentFeature.properties.address +
                "</small>" +
                "<br><small>" +
                currentFeature.properties.city +
                "</small>, " +
                "<small>" +
                currentFeature.properties.state +
                " " +
                currentFeature.properties.postalCode +
                "</small>" +
                "<br><small>" +
                currentFeature.properties.country +
                "</small>"
            )
            .addTo(map);
          /* CD (EV on 20200218): override popup content */
          var x = document.getElementsByClassName("mapboxgl-popup-content")[0];

          x.querySelectorAll("h3")[0].style.backgroundColor =
            dataApp.app.heading_background_color;
        }
      } else {
        if (dataApp.app.map_zoom) {
          /* CD (EV on 20200204): set zoom value to form field*/
          setMapZoom(dataApp.app.map_zoom);
        }
        if (dataApp.app.map_center) {
          /* CD (EV on 20200204): set latitude to form field*/
          setMapLat(dataApp.app.map_center[0]);
          /* CD (EV on 20200204): set longitude to form field*/
          setMapLng(dataApp.app.map_center[1]);
        }
        /**CD (EV on 20200204):
         * Create map with no location
         **/
        var map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/" + dataApp.app.map_style, // stylesheet location
          center: dataApp.app.map_center
            ? [dataApp.app.map_center[1], dataApp.app.map_center[0]]
            : [map_lat, map_lng],
          zoom: dataApp.app.map_zoom ? dataApp.app.map_zoom : map_zoom,
        });
        setMap(map);
      }
    };

    /**CD (EV on 20200204):
     * Form fields
     **/
    const FormInput = [
      {
        type: "text",
        label: "App Url",
        value: app_url,
        handleInput: (event) => {
          setAppUrl(event.target.value);
          setEditing(true);
        },
      },
      {
        type: "password",
        label: "Api Key",
        value: map_api_key,
        handleInput: (event) => {
          setMapApiKey(event.target.value);
          setEditing(true);
        },
      },
      {
        type: "radio",
        label: "Lorem ipsum",
        /* CD (EV on 20200204): array of object on opstions of dropdown*/
        items: mapStyles,
        /* CD (EV on 20200204): set the selected object*/
        value: map_style,
        handleInput: (event) => {
          /* CD (EV on 20200204): array of object on opstions of dropdown*/
          setMapStyle(event.target.value);
        },
      },
      {
        type: "text",
        label: "Map Height",
        value: map_height,
        handleInput: (event) => {
          setMapHeight(event.target.value);
          setEditing(true);
          map.resize();
        },
      },
      {
        type: "text",
        label: "Map Zoom",
        value: map_zoom,
        handleInput: (event) => {
          setMapZoom(event.target.value);
          setEditing(true);
        },
      },
      {
        type: "text",
        label: "Map Latitude",
        value: map_lat,
        handleInput: (event) => {
          setMapLat(event.target.value);
          setEditing(true);
        },
      },
      {
        type: "text",
        label: "Map Longitude",
        value: map_lng,
        handleInput: (event) => {
          setMapLng(event.target.value);
          setEditing(true);
        },
      },
      {
        type: "color",
        label: "Heading Background Color",
        value: heading_background_color,
        handleInput: (event) => {
          setHeadingBackgroundColor(event.target.value);
          setEditing(true);

          var x = document.getElementsByClassName("mapboxgl-popup-content")[0];
          if (x) {
            x.querySelectorAll("h3")[0].style.backgroundColor =
              event.target.value;
          }
        },
      },
      {
        type: "color",
        label: "Font Color 1",
        value: font_color_1,
        handleInput: (event) => {
          var tags = document.getElementsByClassName("title");

          for (var i = 0; i < tags.length; i++) {
            tags[i].style.color = event.target.value;
          }

          // x[0].style.color = event.target.value;
          setFontColor1(event.target.value);
          setEditing(true);
        },
      },
      // {
      //   type: "text",
      //   label: "Icon",
      //   value: map_location_icon,
      //   handleInput: (event) => {
      //     setLocationIcon(event.target.value), setEditing(true);
      //   },
      // },
    ];

    useEffect(() => {
      /* CD (EV on 20200204): add accessToken to mapboxgl */
      mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

      if (!map && !loading && data.locations && !loadingApp && dataApp) {
        setAppUrl(dataApp.app.app_url);
        setMapApiKey(dataApp.app.map_api_key);

        /* CD (EV on 20200204): set map height from apps collection  (map settings)*/
        if (dataApp.app.map_height) {
          setMapHeight(parseInt(dataApp.app.map_height));
        }
        /* CD (EV on 20200204): set sidebase heading color from apps collection  (map settings)*/
        if (dataApp.app.heading_background_color) {
          setHeadingBackgroundColor(dataApp.app.heading_background_color);
        }
        if (dataApp.app.map_style) {
          setMapStyle(dataApp.app.map_style);
        } else {
          setMapStyle("streets-v11");
        }

        /* CD (EV on 20200204): check if app has font_color_1*/
        if (dataApp.app.font_color_1) {
          setFontColor1(dataApp.app.font_color_1);
        }
        /* CD (EV on 20200204): initialize the Map*/
        initializeMap({
          setMap,
          mapContainer,
          data,
          dataApp,
          heading_background_color,
        });
      }

      /* CD (EV on 20200204): check if map is existing*/
      if (map) {
        /* CD (EV on 20200204): resize the map*/
        map.resize();
        /* CD (EV on 20200204): when zoom in or out*/
        map.on("zoom", function () {
          /* CD (EV on 20200204): get zoom value*/
          var zoom = map.getZoom();
          /* CD (EV on 20200204): set zoom value to form field*/
          setMapZoom(zoom);

          /* CD (EV on 20200204): get center of the map*/
          var center = map.getCenter();
          /* CD (EV on 20200204): set latitude to form field*/
          setMapLat(center.lat);
          /* CD (EV on 20200204): set longitude to form field*/
          setMapLng(center.lng);
        });

        /* CD (EV on 20200204): when map is dragged*/
        map.on("dragend", function () {
          /* CD (EV on 20200204): get center of the map*/
          var center = map.getCenter();
          /* CD (EV on 20200204): set latitude to form field*/
          setMapLat(center.lat);
          /* CD (EV on 20200204): set longitude to form field*/
          setMapLng(center.lng);
        });
      }

      /* CD (EV on 20200204): leaving page handler --incomplete cant trace if editing*/
      const handleRouteChange = (url) => {
        if (window.confirm("Are you sure you want to leave?"))
          console.log("leaving page..");
        else {
          router.events.emit("routeChangeError");
          throw "routeChange aborted.";
        }
      };

      router.events.on("routeChangeStart", handleRouteChange);
      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
      };
      // If the component is unmounted, unsubscribe
      // from the event with the `off` method:
    }, [map, loading, data, loadingApp, dataApp, editing]);

    /* CD (EV on 20200204): resize map when height is updated*/
    function updateMap() {
      map.resize();
    }

    /* CD (EV on 20200204): reinitialize the map when icon is changed*/
    function updateIcon() {
      initializeMap({ setMap, mapContainer, data, dataApp });
    }

    /* CD (EV on 20200204): save map settings*/
    const saveSettings = () => {
      /* CD (EV on 20200204): query variable*/
      var query = {
        _id: dataApp.app._id,
      };
      /* CD (EV on 20200204): set variable */
      var set = {
        app_url: app_url,
        map_api_key: map_api_key,
        map_height: String(map_height),
        map_zoom: String(map_zoom),
        map_center: [String(map_lat), String(map_lng)],
        heading_background_color: heading_background_color,
        font_color_1: font_color_1,
        map_style: map_style,
      };

      /* CD (EV on 20200204): update the apps collection */

      updateApp({
        variables: { query: query, set: set },
      });
    };

    /* CD (EV on 20200204): wait to while fetching the locations */
    if (loading) return "";
    if (error) return `Error! ${error.message}`;

    return dataApp !== undefined ? (
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-1">
          {editing}
          <AppForm formInput={FormInput} />
          &nbsp;
          <AppButton
            className="secondary"
            label="Preview Map"
            handleClick={updateMap}
          />
          &nbsp;
          <AppButton
            className="primary"
            label="Save Settings"
            handleClick={saveSettings}
          />
        </div>

        <div className="col-span-3 md:col-span-2">
          <div className="sidebar" style={{ height: parseInt(map_height) }}>
            <div
              className="heading"
              style={{ backgroundColor: heading_background_color }}
            >
              <h1 className="mapstuff">Our locations</h1>
            </div>
            <div id="listings" className="listings"></div>
          </div>
          <div
            ref={(el) => (mapContainer.current = el)}
            className="map"
            style={{ height: parseInt(map_height) }}
          />
        </div>
      </div>
    ) : (
      ""
    );
  };

  return (
    <>
      <AppNotification
        isOpen={isSuccess}
        setIsOpen={setIsSuccess}
        content={appNotifContent}
        title={appNotifTitle}
      />
      <SelecApp />
      <Settings />
    </>
  );
};

export default MapSettings;
