import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client'
// /* CD (EV on 20200204): import APPS_QUERY graphql */
import {
  APPS_QUERY,
  APP_UPDATE_ONE_MUTATION,
} from '../../../graphql/dashboard/map-settings/app.query'
import { LOCATIONS_QUERY } from '../../../graphql/dashboard/map-settings/location.query'

import AppForm from '../../../components/global/AppForm'
import AppButton from '../../../components/global/AppButton'

import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

import AppNotification from '../../global/AppNotification'

import { PLAN_QUERY } from '../../../graphql/dashboard/map-settings/plan.query'
import { useTranslation } from 'react-i18next'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import locale from 'locale-codes'

const MapSettings = (props) => {
  /* CD (EV on 20200204): declare session*/
  const { t } = useTranslation()
  const { session } = props
  /* CD (EV on 20200204): initial selected app null*/
  const [selectedApp, setSelectedApp] = useState('')
  /* CD (EV on 20200204): initial mapStyles empty array*/
  const [mapStyles, setMapStyles] = useState([])
  const [role, setRole] = useState('')
  const language = new MapboxLanguage()
  let languages = []
  language.supportedLanguages.forEach((a) => {
    if (!!locale.getByTag(a)?.name) {
      languages.push({
        app_url: locale.getByTag(a)?.name,
        value: a,
      })
    }
  })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(session?.user[`${window.location.origin}/role`])
    }
  }, [])

  /* CD (EV on 20210406): query max location*/
  const { planLoading, planError, data: planData } = useQuery(PLAN_QUERY, {
    variables: {
      query: {
        price_id: role?.includes('Admin')
          ? process.env.STRIPE_PRICE_PLUS
          : session.user.plan.id,
      },
    },
  })

  /* CD (EV on 20210406): query current plan*/
  useEffect(() => {
    if (!planLoading && planData) {
      var filteredMapStyles = planData.plansAcl.cms.mapBoxMapSettings.mapStyles.map(
        (item) => ({
          ...item,
          disabled: !item.enable,
        }),
      )
      /* CD (EV on 20210406): query current plan*/
      setMapStyles(filteredMapStyles)
    }
  }, [planLoading, planData])

  const SelectApp = () => {
    var query = { created_by_id: session?.user?.sub?.replace('auth0|', '') }

    /* CD (EV on 20200225): if admin query all apps*/
    if (role?.includes('Admin')) {
      query = null
    }
    /* CD (EV on 20200204): fetch apps*/
    const { loading, error, data } = useQuery(APPS_QUERY, {
      variables: {
        input: query,
      },
    })

    const FormInput = [
      {
        type: 'select',
        label: t('map-settings.list_of_your_apps'),
        /* CD (EV on 20200204): array of object on opstions of dropdown*/
        items: !loading && data ? data.apps : [],
        /* CD (EV on 20200204): set the selected object*/
        value: selectedApp,
        handleInput: (event) => {
          /* CD (EV on 20200204): array of object on opstions of dropdown*/
          setSelectedApp(event)
        },
      },
    ]

    useEffect(() => {
      if (!selectedApp && !loading && data) {
        /* CD (EV on 20200204): set initial selected app*/
        setSelectedApp(data.apps[0])
      }
    }, [loading, data, selectedApp])

    if (loading) return ''
    if (error) return `Error! ${error.message}`

    return <AppForm formInput={FormInput} />
  }

  const MapboxGLMapSettings = () => {
    const [map, setMap] = useState(null)
    const mapContainer = useRef(null)

    const [isSuccess, setIsSuccess] = useState(false)
    const [appNotifContent, setAppNotifContent] = useState(null)
    const [appNotifTitle, setAppNotifTitle] = useState(null)

    /* CD (EV on 20200204): initialize editable fields*/
    const [app_url, setAppUrl] = useState('')
    const [map_api_key, setMapApiKey] = useState('')
    const [map_height, setMapHeight] = useState(0)
    const [map_zoom, setMapZoom] = useState('')
    const [map_lat, setMapLat] = useState('')
    const [map_lng, setMapLng] = useState('')
    const [heading_background_color, setHeadingBackgroundColor] = useState('')
    const [markerColor, setMarkerColor] = useState('')
    const [activeMarker, setActiveMarker] = useState('')
    const [locationMarker, setLocationMarker] = useState([])
    const [font_color_1, setFontColor1] = useState('')
    const [map_style, setMapStyle] = useState('')
    const [map_header, setMapHeader] = useState('')
    const [mapbox_language, setMapboxLanguage] = useState('')
    const [filter_button, setFilterButton] = useState('')
    const [loaded, setLoaded] = useState(false)

    /* CD (EV on 20200204): fetch locations of the app*/
    const { loading, error, data } = useQuery(LOCATIONS_QUERY, {
      variables: {
        input: { app_id: selectedApp._id, status: 'Published' },
      },
    })

    //function for changing the marker value
    // Params: marker and color
    function setMarkerColorValue(marker, color) {
      if (!!marker && markerColor !== '') {
        let markerElement = marker.getElement()
        const marker1 = markerElement.querySelectorAll('svg')[0]
        const marker2 = markerElement.querySelectorAll('path')[0]
        if (!!marker2) {
          marker2.setAttribute('fill', color)
          marker._color = color
        }
      }
    }

    useEffect(() => {
      if (!!map) {
        map.setStyle('mapbox://styles/mapbox/' + map_style)
      }
    }, [map])

    useEffect(() => {
      if (!!activeMarker) {
        setMarkerColorValue(activeMarker, markerColor)
      }
    }, [markerColor, activeMarker])

    useEffect(() => {
      if (!!locationMarker && locationMarker.length > 0) {
        locationMarker.forEach((marker) => {
          setMarkerColorValue(marker, markerColor)
        })
      }
    }, [locationMarker])

    useEffect(() => {
      if (!!locationMarker && locationMarker.length > 0) {
        locationMarker.forEach((marker) => {
          setMarkerColorValue(marker, markerColor)
        })
      }
    }, [markerColor, locationMarker])

    useEffect(() => {
      if (selectedApp && data) {
        //move default style from env to a variable
        const defaultStyle = 'streets-v11'
        const initialMapStyle =
          selectedApp.map_style === null ? defaultStyle : selectedApp.map_style

        setAppUrl(selectedApp.app_url)
        setMapApiKey(selectedApp.map_api_key)
        setMapHeight(parseInt(selectedApp.map_height))
        setMapZoom(selectedApp.map_zoom)
        setMapLat(selectedApp.map_center[0])
        setMapLng(selectedApp.map_center[1])
        setHeadingBackgroundColor(selectedApp.heading_background_color)
        setFontColor1(selectedApp.font_color_1)
        setMarkerColor(
          selectedApp.marker_color === null
            ? '#000000'
            : selectedApp.marker_color,
        )
        setMapboxLanguage(selectedApp.mapbox_language)
        setFilterButton(selectedApp.filter_button)
        setMapHeader(selectedApp.map_header)
        //add checking if the map_style from api is empty
        setMapStyle(initialMapStyle)

        mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN
        const initializeMap = ({ setMap, mapContainer, selectedApp, data }) => {
          const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: initialMapStyle, // stylesheet location
            center: [selectedApp.map_center[1], selectedApp.map_center[0]],
            zoom: selectedApp.map_zoom,
          })
          // Set map value after initialization
          setMap(map)
          /* CD (EV on 20200204): mapped locations to usable geojson*/
          var store_locations = data.locations.map((feature) => ({
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
              type: 'Point',
              coordinates: [
                parseFloat(feature.geometry.coordinates[1]),
                parseFloat(feature.geometry.coordinates[0]),
              ],
            },
          }))

          var stores = {
            type: 'FeatureCollection',
            features: store_locations,
          }

          /**
           * Assign a unique id to each store. You'll use this `id`
           * later to associate each point on the map with a listing
           * in the sidebar.
           */
          stores.features.forEach(function (store, i) {
            store.properties.id = i
          })

          /**
           * Wait until the map loads to make changes to the map.
           */
          map.on('load', function (e) {
            /**
             * This is where your '.addLayer()' used to be, instead
             * add only the source without styling a layer
             */
            map.addSource('places', {
              type: 'geojson',
              data: stores,
            })

            setLoaded(true)

            /**
             * Create a new MapboxGeocoder instance.
             * CD (CT on 20211124): The bbox element commented out below restricts the search location within the area only instead of anywhere in the world.
             */
            var geocoder = new MapboxGeocoder({
              accessToken: mapboxgl.accessToken,
              mapboxgl: mapboxgl,
              /* bbox: [-77.210763, 38.803367, -76.853675, 39.052643], */
            })

            /**
             * Add all the things to the page:
             * - The location listings on the side of the page
             * - The search box (MapboxGeocoder) onto the map
             * - The markers onto the map
             */
            buildLocationList(stores)
            map.addControl(geocoder, 'top-left')
            addMarkers()

            /**
             * Listen for when a geocoder result is returned. When one is returned:
             * - Calculate distances
             * - Sort stores by distance
             * - Rebuild the listings
             * - Adjust the map camera
             * - Open a popup for the closest store
             * - Highlight the listing for the closest store.
             */
            geocoder.on('result', function (ev) {
              /* Get the coordinate of the search result */
              var searchResult = ev.result.geometry
              /**
               * Calculate distances:
               * For each store, use turf.disance to calculate the distance
               * in miles between the searchResult and the store. Assign the
               * calculated value to a property called `distance`.
               */
              var options = { units: 'miles' }
              stores.features.forEach(function (store) {
                Object.defineProperty(store.properties, 'distance', {
                  value: turf.distance(searchResult, store.geometry, options),
                  writable: true,
                  enumerable: true,
                  configurable: true,
                })
              })

              geocoder.clear()
              // save marker in the state
              var marker = new mapboxgl.Marker({})
                .setLngLat(ev.result.center)
                .addTo(map)
              setActiveMarker(marker)
              //set marker value of the newly created marker
              /**
               * Sort stores by distance from closest to the `searchResult`
               * to furthest.
               */
              stores.features.sort(function (a, b) {
                if (a.properties.distance > b.properties.distance) {
                  return 1
                }
                if (a.properties.distance < b.properties.distance) {
                  return -1
                }
                return 0 // a must be equal to b
              })

              /**
               * Rebuild the listings:
               * Remove the existing listings and build the location
               * list again using the newly sorted stores.
               */
              var listings = document.getElementById('listings')
              while (listings.firstChild) {
                listings.removeChild(listings.firstChild)
              }
              buildLocationList(stores)

              /* Open a popup for the closest store. */
              if (stores.features.length > 0) {
                createPopUp(stores.features[0])

                /** Highlight the listing for the closest store. */
                var activeListing = document.getElementById(
                  'listing-' + stores.features[0].properties.id,
                )
                activeListing.classList.add('active')

                /**
                 * Adjust the map camera:
                 * Get a bbox that contains both the geocoder result and
                 * the closest store. Fit the bounds to that bbox.
                 */
                var bbox = getBbox(stores, 0, searchResult)
                map.fitBounds(bbox, {
                  padding: 100,
                })
              }
            })
          })

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
            ]
            var lons = [
              sortedStores.features[storeIdentifier].geometry.coordinates[0],
              searchResult.coordinates[0],
            ]
            var sortedLons = lons.sort(function (a, b) {
              if (a > b) {
                return 1
              }
              if (a.distance < b.distance) {
                return -1
              }
              return 0
            })
            var sortedLats = lats.sort(function (a, b) {
              if (a > b) {
                return 1
              }
              if (a.distance < b.distance) {
                return -1
              }
              return 0
            })
            return [
              [sortedLons[0], sortedLats[0]],
              [sortedLons[1], sortedLats[1]],
            ]
          }

          /**
           * Add a marker to the map for every store listing.
           **/
          function addMarkers() {
            /* For each feature in the GeoJSON object above: */
            stores.features.forEach(function (marker) {
              /* Create a div element for the marker. */
              var el = document.createElement('div')
              /* Assign a unique `id` to the marker. */
              el.id = 'marker-' + marker.properties.id
              /* Assign the `marker` class to each marker for styling. */
              el.className = 'marker'

              /**
               * Create a marker using the div element
               * defined above and add it to the map.
               **/
              var marker1 = new mapboxgl.Marker({})
                .setLngLat(marker.geometry.coordinates)
                .addTo(map)

              setLocationMarker((prevState) => [...prevState, marker1])

              /**
               * Listen to the element and when it is clicked, do three things:
               * 1. Fly to the point
               * 2. Close all other popups and display popup for clicked store
               * 3. Highlight listing in sidebar (and remove highlight for all other listings)
               **/
              marker1.getElement().addEventListener('click', function (e) {
                flyToStore(marker)
                createPopUp(marker)
                var activeItem = document.getElementsByClassName('active')

                e.stopPropagation()
                if (activeItem[0]) {
                  activeItem[0].classList.remove('active')
                }
                var listing = document.getElementById(
                  'listing-' + marker.properties.id,
                )
                listing.classList.add('active')
              })
            })
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
              var prop = store.properties

              /* Add a new listing section to the sidebar. */
              var listings = document.getElementById('listings')
              var listing = listings.appendChild(document.createElement('div'))
              /* Assign a unique `id` to the listing. */
              listing.id = 'listing-' + prop.id
              /* Assign the `item` class to each listing for styling. */
              listing.className = 'item'

              /* Add the link to the individual listing created above. */
              var link = listing.appendChild(document.createElement('a'))
              link.href = '#'
              link.className = 'title'
              link.id = 'link-' + prop.id
              link.innerHTML = prop.name ? prop.name : 'no location name'
              if (selectedApp.font_color_1) {
                link.style.color = selectedApp.font_color_1
              }

              /* Add details to the individual listing. */
              var details = listing.appendChild(document.createElement('div'))
              {
                prop.address
                  ? (details.innerHTML =
                      "<div id='mapstuff-listing-address'>" +
                      prop.address +
                      '</div> ')
                  : null
              }
              details.innerHTML +=
                "<span id='mapstuff-listing-city'>" + prop.city + '</span>, '
              details.innerHTML +=
                "<span id='mapstuff-listing-state'>" + prop.state + '</span> '
              details.innerHTML +=
                "<span id='mapstuff-listing-postal-code'>" +
                prop.postalCode +
                '</span>'
              details.innerHTML +=
                "<div id='mapstuff-listing-country'>" + prop.country + '</div>'
              if (prop.phone) {
                details.innerHTML +=
                  "<div id='mapstuff-listing-phone'>" + prop.phone + '</div>'
              }
              if (prop.url) {
                details.innerHTML +=
                  "<div id='mapstuff-listing-url'>" + prop.url + '</div>'
              }
              if (prop.email) {
                details.innerHTML +=
                  "<div id='mapstuff-listing-email'>" + prop.email + '</div>'
              }
              /**
               * Listen to the element and when it is clicked, do four things:
               * 1. Update the `currentFeature` to the store associated with the clicked link
               * 2. Fly to the point
               * 3. Close all other popups and display popup for clicked store
               * 4. Highlight listing in sidebar (and remove highlight for all other listings)
               **/
              link.addEventListener('click', function (e) {
                for (var i = 0; i < data.features.length; i++) {
                  if (this.id === 'link-' + data.features[i].properties.id) {
                    var clickedListing = data.features[i]
                    flyToStore(clickedListing)
                    createPopUp(clickedListing)
                  }
                }
                var activeItem = document.getElementsByClassName('active')
                if (activeItem[0]) {
                  activeItem[0].classList.remove('active')
                }
                this.parentNode.classList.add('active')
              })
            })
          }

          /**
           * Use Mapbox GL JS's `flyTo` to move the camera smoothly
           * a given center point.
           **/
          function flyToStore(currentFeature) {
            map.flyTo({
              center: currentFeature.geometry.coordinates,
              zoom: 15,
            })
          }

          /**
           * Create a Mapbox GL JS `Popup`.
           **/
          function createPopUp(currentFeature) {
            var popUps = document.getElementsByClassName('mapboxgl-popup')

            if (popUps[0]) popUps[0].remove()

            var popup = new mapboxgl.Popup({ closeOnClick: false })
              .setLngLat(currentFeature.geometry.coordinates)
              .setHTML(
                `<h3 id="mapstuff-popup-name">${
                  currentFeature.properties.name
                }</h3>
<div>
  <span className="mapstuff-popup-container">
    ${
      !!currentFeature.properties.address
        ? `<span id="mapstuff-popup-address"> ${currentFeature.properties.address} </span> <br />`
        : ''
    }
    <span id="mapstuff-popup-city"> ${
      currentFeature.properties.city
    } </span>, <span id="mapstuff-popup-state"> ${
                  currentFeature.properties.state
                } ${currentFeature.properties.postalCode} </span>
    <br />
    <span> ${currentFeature.properties.country}</span>
  </span>
  </div>`,
              )
              .addTo(map)
            /* CD (EV on 20200218): override popup content */
            var x = document.getElementsByClassName('mapboxgl-popup-content')[0]
            x.querySelectorAll('h3')[0].style.backgroundColor =
              selectedApp.heading_background_color
          }

          map.on('load', () => {
            setMap(map)
            map.resize()
          })
        }

        if (!map || map === null)
          initializeMap({ setMap, mapContainer, selectedApp, data })
      }

      /* CD (EV on 20200204): check if map is existing*/
      if (map) {
        /* CD (EV on 20200204): resize the map*/
        map.resize()
        /* CD (EV on 20200204): when zoom in or out*/
        map.on('zoom', function () {
          /* CD (EV on 20200204): get zoom value*/
          var zoom = map.getZoom()
          /* CD (EV on 20200204): set zoom value to form field*/
          setMapZoom(zoom)

          /* CD (EV on 20200204): get center of the map*/
          var center = map.getCenter()
          /* CD (EV on 20200204): set latitude to form field*/
          setMapLat(center.lat)
          /* CD (EV on 20200204): set longitude to form field*/
          setMapLng(center.lng)
        })

        /* CD (EV on 20200204): when map is dragged*/
        map.on('dragend', function () {
          /* CD (EV on 20200204): get center of the map*/
          var center = map.getCenter()
          /* CD (EV on 20200204): set latitude to form field*/
          setMapLat(center.lat)
          /* CD (EV on 20200204): set longitude to form field*/
          setMapLng(center.lng)
        })
      }
    }, [map, data, selectedApp])

    React.useEffect(() => {
      if (loaded) {
        const map_language = mapbox_language || 'en'
        map.setLayoutProperty('country-label', 'text-field', [
          'get',
          `name_${map_language}`,
        ])
        map.setLayoutProperty('state-label', 'text-field', [
          'get',
          `name_${map_language}`,
        ])
        map.setLayoutProperty('settlement-label', 'text-field', [
          'get',
          `name_${map_language}`,
        ])
        map.setLayoutProperty('settlement-subdivision-label', 'text-field', [
          'get',
          `name_${map_language}`,
        ])
      }
    }, [loaded, mapbox_language])

    const dropdownvalue =
      languages?.find((val) => val.value === mapbox_language) ||
      languages?.find((val) => val.value === 'en')

    const FormInput = [
      {
        type: 'text',
        label: t('map-settings.app_url'),
        value: app_url,
        handleInput: (event) => {
          setAppUrl(event.target.value)
        },
      },
      {
        type: 'password',
        label: t('map-settings.api_key'),
        value: map_api_key,
        handleInput: (event) => {
          setMapApiKey(event.target.value)
        },
      },
      {
        type: 'text',
        label: t('map-settings.map_height'),
        value: map_height,
        handleInput: (event) => {
          setMapHeight(event.target.value)

          // map.setStyle('mapbox://styles/mapbox/' + layerId);
          var x = document.getElementsByClassName('map')[0]
          x.style.height = event.target.value
          map.resize()
        },
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.updateHeight,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'text',
        label: t('map-settings.map_zoom'),
        value: map_zoom,
        handleInput: (event) => {
          setMapZoom(event.target.value)
        },
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.zoomLevel,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'text',
        label: t('map-settings.map_latitude'),
        value: map_lat,
        handleInput: (event) => {
          setMapLat(event.target.value)
        },
      },
      {
        type: 'text',
        label: t('map-settings.map_longitude'),
        value: map_lng,
        handleInput: (event) => {
          setMapLng(event.target.value)
        },
      },
      {
        type: 'radio',
        label: t('map-settings.map_styles'),
        /* CD (EV on 20200204): array of object on opstions of dropdown*/
        items: mapStyles,
        /* CD (EV on 20200204): set the selected object*/
        value: map_style,
        handleInput: (event) => {
          /* CD (EV on 20200204): array of object on opstions of dropdown*/
          setMapStyle(event.target.value)

          map.setStyle('mapbox://styles/mapbox/' + event.target.value)
        },
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.mapStyles.some(
          (ms) => ms.enabled,
        ),
        hasDisabledIcon: false,
        disabledText: 'Upgrade to unlock other options',
      },
      {
        type: 'color',
        label: t('map-settings.heading_background_color'),
        value: heading_background_color,
        handleInput: (event) => {
          setHeadingBackgroundColor(event.target.value)

          var x = document.getElementsByClassName('mapboxgl-popup-content')[0]
          if (x) {
            x.querySelectorAll('h3')[0].style.backgroundColor =
              event.target.value
          }
          var y = document.getElementsByClassName('heading')
          if (y) {
            // y.style.backgroundColor = event.target.value;
            y[0].style.backgroundColor = event.target.value
          }
        },
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings
          .headingBackgroundColor,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'color',
        label: t('map-settings.marker_color'),
        value: markerColor,
        handleInput: (event) => {
          setMarkerColor(event.target.value)
        },
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.marker,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'color',
        label: t('map-settings.font_color_1'),
        value: font_color_1,
        handleInput: (event) => {
          var tags = document.getElementsByClassName('title')

          for (var i = 0; i < tags.length; i++) {
            tags[i].style.color = event.target.value
          }

          // x[0].style.color = event.target.value;
          setFontColor1(event.target.value)
        },
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.fontColor1,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'text',
        label: t('map-settings.map_header'),
        value: map_header,
        handleInput: (event) => setMapHeader(event.target.value),
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.header,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'select',
        label: t('map-settings.mapbox_language'),
        value: dropdownvalue,
        items: languages,
        handleInput: (event) => setMapboxLanguage(event.value),
        placeholder: "Choose your map's language",
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.language,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },
      {
        type: 'text',
        label: t('map-settings.filter_button'),
        value: filter_button,
        handleInput: (event) => setFilterButton(event.target.value),
        disabled: !planData?.plansAcl?.cms.mapBoxMapSettings.filterButtonName,
        hasDisabledIcon: true,
        disabledText: 'Upgrade to unlock this feature',
      },

      // {
      //   type: "text",
      //   label: "Icon",
      //   value: map_location_icon,
      //   handleInput: (event) => {
      //     setLocationIcon(event.target.value), setEditing(true);
      //   },
      // },
    ]

    /* CD (EV on 20200204): save map settings*/
    const saveSettings = () => {
      map.resize()
      /* CD (EV on 20200204): query variable*/
      var query = {
        _id: selectedApp._id,
      }
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
        marker_color: markerColor,
        map_header: map_header,
        mapbox_language: mapbox_language,
        filter_button: filter_button,
      }

      /* CD (EV on 20200204): update the apps collection */
      updateApp({
        variables: { query: query, set: set },
      })
    }

    function updateMarkers() {
      var marker = document.getElementsByClassName('marker')[0]

      marker.style.backgroundImage =
        "url('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png')"
    }
    /* CD (EV on 20200204): resize map when height is updated*/
    function updateMap() {
      updateMarkers()
    }

    /* CD (EV on 20200204): update app map settings */
    const [
      updateApp,
      { data: mutationData, loading: mutationLoading, error: mutationError },
    ] = useMutation(APP_UPDATE_ONE_MUTATION, {
      onCompleted(data) {
        if (data.updateOneApp) {
          setIsSuccess(true)
          setAppNotifContent(<p>{t('map-settings.saved_changes')}</p>)
          setAppNotifTitle(t('map-settings.saved_changes_title'))
        }
      },
    })

    return (
      <div>
        <AppNotification
          isOpen={isSuccess}
          setIsOpen={setIsSuccess}
          content={appNotifContent}
          title={appNotifTitle}
        />
        <AppForm formInput={FormInput} />
        &nbsp;
        <AppButton
          className="primary"
          label={t('map-settings.save_settings')}
          handleClick={saveSettings}
        />
        <br />
        <br />
        <div className="flex flex-col-reverse lg:flex-row">
          <div
            className="w-full py-2 lg:py-0 sidebar lg:w-1/3 lg:border-r-2 lg:border-gray-300"
            style={{
              height: parseInt(selectedApp ? selectedApp.map_height : 0),
            }}
            id="sidebar"
          >
            <div
              className="heading"
              style={{ backgroundColor: heading_background_color }}
            >
              <h1 className="mapstuff">{map_header}</h1>
            </div>
            <div id="listings" className="listings"></div>
          </div>
          <div
            ref={(el) => (mapContainer.current = el)}
            className="w-full py-2 map lg:w-2/3"
            style={{ height: parseInt(map_height) }}
          />
        </div>
        <br />
        &nbsp;
        <br />
      </div>
    )
  }

  return (
    <div>
      {!!session?.user?.sub && <SelectApp />}
      <MapboxGLMapSettings />
    </div>
  )
}
export default MapSettings
