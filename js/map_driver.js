function initMap() {
        var uluru = {lat: 40.311893, lng: -111.7036667};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: uluru
        });
      }