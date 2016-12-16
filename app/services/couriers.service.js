angular.module('app')
.service('couriersService', ['$firebaseArray', function($firebaseArray) {

  // Initialize the Firebase SDK
  var config = {
    apiKey: 'AIzaSyB13NQ-bWR-FhFStLugaSxHiYzDsV7TzZE',
    authDomain: 'courierapp-70bd5.firebaseapp.com',
    databaseURL: 'https://courierapp-70bd5.firebaseio.com/',
    storageBucket: ''
  };

  firebase.initializeApp(config);
  const ref = firebase.database().ref().child('couriers');
  var couriers = $firebaseArray(ref);
  var courier;

  this.get = function(cb){
    if (!couriers.$resolved){
      couriers.$loaded().then(function(){
        cb(couriers);
      });
    }else{
      cb(couriers);
    }
  };

  this.update = function(param,property,key,cb){
    if (couriers){
      courier = couriers.$getRecord(key);
      if (courier && courier.hasOwnProperty(property)){
        courier[property] = param;
        couriers.$save(courier).then(function(updatedCourier) {
          cb(updatedCourier);
        });
      }
    }
  };

  this.remove = function(key,cb){
    if (couriers){
      var courierIndex = couriers.$indexFor(key);
      if (courierIndex > -1){
        couriers.$remove(courierIndex).then(function(){
          cb();
        });
      }
    }
  };

}]);
