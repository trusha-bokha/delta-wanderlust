//aehi code dekhne ke liye hai already likha hoya hai
 mapboxgl.accessToken = mapToken;
   const map = new mapboxgl.Map({
       container: 'map', // container ID
       style: 'mapbox://styles/mapbox/streets-v12',
       center: [71.5724, 22.6708], // starting position [lng, lat]. Note that lat must be set between -90 and 90
       zoom: 9 // starting zoom
   });

   console.log(coordinates);

const marker = new mapboxgl.Marker()
    .setLngLat([12.554729,55.70651])//listing.geometry.coordinates
   .addTo(map);