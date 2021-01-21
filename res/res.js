var LD_5sf =    { sf:5,     sep:['\\,', '\\,', false, false], approx:'', repeat:false };

function updateRes() {
    var winWidth = window.screen.width;
    var winHeight = window.screen.height;
    var pxRatio = window.devicePixelRatio;
    var trueWidth = winWidth * pxRatio;
    var trueHeight = winHeight * pxRatio;
    var availWidth = window.screen.availWidth;
    var availHeight = window.screen.availHeight;

    $('#RESULT_TRUERES').html(trueWidth + '&#x202f;&times;&#x202f;' + trueHeight);
    $('#RESULT_SCALING').html(LongDivide(pxRatio, 1, LD_5sf));
    $('#RESULT_EFFRES').html(winWidth + '&#x202f;&times;&#x202f;' + winHeight);
    $('#RESULT_AVAILRES').html(availWidth + '&#x202f;&times;&#x202f;' + availHeight);
}

updateRes();