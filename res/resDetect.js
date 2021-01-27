function resDetect () {
    var pxRatio;
    try { pxRatio = Decimal(window.devicePixelRatio); }
    catch (error) { pxRatio = Decimal(1); }

    // Determine rendering engine
    var UA = navigator.userAgent.toLowerCase();
    var engine = '';
    if (UA.indexOf('edge/') != -1) {
        DEBUG('Browser rendering engine: EdgeHTML');
        engine = 'EdgeHTML';
    }
    else if (UA.indexOf('like gecko') != -1 && UA.indexOf('chrome/') != -1) {
        // Chrome / Opera / Blink
        DEBUG('Browser rendering engine: Blink (Chrome, Opera, Edge)');
        engine = 'Blink';
    }
    else if (UA.indexOf('like gecko') != -1 && UA.indexOf('applewebkit/') != -1) {
        // WebKit
        DEBUG('Browser rendering engine: WebKit (Safari)');
        engine = 'WebKit';
    }
    else if (UA.indexOf('gecko/') != -1) {
        // Gecko / Firefox
        DEBUG('Browser rendering engine: Gecko (Firefox)');
        engine = 'Gecko';
    }
    else {
        engine = 'Unknown';
    }

    // Get viewport scale to compensate for zoom on mobile devices
    var metaContent = document.querySelector('meta[name="viewport"]').content;
    var viewportScale = parseNum(
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
    );

    if (UA.indexOf('mobi') != -1) {
        viewportScale = Decimal(viewportScale);
    }
    else {
        viewportScale = Decimal(1);
    }

    // Determine output
    var zoom = Decimal(1); // Browser Zoom
    var zoom_raw = Decimal(1); // Browser Zoom (no rounding)
    var osScale = Decimal(1); // OS Scale
    var resScale = Decimal(1); // Which scale factor to use in calculating the resolution based on the window.screen.width

    var zoom_tol_above = Decimal(0);
    var zoom_tol_below = Decimal(0);
    var os_tol_above = Decimal(0);
    var os_tol_below = Decimal(0);

    if (engine == 'Gecko') {
        zoom = Decimal(1);
        osScale = pxRatio;
        resScale = pxRatio;
        /* 
        if (UA.indexOf('mobi') != -1) {
            osScale = zoom;
            zoom = Decimal(1);
        }
         */
    }
    else if (engine == 'EdgeHTML') {
        resScale = pxRatio;
    }
    else if (engine == 'Blink') {
        if (window.outerWidth == window.innerWidth + 16) {
            // This condition indicates 100% zoom but with a non-maximized window
            zoom_raw = Decimal(1);
            zoom_tol_above = Decimal(0);
            zoom_tol_above = Decimal(0);
        }
        else {
            zoom_raw = Decimal(window.outerWidth).div(window.innerWidth).div(viewportScale);

            zoom_tol_above = Decimal(window.outerWidth).times(Decimal(1).div(window.innerWidth).minus(Decimal(1).div(window.innerWidth + 0.5)));
            zoom_tol_below = Decimal(window.outerWidth).times(Decimal(1).div(window.innerWidth - 0.5).minus(Decimal(1).div(window.innerWidth)));
            console.log('Zoom uncertainty: +' + zoom_tol_above.toFixed(8) + ', -' + zoom_tol_below.toFixed(8));
        }
        zoom = zoom_raw;
        osScale = pxRatio.div(zoom).toDecimalPlaces(2);
        resScale = osScale;

        os_tol_above = pxRatio.div(zoom).minus(pxRatio.div(zoom.plus(zoom_tol_above))).plus(0.005);
        os_tol_below = pxRatio.div(zoom.minus(zoom_tol_below)).minus(pxRatio.div(zoom)).plus(0.005);

        console.log('OS scale uncertainty: +' + os_tol_above.toFixed(8) + ', -' + os_tol_below.toFixed(8));
    }
    else if (engine == 'WebKit') {
        // Placeholder for now
        zoom = Decimal(1);
        osScale = pxRatio;
        resScale = pxRatio;
    }

    return {
        'pxRatio': pxRatio,
        //'zoomRaw': zoom_raw,
        'zoomScale': zoom,
        'osScale': osScale,
        'viewportScale': viewportScale,
        'resScale': resScale,
        'engine': engine,
        'zoom_tol_above': zoom_tol_above,
        'zoom_tol_below': zoom_tol_below,
        'os_tol_above': os_tol_above,
        'os_tol_below': os_tol_below,
    }
}

