angular.module('app')
.factory('geoLocationFactory', geoLocationFactory);

function geoLocationFactory(){

  const ERROR_MSG = 'Unable to retrieve geo location';

  return {
    get: get
  };

  function get(cb){
    if (!navigator.geolocation){
      alert(errMsg);
    } else {
      navigator.geolocation.getCurrentPosition(function(position){
        cb(position);
      }, function(err){
        alert(ERROR_MSG + ': ' + (err && err.message) ? err.message : '');
      });

    }
  }

};
