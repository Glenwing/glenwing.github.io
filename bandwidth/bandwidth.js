DebugConfig({
    //all:                true,
    generate_table:     0,
    SI:                 1,
    SI_set_options:     1,
    SI_set_precision:   0,
    timingUIChange:     1,
});


CTA861 = {};


// The intepreted current state of all input fields is stored here
Global_InputVars = {
    'HRES': '', // Int
    'VRES': '', // Int
    'FREQ': '', // Float
    'COLOR_DEPTH': '',
    'PIXEL_FORMAT': '',
    'COMP': '',
    'SCAN': '',
    'MARGINS': '',
    'TIMING_STD': '',
    'V_FP': '',
    'V_BP': '',
    'V_SW': '',
    'H_FP': '',
    'H_BP': '',
    'H_SW': '',
}



Encoding_Overhead = {
    '8b/10b': 1.25,
    '16b/18b': 1.125,
};

Interface = [
    {
        name:       "DisplayPort 1.3&ndash;1.4",
        encoding:   "8b/10b",
        datarate:   25.92 * (10 ** 9),
    },{
        name:       "DisplayPort 1.2",
        encoding:   "8b/10b",
        datarate:   17.28 * (10 ** 9),
    },{
        name:       "DisplayPort 1.0&ndash;1.1",
        encoding:   "8b/10b",
        datarate:   8.64 * (10 ** 9),
    },{
        name:       "HDMI 2.1",
        encoding:   "16b/18b",
        datarate:   48 * (10 ** 9) * (16/18),
    },{
        name:       "HDMI 2.0",
        encoding:   "8b/10b",
        datarate:   14.4 * (10 ** 9),
    },{
        name:       "HDMI 1.3&ndash;1.4",
        encoding:   "8b/10b",
        datarate:   8.16 * (10 ** 9),
    },{
        name:       "HDMI 1.0&ndash;1.2",
        encoding:   "8b/10b",
        datarate:   3.96 * (10 ** 9),
    },{
        name:       "Dual-Link DVI",
        encoding:   "8b/10b",
        datarate:   7.92 * (10 ** 9),
    },{
        name:       "Single-Link DVI",
        encoding:   "8b/10b",
        datarate:   3.96 * (10 ** 9),
    },{
        name:       "Thunderbolt 3 (Gen 2)",
        encoding:   "unknown",
        datarate:   40 * (10 ** 9),
    },{
        name:       "Thunderbolt 3 (Gen 1)",
        encoding:   "unknown",
        datarate:   34.56 * (10 ** 9),
    },{
        name:       "Thunderbolt 2",
        encoding:   "unknown",
        datarate:   17.28 * (10 ** 9),
    },{
        name:       "Thunderbolt",
        encoding:   "unknown",
        datarate:   8.64 * (10 ** 9),
    },
];



function submitVar(id, val) {
    DEBUG(id, val);
    var len = 0;
    var GlobalVars_Key = '';

    if (typeof(val) === 'number') { val = val.toString(); }

    if (id == 'INPUT_HRES' || id == 'INPUT_VRES') {
        if (id == 'INPUT_HRES') GlobalVars_Key = 'HRES';
        else if (id == 'INPUT_VRES') GlobalVars_Key = 'VRES';
        val = parseNum(val);
        if (isNum(val) == true) {
            val = Math.abs(parseInt(val));
            Global_InputVars[GlobalVars_Key] = val;
        }
        else {
            DEBUG(id + ' input is not a number:', val);
            Global_InputVars[GlobalVars_Key] = '';
        }
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
    }

    else if (id == 'INPUT_F') {
        GlobalVars_Key = 'FREQ';
        val = parseNum(val);
        if (isNum(val) == true) {
            Global_InputVars[GlobalVars_Key] = Math.abs(val);
        }
        else {
            DEBUG(id + ' input is not a number:', val);
            Global_InputVars[GlobalVars_Key] = '';
        }
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
    }

    else if (id == 'COLOR_DEPTH_FORM') {
        // Value is either the color depth number (in bits per pixel), or the string 'Custom'

        GlobalVars_Key = 'COLOR_DEPTH';
        colordepthUIChange();

        if (val != 'Custom') { Global_InputVars[GlobalVars_Key] = val; }
        else if (val == 'Custom') { // Custom color depth
            // If Custom, grab the number from the custom color depth input field
            val = parseInt(parseNum($('#CUSTOM_COLOR_DEPTH').val()));
            if (isNum(val) == true) {
                if ($('input[name=CD_UNIT_SLCT]:checked').val() == 'bpc') {
                    val = val * 3; // If user enters values in units of bpc, then multiply by 3 to convert to bit/px (bpp)
                }
                Global_InputVars[GlobalVars_Key] = Math.abs(val);
            }
            else {
                DEBUG(id + ' input is not a number:', val);
                Global_InputVars[GlobalVars_Key] = '';
            }

        }
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
    }

    else if (id == 'PIXEL_FORMAT_FORM') {
        GlobalVars_Key = 'PIXEL_FORMAT';
        if (val == 'RGB' || val == 'YCBCR 4:4:4') { val = 1.0; }
        else if (val == 'YCBCR 4:2:2') { val = 1.5; }
        else if (val == 'YCBCR 4:2:0') { val = 2.0; }
        Global_InputVars[GlobalVars_Key] = val;
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
    }

    else if (id == 'COMPRESSION_FORM') {
        GlobalVars_Key = 'COMP';
        if (val == 'Uncompressed') { val = 1.0; }
        else if (val == 'DSC 2.0x') { val = 2.0; }
        else if (val == 'DSC 2.5x') { val = 2.5; }
        else if (val == 'DSC 3.0x') { val = 3.0; }
        Global_InputVars[GlobalVars_Key] = val;
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
    }

    else if (id == 'SCAN_FORM') {
        GlobalVars_Key = 'SCAN';
        if (val == 'p') { val = 1; }
        else if (val == 'i') { val = 2; }
        Global_InputVars[GlobalVars_Key] = val;
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
        timingUIChange();
        DEBUG('Set interlaced timing row display to:', $('#Interlaced_Timing_Row').css('display'));
    }

    else if (id == 'MARGINS_FORM') {
        // val is either 'y' or 'n'
        GlobalVars_Key = 'MARGINS';
        marginsUIChange();

        if (val == 'n') {
            Global_InputVars[GlobalVars_Key] = 0;
        }
        else if (val == 'y') {
            val = parseFloat(parseNum($('#CUSTOM_MARGINS').val()));
            if (isNum(val) == true) {
                Global_InputVars[GlobalVars_Key] = Math.abs(val);
            }
            else {
                DEBUG(id + ' input is not a number:', val);
                Global_InputVars[GlobalVars_Key] = '';
            }
        }
        else { DEBUG('invalid input combination. id/val = ', id, val) } // If val is not 'y' or 'n', then something somewhere has gone terribly wrong
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);
    }

    else if (id == 'TIMING_DROP') {
        GlobalVars_Key = 'TIMING_STD';

        Global_InputVars[GlobalVars_Key] = val;
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);

        timingUIChange();
    }

    else if (id == 'V_FP' || id == 'V_BP' || id == 'V_SW' ||
        id == 'H_FP' || id == 'H_BP' || id == 'H_SW' ||
        id == 'V_FP_ODD' || id == 'V_SW_ODD' || id == 'V_BP_ODD') {
        GlobalVars_Key = id;
        val = parseFloat(parseNum(val));
        if (isNum(val)) {
            val = Math.abs(val);
            Global_InputVars[id] = val;
            $('#' + id).val(val);
            $('#V_BLANK').html(Global_InputVars['V_FP'] + Global_InputVars['V_BP'] + Global_InputVars['V_SW']);
            $('#H_BLANK').html(Global_InputVars['H_FP'] + Global_InputVars['H_BP'] + Global_InputVars['H_SW']);
            $('#V_BLANK_ODD').html(Global_InputVars['V_FP_ODD'] + Global_InputVars['V_BP_ODD'] + Global_InputVars['V_SW_ODD']);
        }
        else {
            DEBUG(id + ' input is not a number:', val);
            Global_InputVars[id] = '';
            $('#' + id).val('');
            $('#V_BLANK').html('');
            $('#H_BLANK').html('');
            $('#V_BLANK_ODD').html('');
        }
        DEBUG("Global_InputVars['" + GlobalVars_Key + "'] was set to", Global_InputVars[GlobalVars_Key]);

        // Update value displayed in the UI input field

        // Update total Vblank and Hblank numbers on the UI
    }
}


