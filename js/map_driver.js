var map = function initMap() {
        var uluru = {lat: 40.311893, lng: -111.7036667};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: uluru
        });
}

var initialMarkers = [
  {
    name: "Test1",
    label: "A",
    lat: 40,
    lon: -111
  },
  {
    name: "Test2",
    label: "B",
    lat: 41,
    lon: -111
  },
  {
    name: "Test3",
    label: "C",
    lat: 42,
    lon: -111
  },
  {
    name: "Test4",
    label: "D",
    lat: 43,
    lon: -111
  },
  {name: "Test5",
    label: "E",
    lat: 44,
    lon: -111
  }
];

var MarkerModel = function(data) {
  this.name = ko.observable(data.name);
  this.label = ko.observable(data.label);
  this.lat = ko.observable(data.lat);
  this.lon = ko.observable(data.lon);
  this.listText = ko.computed(function() {
    return this.label() + " - " + this.name();
  }, this)
}

var MapMarkerController = function() {
  var self = this;

  this.MarkerData = [];
  this.Markers = [];

  initialMarkers.forEach(function(MarkerItem) {
    self.MarkerData.push(new MarkerModel(MarkerItem));
  });

  initialMarkers.forEach(function(marker) {
    var newMarker = new google.Maps.Marker({position: {lat:  marker.lat, lng: marker.lon}, map: map});
    self.Markers.push(newMarker);
  })
}

ko.applyBindings(new MapMarkerController());