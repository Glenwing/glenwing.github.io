/*

LongDivide.js
Created by Glenwing (https://github.com/Glenwing)

Version: 1.4.0
June 17, 2020

*/

// Default options
LongDivide.version = '1.4.0';

LongDivide.p_max = 8;
LongDivide.p_min = 0;
LongDivide.sf = 0;
LongDivide.leading = 1;
LongDivide.decimal = '.';
LongDivide.thousands = '';
LongDivide.thousandths = '';
LongDivide.sep4digit = true;
LongDivide.orphans = false;
LongDivide.minus = '\u2212';
LongDivide.plus = '';
LongDivide.approx = '\u2248';
LongDivide.currency = '';
LongDivide.micro = '\u00B5';
LongDivide.exp = '';
LongDivide.exp_open = 'e';
LongDivide.exp_close = '';
LongDivide.exp_minus = LongDivide.minus;
LongDivide.exp_plus = LongDivide.plus;
LongDivide.OL_open = '<span style="text-decoration:overline;">';
LongDivide.OL_close = '</span>';
LongDivide.si = false;
LongDivide.unit_sep = '\u00A0';
LongDivide.two_singles = true;
LongDivide.repeat = true;

LongDivide.Decimaljs_precision = 100;
LongDivide.Decimaljs_precision_old = 20;
LongDivide.errors = true;
LongDivide.warnings = true;
LongDivide.error_output = NaN;

