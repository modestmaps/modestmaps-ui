if (typeof MMui === 'undefined') MMui = {};

MMui.scale = function(o) {
    
    var scale = {},
        element = document.createElement('div'),
        map;

    o = o || {};
    o.maxWidth = o.maxWidth || 500;
    o.maxError = o.maxError = 0.05;
    if (typeof o.metric === 'undefined') o.metric = true;
    if (typeof o.imperial === 'undefined') o.imperial = true;

    element.className = 'map-scale';

    if (o.metric) {
        var metricElem = document.createElement('div');
        metricElem.className = 'map-scale-metric';
        element.appendChild(metricElem);
    }

    if (o.imperial) {
        var imperialElem = document.createElement('div');
        imperialElem.className = 'map-scale-imperial';
        element.appendChild(imperialElem);
    }


    function percentError(expected, actual) {
        return Math.abs(expected - actual) / expected;
    }

    function roundDistance(m) {
        var powerOf10 = Math.pow(10, Math.floor(m).toString().length - 1),
            d = m / powerOf10;
        return powerOf10 * (d >= 5 ? 5 : d >= 2 ? 2 : 1);
    }

    function updateScale(elem, maxDist, unit) {
        var round = roundDistance(maxDist);
        elem.style.width = round / maxDist * o.maxWidth + 'px';
        elem.innerHTML = round + ' ' + unit;
    }

    function update() {
        // Middle horizontal
        var l1 = map.pointLocation({ x: 0, y: map.dimensions.y/2 }); 
            l2 = map.pointLocation({ x: map.dimensions.x, y: map.dimensions.y/2 }),
            midDist = MM.Location.distance(l1, l2);
        // Top edge
        var t1 = map.pointLocation({ x: 0, y: 0 }),
            t2 = map.pointLocation({ x: map.dimensions.x, y: 0}),
            topDist = MM.Location.distance(t1, t2);
        // Bottom edge
        var b1 = map.pointLocation({ x: 0, y: map.dimensions.y }),
            b2 = map.pointLocation(map.dimensions),
            botDist = MM.Location.distance(b1, b2);


        var error = Math.max(percentError(midDist, topDist),
                percentError(midDist, botDist));

        if (error > o.maxError) {
            element.style.visibility = 'hidden';

        } else {
            element.style.visibility = 'visible';
            var maxDist = o.maxWidth / map.dimensions.x * midDist;

            if (o.metric) {
                if (maxDist >= 1000) {
                    updateScale(metricElem, maxDist / 1000, 'km');
                } else {
                    updateScale(metricElem, maxDist, 'm');
                }
            }

            if (o.imperial) {
                var maxDistFeet = maxDist * 3.2808399;
                if (maxDistFeet >= 5280) {
                    updateScale(imperialElem, maxDistFeet / 5280, 'mi');
                } else {
                    updateScale(imperialElem, maxDistFeet, 'ft');
                }
            }
        }
    }

    scale.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return scale;
    };

    scale.add = function() {
        map.addCallback('drawn', update);
        map.parent.appendChild(element);
        return scale;
    };

    scale.remove = function() {
        map.removeCallback('drawn', update);
        map.parent.removeChild(element);
        return scale;
    };

    scale.appendTo = function() {
        MMui.u.$(elem).appendChild(element);
        return scale;
    };

    return scale;
};
