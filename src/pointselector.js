if (typeof MMui === 'undefined') MMui = {};

// This takes an object of options:
//
// * `callback`: a function called with an array of `com.modestmaps.Location`
//   objects when the map is edited
//
// It also exposes a public API function: `addLocation`, which adds a point
// to the map as if added by the user.
MMui.pointselector = function() {
    var map,
        mouseDownPoint = null,
        mouseUpPoint = null,
        callback = null,
        tolerance = 5,
        overlayDiv,
        pointselector = {},
        callbackManager = new MM.CallbackManager(pointselector, ['change']),
        locations = [];

    // Currently locations in this control contain circular references to elements.
    // These can't be JSON encoded, so here's a utility to clean the data that's
    // spit back.
    function cleanLocations(locations) {
        var o = [];
        for (var i = 0; i < locations.length; i++) {
            o.push(new MM.Location(locations[i].lat, locations[i].lon));
        }
        return o;
    }

    // Attach this control to a map by registering callbacks
    // and adding the overlay

    // Redraw the points when the map is moved, so that they stay in the
    // correct geographic locations.
    function drawPoints() {
        var offset = new MM.Point(0, 0);
        for (var i = 0; i < locations.length; i++) {
            var point = map.locationPoint(locations[i]);
            if (!locations[i].pointDiv) {
                locations[i].pointDiv = document.createElement('div');
                locations[i].pointDiv.className = 'map-point-div';
                locations[i].pointDiv.style.position = 'absolute';
                locations[i].pointDiv.style.display = 'block';
                // TODO: avoid circular reference
                locations[i].pointDiv.location = locations[i];
                // Create this closure once per point
                MM.addEvent(locations[i].pointDiv, 'mouseup',
                    (function selectPointWrap(e) {
                    var l = locations[i];
                    return function(e) {
                        MM.removeEvent(map.parent, 'mouseup', mouseUp);
                        pointselector.deleteLocation(l, e);
                    };
                })());
                map.parent.appendChild(locations[i].pointDiv);
            }
            locations[i].pointDiv.style.left = point.x + 'px';
            locations[i].pointDiv.style.top = point.y + 'px';
        }
    }

    function mouseDown(e) {
        mouseDownPoint = MM.getMousePoint(e, map);
        MM.addEvent(map.parent, 'mouseup', mouseUp);
    }

    // Remove the awful circular reference from locations.
    // TODO: This function should be made unnecessary by not having it.
    function mouseUp(e) {
        if (!mouseDownPoint) return;
        mouseUpPoint = MM.getMousePoint(e, map);
        if (MM.Point.distance(mouseDownPoint, mouseUpPoint) < tolerance) {
            pointselector.addLocation(map.pointLocation(mouseDownPoint));
            callbackManager.dispatchCallback('change', cleanLocations(locations));
        }
        mouseDownPoint = null;
    }

    // API for programmatically adding points to the map - this
    // calls the callback for ever point added, so it can be symmetrical.
    // Useful for initializing the map when it's a part of a form.
    pointselector.addLocation = function(location) {
        locations.push(location);
        drawPoints();
        callbackManager.dispatchCallback('change', cleanLocations(locations));
        return pointselector;
    };

    // TODO set locations
    pointselector.locations = function() {
        if (!arguments.length) return locations;
    };

    pointselector.addCallback = function(event, callback) {
        callbackManager.addCallback(event, callback);
        return pointselector;
    };

    pointselector.removeCallback = function(event, callback) {
        callbackManager.removeCallback(event, callback);
        return pointselector;
    };

    pointselector.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return pointselector;
    };

    pointselector.add = function() {
        MM.addEvent(map.parent, 'mousedown', mouseDown);
        map.addCallback('drawn', drawPoints);
        return pointselector;
    };

    pointselector.remove = function() {
        MM.removeEvent(map.parent, 'mousedown', mouseDown);
        map.removeCallback('drawn', drawPoints);
        for (var i = locations.length - 1; i > -1; i--) {
            pointselector.deleteLocation(locations[i]);
        }
        return pointselector;
    };

    pointselector.deleteLocation = function(location, e) {
        if (!e || confirm('Delete this point?')) {
            location.pointDiv.parentNode.removeChild(location.pointDiv);
            for (var i = 0; i < locations.length; i++) {
                if (locations[i] === location) {
                    locations.splice(i, 1);
                    break;
                }
            }
            callbackManager.dispatchCallback('change', cleanLocations(locations));
        }
    };

    return pointselector;
};
