function SI(value, unit, options_input) {
    DEBUG('Input:', value, unit, options_input);
    if (isNaN(parseInt(value))) { return value; }
    if (typeof(options_input) === 'number' || typeof(options_input) === 'string') { options_input = {p: options_input.toString()}; }
    Default_Options = [
        ['mode',       'f'],
        ['p',          '2'],
        //['exclude',    ['c', 'd', 'D', 'H']],
        ['round',      'n'],
        ['exclude',    []],
        ['include',    []],

        ['grouper',    ','],
        ['decimal',    '.'],
        ['threshold',  0],
        ['separator',  '&nbsp;'],

        ['style',      'abbr'],
        ['output',     'single'],
        ['big_kilo',   false],
        ['no_mu',      false],
    ]
    for (var i = 0; i < Default_Options.length; i++) {
        if (!(Default_Options[i][0] in options_input)) {
            //DEBUG('SI option "' + Default_Options[i][0] + '" defaulted to:',  Default_Options[i][1])
            options_input[Default_Options[i][0]] = Default_Options[i][1];
        }
    }

    /* Valid options:
    SI_options = {
        mode: 'f'           Precision mode (default Fixed mode). Options are:
                                'fixed' or 'f'      Uses a fixed number of decimal places, specified by precision field
                                'sig' or 's'        Targets a fixed number of significant figures.
                                'adaptive' or 'a'   Uses up to the specified number of decimal points, but leaves no trailing zeroes when not needed.
        p: 2                Specifies default precision (number of decimal places).
                            For adaptive mode, it may be specified in the format "[2, 5]" to indicate minimum and maximum precision. A single number will be interpreted as a maximum.
                            Also accepts individual decimal place settings for each prefix, in array format; for example:
                                {p: [1, G2, M0]} sets a default of 1 for all prefixes, then specifies 2 decimal places for Giga and 0 for Mega.
                            That can alternatively be written using powers instead of prefix symbols:
                                {p: [1, [9, 2], [6, 0]]}
        round:              Options:
                                n       Rounds to nearest (default)
                                +       Rounds toward positive infinity (ceil)      (1.9 -> 2;  -1.9 ->  1)
                                -       Rounds toward negative infinity (floor)     (1.9 -> 1;  -1.9 -> -2)
                                0       Rounds toward zero (truncate)               (1.9 -> 1;  -1.9 ->  1)
                                !0      Rounds away from zero                       (1.9 -> 2;  -1.9 -> -2)
                            Also accepted:
                                up      Same as +
                                ceil    Same as +
                                +inf    Same as +

                                down    Same as -
                                floor   Same as -
                                -inf    Same as -

                                zero    Same as 0
                                !zero   Same as !0


        grouper: ','        Character to use for digit grouping (default comma); space is interpreted as Non-Breaking Thin Space (U+2009)
        radix: '.'          Character to use as decimal point (default period); error if same as grouper
        unit_sep: '&nbsp;'  Character to place between the value and unit symbol (default Non-Breaking Space (U+00A0))
        big_kilo: 'false'   Use capital K for kilo instead of small k. (default false)
        no_mu: 'false'      Use "u" instead of "µ" on output, if necessary for compatibility reasons (default false)
        threshold: 0        Point at which to use the next prefix (represeted by power). For example, if Threshold is set to 2, then
                             number must be at 100,000,000 to use the Mega prefix (>= 10^2 times the prefix value). 0 for normal behavior.

        exclude: ['c', 'd'] SI prefixes to exclude, for situational use (i.e. for displaying time, one may not wish for "centiseconds").
                            Symbols can also be used as shortcuts, as in the following examples:
                                '>=G' excludes Giga and larger
                                '>G' excludes larger than Giga, but not Giga itself
                                '<G' and "<=G" same as above, but for prefixes smaller than Giga
                            Multiple arguments accepted in array format
                            "u" is accepted as an argument for excluding "µ", and "0" is accepted for excluding the prefixless base unit
                            By default, the following are excluded already, and must be un-excluded (using !c, !d, etc.) to be used:
                                'c' (centi, 10^-2)
                                'd' (deci, 10^-1)
                                'D' (deca, 10^1)
                                'H' (hecto, 10^2)
        include: ['k', 'm'] SI prefixes to include. Used to make exceptions to blanket exclusions (such as "exclude: ['>G']"<.
                            If include is used alone (exclude is left blank/default) then it will be interpreted as "exclude all except [inclusions]".
    }
    */


    //console.log(SI_options['precision']);

    var prefixDef = {
        '-24': {sym:'y', name:'yocto', p: 0, incl: false},
        '-21': {sym:'z', name:'zepto', p: 0, incl: false},
        '-18': {sym:'a', name:'atto',  p: 0, incl: false},
        '-15': {sym:'f', name:'femto', p: 0, incl: false},
        '-12': {sym:'p', name:'pico',  p: 0, incl: false},
        '-9':  {sym:'n', name:'nano',  p: 0, incl: false},
        '-6':  {sym:'µ', name:'micro', p: 0, incl: false},
        '-3':  {sym:'m', name:'milli', p: 0, incl: false},
        '-2':  {sym:'c', name:'centi', p: 0, incl: false},
        '-1':  {sym:'d', name:'deci',  p: 0, incl: false},
        '0':   {sym:'',  name:'',      p: 0, incl: false},
        '1':   {sym:'D', name:'deca',  p: 0, incl: false},
        '2':   {sym:'H', name:'hecto', p: 0, incl: false},
        '3':   {sym:'k', name:'kilo',  p: 0, incl: false},
        '6':   {sym:'M', name:'mega',  p: 0, incl: false},
        '9':   {sym:'G', name:'giga',  p: 0, incl: false},
        '12':  {sym:'T', name:'tera',  p: 0, incl: false},
        '15':  {sym:'P', name:'peta',  p: 0, incl: false},
        '18':  {sym:'E', name:'exa',   p: 0, incl: false},
        '21':  {sym:'Z', name:'zetta', p: 0, incl: false},
        '24':  {sym:'Y', name:'yotta', p: 0, incl: false},
        '_min': -24,
        '_max': 24,
    };

    var pre2num = {
        'y': -24,
        'z': -21,
        'a': -18,
        'f': -15,
        'p': -12,
        'n': -9,
        'µ': -6,
        'u': -6,
        'm': -3,
        'c': -2,
        'd': -1,
        'b': 0,
        'B': 0,
        '0': 0,
        'D': 1,
        'H': 2,
        'k': 3,
        'K': 3,
        'M': 6,
        'G': 9,
        'T': 12,
        'P': 15,
        'E': 18,
        'Z': 21,
        'Y': 24,
        '_min': -24,
        '_max': 24,
    }
    /*
    SI_defaults = {
        mode:       'f',
        p:          2,
        //exclude:    ['c', 'd', 'D', 'H'],
        exclude:    [],
        include:    [],

        grouper:    ',',
        decimal:    '.',
        threshold:  0,
        separator:  '&nbsp;',

        style:      'abbr',
        output:     'single',
        big_kilo:   false,
        no_mu:      false,
    }*/
    // Apply the default precision setting above
    /*for (var i = prefixDef['_min']; i <= prefixDef['_max']; i++) {
        if (i.toString() in prefixDef) {
            //prefixDef[i.toString()]['p'] = SI_defaults['p'];
            prefixDef[i.toString()]['p'] = 2;
        }
    }*/

    var out_value;
    var out_prefix;
    var precision;
    var SI_options = options_input;
    prefixDef = SI_include_exclude(SI_options, prefixDef, pre2num);
    prefixDef = SI_set_precision(SI_options, prefixDef, pre2num);

    //[prefixDef, SI_options] = SI_set_options(options_input, prefixDef, pre2num);
    DEBUG('prefixDef:', prefixDef)
    //SI_options['p'] = options_input['p'];


    if (Math.abs(value) < 0.000000000001) {
        magnitude = 0;
        DEBUG('Value was zero:', value);
        precision = prefixDef[0]['p'];
        out_value = Commas(value.toFixed(precision));
        out_prefix = '';
    }
    else {
        var magnitude = Math.floor(Math.log(Math.abs(value))/Math.log(10));
        var initial_magnitude = magnitude;
        DEBUG('Initial Magnitude:', initial_magnitude);
        while (magnitude >= prefixDef['_min'] && magnitude <= prefixDef['_max']) {
            // Change any inbetween magnitudes to one that has a prefix assigned to it
            if (!(magnitude in prefixDef)) {
                //DEBUG('Magnitude ' + magnitude + ' not in prefixDef')
                magnitude--;
                continue;
            }
            if (prefixDef[magnitude]['incl'] == false) {
                //DEBUG('Magnitude ' + magnitude + ' excluded')
                magnitude--;
                continue;
            }
            else {
                //DEBUG('Magnitude ' + magnitude + ' incl:', prefixDef[magnitude]['incl']);
                // Get the precision specified for that magnitude
                precision = prefixDef[magnitude]['p'];
                // Divide the number by the appropriate power of 10, and return the new number and associated SI prefix
                out_value = Commas(Number(value / Math.pow(10, magnitude)).toFixed(precision));
                out_prefix = prefixDef[magnitude]['sym'];
                break;
            }
        }
        if (magnitude < prefixDef['_min']) {
            DEBUG('Reached lower boundary; reversing search')
            magnitude = initial_magnitude;
            while (magnitude <= prefixDef['_max']) {
                // Change any inbetween magnitudes to one that has a prefix assigned to it
                if (!(magnitude in prefixDef)) {
                    //DEBUG('Magnitude ' + magnitude + ' not in prefixDef')
                    magnitude++;
                    continue;
                }
                if (prefixDef[magnitude]['incl'] == false) {
                    //DEBUG('Magnitude ' + magnitude + ' excluded')
                    magnitude++;
                    continue;
                }
                else {
                    //DEBUG('Magnitude ' + magnitude + ' incl:', prefixDef[magnitude]['incl']);
                    // Get the precision specified for that magnitude
                    precision = prefixDef[magnitude]['p'];
                    // Divide the number by the appropriate power of 10, and return the new number and associated SI prefix
                    out_value = Commas(Number(value / Math.pow(10, magnitude)).toFixed(precision));
                    out_prefix = prefixDef[magnitude]['sym'];
                    break;
                }
            }
        }
        if (magnitude > prefixDef['_max']) {
            DEBUG('Reached upper boundary; returning in base units');
            precision = prefixDef[0]['p'];
            out_value = Commas(value.toFixed(precision));
            out_prefix = '';
        }
    }
    if (SI_options['output'] == 'single') {
        var final_output = (out_value + '&nbsp;' + out_prefix + unit);
        DEBUG('Single Output');
        return final_output
    }
    else if (SI_options['output'] == 'split') {
        var final_output = {
            'full':         out_value + '&nbsp;' + out_prefix + unit,
            'f':            out_value + '&nbsp;' + out_prefix + unit,
            'value':        out_value,
            'val':          out_value,
            'v':            out_value,
            'unit':         out_prefix + unit,
            'u':            out_prefix + unit,
            'old_value':    value,
            'old_val':      value,
            'old_v':        value,
            'o':            value,
            'base_unit':    unit,
            'base_u':       unit,
            'b':            unit,
            'prefix':       out_prefix,
            'p':            out_prefix,
        }
        DEBUG('Split Output', final_output);
        return final_output
    }
   
}


