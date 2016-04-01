// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var queryCtrl = angular.module('findAroundCtrl', ['geolocation','gservice']);
queryCtrl.controller('findAroundCtrl', function($scope, $rootScope, geolocation, gservice){



    var geocoder;
    var map ;
    var markers = Array();
    var infos = Array();


        var initialize = function() {
            // prepare Geocoder
            $scope.geocoder = new google.maps.Geocoder();

            // Set the initial position

            var myLatlng = new google.maps.LatLng(24.44, 82.11);


            var mapOptions = {
                zoom: 4,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);            

        }

// clear overlays function
var clearOverlays = function() {
    if (markers) {
        for (i in markers) {
            $scope.markers[i].setMap(null);
        }
        $scope.markers = [];
        $scope.infos = [];
    }
}

// clear infos function
var clearInfos = function() {
    if (infos) {
        for (i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}

// find address function
$scope.findAddress = function() {
    var address = $scope.formData.zipcode;

    // script uses our 'geocoder' in order to find location by address name
    $scope.geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok

            // we will center map
            var addrLocation = results[0].geometry.location;
            $scope.map.setCenter(addrLocation);

            // store current coordinates into hidden variables
            $scope.formData.latitude = results[0].geometry.location.lat();
            $scope.formData.longitude = results[0].geometry.location.lng();



            // and then - add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// find custom places function
$scope.findPlaces = function() {

    // // prepare variables (filter)
    // var type = document.getElementById('gmap_type').value;
    // var radius = document.getElementById('gmap_radius').value;
    // // var keyword = document.getElementById('gmap_keyword').value;

    var type = $scope.formData.search_type;
    var radius = $scope.formData.radius;
    var lat = $scope.formData.latitude;
    var lng = $scope.formData.longitude;


    // var lat = document.getElementById('lat').value;
    // var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
        location: cur_location,
        radius: radius,
        types: [type]
    };
    // if (keyword) {
    //     request.keyword = [keyword];
    // }

    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
}

// create markers (from 'findPlaces' function)
var createMarkers = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we have found something - clear map (overlays)
        $scope.clearOverlays();

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            $scope.createMarker(results[i]);
        }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        alert('Sorry, nothing is found');
    }
}

// creare single marker function
$scope.createMarker = function(obj) {

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
    });
    $scope.markers.push(mark);

    // prepare info window
    var infowindow = new google.maps.InfoWindow({
        content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name + 
        '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
    });

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        $scope.clearInfos();
        $scope.infowindow.open(map,mark);
    });
    $scope.infos.push(infowindow);
}

// initialization
google.maps.event.addDomListener(window, 'load', initialize);



});

