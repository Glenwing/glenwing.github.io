var LD_5sf =    { sf:5,     sep:['\\,', '\\,', false, false], approx:'', repeat:false };

function updateRes() {
    var window_W = window.screen.width;
    var window_H = window.screen.height;
    var pxRatio = window.devicePixelRatio;
    var calc_W = window_W * pxRatio;
    var calc_H = window_H * pxRatio;
    var round_W = Math.round(window_W * pxRatio);
    var round_H = Math.round(window_H * pxRatio);

    var Uncertainty_W_Below = Math.round((window_W - 0.5) * pxRatio - calc_W);
    var Uncertainty_W_Above = -1 * Math.round((calc_W - (window_W + 0.5) * pxRatio));
    var Uncertainty_H_Below = Math.round((window_H - 0.5) * pxRatio - calc_H);
    var Uncertainty_H_Above = -1 * Math.round((calc_H - (window_H + 0.5) * pxRatio));
    var Uncertainty_W = Math.max(Uncertainty_W_Below, Uncertainty_W_Above);
    var Uncertainty_H = Math.max(Uncertainty_H_Below, Uncertainty_H_Above);

    var unc_str_W = '';
    var unc_str_H = '';
    var times_symbol = '&#x202f;&times;&#x202f;';
    if (pxRatio !== 1) {
        unc_str_W = '<span class="uncertainty">&#x202f;(&pm;' + Uncertainty_W + ')</span>';
        unc_str_H = '<span class="uncertainty">&#x202f;(&pm;' + Uncertainty_H + ')</span>';
        times_symbol = '&nbsp;&times;&nbsp;';
    }

    $('#RESULT_WS_W').html(window_W + '&nbsp;px');
    $('#RESULT_WS_H').html(window_H + '&nbsp;px');
    $('#RESULT_PXRATIO').html(LongDivide(pxRatio, 1, {p: [2, 8], approx:''}));
    $('#RESULT_CALC_W').html(LongDivide(calc_W, 1, {p: [0, 4], approx:''}) + '&nbsp;px');
    $('#RESULT_CALC_H').html(LongDivide(calc_H, 1, {p: [0, 4], approx:''}) + '&nbsp;px');
    $('#RESULT_TOL_W').html('&pm;' + Uncertainty_W + '&nbsp;px');
    $('#RESULT_TOL_H').html('&pm;' + Uncertainty_H + '&nbsp;px');

    $('#TrueResDiv').html(round_W + unc_str_W + '&#x202f;&times;&#x202f;' + round_H + unc_str_H);
}

updateRes();

window.onresize = function () {
    updateRes();
}