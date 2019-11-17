function update_drone(old_drone, new_drone) {
    old_drone.geometry.setCoordinates([new_drone.latitude, new_drone.longtitude]);
}

function create_new_drone(drone) {
    var drone_layout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">' + drone.status + '</div>'
    );

    var created_drone = new ymaps.Placemark([drone.latitude, drone.longtitude], {
        balloonContentHeader: '<span class="description">Drone #' + drone.drone_id + '</span>',
        hintContent: 'Drone #' + drone.drone_id
    }, {
        iconLayout: 'default#imageWithContent',
        iconImageHref: '/static/core/img/drone.png',
        iconImageSize: [67, 42],
        iconImageOffset: [-24, -24],
        iconContentOffset: [29, 15],
        iconContentLayout: drone_layout
    });

    return created_drone;
}

ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 9,
        type: 'yandex#satellite'
    }, {
        searchControlProvider: 'yandex#search'
    });

    var old_drones = {};

    var chatSocket = new WebSocket('ws://192.168.86.248:8080/frontend/');

    chatSocket.onmessage = function (e) {
        console.log(old_drones);

        var new_drone = JSON.parse(e.data);
        console.log(new_drone);

        if (new_drone.drone_id in old_drones) {
            update_drone(old_drones[new_drone.drone_id], new_drone);
        } else {
            var created_drone = create_new_drone(new_drone);
            old_drones[new_drone.drone_id] = created_drone;
            myMap.geoObjects.add(created_drone);
        }
    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };
});
