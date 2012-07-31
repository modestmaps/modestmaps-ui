if (typeof MMui === 'undefined') MMui = {};

// Add zoom links, which can be styled as buttons, to a `modestmaps.Map`
// control. This function can be used chaining-style with other
// chaining-style controls.
MMui.fullscreen = function() {
    // true: fullscreen
    // false: minimized
    var fullscreened = false,
        fullscreen = {},
        a = document.createElement('a'),
        map,
        body = document.body,
        smallSize;

    a.className = 'map-fullscreen';
    a.href = '#fullscreen';
    // a.innerHTML = 'fullscreen';

    function click(e) {
        MM.cancelEvent(e);
        if (fullscreened) {
            fullscreen.original();
        } else {
            fullscreen.full();
        }
    }

    function setSize(w, h) {
        map.dimensions = new MM.Point(w, h);
        map.parent.style.width = Math.round(map.dimensions.x) + 'px';
        map.parent.style.height = Math.round(map.dimensions.y) + 'px';
        map.dispatchCallback('resized', map.dimensions);
    }

    fullscreen.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return fullscreen;
    };

    // Modest Maps demands an absolute height & width, and doesn't auto-correct
    // for changes, so here we save the original size of the element and
    // restore to that size on exit from fullscreen.
    fullscreen.add = function() {
        MM.addEvent(a, 'click', click);
        map.parent.appendChild(a);
        return fullscreen;
    };

    fullscreen.remove = function() {
        MM.removeEvent(a, 'click', click);
        if (a.parentNode) a.parentNode.removeChild(a);
        return fullscreen;
    };

    fullscreen.full = function() {
        if (fullscreened) { return; } else { fullscreened = true; }
        smallSize = [map.parent.offsetWidth, map.parent.offsetHeight];
        map.parent.className += ' map-fullscreen-map';
        body.className += ' map-fullscreen-view';
        setSize(map.parent.offsetWidth, map.parent.offsetHeight);
        return fullscreen;
    };

    fullscreen.original = function() {
        if (!fullscreened) { return; } else { fullscreened = false; }
        map.parent.className = map.parent.className.replace(' map-fullscreen-map', '');
        body.className = body.className.replace(' map-fullscreen-view', '');
        setSize(smallSize[0], smallSize[1]);
        return fullscreen;
    };

    fullscreen.element = function() {
        return a;
    };

    fullscreen.appendTo = function(elem) {
        MMui.u.$(elem).appendChild(a);
        return fullscreen;
    };

    return fullscreen;
};