function generate_table(type, input_datarate) {
    if (type == "Interface Support") {
        table = $("#interface_support_table");
        contents = '';
        contents += ('<tr><th class="title" colspan="6">Interface Support</th></tr>');
        contents += ('<tr>');
        contents += ('<th rowspan="2">% Usage</th>');
        contents += ('<th rowspan="2">Interface</th>');
        contents += ('<th rowspan="2">Encoding</th>');
        contents += ('<th colspan="3" style="border-bottom:1px solid #FFFFFF;">Maximum</th></tr>');
        contents += ('<tr><th>Pixel Clock</th><th>Datarate</th><th>Bandwidth</th></tr>');

        var name;
        var encoding;
        var datarate;
        var pixel_clock;
        var bandwidth;
        var overhead;
        var saturation;

        for (var x = 0; x < Interface.length; x++) {
            name = Interface[x]['name'];
            encoding = Interface[x]['encoding'];
            if (encoding == 'unknown') {
                datarate = Interface[x]['datarate'];
                bandwidth = '?';
                encoding = '?';
            }
            else {
                overhead = Encoding_Overhead[encoding];
                datarate = Interface[x]['datarate'];
                bandwidth = datarate * overhead;
            }
            pixel_clock = datarate / 24;
            saturation = input_datarate / datarate;

            if (input_datarate == -1) {
                contents += ('<tr><td></td>');
            }
            else {
                contents += ('<tr><td>' + saturation.toFixed(1) + '%</td>');
            }

            contents += ('<td style="text-align:left; white-space:nowrap;">' + name + '</td><td>' + encoding + '</td><td>' + SI(pixel_clock, 'Hz', {p: ['M0', 'G3']}) + '</td><td>' + SI(datarate, 'bit/s', 2) + '</td><td>' + SI(bandwidth, 'bit/s', 2) + '</td></tr>');
        }

        table.html(contents);

        return;
    }

    else if (type == "Maximum Refresh Frequency") {
        return;
    }


    return;
}


function input_ok() {
    // This checks to make sure all the necessary fields are filled in, and their contents are valid, before allowing the Calculation function to proceed.
    var val;

    var checklist = ['HRES', 'VRES', 'FREQ'];
    for (var i = 0; i < checklist.length; i++) {
        val = Global_InputVars[checklist[i]];
        if (!(isPositive(val))) {
            DEBUG('Calculation aborted. ' + checklist[i] + ' contains an empty or non-numeric string.', val);
            return false;
        }
    }

    if ($('input[name=COLOR_DEPTH_SLCT]:checked').val() == 'Custom') {
        val = Global_InputVars['COLOR_DEPTH'];
        if (!(isPositive(val))) {
            DEBUG('Calculation aborted. COLOR_DEPTH_SLCT is set to Custom, but CUSTOM_COLOR_DEPTH contains an empty or non-numeric string, or 0.', val);
            return false;
        }
    }

    if (Global_InputVars['TIMING_STD'] == 'Custom') {
        checklist = ['V_FP', 'V_BP', 'V_SW', 'H_FP', 'H_BP', 'H_SW'];
        var abort = false;
        for (var i = 0; i < checklist.length; i++) {
            val = Global_InputVars[checklist[i]];
            if (!(isPositiveZ(val))) {
                abort = true;
            }
        }
        if (abort == true) {
            DEBUG('Calculation aborted. TIMING_DROP is set to Custom, but one or more timing parameter fields contains an empty or non-numeric string.', Global_InputVars);
            return false;
        }
    }

    if ($('input[name=MARGINS_SLCT]:checked').val() == 'y') {
        val = Global_InputVars['MARGINS'];
        if (!(isPositiveZ(val))) {
            DEBUG('Calculation aborted. MARGINS_SLCT is set to Yes, but CUSTOM_MARGINS contains an empty or non-numeric string.', val);
            return false;
        }
    }
    
    return true;
}


