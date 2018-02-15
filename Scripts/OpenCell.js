function OpenCell() { }

OpenCell.dragShape = null;
OpenCell.dragPixel = null;
OpenCell.MapDivId = 'theMap';
OpenCell._map = null;
OpenCell._points = [];
OpenCell._shapes = [];
OpenCell.ipInfoDbKey = '';


OpenCell.LoadMap = function (latitude, longitude, onMapLoaded) {

    OpenCell._map = new Microsoft.Maps.Map(document.getElementById('theMap'), {});
    // Create draggable Pin in the center
    var center = OpenCell._map.getCenter();
    var Location = Microsoft.Maps.Location;
    var Pushpin = Microsoft.Maps.Pushpin;
  
    if (latitude != null && longitude != null) {
        this._map.setView({
            center: new Microsoft.Maps.Location(latitude, longitude),
            zoom: 15
        });
        OpenCell._pins = new Pushpin(new Location(latitude, longitude), { color: '#00f', draggable: true });
    }
    else {
        OpenCell._pins = new Pushpin(new Location(center.latitude, center.longitude), { color: '#00f', draggable: true });

    }
    OpenCell._map.entities.push(OpenCell._pins);
    // Binding the events
    OpenCell.EnableCallback();
}

OpenCell.EnableCallback = function () {

    var Events = Microsoft.Maps.Events;
    Events.addHandler(OpenCell._pins, 'drag', function (e) { onMouseUp(e); });
}

function onMouseUp(e) {
    var loc = e.location;
    $("#lat").val(loc.latitude.toString());
    $("#lon").val(loc.longitude.toString());
}

OpenCell.LoadPins = function (latitude, longitude) {

    OpenCell._map = new Microsoft.Maps.Map(document.getElementById('theMap'), {});
    // Create draggable Pin in the center
    var center = OpenCell._map.getCenter();
    var Location = Microsoft.Maps.Location;
    var Pushpin = Microsoft.Maps.Pushpin;

    if (latitude != null && longitude != null) {
        this._map.setView({
            center: new Microsoft.Maps.Location(latitude, longitude),
            zoom: 15
        });
        OpenCell._pins = new Pushpin(new Location(latitude, longitude), { color: '#00f', draggable: false });
    }
    else {
        OpenCell._pins = new Pushpin(new Location(center.latitude, center.longitude), { color: '#00f', draggable: false });

    }
    OpenCell._map.entities.push(OpenCell._pins);
    // Binding the events
    //OpenCell.EnableCallback();
}



function onMouseDown(id,e)  {
    if (e.elementID != null) {
        OpenCell.dragShape = OpenCell._map.GetShapeByID(e.elementID);
        return true;
    }
}

function onMouseMove(id,e) {
    if (OpenCell.dragShape != null) {
        var x = e.mapX;
        var y = e.mapY;
        OpenCell.dragPixel = new VEPixel(x, y);
        var LatLong = OpenCell._map.PixelToLatLong(OpenCell.dragPixel);
        OpenCell.dragShape.SetPoints(LatLong);
        return true;
    }
}

OpenCell.ClearMap = function () {
    if (OpenCell._map != null) {
        OpenCell._map.Clear();
    }
    OpenCell._points = [];
    OpenCell._shapes = [];}



OpenCell.FindAddressOnMap = function (where) {
    var numberOfResults = 1;
    var setBestMapView = true;
    var showResults = true;
    var defaultDisambiguation = true;

    OpenCell._map.Find("", where, null, null, null,
                         numberOfResults, showResults, true, defaultDisambiguation,
                         setBestMapView, OpenCell._callbackForLocation);
}

OpenCell._callbackForLocation = function (layer, resultsArray, places, hasMore, VEErrorMessage) {
    OpenCell.ClearMap();

    if (places == null) {
        OpenCell._map.ShowMessage(VEErrorMessage);
        return;
    }

    //Make a pushpin for each place we find
    $.each(places, function (i, item) {
        var description = "";
        if (item.Description !== undefined) {
            description = item.Description;
        }
        var LL = new VELatLong(item.LatLong.Latitude,
                        item.LatLong.Longitude);

        OpenCell.LoadPin(LL, item.Name, description, true);
    });

    //Make sure all pushpins are visible
    if (OpenCell._points.length > 1) {
        OpenCell._map.SetMapView(OpenCell._points);
    }

    //If we've found exactly one place, that's our address.
    //lat/long precision was getting lost here with toLocaleString, changed to toString
    if (OpenCell._points.length === 1) {
        $("#Latitude").val(OpenCell._points[0].Latitude.toString());
        $("#Longitude").val(OpenCell._points[0].Longitude.toString());
    }
}

OpenCell._callbackUpdateMapDonors = function (layer, resultsArray, places, hasMore, VEErrorMessage) {
    var center = OpenCell._map.GetCenter();

    $.post("/Search/SearchByLocation",
           { latitude: center.Latitude, longitude: center.Longitude },
           OpenCell._renderDonors,
           "json");
}

OpenCell._renderDonors = function (Donors) {
    $("#DonorsList").empty();

    OpenCell.ClearMap();

    $.each(Donors, function (i, Donors) {

        var LL = new VELatLong(Donors.Latitude, Donors.Longitude, 0, null);

        // Add Pin to Map
        OpenCell.LoadPin(LL, _getDonorsLinkHTML(Donors), _getDonorsDescriptionHTML(Donors), false);

        //Add a Donors to the <ul> DonorsList on the right
        $('#DonorsList').append($('<li/>')
                        .attr("class", "DonorsItem")
                        .append(_getDonorsLinkHTML(Donors))
                        .append($('<br/>'))
                        .append(_getDonorsDate(Donors, "mmm d"))
                        .append(" with " + _getRSVPMessage(Donors.RSVPCount)));
    });

    // Adjust zoom to display all the pins.
    if (OpenCell._points.length > 1) {
        OpenCell._map.SetMapView(OpenCell._points);
    }

    // Display the event's pin-bubble on hover.
    $(".DonorsItem").each(function (i, Donors) {
        $(Donors).hover(
            function () { OpenCell._map.ShowInfoBox(OpenCell._shapes[i]); },
            function () { OpenCell._map.HideInfoBox(OpenCell._shapes[i]); }
        );
    });

}

OpenCell.onEndDrag = function (e) {
    $("#Latitude").val(e.LatLong.Latitude.toString());
    $("#Longitude").val(e.LatLong.Longitude.toString());
}



