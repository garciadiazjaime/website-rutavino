var data = [], markers = [];
var map = '', left = '', right = '', bounds = '', marker_active = 'nan';
var arr_image = ['', 'vinedos_marker.png', 'restaurants_marker.png', 'hoteles_marker.png'];
var place_class = new Array('', 'vinedos', 'restaurantes', 'hoteles');

$(window).load(function(){
	openMint();
	closeMint();
	openPanelInfo();
	closePanelInfo();
});

rvbc = angular.module("rvbc", ['firebase']).config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    }
);

controllers = {};

/*
	Author: Jaime Garica
	Controller used in the application
*/
controllers.TodoController = function($scope, angularFire) {
	$scope.places = [];
	$scope.selected_place = {}

	var dataRef = new Firebase('https://larutadelvinobc.firebaseio.com/places');
	angularFire(dataRef, $scope, "places");

	
	dataRef.on('value', function(snapshot){
		data = snapshot.val();
		$scope.load_gmaps();
	});

	/*
		Author: Jaime Garcia
		Function to load action on anchor from places list (search)
	*/
	$scope.set_place_up = function(){
		$('#search_container').addClass('hide');
		$scope.clearActiveIcon();
		$scope.set_up_place(this.place);
		$scope.print_popup();
		$scope.print_name();
		var index = $scope.get_index();
		marker_active = index;
		$scope.active_marker(index);
		center_map(index);
		_gaq.push(['_trackEvent', 'SearchPOP', 'Click', $scope.selected_place.name]);
	}

	$scope.get_index = function(){
		for(var i=0; i<data.length; i++){
			if(data[i].lat == $scope.selected_place.lat
				&& data[i].lng == $scope.selected_place.lng)
				return i;
		}
		return -1;
	}

	/*
		Author: Jaime Garcia
		Function to show popup more information related to one place (more info anchor)
	*/
	$scope.show_more_info = function(){
		if($('#place_more_info').hasClass('active'))
		{
			var index = $scope.get_index();
			marker_active = index;
			$scope.print_popup();
			console.log($scope.selected_place.name);
			_gaq.push(['_trackEvent', 'ShowMore', 'Click', $scope.selected_place.name]);
		}
	}

	/*
		Author: Jaime Garcia
		Function to scroll modal to X category
	*/
	$scope.go_to_category = function(category){
		var element = $('#list_places').children(':first').find('.place_'+category).first();
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
	$scope.print_popup = function(){
		$('#profile_container').removeClass('hidden');
		$('#place_image').css('height', ($('.profile').height()*.3) );
		$('#place_image').css('background-size', "cover" );
		itemCloser();
	}

	/*
		Author: Jaime Garcia
		Function to set place information

	*/
	$scope.set_up_place = function(object){
		console.log(object);
		$scope.selected_place.name = object.name;
		$scope.selected_place.description = object.desc;
		$scope.selected_place.image = object.img;
		$scope.selected_place.address = object.address;
		$scope.selected_place.lat = object.lat;
		$scope.selected_place.lng = object.lng;
		$scope.selected_place.telephone = object.telephone;
		$scope.selected_place.type = object.type;
		$scope.selected_place.web = object.web;
		$scope.selected_place.type = object.type;
		$scope.selected_place.class = place_class[object.type];
		$scope.selected_place.marker_image = arr_image[object.type];
	}
	
	/*
		Author: Jaime Garcia
		Function to print name at the top
	*/
	$scope.print_name = function(){
		$('#place_more_info').addClass('active');
		$('#short_profile').removeClass('hide').removeClass('vinedos').removeClass('hoteles').removeClass('restaurantes').addClass($scope.selected_place.class);
	}

	$scope.active_marker = function(index){
		var tmp = $scope.selected_place.marker_image.split('.');
		markers[index].setIcon('./images/' + tmp[0] + "_active." + tmp[1]);
	}

	$scope.load_gmaps = function(){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBb0NHFvyZSBHgcA49cEx3JakM79osLr1M&sensor=true&callback=initialize";
		document.body.appendChild(script);
	}

	/*
		Author: Jaime Garcia
		Function attached to all of the markers in the map it helps with the click on marker
	*/
	$scope.markercontent = function(marker, place, i){
		console.log(place)
		console.log(i);
		google.maps.event.addListener(marker, 'click', function(){
			$scope.clearActiveIcon();
			marker_active = i;
			$scope.set_up_place(place);
			$scope.active_marker(i);
			$scope.print_name();
			$scope.$apply();
			_gaq.push(['_trackEvent', 'Marker', 'Click', $scope.selected_place.name]);
			//center_map(i);
		});
	}

	/*
		Author: Jaime Garcia
		Function to know user clic
	*/
	$scope.ga_update = function(category, event, label){
		_gaq.push(['_trackEvent', category, event, label]);
	}

	$scope.ga_update_search = function(){
		_gaq.push(['_trackEvent', 'SearchPOP', 'type', $scope.query]);	
	}

	$scope.ga_update_place_click = function(label){
		_gaq.push(['_trackEvent', 'PlacePOP', 'click', label + ': ' + $scope.selected_place.name]);		
	}

	/*
		Author: Jaime Garcia
		Function to clear last active marker from the map
	*/
	$scope.clearActiveIcon = function(){
		if(marker_active != 'nan')
			markers[marker_active].setIcon('./images/' + arr_image[data[marker_active].type]);
	}

	$scope.initialize = function(){
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
		

		for(i=0; i < data.length; i++)
		{
			var marker = new google.maps.Marker({	
				position: new google.maps.LatLng(data[i].lat, data[i].lng),
				map: map,
				icon: './images/' + arr_image[data[i].type],
			});	
			marker.setTitle(i.toString());
			$scope.markercontent(marker, data[i], i);
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
};

/*
	Author: Jaime Garcia
	Controller to handle GPS functions at this momento only save user GPS
*/
controllers.GPSController = function($scope, angularFire) {

	$scope.getLocation = function(){
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition($scope.showPosition, showError);
		}
	}

	$scope.showPosition = function(position){
		$scope.gps = [];
		var dataRef = new Firebase('https://larutadelvinobc.firebaseio.com/gps');
		angularFire(dataRef, $scope, "gps");		
		$scope.gps.push({latitude: position.coords.latitude, longitude:position.coords.longitude});
	}

	$scope.getLocation();	
};

rvbc.controller(controllers);

/*
	Author: Jaime Gacia
	Function to center maps based in the marker selected
*/
function center_map(index)
{
	var latLng = markers[index].getPosition();
	map.setCenter(latLng);
}

function initialize(latitude, longitude) {
	angular.element($('body')).scope().initialize()
}

function bounce_map()
{
	left = new google.maps.LatLng(data[29].lat, data[29].lng);
	right = new google.maps.LatLng(data[24].lat, data[24].lng)
	bounds = new google.maps.LatLngBounds(left, right);
	map.fitBounds(bounds);
}


function detectBrowser() {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map_canvas");

	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
	}
	else {
		mapdiv.style.width = '100%';
		mapdiv.style.height = '75%';
	}
}

/*
	Author: Jaime Garcia
	Function that activates the click on the links at the bottom (vinedos, restaurantes, hoteles)
*/
function control_places()
{
	$('#control_places a.naver').click(function(e){
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
function setAllMap(filter){
	for (var i = 0; i < markers.length; i++) {
		if($('#place_vinedos').hasClass('active') && data[i].type == 1)
			markers[i].setMap(map);
		else if($('#place_restaurantes').hasClass('active') && data[i].type == 2)
			markers[i].setMap(map);
		else if($('#place_hoteles').hasClass('active') && data[i].type == 3)
			markers[i].setMap(map);
		else
			markers[i].setMap(null);
	}
}

function showError(error)
{
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
			x.innerHTML="User denied the request for Geolocation."
		break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML="Location information is unavailable."
		break;
		case error.TIMEOUT:
			x.innerHTML="The request to get user location timed out."
		break;
		case error.UNKNOWN_ERROR:
			x.innerHTML="An unknown error occurred."
		break;
	}
}

// ************* FUNCIONES ALEX *******************

function itemCloser(){
	$('#profile_container .closer').click(function(e){
		e.preventDefault();
		//$('#profile_container .closer').remove();
		//$('.profile').remove();
		$('#profile_container').addClass('hidden');
	});
}
// ******************* Abrir y cerrar panel de Mint *****************
function openMint(){
	$('#mint_btn').click(function(e){
		e.preventDefault();
		$('#info_mint_container').removeClass('hide');
		  _gaq.push(['_trackEvent', 'Mint', 'Click', 'Logo']);
	});
}
function closeMint(){
	$('#info_mint_container .closer').click(function(e){
		e.preventDefault();
		$('#info_mint_container').addClass('hide');
	});

}
// ******************* Abrir y cerrar panel de búsqueda *****************
function openPanelInfo(){
	$('#search_btn').click(function(e){
		e.preventDefault();
		$('#search_container').removeClass('hide');
		if($(window).width()<=767){
			$('#list_places').css('height', $(window).height()-120)
		}
		else{
			$('#list_places').css('height', $(window).height()-180)
		}
		_gaq.push(['_trackEvent', 'SearchBTN', 'Click', '']);
	});
}
function closePanelInfo(){
	$('#search_container .closer').click(function(e){
		event.stopPropagation();
		$('#search_container').addClass('hide');
		e.preventDefault();	
	});
}
