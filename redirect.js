function redirectToFrame(directoryName, queryString) {
    if (window.location.href.indexOf('glenwing.github.io/' + directoryName + '/') != -1) {
        sessionStorage.setItem('directoryName', directoryName);
        sessionStorage.setItem('queryString', queryString);
        window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io/' + directoryName + '/')) + 'glenwing.github.io/frame.html');
    }
}

function frameLoadPage(sidebarID, directoryName, suffix) {
    if (suffix === undefined) { suffix = ''; }
    if (window.location.pathname.indexOf(directoryName) == -1) {
        try {
            history.replaceState(null, null, directoryName + suffix);
        }
        catch (DOMException) {
            DEBUG('URL change falling back to hard load due to DOMException.');
            //window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io')) + 'glenwing.github.io/' + directoryName + '/' + directoryName + '.html' + suffix);
        }
    }
    if ($('#' + sidebarID).data('pageCache') === undefined) {
        //console.log('Loading new page');
        $('#MainWindow').load('./' + directoryName + '/' + directoryName + '.html', function () {
            $('#' + sidebarID).data('pageCache', $('#MainWindow').html());
        });
    }
    else {
        //console.log('Loading page from cache');
        $('#MainWindow').html($.parseHTML($('#' + sidebarID).data('pageCache')));
        pageLoadTemp = $('#' + sidebarID).data('onload');
        pageLoadTemp();
        if (suffix === '#matchmaker') {
            activateMatchmaker();
        }
    }
}

function navigateToDir(dir) {
    return window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io')) + 'glenwing.github.io/' + dir;
}

function pageLoadTemp() {
    return;
}