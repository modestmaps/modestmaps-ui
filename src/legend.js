if (typeof MMui === 'undefined') MMui = {};

MMui.legend = function() {
    var map,
        l = {};

    var container = document.createElement('div');
    container.className = 'map-legends';

    var element = container.appendChild(document.createElement('div'));
    element.className = 'map-legend';
    element.style.display = 'none';

    l.content = function(x) {
        if (!arguments.length) return element.innerHTML;

        element.innerHTML = MMui.u.sanitize(x);
        element.style.display = 'block';
        if (element.innerHTML === '') {
            element.style.display = 'none';
        }
        return l;
    };

    l.element = function() {
        return container;
    };

    l.map = function(x) {
        if (!arguments.length) return map;
        map = x;
        return l;
    };

    l.add = function() {
        if (!map) return false;
        l.appendTo(map.parent);
        return l;
    };

    l.remove = function() {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
        return l;
    };

    l.appendTo = function(elem) {
        MMui.u.$(elem).appendChild(container);
        return l;
    };

    return l;
};
