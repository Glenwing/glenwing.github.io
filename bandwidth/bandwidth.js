DebugConfig({
    //all:                true,
    calcMain:           1,
    submitVar:          0,
    input_ok:           0,
    updateDisplay:      0,
    getTiming:          1,

    marginsUIChange:    0,
    timingUIChange:     0,
    generate_table:     0,

    SI:                 0,
    SI_include_exclude: 0,
    SI_set_options:     0,
    SI_set_precision:   0,
    
    CTA:                0,
    DMT:                1,
    CVT:                0,
    CVT_R:              0,
    GTF:                0,
});


CTA861 = {};
DMT_List = {};


// The intepreted current state of all input fields is stored here
Global_InputVars = {
    'HRES': '', // int
    'VRES': '', // int
    'FREQ': '', // float
    'COLOR_DEPTH': '', // int, in bits per pixel
    'PIXEL_FORMAT': '', // float: 1.0 for RGB/YCbCr 4:4;4, 1.5 for YCbCr 4:2:2, 2.0 for YCbCr 2.0
    'COMP': '', // float (compression ratio)
    'SCAN': '', // int; 1 for progressive, 2 for interlaced
    'MARGINS': '', // float; margin %
    'TIMING_STD': '', // string
    'V_FP': '', // int
    'V_BP': '', // int
    'V_SW': '', // int
    'H_FP': '', // int
    'H_BP': '', // int
    'H_SW': '', // int
    'V_FP_INT': '', // int
    'V_BP_INT': '', // int
    'V_SW_INT': '', // int
}