function SI_include_exclude(SI_options, prefixDef, pre2num) {
    // Check if any exclusions are specified
    DEBUG('Beginning SI IN/EX Phase 1')
    var EX_empty = true;
    var EX_has_blanket = false;
    var IN_empty = true;
    var IN_has_blanket = false;

    for (var pass = 0; pass <= 1; pass++) {
        if      (pass == 0) { var mode = 'exclude'; }
        else if (pass == 1) { var mode = 'include'; }

        if (mode in SI_options) {
            DEBUG(mode + ' argument detected:', SI_options[mode])
            var EX = SI_options[mode];
            if (EX.length > 0) {
                if (pass == 0) { EX_empty = false; }
                else if (pass == 1) { IN_empty = false; }
                // Check if any of the exclusions are blanket statements
                for (var i = 0; i < EX.length; i++) {
                    if (EX[i].indexOf('<') != -1 || EX[i].indexOf('>') != -1 ) {
                        if (pass == 0) { EX_has_blanket = true; }
                        else if (pass == 1) { IN_has_blanket = true; }
                    }
                }
            }
        }
        else {
            //DEBUG('SI_options["' + mode + '"] defaulted to blank')
            SI_options[mode] = [];
        }

        /*
        if ('include' in SI_options) {
            var IN = SI_options['include'];
            if (IN.length > 0) {
                IN_empty = false;
                // Check if any of the exclusions are blanket statements
                for (var i = 0; i < IN.length; i++) {
                    if (IN[i].indexOf('<') != -1 || IN[i].indexOf('>') != -1 ) {
                        IN_has_blanket = true;
                    }
                }
            }
        } */

    DEBUG('Current Status:', 'Mode:', mode, 'EX/IN:', SI_options[mode], 'EX_empty:', EX_empty, 'IN_empty:', IN_empty)
    }

    var DEFAULT = true; // Default inclusion status
    if (EX_empty && !IN_empty) {
        // If Include list has members, but Exclude list is empty
        DEFAULT = false;
        DEBUG('Default Established (EX_empty && !IN_empty):', DEFAULT);
    }
    else if (IN_empty && !EX_empty) {
        // If Exclude list has members, but Include list is empty
        DEFAULT = true;
        DEBUG('Default Established (IN_empty && !EX_empty):', DEFAULT);
    }
    else if (!EX_empty && !IN_empty) {
        // If both lists are not blank

        if (IN_has_blanket && !EX_has_blanket) {
            // If Include list has blanket statements and Exclude list does not
            DEFAULT = false; // Exclude by default
            DEBUG('Default Established (IN_blnk && !EX_blnk):', DEFAULT);
        }
        else if (EX_has_blanket && !IN_has_blanket) {
            // If Exclude list has blanket statements and Include list does not
            DEFAULT = true; // Include by default
            DEBUG('Default Established (EX_blnk && !IN_blnk):', DEFAULT);
        }
        else {
            DEBUG('Default Established ((!)IN_blnk && (!)EX_blnk):', DEFAULT);
            // If both or neither have blanket statements
            DEFAULT = true; // Include by default
        }
    }
    else {
        // If both lists are blank
        DEBUG('Default Established (IN_empty && EX_empty):', DEFAULT, SI_options[mode], EX_empty);
        DEFAULT = true;
    }

    // Parse Exclude input list
    var ex_in_table = [{}, {}];
    DEBUG('Beginning SI IN/EX Phase 2')
    for (var pass = 0; pass <= 1; pass++) {
        if      (pass == 0) { var mode = 'exclude'; }
        else if (pass == 1) { var mode = 'include'; }

        if (mode in SI_options) {
            for (var i = 0; i < SI_options[mode].length; i++) {
                var arg = SI_options[mode][i]
                // Convert numbers to strings to standardize the format
                if (typeof(arg) === 'number') {
                    arg = arg.toString();
                }

                if (typeof(arg) === 'string') {
                    // Check for blanket statement
                    if (arg[0] == '<' || arg[0] == '>') {
                        DEBUG('Blanket statement detected for mode:', mode, arg)
                        var eq = false;
                        var start;
                        var end;
                        var step;
                        if (arg[1] == '=') { eq = true; }
                        if (arg[0] == '<') {
                            step = -1;
                            end = prefixDef['_min'];
                        }
                        else if (arg[0] == '>') {
                            step = 1;
                            end = prefixDef['_max'];
                        }
                        // To get starting point, take the string with the ">" or ">=" removed
                        start = arg.substring(1 + eq, arg.length);
                        // If it's a string (such as "K" or "G"), convert to the corresponding power number (and check for validity)
                        if (!isInt(start)) { if (start in pre2num) {start = pre2num[start]; } else { DEBUG(mode + ' argument not listed in SI prefix definitions', arg, start); } }
                        // Parse as integer to make sure it's not a string
                        start = parseInt(start) + (step * (1 - eq)); // If <, -1 // If <= or >=, +0 // If >, +1
                        if (Number.isNaN(start)) { DEBUG(mode + ' argument evaluates to NaN:', arg); }

                        // Make sure the start point is inside or equal to the boundaries, otherwise infinite loop.
                        if (start < prefixDef['_min'] || start > prefixDef['_max']) {
                            DEBUG(mode + ' blanket argument begins outside valid range')
                        }

                        // Loop through each power between the starting point and ending point, adding each one to the exclusion/inclusion list
                        for (var j = start; j != (end + step); j += step) {
                            ex_in_table[pass][j] = {'state': true, 'blanket': true};
                        }
                    }

                    // If not a blanket statement
                    else {
                        DEBUG('Non-blanket ' + mode + ' statement detected:', arg)
                        // If it's a string (such as "K" or "G"), convert to the corresponding power number (and check for validity)
                        if (!isInt(arg)) { if (arg in pre2num) {arg = pre2num[arg]; } else { DEBUG(mode + ' argument not listed in SI prefix definitions', arg); } }
                        ex_in_table[pass][arg] = {'state': true, 'blanket': false};
                    }
                }
            }
        }
    }

    // Now the exclusions and inclusion arguments have been expanded, time to combine them and deal with conflicts.
    DEBUG('Beginning SI IN/EX Phase 3')
    for (var P = prefixDef['_min']; P <= prefixDef['_max']; P++) {
        if (!(P in prefixDef)) { continue; }
        if (P in ex_in_table[0]) { var EX = ex_in_table[0][P]; }
        if (P in ex_in_table[1]) { var IN = ex_in_table[1][P]; }

        if (P in ex_in_table[0] && !(P in ex_in_table[1])) {
            // If Exclusion rule exists, and no Inclusion rule is specified, set exclusion rule
            prefixDef[P]['incl'] = !EX['state'];
        }
        else if (P in ex_in_table[1] && !(P in ex_in_table[0])) {
            // If Inclusion rule exists, and no Exclusion rule is specified, set exclusion rule
            prefixDef[P]['incl'] = IN['state'];
        }
        else if (!(P in ex_in_table[1]) && !(P in ex_in_table[0])) {
            // If no Exclusion or Inclusion rule is set for this power, then use the DEFAULT as determined previously
            prefixDef[P]['incl'] = DEFAULT;
        }
        else {
            // If both an Exclusion and an Inclusion rule are set for this power
            if (EX['state'] == IN['state']) {
                // Check if they are opposing rules (i.e. Exclude and Include are both true, or both false)
                if (IN['blanket'] && EX['blanket']) {
                    // If both rules are established by blanket statements, the DEFAULT (as determined previously) takes precedence.
                    // This implicitly means both are set to true, because blanket statements can only set things true
                    prefixDef[P]['incl'] = DEFAULT;
                }
                else if (IN['blanket']) {
                    // If the Inclusion rule is established by a blanket statement, but the Exclusion rule is stated explicitly, the Exclusion rule takes precedence
                    // This implicitly means both are set to true, because blanket statements can only set things true
                    prefixDef[P]['incl'] = !EX['state'];
                }
                    else if (EX['blanket']) {
                    // If the Exclusion rule is established by a blanket statement, but the Inclusion rule is stated explicityly, the Inclusion rule takes precedence
                    // This implicitly means both are set to true, because blanket statements can only set things true
                    prefixDef[P]['incl'] = IN['state'];
                }
                else {
                    // If neither of the rules are established by blanket statements
                    // Could be either both true or both false; DEFAULT takes precedence (as determined previously)
                    prefixDef[P]['incl'] = DEFAULT;
                }
            }
            else {
                // Rules are not conflicting; set to match Inclusion rule or !Exclusion rule (either works)
                prefixDef[P]['incl'] = IN['state'];
            }
        }
        if (P == -2 || P == -1 || P == 1 || P == 2) {
            // These powers (centi, deci, deca, and hecto) are excluded automatically
            prefixDef[P]['incl'] = false;
            if (P in ex_in_table[1]) {
                // Include them if and only if the user makes an explicity Inclusion rule for them
                if (ex_in_table[1][P]['state'] == true && ex_in_table[1][P]['blanket'] == false) {
                    prefixDef[P]['incl'] = true;
                }
            }
        }
        if (P == 0) {
            prefixDef[P]['incl'] = true;
            if (P in ex_in_table[0]) {
                if (ex_in_table[0][P]['state'] == true) {
                    prefixDef[P]['incl'] = false;
                }
            }
        }
    }
    DEBUG('Final Result:', prefixDef);

    return prefixDef;
}