function calcMain() {
    if (!input_ok()) { clearResults(); return; }

    var hres = Global_InputVars['HRES'];
    var vres = Global_InputVars['VRES'];
    var freq = Global_InputVars['FREQ'];

    var color_depth = Global_InputVars['COLOR_DEPTH'];
    var px_format = Global_InputVars['PIXEL_FORMAT'];
    var comp = Global_InputVars['COMP'];
    var scan = Global_InputVars['SCAN'];
    var timing_standard = Global_InputVars['TIMING_STD'];

    // Get timing parameters
    Timing = getTiming(timing_standard);
    DEBUG('Timing:', Timing);
    
    var results = {
        hres:       hres,
        vres:       vres,
        freq:       freq,
        px_bits:    color_depth,
        px_format:  px_format,
        comp:       comp,
        scan:       scan,

        Timing:     Timing,

        // Calculate results
        // Resolution with blanking intervals
        h_eff: Timing['H_EFF'],
        v_eff: Timing['V_EFF'],

        // Aspect ratio
        ratio_num: hres / vres,
        ratio_str: (hres / GCD(hres, vres)) + ':' + (vres / GCD(hres, vres)),

        // Total pixel count of image
        px_per_frame: hres * vres,
        px_per_frame_eff: (Timing['H_EFF']) * (Timing['V_EFF']),

        // Size (bits) of one frame
        bits_per_frame: hres * vres * color_depth,
        bits_per_frame_eff: (Timing['H_EFF']) * (Timing['V_EFF']) * color_depth,

        // Pixel clock
        px_per_sec: hres * vres * Timing['F_ACTUAL'],
        px_per_sec_eff: (Timing['H_EFF']) * (Timing['V_EFF']) * Timing['F_ACTUAL'],

        // Raw bit rate
        bits_per_sec_eff: (Timing['H_EFF']) * (Timing['V_EFF']) * color_depth * Timing['F_ACTUAL'],
    };

    DEBUG('Results:', SI(results['bits_per_sec_eff'], 'bit/s', 2), results);
    updateDisplay(results);
}


function getTiming(timing_standard) {
    // Just a traffic control function
    // Actual parameters are calculated in dedicated functions for each standard

    if (!(isPositiveZ(Global_InputVars['HRES']) && isPositiveZ(Global_InputVars['VRES']) && isPositiveZ(Global_InputVars['FREQ']))) {
        DEBUG('Timing calculation aborted, HRES, VRES, or FREQ contains invalid input.', Global_InputVars['HRES'], Global_InputVars['VRES'], Global_InputVars['FREQ']);
        return {
            'V_FP': '',
            'V_BP': '',
            'V_SW': '',
            'H_FP': '',
            'H_BP': '',
            'H_SW': '',

            'V_BL': '',
            'H_BL': '',

            'F_ACTUAL': Global_InputVars['FREQ'],
        };
    }

    if (timing_standard != 'Custom') {
        if (timing_standard == 'CVT-R2') {
            Timing = CVT_R(2);
        }
        else if (timing_standard == 'CVT-RB') {
            Timing = CVT_R(1);
        }
        else if (timing_standard == 'CVT') {
            Timing = CVT();
        }
        else if (timing_standard == 'GTF') {
            Timing = GTF();
        }
        else if (timing_standard == 'DMT') {
            Timing = DMT();
        }
        else if (timing_standard == 'CTA-861') {
            Timing = CTA();
        }
        else if (timing_standard == 'None') {
            Timing = {
                'V_FP': 0,
                'V_BP': 0,
                'V_SW': 0,
                'H_FP': 0,
                'H_BP': 0,
                'H_SW': 0,

                'V_FP_ODD': 0,
                'V_BP_ODD': 0,
                'V_SW_ODD': 0,

                'V_BL': 0,
                'H_BL': 0,

                'F_ACTUAL': Global_InputVars['FREQ'],
            }
        }
        // Update UI timing parameter fields with the newly generated timings
        submitVar('V_FP', Timing['V_FP']);
        submitVar('V_BP', Timing['V_BP']);
        submitVar('V_SW', Timing['V_SW']);
        submitVar('H_FP', Timing['H_FP']);
        submitVar('H_BP', Timing['H_BP']);
        submitVar('H_SW', Timing['H_SW']);
        submitVar('V_FP_ODD', Timing['V_FP_ODD']);
        submitVar('V_SW_ODD', Timing['V_SW_ODD']);
        submitVar('V_BP_ODD', Timing['V_BP_ODD']);
    }

    else if (timing_standard == 'Custom') {
        // Read the timing from the UI
        submitVar('V_FP', $('#V_FP').val());
        submitVar('V_BP', $('#V_BP').val());
        submitVar('V_SW', $('#V_SW').val());
        submitVar('H_FP', $('#H_FP').val());
        submitVar('H_BP', $('#H_BP').val());
        submitVar('H_SW', $('#H_SW').val());
        submitVar('V_FP_ODD', Global_InputVars['V_FP'] + 0.5);
        submitVar('V_SW_ODD', Global_InputVars['V_SW']);
        submitVar('V_BP_ODD', Global_InputVars['V_BP'] + 0.5);

        Timing = {
            'V_FP': Global_InputVars['V_FP'],
            'V_BP': Global_InputVars['V_BP'],
            'V_SW': Global_InputVars['V_SW'],
            'H_FP': Global_InputVars['H_FP'],
            'H_BP': Global_InputVars['H_BP'],
            'H_SW': Global_InputVars['H_SW'],

            'V_FP_ODD': Global_InputVars['V_FP_ODD'],
            'V_BP_ODD': Global_InputVars['V_BP_ODD'],
            'V_SW_ODD': Global_InputVars['V_SW_ODD'],

            'V_BL': Global_InputVars['V_FP'] + Global_InputVars['V_BP'] + Global_InputVars['V_SW'],
            'H_BL': Global_InputVars['H_FP'] + Global_InputVars['H_BP'] + Global_InputVars['H_SW'],

            'F_ACTUAL': Global_InputVars['FREQ'],
        }
    }

    $('#V_BLANK').html(Timing['V_BL']);
    $('#H_BLANK').html(Timing['H_BL']);

    return Timing;
}


