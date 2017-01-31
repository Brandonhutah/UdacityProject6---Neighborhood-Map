var initialMarkers = [
    {name: "Salt Lake City",
            lat: 40.7774076,
            lon: -111.890366,
            visible: true,
            infoUrl: "http://en.wikipedia.org/w/api.php?action=opensearch&search=salt%20lake%20city&format=json&callback=wikiCallBack"},
    {name: "Ancestry.com",
            lat: 40.4352639,
            lon: -111.873400,
            visible: true,
            infoUrl: "http://en.wikipedia.org/w/api.php?action=opensearch&search=Ancestry.com&format=json&callback=wikiCallBack"},
    {name: "Orem",
            lat: 40.2952767,
            lon: -111.7304819,
            visible: true,
            infoUrl: "http://en.wikipedia.org/w/api.php?action=opensearch&search=orem&format=json&callback=wikiCallBack"},
    {name: "Bridal Veil Falls",
            lat: 40.3382884,
            lon: -111.6034961,
            visible: true,
            infoUrl: "http://en.wikipedia.org/w/api.php?action=opensearch&search=Bridal%20Veil%20Falls&format=json&callback=wikiCallBack"},
    {name: "Arches National Park",
            lat: 38.712388,
            lon: -109.582068,
            visible: true,
            infoUrl: "http://en.wikipedia.org/w/api.php?action=opensearch&search=Arches%20National%20Park&format=json&callback=wikiCallBack"}
];

var map;
var MarkerList = [];

function initMap() {
  var loc = {lat: 40.311893, lng: -111.7036667};
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: loc
  });

  initialMarkers.forEach(function(MarkerItem) {
    var marker = new google.maps.Marker({
      position: {lat: parseFloat(MarkerItem.lat), lng: parseFloat(MarkerItem.lon)},
      map: map,
      animation: google.maps.Animation.DROP
    });

    marker.addListener("click", function() {
      if (marker.getAnimation() === null) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {marker.setAnimation(null);}, 1400);
        makeAjaxRequest(MarkerItem);
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

function selectMarker(data) {
  if (data.Marker.getAnimation() === null) {
    data.Marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {data.Marker.setAnimation(null);}, 1400);
    makeAjaxRequest(data);
  }
  else {
    data.Marker.setAnimation(null);
  }
}

function makeAjaxRequest(data) {
  var content = "<ul>";

  try
  {
    $.ajax(data.infoUrl, {dataType: "jsonp", success: function( response ) {
      var articleList = response[1];
      articleList.forEach(function (value) {
        var url = "http://en.wikipedia.org/wiki/" + value;
        content += '<li><a href="' + url + '">' + value + '</a></li>';
      });
      content += "</ul>";

      showInfoWindow(data.Marker, content);
    }});
  }
  catch(err) {
    content += "<li>Unable to retrieve data for map marker.</li>";
  }
}

function showInfoWindow(marker, content) {
  var info = new google.maps.InfoWindow({content: content});

  info.open(map, marker);
}

var MarkerModel = function(data) {
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.lon = ko.observable(data.lon);
  this.visible = ko.observable(data.visible);
  this.infoUrl = data.infoUrl;

  this.Marker = data.Marker;

  this.visibleOnMap = ko.computed(function() {
    if(this.visible() === true)
    {
      this.Marker.setMap(map);
    }
    else
    {
      this.Marker.setMap(null);
    }
  }, this);
};

var MapMarkerController = function() {
  var self = this;

  self.MarkerData = new ko.observableArray(MarkerList);
  self.filterStr = ko.observable("");
  self.visible = ko.observableArray([]);

  self.visible().forEach(function(el) {
  });


  self.filter = ko.pureComputed({
    read: function() {
      return self.filterStr();
    },
    write: function(value) {
      self.filterStr(value);
      self.MarkerData(MarkerList.filter(function (el) {
        if (el.name().toLowerCase().includes(self.filterStr())) {
          el.visible(true);
          return true;
        }
        else {
          el.visible(false);
          return false;
        }
      }));
    }
  });

  self.selectMarker = function(data) {
    selectMarker(data);
  };
};