function LongDivide (A, B, options) {
    //console.log('BEGIN:', A, '÷', B)
    if (A === '' || B === '' || typeof(A) === 'undefined' || typeof(B) === 'undefined') { return LongDivide.error_output; }

    try {
        Decimal.precision;
    } catch (ReferenceError) {
        LongDivide.PrintError('LongDivide', 'Decimal.js library not detected. LongDivide.js requires Decimal.js in order to operate. (https://github.com/MikeMcl/decimal.js)');
        return LongDivide.error_output;
    }
    LongDivide.Decimaljs_precision_old = Decimal.precision;
    Decimal.set({ precision:LongDivide.Decimaljs_precision });

    if (typeof(A) === 'string' || typeof(A) === 'number') {
        try {
            A = new Decimal(A);
            if (A.isNaN() || !A.isFinite()) { LongDivide.PrintError('LongDivide', 'Function aborted. First argument is NaN or Infinity.\nArgument:', A); return LongDivide.error_output; }
        }
        catch (DecimalError) { LongDivide.PrintError('LongDivide', 'Function aborted. First argument could not be interpreted as a number.\nArgument:', A); return LongDivide.error_output; }
    }
    else if (typeof(A) === 'object') {
        if (A.constructor !== Decimal) {
            LongDivide.PrintError('LongDivide', 'Function aborted. First argument is an unrecognized object. Argument must be a string, number, or Decimal object.\nArgument:', A);
            return LongDivide.error_output;
        }
    }
    else { LongDivide.PrintError('LongDivide', 'Function aborted. First argument is an unrecognized type.\ntypeof(A):', typeof(A)); return LongDivide.error_output; }

    if (typeof(B) === 'string' || typeof(B) === 'number') {
        try {
            B = new Decimal(B);
            if (B.isNaN() || !B.isFinite()) { LongDivide.PrintError('LongDivide', 'Function aborted. Second argument is NaN or Infinity.\nArgument:', B); return LongDivide.error_output; }
        }
        catch (DecimalError) { LongDivide.PrintError('LongDivide', 'Function aborted. Second argument could not be interpreted as a number.\nArgument:', B); return LongDivide.error_output; }
    }
    else if (typeof(B) === 'object') {
        if (B.constructor !== Decimal) {
            LongDivide.PrintError('LongDivide', 'Function aborted. Second argument is an unrecognized object. Argument must be a string, number, or Decimal object.\nArgument:', B);
            return LongDivide.error_output;
        }
    }
    else { LongDivide.PrintError('LongDivide', 'Function aborted. Second argument is an unrecognized type.\ntypeof(B):', typeof(B)); return LongDivide.error_output; }

    if (B.isZero()) {
        LongDivide.PrintError('LongDivide', 'Function aborted. Division by zero');
        return LongDivide.error_output;
    }
    if (!A.div(B).isFinite()) {
        LongDivide.PrintError('LongDivide', 'Function aborted. Division result is Infinity,\nA:', A.toFixed(A.dp()), '\nB:', B.toFixed(B.dp()));
        return LongDivide.error_output;
    }

    //console.log('A', A);
    //console.log('B', B);

    if (typeof(options) === 'undefined') { options = {}; }

    //console.log('Decimals:\nA:', A.toFixed(A.dp()).toString(), '(' + A.toFixed(A.dp()).toString().length + ')', '\nB', B.toFixed(B.dp()).toString(), '(' + B.toFixed(B.dp()).toString().length + ')');
    //console.log('Decimal Places:\nA:', A.dp(), '\nB:', B.dp());

    if (typeof(options) === 'number') { options = {'p': options} } // If 3rd argument is a number rather than a dictionary, use it as the P_Max and P_Min value
    else if (typeof(options) === 'string') { options = LongDivide.parseFormatString(options); } // If 3rd argument is a string, send it through the format string parser
    else if ('format' in options) { options = LongDivide.parseFormatString(options); } // If 3rd argument is a dictionary that contains a 'format' entry, send it through the format string parser

    // Set variables according to entries specified in options dictionary

    // Overline markup opening tag
    var OL_open =            options['overline'] !== undefined ? options['overline'] : options['OL'] !== undefined ? options['OL'] : options['ol'] !== undefined ? options['ol'] : options['OL_open'] !== undefined ? options['OL_open'] :
        LongDivide.OL_open; // Default value
        if (Array.isArray(OL_open)) { OL_open = OL_open[0]; }

    // Overline markup closing tag. Used in conjunction with OL_open to surround the repeating numbers. May be set to control markup, separate it with parentheses, or simply left blank, etc.
    var OL_close =           options['overline'] !== undefined ? options['overline'] : options['OL'] !== undefined ? options['OL'] : options['ol'] !== undefined ? options['ol'] : options['OL_close'] !== undefined ? options['OL_close'] :
        LongDivide.OL_close;
        if (Array.isArray(OL_close)) { OL_close = OL_close[1]; }
    
    // Maximum number of decimal places; option 'p' (for setting both min and max precision together) takes priority if set
    var P_Max =              options['p'] !== undefined ? options['p'] : options['P'] !== undefined ? options['P'] : options['p_max'] !== undefined ? options['p_max'] : options['pmax'] !== undefined ? options['pmax'] :
        LongDivide.p_max;
        if (Array.isArray(P_Max)) { P_Max = P_Max[1]; }

    // Minimum number of decimal places; option 'p' (for setting both min and max precision together) takes priority if set
    var P_Min =              options['p'] !== undefined ? options['p'] : options['P'] !== undefined ? options['P'] : options['p_min'] !== undefined ? options['p_min'] : options['pmin'] !== undefined ? options['pmin'] :
        LongDivide.p_min;
        if (Array.isArray(P_Min)) { P_Min = P_Min[0]; }

    // Number of significant figures for result. Ignored if set to 0 (false).
    var Sig_Figs =           options['sf'] !== undefined ? options['sf'] : options['sd'] !== undefined ? options['sd'] : options['sig'] !== undefined ? options['sig'] : options['sigfigs'] !== undefined ? options['sigfigs'] :
        LongDivide.sf;

    // Minimum number of digits in the integer part of the number. Leading zeros are added if necessary.
    var Leading_Digits =     options['leading'] !== undefined ? options['leading'] :
        LongDivide.leading;

    // Character to use for the radix point (decimal point)
    var Decimal_Point_Char = options['decimal'] !== undefined ? options['decimal'] :
        LongDivide.decimal;

    // Characters used for grouping thousands (i.e. 10000 -> 10,000)
    var Thousands_Char = undefined;
    var Thousandths_Char = undefined;
    var sep4digit = undefined;
    var Orphans = undefined;
    if (Array.isArray(options['sep'])) {
        Thousands_Char =    options['sep'][0];
        Thousandths_Char =  options['sep'][1] !== undefined ? options['sep'][1] : undefined ;
        sep4digit =         options['sep'][2] !== undefined ? options['sep'][2] : LongDivide.sep4digit ;
        Orphans =           options['sep'][3] !== undefined ? options['sep'][3] : undefined ;
    }
    else if (typeof(options['sep']) === 'string') {
        Thousands_Char = options['sep'];
    }
    if (Thousands_Char === undefined) {
        Thousands_Char = options['thousands'] !== undefined ? options['thousands'] :
        LongDivide.thousands;
    }
    if (Thousandths_Char === undefined) {
        Thousandths_Char = options['thousandths'] !== undefined ? options['thousandths'] :
        LongDivide.thousandths;
    }
    if (Orphans === undefined && (options['orphans'] !== undefined || options['orphan'] !== undefined)) {
        Orphans = options['orphans'] || options['orphan'];
    }
    else {
        Orphans = LongDivide.orphans;
    }


    // var Thousands_Char =     options['group'] !== undefined ? options['group'] : options['thousands'] !== undefined ? options['thousands'].toString() :
        // LongDivide.thousands;

    // Character used for grouping thousandths (i.e. 1.0000000001 -> 1.000 000 000 1)
    // var Thousandths_Char =   options['thousandths'] !== undefined ? options['thousandths'].toString() :
        // LongDivide.thousandths;

    // Flag to allow an "orphan" digit after a thousandths separator if there is only 1 digit left (if false, thousandth grouping will prefer a group of 4 digits at the end rather than an orphan digit)
    // var Orphans =            options['orphans'] !== undefined ? options['orphans'] : options['orphan'] !== undefined ? options['orphan'] : 
        // LongDivide.orphans;

    // Number base system to use
    var Base =               options['base'] !== undefined ? options['base'] :
        10;

    // Character to preceed negative numbers
    var Minus_Char =         options['minus'] !== undefined ? options['minus'] :
        LongDivide.minus;

    // Character to preceed positive numbers; blank string by default
    var Plus_Char =          options['plus'] !== undefined ? options['plus'] :
        LongDivide.plus;

    // Symbol to be used for "approximately equal to". Can be set to '~' or blank if desired, etc.
    var Approx_Char =        options['approx'] !== undefined ? options['approx'] : options['~'] !== undefined ? options['~'] :
        LongDivide.approx;

    // Currency symbol to be inserted between the sign and number. Leave blank to have no currency.
    var Currency_Char =      options['currency'] !== undefined ? options['currency'] :
        LongDivide.currency;

    // Symbol to be used for the Micro prefix (10^-6) when SI prefixes are enabled. Default is Greek letter mu (U+00B5).
    var Micro_Char =         options['micro'] !== undefined ? options['micro'] :
        LongDivide.micro;

    // Flag indicating whether SI prefixes are desired or not
    var SI =                 options['si'] !== undefined ? options['si'] : options['SI'] !== undefined ? options['SI'] :
        LongDivide.si;

    // Character to be placed between the number and SI prefix. Default non-breaking space (&nbsp; or U+00A0).
    var UnitSep_Char =       options['unitsep'] !== undefined ? options['unitsep'] :
        LongDivide.unit_sep;

    // Flag indicating whether single-digit repeating patterns should be doubled; i.e. display as 1.(33) instead of 1.(3)
    var RepeatSinglesFlag =  options['2_singles'] !== undefined ? options['2_singles'] :
        LongDivide.two_singles;

    // Flag indicating whether repeating decimal detection should be enabled or not
    var RepeatEnableFlag =   options['repeat'] !== undefined ? options['repeat'] :
        LongDivide.repeat;

    // Exponential notation specifier; 'e', 'ex', 'ed', or 'custom'
    var ExpArrayFlag = false;
    var Exponential =        options['exp'] !== undefined ? options['exp'] : options['e'] !== undefined ? options['e'] :
        LongDivide.exp;
        if (Array.isArray(Exponential)) {
            Exponential = 'custom';
            ExpArrayFlag = true;
        }

    // String to be placed before the exponential power and sign; only valid when options['exp'] is set to 'custom'
    var Exp_open =           ExpArrayFlag === true ? options['exp'][0] : options['exp_open'] !== undefined ? options['exp_open'] :
        LongDivide.exp_open;

    // String to be placed after the exponential power; only valid when options['exp'] is set to 'custom'
    var Exp_close =          (ExpArrayFlag === true  && options['exp'][1] !== undefined) ? options['exp'][1] : options['exp_close'] !== undefined ? options['exp_close'] :
        LongDivide.exp_close;

    // String to be placed before non-negative exponential powers; only valid when options['exp'] is set to 'custom'
    var Exp_plus =           (ExpArrayFlag === true  && options['exp'][2] !== undefined) ? options['exp'][2] : options['exp_plus']  !== undefined ? options['exp_plus']  :
        LongDivide.exp_plus;

    // String to be placed before negative exponential powers; only valid when options['exp'] is set to 'custom'
    var Exp_minus =          (ExpArrayFlag === true  && options['exp'][3] !== undefined) ? options['exp'][3] : options['exp_minus'] !== undefined ? options['exp_minus'] :
        LongDivide.exp_minus;

    // If OL open and closing tags are blanked, assume the user means to disable repeating decimal detection
    if (OL_open == '' && OL_close == '') { RepeatEnableFlag = false; options['repeat'] = false; }

    if (options['thousands'] !== undefined) { if (options['thousands'] === '.' && options['decimal'] === undefined) { Decimal_Point_Char = ','; } }
    if (Decimal_Point_Char === Thousands_Char) {
        if (typeof(options['decimal']) === 'undefined') {
            if      (Decimal_Point_Char === '.') { Decimal_Point_Char = ','; }
            else if (Decimal_Point_Char === ',') { Decimal_Point_Char = '.'; }
        }
        else {
            LongDivide.PrintWarning('LongDivide', 'Decimal point character and thousands grouping character cannot be the same.\nDecimal_Point_Char:' + Decimal_Point_Char + '\nThousands_Char:' + Thousands_Char, '\nDecimal_Point_Char has now been changed to "." and Thousands_Char has now been changed to "," and the function is continuing.');
            Decimal_Point_Char = '.';
            Thousands_Char = ',';
            // return LongDivide.error_output;
        }
    }
    if (Decimal_Point_Char === Thousandths_Char) {
        LongDivide.PrintWarning('LongDivide', 'Decimal point character and thousandths grouping character cannot be the same.\nDecimal_Point_Char:' + Decimal_Point_Char + '\nThousandths_Char:' + Thousandths_Char, '\nDecimal_Point_Char has now been changed to "." and Thousandths_Char has now been changed to "" (blank string) and the function is continuing.');
        Decimal_Point_Char = '.';
        Thousandths_Char = ',';
        // return LongDivide.error_output;
    }
    if (Decimal_Point_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Decimal point character cannot be a number.\nDecimal_Point_Char:', Decimal_Point_Char, '\nDecimal_Point_Char has now been changed to "." and the function is continuing.');
        Decimal_Point_Char = '.';
        // return LongDivide.error_output;
    }
    if (Thousands_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Thousands grouping character cannot be a number.\nThousands_Char:', Thousands_Char, '\nThousands_Char has now been changed to "," and the function is continuing.');
        Thousands_Char = ',';
        // return LongDivide.error_output;
    }
    if (Thousandths_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Thousandths grouping character cannot be a number.\nThousandths_Char:', Thousandths_Char, '\nThousandths_Char has now been changed to "" (blank string) and the function is continuing.');
        Thousandths_Char = '';
        // return LongDivide.error_output;
    }
    if (Minus_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Minus sign character cannot be a number.\nMinus_Char:', Minus_Char, '\nMinus_Char has now been changed to "-" (hyphen-minus) and the function is continuing.');
        Minus_Char = '-';
        // return LongDivide.error_output;
    }
    if (Plus_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Plus sign character cannot be a number.\nPlus_Char:', Plus_Char, '\nPlus_Char has now been changed to "" (blank string) and the function is continuing.');
        Plus_Char = '';
        // return LongDivide.error_output;
    }
    if (Approx_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Approximation sign character cannot be a number.\nApprox_Char:', Approx_Char, '\nApprox_Char has now been changed to "" (blank string) and the function is continuing.');
        Approx_Char = '';
        // return LongDivide.error_output;
    }
    if (Currency_Char.toString().match(/[0-9]/g)) {
        LongDivide.PrintWarning('LongDivide', 'Currency symbol cannot be a number.\nCurrency_Char:', Currency_Char, '\nCurrency_Char has now been changed to "" (blank string) and the function is continuing.');
        Currency_Char = '';
        // return LongDivide.error_output;
    }

    // Determine whether exponential notation is enabled (it's a somewhat convoluted check, so putting it on a single variable is useful)
    var Exp_flag = false;
    if (Exponential === true) { Exponential = 'e'; } // If Exponential is given as a boolean, interpret it as request for standard 'e'-style exponential form
    else if (typeof(Exponential) === 'string') {
        Exponential = Exponential.toLowerCase();
        if (Exponential == 'e' || Exponential == 'ex' || Exponential == 'ed' || Exponential == 'custom') { Exp_flag = true; }
    }

    //console.log('options:', options);

    // Additional variables containing characters to be added when the final result is constructed
    var Sign = Plus_Char; // Will be set to either Minus_Char or Plus_Char later depending on the inputs
    var Approx = ''; // Will be set to Approx_Char later if the division algorithm detects a non-exact result; otherwise left as a blank string
    var SI_Prefix = '';
    var temp;

    // Integerize variables for safety
    P_Max = Math.round(P_Max);
    P_Min = Math.round(P_Min);
    Sig_Figs = Math.round(Sig_Figs);
    Base = Math.round(Base);
    // Validity checks for precision and base
    if (P_Max < 0 || P_Min < 0 || P_Max < P_Min || Sig_Figs < 0 || Number.isNaN(P_Max) || Number.isNaN(P_Min) || Number.isNaN(Sig_Figs) || !Number.isFinite(P_Max) || !Number.isFinite(P_Min) || !Number.isFinite(Sig_Figs)) {
        LongDivide.PrintError('LongDivide', 'Function aborted. Invalid P_Max, P_Min, or Sig_Figs value. All values must be non-negative numbers, and P_Min cannot be greater than P_Max.', 'P_Max:', P_Max, 'P_Min:', P_Min, 'Sig_Figs:', Sig_Figs);
        return LongDivide.error_output;
    }
    if (isNaN(Base)) {
        LongDivide.PrintError('LongDivide', 'Function aborted. Invalid Base value. Must be an integer number.\nBase:', Base);
        return LongDivide.error_output;
    }

    // Adjust numerator for metric prefixes
    if (SI == true) {
        var Power = 0;
        var watchdog = 0;
        while (Power < 24 && Power > -24 && watchdog < 10) {
            //console.log('A/B: ' + A.div(B) + '\nPower: ' + Power);
            if (A.div(B).abs() >= 1000) {
                A = A.div(1000); Power += 3;
            }
            else if (Math.abs(A.div(B)) < 1) {
                A = A.times(1000); Power -= 3;
            }
            else {
                break;
            }
            watchdog += 1;
            if (watchdog == 10) {
                LongDivide.PrintWarning('LongDivide', 'Runaway loop in the SI prefix section has hit the watchdog threshold (10 loop cycles) and was aborted. Check your code!\n', 'A:', A, 'B:', B, 'Power:', Power);
            }
        }
        var SI_Prefix_Table = {
            '24':  'Y',
            '21':  'Z',
            '18':  'E',
            '15':  'P',
            '12':  'T',
            '9':   'G',
            '6':   'M',
            '3':   'k',
            '0':   '',
            '-3':  'm',
            '-6':  Micro_Char,
            '-9':  'n',
            '-12': 'p',
            '-15': 'f',
            '-18': 'a',
            '-21': 'z',
            '-24': 'y',
        }
        //SI_Prefix = (Power == 0 ? '' : Unit_sep + SI_Prefix_Table[Power]); // Ternary check avoids prefix being set to just Unit_sep when the power is 0 (no prefix required)
        SI_Prefix = UnitSep_Char + SI_Prefix_Table[Power];
    }

    // If precision is set to 0, then the standard division operator can be used to obtain the result.
    if (P_Max == 0 && Exp_flag == false) { //console.log('P_Max is zero. Performing standard division operation. Preliminary Result:\n' + Result.toString() + '\n' + typeof(Result));
        temp = A.div(B).round();
        if      (temp.isZero()) { Sign = ''; }
        else if (temp.isNegative()) { Sign = Minus_Char; } // If the number is negative, attach the Minus sign character set in options
        else { Sign = Plus_Char; } // Otherwise, attach the Plus sign character set in options (blank string by default)
        var Result = temp.abs();
        Result = Result.toFixed(Result.dp()); // toFixed avoids exponential notation
        // Result is now a string
        Result = LongDivide.GroupDigits(Result, Thousands_Char, Thousandths_Char, Decimal_Point_Char, Orphans);
        Result = Currency_Char.concat(Result);
        //Result = Sign.concat(Result);
        Result = Result.concat(SI_Prefix);
        if (Sign !== '()') { Result = Sign.concat(Result); } else { Result = '('.concat(Result).concat(')'); }
        if (!(A.div(B).equals(temp))) { Result = Approx_Char.concat(Result); } // If input numbers are not evenly divisible, attach the approximation sign set in options
        Decimal.set({ precision:LongDivide.Decimaljs_precision_old }); 
        return Result
    }

    // Handle floating point numbers by multiplying them by 10 until they are integers
    if (A.dp() != 0 || B.dp() != 0) {
        var Multiplier = Decimal.max(A.dp(), B.dp());
        A = A.times(Multiplier);
        B = B.times(Multiplier);
    }
    // End floating point section

    // Begin exponential notation section

    var Exp_power = new Decimal(0);
    var Exp_sign = '';
    if (Exp_flag == true) {
        if (Sig_Figs > 0) { P_Max = Sig_Figs - 1; } // If sig figs mode is active, then there will always be 1 digit in front of the decimal point, and Sig_Figs - 1 digits behind it in exponential notation.
        if (Exponential === 'e') {
            Exp_open = 'e';
            Exp_close = '';
            Exp_plus = '+';
            Exp_minus = Minus_Char;
        }
        else if (Exponential === 'ex') {
            Exp_open = '\u00A0\u00D7\u00A010<sup>';
            Exp_close = '</sup>';
            Exp_plus = Plus_Char;
            Exp_minus = Minus_Char;
        }
        else if (Exponential === 'ed') {
            Exp_open = '\u00A0\u2219\u00A010<sup>';
            Exp_close = '</sup>';
            Exp_plus = Plus_Char;
            Exp_minus = Minus_Char;
        }
        // if Exponential == 'custom', then Exp vars have already been set to the strings specified in options

        temp = A.div(B).abs();
        if (temp > 0 && (temp < 1 || temp >= 10)) { // Check if numbers need to be multiplied for exponential notation
            Exp_power = new Decimal(temp.precision(true) - temp.decimalPlaces() - 1);
        }
        if (Exp_power.isNegative()) {
            A = A.times(Decimal.pow(10, Exp_power.abs())); Exp_power = Exp_power.abs();
            if (A.div(B).abs().toFixed(P_Max).slice(0, 2) == '10') { // Checks if rounding to P_Max will bump up to the next power
                B = B.times(10);
                Exp_power = Exp_power.minus(1);
            }
            Exp_sign = Exp_minus;
        }
        else if (Exp_power.isPositive() || Exp_power.isZero()) { // If exponent is positive or zero
            B = B.times(Decimal.pow(10, Exp_power));
            if (A.div(B).abs().toFixed(P_Max).slice(0, 2) == '10') { // Checks if rounding to P_Max will bump up to the next power
                B = B.times(10);
                Exp_power = Exp_power.plus(1);
            }
            Exp_sign = Exp_plus;
        }
        Exp_power = Exp_power.toFixed(0); // Converts Exp_power to a string
    }
    else { // If Exp_flag is false, turn exponential notation off by setting all exp parameters to blank strings
        Exp_power = '';
        Exp_open = '';
        Exp_close = '';
        Exp_sign = '';
    }

    // Determine if answer will be negative, set Sign to the appropriate sign, then take the absolute value for the rest of the calculations.
    if (A.div(B).isZero()) { Sign = ''; }
    else if (A.isNegative() ? !(B.isNegative()) : B.isNegative()) { Sign = Minus_Char; } // If (A is negative) XOR (B is negative) then final result will be negative.
    else { Sign = Plus_Char; } // Plus_Char is a blank string by default, but can be set to '+' to force sign for positive numbers
    A = A.abs();
    B = B.abs();


    /********  Long Division Algorithm  ********/

    
    var Dividend = A;
    var Divisor  = B;
    var Quotient;
    var Remainder;
    var Integer;

    var Decimal_Digits = '';
    var Previous_Dividends = {};
    var Prefix = '';
    var Repetend = '';
    var RepeatFlag = false;

    Quotient  = Dividend.dividedBy(Divisor).floor();
    Remainder = Dividend.modulo(Divisor);
    Dividend = Remainder.times(Base);

    // The initial Quotient floor division above determines the front part of the number immediately
    Integer = Quotient.toFixed(Quotient.dp());
    //console.log('Integer:', Integer)

    var foundFirstSF = true;
    if (Sig_Figs > 0) {
        if (Integer > 0) {
            P_Max = Sig_Figs - Integer.length;
            P_Min = Sig_Figs - Integer.length;
        }
        else {
            foundFirstSF = false;
        }
        if (P_Max < 0) { P_Max = 0; }
        if (P_Min < 0) { P_Min = 0; }
    }

    //console.log('Quotient:', Quotient.toNumber(), 'Remainder:', Remainder.toNumber(), 'Dividend:', Dividend.toNumber(), 'Decimal_Digits:', Decimal_Digits, 'Previous Dividends:', Previous_Dividends);

    var i = 0;
    var sfCount = 0; // Counts the number of sig figs encountered when the integer portion is 0 (value is meaningless when integer section is > 0)
    // Compute terms up to the specified precision (P_Max) + 2. Going 1 decimal beyond P_Max is required to facilitate rounding, but 2 beyond P_Max is...
    // ...required for correct detection of exact division results (such as 1/8 = 0.125 exactly). 2 extra decimal places are necessary so that...
    // ...the algorithm can identify the implicit repeating 0 pattern that follows the last digit, which characterizes an exact result.
    while (i < P_Max + 2 && (sfCount < Sig_Figs + 2)) {
        // When you encounter a dividend that you have already seen, it indicates an infinitely repeating pattern
        if (!(Dividend.toNumber() in Previous_Dividends)) {
            // Stores the position (relative to the decimal point) of where each dividend was encountered. This is used for determining which digits are part of the prefix and which are part of the repetend
            Previous_Dividends[Dividend.toNumber()] = i;

            Quotient  = Dividend.dividedBy(Divisor).floor();
            Remainder = Dividend.modulo(Divisor);
            Dividend  = Remainder.times(Base);

            Decimal_Digits += Quotient.toFixed(Quotient.dp());
            if (Sig_Figs > 0) {
                if (Quotient.toFixed(Quotient.dp()) !== '0') {
                    foundFirstSF = true;
                }
                if (foundFirstSF == true) {
                    sfCount += 1;
                }
                if (sfCount == Sig_Figs && P_Max > i) {
                    P_Max = i + 1;
                    P_Min = i + 1;
                }
            }

            //console.log('i:', i, 'Quotient:', Quotient.toNumber(), 'Remainder:', Remainder.toNumber(), 'Dividend:', Dividend.toNumber(), 'Result:', Result, 'Decimal_Digits:', Decimal_Digits, 'sfCount:', sfCount, 'foundFirstSF:', foundFirstSF);
        }
        else {
            RepeatFlag = true;
            Approx = '';

            //console.log('Repeating Pattern Detected');
            Prefix = Decimal_Digits.substring(0, Previous_Dividends[Dividend]);
            Repetend = Decimal_Digits.substring(Previous_Dividends[Dividend], Decimal_Digits.length); //console.log('Prefix:', Prefix, '; Repetend:', Repetend);

            // A "repeating" pattern of 0s signals a non-repeating result
            if (Repetend == '0') { //console.log('Removing Repetend of 0...');
                Repetend = '';
                RepeatFlag = false;
                Decimal_Digits = Prefix;
            }
            if (Decimal_Digits.length > P_Max) { //console.log('Repetend is longer than P_Max; reverting to standard rounded result.');
                Repetend = '';
                RepeatFlag = false;
            }
            if (RepeatFlag == true && RepeatEnableFlag == false) { // Handle the case that repeating decimals have been disabled in the options; convert to standard rounded result by adding repetends until P_Max is exceeded.
                var watchdog = 0;
                while (Decimal_Digits.length <= P_Max) {
                    Decimal_Digits = Decimal_Digits.concat(Repetend);
                    watchdog += 1;
                    if (watchdog > 1000) { LongDivide.PrintWarning('LongDivide', 'Runaway loop has hit the watchdog threshold in the RepeatEnableFlag section (1000 loop cycles) and was aborted. Check your code!\nDecimal_Digits.length:', Decimal_Digits.length, 'Repetend:', Repetend, 'P_Max:', P_Max); break; }
                }
                Repetend = '';
                RepeatFlag = false;
            }

            break;
        }
        i += 1;
    }

    // Handle rounding and padding (P_Max and P_Min options)
    // Rounds result when Decimal_Digits is longer than P_Max (to obey the maximum precision specified in the options)
    if (Decimal_Digits.length > P_Max) { //console.log('Rounding decimals.'); //console.log('Decimal_Digits:', Decimal_Digits.toNumber(), 'Decimal_Digits.toString().length:', Decimal_Digits.toString().length);
        Decimal_Digits = (new Decimal('0.'.concat(Decimal_Digits))).toDecimalPlaces(P_Max);
        // If rounding overflows to the integer section (i.e. 0.999 with P_Max of 2 becomes 1.00), increment the integer result by 1
        if (Decimal_Digits.gte(1)) {
            Decimal_Digits = Decimal_Digits.minus(1);
            var IntegerBefore = new Decimal(Integer);
            Integer = (new Decimal(Integer)).plus(1).toFixed(0);

            // If overflow to integer section also causes the integer to increase in length (i.e. from 9 to 10, or 99 to 100, etc.) then reduce the number of decimal places by 1 if Sig Figs mode is active and if there are any decimal places still remaining.
            if (Sig_Figs > 0 && IntegerBefore.toString().length > Integer.toString().length && P_Max > 0 && P_Min > 0) { // If sig figs mode is active and the integer section was increased in length, also reduce the number of decimal places by 1.
                P_Max -= 1;
                P_Min -= 1;
            }
        }
        // Converts Decimal_Digits to string, then removes the '0.' at the beginning to get just the decimal digits
        Decimal_Digits = Decimal_Digits.toFixed(P_Max).slice(2);
        // An approximation sign is added when the result is rounded, to indicate a non-exact result
        Approx = Approx_Char;
    }
    if (Decimal_Digits.length < P_Min) { //console.log('Decimal_Digits.length: ' + Decimal_Digits.length + '; P_Min: ' + P_Min);
        // For non-repeating results, adds trailing zeros if Decimal_Digits is shorter than P_Min (to obey the minimum precision specified in the options)
        if (RepeatFlag == false) { Decimal_Digits = (new Decimal('0.'.concat(Decimal_Digits))).toFixed(P_Min).slice(2); }
        // For repeating results, multiplies the repeating pattern to get as close to P_Min as possible, then cycles the pattern to match P_Min if necessary
        else if (RepeatFlag == true) {
            // Multiply the repetend to get as close to P_Min as possible (can only get within a multiple of Repetend.length)
            if ((P_Min - (Prefix.length + Repetend.length)) >= Repetend.length) { //console.log('Multiplying repetend. Remaining space:', P_Min - (Prefix.length + Repetend.length), 'Repetend length:', Repetend.length, 'Multiply by:', Math.floor((P_Min - (Prefix.length + Repetend.length)) / Repetend.length));
                Repetend += Repetend.repeat(Math.floor((P_Min - (Prefix.length + Repetend.length)) / Repetend.length)); //console.log('New Repetend:', Repetend);
            }
            // Cycle the repetend (perform a left-rotate on the repetend digits, and also add the previous most-significant-digit of the repetend to the prefix)
            while (Prefix.length + Repetend.length < P_Min) {
                Prefix = Prefix.concat(Repetend[0]);
                Repetend = Repetend.slice(1).concat(Repetend[0]);
            }
        }
    }


    /********  Construction of final result  ********/

    var Result = Integer.concat('.');

    // Add or remove leading zeros as specified by the Leading_Digits option
    if((Result.length - 1) < Leading_Digits) { Result = '0'.repeat(Leading_Digits - Result.length + 1).concat(Result); }
    if(Result == '0.' && Leading_Digits == 0) { Result = '.'; }

    if (RepeatFlag == true) {
        // Single-digit repeating patterns are now doubled if selected in the options; i.e. 4/3 will result in 1.(33) rather than 1.(3)
        if (Repetend.length == 1 && (Prefix.length + Repetend.length < P_Max) && RepeatSinglesFlag == true) { Repetend = Repetend.repeat(2); }

        // Construct final number (for repeating results) and add digit grouping
        Result = LongDivide.GroupDigits(Result.concat(Prefix).concat(Repetend), Thousands_Char, Thousandths_Char, Decimal_Point_Char, Orphans, sep4digit);

        // Adds overline tags; Some fancy footwork is needed here to skip over the thousandths separators
        Result = Result.slice(0, Result.indexOf(Decimal_Point_Char) + 1 + Prefix.length + (Thousandths_Char.length * Math.floor(Prefix.length / 3))) + OL_open + Result.slice(Result.indexOf(Decimal_Point_Char) + 1 + Prefix.length + (Thousandths_Char.length * Math.floor(Prefix.length / 3))) + OL_close;
        //Result += Prefix + OL_open + Repetend + OL_close;
    }
    else {
        // Construct final number (for non-repeating results) and add digit grouping
        Result = LongDivide.GroupDigits(Result + Decimal_Digits, Thousands_Char, Thousandths_Char, Decimal_Point_Char, Orphans, sep4digit);
    }

    // Remove decimal point if there are no digits after it
    if (Result[Result.length - 1] == Decimal_Point_Char) { Result = Result.replace(Decimal_Point_Char, ''); }

    // Add currency symbol (will be a blank string if no currency symbol was set in the options)
    Result = Currency_Char.concat(Result);

    // Add exponential notation
    Result = Result.concat(Exp_open).concat(Exp_sign).concat(Exp_power).concat(Exp_close);

    // Attach SI prefix (it's a blank string if N/A)
    Result = Result.concat(SI_Prefix);
    
    // Attach sign (set to negative sign earlier if answer is supposed to be negative, or plus sign if forced sign on positive numbers is desired)
    if (Sign == '()') { Result = '('.concat(Result).concat(')'); }
    else              { Result = Sign.concat(Result); }

    // Attach approximation sign (will be a blank string if no approximation flags were tripped)
    Result = Approx.concat(Result);

    Decimal.set({ precision:LongDivide.Decimaljs_precision_old });
    return Result;

}