function CVT_R(R) { // Variable R is an integer representing the reduced blanking revision to use, version 1 or version 2.
    var H = Global_InputVars['HRES']; // Horizontal active pixels
    var V = Global_InputVars['VRES']; // Vertical active pixels
    var F = Global_InputVars['FREQ']; // Nominal vertical refresh frequency
    var S = Global_InputVars['SCAN']; // 1 for progressive scan, 2 for interlaced
    var M = Global_InputVars['MARGINS']; // Margins (%)

    // Declaring variables for all results
    var V_FP; // Vertical front porch
    var V_SW; // Vertical sync width
    var V_BP; // Vertical back porch

    var H_FP; // Horizontal front porch
    var H_SW; // Horizontal sync width
    var H_BP; // Horizontal back porch

    var V_BLANK; // Total vertical blanking (V_FP + V_SW + V_BP)
    var H_BLANK; // Total horizontal blanking (H_FP + H_SW + H_BP)
    var V_EFF;   // V + V_Blank + V_Margins
    var H_EFF;   // H + H_Blank + H_Margins

    var F_ACTUAL; // Actual vertical refresh frequency (after pixel clock rounding)
    var F_HOR; // Horizontal refresh frequency

    // Common constants
    var V_PER_MIN = 0.00046; /* Minimum vertical blanking period for reduced blank timing (in seconds), defined by VESA CVT 1.2 standard */
    var V_LINES = Math.floor(V / S) // If progressive scan, S = 1 and V_LINES = V. If interlaced, V_LINES = floor(V / 2).

    if (R == 1) {
        // CVT-RB constants
        H_BLANK = 160;
        H_FP = 48;
        H_BP = 80;
        H_SW = 32;
        V_FP = 3;
        var V_BP_MIN = 6;

        // All H timings are defined, as well as V_FP. Only V_SW and V_BP remain (and V_BLANK, the sum of all 3 V parameters)

        // Determine vertical sync width (V_SW) from table of magic numbers defined in VESA CVT standard
        var V_SYNC_TABLE = [
            [4/3,  4],
            [16/9, 5],
            [8/5,  6],
            [5/3,  7],
            [5/4,  7],
        ]
        V_SW = 10; // default value defined in standard
        for (var i = 0; i < V_SYNC_TABLE.length; i++) {
            if ((H / V) - V_SYNC_TABLE[i][0] < 0.05) { // Check if aspect ratio of image (H/V) matches an aspect ratio defined in table, within 0.05
                V_SW = V_SYNC_TABLE[i][1];
            }
        }

        // V_BP is determined in reverse, by calculating V_BLANK first (the sum of V_FP, V_SW, and V_BP) and subtracting out V_FP and V_SW.

        var CellGran = 8; // Cell granularity constant defined by CVT standard
        var H_RND = Math.floor(H / CellGran) * CellGran; // Round down horizontal resolution to be a multiple 8
        var V_MARGIN = Math.floor(M / 100) * V_LINES; // If margins percent (M) is 0, this result is 0
        var H_MARGIN = Math.floor(H_RND * M / 100 / CellGran) * CellGran; // If margins percent (M) is 0, this result is 0

        var H_PER_EST = ((1 / F) - V_PER_MIN) / (V_LINES + (2 * V_MARGIN)); // Horizontal blanking period estimate
        V_BLANK = Math.floor((V_PER_MIN / H_PER_EST) + 1);

        var V_BLANK_MIN = V_FP + V_SW + V_BP_MIN;
        if (V_BLANK < V_BLANK_MIN) { V_BLANK = V_BLANK_MIN; } // Enforce minimum value for V_blank

        V_BP = V_BLANK - (V_FP + V_SW);

        V_EFF = V_LINES + V_BLANK + V_MARGIN + ((S - 1)/2); // (S-1)/2 = 0 for progressive, 0.5 for interlaced
        H_EFF = H_RND + H_BLANK + H_MARGIN;

        // Calculate pixel clock, to enforce pixel clock rounding to the nearest 250 kHz, as required by the CVT standard
        var CLK = F * (V_EFF) * (H_EFF); // Pixel clock (Hz)
        CLK = Math.floor(CLK / 250000) * 250000; // Pixel clock (Hz) rounded down to the next multiple of 0.25 MHz (250 kHz, 250000 Hz)

        F_HOR = CLK / (H_EFF); // Horizontal refresh frequency (Hz)
        F_ACTUAL = F_HOR / (V_EFF); // Pixel clock rounding is enforced via lowering the vertical refresh frequency to adjust pixel clock
    }
    else if (R == 2) {
        // CVT-R2 constants defined by CVT standard
        H_BLANK = 80; 
        H_FP =  8;
        H_BP = 40;
        H_SW = 32;
        V_BP = 6;
        V_SW = 8;
        var V_FP_MIN = 1;

        // All parameters are defined as constant except V_FP
        // V_FP is determined in reverse, by calculating V_BLANK first (the sum of V_FP, V_SW, and V_BP) and subtracting V_SW and V_BP out.

        var V_MARGIN = Math.floor(M / 100) * V_LINES; // If margins percent (M) is 0, this result is 0
        var H_MARGIN = Math.floor(H * M / 100); // If margins percent (M) is 0, this result is 0

        var H_PER_EST = ((1 / F) - V_PER_MIN) / (V_LINES + (2 * V_MARGIN)); // Horizontal blanking period estimate
        V_BLANK = Math.floor((V_PER_MIN / H_PER_EST) + 1);

        var V_BLANK_MIN = V_FP_MIN + V_SW + V_BP;
        if (V_BLANK < V_BLANK_MIN) { V_BLANK = V_BLANK_MIN; } // Enforce minimum value for V_blank

        V_FP = V_BLANK - (V_BP + V_SW);

        V_EFF = V_LINES + V_BLANK + V_MARGIN + ((S - 1)/2); // (S-1)/2 = 0 for progressive, 0.5 for interlaced
        H_EFF = H + H_BLANK + H_MARGIN;
    
        // Calculate pixel clock, to enforce pixel clock rounding to the nearest 1 kHz, as required by the CVT standard
        var CLK = F * (V_EFF) * (H_EFF); // Pixel clock (Hz)
        CLK = Math.floor(CLK / 1000) * 1000; // Pixel clock (Hz) rounded down to the next multiple of 0.001 MHz (1 kHz, 1000 Hz)

        F_HOR = CLK / (H_EFF); // Horizontal refresh frequency (Hz)
        F_ACTUAL = F_HOR / (V_EFF);
    }
    //DEBUG('CLK', CLK);
    //DEBUG('F_HOR', F_HOR);
    //DEBUG('F_ACTUAL', F_ACTUAL);

    //DEBUG(V_BLANK);
    return {
        V_FP: V_FP, // For interlaced, these vertical timing are used for the even fields
        V_BP: V_BP,
        V_SW: V_SW,
        H_FP: H_FP,
        H_BP: H_BP,
        H_SW: H_SW,

        V_FP_ODD: V_FP + 0.5, // For interlaced, V_FP and V_BP are 0.5 higher for odd fields (V_SW is same)
        V_SW_ODD: V_SW,
        V_BP_ODD: V_BP + 0.5,

        V_BL: V_BLANK,
        H_BL: H_BLANK,

        V_EFF: V_EFF,
        H_EFF: H_EFF,

        F_ACTUAL: F_ACTUAL,
    };
}


