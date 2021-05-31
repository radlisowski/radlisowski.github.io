var map = L.map('map').setView([51.505, -0.09], 13);
var circles = [];
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


function onMapClick(e) {
    if (circles.length > 0) {
        console.log("delete circle and any markers")
        circles = [];
       location.reload();
    } else {
        console.log("marker did not exist");
        setMapOnAll(null);

        var marker = L.marker(e.latlng).addTo(map)
            .bindPopup('This is a 5 km radius from the point you have clicked')
            .openPopup();

        var circle = L.circle(e.latlng, {
            color: 'green',
            fillColor: '#green',
            fillOpacity: 0.3,
            radius: 5000
        }).addTo(map);
        circles.push(marker, circle);
        

    };
}
function setMapOnAll(map) {
    for (let i = 1; i < circles.length; i++) {
        circles[i].setMap(map);
    }
    circles = [];
}

map.on('click', onMapClick);