LongDivide.parseFormatString = function(options) {
    // If options are entered to LongDivide via a format string, this function parses that string to determine the individual options that the string indicates.

    if (typeof(options) === 'string') { var string = options; options = {}; }
    else { var string = options['format']; }

    string = string.toLowerCase();

    // Check for invalid characters
    var check = string.match(/[^-+!0.,siexd\[\]\(\) ]/g) || [];
    if (check.length > 0) {
        LongDivide.PrintWarning('LongDivide.parseFormatString', 'Format string contains invalid character(s): ', check);
        return options;
    }

    if (string.indexOf('.' == -1)) {
    // If string does not have a decimal point, add one at the end to allow parsing of leading zeroes
        string = string.concat('.');
    }

    // Determine the minimum number of integer digits from the number of zeros in front of the decimal point
    options['leading'] = (string.slice(0, string.indexOf('.')).match(/0/g) || []).length;

    if (string.indexOf(',') != -1) { options['thousands'] = ','; }
    if (string.indexOf('!') != -1) { options['approx'] = ''; }
    if (string.indexOf('-') != -1) { options['minus'] = '\u2212'; }
    if (string.indexOf('+') != -1) { options['plus'] = '+'; }
    if (string.indexOf('si') != -1) { options['si'] = true; }
    if (string.indexOf('ex') != -1) { options['exp'] = 'ex'; }
    else if (string.indexOf('ed') != -1) { options['exp'] = 'ed'; }
    else if (string.indexOf('e') != -1) { options['exp'] =  'e'; }

    options['p_max'] = (string.slice(string.indexOf('.')).match(/0/g) || []).length;
    options['p_min'] = options['p_max'];

    if (string.indexOf('[') != -1 || string.indexOf(']') != -1) {
        if (string.indexOf('[') == -1) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Closing bracket used without an open bracket', '\nFormat string:', string); return options; }
        if (string.indexOf(']') == -1) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Open bracket used without a closing bracket', '\nFormat string:', string); return options; }
        if (string.indexOf('[') < string.indexOf('.')) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Bracket appears in front of decimal point.', '\nFormat string:', string); return options; }
        if (string.indexOf('[') > string.indexOf(']')) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Open bracket (\'[\') appears after closing bracket (\']\')', '\nFormat string:', string); return options; }
        if ((string.match(/\[/g) || []).length > 1) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Multiple open brackets detected', '\nFormat string:', string); return options; }
        if ((string.match(/\]/g) || []).length > 1) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Multiple closing brackets detected', '\nFormat string:', string); return options; }
        if (string.lastIndexOf('0') > string.indexOf(']')) { LongDivide.PrintWarning('LongDivide.parseFormatString', 'Invalid syntax in format string: Zeros detected after closing bracket', '\nFormat string:', string); return options; }

        options['p_min'] = options['p_max'] - (string.slice(string.indexOf('[') + 1, string.indexOf(']')).match(/0/g) || []).length;
    }

    if (string.indexOf('(') != -1 && string.indexOf(')') != -1 && string.indexOf('(') < string.indexOf(')')) {
        options['minus'] = '()';
    }

    //console.log(options);
    return options;
}