function CTA() {

}


function updateDisplay() {
    return;
}


function clearResults() {
    return;
}

function timingUIChange() {
    // Controls the enabled/disabled state of the custom timing format input fields
    var timing_params = [
        $('#V_FP'),
        $('#V_BP'),
        $('#V_SW'),
        $('#H_FP'),
        $('#H_BP'),
        $('#H_SW'),
    ];
    value = $('#TIMING_DROP').val();
    if (value == 'Custom') {
        for (var i = 0; i < timing_params.length; i++) {
            param = timing_params[i];
            param.prop('disabled', false);
            //if (field.prop('oldvalue') != '') {
            //    field.val(field.prop('oldvalue'));
            //}
        }
    }

    else {
        for (var i = 0; i < timing_params.length; i++) {
            param = timing_params[i];
            param.prop('disabled', true);
            //field.prop('oldvalue', field.val());
            //field.val('');
        }
    }
    value = $('input[name=SCAN_SLCT]:checked').val();
    if (value == 'i') {
        $('#V_BLANK_ODD_LABEL').css('display', 'table-cell');
        $('#V_FP_ODD_CONTAINER').css('display', 'table-cell');
        $('#V_BP_ODD_CONTAINER').css('display', 'table-cell');
        $('#V_SW_ODD_CONTAINER').css('display', 'table-cell');
        $('#V_BLANK_ODD_CONTAINER').css('display', 'table-cell');
        $('#V_BLANK_EVEN_LABEL').html('(Even)&nbsp;V<sub>blank</sub>');
    }
    else if (value == 'p') {
        $('#V_BLANK_ODD_LABEL').css('display', 'none');
        $('#V_FP_ODD_CONTAINER').css('display', 'none');
        $('#V_BP_ODD_CONTAINER').css('display', 'none');
        $('#V_SW_ODD_CONTAINER').css('display', 'none');
        $('#V_BLANK_ODD_CONTAINER').css('display', 'none');
        $('#V_BLANK_EVEN_LABEL').html('V<sub>blank</sub>');
    }
    else {
        DEBUG('Something somewhere has gone terribly wrong. Attemped to grab SCAN_SLCT value, and it was neither "p" nor "i"!');
    }
}


function colordepthUIChange() {
    // Controls the enabled/disabled state of the custom timing format input fields
    var field = $('#CUSTOM_COLOR_DEPTH');
    value = $('input[name=COLOR_DEPTH_SLCT]:checked').val();
    if (value == 'Custom') {
        field.prop('disabled', false);
        $('input[name=CD_UNIT_SLCT]').prop('disabled', false);
    }

    else {
        field.prop('disabled', true);
        $('input[name=CD_UNIT_SLCT]').prop('disabled', true);
    }
}


function marginsUIChange() {
    // Controls the enabled/disabled state of the custom timing format input fields
    var field = $('#CUSTOM_MARGINS');
    value = $('input[name=MARGINS_SLCT]:checked').val();
    if (value == 'y') {
        field.prop('disabled', false);
        if (field.val() == '') {
            field.val('1.8');
        }
    }

    else {
        field.prop('disabled', true);
    }
}


