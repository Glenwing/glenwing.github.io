/*

LongDivide.js
Created by Glenwing (https://github.com/Glenwing)

Version: 1.3.0
October 17, 2019

*/

// Default options
LongDivide.version = '1.3.0';

LongDivide.p_max = 8;
LongDivide.p_min = 0;
LongDivide.leading = 1;
LongDivide.decimal = '.';
LongDivide.thousands = '';
LongDivide.thousandths = '';
LongDivide.orphans = false;
LongDivide.minus = '\u2212';
LongDivide.plus = '';
LongDivide.approx = '\u2248';
LongDivide.currency = '';
LongDivide.exp = '';
LongDivide.exp_open = 'e';
LongDivide.exp_close = '';
LongDivide.exp_minus = LongDivide.minus;
LongDivide.exp_plus = LongDivide.plus;
LongDivide.OL_open = '<span style="text-decoration:overline;">';
LongDivide.OL_close = '</span>';
LongDivide.si = false;
LongDivide.twosingles = true;
LongDivide.repeat = true;

LongDivide.errors = true;
LongDivide.warnings = true;
LongDivide.erroroutput = 'Error';

function LongDivide (A, B, options) {
    //console.log('BEGIN:', A, '÷', B)
    try { Decimal.set({'precision': 1000 }) } catch (ReferenceError) { LongDivide.PrintError('Decimal.js library not detected. LongDivide.js requires Decimal.js in order to operate. (https://github.com/MikeMcl/decimal.js)'); return LongDivide.erroroutput; }
    if (A === '' || B === '') { return ''; }

    if (typeof(A) === 'string' || typeof(A) === 'number') {
        try {
            A = new Decimal(A);
            if (A.isNaN() || !A.isFinite()) { LongDivide.PrintError('First argument is NaN or Infinity.\nArgument:', A); return LongDivide.erroroutput; }
        }
        catch (DecimalError) { LongDivide.PrintError('First argument could not be interpreted as a number.\nArgument:', A); return LongDivide.erroroutput; }
    }
    else if (typeof(A) === 'object') { if (A.constructor !== Decimal) { LongDivide.PrintError('First argument is an unrecognized object. Argument must be a string, number, or Decimal object.\nArgument:', A) } }
    else { LongDivide.PrintError('First argument is of an unrecognized type.\ntypeof(A):', typeof(A)); }

    if (typeof(B) === 'string' || typeof(B) === 'number') {
        try {
            B = new Decimal(B);
            if (B.isNaN() || !B.isFinite()) { LongDivide.PrintError('Second argument is NaN or Infinity.\nArgument:', B); }
        }
        catch (DecimalError) { LongDivide.PrintError('Second argument could not be interpreted as a number.\nArgument:', B); return LongDivide.erroroutput; }
    }
    else if (typeof(B) === 'object') { if (B.constructor !== Decimal) { LongDivide.PrintError('Second argument is an unrecognized object. Argument must be a string, number, or Decimal object.\nArgument:', B) } }
    else { LongDivide.PrintError('Second argument is of an unrecognized type.\ntypeof(B):', typeof(B)); }

    if (B.isZero()) { LongDivide.PrintError('Division by zero'); return LongDivide.erroroutput; }
    if (!A.div(B).isFinite()) { LongDivide.PrintError('Division result is Infinity,\nA:', A.toFixed(A.dp()), '\nB:', B.toFixed(B.dp())); return LongDivide.erroroutput; }

    //if ( Number.isNaN(parseFloat(A)) || Number.isNaN(parseFloat(B)) || !Number.isFinite(parseFloat(A)) || !Number.isFinite(parseFloat(B)) || !Number.isFinite(parseFloat(A)/parseFloat(B)) || Number.isNaN(parseFloat(A)/parseFloat(B)) ) { LongDivide.PrintError('One or both inputs is NaN or Infinity, or there is a division by zero. Function aborted.'); return LongDivide.erroroutput; }

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
    var OL_open =            options['OL_open'] !== undefined ? options['OL_open'] :
        LongDivide.OL_open; // Default value

    // Overline markup closing tag. Used in conjunction with OL_open to surround the repeating numbers. May be set to control markup, separate it with parentheses, or simply left blank, etc.
    var OL_close =           options['OL_close'] !== undefined ? options['OL_close'] :
        LongDivide.OL_close;
    
    // Maximum number of decimal places; option 'p' (for setting both min and max precision together) takes priority if set
    var P_Max =              options['p'] !== undefined ? options['p'] : options['p_max'] !== undefined ? options['p_max'] : options['pmax'] !== undefined ? options['pmax'] :
        LongDivide.p_max;

    // Minimum number of decimal places; option 'p' (for setting both min and max precision together) takes priority if set
    var P_Min =              options['p'] !== undefined ? options['p'] : options['p_min'] !== undefined ? options['p_min'] : options['pmin'] !== undefined ? options['pmin'] :
        LongDivide.p_min;

    // Minimum number of digits in the integer part of the number. Leading zeros are added if necessary.
    var Leading_Digits =     options['leading'] !== undefined ? options['leading'] :
        LongDivide.leading;

    // Character to use for the radix point (decimal point)
    var Decimal_Point_Char = options['decimal'] !== undefined ? options['decimal'] :
        LongDivide.decimal;

    // Characters used for grouping thousands (i.e. 10000 -> 10,000)
    var Thousands_Char =     options['thousands'] !== undefined ? options['thousands'] :
        LongDivide.thousands;

    // Character used for grouping thousandths (i.e. 1.0000000001 -> 1.000 000 000 1)
    var Thousandths_Char =   options['thousandths'] !== undefined ? options['thousandths'] :
        LongDivide.thousandths;

    // Flag to allow an "orphan" digit after a thousandths separator if there is only 1 digit left (if false, thousandth grouping will prefer a group of 4 digits at the end rather than an orphan digit)
    var Orphans =            options['orphan'] !== undefined ? options['orphan'] : options['orphans'] !== undefined ? options['orphans'] :
        LongDivide.orphans;

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

    // Flag indicating whether SI prefixes are desired or not
    var SI =                 options['si'] !== undefined ? options['si'] : options['SI'] !== undefined ? options['SI'] :
        LongDivide.si;

    // Flag indicating whether single-digit repeating patterns should be doubled; i.e. display as 1.(33) instead of 1.(3)
    var RepeatSinglesFlag =  options['2_singles'] !== undefined ? options['2_singles'] :
        LongDivide.twosingles;

    // Flag indicating whether repeating decimal detection should be enabled or not
    var RepeatEnableFlag =   options['repeat'] !== undefined ? options['repeat'] :
        LongDivide.repeat;

    // Exponential notation specifier; 'e', 'ex', 'ed', or 'custom'
    var Exponential =        options['exp'] !== undefined ? options['exp'] : options['e'] !== undefined ? options['e'] :
        LongDivide.exp;

    // String to be placed before the exponential power and sign; only valid when options['exp'] is set to 'custom'
    var Exp_open =           options['exp_open'] !== undefined ? options['exp_open'] :
        LongDivide.exp_open;

    // String to be placed after the exponential power; only valid when options['exp'] is set to 'custom'
    var Exp_close =          options['exp_close'] !== undefined ? options['exp_close'] :
        LongDivide.exp_close;

    // String to be placed before negative exponential powers; only valid when options['exp'] is set to 'custom'
    var Exp_minus =           options['exp_minus'] !== undefined ? options['exp_minus'] :
        LongDivide.exp_minus;

    // String to be placed before non-negative exponential powers; only valid when options['exp'] is set to 'custom'
    var Exp_plus =            options['exp_plus'] !== undefined ? options['exp_plus'] :
        LongDivide.exp_plus;

    // If OL open and closing tags are blanked, assume the user means to disable repeating decimal detection
    if (OL_open == '' && OL_close == '') { RepeatEnableFlag = false; options['repeat'] = false; }

    if (options['thousands'] !== undefined) { if (options['thousands'] === '.' && options['decimal'] === undefined) { Decimal_Point_Char = ','; } }
    if (Decimal_Point_Char === Thousands_Char) {
        if (options['decimal'] === undefined) {
            if      (Decimal_Point_Char === '.') { Decimal_Point_Char = ','; }
            else if (Decimal_Point_Char === ',') { Decimal_Point_Char = '.'; }
        }
        else { LongDivide.PrintError('Decimal point character and thousands grouping character cannot be the same.\ndecimal_point_char:' + Decimal_Point_Char + '\nthousands_char:' + Thousands_Char); return LongDivide.erroroutput; }
    }
    if (Decimal_Point_Char === Thousandths_Char) { LongDivide.PrintError('Decimal point character and thousandths grouping character cannot be the same.\ndecimal_point_char:' + Decimal_Point_Char + '\nthousandths_char:' + Thousandths_Char); return LongDivide.erroroutput; }
    if (Decimal_Point_Char.match(/[0-9]/g)) { LongDivide.PrintError('Decimal point character cannot be a number.\nDecimal_Point_Char:', Decimal_Point_Char); return LongDivide.erroroutput; }
    if (Thousands_Char.match(/[0-9]/g)) { LongDivide.PrintError('Thousands grouping character cannot be a number.\nThousands_Char:', Thousands_Char); return LongDivide.erroroutput; }
    if (Thousandths_Char.match(/[0-9]/g)) { LongDivide.PrintError('Thousandths grouping character cannot be a number.\nThousandths_Char:', Thousandths_Char); return LongDivide.erroroutput; }
    if (Minus_Char.match(/[0-9]/g)) { LongDivide.PrintError('Minus sign character cannot be a number.\nMinus_Char:', Minus_Char); return LongDivide.erroroutput; }
    if (Plus_Char.match(/[0-9]/g)) { LongDivide.PrintError('Plus sign character cannot be a number.\nPlus_Char:', Plus_Char); return LongDivide.erroroutput; }
    if (Approx_Char.match(/[0-9]/g)) { LongDivide.PrintError('Approximation sign character cannot be a number.\nApprox_Char:', Approx_Char); return LongDivide.erroroutput; }
    if (Currency_Char.match(/[0-9]/g)) { LongDivide.PrintError('Currency symbol cannot be a number.\nCurrency_Char:', Currency_Char); return LongDivide.erroroutput; }

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
    Base = Math.round(Base);
    // Validity checks for precision and base
    if (P_Max < 0 || P_Min < 0 || P_Max < P_Min || Number.isNaN(P_Max) || Number.isNaN(P_Min) || !Number.isFinite(P_Max) || !Number.isFinite(P_Min)) {
        LongDivide.PrintError('Invalid P_Max and P_Min values. Both values must be non-negative numbers, and P_Min cannot be greater than P_Max.\nP_Max:', P_Max, 'P_Min', P_Min)
        return LongDivide.erroroutput;
    }
    if (isNaN(Base)) {
        LongDivide.PrintError('Invalid Base value. Must be an integer number.\nBase:', Base);
        return LongDivide.erroroutput;
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
                LongDivide.PrintWarning('Runaway loop in the SI prefix section has hit the watchdog threshold (10 loop cycles) and was aborted. Check your code!\n', 'A:', A, 'B:', B, 'Power:', Power);
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
            '-6':  '&mu;',
            '-9':  'n',
            '-12': 'p',
            '-15': 'f',
            '-18': 'a',
            '-21': 'z',
            '-24': 'y',
        }
        SI_Prefix = (Power == 0 ? '' : '&nbsp;' + SI_Prefix_Table[Power]); // Ternary check avoids prefix being set to just "&nbsp;" when the power is 0 (no prefix required)
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
        return Result
    }

    // Handle floating point numbers by multiplying them by 10 until they are integers
    if (A.dp() != 0 || B.dp() != 0) {
        var Multiplier = Decimal.max(A.dp(), B.dp());
        A = A.times(Multiplier);
        B = B.times(Multiplier);
    }
    // End floating point section

    var Exp_power = new Decimal(0);
    var Exp_sign = '';
    if (Exp_flag == true) {
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

    //console.log('Quotient:', Quotient.toNumber(), 'Remainder:', Remainder.toNumber(), 'Dividend:', Dividend.toNumber(), 'Decimal_Digits:', Decimal_Digits, 'Previous Dividends:', Previous_Dividends);

    var i = 0;
    // Compute terms up to the specified precision (P_Max) + 2. Going 1 decimal beyond P_Max is required to facilitate rounding, but 2 beyond P_Max is...
    // ...required for correct detection of exact division results (such as 1/8 = 0.125 exactly). 2 extra decimal places are necessary so that...
    // ...the algorithm can identify the implicit repeating 0 pattern that follows the last digit, which characterizes an exact result.
    while (i < P_Max + 2) {
        // When you encounter a dividend that you have already seen, it indicates an infinitely repeating pattern
        if (!(Dividend.toNumber() in Previous_Dividends)) {
            // Stores the position (relative to the decimal point) of where each dividend was encountered. This is used for determining which digits are part of the prefix and which are part of the repetend
            Previous_Dividends[Dividend.toNumber()] = i;

            Quotient  = Dividend.dividedBy(Divisor).floor();
            Remainder = Dividend.modulo(Divisor);
            Dividend  = Remainder.times(Base);

            Decimal_Digits += Quotient.toFixed(Quotient.dp());

            //console.log('i:', i, 'Quotient:', Quotient.toNumber(), 'Remainder:', Remainder.toNumber(), 'Dividend:', Dividend.toNumber(), 'Result:', Result, 'Decimal_Digits:', Decimal_Digits);
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
                    if (watchdog > 1000) { LongDivide.PrintWarning('Runaway loop has hit the watchdog threshold in the RepeatEnableFlag section (1 thousand loop cycles) and was aborted. Check your code!\nDecimal_Digits.length:', Decimal_Digits.length, 'Repetend:', Repetend, 'P_Max:', P_Max); break; }
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
            Integer = (new Decimal(Integer)).plus(1).toFixed(0);
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
        Result = LongDivide.GroupDigits(Result.concat(Prefix).concat(Repetend), Thousands_Char, Thousandths_Char, Decimal_Point_Char, Orphans);

        // Adds overline tags; Some fancy footwork is needed here to skip over the thousandths separators
        Result = Result.slice(0, Result.indexOf(Decimal_Point_Char) + 1 + Prefix.length + (Thousandths_Char.length * Math.floor(Prefix.length / 3))) + OL_open + Result.slice(Result.indexOf(Decimal_Point_Char) + 1 + Prefix.length + (Thousandths_Char.length * Math.floor(Prefix.length / 3))) + OL_close;
        //Result += Prefix + OL_open + Repetend + OL_close;
    }
    else {
        // Construct final number (for non-repeating results) and add digit grouping
        Result = LongDivide.GroupDigits(Result + Decimal_Digits, Thousands_Char, Thousandths_Char, Decimal_Point_Char, Orphans);
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

    return Result;

}




LongDivide.parseFormatString = function(options) {
    if (typeof(options) === 'string') { var string = options; options = {}; }
    else { var string = options['format']; }

    string = string.toLowerCase();

    // Check for invalid characters
    check = string.match(/[^-+!0.,siexd\[\]\(\) ]/g) || [];
    if (check.length > 1) {
        console.log('Error in LongDivide.parseFormatString(): Input contains invalid character(s): ', check);
        return options;
    }

    if (string.indexOf('.' == -1)) {
    // If string does not have a decimal point, add one at the end
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
        if (string.indexOf('[') == -1) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Closing bracket used without an open bracket'); return options; }
        if (string.indexOf(']') == -1) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Open bracket used without a closing bracket'); return options; }
        if (string.indexOf('[') < string.indexOf('.')) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Bracket appears in front of decimal point.'); return options; }
        if (string.indexOf('[') > string.indexOf(']')) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Open bracket (\'[\') appears after closing bracket (\']\')'); return options; }
        if ((string.match(/\[/g) || []).length > 1) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Multiple open brackets detected'); return options; }
        if ((string.match(/\]/g) || []).length > 1) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Multiple closing brackets detected'); return options; }
        if (string.lastIndexOf('0') > string.indexOf(']')) { console.log('Error in LongDivide.parseFormatString(): Invalid syntax: Zeros detected after closing bracket'); return options; }

        options['p_min'] = options['p_max'] - (string.slice(string.indexOf('[') + 1, string.indexOf(']')).match(/0/g) || []).length;
    }

    if (string.indexOf('(') != -1 && string.indexOf(')') != -1 && string.indexOf('(') < string.indexOf(')')) {
        options['minus'] = '()';
    }

    //console.log(options);
    return options;
}


LongDivide.GroupDigits = function(number, thousands, thousandths, decimal, orphans) {
    // Modified from https://stackoverflow.com/a/2901298
    //console.log('GroupDigits():\nnumber:', number, '\nthousands:', thousands, '\nthousandths', thousandths, '\ndecimal', decimal);
    var parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
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
        var str = 'console.log("Error in function LongDivide():"'
        for (var i = 0; i < arguments.length; i++) {
            str += ', arguments[' + i + ']';
        }
        str += ');';
        eval(str);
        // This eval is performed on a string which can only possibly be a console statement of the form "console.log(argument[0], argument[1], ... , argument[i]);"
        // The actual arguments are not processed by eval, it only converts the literal text "argument[0]" into javascript, which is then executed by the console.log statement
        // Hence, there should be no vulnerability beyond what is possible with console.log.

        // In addition, the arguments themselves are only predefined strings elsewhere in the code anyway.
        // In no way is this eval statement ever exposed to user input.

        // Even if this LongDivide.PrintError function is called directly with arbitrary arguments given,
        // the arguments to the function will be evaluated exactly as if the user called "console.log" with the same arguments.
        // If a string of attempted malicious code is passed to PrintError, the contents of the string will just be printed to the console.
        // If a function or object is passed to PrintError, the definition of the function/object will simply be printed to the console.
        // Etc.
        // This eval statement does not evaluate the contents of arbitrary strings.
    }
    return;
}

LongDivide.PrintWarning = function(text) {
    if (LongDivide.warnings === true) {
        var str = 'console.log("Warning in function LongDivide():"'
        for (var i = 0; i < arguments.length; i++) {
            str += ', arguments[' + i + ']';
        }
        str += ');';
        eval(str);
        // This eval is performed on a string which can only possibly be a console statement of the form "console.log(argument[0], argument[1], ... , argument[i]);"
        // The actual arguments are not processed by eval, it only converts the literal text "argument[0]" into javascript, which is then executed by the console.log statement
        // Hence, there should be no vulnerability beyond what is possible with console.log.

        // In addition, the arguments themselves are only predefined strings elsewhere in the code anyway.
        // In no way is this eval statement ever exposed to user input.

        // Even if this LongDivide.PrintError function is called directly, the arguments to the function will be evaluated exactly as if the user called "console.log" with the same arguments.
        // If a string of attempted malicious code is passed to PrintError, the contents of the string will just be printed to the console.
        // If a function or object is passed to PrintError, the definition of the function/object will simply be printed to the console.
        // Etc.
        // This eval statement does not evaluate the contents of arbitrary strings.
    }
    return;
}