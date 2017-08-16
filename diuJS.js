function update() {
    
    var size = $('#INPUT_SIZE').val();
    var unit_select = $('#unit_select input[type="radio"]:checked').val();
    var hres1 = $('#INPUT_HRES').val();
    var vres1 = $('#INPUT_VRES').val();
    var ar1 = hres1 / vres1;
    
    var width = size * Math.sin(Math.atan(hres1 / vres1));
    var height = size * Math.cos(Math.atan(hres1 / vres1));
    var area = width * height;
    var px_density = hres1 / width;
    var total_px = hres1 * vres1;

    var hres2 = $('#INPUT_HRES2').val();
    var vres2 = $('#INPUT_VRES2').val();
    var ar2 = hres2 / vres2;
    var d_match = Math.sqrt((height * height) * (1 + (ar2 * ar2)));
    var opt_res = parseInt(vres1 * ar2) + '&nbsp;<span style="font-size:10px; vertical-align:middle;">&#10005;</span>&nbsp;' + vres1;

    var width2 = width * (hres2 / hres1);
    var height2 = height * (vres2 / vres1);
    var size2 = Math.sqrt((width2 * width2) + (height2 * height2));

    /* Conversion Codes:
    0: Special Handling
    1: Secondary units with normal conversion factor
    2: Secondary units with squared conversion factor
    3: Secondary units with reciprocal conversion factor
    */
    display(new UNIT(unit_select),
        [
            ['RESULT_WIDTH',      1, width.toFixed(3)     , (hres1 != '' && vres1 != '' && size != '' && hres1 != 0 && vres1 != 0 && size != 0) ],
            ['RESULT_HEIGHT',     1, height.toFixed(3)    , (hres1 != '' && vres1 != '' && size != '' && hres1 != 0 && vres1 != 0 && size != 0) ],
            ['RESULT_AREA',       2, area.toFixed(3)      , (hres1 != '' && vres1 != '' && size != '' && hres1 != 0 && vres1 != 0 && size != 0) ],
            ['RESULT_PX_DENSITY', 3, px_density.toFixed(3), (hres1 != '' && vres1 != '' && size != '' && hres1 != 0 && vres1 != 0 && size != 0) ],
            ['RESULT_D_MATCH',    1, d_match.toFixed(3)   , (hres1 != '' && vres1 != '' && size != '' && hres2 != '' && vres2 != '' && hres1 != 0 && vres1 != 0 && size != 0 && hres2 != 0 && vres2 != 0) ],
            ['RESULT_SIZE',       1, size2.toFixed(3)     , (hres1 != '' && vres1 != '' && size != '' && hres2 != '' && vres2 != '' && hres1 != 0 && vres1 != 0 && size != 0 && hres2 != 0 && vres2 != 0) ],
        ]
    );


    if (size != '' && hres1 != '' && vres1 != '' && hres2 != '' && vres2 != '' &&
        size != 0  && hres1 != 0  && vres1 != 0  && hres2 != 0  && vres2 != 0  &&
        isNaN(size) == false && isNaN(hres1) == false && isNaN(vres1) == false && isNaN(hres2) == false && isNaN(vres2) == false)
        { $('#RESULT_OPT_RES').html(opt_res); 
        if (hres2 == '21' && vres2 == '9') {
            $('#21_9_warning').css('display', 'table-row');
        }
        else {
            $('#21_9_warning').css('display', 'none');
        }
    }
    else
        { $('#RESULT_OPT_RES').html(''); }


    if (hres1 != '' && vres1 != '' && hres1 != 0 && vres1 != 0 && isNaN(hres1) == false && isNaN(vres1) == false) {
        $('#RESULT_RATIO').html(commas(ar1.toFixed(3)) + ' (' + parseInt(hres1 / GCD(hres1, vres1)) + '<span style="vertical-align:baseline; position:relative; top:-0.05em;">:</span>' + parseInt(vres1 / GCD(hres1, vres1)) + ')');
        $('#RESULT_TOTAL_PX').html(commas(total_px) + ' (' + prefixGen(total_px, 2)['num'] + ' ' + prefixGen(total_px, 2)['prefix'] + 'px)');
    }
    else {
        $('#RESULT_RATIO').html('');
        $('#RESULT_TOTAL_PX').html('');
    }


    return;
}

function display(units, list) {
    var el;
    for (var x = 0; x < list.length; x++) {
        if (isNaN(list[x][2]) == true || isFinite(list[x][2]) == false || list[x][3] == false) {
            $('#' + list[x][0]).html('');
        }
        else {
            el = $('#' + list[x][0]);
            el.html(commas(list[x][2]));
            if (list[x][1] == 1) {
                el[0].innerHTML += units.sym()[0] + ' (' + commas((list[x][2] * units.conv()).toFixed(3)) + units.sym()[1] + ')';
            }
            else if (list[x][1] == 2) {
                el[0].innerHTML += ' ' + units.abbr()[0] + '<sup>2</sup> (' + commas((list[x][2] * units.conv() * units.conv()).toFixed(3)) + ' ' + units.abbr()[1] + '<sup>2</sup>)';
            }
            else if (list[x][1] == 3) {
                el[0].innerHTML += ' px/' + units.abbr()[0] + ' (' + commas((list[x][2] * (1 / units.conv())).toFixed(3)) + ' px/' + units.abbr()[1] + ')';
            }

        }
    }
    return;
}


function UNIT (mode) {
    this._primary = mode;

    this.set = function(mode) {
        this._primary = mode;
    }

    this.constructor = function(mode) {
        this._primary(mode);
    }

    this.full = function() {
        if (this._primary == 'in') { return ['inches', 'centimeters']; }
        else if (this._primary == 'cm') { return ['centimeters', 'inches']; }
    }

    this.abbr = function() {
        if (this._primary == 'in') { return ['in', 'cm']; }
        else if (this._primary == 'cm') { return ['cm', 'in']; }
    }

    this.sym = function() {
        if (this._primary == 'in') { return ['"', ' cm']; }
        else if (this._primary == 'cm') { return [' cm', '"']; }
    }

    this.conv = function() {
        if (this._primary == 'in') { return 2.54; }
        else if (this._primary == 'cm') { return 1 / 2.54; }
    }
}


function prefixGen(num, precision) {
    var out_num;
    var out_prefix;

    var prefixDef = {
        '-8': 'y',
        '-7': 'z',
        '-6': 'a',
        '-5': 'f',
        '-4': 'p',
        '-3': 'n',
        '-2': 'µ',
        '-1': 'm',
        '0': '',
        '1': 'K',
        '2': 'M',
        '3': 'G',
        '4': 'T',
        '5': 'P',
        '6': 'E',
        '7': 'Z',
        '8': 'Y'
    };

    var magnitude = Math.floor(Math.log(num) / Math.log(1000));

    if (magnitude >= -8 && magnitude <= 8) {
        out_num = commas(Number(num / Math.pow(1000, magnitude)).toFixed(precision));
        out_prefix = prefixDef[magnitude];
    }
    else {
        out_num = commas(num);
        out_prefix = '';
    }

    return {
        'num': out_num,
        'prefix': out_prefix
    };
}


function pxPrefix(num, precision) {
    var x = prefixGen(num, precision);
    return (x['num'] + '&nbsp;' + x['prefix'] + 'px');
}function GCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) { var temp = a; a = b; b = temp; }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

function commas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}