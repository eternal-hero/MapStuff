/* Copy of the working MapPreview component before the embed code to generate the map preview was used. This is the version as of 02/20/2022 */
/* CD (CT on 20220225): The MapPreview where this is copied from is now MapEmbedCode. The preview of the map in the original component was deleted. This code is present on this file. */


import { useState, useEffect, useRef, Fragment } from "react";
/* CD (EV on 20200205): import APPS_QUERY graphql */
import { APPS_QUERY } from "../../../graphql/dashboard/map-preview/app.query";
/* CD (EV on 20200205): import useQuery apollo client */
import { useQuery, useMutation } from "@apollo/client";

import { LOCATIONS_MAP_QUERY } from "../../../graphql/dashboard/map-preview/location.query";
import { APP_QUERY } from "../../../graphql/dashboard/map-preview/app.query";
import { USER_QUERY } from "../../../graphql/dashboard/map-preview/user.query";
import { APP_UPDATE_ONE_MUTATION } from "../../../graphql/dashboard/map-preview/app.mutation";

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import AppModal from "../../../components/global/AppModal";
import AppButton from "../../../components/global/AppButton";
import Link from "next/link";
import AppNotification from "../../global/AppNotification";
/* CD (EV on 20200213): import AppForm */
import AppForm from "../../global/AppForm";
/* CD (JD on 20200826): import CopyToClipboard */
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useRole from "../../hooks/useRole";

