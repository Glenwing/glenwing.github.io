global_katexOptions = {
    throwOnError: false,
    displayMode: true, 
    strict: false,
    //trust: true,
    minRuleThickness: 0.06,
    macros: {
        '\\afrac': '\\dfrac{\\raisebox{-0.1em}{#1}}{\\raisebox{-0.1em}{#2}}', // Aligned fraction
        '\\mfrac': '\\dfrac{\\raisebox{-0.1em}{$#1$}}{\\raisebox{-0.1em}{$#2$}}', // Same as afrac, but auto math mode arguments
        '\\Sin': '\\sin \\left( #1 \\right)', // Trig functions with scaling parentheses attached
        '\\Cos': '\\cos \\left( #1 \\right)',
        '\\Tan': '\\tan \\left( #1 \\right)',
        '\\Arcsin': '\\sin ^{-1} \\left( #1 \\right)',
        '\\Arccos': '\\cos ^{-1} \\left( #1 \\right)',
        '\\Arctan': '\\tan ^{-1} \\left( #1 \\right)',
        '\\ratio': '\\raisebox{0.1em}{:}',
        //'\\micro': '\\includegraphics[width=0.55em]{..\\assets\\CMUmu.svg}'
    }
};

var LD_5sf =    { sf:5,     sep:['\\,', '\\,', false, false], approx:'', repeat:false };

function updateRes() {
    var window_W = window.screen.width;
    var window_H = window.screen.height;
    //var pxRatio = window.devicePixelRatio;

    //var zoomValues = getZoomValues();
    //var combinedRatio = zoomValues['combined'];
    //var zoomRatio = zoomValues['browser'];
    //var osRatio = zoomValues['os'];
    //var osRatio = window.devicePixelRatio.div(zoomRatio);

    var zoomValues = resDetect();
    var scale = zoomValues['resScale'];
    var os = zoomValues['osScale'];
    var zoom = zoomValues['zoomScale'];
    var vp = zoomValues['viewportScale'];
    var engine = zoomValues['engine'];
    var pxRatio = zoomValues['pxRatio'];

    var calc_W = window_W * scale;
    var calc_H = window_H * scale;
    //var round_W = Math.round(window_W * osRatio);
    //var round_H = Math.round(window_H * osRatio);
    var round_W = scale.times(window_W).toFixed(0);
    var round_H = scale.times(window_H).toFixed(0);
/* 
    var Uncertainty_W_Below = Math.round((window_W - 0.5) * osRatio - calc_W);
    var Uncertainty_W_Above = -1 * Math.round((calc_W - (window_W + 0.5) * osRatio));
    var Uncertainty_H_Below = Math.round((window_H - 0.5) * osRatio - calc_H);
    var Uncertainty_H_Above = -1 * Math.round((calc_H - (window_H + 0.5) * osRatio));
    var Uncertainty_W = Math.max(Uncertainty_W_Below, Uncertainty_W_Above);
    var Uncertainty_H = Math.max(Uncertainty_H_Below, Uncertainty_H_Above);
 */
    var Uncertainty_W_Below = scale.times(window_W - 0.5).minus(calc_W).times(-1).toFixed(0, Decimal.ROUND_HALF_UP);
    var Uncertainty_W_Above = scale.times(window_W + 0.5).minus(calc_W).toFixed(0, Decimal.ROUND_HALF_DOWN);
    var Uncertainty_H_Below = scale.times(window_H - 0.5).minus(calc_H).times(-1).toFixed(0, Decimal.ROUND_HALF_UP);
    var Uncertainty_H_Above = scale.times(window_H + 0.5).minus(calc_H).toFixed(0, Decimal.ROUND_HALF_DOWN);
    var Uncertainty_W = Math.max(Uncertainty_W_Below, Uncertainty_W_Above);
    var Uncertainty_H = Math.max(Uncertainty_H_Below, Uncertainty_H_Above);

    var unc_str_W = '';
    var unc_str_H = '';
    var times_symbol = '&#x202f;&times;&#x202f;';
    if (Uncertainty_W > 0 || Uncertainty_H > 0) {
        unc_str_W = '<span class="uncertainty">&#x202f;(&pm;' + Uncertainty_W + ')</span>';
        unc_str_H = '<span class="uncertainty">&#x202f;(&pm;' + Uncertainty_H + ')</span>';
        times_symbol = '&nbsp;&times;&nbsp;';
    }


    $('#RESULT_ZOOM_RATIO').html(LongDivide(zoom.times(100), 1, {p: [0, 8], approx:''} ) + '%');
    //$('#RESULT_COMBINED_RATIO').html(zoomValues['combined']);
    $('#RESULT_OS_RATIO').html(LongDivide(os.times(100), 1, {p: [0, 8], approx:''} ) + '%');
    $('#RESULT_VP_RATIO').html(LongDivide(vp.times(100), 1, {p: [0, 8], approx:''} ) + '%');

    $('#RESULT_S_W').html(screen.width + '&nbsp;px');
    $('#RESULT_D_CW').html(document.documentElement.clientWidth + '&nbsp;px');
    $('#RESULT_WS_W').html(window_W + '&nbsp;px');
    $('#RESULT_S_H').html(screen.height + '&nbsp;px');
    $('#RESULT_D_CH').html(document.documentElement.clientHeight + '&nbsp;px');
    $('#RESULT_WS_H').html(window_H + '&nbsp;px');
    $('#RESULT_W_IW').html(window.innerWidth + '&nbsp;px');
    $('#RESULT_W_OW').html(window.outerWidth + '&nbsp;px');
    $('#RESULT_W_IH').html(window.innerHeight + '&nbsp;px');
    $('#RESULT_W_OH').html(window.outerHeight + '&nbsp;px');
    $('#RESULT_PX_RATIO').html(LongDivide(pxRatio, 1, {p: [2, 6], approx:''}));
    $('#RESULT_CALC_W').html(LongDivide(calc_W, 1, {p: [0, 4], approx:''}) + '&nbsp;px');
    $('#RESULT_CALC_H').html(LongDivide(calc_H, 1, {p: [0, 4], approx:''}) + '&nbsp;px');
    $('#RESULT_TOL_W').html('&pm;' + Uncertainty_W + '&nbsp;px');
    $('#RESULT_TOL_H').html('&pm;' + Uncertainty_H + '&nbsp;px');

    $('#TrueResDiv').html(round_W + unc_str_W + '&#x202f;&times;&#x202f;' + round_H + unc_str_H);

    if (Math.abs(os - 1) > 0.001) {
        $('#restext_os').css('display', 'block');
        $('#restext_os_number').html(LongDivide(os * 100, 1, {p: [0, 2], approx:''}) + '%');
        $('#restext_effres').html(Math.round(window_W) + '&#x202f;&times;&#x202f;' + Math.round(window_H));
    }
    else {
        $('#restext_os').css('display', 'none');
    }

    $('#RESULT_UA').html(navigator.userAgent);
    $('#RESULT_BROWSER').html(engine);

}

