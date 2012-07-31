MMui = MMui || {};

MMui.hash = function() {
    var map,
        hash = {},
        s0, // old hash
        lat = 90 - 1e-8;  // allowable latitude range

    function getState() {
        return location.hash.substring(1);
    }

    function pushState(state) {
        var l = window.location;
        l.replace(l.toString().replace((l.hash || /$/), '#' + state));
    }

    function parseHash(s) {
        var args = s.split('/');
        for (var i = 0; i < args.length; i++) {
            args[i] = Number(args[i]);
            if (isNaN(args[i])) return true;
        }
        if (args.length < 3) {
            // replace bogus hash
            return true;
        } else if (args.length == 3) {
            map.setCenterZoom(
                new MM.Location(args[1], args[2]),
                args[0]);
        }
    }

    function move() {
        var center = map.getCenter(),
            zoom = map.getZoom(),
            precision = Math.max(
                0,
                Math.ceil(Math.log(zoom) / Math.LN2)),
            s1 = [zoom.toFixed(2),
                center.lat.toFixed(precision),
                center.lon.toFixed(precision)
            ].join('/');

        if (s0 !== s1) {
            s0 = s1;
            // don't recenter the map!
            pushState(s0);
        }
    }

    function stateChange(state) {
        // ignore spurious hashchange events
        if (state === s0) return;
        if (parseHash(s0 = state)) {
            // replace bogus hash
            move();
        }
    }

    var _move = MMui.u.throttle(move, 500);

    hash.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return hash;
    };

    hash.add = function() {
        stateChange(getState());
        map.addCallback('drawn', _move);
        return hash;
    };

    hash.remove = function() {
        map.removeCallback('drawn', _move);
        return hash;
    };

    return hash;
};