LongDivide.GroupDigits = function(number, thousands, thousandths, decimal, orphans, sep4digit) {
    // Modified from https://stackoverflow.com/a/2901298
    //console.log('GroupDigits():\nnumber:', number, '\nthousands:', thousands, '\nthousandths', thousandths, '\ndecimal', decimal);
    var parts = number.toString().split('.');

    // Add thousands separators if the number is more than 3 digits (or more than 4 digits if digit grouping for 4 digits is disallowed)

    if ((parts[0].length > 3 && sep4digit === true) || parts[0].length > 4) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    }

    // Add thousandths separators
    if (parts.length > 1) {
        parts[1] = parts[1].split('').reverse().join('').replace(/\B(?=(\d{3})+(?!\d))/g, thousandths.split('').reverse().join('')).split('').reverse().join('');
    }
    //console.log('LongDivide.GroupDigits(): ' + parts.join(decimal));

    // Remove the last thousandths separator if there is an orphan digit and orphans have been disallowed in options
    if (parts[1] != '' && parts[1] !== undefined && thousandths != '') {
        if (number.split('.')[1].length % 3 == 1 && parts[1].indexOf(thousandths) != -1 && orphans == false) {
            parts[1] = parts[1].slice(0, parts[1].lastIndexOf(thousandths)).concat(parts[1].slice(parts[1].lastIndexOf(thousandths) + thousandths.length));
        }
    }
    return parts.join(decimal);
}

LongDivide.PrintError = function(text) {
    //console.log('Printing Error')
    if (LongDivide.errors === true) {
        var args = ["Error in function " + arguments[0] + "():"];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        console.error.apply(this, args);
    }
    
    if (arguments[0] === 'LongDivide') {
        Decimal.set({ precision:LongDivide.Decimaljs_precision_old });
    }
    return;
}

LongDivide.PrintWarning = function(text) {
    //console.log('Printing Warning')
    if (LongDivide.warnings === true) {
        var args = ["Warning in function " +  arguments[0] + "():"];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        console.warn.apply(this, args);
    }
    return;
}