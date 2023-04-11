  //<% process.env.MAP_TOKEN%>
  mapboxgl.accessToken = 'pk.eyJ1IjoibWlrcmFtMDQiLCJhIjoiY2xnOXRhdjU5MGJyajNkcHRpYWx1MndubCJ9.i6djtQASXdM4AMvN48DMLA';
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: trail.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
  });

  new mapboxgl.Marker()
  .setLngLat(trail.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${trail.title}</h3> <p>${trail.location}</p>`
    )
  )
  .addTo(map)