function update() {
    
    var size = parseNum($('#INPUT_SIZE').val());
    var unit_select = $('#unit_select input[type="radio"]:checked').val();
    var hres1 = parseInt(parseNum($('#INPUT_HRES').val()));
    var vres1 = parseInt(parseNum($('#INPUT_VRES').val()));
    var ar_options = {
        'p_max': 4,
        'p_min': 2,
    }
    var ar1 = long_division(hres1, vres1, ar_options);
    
    var diag = parseFloat(size);
    var width = size * Math.sin(Math.atan(hres1 / vres1));
    var height = size * Math.cos(Math.atan(hres1 / vres1));
    var area = width * height;
    var px_density = hres1 / width;
    var total_px = hres1 * vres1;

    var hres2 = parseNum($('#INPUT_HRES2').val());
    var vres2 = parseNum($('#INPUT_VRES2').val());
    var ar2 = hres2 / vres2;
    var d_match = Math.sqrt((height * height) * (1 + (ar2 * ar2)));
    var opt_res = parseInt(vres1 * ar2) + '&thinsp;&times;&thinsp;' + vres1;

    var hres_den = parseInt(parseNum($('#INPUT_HRES_DENSITY').val()));
    var vres_den = parseInt(parseNum($('#INPUT_VRES_DENSITY').val()));
    var ar_den = long_division(hres_den, vres_den, ar_options);

    var width2 = width * (hres_den / hres1);
    var height2 = height * (vres_den / vres1);
    var size2 = Math.sqrt((width2 * width2) + (height2 * height2));

    /* Conversion Codes:
    1: Secondary units have normal conversion factor
    2: Secondary units have squared conversion factor
    3: Secondary units have reciprocal conversion factor
    */
    display(new UNIT(unit_select),
        [
            ['RESULT_DIAG',         1, diag.toFixed(3)      , (isPositive(size)) ],
            ['RESULT_WIDTH',        1, width.toFixed(3)     , (isPositive([size, hres1, vres1])) ],
            ['RESULT_HEIGHT',       1, height.toFixed(3)    , (isPositive([size, hres1, vres1])) ],
            ['RESULT_AREA',         2, area.toFixed(3)      , (isPositive([size, hres1, vres1])) ],
            ['RESULT_PX_DENSITY',   3, px_density.toFixed(3), (isPositive([size, hres1, vres1])) ],
            ['RESULT_D_MATCH',      1, d_match.toFixed(3)   , (isPositive([size, hres1, vres1, hres2, vres2])) ],
            ['RESULT_DENSITY_SIZE', 1, size2.toFixed(3)     , (isPositive([size, hres1, vres1, hres_den, vres_den])) ],
        ]
    );


    if (isNum([size, hres1, vres1, hres2, vres2]) && isPositive([size, hres1, vres1, hres2, vres2])) {
        $('#RESULT_OPT_RES').html(opt_res);
        if (hres2 == '21' && vres2 == '9') {
            $('#21_9_warning').css('display', 'table-row');
        }
        else {
            $('#21_9_warning').css('display', 'none');
        }
    }
    else
        { $('#RESULT_OPT_RES').html(''); }


    //if (hres1 != '' && vres1 != '' && hres1 != 0 && vres1 != 0 && isNaN(hres1) == false && isNaN(vres1) == false) {
    if (isNum([hres1, vres1]) && isPositive([hres1, vres1])) {
        // $('#RESULT_RATIO').html(commas(ar1.toFixed(3)) + ' (' + parseInt(hres1 / GCD(hres1, vres1)) + '<span style="vertical-align:baseline; position:relative; top:-0.05em;">:</span>' + parseInt(vres1 / GCD(hres1, vres1)) + ')');
        $('#RESULT_RATIO').html(ar1 + '&#x2236;1 (' + commas(parseInt(hres1 / GCD(hres1, vres1))) + '&#x2236;' + commas(parseInt(vres1 / GCD(hres1, vres1))) + ')');
        $('#RESULT_TOTAL_PX').html(commas(total_px) + ' (' + prefixGen(total_px, 2)['num'] + ' ' + prefixGen(total_px, 2)['prefix'] + 'px)');
    }
    else {
        $('#RESULT_RATIO').html('');
        $('#RESULT_TOTAL_PX').html('');
    }


    
    //!= '' && vres1 != '' && hres1 != 0 && vres1 != 0 && isNaN(hres1) == false && isNaN(vres1) == false
    //DEBUG('isInt', isInt([hres1, vres1, hres_den, vres_den]), 'isPositive', isPositive([hres1, vres1, hres_den, vres_den]));
    //DEBUG('hres1', hres1, isInt(hres1), 'vres1', vres1, isInt(vres1), 'hres_den', hres_den, isInt(hres_den), 'vres_den', vres_den, isInt(vres_den));
    if (isInt([hres1, vres1, hres_den, vres_den]) && isPositive([hres1, vres1, hres_den, vres_den])) {
        // $('#RESULT_DENSITY_RATIO').html(commas(ar_den.toFixed(3)) + ' (' + parseInt(hres_den / GCD(hres_den, vres_den)) + '<span style="vertical-align:baseline; position:relative; top:-0.05em;">:</span>' + parseInt(vres_den / GCD(hres_den, vres_den)) + ')');
        $('#RESULT_DENSITY_RATIO').html(ar_den + '&#x2236;1 (' + commas(parseInt(hres_den / GCD(hres_den, vres_den))) + '&#x2236;' + commas(parseInt(vres_den / GCD(hres_den, vres_den))) + ')');
    }
    else {
        $('#RESULT_DENSITY_RATIO').html('');
    }


    return;
}


