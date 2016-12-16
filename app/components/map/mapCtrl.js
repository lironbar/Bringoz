'use strict';
angular.
module('app').
component('appComp', {
	templateUrl: 'app/components/map/map.html',
	controller: ['$scope','NgMap', 'couriersService','geoLocationFactory',
	function movieCtrl($scope, NgMap, couriersService, geoLocationFactory) {

		const DEFAULT_COURIER_NAME = 'Annonymus';
		var selfCourierKey;
		var selfCourierMarkerOptions = {
			'width': 38,
			'height':34,
			'primaryColor': '#' + Math.floor(Math.random()*16777215).toString(16),
			'cornerColor': '#FFFFFF',
			'strokeColor': '#000000'
		};
		var selfCourierMarker = MapIconMaker.createMarkerIcon(selfCourierMarkerOptions);

		// get all couriers
		couriersService.get(function(couriers){
			if (couriers){

				// save couriers on scope
				$scope.couriers = couriers;

				// toggle courier
				$scope.toggleCourier = function(){

					$scope.switchDisabled = true;

					if ($scope.courierStatus){

						// add self courier
						geoLocationFactory.get(function(position){

							if (position){

								var courier = {
									name: $scope.name || DEFAULT_COURIER_NAME,
									location: [position.coords.latitude,position.coords.longitude],
									icon: selfCourierMarker.icon.url

								};

								$scope.couriers.$add(courier).then(function(insertedCourier) {
									selfCourierKey = insertedCourier.key;
									$scope.switchDisabled = false;
								});

							} else {
								alert("Error: Cannot get current location.");
								$scope.switchDisabled = false;
							}
						});
					} else {
						// remove self courier
						if (selfCourierKey){
							couriersService.remove(selfCourierKey,function(){
								selfCourierKey = undefined;
								$scope.switchDisabled = false;
							});
						}
					}
				};

				// watch and handle self courier name
				$scope.$watch('name',function(name){
					if (selfCourierKey){
						couriersService.update(name || DEFAULT_COURIER_NAME ,'name',selfCourierKey,function(updatedCourier){
							if (debug)
							console.debug('Courier updated',updatedCourier.$id);
						});
					}
				});

			}
		});

		// remove self courier on unload
		// onunload & onbeforeunload for different browsers
		window.onunload = window.onbeforeunload = function () {
			if(selfCourierKey) {
				couriersService.remove(selfCourierKey);
			}
		};

	}]
});