function getZoomValues () {
    var browserRatio = detectZoom.zoom()
    var combinedRatio = Decimal(window.devicePixelRatio)
    var osRatio = combinedRatio.div(browserRatio);
    //combinedRatio = window.devicePixelRatio;
    //browserRatio = combinedRatio / osRatio;
    return {
        browser: browserRatio,
        combined: combinedRatio,
        os: osRatio,
    }
}

var global_selectedElement = ''; // Used for keeping track of which element is currently selected in the document
var global_DescriptionFunction = function() { return; };

function selectRow(el) {
    previousEl = global_selectedElement || '';
    if (previousEl != '') { deselectRow(); }
    if (previousEl != el) {
        el.classList.add('selected');
        global_selectedElement = el;
        loadDescription(el);
    }
}

function deselectRow() {
    global_selectedElement = global_selectedElement || '';
    if (global_selectedElement != '') {
        global_selectedElement.classList.remove('selected');
        global_selectedElement = '';
    }
}

/* Clears description when clicking anywhere else on the screen (except on excluded elements)
document.addEventListener('click', function(event) {
    if (!(
        document.getElementById('resResultTable_1').contains(event.target)      ||
        document.getElementById('results2').contains(event.target)      ||
        document.getElementById('description').contains(event.target)   )) {
        deselectRow();
        clearDescription();
    }
    return;
});
/*  */

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') { deselectRow(); $('#description').html(''); }
});

function loadDescription(el) {
    if ($(el).data('descriptionCache') === '') {
        $('#description').load('res/' + $(el).data('descriptionFilepath'), function() {
            $(el).data('descriptionCache', $('#description').html());
            $(el).data('descriptionOnLoad', global_DescriptionFunction);
            global_DescriptionFunction();
        });
    }
    else {
        $('#description').html($(el).data('descriptionCache'));
        global_DescriptionFunction = $(el).data('descriptionOnLoad');
        global_DescriptionFunction();
    }
}

function clearDescription() {
    if (global_selectedElement == '') {
        $('#description').html('');
        global_DescriptionFunction = function() { return; };
    }
}


var global_DescriptionRegistry = { // Used for associating HTML files for loading detailed descriptions
    'selectWindowScreenWidth':  'DescriptionFiles/Description_WS_Width.html',
    'selectWindowScreenHeight': 'DescriptionFiles/Description_WS_Height.html',
    'selectPxRatio':            'DescriptionFiles/Description_Px_Ratio.html',
    'selectZoomRatio':          'DescriptionFiles/Description_Zoom_Ratio.html',
    'selectOSRatio':            'DescriptionFiles/Description_OS_Ratio.html',
    'selectCalculatedWidth':    'DescriptionFiles/Description_Calc_Width.html',
    'selectToleranceWidth':     'DescriptionFiles/Description_Tol_Width.html',
    'selectCalculatedHeight':   'DescriptionFiles/Description_Calc_Height.html',
    'selectToleranceHeight':    'DescriptionFiles/Description_Tol_Height.html',
};

function resLoad() {
    // Fills the elements on the page with the event listeners necessary for the mouseover descriptions to work
    var resResultTableRows = document.getElementById('resResultTable_1').children[0].children;
    for (var a = 0; a < resResultTableRows.length; a++) {
        if (resResultTableRows[a].classList.contains('selectable') != -1) {
            resResultTableRows[a].addEventListener('click', function (event) { selectRow(event.currentTarget); });
            resResultTableRows[a].addEventListener('mouseenter', function (event) { if (global_selectedElement == '') { loadDescription(event.currentTarget) }});
            resResultTableRows[a].addEventListener('mouseleave',  function () { clearDescription() });
            resResultTableRows[a].dataset.descriptionFilepath = global_DescriptionRegistry[resResultTableRows[a].id];
            resResultTableRows[a].dataset.descriptionCache = '';
            resResultTableRows[a].dataset.descriptionOnLoad = function () { return; };
        }
    }
}

$('#Sidebar_Res').data('onLoad', resLoad);

resLoad();
updateRes();