function SI(value, unit, options_input) {
    DEBUG('Input:', value, unit, options_input);
    if (isNaN(parseInt(value))) { return value; }
    if (typeof(options_input) == 'number' || typeof(options_input) == 'string') { options_input = {p: options_input.toString()}; }

    /* Valid options:
    SI_options = {
        p:     2            Specifies default precision (number of decimal places). Use '-1' or 'a' or 'adaptive' for adaptive mode (autodetect decimal places)
                            Also accepts individual decimal place settings for each prefix, in array format; for example:
                                {p: [1, G2, M0]} sets a default of 1 for all prefixes, then specifies 2 decimal places for Giga and 0 for Mega.
        p_max: 4            Maximum number of decimal places (for adaptive precision mode)
        p_min: 2            Minimum number of decimal places (for adaptive precision mode)

        separator: ','      Character to use as thousands separator (default comma)
        decimal: '.'        Character to use as decimal point (default period)
        unit_sep: '&nbsp;'  Character to place between the value and unit symbol (default non-breaking space)
        cap_kilo: 'true'    Use capital K for kilo instead of small k. (default false)
        no_mu: 'true'       Use "u" instead of "µ" on output, if necessary for compatibility reasons (default false)

        exclude: ['c', 'd'] SI prefixes to exclude, for situational use (i.e. for displaying time, one may not wish for "centiseconds").
                            Symbols can also be used as shortcuts, as in the following examples:
                                '>=G' excludes Giga and larger
                                '>G' excludes larger than Giga, but not Giga itself
                                '<G' and "<=G" same as above, but for prefixes smaller than Giga
                                '*' excludes all prefixes (unless protected)
                                '!G' protects a prefix from '*', i.e. {exclude: ['*', '!k', '!M']} excludes all prefixes except Kilo and Mega)
                            Multiple arguments accepted in array format
                            "u" is accepted as an argument for excluding "µ", and "0" is accepted for excluding the prefixless base unit
                            By default, the following are excluded already, and must be un-excluded (using !c, !d, etc.) to be used:
                                'c' (centi, 10^-2)
                                'd' (deci, 10^-1)
                                'D' (deca, 10^1)
                                'H' (hecto, 10^2)
    }
    */


    //console.log(SI_options['precision']);

    var out_value;
    var out_prefix;
    var precision;

    var prefixDef = {
        '-24': {sym:'y', name:'yocto', p: 0, excl: false},
        '-21': {sym:'z', name:'zepto', p: 0, excl: false},
        '-18': {sym:'a', name:'atto',  p: 0, excl: false},
        '-15': {sym:'f', name:'femto', p: 0, excl: false},
        '-12': {sym:'p', name:'pico',  p: 0, excl: false},
        '-9':  {sym:'n', name:'nano',  p: 0, excl: false},
        '-6':  {sym:'µ', name:'micro', p: 0, excl: false},
        '-3':  {sym:'m', name:'milli', p: 0, excl: false},
        '-2':  {sym:'c', name:'centi', p: 0, excl: false},
        '-1':  {sym:'d', name:'deci',  p: 0, excl: false},
        '0':   {sym:'',  name:'',      p: 0, excl: false},
        '1':   {sym:'D', name:'deca',  p: 0, excl: false},
        '2':   {sym:'H', name:'hecto', p: 0, excl: false},
        '3':   {sym:'k', name:'kilo',  p: 0, excl: false},
        '6':   {sym:'M', name:'mega',  p: 0, excl: false},
        '9':   {sym:'G', name:'giga',  p: 0, excl: false},
        '12':  {sym:'T', name:'tera',  p: 0, excl: false},
        '15':  {sym:'P', name:'peta',  p: 0, excl: false},
        '18':  {sym:'E', name:'exa',   p: 0, excl: false},
        '21':  {sym:'Z', name:'zetta', p: 0, excl: false},
        '24':  {sym:'Y', name:'yotta', p: 0, excl: false},
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
    }

    SI_defaults = {
        p:          2,
        p_max:      8,
        p_min:      0,
        separator:  ',',
        decimal:    '.',
        unit_sep:   '&nbsp;',
        cap_kilo:   false,
        no_mu:      false,
        exclude:    ['c', 'd', 'D', 'H'],
    }
    // Apply the default precision setting above
    for (var i = -24; i <= 24; i++) {
        if (i.toString() in prefixDef) {
            prefixDef[i.toString()]['p'] = SI_defaults['p'];
        }
    }
    //SI_options = Unpack_SI_options(SI_options, options_input);
    var SI_options = SI_set_options(SI_defaults, options_input, prefixDef, pre2num);
    //console.log(SI_options);
    //console.log(options_input);
    SI_options['p'] = options_input['p'];

    //console.log('SI_options: ', SI_options);

    prefixDef = SI_set_precision(SI_options, prefixDef, pre2num);

    var magnitude = Math.floor(Math.log(value)/Math.log(10));

    if (magnitude >= -24 && magnitude <= 24) {
        // Change any inbetween magnitudes to one that has a prefix assigned to it
        /*
        if (!(magnitude in prefixDef)) {
            magnitude = 3 * Math.floor(magnitude / 3);   
        }*/
        while (!(magnitude in prefixDef)) {
            magnitude--;
        }
        // Get the precision specified for that magnitude
        precision = prefixDef[magnitude]['p'];

        // Divide the number by the appropriate power of 10, and return the new number and associated SI prefix
        out_value = Commas(Number(value / Math.pow(10, magnitude)).toFixed(precision));
        out_prefix = prefixDef[magnitude]['sym'];
    }
    else {
        out_value = Commas(value);
        out_prefix = '';
    }

    return (out_value + '&nbsp;' + out_prefix + unit);
}


function SI_set_options(SI_options, options_input, prefixDef, pre2num) {
    var opt = ['p', 'p_max', 'p_min', 'separator', 'decimal', 'unit_sep', 'cap_k', 'no_mu'];
    // Loop through all options, if specified by options_input, replace the default
    for (var i = 0; i < opt.length; i++) {
        if (opt[i] in options_input) {
            SI_options[opt[i]] = options_input[opt[i]];
        }
    }
    var explicit_incl = [];
    var arg;
    var offset;

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
    return SI_options;
}


