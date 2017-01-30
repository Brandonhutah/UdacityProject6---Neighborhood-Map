var initialMarkers = [
  {
    name: "Test1",
    lat: 40.3,
    lon: -111.5,
    visible: true
  },
  {
    name: "Test2",
    lat: 40.3,
    lon: -111.6,
    visible: true
  },
  {
    name: "Test3",
    lat: 40.3,
    lon: -111.7,
    visible: true
  },
  {
    name: "Test4",
    lat: 40.3,
    lon: -111.8,
    visible: true
  },
  {
    name: "Test5",
    lat: 40.3,
    lon: -111.9,
    visible: true
  }
];

var map;
var MarkerList = [];

function initMap() {
  var uluru = {lat: 40.311893, lng: -111.7036667};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });

  initialMarkers.forEach(function(MarkerItem) {
    var marker = new google.maps.Marker({
      position: {lat: parseFloat(MarkerItem.lat), lng: parseFloat(MarkerItem.lon)},
      map: map,
      animation: google.maps.Animation.DROP,
    });

    marker.addListener('click', function() {
      if (marker.getAnimation() == null) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {marker.setAnimation(null);}, 1400);
      } 
      else {
        marker.setAnimation(null);
      }
    });

    MarkerItem.Marker = marker;

    MarkerList.push(new MarkerModel(MarkerItem));
  });

  ko.applyBindings(new MapMarkerController());
}

var MarkerModel = function(data) {
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.lon = ko.observable(data.lon);
  this.visible = ko.observable(data.visible);
  
  this.Marker = data.Marker;

  this.visibleOnMap = ko.computed(function() {
    if(this.visible() == true)
    {
      this.Marker.setMap(map);
    }
    else
    {
      this.Marker.setMap(null);
    }
  }, this);
}

var MapMarkerController = function() {
  var self = this;

  self.MarkerData = new ko.observableArray(MarkerList);

}


var ViewModel = function() {

}