import AppListBox from "../../global/AppListbox";
const MapPreview = (props) => {

  const [selectedApp, setSelectedApp] = useState("");
  const [error, setError] = useState("");
  const { session, client } = props;
  const [role] = useRole(session);


  /* CD (EV on 20200204): App Notif*/
  const [isSuccess, setIsSuccess] = useState(false);
  const [appNotifContent, setAppNotifContent] = useState(null);
  const [appNotifTitle, setAppNotifTitle] = useState(null);

  const SelectApp = () => {
    var query = { created_by_id: session?.user?.sub?.replace('auth0|', '') };

    /* CD (EV on 20200225): if admin query all apps*/
    if (role.includes('Admin') && client == undefined) {
      query = null;
    }

    /* CD (EV on 20200204): fetch apps*/
    const { loading, error, data } = useQuery(APPS_QUERY, {
      variables: {
        input: query,
      },
      client: client,
    });

    useEffect(() => {
      if (!selectedApp && !loading && data) {
        /* CD (EV on 20200204): set initial selected app*/
        setSelectedApp(data.apps[0]);
      }
    }, [loading, data, selectedApp]);

    if (loading) return "";
    if (error) return `Error! ${error.message}`;

    if (client) return "";
    return (
      <div>
        <AppListBox
          selected={selectedApp}
          setSelected={setSelectedApp}
          options={data.apps}
          displayName="_id"
          label=""
        />
      </div>
    );
  };

  const CodeSnippet = () => {
    const [realm_api_key, setRealmApiKey] = useState("");

    /* CD (EV on 20200205): fetch user*/
    const { loading, error, data } = useQuery(USER_QUERY, {
      variables: {
        input: { _id: session?.user?.sub?.replace('auth0|', '') },
      },
      client: client,
    });

    useEffect(() => {
      if (!loading && data) {
        setRealmApiKey(data.user.realm_api_key);
      }
    }, [loading, data]);

    if (loading) return "";
    if (error) return `Error! ${error.message}`;

    /* CD (JD on 20200826): Concat code string */
      const code = `${'<div id="map-mapstuff"></div>'} \n${'<script src="https://cdn.gangnam.club/widget/plugins.js"></script>'} \n${'<script src="https://cdn.gangnam.club/widget/mapbox2.js"  data-id="dev-store-locator-react" '}data-app="${selectedApp._id}" data-key="${realm_api_key}"></script>`

    return selectedApp && !client ? (
      <>
        {/* CD (JD on 20200826): Implement CopyToClipBoard  */}
        <CopyToClipboard text={code}
          onCopy={() => alert('Copied!')}>
          <a href="#"><AppButton label="Copy to clipboard" className="secondary" /></a>
        </CopyToClipboard>
        <div className="relative flex items-center px-6 py-5 m-10 space-x-3 overflow-scroll bg-white border border-gray-300 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500"
          style={{marginTop: "1em"}}
        >
        <pre>
          <code>{'<div id="map-mapstuff"></div>'}</code>
          <br />
          <code>
            {
              '<script src="https://cdn.gangnam.club/widget/plugins.js"></script>'
            }
          </code>
          <br />
          <code>
            {'<script src="https://cdn.gangnam.club/widget/mapbox2.js"  data-id="dev-store-locator-react" '}
          </code>
          <br />
          <code>
            {'data-app="' +
              selectedApp._id +
              '" data-key="' +
              realm_api_key +
              '"></script>'}
          </code>
        </pre>
      </div>
      </>
    ) : (
      ""
    );
  };

  const MapboxGLMap = () => {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);
    const [filterTags, setFilterTags] = useState([]);
    const [activeMarkers, setActiveMarkers] = useState([]);

    const handleCheckboxChange = (e) => {
      let newArray = [...filterTags, e.target.value];
      if (filterTags.includes(e.target.value)) {
        newArray = newArray.filter((tag) => tag !== e.target.value);
      }
      setFilterTags(newArray);
    };

    const { loading, error, data } = useQuery(LOCATIONS_MAP_QUERY, {
      variables: {
        input: { app_id: selectedApp._id, status: "Published" },
      },
      client: client,
    });

    //function for changing the marker value
    // Params: marker and color
    function setMarkerColorValue(marker, color) {
      if(!!marker){
        let markerElement = marker.getElement();

        markerElement
          .querySelectorAll('svg g[fill="' + marker._color + '"]')[0]
          .setAttribute("fill", color);
        marker._color = color;
      }
    }

    useEffect(() => {
      if (selectedApp && data) {
        const defaultStyle = process.env.MAPBOX_STYLE.replace('mapbox://styles/mapbox/', '')
        const initialMapStyle = selectedApp.map_style === null ? defaultStyle : selectedApp.map_style

        mapboxgl.accessToken = selectedApp.map_api_key;
        const initializeMap = ({ setMap, mapContainer, selectedApp, data }) => {
          const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/" +  initialMapStyle, // stylesheet location
            center: [selectedApp.map_center[1], selectedApp.map_center[0]],
            zoom: selectedApp.map_zoom,
          });

          /* CD (EV on 20210419): div of the filter */
          var z = document.createElement("div");
          /* CD (EV on 20210419): add id on the div */
          z.id = "mapboxmenufilter";
          z.style.display = "none";
          /* CD (EV on 20210419): close button of the filter icon */
          var close_button = document.createElement("span");
          close_button.className = "filter-close-icon";
          close_button.style.cursor = "pointer";
          close_button.style.right = 0;

          close_button.style.position = "absolute";
          close_button.style.marginRight = "10px";

          /* CD (EV on 20210419): close the filter when click the icon */
          close_button.addEventListener("click", function (e) {
            var mapboxFilterMenu = document.getElementById("mapboxmenufilter");

            mapboxFilterMenu.style.display = "none";
          });
          /* CD (EV on 20210419): append the close button to div id ="mapboxmenufilter"*/
          z.appendChild(close_button);

          var br = document.createElement("div");
          br.style.height = "10px";
          z.appendChild(br);

          /* CD (EV on 20210419): filter checkbox*/
          selectedApp?.filters?.map((filter, index) => {
            /* CD (EV on 20210419): filter title*/
            var title = document.createElement("h3");
            title.innerHTML = filter.title;
            z.appendChild(title);
            filter?.tags?.map((tag, index) => {
              var label = document.createElement("label");

              var input = document.createElement("input");
              input.type = "checkbox";
              input.value = tag;
              input.className = "filter-checkbox";

              input.addEventListener("change", function (e) {
                const checkedBoxes = document.querySelectorAll(
                  "input[className=filter-checkbox]:checked"
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

                let checker = (arr, target) =>
                  target.every((v) => arr.includes(v));

                var tempStores = stores;
                /* CD (EV on 20210419): new features //filter function */
                var newFeatures = tempStores.features.filter(function (
                  feature
                ) {
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
                    /**
                     * Create a marker using the div element
                     * defined above and add it to the map.
                     **/
                    var marker1 = new mapboxgl.Marker({ offset: [0, -23] })
                      .setLngLat(marker.geometry.coordinates)
                      .addTo(map);

                      setMarkerColorValue(marker1, selectedApp.marker_color)
                      setActiveMarkers(activeMarkers.push(marker1))

                    /**
                     * Listen to the element and when it is clicked, do three things:
                     * 1. Fly to the point
                     * 2. Close all other popups and display popup for clicked store
                     * 3. Highlight listing in sidebar (and remove highlight for all other listings)
                     **/
                     marker1.getElement().addEventListener("click", function (e) {
                      flyToStore(marker);
                      createPopUp(marker);
                      var activeItem = document.getElementsByClassName(
                        "active"
                      );

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
                setActiveMarkers([])
                addMarkers(newStores);
                var activeItem = document.getElementsByClassName("active");

                /* CD (EV on 20210419): remove current selected pop up*/
                var popUps = document.getElementsByClassName("mapboxgl-popup");

                if (popUps[0]) popUps[0].remove();
              });

              label.appendChild(input);

              var labelText = document.createElement("span");
              labelText.innerHTML = tag;
              labelText.style.paddingLeft = "10px";

              label.appendChild(labelText);

              z.appendChild(label);
              var br = document.createElement("br");
              z.appendChild(br);
            });
          });

          mapContainer.current.appendChild(z);

          var sidebar = document.getElementById("sidebar");

          var filter = document.createElement("div");
          filter.className = "filter";
          filter.id = "mapbox-filter";

          var filterButton = document.createElement("button");
          filterButton.className = "filter-button";
          filterButton.id = "filter-button";
          filterButton.innerHTML = "Filters";

          filter.appendChild(filterButton);
          var listings = document.getElementById("listings");

          sidebar.insertBefore(filter, listings);

          const toggleFilterButton = (e) => {
            var mapboxFilterMenu = document.getElementById("mapboxmenufilter");
            if (mapboxFilterMenu.style.display === "none") {
              mapboxFilterMenu.style.display = "block";
            } else {
              mapboxFilterMenu.style.display = "none";
            }
          };

          filterButton.addEventListener("click", toggleFilterButton);

          console.log(data.locations);
          /* CD (EV on 20200204): mapped locations to usable geojson*/
          var store_locations = data?.locations?.map((feature) => ({
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
            tags: feature.tags,
          }));

          var stores = {
            type: "FeatureCollection",
            features: store_locations,
          };

          /**
           * Assign a unique id to each store. You'll use this `id`
           * later to associate each point on the map with a listing
           * in the sidebar.
           */
          stores.features.forEach(function (store, i) {
            store.properties.id = i;
          });

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

            /**
             * Create a new MapboxGeocoder instance.
             * CD (CT on 20211124): The bbox element commented out below restricts the search location within the area only instead of anywhere in the world.
             */
            var geocoder = new MapboxGeocoder({
              accessToken: mapboxgl.accessToken,
              mapboxgl: mapboxgl,
              /* bbox: [-77.210763, 38.803367, -76.853675, 39.052643], */

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

              geocoder.clear();
              // save marker in the state
              var marker = new mapboxgl.Marker({ })
                .setLngLat(ev.result.center)
                .addTo(map)
                setMarkerColorValue(marker, selectedApp.marker_color)


                //set marker value of the newly created marker

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
              if(!!stores.features[0]){
              createPopUp(stores.features[0]);

              /** Highlight the listing for the closest store. */
              var activeListing = document.getElementById(
                "listing-" + stores.features[0].properties.id
              );
              activeListing.classList.add("active");
            }
              
              /**
               * Adjust the map camera:
               * Get a bbox that contains both the geocoder result and
               * the closest store. Fit the bounds to that bbox.
               */
              if(stores.features.length > 0){

              var bbox = getBbox(stores, 0, searchResult);
              map.fitBounds(bbox, {
                padding: 100,
              });
            }

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
              /**
               * Create a marker using the div element
               * defined above and add it to the map.
               **/
               var marker1 = new mapboxgl.Marker({ offset: [0, -23] })
               .setLngLat(marker.geometry.coordinates)
               .addTo(map);

               setMarkerColorValue(marker1, selectedApp.marker_color)
               setActiveMarkers(activeMarkers.push(marker1))
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
              if (selectedApp.font_color_1) {
                link.style.color = selectedApp.font_color_1;
              }

              /* Add details to the individual listing. */
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
              if (tags) {
                /* update on styles\mapbox.css find filter-badge*/
                details.innerHTML += "<br>";
                for (var i = 0; i < tags.length; i++) {
                  details.innerHTML +=
                    "<span className='filter-badge'><small>" +
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
              .setLngLat(currentFeature?.geometry?.coordinates)
              .setHTML(
                "<h3>" +
                  currentFeature.properties.name +
                  "</h3>" +
                  "<div><small>" +
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
                  "</small></div>"
              )
              .addTo(map);
            /* CD (EV on 20200218): override popup content */
            var x = document.getElementsByClassName(
              "mapboxgl-popup-content"
            )[0];
            x.querySelectorAll("h3")[0].style.backgroundColor =
              selectedApp.heading_background_color;
          }

          map.on("load", () => {
            setMap(map);
            map.resize();
          });
        };
        try {
          if (!map)
            initializeMap({
              setMap,
              mapContainer,
              selectedApp,
              data,
            });
        } catch (e) {
          alert(e.message);
        }
      }
    }, [map, selectedApp, data]);

    const getOtherElementHeight = () => {
      const filterHeight = document.getElementById('mapbox-filter')?.clientHeight || 0;
      const headingHeight = document.getElementById('map-heading-mapstuff')?.clientHeight || 0;
      return filterHeight + headingHeight
    }
    return (
      <div className='flex flex-col-reverse px-4 lg:flex-row'>
        <div
          className="w-full py-2 lg:py-0 sidebar lg:w-1/3 lg:border-r-2 lg:border-gray-300"
          style={{ height: parseInt(selectedApp ? selectedApp.map_height : 0) }}
          id="sidebar"
        >
          <div
            className="heading"
            style={{ backgroundColor: selectedApp.heading_background_color }}
            id="map-heading-mapstuff"
          >
            <h1 className="mapstuff">Our locations</h1>
          </div>

          <div id="listings" className="listings" style={{ height: parseInt(selectedApp ? selectedApp.map_height - getOtherElementHeight() : 0), paddingBottom: 0  }}></div>
        </div>
        <div
          ref={(el) => (mapContainer.current = el)}
          className="w-full py-2 lg:py-0 map lg:w-2/3"
          style={{ height: parseInt(selectedApp ? selectedApp.map_height : 0) }}
        ></div>
        <br />
        &nbsp;
        <br />
        &nbsp;
        <br />
      </div>
    );
  };

  const AddMapboxApiKeyField = () => {
    const [map_api_key, setMapApiKey] = useState("");

    const [updateApp, { data, loading, error }] = useMutation(
      APP_UPDATE_ONE_MUTATION,
      {
        onCompleted(data) {
          if (data.updateOneApp) {
            setAppNotifContent(
              <p>You can now copy the map embed code for your website.</p>
            );
            setAppNotifTitle("MAPBOX KEY SAVED");
            setIsSuccess(true);
            location.reload();
          }
        },
      }
    );
    const FormInput = [
      {
        type: "password",
        label: "Map Box Api Key",
        value: map_api_key,
        handleInput: (event) => setMapApiKey(event.target.value),
      },
    ];
    const submit = (e) => {
      var query = {
        _id: selectedApp._id,
      };
      var set = {
        map_api_key: map_api_key,
      };
      updateApp({
        variables: { query: query, set: set },
      });
    };

    return (
      <>
        <AppForm formInput={FormInput} />
        <AppButton className="primary" label="Save" handleClick={submit} disabled={map_api_key.length < 10} />
      </>
    );
  };

  return (
    <>
      <SelectApp />
      <br />
      {selectedApp.map_api_key != "" ? <CodeSnippet /> : ""}
      {selectedApp.map_api_key != "" ? (
        <MapboxGLMap />
      ) : (
        <div>
          <AppNotification
            isOpen={isSuccess}
            setIsOpen={setIsSuccess}
            content={appNotifContent}
            title={appNotifTitle}
          />
          <AddMapboxApiKeyField />
        </div>
      )}
    </>
  );
};

export default MapPreview;
