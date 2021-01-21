function redirectToFrame(directoryName) {
    if (window.location.href.indexOf('glenwing.github.io/' + directoryName + '/') != -1) {
        localStorage.setItem('directoryName', directoryName);
        window.location.replace(window.location.href.substring(0, window.location.href.indexOf('glenwing.github.io/' + directoryName + '/')) + 'glenwing.github.io/frame.html');
    }
}