function SI_set_options(options_input, prefixDef, pre2num) {
    //var opt = ['p', 'output', 'separator', 'decimal', 'unit_sep', 'big_kilo', 'no_mu'];
    // Loop through all options, if specified by options_input, replace the default
    /*for (var i = 0; i < opt.length; i++) {
        if (opt[i] in options_input) {
            SI_options[opt[i]] = options_input[opt[i]];
        }
    }*/
    //var explicit_incl = [];
    //var arg;
    //var offset;

    prefixDef = SI_include_exclude(options_input, prefixDef, pre2num);
    /*
        if (!('exclude' in options_input)) {
            DEBUG('options_input contained no exclusions');
        }
        if (typeof(options_input['exclude']) == 'string') {
            DEBUG('(SI_options == string) returns true');
        }

        else if (typeof(options_input['exclude']) == 'object') {
            DEBUG('(SI_options == object) returns true');

            // First pass, loops through [exclude] list provided in the input options, to check for any prefixes declared as Explicitly Included, with '!'
            for (var i = 0; i < options_input['exclude'].length; i++) {
                arg = options_input['exclude'][i];
                if (isNaN(parseInt(arg[0]))) {
                    // If arg[0] is !, add arg[1] to the list of explicitly included prefixes
                    if (arg[0] == '!' && pre2num[arg[1]] in prefixDef) {
                        explicit_incl.push(arg[1]);
                    }
                }
            }
            DEBUG('Explicit inclusions:', explicit_incl);
            // Second pass, loops through [exclude] list to look for '*', which excludes all prefixes except the ones on the explicit_incl list.
            for (var i = 0; i < options_input['exclude'].length; i++) {
                arg = options_input['exclude'][i];
                if (isNaN(parseInt(arg[0]))) {
                    if (arg[0] == '*') {
                        // If arg[0] is *, then exclude all prefixes except those explicitly included
                        for (var j = -24; j <= 24; j++ ) {
                            if (j in prefixDef) {
                                if (explicit_incl.indexOf(prefixDef[j]['sym']) == -1 && !(prefixDef[j]['sym'] in SI_options['exclude'])) {
                                    SI_options['exclude'].push(prefixDef[j]['sym']);
                                    DEBUG('Prefix "' + prefixDef[j]['sym'] + '" excluded');
                                    DEBUG(prefixDef[j]['sym'] + ' not in explicit_incl: ' + !(prefixDef[j]['sym'] in explicit_incl));
                                }
                            }
                        }
                        break;
                    }
                }
            }
            // Third pass, loops through [exclude] list again, to expand all shortcuts like ">=G" into "[G, T, P, E ... ]"
            for (var i = 0; i < options_input['exclude'].length; i++) {
                arg = options_input['exclude'][i];
                if (isNaN(parseInt(arg[0]))) {
                    if (arg[0] == '>') { 
                        if (arg[1] == '=') { offset = 0; DEBUG('Offset set to 0') } // If command is ">=", offset 0 to include starting position.
                        else               { offset = 1; } // Otherwise, command is ">", offset 1 to not include the specified prefix
                        for (var j = pre2num[arg[1 + (1-offset)]] + offset; j <= 24; j++) {
                            DEBUG('J:', j);
                            if (j in prefixDef) {
                                // Check to make sure it hasn't been explicitly included (present in explicit_incl list) or duplicate (present in SI[exclude])
                                if (explicit_incl.indexOf(prefixDef[j]['sym']) == -1 && !(prefixDef[j]['sym'] in SI_options['exclude'])) {
                                    // Exclude prefixes at/above the prefix specified by arg[1]
                                    SI_options['exclude'].push(prefixDef[j]['sym']);
                                }
                            }
                        }
                    }
                    else if (arg[0] == '<') {
                        if (arg[1] == '=') { offset = 0; } // If command is "<=", offset 0
                        else               { offset = 1; } // Otherwise, command is "<", offset 1 to include the specified prefix
                        for (var j = pre2num[arg[1 + (1-offset)]] - offset; j >= -24; j--) {
                            if (j in prefixDef) {
                                // Check to make sure it hasn't been explicitly included (present in explicit_incl list) or duplicate (present in SI[exclude])
                                if (explicit_incl.indexOf(prefixDef[j]['sym']) == -1 && !(prefixDef[j]['sym'] in SI_options['exclude'])) {
                                    // Exclude prefixes at/below the prefix specified by arg[1]
                                    SI_options['exclude'].push(prefixDef[j]['sym']);
                                }
                            }
                        }
                    }
                    else {
                        j = pre2num[arg[0]];
                        if (j in prefixDef) {
                            if (explicit_incl.indexOf(prefixDef[j]['sym']) == -1 && !(prefixDef[j]['sym'] in SI_options['exclude'])) {
                                SI_options['exclude'].push(prefixDef[j]['sym']);
                            }
                        }
                    }
                }
            }

        }
    */
    return [prefixDef, options_input];
}


