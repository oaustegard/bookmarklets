javascript:(function(){
/* @title: Google Maps to Earth */
/* @description: Opens the current Google Maps location in Google Earth */
    var mapsUrl = window.location.href;
    var coordsMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    var searchTermMatch = mapsUrl.match(/place\/([^\/]+)\//);

    if (coordsMatch) {
        var lat = coordsMatch[1];
        var lng = coordsMatch[2];
        var searchTerm = searchTermMatch ? decodeURIComponent(searchTermMatch[1].replace(/\+/g, ' ')) : '';
        var earthUrl = "https://earth.google.com/web/search/"+searchTerm+"/@"+lat+","+lng+",0a,100000d,0y,0h,60t,0r";
        window.open(earthUrl, '_blank');
    } else {
        alert("Could not find coordinates in the URL");
    }
})();
