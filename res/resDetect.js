function resDetect() {
    var pxRatio;
    try { pxRatio = Decimal(window.devicePixelRatio); }
    catch { pxRatio = 1; }

    // Determine rendering engine
    var UA = navigator.userAgent.toLowerCase();
    var engine = '';
    if (UA.indexOf('like gecko') > 0 && UA.indexOf('chrome') > 0) {
        // Chrome / Opera / Blink
        DEBUG('Browser rendering engine: Blink (Chrome, Opera)');
        engine = 'Blink';
    }
    else if (UA.indexOf('like gecko') > 0 && UA.indexOf('applewebkit') > 0) {
        // WebKit
        DEBUG('Browser rendering engine: WebKit (Safari)');
        engine = 'WebKit';
    }
    else if (UA.indexOf('gecko') > 0) {
        // Gecko / Firefox
        DEBUG('Browser rendering engine: Gecko (Firefox)');
        engine = 'Gecko';
    }
    else {
        engine = 'Unknown';
    }

    // Get viewport scale to compensate for zoom on mobile devices
    var metaContent = document.querySelector('meta[name="viewport"]').content;
    //console.log('metaContent =', metaContent);
    var viewportScale = Decimal(parseNum(
        metaContent.substring(
            metaContent.indexOf('initial-scale=') + ('initial-scale=').length,
            metaContent.length
        ).substring(
            0,
            metaContent.substring(
                metaContent.indexOf('initial-scale=') + ('initial-scale=').length,
                metaContent.length
            ).indexOf(',')
        )
    ));
    if (isNum(viewportScale) == true && window.innerHeight > window.outerHeight) {
        viewportScale = Decimal(viewportScale);
    }
    else {
        viewportScale = Decimal(1);
    }
    //console.log('viewportScale =', viewportScale);

    // Determine output
    var zoom = Decimal(1); // Browser Zoom
    var zoom_raw = Decimal(1); // Browser Zoom (no rounding)
    var osScale = Decimal(1); // OS Scale
    var resScale = Decimal(1); // Which scale factor to use in calculating the resolution based on the window.screen.width
    if (engine == 'Gecko') {
        zoom_raw = Decimal(mediaQueryBinarySearch('min-resolution', 'dppx', 0, 10, 20, 0.0001));
        zoom = zoom_raw.toDecimalPlaces(2);
        osScale = pxRatio.div(zoom).toDecimalPlaces(2);
        resScale = pxRatio;
    }
    else if (engine == 'Blink') {
        if (window.outerWidth == window.innerWidth + 16) {
            // This condition indicates 100% zoom but with a non-maximized window
            zoom_raw = Decimal(1);
        }
        else {
            zoom_raw = Decimal(window.outerWidth).div(window.innerWidth).div(viewportScale);
        }
        zoom = zoom_raw;
        osScale = pxRatio.div(zoom).toDecimalPlaces(2);
        resScale = osScale;
    }
    else if (engine == 'WebKit') {
        // Placeholder for now
        zoom = Decimal(1);
        osScale = pxRatio;
        resScale = pxRatio;
    }

    return {
        'pxRatio': pxRatio,
        'zoomRaw': zoom_raw,
        'zoomScale': zoom,
        'osScale': osScale,
        'viewportScale': viewportScale,
        'resScale': resScale,
        'engine': engine,
    }
}

function mediaQueryBinarySearch (property, unit, a, b, maxIter, epsilon) {
    var matchMedia;
    var head, style, div;
    if (window.matchMedia) {
        matchMedia = window.matchMedia;
    } else {
        head = document.getElementsByTagName('head')[0];
        style = document.createElement('style');
        head.appendChild(style);

        div = document.createElement('div');
        div.className = 'mediaQueryBinarySearch';
        div.style.display = 'none';
        document.body.appendChild(div);

        matchMedia = function (query) {
            style.sheet.insertRule('@media ' + query + '{.mediaQueryBinarySearch ' + '{text-decoration: underline} }', 0);
            var matched = getComputedStyle(div, null).textDecoration == 'underline';
            style.sheet.deleteRule(0);
            return {matches: matched};
        };
    }
    
    var ratio = binarySearch(a, b, maxIter);
    if (div) {
        head.removeChild(style);
        document.body.removeChild(div);
    }
    return ratio;

    function binarySearch(a, b, maxIter) {
        var mid = (a + b) / 2;
        if (maxIter <= 0 || b - a < epsilon) {
            return mid;
        }
        var query = "(" + property + ":" + mid + unit + ")";
        if (matchMedia(query).matches) {
            return binarySearch(mid, b, maxIter - 1);
        } else {
            return binarySearch(a, mid, maxIter - 1);
        }
    }
}