// Returns false if input is a non-integer number or NaN
function isInt(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == false) {
                //DEBUG('isInt Array False. a:', a, 'num[a]:', num[a], 'Number.isInteger(num[a]):', Number.isInteger(num[a]));
                return false;
            }
            return true;
        }
    }
    else
        return Number.isInteger(parseNum(num));
}


function isFloat(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == true || Number.isNaN(num[a]) == true) {
                return false;
            }
            return true;
        }
    }
    else
        return !(Number.isInteger(parseNum(num)) || Number.isNaN(parseNum(num)));
}


// Returns false if input is not a positive number (zero, negative number, or NaN)
function isPositive(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true)
                return false;
            else if (num[a] <= 0)
                return false;
        }
        return true;
    }
    else {
        if (Number.isNaN(parseNum(num)) == true)
            return false;
        else if (num > 0)
            return true;
        else {
            return false;
        }
    }
}

function isNonNegative(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true)
                return false;
            else if (num[a] < 0)
                return false;
        }
        return true;
    }
    else {
        if (Number.isNaN(parseNum(num)) == true)
            return false;
        else if (num >= 0)
            return true;
        else {
            return false;
        }
    }
}

// Returns false if input is NaN
function isNum(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true) {
                return false;
            }
            return true;
        }
    }
    else {
        return !Number.isNaN(parseNum(num));
    }
}

// Converts string to floating point if it has a decimal point, or integer if there is no decimal point. Also strips commas and spaces, and optionally applies absolute value.
// Cannot handle inputs with negative signs in the wrong position.
function parseNum(str) {
    if (typeof str === "string") {
        str = str.replace(/[^0-9\. ]/g, ''); // Apply absolute value
        // str = str.replace(/[^0-9\. -]/g, ''); // Allow negative numbers
        
        // Return NaN if...
        if (str == '' // input is blank
            || str.indexOf('.') != str.lastIndexOf('.') // input contains multiple decimal places
            || str.indexOf('-') != str.lastIndexOf('-') // input contains multiple minus signs
            || (str.indexOf('-') != -1 && str.indexOf('-') != 0)) { // input contains a minus sign in a position other than the first character
            
            return NaN;
        }

        else {
            if (str.indexOf('.') == -1)
                return parseInt(str);
            else {
                return parseFloat(str);
            }
        }
    }
    else if (Number.isNaN(str))
        return NaN;
    else if (typeof str === "number") {
        return str;
    }
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
}


