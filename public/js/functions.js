var data = [],
	markers = [];
var map = '',
	left = '',
	right = '',
	bounds = '',
	marker_active = 'nan';
var arr_image = ['', 'vinedos_marker.png', 'restaurants_marker.png', 'hoteles_marker.png'];
var place_class = new Array('', 'vinedos', 'restaurantes', 'hoteles');

const selectedPlace = {};

$(window).load(function () {
	openMint();
	closeMint();
	openPanelInfo();
	closePanelInfo();
});

rvbc = angular.module("rvbc", ['firebase']).config(function ($interpolateProvider) {
	$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

controllers = {};

/*
	Author: Jaime Garica
	Controller used in the application
*/
controllers.TodoController = function ($scope, angularFire) {
	$scope.places = [];

	load_gmaps();

	/*
		Author: Jaime Garcia
		Function to load action on anchor from places list (search)
	*/
	$scope.set_place_up = function () {
		$('#search_container').addClass('hide');
		$scope.clearActiveIcon();
		$scope.set_up_place(this.place);
		$scope.print_popup(this.place);
		print_name();
		var index = $scope.get_index();
		marker_active = index;
		$scope.active_marker(index);
		center_map(index);
		_gaq.push(['_trackEvent', 'SearchPOP', 'Click', selectedPlace.name]);
	}

	$scope.get_index = function () {
		for (var i = 0; i < data.length; i++) {
			if (data[i].lat == selectedPlace.lat &&
				data[i].lng == selectedPlace.lng)
				return i;
		}
		return -1;
	}

	/*
		Author: Jaime Garcia
		Function to show popup more information related to one place (more info anchor)
	*/
	$scope.show_more_info = function () {
		if ($('#place_more_info').hasClass('active')) {
			var index = $scope.get_index();
			marker_active = index;
			$scope.print_popup(selectedPlace);
		}
	}

	/*
		Author: Jaime Garcia
		Function to scroll modal to X category
	*/
	$scope.go_to_category = function (category) {
		var element = $('#list_places').children(':first').find('.place_' + category).first();
		var top = element.position().top;
		$('#list_places').animate({
			scrollTop: top
		});
		_gaq.push(['_trackEvent', 'SearchPOP', 'Click', 'Category: ' + place_class[category]]);
	}

	/*
	Author: Jaime Garcia
	Function that shows modal with all the place information
	*/
	$scope.print_popup = function (place) {
		console.log('here!!!', place)
		$('#profile_container').removeClass('hidden');
		$('#place_image').css('height', ($('.profile').height() * .3));
		$('#place_image').css('background-size', "cover");
		itemCloser();

		place_class.map(className => $('#profile_container .profile.container').removeClass(className))
		$('#profile_container .profile.container').addClass(place.class)
		$('#profile_container .title').text(place.name)
		$('#profile_container #place_image').css('background-image', `url(/images/main_image/${place.image})`);
		$('#profile_container #place-description').text(place.description)
		$('#profile_container #place-address').text(place.address)
		$('#profile_container #place-telephone').text(place.telephone)
		$('#profile_container #place-telephone').text(place.telephone).attr('href', `tel:${place.telephone}`)
		$('#profile_container #place-web').text(place.web).attr('href', place.web)
	}

	function load_gmaps() {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBb0NHFvyZSBHgcA49cEx3JakM79osLr1M&sensor=true&callback=initialize";
		document.body.appendChild(script);
	}

	/*
		Author: Jaime Garcia
		Function to know user clic
	*/
	$scope.ga_update = function (category, event, label) {
		_gaq.push(['_trackEvent', category, event, label]);
	}

	$scope.ga_update_search = function () {
		_gaq.push(['_trackEvent', 'SearchPOP', 'type', $scope.query]);
	}

	$scope.ga_update_place_click = function (label) {
		_gaq.push(['_trackEvent', 'PlacePOP', 'click', label + ': ' + selectedPlace.name]);
	}
};

rvbc.controller(controllers);

function print_name(place) {
	$('#place_more_info').addClass('active');
	$('#short_profile').removeClass('hide').removeClass('vinedos').removeClass('hoteles').removeClass('restaurantes').addClass(selectedPlace.class);
	$('#short_profile #place_name').text(place.name)
}

function active_marker(index) {
	var tmp = selectedPlace.marker_image.split('.');
	markers[index].setIcon('./images/' + tmp[0] + "_active." + tmp[1]);
}

function set_up_place(object) {
	selectedPlace.name = object.name;
	selectedPlace.description = object.desc;
	selectedPlace.image = object.img;
	selectedPlace.address = object.address;
	selectedPlace.lat = object.lat;
	selectedPlace.lng = object.lng;
	selectedPlace.telephone = object.telephone;
	selectedPlace.type = object.type;
	selectedPlace.web = object.web;
	selectedPlace.type = object.type;
	selectedPlace.class = place_class[object.type];
	selectedPlace.marker_image = arr_image[object.type];
}

function clearActiveIcon() {
	if (marker_active != 'nan')
		markers[marker_active].setIcon('./images/' + arr_image[data[marker_active].type]);
}

function markercontent(marker, place, i) {
	google.maps.event.addListener(marker, 'click', function () {
		clearActiveIcon();
		marker_active = i;
		set_up_place(place);
		active_marker(i);
		print_name(place);
		//center_map(i);
	});
}

function initialize() {
	var MY_MAPTYPE_ID = 'custom_style';
	var latitude = typeof latitude !== 'undefined' ? latitude : 32.117741;
	var longitude = typeof longitude !== 'undefined' ? longitude : -116.542541;
	var minZoomLevel = 5;
	var mapOptions = {
		zoom: minZoomLevel,
		center: new google.maps.LatLng(latitude, longitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		//disableDefaultUI: true
		mapTypeId: MY_MAPTYPE_ID,
		mapTypeControl: false,
	}

	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	bounce_map();


	for (i = 0; i < data.length; i++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(data[i].lat, data[i].lng),
			map: map,
			icon: './images/' + arr_image[data[i].type],
		});
		marker.setTitle(i.toString());
		markercontent(marker, data[i], i);
		markers.push(marker);
	}

	var styledMapOptions = {
		name: MY_MAPTYPE_ID
	};

	var customMapType = new google.maps.StyledMapType(map_custome_style, styledMapOptions);
	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

	//detectBrowser();
	//control_places();
}

/*
	Author: Jaime Gacia
	Function to center maps based in the marker selected
*/
function center_map(index) {
	var latLng = markers[index].getPosition();
	map.setCenter(latLng);
}

function bounce_map() {
	data = window.placesRef.places;
	left = new google.maps.LatLng(data[29].lat, data[29].lng);
	right = new google.maps.LatLng(data[24].lat, data[24].lng)
	bounds = new google.maps.LatLngBounds(left, right);
	map.fitBounds(bounds);
}


function detectBrowser() {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map_canvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	} else {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '75%';
	}
}

