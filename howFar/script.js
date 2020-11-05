

let markers = [],
    map,
    zoom = 8,
    latlong;

    const notificationElement = document.querySelector(".errorModal")


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    
    navigator.geolocation.getCurrentPosition(success, showError, {timeout:10000});
    
    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 9,
            center: latlong,
        });
        placeMarkerAndPanTo(latlong, map);
    }

} else {
    
    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: zoom,
            center: { lat: 53.529154, lng: -7.797545 },
        });
        map.addListener("click", (e) => {
            placeMarkerAndPanTo(e.latLng, map);
        });
    }
    $(document).ready(function () {
        $("#myModal").modal('show');
    });
}

function success(pos) {
    let cords = pos.coords;
    latlong = {
        lat: cords.latitude,
        lng: cords.longitude
    }
    
}

function showError(error) { 
    
    alert(error.message);
    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: zoom,
            center: { lat: 53.529154, lng: -7.797545 },
        });
        map.addListener("click", (e) => {
            placeMarkerAndPanTo(e.latLng, map);
        });
    }
    $(document).ready(function () {
        $("#myModal").modal('show');
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