function SI_set_precision(SI_options, prefixDef, pre2num) {
    /*
    for (var i = 0; i < SI_options['exclude'].length; i++) {
        //prefixDef[pre2num[SI_options['exclude'][i]]]['excl'] = true;
        // Delete prefixes that have been excluded
        delete prefixDef[pre2num[SI_options['exclude'][i]]];
    }*/
    DEBUG('Beginning Set-Precision')
    var precision = SI_options['p'];
    DEBUG('typeof(precision):', typeof(precision));

    // If the precision argument is a string, then there is only 1 precision specified
    if (typeof(precision) == 'number') {
        precision = precision.toString();
    }
    if (typeof(precision) == 'string') {
        DEBUG('Precision is a string:', precision);
        // If it's a 1-character string, then it's a pure number, which means it is set as the default for all prefixes
        if (precision.length == 1) {
            for (var i = prefixDef['_min']; i <= prefixDef['_max']; i++) {
                if (i.toString() in prefixDef) {
                    //DEBUG('prefixDef["' + i.toString() + '"] set to:', precision)
                    prefixDef[i.toString()]['p'] = precision;
                }
            }
        }
        // If it's a 2-character string, it could be a 2 digit number or a prefix-specific code
        else if (precision.length == 2) {
            if (isNaN(parseInt(precision[0]))) {
                prefixDef[pre2num[precision[0]]]['p'] = parseInt(precision[1]);
            }
        }
    }
    else if (typeof(precision) == 'object') {
        DEBUG('Precision is an object:', precision);
        for (var j = 0; j < precision.length; j++) {
            precision[j] = precision[j].toString();
            if ((precision[j]).length == 1) {
                DEBUG('Default precision rule detected:', precision[j])
                for (var i = prefixDef['_min']; i <= prefixDef['_max']; i++) {
                    if (i.toString() in prefixDef) {
                        prefixDef[i.toString()]['p'] = parseInt(precision[j]);
                    }
                }
            }
            // If it's a 2-character string, it could be a 2 digit number or a prefix-specific code
            else if (precision[j].length == 2) {
                DEBUG('Specific precision rule detected:', precision[j])
                if (!isNum(precision[j][0]) && (pre2num[precision[j][0]] in prefixDef)) {
                    prefixDef[pre2num[precision[j][0]]]['p'] = parseInt(precision[j][1]);
                }
            }
        }
    }
    DEBUG('prefixDef:', prefixDef);
    return prefixDef
}