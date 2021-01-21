function redirectToFrame(directoryName, queryString) {
    if (window.location.href.indexOf('glenwing.github.io/' + directoryName + '/') != -1) {
        localStorage.setItem('directoryName', directoryName);
        localStorage.setItem('queryString', queryString);
        window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io/' + directoryName + '/')) + 'glenwing.github.io/frame.html');
    }
}

function frameLoadPage(directoryName, suffix) {
    if (suffix === undefined) { suffix = ''; }
    try {
        history.replaceState(null, null, directoryName + suffix);
    }
    catch (DOMException) {
        DEBUG('URL change falling back to hard load due to DOMException.');
        //window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io')) + 'glenwing.github.io/' + directoryName + '/' + directoryName + '.html' + suffix);
    }
    $('#MainWindow').load('./' + directoryName + '/' + directoryName + '.html');
}

function navigateToDir(dir) {
    return window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io')) + 'glenwing.github.io/' + dir;
}