function SI_set_precision(SI_options, prefixDef, pre2num) {
    for (var i = 0; i < SI_options['exclude'].length; i++) {
        //prefixDef[pre2num[SI_options['exclude'][i]]]['excl'] = true;
        // Delete prefixes that have been excluded
        delete prefixDef[pre2num[SI_options['exclude'][i]]];
    }
    var precision = SI_options['p'];

    // If the precision argument is a string, then there is only 1 precision specified
    if (typeof(precision) == 'string') {

        // If it's a 1-character string, then it's a pure number, which means it is set as the default for all prefixes
        if (precision.length == 1) {
            for (var i = -24; i <= 24; i++) {
                if (i.toString() in prefixDef) {
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
        for (var j = 0; j < precision.length; j++) {
            if (precision[j].length == 1) {
                for (var i = -24; i <= 24; i++) {
                    if (i.toString() in prefixDef) {
                        prefixDef[i.toString()]['p'] = parseInt(precision[j]);
                    }
                }
            }
                // If it's a 2-character string, it could be a 2 digit number or a prefix-specific code
            else if (precision[j].length == 2) {
                if (isNaN(parseInt(precision[j][0])) && (pre2num[precision[j][0]] in prefixDef)) {
                    prefixDef[pre2num[precision[j][0]]]['p'] = parseInt(precision[j][1]);
                }
            }
        }
    }
    return prefixDef
}


function Load_CTA_861() {
    // Loads the timing definitions for the CTA-861 standard from a csv file
    fetch('CTA861.txt')
        .then(
            function(response) {
                if (response.status !== 200 && response.status !== 0) {
                    console.log('Response code:', response.status);
                    return;
                }
                CTA861 = data;
            }
        ).then(
            function() {
                DEBUG(CTA861);
            }
        )
}


//Small functions
{
function Commas(num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


function getPrecision(x, watchdog) {
    // https://stackoverflow.com/questions/27082377/get-number-of-decimal-places-with-javascript
    x = Math.abs(x);
    watchdog = watchdog || 32;
    var i = 0;
    while (x % 1 > 0 && i < watchdog) {
        i++;
        x = x * 10;
    }
    return i;
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


function SameRatio(H, V, A) {
    /* Checks if the ratio H/V is equal to the given ratio A (within a defined margin of error E) */
    /* Negative signs on H, V, and A are ignored */

    var E = 0.001; /* E is a percent error written as a decimal (i.e. E = 0.001 would give an acceptable error margin of 0.1%) */

    if (Math.abs((Math.abs(H / V) / Math.abs(A)) - 1) <= E) { return true; }
    else { return false; }
}


    /*
function parseNum(val) {
    // Converts string to floating point if it has a decimal point, or integer if there is no decimal point. Also strips commas and spaces, and optionally applies absolute value.

    if (typeof val === "string") {
        // val = val.replace(/[^0-9\. ]/g, ''); // Apply absolute value and ignore non-numeric characters
        // val = val.replace(/[^0-9\. -]/g, ''); // Allow negative numbers and ignore non-numeric characters
        
        //val = val.replace(/-/g, ''); // Remove minus signs

        // Return NaN if...
        if (val == '' // input is blank
            || val.indexOf('.') != val.lastIndexOf('.') // input contains multiple decimal places
            || val.indexOf('-') != val.lastIndexOf('-') // input contains multiple minus signs
            || (val.indexOf('-') != -1 && val.indexOf('-') != 0) // input contains a minus sign in a position other than the first character
            || val.match(/[^0-9.-]/g)) // input contains any character other than a number, decimal, minus, or space
        {
            return NaN;
        }

        else {
            // Once we have checked that the input contains no characters other than numerals, periods, and minus signs
            // And that there are at most one period and one minus sign, and both are in valid positions, we can evaluate the number as either float or string.
            // If for some reason either of them fail, it will still return NaN anyway
            if (val.indexOf('.') == -1)
                return parseInt(val);
            else {
                return parseFloat(val);
            }
        }
    }
    else if (Number.isNaN(val)) {
        return NaN; // Check if val is literally 'NaN'
    }
    else if (typeof val === "number") {
        return val; // NaN is recognized as a number, so this line must be after NaN is handled
    }
    else {
        return NaN;
    }
}*/


function parseNum(val) {
    // This function is designed to interpret strings with formatted numbers (which may contain currencies, digit grouping commas, units, etc.)
    // It will return NaN if it cannot be interpreted as a valid number (i.e. no numeric characters, multiple periods or minus signs, etc.)

    if (typeof(val) === 'number') {
        // If the input argument is already a number, then nothing needs to be done, simply return the input value
        if (Number.isNaN(val) == true) {
            // However, we do need to check that it isn't NaN, because that is identified as a number.
            return NaN;
        }
        else {
            return val;
        }
    }

    else if (typeof val === 'string') {
        // First, remove all non-numeric characters on the outsides of the string
        for (var i = 0; i < val.length; i++) {
            if (!(i < val.length)) { break; }
            //DEBUG('i:', i, 'val:', val, 'val[i]:', val[i]);
            // Loop through each character starting from the front
            if ((/[^0-9.-]/g).test(val[i]) == true) {
                // If character is not a number, period, or minus sign, remove it
                if (i == 0 && val.length > 1) { val = val.slice(1); }
                else if (i == val.length - 1) { return NaN; } // If this is the last character in the string
                else if (i > 0) { val = (val.slice(0, i)) + (val.slice(i+1));}
                i = i - 1; // Since a character has been removed, the next character is now at the same index
                continue;
            }
            else if ((/[-]/g).test(val[i]) == true) {
                // If character is a negative sign, ignore it. This is because there may still be non-number characters between the negative sign and the first digit, such as "-$1.00". The negative sign should stay but the dollar needs to be removed.
                continue;
            }
            else if ((/[.]/g).test(val[i]) == true) {
                // If character is a period, then following character MUST be a digit, unless it's the end of the number.
                if (i + 1 < val.length) {
                    if ((/[0-9]/g).test(val[i+1]) == true) {
                        // If the character after the period is a digit, then the first digit has been reached
                        break;
                    }
                    else {
                        // If the string contained a period followed by a non-numeric character, it is not a number
                        return NaN;
                    }
                }
                else {
                    // If i+1 was not < val.length, then the period is the last character in the string, which implicitly means the string contains no numeric characters.
                    return NaN;
                }
            }
            else if ((/[0-9]/g).test(val[i]) == true) {
                // If character was a numeric character, we have successfully stripped any leading characters and reached the start of the number.
                break;
            }
        }

        // Now do a similar starting from the backside, to strip any trailing characters (such as units of measurement)
        for (var i = (val.length - 1); i >= 0; i--) {
            if ((/[^0-9]/g).test(val[i]) == true) {
                // No need to modify iterator for this direction
                // Since we are dealing with the end of the number, minus signs are no longer part of the number. Periods at the end are valid, but superfluous
                // Since we are only checking the characters after the digits have ended, minus signs are not invalid, as they may be part of a unit of measurement. Therefore, they are simply removed, rather than returning NaN.
                if (val.length == 1) { return NaN; }
                else { val = val.slice(0, i); }
                continue;
            }
            else if ((/[0-9]/g).test(val[i]) == true) {
                // If character is a numeric character, we have reached the back end of the number and successfully stripped any trailing characters.
                break;
            }
        }

        // We now strip any commas and whitespace throughout the string
        val = val.replace(/[, ]/g, '');
        // If, after removing leading and trailing units, whitespace, and commas, there are any non-numeric characters (i.e. in the middle of the string after the numbers start), it is not a valid number
        if ((/[^0-9.-]/g).test(val) == true) {
            return NaN;
        }
        // Now that the string only contains numeric characters, minus signs, and periods, we must check if there are any invalid usages of the periods and signs, such as multiple periods/signs, or a minus sign anywhere other than the first character.

        if (val == '' // string is empty
            || val.indexOf('.') != val.lastIndexOf('.') // string contains multiple decimal point
            || val.indexOf('-') != val.lastIndexOf('-') // string contains multiple minus signs
            || (val.indexOf('-') != -1 && val.indexOf('-') != 0)) // input contains a minus sign and it isn't the first character
        {
            return NaN;
        }

        // Finished; string now only contains numbers, up to one period, and up to one minus sign as the first character of the string.

        // If for some reason the parseFloat fails, the function will return NaN, so the output is still consistent with any other failed condition.
        return parseFloat(val);
    }
}


function isNum(num) {
    // Returns false if input is not a number, including a blank string or NaN
    // Can accept arrays, and returns true only if all elements would return true individually
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseFloat(num[a])) == true) {
                return false;
            }
            return true;
        }
    }
    else {
        return !Number.isNaN(parseFloat(num));
    }
}


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


function isPositiveZ(num) {
    // Returns true if input is positive or zero. Can recognize formatted numbers (i.e. "1,234,567 Gbit/s" or "-$1,234 USD") as allowed by parseNum
    // Combine with isNum() to allow only true (non-formatted) numbers and strings (i.e. if (isNum(x) && isPositiveZ(x))

    /*
    
    True:

    isPositiveZ(1)
    isPositiveZ('1')
    isPositiveZ(1.1)
    isPositiveZ('1.1')
    isPositiveZ('1.')             Number string with stray decimal
    isPositiveZ(0) or ('0')
    isPositiveZ(Infinity)
    isPositiveZ([1, '2', 3.3])    true iff all elements are non-negative

    False:

    isPositiveZ(-1)
    isPositiveZ('-1')
    isPositiveZ(-1.1)
    isPositiveZ('-1.1')
    isPositiveZ('1 ')     Number with whitespace
    isPositiveZ('')       Empty String
    isPositiveZ('abc')
    isPositiveZ(NaN)
    isPositiveZ([-1, '2', 3.3])   If any element is negative
    
    */

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


function isInt(num) {
    /*
    True:

    isInt(1)
    isInt('1')
    isInt(-1)
    isInt('-1')
    isInt(0)
    isInt([1, -2, '3'])
    isInt(1, 'a')  -> true (be careful to enter multiple arguments as an array, otherwise it will only evaluate the first argument, as seen here)

    False:

    isInt(1.1)
    isInt('1 ')
    isInt('1 2')
    isInt('abc')
    isInt('abc123')
    isInt('')
    isInt(NaN)
    isInt(Infinity)
    isInt([1, 2, 3.3])  Returns false if any of the array elements are not an integer

    */

    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == false) {
                return false;
            }
        }
        return true;
    }
    else {
        num = parseNum(num);
        return Number.isInteger(num);
    }
}