Detailed_Results = {

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

        if (val != 'Custom' && val != 'None') {
            if (Global_InputVars['HRES'] == '' || Global_InputVars['VRES'] == '' || Global_InputVars['FREQ'] == '') {
                $('#TIMING_FORMAT_NAME').html('');
                clearTiming();
            }
        }
    }

    else if (id == 'V_FP' || id == 'V_BP' || id == 'V_SW' ||
        id == 'H_FP' || id == 'H_BP' || id == 'H_SW' ||
        id == 'V_FP_INT' || id == 'V_SW_INT' || id == 'V_BP_INT') {
        GlobalVars_Key = id;
        //val = Math.abs(parseNum(val));
        if (isNum(val)) {
            Global_InputVars[id] = Math.abs(val);
            $('#' + id).val(val);
            if (Global_InputVars['V_FP'] != '' && Global_InputVars['V_BP'] != '' && Global_InputVars['V_SW'] != '') {
                $('#V_BLANK').html(Global_InputVars['V_FP'] +Global_InputVars['V_BP'] + Global_InputVars['V_SW']); }
            if (Global_InputVars['H_FP'] != '' && Global_InputVars['H_BP'] != '' && Global_InputVars['H_SW'] != '') {
                $('#H_BLANK').html(Global_InputVars['H_FP'] + Global_InputVars['H_BP'] + Global_InputVars['H_SW']); }
            if (Global_InputVars['V_FP_INT'] != '' && Global_InputVars['V_BP_INT'] != '' && Global_InputVars['V_SW_INT'] != '') {
                $('#V_BLANK_INT').html(Global_InputVars['V_FP_INT'] + Global_InputVars['V_BP_INT'] + Global_InputVars['V_SW_INT']); }
        }
        else {
            DEBUG(id + ' input is not a number:', val);
            Global_InputVars[id] = '';
            $('#' + id).val('');
            if (id == 'V_FP' || id == 'V_BP' || id == 'V_SW') { $('#V_BLANK').html(''); }
            if (id == 'H_FP' || id == 'H_BP' || id == 'H_SW') { $('#H_BLANK').html(''); }
            if (id == 'V_FP_INT' || id == 'V_SW_INT' || id == 'V_BP_INT') { $('#V_BLANK_INT').html(''); }
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

    if (!isNum(Global_InputVars['COLOR_DEPTH'])) {
        var abort = true;
        DEBUG('Calculation aborted. Color Depth has not yet been defined.');
        return false;
    }
    if ($('input[name=COLOR_DEPTH_SLCT]:checked').val() == 'Custom') {
        val = Global_InputVars['COLOR_DEPTH'];
        if (!(isPositive(val))) {
            DEBUG('Calculation aborted. COLOR_DEPTH_SLCT is set to Custom, but CUSTOM_COLOR_DEPTH contains an empty or non-numeric string, or 0.', val);
            return false;
        }
    }

    if (Global_InputVars['PIXEL_FORMAT'] == '') {
        var abort = true;
        DEBUG('Calculation aborted. Pixel Format has not yet been defined.');
        return false;
    }

    if (Global_InputVars['TIMING_STD'] == '') {
        var abort = true;
        DEBUG('Calculation aborted. Timing Standard has not yet been defined.');
        return false;
    }
    else if (Global_InputVars['TIMING_STD'] == 'Custom') {
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

    if (!isNum(Global_InputVars['COMP'])) {
        var abort = true;
        DEBUG('Calculation aborted. COMPRESSION has not yet been defined.');
        return false;
    }

    if (!isNum(Global_InputVars['SCAN'])) {
        var abort = true;
        DEBUG('Calculation aborted. SCAN TYPE has not yet been defined.');
        return false;
    }

    if (!isNum(Global_InputVars['MARGINS'])) {
        var abort = true;
        DEBUG('Calculation aborted. Margins have not yet been defined.');
        return false;
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
    /*
    if(Global_InputVars['HRES'] == '')          { submitVar('INPUT_HRES') }
    if(Global_InputVars['VRES'] == '')          { submitVar('INPUT_VRES') }
    if(Global_InputVars['FREQ'] == '')          { submitVar('INPUT_F') }
    if(Global_InputVars['COLOR_DEPTH'] == '')   { submitVar('COLOR_DEPTH_FORM') }
    if(Global_InputVars['PIXEL_FORMAT'] == '')  { submitVar('PIXEL_FORMAT_FORM') }
    if(Global_InputVars['COMP'] == '')          { submitVar('COMPRESSION_FORM') }
    if(Global_InputVars['SCAN'] == '')          { submitVar('SCAN_FORM') }
    if(Global_InputVars['MARGINS'] == '')       { submitVar('MARGINS_FORM') }
    if(Global_InputVars['TIMING_STD'] == '')    { submitVar('TIMING_DROP') }
    
    if(Global_InputVars['V_FP'] == '')          { submitVar('V_FP') }
    if(Global_InputVars['V_BP'] == '')          { submitVar('V_BP') }
    if(Global_InputVars['V_SW'] == '')          { submitVar('V_SW') }
    if(Global_InputVars['H_FP'] == '')          { submitVar('H_FP') }
    if(Global_InputVars['H_BP'] == '')          { submitVar('H_BP') }
    if(Global_InputVars['H_SW'] == '')          { submitVar('H_SW') }
    if(Global_InputVars['V_FP_INT'] == '')      { submitVar('V_FP_INT') }
    if(Global_InputVars['V_BP_INT'] == '')      { submitVar('V_BP_INT') }
    if(Global_InputVars['V_SW_INT'] == '')      { submitVar('V_SW_INT') }
    */

    if (!input_ok()) { clearResults(); $('#TIMING_FORMAT_NAME').html(''); return; }

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
    if (!Timing) { clearResults(); return; } // Abort if getTiming returns false, it indicates the format is not defined for that timing standard.
    DEBUG('Timing:', Timing);
    
    var h_eff = Timing['H_EFF']
    var v_eff = Timing['V_EFF'] * scan
    var freq_act = Timing['F_ACTUAL'];

    // DATA TRANSMISSION

    {
        Detailed_Results['data_rate'] = SI(
            (h_eff * v_eff * freq_act * color_depth / px_format / scan / comp),
            'bit/s',
            {'p':2, 'output':'split'},
        );

        Detailed_Results['8b10b'] = SI(
            (h_eff * v_eff * freq_act * color_depth / px_format / scan / comp) * (1.25),
            'bit/s',
            {'p':2, 'output':'split'},
        );

        Detailed_Results['16b18b'] = SI(
            (h_eff * v_eff * freq_act * color_depth / px_format / scan / comp) * (1.125),
            'bit/s',
            {'p':2, 'output':'split'},
        );

        Detailed_Results['128b132b'] = SI(
            (h_eff * v_eff * freq_act * color_depth / px_format / scan / comp) * (1.03125),
            'bit/s',
            {'p':2, 'output':'split'},
        );

        Detailed_Results['pixel_rate'] = SI(
            (h_eff * v_eff * freq_act / scan),
            'px/s',
            {'p':[3, 'b1', 'k1', 'M1'], 'output':'split'},
        );

        Detailed_Results['pixel_rate_active'] = SI(
            (hres * vres * freq_act / scan),
            'px/s',
            {'p':[3, 'b1', 'k1', 'M1'], 'output':'split'},
        );
    }

    // RESOLUTION

    {
        Detailed_Results['active_px'] = {
            'h':    { 'val': hres },
            'v':    { 'val': vres },
            't':    SI(hres * vres, 'px', {'p':0, 'output':'split', 'include': ['b']}),
        };

        Detailed_Results['blank_px'] = {
            'h':    { 'val': h_eff - hres },
            'v':    { 'val': v_eff - vres },
            't':    SI((h_eff * v_eff) - (hres * vres), 'px', {'p':0, 'output':'split', 'include': ['b']}),
        };

        Detailed_Results['total_px'] = {
            'h':    { 'val': h_eff },
            'v':    { 'val': v_eff },
            't':    SI(h_eff * v_eff, 'px', {'p':0, 'output':'split', 'exclude': ['<B', '>B']}),
        };

        Detailed_Results['overhead_px'] = {
            'h':    SI(100 * ((h_eff / hres) - 1), '%', {'p':2, 'output':'split',  'exclude': ['<B', '>B']}),
            'v':    SI(100 * ((v_eff / vres) - 1), '%', {'p':2, 'output':'split',  'exclude': ['<B', '>B']}),
            't':    SI(100 * (((h_eff * v_eff) / (hres * vres)) - 1), '%', {'p':2, 'output':'split', 'exclude': ['<B', '>B']}),
        };
    }

    // FORMAT

    {
        if ($('input[name=COLOR_DEPTH_SLCT]:checked').val() == 'Custom') {
            if (color_depth % 3 == 0) { Detailed_Results['bpc'] = { 'val': color_depth / 3, 'unit':'bpc' }; }
            else { Detailed_Results['bpc'] = { 'val': '-', 'unit': '' }; }
        }
        else {
            Detailed_Results['bpc'] = { 'val': color_depth / 3, 'unit':'bpc' };
        }
        Detailed_Results['bpp'] = { 'val': color_depth, 'unit': 'bit/px' };

        Detailed_Results['palette'] = SI(Math.pow(2, color_depth), 'colors', {'p':0, 'output':'split', 'include':['b']});

        if ($('input[name=PX_FORMAT_SLCT]:checked').val() == 'RGB') { Detailed_Results['px_format'] = 'RGB'; }
        else if ($('input[name=PX_FORMAT_SLCT]:checked').val() == 'YCBCR 4:4:4') { Detailed_Results['px_format'] = 'YC<sub>B</sub>C<sub>R</sub> 4:4:4'; }
        else if ($('input[name=PX_FORMAT_SLCT]:checked').val() == 'YCBCR 4:2:2') { Detailed_Results['px_format'] = 'YC<sub>B</sub>C<sub>R</sub> 4:2:2'; }
        else if ($('input[name=PX_FORMAT_SLCT]:checked').val() == 'YCBCR 4:2:0') { Detailed_Results['px_format'] = 'YC<sub>B</sub>C<sub>R</sub> 4:2:0'; }

        if (scan == 1) { Detailed_Results['scan'] = 'Progressive'; }
        if (scan == 2) { Detailed_Results['scan'] = 'Interlaced'; }
    }

    // VERTICAL REFRESH FOR PROGRESSIVE SCAN

    {
        Detailed_Results['v_freq'] = SI(
            freq,
            'Hz',
            {'p':3, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['v_freq_actual'] = SI(
            freq_act,
            'Hz',
            {'p':3, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['v_freq_dev'] = SI(
            Math.abs(freq - freq_act),
            'Hz',
            {'p':6, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['v_freq_dev_perc'] = SI(
            Math.abs(100 * ((freq - freq_act) / freq)),
            '%',
            {'p':6, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_per'] = SI(
            1 / freq,
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_per_actual'] = SI(
            1 / freq_act,
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_per_dev'] = SI(
            Math.abs((1 / freq) - (1 / freq_act)),
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_per_dev_perc'] = SI(
            Math.abs(100 * ((1 / freq) - (1 / freq_act)) / (1 / freq)),
            '%',
            {'p':6, 'output':'split', 'include':['b']},
        );
    }

    // VERTICAL REFRESH FOR INTERLACED SCAN

    {
        Detailed_Results['v_field'] = SI(
            freq,
            'Hz',
            {'p':3, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['v_field_actual'] = SI(
            Timing['F_ACTUAL'],
            'Hz',
            {'p':3, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['v_field_dev'] = SI(
            Math.abs(freq - freq_act),
            'Hz',
            {'p':6, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['v_field_dev_perc'] = SI(
            Math.abs(100 * ((freq - freq_act) / freq)),
            '%',
            {'p':6, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_field_per'] = SI(
            1 / freq,
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_field_per_actual'] = SI(
            1 / freq_act,
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_field_per_dev'] = SI(
            Math.abs((1 / freq) - (1 / freq_act)),
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_field_per_dev_perc'] = SI(
            Math.abs(100 * ((1 / freq) - (1 / freq_act)) / (1 / freq)),
            '%',
            {'p':6, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_frame'] = SI(
            freq / 2,
            'FPS',
            {'p':3, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_frame_actual'] = SI(
            freq_act / 2,
            'FPS',
            {'p':3, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_frame_dev'] = SI(
            Math.abs((freq / 2) - (freq_act / 2)),
            'FPS',
            {'p':6, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_frame_dev_perc'] = SI(
            Math.abs(100 * ((freq - freq_act) / freq)),
            '%',
            {'p':6, 'output':'split', 'include':['b']},
        );

        Detailed_Results['v_frame_per'] = SI(
            (1 / (freq / 2)),
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_frame_per_actual'] = SI(
            1 / (freq_act / 2),
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_frame_per_dev'] = SI(
            Math.abs((2 / freq) - (2 / freq_act)),
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );

        Detailed_Results['v_frame_per_dev_perc'] = SI(
            Math.abs(100 * ((2 / freq) - (2 / freq_act)) / (2 / freq)),
            '%',
            {'p':6, 'output':'split', 'include':['b']},
        );
    }

    // HORIZONTAL REFRESH
    {
        Detailed_Results['h_freq'] = SI(
            (v_eff * freq_act) / scan,
            'Hz',
            {'p':3, 'output':'split', 'include':['>=b']},
        );

        Detailed_Results['h_per'] = SI(
            scan / (v_eff * freq_act),
            's',
            {'p':3, 'output':'split', 'include':['<=b']},
        );
    }

    //DEBUG('Results:', SI(results['bits_per_sec_eff'], 'bit/s', 2), results);
    generateLaTeX();
    updateDisplay();

    return;
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

            'V_FP_INT': '',
            'V_BP_INT': '',
            'V_SW_INT': '',

            'V_BL': '',
            'H_BL': '',

            'V_EFF': '',
            'H_EFF': '',

            'F_ACTUAL': Global_InputVars['FREQ'],
        };
    }

    DEBUG('Timing Standard:', timing_standard)
    if (timing_standard != 'Custom') {
        if (timing_standard == 'CVT-R2') {
            DEBUG('Fetching CVT-R2 Timing...')
            if (Global_InputVars['FREQ'] >= (1 / 0.00046)) {
                $('#TIMING_FORMAT_NAME').html('&ge;&nbsp;2173.9&nbsp;Hz not allowed');
                return false;
            }
            Timing = CVT_R(2);
            if (!Timing) {
                DEBUG ('CVT-R2 calculation error.');
                clearTiming();
                return false;
            }
            else {
                $('#TIMING_FORMAT_NAME').html('<b>VESA Name:</b> ' + (Global_InputVars['HRES'] * Global_InputVars['VRES'] / 1000000).toFixed(2) + 'M' + Timing['VESA_AR'] + '-R');
            }
        }
        else if (timing_standard == 'CVT-RB') {
            DEBUG('Fetching CVT-R2 Timing...')
            if (Global_InputVars['FREQ'] >= (1 / 0.00046)) {
                $('#TIMING_FORMAT_NAME').html('&ge;&nbsp;2173.9&nbsp;Hz not allowed');
                return false;
            }
            Timing = CVT_R(1);
            if (!Timing) {
                DEBUG ('CVT-RB calculation error.');
                $('#TIMING_FORMAT_NAME').html('');
                clearTiming();
                return false; }
            else {
                $('#TIMING_FORMAT_NAME').html('<b>VESA Name:</b> ' + (Global_InputVars['HRES'] * Global_InputVars['VRES'] / 1000000).toFixed(2) + 'M' + Timing['VESA_AR'] + '-R');
            }
        }
        else if (timing_standard == 'CVT') {
            if (Global_InputVars['FREQ'] >= (1 / 0.00055)) {
                $('#TIMING_FORMAT_NAME').html('&ge;&nbsp;1818.<span style="text-decoration: overline">18</span>&nbsp;Hz not allowed');
                return false;
            }
            Timing = CVT();
            if (!Timing) {
                DEBUG ('CVT calculation error.');
                $('#TIMING_FORMAT_NAME').html('');
                clearTiming();
                return false; }
            else {
                $('#TIMING_FORMAT_NAME').html('<b>VESA Name:</b> ' + (Global_InputVars['HRES'] * Global_InputVars['VRES'] / 1000000).toFixed(2) + 'M' + Timing['VESA_AR']);
            }
        }
        else if (timing_standard == 'GTF') {
            if (Global_InputVars['FREQ'] >= (1 / 0.00055)) {
                $('#TIMING_FORMAT_NAME').html('&ge;&nbsp;1818.<span style="text-decoration: overline">18</span>&nbsp;Hz not allowed');
                return false;
            }
            Timing = GTF();
            $('#TIMING_FORMAT_NAME').html('');
            if (!Timing) {
                DEBUG ('GTF calculation error.');
                clearTiming();
                return false;
            }
        }
        else if (timing_standard == 'DMT') {
            Timing = DMT();
            if (!Timing) {
                DEBUG ('Not a DMT Format. DMT Function returned false.');
                $('#TIMING_FORMAT_NAME').html('Not a DMT format');
                clearTiming();
                return false; }
            else {
                $('#TIMING_FORMAT_NAME').html('<b>DMT ID:</b> ' + Timing['ID']);
            }
        }
        else if (timing_standard == 'CTA-861') {
            Timing = CTA();
            if (!Timing) {
                DEBUG ('Not a CTA Format. CTA Function returned false. Vars:', Global_InputVars);
                $('#TIMING_FORMAT_NAME').html('Not a CTA format');
                clearTiming();
                return false; }
            else {
                $('#TIMING_FORMAT_NAME').html('<b>CTA VIC:</b> ' + Timing['VIC']);
            }
        }
        else if (timing_standard == 'None') {
            Timing = {
                'V_FP': 0,
                'V_BP': 0,
                'V_SW': 0,
                'H_FP': 0,
                'H_BP': 0,
                'H_SW': 0,

                'V_FP_INT': 0,
                'V_BP_INT': 0,
                'V_SW_INT': 0,

                'V_BL': 0,
                'H_BL': 0,

                'V_EFF': Global_InputVars['VRES'] / Global_InputVars['SCAN'],
                'H_EFF': Global_InputVars['HRES'],

                'F_ACTUAL': Global_InputVars['FREQ'],
            }
            $('#TIMING_FORMAT_NAME').html('');
        }

        // Update UI timing parameter fields with the newly generated timings
        submitVar('V_FP', Timing['V_FP']);
        submitVar('V_BP', Timing['V_BP']);
        submitVar('V_SW', Timing['V_SW']);
        submitVar('H_FP', Timing['H_FP']);
        submitVar('H_BP', Timing['H_BP']);
        submitVar('H_SW', Timing['H_SW']);
        submitVar('V_FP_INT', Timing['V_FP_INT']);
        submitVar('V_SW_INT', Timing['V_SW_INT']);
        submitVar('V_BP_INT', Timing['V_BP_INT']);

    }

    else if (timing_standard == 'Custom') {
        // Read the timing from the UI
        submitVar('V_FP', $('#V_FP').val());
        submitVar('V_BP', $('#V_BP').val());
        submitVar('V_SW', $('#V_SW').val());
        submitVar('H_FP', $('#H_FP').val());
        submitVar('H_BP', $('#H_BP').val());
        submitVar('H_SW', $('#H_SW').val());
        if (isNum(Global_InputVars['V_FP'])) { submitVar('V_FP_INT', Global_InputVars['V_FP'] + 0.5); }
        if (isNum(Global_InputVars['V_SW'])) { submitVar('V_SW_INT', Global_InputVars['V_SW']); }
        if (isNum(Global_InputVars['V_BP'])) { submitVar('V_BP_INT', Global_InputVars['V_BP'] + 0.5); }

        Timing = {
            'V_FP': Global_InputVars['V_FP'],
            'V_BP': Global_InputVars['V_BP'],
            'V_SW': Global_InputVars['V_SW'],
            'H_FP': Global_InputVars['H_FP'],
            'H_BP': Global_InputVars['H_BP'],
            'H_SW': Global_InputVars['H_SW'],

            'V_FP_INT': Global_InputVars['V_FP_INT'],
            'V_BP_INT': Global_InputVars['V_BP_INT'],
            'V_SW_INT': Global_InputVars['V_SW_INT'],

            'V_BL': Global_InputVars['V_FP'] + Global_InputVars['V_BP'] + Global_InputVars['V_SW'],
            'H_BL': Global_InputVars['H_FP'] + Global_InputVars['H_BP'] + Global_InputVars['H_SW'],

            'V_EFF': Global_InputVars['VRES'] + Global_InputVars['V_FP'] + Global_InputVars['V_BP'] + Global_InputVars['V_SW'],
            'H_EFF': Global_InputVars['HRES'] + Global_InputVars['H_FP'] + Global_InputVars['H_BP'] + Global_InputVars['H_SW'],

            'F_ACTUAL': Global_InputVars['FREQ'],
        }
        $('#TIMING_FORMAT_NAME').html('');
    }

    $('#V_BLANK').html(Timing['V_BL']);
    $('#H_BLANK').html(Timing['H_BL']);

    return Timing;
}


function clearTiming() {
    submitVar('V_FP', '');
    submitVar('V_BP', '');
    submitVar('V_SW', '');
    submitVar('H_FP', '');
    submitVar('H_BP', '');
    submitVar('H_SW', '');
    submitVar('V_FP_INT', '');
    submitVar('V_SW_INT', '');
    submitVar('V_BP_INT', '');
    return;
}


function CVT_R(R) { // Variable R is an integer representing the reduced blanking revision to use, version 1 or version 2.
    var H = Global_InputVars['HRES']; // Horizontal active pixels
    var V = Global_InputVars['VRES']; // Vertical active pixels
    var F = Global_InputVars['FREQ']; // Nominal vertical refresh frequency
    var S = Global_InputVars['SCAN']; // 1 for progressive scan, 2 for interlaced
    var M = Global_InputVars['MARGINS']; // Margins (%)

    var I = (S - 1) / 2; // 0 for progressive, 0.5 for interlaced

    // Declaring variables for all results
    var V_FP; // Vertical front porch
    var V_SW; // Vertical sync width
    var V_BP; // Vertical back porch

    var H_FP; // Horizontal front porch
    var H_SW; // Horizontal sync width
    var H_BP; // Horizontal back porch

    var V_BLANK; // Total vertical blanking inteval size, in pixels (V_FP + V_SW + V_BP)
    var H_BLANK; // Total horizontal blanking interval size, in pixels (H_FP + H_SW + H_BP)
    var V_EFF;   // V + V_Blank + V_Margins
    var H_EFF;   // H + H_Blank + H_Margins

    var F_ACTUAL; // Actual vertical refresh frequency (after pixel clock rounding)
    var F_HOR; // Horizontal refresh frequency

    // Common constants
    var V_PER_MIN = 0.00046; // Minimum vertical blanking period for reduced blank timing (in seconds), defined by VESA CVT 1.2 standard
    var V_LINES = Math.floor(V / S) // If progressive scan, S = 1 and V_LINES = V. If interlaced, V_LINES = floor(V / 2).

    if (R == 1) {
        // CVT-RB constants
        H_BLANK = 160;
        H_FP = 48;
        H_BP = 80;
        H_SW = 32;
        V_FP = 3;
        var V_BP_MIN = 6;

        // All H timings are pre-defined by the standard, as well as V_FP. Only V_SW and V_BP remain (and V_BLANK, the sum of all 3 V parameters)

        // Determine vertical sync width (V_SW) from table of magic numbers defined in VESA CVT standard
        var V_SYNC_TABLE = [
            [4/3,  4, '3'],
            [16/9, 5, '9'],
            [8/5,  6, 'A'],
            [5/3,  7, '9'],
            [5/4,  7, '4'],
        ]
        var AR_NAME = '';
        V_SW = 10; // default value defined in standard
        for (var i = 0; i < V_SYNC_TABLE.length; i++) {
            if (Math.abs((H / V) - V_SYNC_TABLE[i][0]) < 0.05) { // Check if aspect ratio of image (H/V) matches an aspect ratio defined in table, within 0.05
                V_SW = V_SYNC_TABLE[i][1];
                AR_NAME = V_SYNC_TABLE[i][2];
                DEBUG('AR_NAME', AR_NAME)
                break;
            }
        }

        // V_BP is determined in reverse, by calculating V_BLANK first (the sum of V_FP, V_SW, and V_BP) and subtracting out V_FP and V_SW.

        var G = 8; // Cell granularity constant defined by CVT standard
        var H_RND = Math.floor(H / G) * G; // Round down horizontal resolution to be a multiple 8
        if (H_RND <= 0) { return false; }
        var V_MARGIN = Math.floor(M / 100) * V_LINES; // If margins percent (M) is 0, this result is 0
        var H_MARGIN = Math.floor(H_RND * M / 100 / G) * G; // If margins percent (M) is 0, this result is 0

        var H_PER_EST = ((1 / F) - V_PER_MIN) / (V_LINES + (2 * V_MARGIN)); // Horizontal refresh period estimate
        V_BLANK = Math.floor((V_PER_MIN / H_PER_EST) + 1);

        var V_BLANK_MIN = V_FP + V_SW + V_BP_MIN;
        if (V_BLANK < V_BLANK_MIN) { V_BLANK = V_BLANK_MIN; } // Enforce minimum value for V_blank

        V_BP = V_BLANK - (V_FP + V_SW);

        V_EFF = V_LINES + V_BLANK + V_MARGIN + I; // (S-1)/2 = 0 for progressive, 0.5 for interlaced
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
        var H_MARGIN = Math.floor(H * (M / 100)); // If margins percent (M) is 0, this result is 0

        var H_PER_EST = ((1 / F) - V_PER_MIN) / (V_LINES + (2 * V_MARGIN)); // Horizontal blanking period estimate
        V_BLANK = Math.floor((V_PER_MIN / H_PER_EST) + 1);

        var V_BLANK_MIN = V_FP_MIN + V_SW + V_BP;
        if (V_BLANK < V_BLANK_MIN) { V_BLANK = V_BLANK_MIN; } // Enforce minimum value for V_blank

        V_FP = V_BLANK - (V_BP + V_SW);

        V_EFF = V_LINES + V_BLANK + V_MARGIN + I; // (S-1)/2 = 0 for progressive, 0.5 for interlaced
        H_EFF = H + H_BLANK + H_MARGIN;
    
        // Calculate pixel clock, to enforce pixel clock rounding to the nearest 1 kHz, as required by the CVT standard
        var CLK = F * (V_EFF) * (H_EFF); // Pixel clock (Hz)
        CLK = Math.floor(CLK / 1000) * 1000; // Pixel clock (Hz) rounded down to the next multiple of 0.001 MHz (1 kHz, 1000 Hz)

        F_HOR = CLK / (H_EFF); // Horizontal refresh frequency (Hz)
        F_ACTUAL = F_HOR / (V_EFF);

        var V_SYNC_TABLE = [
            [4/3,  4, '3'],
            [16/9, 5, '9'],
            [8/5,  6, 'A'],
            [5/3,  7, '9'],
            [5/4,  7, '4'],
        ]
        var AR_NAME = '';
        for (var i = 0; i < V_SYNC_TABLE.length; i++) {
            if (Math.abs((H / V) - V_SYNC_TABLE[i][0]) < 0.05) {
                AR_NAME = V_SYNC_TABLE[i][2];
            }
        }
    }
    //DEBUG('CLK', CLK);
    //DEBUG('F_HOR', F_HOR);
    //DEBUG('F_ACTUAL', F_ACTUAL);

    //DEBUG(V_BLANK);
    return {
        'V_FP': V_FP, // For interlaced, these vertical timing are used for the odd fields
        'V_BP': V_BP,
        'V_SW': V_SW,
        'H_FP': H_FP,
        'H_BP': H_BP,
        'H_SW': H_SW,

        'V_FP_INT': V_FP + I, // For interlaced, V_FP and V_BP are 0.5 higher for even fields (V_SW is same)
        'V_BP_INT': V_BP + I,
        'V_SW_INT': V_SW,

        'V_BL': V_BLANK,
        'H_BL': H_BLANK,

        'V_EFF': V_EFF,
        'H_EFF': H_EFF,

        'F_ACTUAL': F_ACTUAL,
        'VESA_AR': AR_NAME,
    };
}


function CVT() {
    var H = Global_InputVars['HRES']; // Horizontal active pixels
    var V = Global_InputVars['VRES']; // Vertical active pixels
    var F = Global_InputVars['FREQ']; // Nominal vertical refresh frequency
    var S = Global_InputVars['SCAN']; // 1 for progressive scan, 2 for interlaced
    var M = Global_InputVars['MARGINS']; // Margins (%)

    var INTERLACE = (S - 1) / 2;

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

    // Constants
    var V_SBP_MIN = 0.00055; /* Minimum duration of vertical sync + back porch (seconds) */
    var V_BP_MIN = 6; // Minimum vertical back porch value (lines)
    var V_LINES = Math.floor(V / S) // If progressive scan, S = 1 and V_LINES = V. If interlaced, V_LINES = floor(V / 2).
    V_FP = 3; // Vertical front porch value (lines)

    var G = 8; // Cell Granularity constant
    var H_RND = Math.floor(H / G) * G;
    if (H_RND <= 0) { return false; }
    var V_MARGIN = Math.floor(M / 100 * V_LINES); // If margins percent (M) is 0, this result is 0
    var H_MARGIN = Math.floor(H_RND * M / 100 / G) * G; // If margins percent (M) is 0, this result is 0
    var H_SYNC_TARGET_WIDTH = 0.08 // Nominal horizontal sync pulse duration (percent of horizontal draw period)

    // Determine V_SW from table
    var V_SYNC_TABLE = [
            [4/3,  4, '3'],
            [16/9, 5, '9'],
            [8/5,  6, 'A'],
            [5/3,  7, '9'],
            [5/4,  7, '4'],
    ]
    var AR_NAME = '';
    V_SW = 10; // default value defined in standard
    for (var i = 0; i < V_SYNC_TABLE.length; i++) {
        if (Math.abs((H / V) - V_SYNC_TABLE[i][0]) < 0.05) { // Check if aspect ratio of image (H/V) matches an aspect ratio defined in table, within 0.05
            V_SW = V_SYNC_TABLE[i][1];
            AR_NAME = V_SYNC_TABLE[i][2];
        }
    }

    // Estimate horizontal refresh period (seconds)
    var H_EST = ((1/F) - V_SBP_MIN) / (V_LINES + (2 * V_MARGIN) + V_FP + INTERLACE)

    // Estimate vertical sync + vertical back porch (lines), subtract V_SW to get V_BP
    var V_BP = (Math.floor(V_SBP_MIN / H_EST) + 1) - V_SW;
    if (V_BP < V_BP_MIN) { V_BP = V_BP_MIN; } // Enforce minimum value for V_BP

    // Total vertical resolution including blanking and margins
    V_EFF = V_LINES + (2 * V_MARGIN) + V_FP + V_SW + V_BP + INTERLACE;

    // Horizontal blanking is determined by formula from GTF standard
    // Calculate Ideal Duty Cycle (%) from GTF formula
    var IDC = 30 - (300000 * H_EST);
    if (IDC < 20) { IDC = 20; } // Enforce minimum value for IDC
    // Calculate horizontal blanking time (to next lowest character cell)
    H_BLANK = Math.floor((H_RND + (2 * H_MARGIN)) * IDC / (100 - IDC) / (2 * G)) * (2 * G);

    // Total horizontal resolution including blanking and margins
    H_EFF = H_RND + (2 * H_MARGIN) + H_BLANK;

    // Determing horizontal timing parameters from magic formulas defined by standard
    H_BP = H_BLANK / 2;
    H_SW = Math.floor((H_SYNC_TARGET_WIDTH * H_EFF) / G) * G;
    H_FP = H_BLANK - (H_BP + H_SW);

    // Calculate Pixel Clock (Hz)
    var CLK = H_EFF / H_EST;
    CLK = Math.floor(CLK / 250000) * 250000; // Enforce pixel clock rounding to nearest 0.25 MHz (250,000 Hz)

    // Calculate Horizontal Refresh Frequency (Hz)
    F_HOR = CLK / H_EFF;

    // Calculate Vertical Refresh Frequency (Hz) after adjusting for pixel clock rounding
    F_ACTUAL = F_HOR / V_EFF;

    return {
        'V_FP': V_FP, // For interlaced, these vertical timing are used for the odd fields
        'V_BP': V_BP,
        'V_SW': V_SW,
        'H_FP': H_FP,
        'H_BP': H_BP,
        'H_SW': H_SW,

        'V_FP_INT': V_FP + INTERLACE, // For interlaced, V_FP and V_BP are 0.5 higher for even fields (V_SW is same)
        'V_BP_INT': V_BP + INTERLACE,
        'V_SW_INT': V_SW,

        'V_BL': V_BLANK,
        'H_BL': H_BLANK,

        'V_EFF': V_EFF,
        'H_EFF': H_EFF,

        'F_ACTUAL': F_ACTUAL,
        'VESA_AR': AR_NAME,
    };
}


function CTA() {
    DEBUG('Starting CTA');
    var H = Global_InputVars['HRES'];
    var V = Global_InputVars['VRES'];
    var F = Global_InputVars['FREQ'];
    var S = Global_InputVars['SCAN'];

    // No CTA formats are below these points, no need to search entire list
    if (H < 640 || V < 240 || F < 23.9) { DEBUG('Search aborted, one or more inputs is below the minimum value found in CTA.', H, V, F); return false; }

    if (S == 1) { S = 'p'; }
    else if (S == 2) { S = 'i'; }
    
    DEBUG('Input:', H, V, F, S);

    if ((   H == 720 && V == 480 && F <= 60 && S == 'i')
        || (H == 720 && V == 576 && F <= 50 && S == 'i')
        || (H == 720 && (V == 240 || V == 288)  && F <= 60)
        ) {
        Global_InputVars['HRES'] = 2 * H;
        H = 2 * H;
        DEBUG('Horizontal width H changed to', H);
    }

    var CTA_H;
    var CTA_V;
    var CTA_F;
    var CTA_S;


    for (var i = 0; i < CTA861.length; i++) {
        CTA_H = parseFloat(CTA861[i]['H']);
        CTA_V = parseFloat(CTA861[i]['V']);
        CTA_F = parseFloat(CTA861[i]['V_FREQ']);
        CTA_S = CTA861[i]['SCAN'];

        DEBUG('Parsing: VIC', CTA861[i]['VIC'], '|', CTA_H, (H == CTA_H), '|', CTA_V, (V == CTA_V), '|' , (CTA_F).toFixed(3), (Math.abs(F - CTA_F) < 0.01), '|', CTA_S, (S == CTA_S));
        
        //DEBUG( (V == CTA_V), (Math.abs(F - CTA_F) < 0.01), (S == CTA_S))
        if ((H == CTA_H) && (V == CTA_V) && (Math.abs(F - CTA_F) < (0.001 * F)) && (S == CTA_S)) {
            DEBUG('Match Found');

            // Special modifications to values based on whether interlacing is selected or not
            if (S == 'p') { S = 0; }
            else if (S == 'i') { S = 0.5; }


            return {
                'V_FP': parseFloat(CTA861[i]['V_FP']),
                'V_BP': parseFloat(CTA861[i]['V_BP']),
                'V_SW': parseFloat(CTA861[i]['V_SW']),
                'H_FP': parseFloat(CTA861[i]['H_FP']),
                'H_BP': parseFloat(CTA861[i]['H_BP']),
                'H_SW': parseFloat(CTA861[i]['H_SW']),

                'V_FP_INT': parseFloat(CTA861[i]['V_FP']) + S,
                'V_BP_INT': parseFloat(CTA861[i]['V_BP']) + S,
                'V_SW_INT': parseFloat(CTA861[i]['V_SW']),

                'V_BL': parseFloat(CTA861[i]['V_BLANK']) - S,
                'H_BL': parseFloat(CTA861[i]['H_BLANK']),

                'V_EFF': parseFloat(CTA861[i]['V_EFF']) * (1 - S),
                'H_EFF': parseFloat(CTA861[i]['H_EFF']),

                'F_ACTUAL': parseFloat(CTA861[i]['V_FREQ']),
                'VIC': parseFloat(CTA861[i]['VIC']),
                'CTA_REV': CTA861[i]['CTA'],
            }
        }
    }

    // Not found in CTA list
    

    return false;
}


function GTF() {
    // Input Variables

    var V_FREQ_NOM = Global_InputVars['FREQ'];
    var H = Global_InputVars['HRES'];
    var V = Global_InputVars['VRES'];
    var S = Global_InputVars['SCAN'];
    var MARGINS = Global_InputVars['MARGINS'];

    // Constants

    var V_SW = 3; // Vertical sync pulse width (lines)
    var V_FP = 1; // Vertical front porch (lines)
    var V_MIN = 0.00055; // Min V_Blank period (seconds)
    var G = 8; // Cell granularity (pixels)
    var H_SYNC_WIDTH_TARGET = 0.08; // Nominal horizontal sync pulse duration (percent of horizontal draw period)
    var INTERLACE = (S - 1) / 2; // 0 for progressive, 0.5 for interlaced

    // var m = 600 // Gradient (%/kHz)
    // var c = 40 // offset (%)
    // var k = 128 // blanking time scaling factor
    // var j = 20 // scaling factor weighting

    var M = 300 // m * (k / 256); // "M prime"
    var C = 30 // (((c - j) * k) / 256) + j; // "C prime"

    // Result Variables

    var V_BP;
    var H_FP;
    var H_SW;
    var H_BP;

    var H_EFF
    var V_EFF;
    var V_BLANK;
    var H_BLANK;

    // Calculations

    var V_LINES = Math.round(V / S);
    var V_MARGIN = Math.round((MARGINS / 100) * V_LINES);

    var H_EST = ((1 / V_FREQ_NOM) - V_MIN) / (V_LINES + (2 * V_MARGIN) + V_FP + INTERLACE); // Horizontal refresh period estimate (seconds)

        V_BP = Math.round(V_MIN / H_EST) - V_SW;
        V_BLANK = V_FP + V_SW + V_BP;
        V_EFF = V_LINES + V_BLANK + (2 * V_MARGIN) + INTERLACE; // Total lines
    //var V_FREQ_EST = 1 / (H_EST * V_EFF); // Hz
    //var H_PER = (H_EST * V_FREQ_EST) / V_FREQ_NOM 

    var H_PER = 1 / (V_EFF * V_FREQ_NOM); // Actual horizontal refresh period (seconds)
    //var V_FREQ_ACT = 1 / (H_PER * V_EFF); // Hz
    var IDC = C - (M * H_PER * 1000);
    DEBUG('IDC:', IDC);

    var H_MARGIN = Math.round((H * (MARGINS / 100)) / G) * G;
        H_BLANK = Math.round((((H + (2 * H_MARGIN)) * IDC)/(100 - IDC)) / (2 * G)) * (2 * G);
        H_EFF = (H + H_BLANK + (2 * H_MARGIN));

        H_SW = Math.round((H_EFF * H_SYNC_WIDTH_TARGET) / G) * G;
        H_BP = (H_BLANK / 2);
        H_FP = H_BP - H_SW;

    //var CLK = H_EFF / H_PER;
    //var H_FREQ = 1 / H_PER;


    return {
        'V_FP': V_FP,
        'V_BP': V_BP,
        'V_SW': V_SW,
        'H_FP': H_FP,
        'H_BP': H_BP,
        'H_SW': H_SW,

        'V_FP_INT': V_FP + INTERLACE,
        'V_BP_INT': V_BP + INTERLACE,
        'V_SW_INT': V_SW,

        'H_BLANK': H_BLANK,
        'V_BLANK': V_BLANK,
        'H_EFF': H_EFF,
        'V_EFF': V_EFF,

        'F_ACTUAL': V_FREQ_NOM,
    };
}


function DMT() {
    DEBUG('Starting DMT Search');
    var H = Global_InputVars['HRES'];
    var V = Global_InputVars['VRES'];
    var F = Global_InputVars['FREQ'];
    var S = Global_InputVars['SCAN'];

    // No DMT formats are below these points, no need to search entire list
    if (H < 640 || V < 350 || F < 43) { DEBUG('Search aborted, one or more inputs is below the minimum value found in DMT.', H, V, F); return false; }

    if (S == 1) { S = 'p'; }
    else if (S == 2) { S = 'i'; }
    
    DEBUG('Input:', H, V, F, S);

    var DMT_H;
    var DMT_V;
    var DMT_F;
    var DMT_S;

    for (var i = 0; i < DMT_List.length; i++) {
        DMT_H = parseFloat(DMT_List[i]['H']);
        DMT_V = parseFloat(DMT_List[i]['V']);
        DMT_F = parseFloat(DMT_List[i]['NOM_FREQ']);
        DMT_F_ACTUAL = parseFloat(DMT_List[i]['V_FREQ'])
        DMT_S = DMT_List[i]['SCAN'];

        DEBUG('Parsing: DMT ID', DMT_List[i]['ID'], '|', DMT_H, (H == DMT_H), '|', DMT_V, (V == DMT_V), '|' , (DMT_F).toFixed(3), (Math.abs(F - DMT_F) < 0.01), '|', DMT_S, (S == DMT_S));
        
        //DEBUG( (V == DMT_V), (Math.abs(F - DMT_F) < 0.01), (S == DMT_S))
        if ((H == DMT_H) && (V == DMT_V) && ((F == DMT_F) || (Math.abs(F - DMT_F_ACTUAL) < 0.01)) && (S == DMT_S)) {
            DEBUG('Match Found');

            // Special modifications to values based on whether interlacing is selected or not
            if (S == 'p') { S = 0; }
            else if (S == 'i') { S = 0.5; }

            var Timing;

            if (DMT_List[i]['STD'] == 'CVT') {
                Timing = CVT();
                Timing['ID'] = DMT_List[i]['ID'];
            }
            else if (DMT_List[i]['STD'] == 'CVTRB') {
                Timing = CVT_R(1);
                Timing['ID'] = DMT_List[i]['ID'];
            }
            else if (DMT_List[i]['STD'] == 'CVTR2') {
                Timing = CVT_R(2);
                Timing['ID'] = DMT_List[i]['ID'];
            }
            else if (DMT_List[i]['STD'] == 'CTA') {
                Timing = CTA();
                Timing['ID'] = DMT_List[i]['ID'];
            }
            else {
                Timing = {
                    'V_FP': parseFloat(DMT_List[i]['V_FP']),
                    'V_BP': parseFloat(DMT_List[i]['V_BP']),
                    'V_SW': parseFloat(DMT_List[i]['V_SW']),
                    'H_FP': parseFloat(DMT_List[i]['H_FP']),
                    'H_BP': parseFloat(DMT_List[i]['H_BP']),
                    'H_SW': parseFloat(DMT_List[i]['H_SW']),

                    'V_FP_INT': parseFloat(DMT_List[i]['V_FP']) + S,
                    'V_BP_INT': parseFloat(DMT_List[i]['V_BP']) + S,
                    'V_SW_INT': parseFloat(DMT_List[i]['V_SW']),

                    'V_BL': parseFloat(DMT_List[i]['V_BLANK']) - S,
                    'H_BL': parseFloat(DMT_List[i]['H_BLANK']),

                    'V_EFF': parseFloat(DMT_List[i]['V_EFF']) * (1 - S),
                    'H_EFF': parseFloat(DMT_List[i]['H_EFF']),

                    'F_ACTUAL': parseFloat(DMT_List[i]['V_FREQ']),
                    'ID': parseFloat(DMT_List[i]['ID']),
                }
            }
            return Timing;
        }
    }
    // Not found in DMT list
    return false;
}


function updateDisplay(mode) {
    var clear = 'clear'
    var cells;
    var id;

    id_list = [
        'data_rate', '8b10b', '16b18b', '128b132b', 'pixel_rate', 'pixel_rate_active',
        'bpc', 'bpp', 'palette',

        'v_freq', 'v_freq_actual', 'v_freq_dev', 'v_freq_dev_perc',
        'v_per', 'v_per_actual', 'v_per_dev', 'v_per_dev_perc',

        'h_freq', 'h_per',

        'v_field', 'v_field_actual', 'v_field_dev', 'v_field_dev_perc',
        'v_field_per', 'v_field_per_actual', 'v_field_per_dev', 'v_field_per_dev_perc',
        'v_frame', 'v_frame_actual', 'v_frame_dev', 'v_frame_dev_perc',
        'v_frame_per', 'v_frame_per_actual', 'v_frame_per_dev', 'v_frame_per_dev_perc',
    ];
    for (var x = 0; x < id_list.length; x++) {
        id = id_list[x];
        cells = $('#results_' + id).children();
        if (mode != clear) {
            DEBUG('Detailed Results:', Detailed_Results[id]);
            DEBUG('Cells:', cells)
            cells[1].innerHTML = Detailed_Results[id]['val'];
            cells[2].innerHTML = Detailed_Results[id]['unit'];
        } else {
            cells[1].innerHTML = '';
            cells[2].innerHTML = '';

        }
    }

    id_list = ['active_px', 'blank_px', 'total_px', 'overhead_px'];
    for (var x = 0; x < id_list.length; x++) {
        id = id_list[x];
        cells = $('#results_' + id).children();
        if (mode != clear) {
            DEBUG('Detailed Results:', Detailed_Results[id]);
            DEBUG('Cells:', cells)
            cells[1].innerHTML = Detailed_Results[id]['h']['val'];
            cells[2].innerHTML = Detailed_Results[id]['v']['val'];
            cells[3].innerHTML = Detailed_Results[id]['t']['val'];
            cells[4].innerHTML = Detailed_Results[id]['t']['unit'];
        } else {
            cells[1].innerHTML = '';
            cells[2].innerHTML = '';
            cells[3].innerHTML = '';
            cells[4].innerHTML = '';
        }
    
    }

    id_list = ['px_format', 'scan'];
    for (var x = 0; x < id_list.length; x++) {
        id = id_list[x];
        cells = $('#results_' + id).children();
        if (mode != clear) {
            DEBUG('Detailed Results:', Detailed_Results[id]);
            DEBUG('Cells:', cells)
            cells[1].innerHTML = Detailed_Results[id]
        } else {
            cells[1].innerHTML = '';
        }
    }

    return;
}


function clearResults() {
    updateDisplay('clear');
    if ($('#TIMING_DROP').val() != 'Custom') {
        clearTiming();
    }
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
        $('#V_FP_INT'),
        $('#V_BP_INT'),
        $('#V_SW_INT'),
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
        $('#V_BLANK_INT_LABEL').css('display', 'table-cell');
        $('#V_FP_INT_CONTAINER').css('display', 'table-cell');
        $('#V_BP_INT_CONTAINER').css('display', 'table-cell');
        $('#V_SW_INT_CONTAINER').css('display', 'table-cell');
        $('#V_BLANK_INT_CONTAINER').css('display', 'table-cell');
        $('#V_BLANK_EVEN_LABEL').html('(Even)&nbsp;V<sub>blank</sub>');
        $('#results_v_progressive').css('display', 'none');
        $('#results_v_interlaced').css('display', 'table');
    }
    else if (value == 'p') {
        $('#V_BLANK_INT_LABEL').css('display', 'none');
        $('#V_FP_INT_CONTAINER').css('display', 'none');
        $('#V_BP_INT_CONTAINER').css('display', 'none');
        $('#V_SW_INT_CONTAINER').css('display', 'none');
        $('#V_BLANK_INT_CONTAINER').css('display', 'none');
        $('#V_BLANK_EVEN_LABEL').html('V<sub>blank</sub>');
        $('#results_v_progressive').css('display', 'table');
        $('#results_v_interlaced').css('display', 'none');
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


function LoadCTA861(){
    // Loads the timing definitions for the CTA-861 standard from a txt file
    //DEBUG('CTA Test 11');
    var request = new XMLHttpRequest();
    request.open('GET', 'CTA861.txt', true);
    request.send(null);
    request.onreadystatechange = function () {
        DEBUG('request.status:', request.status)
        if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
            CTA861 = $.csv.toObjects(request.responseText);
            //DEBUG(CTA861);
        }
    }
    DEBUG('Finished');
}


function LoadDMT(){
    // Loads the timing definitions for the DMT standard from a txt file
    DEBUG('DMT Test 1');
    var request = new XMLHttpRequest();
    request.open('GET', 'DMT.txt', true);
    request.send(null);
    request.onreadystatechange = function () {
        DEBUG('request.status:', request.status)
        if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
            DMT_List = $.csv.toObjects(request.responseText);
            //DEBUG(CTA861);
        }
    }
    DEBUG('Finished');
}


// LaTeX

function MathCommas(num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\\:");
    return parts.join(".");
}

function generateLaTeX() {
    DEBUG('Generating LaTeX...');
    var result;
    var H = Global_InputVars['HRES'];
    var H_FP = Global_InputVars['H_FP'];
    var H_SW = Global_InputVars['H_SW'];
    var H_BP = Global_InputVars['H_BP'];

    var V = Global_InputVars['VRES'];
    var V_FP = Global_InputVars['V_FP'];
    var V_SW = Global_InputVars['V_SW'];
    var V_BP = Global_InputVars['V_BP'];

    var F = Global_InputVars['FREQ'];
    var F_ACTUAL = Global_InputVars['F_ACTUAL'];
    
    var CD = Global_InputVars['COLOR DEPTH'];

    // Total Pixels

    result = SI(H * V, 'px', {'output': 'split'});
    DEBUG('Total pixels SI result:', result);
    $('#Math_TotalPixels').html(
        '$$' + MathCommas(H) + '\\times' + MathCommas(V) + '= \\boxed{\\vphantom{^0_0}\\,' + MathCommas(H * V) + '~\\mathrm{px}\\ (' + result['v'] + '~\\mathrm{' + result['u'] + '}' + ')\\,}' + '$$'
    );

    // Total Pixels with Blanking
    result = SI((H + H_FP + H_SW + H_BP) * (V + V_FP + V_SW + V_BP), 'px', {'output':'split'});
    DEBUG('Pixels with blanking SI result:', result);
    $('#Math_EffectiveTotalPixels').html(
        '$$' + 'H_{\\rm blank} = H_{\\rm front~porch} + H_{\\rm sync~width} + H_{\\rm back~porch} = {\\rm' +
        MathCommas(H_FP) + '~px +' + MathCommas(H_SW) + '~px +' + MathCommas(H_BP) + '~px} = \\box{\\rm' + MathCommas(H_FP + H_SW + H_BP) + '~px } \\\\' +
        'V_{\\rm blank} = V_{\\rm front~porch} + V_{\\rm sync~width} + V_{\\rm back~porch} = {\\rm' + 
        MathCommas(V_FP) + '~px +' + MathCommas(V_SW) + '~px +' + MathCommas(V_BP) + '~px} = \\box{\\rm' + MathCommas(V_FP + V_SW + V_BP) + '~px } \\\\' + '$$'
        
        + '$$' + '(H + H_{\\rm blank}) \\times (V + V_{\\rm blank}) = \\rm (' + MathCommas(H) + '+' + MathCommas(H_FP + H_SW + H_BP) + ') \\times (' + MathCommas(V) + '+' + MathCommas(V_FP + V_SW + V_BP) + ')' +
        '= \\boxed{\\vphantom{^0_0}\\,' + MathCommas(result['o']) + '~\\mathrm{' + result['b'] + '}\\ (' + result['v'] + '~\\mathrm{' + result['u'] + '}) \\,}' + '$$'
    );
    

    MathJax.Hub.Typeset();
}

// Small functions
{
function Commas(num, commaChar) {
    if (commaChar === undefined) {
        commaChar = ',';
    }
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, commaChar);
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


function long_division(A, B, options) {
    if (isNaN(A / B) || !isFinite(A / B)) { DEBUG('Answer is NaN or Infinity. Function aborted.'); return ''; }

    var OL_open = '<span style="text-decoration:overline;">'; // Overline markup opening tag
    var OL_close = '</span>'; // Overline markup closing tag. Used in conjunction with OL_open to surround the repeating numbers. May be set to control markup, separate it with parentheses, or simply left blank, etc.
    var p_max = 8; // Maximum number of decimal places
    var p_min = 3; // Minimum number of decimal places
    var Approx = '≈'; // Symbol to be used for "approximately equal to". Can be set to '~' or blank if desired, etc.
    var Radix_Point = '.';  // Character to use for the radix point ("decimal point")
    var Base = 10; // Number base system to use
    var Minus_Sign = '&minus;'; // Character to preceed negative numbers
    var Plus_Sign = ''; // Character to preceed positive numbers
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
        if ('approx' in options) { Approx = options['approx']; }
        if ('minus' in options) { Minus_Sign = options['minus']; }
        if ('plus' in options) { Plus_Sign = options['plus']; }
        if ('base' in options) { Base = options['base']; }
        if ('repeat_singles' in options) { RepeatSinglesFlag = options['repeat_singles']; }
    }

    p_max = parseInt(p_max);
    p_min = parseInt(p_min);
    Base = parseInt(Base);
    if (p_max < 0 || p_min < 0 || p_max < p_min || isNaN(p_max) || isNaN(p_min) || !isFinite(p_max) || !isFinite(p_min)) {
        DEBUG('Invalid p_max and p_min values. Both values must be non-negative numbers, and p_min cannot be greater than p_max. p_max:', p_max, 'p_min', p_min)
        return '';
    }
    if (isNaN(Base)) {
        DEBUG('Invalid Base value. Must be an integer number. Base:', Base);
        return '';
    }
    if (p_max == 0) {
        var Result = Math.round(A / B).toFixed(0);
        if (Result != (A / B)) { Result = '≈'.concat(Result); }
        return Result;
    }
    
    var Max_Depth = 32; // Depth of internal calculations, regardless of p_max or p_min settings
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
        if (Decimal_Digits.length < p_min) {
            if (p_min - Decimal_Digits.length >= 0) {
                Decimal_Digits += '0'.repeat(p_min - Decimal_Digits.length);
            }
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

    Result = Sign.concat(Result);

    if (ApproxFlag == true) {
        Result = Approx.concat(Result);
    }

    if (Result[Result.length - 1] == Radix_Point) { Result = Result.replace(Radix_Point, ''); }
    return Result;

    //return Result * Sign;
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
    // This function is designed to interpret strings with formatted numbers (which may contain currency symbols, digit grouping commas, units of measurement, etc.)
    // It will return NaN if it cannot be interpreted as a valid number (i.e. no numeric characters, multiple periods or minus signs, etc.)

    if (typeof(val) === 'number') {
        // If the input argument is already a number, then nothing needs to be done, simply return the input value
        if (Number.isNaN(val) == true) {
            // However, we do need to check that it isn't NaN, because NaN is identified as a 'number' type.
            return NaN;
        }
        else {
            return val;
        }
    }

    else if (typeof val === 'string') {
        // If the input argument is a string, then the parsing process begins

        // Empty string is interpreted as 0
        if (val == '') { return 0; }

        // First, remove all non-numeric characters on the outsides of the string (with exceptions for minus signs or other numerically-meaningful characters)
        for (var i = 0; i < val.length; i++) {
            // Loop through each character starting from the front
            if (!(i < val.length)) { break; }
            if ((/[^0-9.-]/g).test(val[i]) == true) {
                // If character is not a number, period, or minus sign, remove it
                if (i == 0 && val.length > 1) { val = val.slice(1); }
                else if (i == val.length - 1) { return NaN; } // If this is the last character in the string, then there are no digits in the string; return NaN
                else if (i > 0) { val = (val.slice(0, i)) + (val.slice(i+1));}
                i = i - 1; // Since a character has been removed, the next character is now at the same index, so the loop counter must be adjusted to compensate
                continue;
            }
            else if ((/[-]/g).test(val[i]) == true) {
                // If character is a minus sign, continue searching without deleting it. The search continues because there may still be non-number characters between the negative sign and the first digit, such as "-$1.00". The negative sign should stay but the dollar needs to be removed.
                continue;
            }
            else if ((/[.]/g).test(val[i]) == true) {
                // If character is a period, then following character MUST be a digit, unless it's the end of the number. Otherwise the input is not a valid number.
                if (i + 1 < val.length) {
                    if ((/[0-9]/g).test(val[i+1]) == true) {
                        // If the character after the period is a digit, then the "number" part of the number has definitely been reached and the code can proceed with the next section.
                        break;
                    }
                    else {
                        // If the string contained a period followed by a non-numeric character, it cannot be interpreted as a valid number. Return NaN.
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

        // Now do a similar procedure starting from the backside, to strip any trailing characters (such as units of measurement)
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
            || val.indexOf('.') != val.lastIndexOf('.') // string contains multiple periods
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
    DEBUG('On Page Show function executing...')
    generate_table('Interface Support', -1);
    LoadCTA861();
    LoadDMT();
    
    /*
    DEBUG('Initializing HRES')
    $('#INPUT_HRES')[0].onchange();
    DEBUG('Initializing VRES')
    $('#INPUT_VRES')[0].onchange();
    DEBUG('Initializing FREQ')
    $('#INPUT_F')[0].onchange();
    DEBUG('Initializing COLOR DEPTH')
    $('#COLOR_DEPTH_FORM')[0].onchange();
    DEBUG('Initializing PIXEL FORMAT')
    $('#PIXEL_FORMAT_FORM')[0].onchange();
    DEBUG('Initializing COMPRESSION')
    $('#COMPRESSION_FORM')[0].onchange();
    DEBUG('Initializing SCAN')
    $('#SCAN_FORM')[0].onchange();
    DEBUG('Initializing MARGINS')
    $('#MARGINS_FORM')[0].onchange();
    DEBUG('Initializing TIMING STANDARD')
    $('#TIMING_DROP')[0].onchange();
    
    $('#V_FP')[0].onchange();
    $('#V_BP')[0].onchange();
    $('#V_SW')[0].onchange();
    $('#H_FP')[0].onchange();
    $('#H_BP')[0].onchange();
    $('#H_SW')[0].onchange();
    $('#V_FP_INT')[0].onchange();
    $('#V_BP_INT')[0].onchange();
    $('#V_SW_INT')[0].onchange();
*/
    calcMain();
}

window.onload = function() {
    
    DEBUG('Initializing HRES')
    $('#INPUT_HRES')[0].onchange();
    DEBUG('Initializing VRES')
    $('#INPUT_VRES')[0].onchange();
    DEBUG('Initializing FREQ')
    $('#INPUT_F')[0].onchange();
    DEBUG('Initializing COLOR DEPTH')
    $('#COLOR_DEPTH_FORM')[0].onchange();
    DEBUG('Initializing PIXEL FORMAT')
    $('#PIXEL_FORMAT_FORM')[0].onchange();
    DEBUG('Initializing COMPRESSION')
    $('#COMPRESSION_FORM')[0].onchange();
    DEBUG('Initializing SCAN')
    $('#SCAN_FORM')[0].onchange();
    DEBUG('Initializing MARGINS')
    $('#MARGINS_FORM')[0].onchange();
    DEBUG('Initializing TIMING STANDARD')
    $('#TIMING_DROP')[0].onchange();
    
    $('#V_FP')[0].onchange();
    $('#V_BP')[0].onchange();
    $('#V_SW')[0].onchange();
    $('#H_FP')[0].onchange();
    $('#H_BP')[0].onchange();
    $('#H_SW')[0].onchange();
    $('#V_FP_INT')[0].onchange();
    $('#V_BP_INT')[0].onchange();
    $('#V_SW_INT')[0].onchange();
    
    calcMain();
}