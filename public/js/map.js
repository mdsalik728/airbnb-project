
mapboxgl.accessToken = maptoken ;

if(listing.geometry.coordinates.length !== 0){
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",//streets-v12 can be used too also dark-v11 ,
    center: listing.geometry.coordinates, // starting position [longitude, lattitude]. Note that lat must be set between -90 and 90
    zoom: 13// starting zoom
});

const marker1 = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 30}).setHTML(`<h5>${listing.title}<h5> <p>Exact location will be provided after booking</p>`).setMaxWidth('none')
        )
        .addTo(map);
} else{
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [77.2088,28.6139], // starting position [longitude, lattitude]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });
    
    const marker1 = new mapboxgl.Marker({color:'red'})
            .setLngLat([77.2088,28.6139])
            .addTo(map);
    
}