function isFloat(num) {
    /*

    True:

    isFloat(1.1)
    isFloat('1.1')
    isFloat(-1.1)
    isFloat('-1.1')
    isFloat('.1')
    isFloat('-.1')
    isFloat([1.1, -1.2, '1.3'])
    isFloat(Infinity)
    isFloat([1.1, 'a'])  -> true (be careful to enter multiple arguments as an array, otherwise it will only evaluate the first argument, as seen here)

    False:

    isFloat(1.0)
    isFloat('1.0')
    isFloat(0)
    isFloat(1)
    isFloat('1.1.1')
    isFloat('')
    isFloat('a')
    isFloat('1.1a')
    isFloat([1.1, 1.2, 3])
    isFloat(NaN)

    */
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            num[a] = parseNum(num[a]);
            if (Number.isInteger(num[a]) == true || Number.isNaN(num[a]) == true) {
                return false;
            }
        }
        return true;
    }
    else {
        num = parseNum(num);
        return !(Number.isInteger(num) || Number.isNaN(num));
    }
}


}


window.onpageshow = function() {
    generate_table('Interface Support', -1);
    $('#INPUT_HRES')[0].onchange();
    $('#INPUT_VRES')[0].onchange();
    $('#INPUT_F')[0].onchange();
    $('#COLOR_DEPTH_FORM')[0].onchange();
    $('#PIXEL_FORMAT_FORM')[0].onchange();
    $('#COMPRESSION_FORM')[0].onchange();
    $('#SCAN_FORM')[0].onchange();
    $('#MARGINS_FORM')[0].onchange();
    $('#TIMING_DROP')[0].onchange();
    calcMain();
}