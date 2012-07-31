if (typeof MMui === 'undefined') MMui = {};

MMui.zoomer = function() {
    var zoomer = {},
        smooth = true,
        map;

    var zoomin = document.createElement('a'),
        zoomout = document.createElement('a');

    function zIn(e) {
        MM.cancelEvent(e);
        if (smooth && map.ease) {
            map.ease.zoom(map.zoom() + 1).run(50);
        } else {
            map.zoomIn();
        }
    }

    function zOut(e) {
        MM.cancelEvent(e);
        if (smooth && map.ease) {
            map.ease.zoom(map.zoom() - 1).run(50);
        } else {
            map.zoomOut();
        }
    }

    zoomin.innerHTML = '+';
    zoomin.href = '#';
    zoomin.className = 'zoomer zoomin';
    zoomout.innerHTML = '-';
    zoomout.href = '#';
    zoomout.className = 'zoomer zoomout';

    function updateButtons(map, e) {
        if (map.coordinate.zoom === map.coordLimits[0].zoom) {
            zoomout.className = 'zoomer zoomout zoomdisabled';
        } else if (map.coordinate.zoom === map.coordLimits[1].zoom) {
            zoomin.className = 'zoomer zoomin zoomdisabled';
        } else {
            zoomin.className = 'zoomer zoomin';
            zoomout.className = 'zoomer zoomout';
        }
    }

    zoomer.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return zoomer;
    };

    zoomer.add = function() {
        if (!map) return false;
        map.addCallback('drawn', updateButtons);
        zoomer.appendTo(map.parent);
        MM.addEvent(zoomin, 'mousedown', MM.cancelEvent);
        MM.addEvent(zoomin, 'dblclick', MM.cancelEvent);
        MM.addEvent(zoomout, 'mousedown', MM.cancelEvent);
        MM.addEvent(zoomout, 'dblclick', MM.cancelEvent);
        MM.addEvent(zoomout, 'touchstart', zOut);
        MM.addEvent(zoomout, 'click', zOut);
        MM.addEvent(zoomin, 'touchstart', zIn);
        MM.addEvent(zoomin, 'click', zIn);
        return zoomer;
    };

    zoomer.remove = function() {
        if (!map) return false;
        map.removeCallback('drawn', updateButtons);
        if (zoomin.parentNode) zoomin.parentNode.removeChild(zoomin);
        if (zoomout.parentNode) zoomout.parentNode.removeChild(zoomout);
        MM.addEvent(zoomin, 'mousedown', MM.cancelEvent);
        MM.addEvent(zoomin, 'dblclick', MM.cancelEvent);
        MM.addEvent(zoomout, 'mousedown', MM.cancelEvent);
        MM.addEvent(zoomout, 'dblclick', MM.cancelEvent);
        MM.addEvent(zoomout, 'touchstart', zOut);
        MM.addEvent(zoomout, 'click', zOut);
        MM.addEvent(zoomin, 'touchstart', zIn);
        MM.addEvent(zoomin, 'click', zIn);
        return zoomer;
    };

    zoomer.appendTo = function(elem) {
        MMui.u.$(elem).appendChild(zoomin);
        MMui.u.$(elem).appendChild(zoomout);
        return zoomer;
    };

    zoomer.smooth = function(x) {
        if (!arguments.length) return smooth;
        smooth = x;
        return zoomer;
    };

    return zoomer;
};
