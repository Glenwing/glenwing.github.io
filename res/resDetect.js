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
        engine = 'blink';
    }
    else if (UA.indexOf('like gecko') > 0 && UA.indexOf('applewebkit') > 0) {
        // WebKit
        DEBUG('Browser rendering engine: WebKit (Safari)');
        engine = 'webkit';
    }
    else if (UA.indexOf('gecko') > 0) {
        // Gecko / Firefox
        DEBUG('Browser rendering engine: Gecko (Firefox)');
        engine = 'gecko';
    }
    else {
        engine = 'unknown';
    }

    // Get viewport scale to compensate for zoom on mobile devices
    metaContent = document.querySelector('meta[name="viewport"]').content;
    //console.log('metaContent =', metaContent);
    viewportScale = Decimal(parseNum(
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
    //console.log('viewportScale =', viewportScale);

    // Determine output
    var zoom; // Browser Zoom
    var scale; // OS Scale
    var scaleToUse; // Which scale factor to use in calculating the resolution based on the window.screen.width
    if (engine == 'gecko') {
        zoom_raw = Decimal(mediaQueryBinarySearch('min-resolution', 'dppx', 0, 10, 20, 0.0001));
        zoom = zoom_raw.toDecimalPlaces(2);
        scale = pxRatio.div(zoom).toDecimalPlaces(2);
        scaleToUse = pxRatio;
    }
    else if (engine == 'blink') {
        zoom_raw = Decimal(window.outerWidth).div(window.innerWidth).div(viewportScale);
        zoom = zoom_raw;
        scale = pxRatio.div(zoom).toDecimalPlaces(2);
        scaleToUse = scale;
    }
    else if (engine == 'webkit') {
        // Placeholder for now
        zoom = 1;
        scale = pxRatio;
        scaleToUse = scale;
    }

    return {
        'pxRatio': pxRatio,
        'zoomRaw': zoom_raw,
        'zoomScale': zoom,
        'osScale': scale,
        'viewportScale': viewportScale,
        'resScale': scaleToUse,
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