/*
	Author: Jaime Garcia
	Function that activates the click on the links at the bottom (vinedos, restaurantes, hoteles)
*/
function control_places() {
	$('#control_places a.naver').click(function (e) {
		e.preventDefault();
		clearActiveIcon();
		marker_active = 'nan';
		$(this).parent().toggleClass('active');
		$('#place_name').text('');
		$('#place_more_info').removeClass('active');
		setAllMap();
		bounce_map();
	});
}

/*
	Author: Jaime Garcia
	Function to show the markers in the map, it takes into account which control place is selected
*/
function setAllMap(filter) {
	for (var i = 0; i < markers.length; i++) {
		if ($('#place_vinedos').hasClass('active') && data[i].type == 1)
			markers[i].setMap(map);
		else if ($('#place_restaurantes').hasClass('active') && data[i].type == 2)
			markers[i].setMap(map);
		else if ($('#place_hoteles').hasClass('active') && data[i].type == 3)
			markers[i].setMap(map);
		else
			markers[i].setMap(null);
	}
}

function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			x.innerHTML = "User denied the request for Geolocation."
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML = "Location information is unavailable."
			break;
		case error.TIMEOUT:
			x.innerHTML = "The request to get user location timed out."
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML = "An unknown error occurred."
			break;
	}
}

// ************* FUNCIONES ALEX *******************

function itemCloser() {
	$('#profile_container .closer').click(function (e) {
		e.preventDefault();
		//$('#profile_container .closer').remove();
		//$('.profile').remove();
		$('#profile_container').addClass('hidden');
	});
}
// ******************* Abrir y cerrar panel de Mint *****************
function openMint() {
	$('#mint_btn').click(function (e) {
		e.preventDefault();
		$('#info_mint_container').removeClass('hide');
		_gaq.push(['_trackEvent', 'Mint', 'Click', 'Logo']);
	});
}

function closeMint() {
	$('#info_mint_container .closer').click(function (e) {
		e.preventDefault();
		$('#info_mint_container').addClass('hide');
	});

}
// ******************* Abrir y cerrar panel de búsqueda *****************
function openPanelInfo() {
	$('#search_btn').click(function (e) {
		e.preventDefault();
		$('#search_container').removeClass('hide');
		if ($(window).width() <= 767) {
			$('#list_places').css('height', $(window).height() - 120)
		} else {
			$('#list_places').css('height', $(window).height() - 180)
		}
		_gaq.push(['_trackEvent', 'SearchBTN', 'Click', '']);
	});
}

function closePanelInfo() {
	$('#search_container .closer').click(function (e) {
		event.stopPropagation();
		$('#search_container').addClass('hide');
		e.preventDefault();
	});
}