function GCD(a, b) {
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


function commas(input, group, radix) {
    if (!group) { group = ','; }
    if (!radix) { radix = '.'; }
    var parts = input.toString().split(radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, group);
    return parts.join(radix);
}


function long_division(A, B, options) {
    if (isNaN(A / B) || !isFinite(A / B)) { DEBUG('Answer is NaN or Infinity. Function aborted.'); return ''; }

    var OL_open = '<span style="text-decoration:overline;">'; // Overline markup opening tag
    var OL_close = '</span>'; // Overline markup closing tag. Used in conjunction with OL_open to surround the repeating numbers. May be set to control markup, separate it with parentheses, or simply left blank, etc.
    var p_max = 8; // Maximum number of decimal places
    var p_min = 3; // Minimum number of decimal places
    var Approx = '≈'; // Symbol to be used for "approximately equal to". Can be set blank to turn off this functionality, etc.
    var Radix_Point = '.';  // Character to use for the radix point ("decimal point")
    var Group = ','; // Character to use for digit grouping. Can be set blank to disable digit grouping.
    var Base = 10; // Number base system to use
    var Minus_Sign = '&minus;'; // Character to preceed negative numbers. Default minus sign, can be set blank to output absolute value, or set to hyphen-minus for better compatibility or for other functions to be able to parse as a number correctly.
    var Plus_Sign = ''; // Character to preceed positive numbers. Default blank, but can be set to "+" if explicit signs on both positive and negative numbers is desired.
    var RepeatSinglesFlag = true; // Display single-digit repeating patterns as 1.(33) instead of 1.(3)

    if (typeof(options) === 'number') { // If 3rd argument is a number rather than a dictionary, use it as the p_max value
        p_max = options;
    }
    else if(options) {
        if ('OL_open' in options) { OL_open = options['OL_open']; }
        if ('OL_close' in options) { OL_close = options['OL_close']; }
        if ('p_max' in options) { p_max = options['p_max']; }
        if ('p_min' in options) { p_min = options['p_min']; }
        if ('radix' in options) { Radix_Point = options['radix']; }
        if ('group' in options) { Group = options['group']; }
        if ('approx' in options) { Approx = options['approx']; }
        if ('minus' in options) { Minus_Sign = options['minus']; }
        if ('plus' in options) { Plus_Sign = options['plus']; }
        if ('base' in options) { Base = options['base']; }
        if ('repeat_singles' in options) { RepeatSinglesFlag = options['repeat_singles']; }
    }

    var Decimal_Digits = '';
    var Previous_Dividends = {};
    var Prefix = '';
    var Repetend = '';
    var RepeatFlag = false;
    var ApproxFlag = true;
    var Sign = Plus_Sign;

    // Determine if answer will be negative, then use the absolute value of inputs for the rest of the calculations.
    if ((A < 0) ? !(B < 0) : (B < 0)) { Sign = Minus_Sign; } // If (A is negative) XOR (B is negative) then final result will be negative.
    var Dividend = Math.abs(parseFloat(A));
    var Divisor = Math.abs(parseFloat(B));

    p_max = parseInt(p_max);
    p_min = parseInt(p_min);
    Base = parseInt(Base);
    if (p_max < 0 || p_min < 0 || p_max < p_min || isNaN(p_max) || isNaN(p_min) || !isFinite(p_max) || !isFinite(p_min)) {
        DEBUG('Invalid p_max and p_min values. Both values must be non-negative numbers, and p_min cannot be greater than p_max. p_max:', p_max, 'p_min', p_min)
        return '';
    }
    if (!isInt(Base)) {
        DEBUG('Invalid Base value. Must be an integer number. Base:', Base);
        return '';
    }
    if (p_max == 0) { // If p_max is 0, then output is integer values only, and the long division section is not necessary.
        var Result = Math.round(Dividend / Divisor).toFixed(0);
        if (Result != (Dividend / Divisor)) { ApproxFlag = true; }
        Result = Sign.concat(Result.toString());
        if (ApproxFlag == true) { Result = Approx.concat(Result); }
        return Result;
    }

    var Quotient = Dividend / Divisor;
    var Remainder = Dividend % Divisor;
    var Result = Math.floor(Quotient).toString() + Radix_Point; // Use floor division to determine the front part of the number immediately
    Dividend = Remainder * Base;

    // Use long division for the decimal places, so that repeating decimals can be detected
    var i = 0;
    while (i < p_max + 2) {
        if (!(Dividend in Previous_Dividends)) {
            Previous_Dividends[Dividend] = i;

            Quotient = Dividend / Divisor;
            Remainder = Dividend % Divisor;
            Dividend = Remainder * Base;

            //if (i < p_max) {
                Decimal_Digits += Math.floor(Quotient).toString();
            //}

            //DEBUG('i:', i, 'Quotient:', Quotient, 'Remainder:', Remainder, 'Dividend:', Dividend, 'Result:', Result, 'Decimal_Digits:', Decimal_Digits);
        }
        else {
            RepeatFlag = true;
            ApproxFlag = false;
            Prefix = Decimal_Digits.substring(0, Previous_Dividends[Dividend]);
            Repetend = Decimal_Digits.substring(Previous_Dividends[Dividend], Decimal_Digits.length);

            if (Repetend == '0') {  // A "repeating" dividend of 0 signals a non-repeating result
                Repetend = '';
                RepeatFlag = false;
                Decimal_Digits = Prefix;
            }

            //Decimal_Digits = Prefix + Repetend;
            break;
        }
        i += 1;
    }

    if (RepeatFlag == false) {
        if (Decimal_Digits.length > p_max) {
            //Decimal_Digits = Decimal_Digits.substr(0, p_max);
            Decimal_Digits = Math.round(parseFloat(Decimal_Digits.substr(0, p_max) + '.' + Decimal_Digits.substr(p_max))).toString();
            if (p_max - Decimal_Digits.length >= 0) {
                Decimal_Digits = '0'.repeat(p_max - Decimal_Digits.length) + Decimal_Digits;
            }
            ApproxFlag = true;
        }
        if ((Decimal_Digits.length < p_min) && (p_min - Decimal_Digits.length >= 0)) {
            Decimal_Digits += '0'.repeat(p_min - Decimal_Digits.length);
        }
    }

    if (RepeatFlag == true) {
        if (Prefix.length + Repetend.length > p_max) {
            if (Prefix.length > p_max) {
                Prefix = Math.round(parseFloat(Prefix.substr(0, p_max) + '.' + Prefix.substr(p_max))).toString();
                if (p_max - Prefix.length >= 0) {
                    Prefix = '0'.repeat(p_max - Prefix.length) + Prefix;
                }
            }
            else {
                Prefix = Prefix + Repetend.substr(0, p_max - Prefix.length);
            }
            Decimal_Digits = Prefix;
            RepeatFlag = false;
            ApproxFlag = true;
        }
        if (Prefix.length + Repetend.length < p_min) {
            if ((p_min - (Prefix.length + Repetend.length)) >= Repetend.length) {
                Repetend += Repetend.repeat(Math.floor((p_min - (Prefix.length + Repetend.length)) / Repetend.length));
            }
            while (Prefix.length + Repetend.length < p_min) {
                Prefix = Prefix.concat(Repetend[0]);
                Repetend = Repetend.slice(1).concat(Repetend[0]);
            }
        }
    }

    if (RepeatFlag == true) {
        if (Repetend.length == 1 && (Prefix.length + Repetend.length < p_max) && RepeatSinglesFlag == true) { Repetend = Repetend.repeat(2); } // Single-digit repetitions will be displayed twice, i.e. 4/3 will result in 1.(33) rather than 1.(3)
        Result += Prefix + OL_open + Repetend + OL_close;
    }
    else {
        Result += Decimal_Digits;
    }

    if (Result[Result.length - 1] == Radix_Point) { Result = Result.replace(Radix_Point, ''); }


    Result = commas(Result, Group, Radix_Point);

    Result = Sign.concat(Result);

    if (ApproxFlag == true) {
        Result = Approx.concat(Result);
    }
    
    return Result;

    //return Result * Sign;
}