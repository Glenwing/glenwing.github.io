function redirectToFrame(sidebarID, queryString) {
    //var directoryName = document.getElementById(sidebarID).dataset.dir;
    //if (window.location.href.indexOf('glenwing.github.io/' + directoryName + '/') != -1) {
        sessionStorage.setItem('sidebarID', sidebarID);
        //sessionStorage.setItem('directoryName', directoryName);
        sessionStorage.setItem('queryString', queryString);
        //console.log('redirectToFrame:', sidebarID, queryString);
        window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io/')) + 'glenwing.github.io/frame.html');
    //}
}

function frameLoadPage(sidebarID, directoryName, suffix) {
    if (suffix === undefined) { suffix = ''; }
    //console.log('frameLoadPage:', sidebarID, directoryName, suffix);
    if (window.location.pathname.indexOf(directoryName) == -1) {
        //DEBUG('frameLoadPage: history.replaceState triggered');
        try {
            history.replaceState(null, null, directoryName + suffix);
        }
        catch (DOMException) {
            DEBUG('URL change falling back to hard load due to DOMException.');
            //window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io')) + 'glenwing.github.io/' + directoryName + '/' + directoryName + '.html' + suffix);
        }
    }
    if ($('#' + sidebarID).data('pageCache') === '') {
        //console.log('Loading new page');
        $('#MainWindow').load('./' + directoryName + '/' + directoryName + '.html', function () {
            $('#' + sidebarID).data('pageCache', $('#MainWindow').html());
        });
    }
    else {
        //console.log('Loading page from cache');
        $('#MainWindow').html($.parseHTML($('#' + sidebarID).data('pageCache')));
        pageLoadFunction = $('#' + sidebarID).data('onLoad');
        pageLoadFunction();
        if ((sidebarID === 'Sidebar_DDC' || sidebarID === 'Sidebar_Matchmaker') && suffix.indexOf('#matchmaker') !== -1) {
            //console.log('frameLoadPage: activateMatchmaker()');
            activateMatchmaker();
        }
        else {
            //console.log('frameLoadPage: deactivateMatchmaker()');
            deactivateMatchmaker();
        }
    }
}

function navigateToDir(dir) {
    return window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io')) + 'glenwing.github.io/' + dir;
}

function pageLoadFunction() {
    return;
}