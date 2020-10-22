let markers = [],
    map,
    zoom = 8;

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoom,
        center: { lat: 53.529154, lng: -7.797545 },
    });

    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
    setMapOnAll(null);
    map.zoom = 12;

    const marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });

    const circle = new google.maps.Circle({
        map: map,
        radius: 2000,
        fillColor: '#008000',
        strokeOpacity: 0,
        fillOpacity: 0.3,
    });

    circle.bindTo('center', marker, 'position');
    map.panTo(latLng);

    markers.push(marker);
    markers.push(circle);
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    markers = [];
}
