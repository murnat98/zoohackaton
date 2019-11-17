function get_new_properties(drone) {
    var humans = drone.humans;
    var animals = drone.animals;
    var unknown_animals = drone.unknown;

    var img_element = '';
    var info_element = '';
    if (humans == 0 && (animals != 0 || unknown_animals != 0)) {
        img_element = '<img src="/static/core/img/animals.png" />';
        info_element = '<span style="color: green;">There are only animals on the camera</span>';
    } else if (humans != 0 && (animals != 0 || unknown_animals != 0)) {
        img_element = '<img src="/static/core/img/animal_human.png" />';
        info_element = '<span style="color: red;">WARNING! Found a human near an animal</span>';
    } else if (humans == 0 && animals == 0 && unknown_animals == 0) {
        img_element = '<img src="/static/core/img/noone.png" />';
        info_element = '<span style="color: gray;">No one found on the camera</span>';
    } else if (humans != 0 && (animals == 0 && unknown_animals == 0)) {
        img_element = '<img src="/static/core/img/humans.png" />';
        info_element = '<span style="color: yellow;">Only human found on the camera</span>';
    }

    var drone_layout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">' + img_element + '</div>'
    );

    return {
        balloonContentBody: info_element,
        iconContentLayout: drone_layout
    }
}

function update_drone(old_drone, new_drone) {
    old_drone.geometry.setCoordinates([new_drone.latitude, new_drone.longtitude]);
    var new_properties = get_new_properties(new_drone);
    old_drone.properties.set({balloonContentBody: new_properties.balloonContentBody});
    old_drone.options.set({iconContentLayout: new_properties.iconContentLayout});
}

function create_new_drone(drone) {
    var properties = get_new_properties(drone);

    var created_drone = new ymaps.Placemark([drone.latitude, drone.longtitude], {
        balloonContentHeader: '<span class="description">Drone #' + drone.drone_id + '</span>',
        balloonContentBody: properties.balloonContentBody,
        hintContent: 'Drone #' + drone.drone_id
    }, {
        iconLayout: 'default#imageWithContent',
        iconImageHref: '/static/core/img/drone.png',
        iconImageSize: [67, 42],
        iconImageOffset: [-24, -24],
        iconContentOffset: [63, 0],
        iconContentLayout: properties.iconContentLayout
    });

    return created_drone;
}

ymaps.ready(function () {
    var map = new ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 9,
        type: 'yandex#satellite'
    }, {
        searchControlProvider: 'yandex#search'
    });

    var old_drones = {};

    var chatSocket = new WebSocket('ws://192.168.86.248:8080/frontend/');

    chatSocket.onmessage = function (e) {
        var new_drone = JSON.parse(e.data);

        if (new_drone.drone_id in old_drones) {
            update_drone(old_drones[new_drone.drone_id], new_drone);
        } else {
            var created_drone = create_new_drone(new_drone);
            old_drones[new_drone.drone_id] = created_drone;
            map.geoObjects.add(created_drone);
        }
    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };
});
