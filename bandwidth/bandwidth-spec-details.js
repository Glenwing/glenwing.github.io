/* Detailed descriptions for specifications */
/*
$('#results_container > table > tr').each(function() {
    //this.classList.remove('selected');
    this.on('click', selectRow(this[0].id));
})*/

var results_selectedRow = '';

function selectRow(row) {
    previousRow = results_selectedRow || '';
    if (previousRow != '') { deselectRow(); }
    if (previousRow != row) {
        row.classList.add('selected');
        results_selectedRow = row;
        $('#results_explanation').html(Detailed_Explanation[row.id]);
    }
}

function deselectRow() {
    results_selectedRow = results_selectedRow || '';
    if (results_selectedRow != '') {
        results_selectedRow.classList.remove('selected');
        results_selectedRow = '';
    }
}

document.addEventListener('click', function(event) {
    if (!(document.getElementById('results_container').contains(event.target))) { deselectRow(); }
});
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) { deselectRow(); $('#results_explanation').html('Click specifications for details'); }
});

var Detailed_Explanation = {
    'results_data_transmission':
        '',

    'results_data_rate':
        'The <b>data rate</b> is the amount of data per second sent across the video interface, generally represented in bits per second.<br><br>'+
        'Data rate for uncompressed RGB video is calculated as:' +
        '<div class="inline_math">(bits per pixel)&nbsp;&times;&nbsp;(pixels per frame)&nbsp;&times;&nbsp;(frames per second)</div>where,' +
        '<ul><li><b>Bits per pixel</b> is 3 times the color depth per channel or per component</li>' +
        '<li><b>Pixels per frame</b> is the effective number of total pixels (horizontal resolution times vertical resolution), including both active and blank pixels</li>' +
        '<li><b>Frames per second</b> is the vertical refresh frequency (for progressive scan) or half the vertical field rate (for interlaced scan)</li></ul>' +
        'The data rate for YC<sub>B</sub>C<sub>R</sub> 4:4:4 video is the same as RGB. ' +
        'For YC<sub>B</sub>C<sub>R</sub> 4:2:2 video, the data rate is divided by 1.5. For YC<sub>B</sub>C<sub>R</sub> 4:2:0 the data rate is divided by 2.<br><br>' +
        'The total <b>bandwidth</b> required for video transmission is larger than the data rate, due to additional overhead involved with transmission.',

    'results_bit_rate':
        'The <b>bandwidth</b> is the number of physical bits per second transmitted across the video interface, generally represented in bits per second.<br><br>' +
        'The bandwidth required for video transmission is larger than the data rate. In addition to the bits required to represent the data payload, there is also additional overhead (extra bits beyond just the raw data ' +
        'which must be signaled across the interface.',

    'results_8b10b':
        'The 8b/10b encoding scheme requires 10 bits of bandwidth to represent 8 bits of data. Therefore, the bandwidth required to send data ' +
        'at a certain rate is 125% of the desired data rate.',

    'results_16b18b':
        'The 16b/18b encoding scheme requires 18 bits of bandwidth to represent 16 bits of data. Therefore, the bandwidth required to send data ' +
        'at a certain rate is 112.5% of the desired data rate.',

    'results_char_rate':
        'The <b>character rate</b> is a value associated with HDMI and DVI. It is the number of TMDS characters transmitted across the interface per channel per second.<br><br>' +
        'A "TMDS character" is a group of 10 bits (8 bits of data, 2 bits for DC balancing). Therefore, the character rate is an alternate way of expressing total bandwidth or data rate. ' +
        'HDMI has 3 channels, so the data rate (in Mbit/s) is equal to the character rate (in MHz) times 24 bits (or 3 × 8 bits).<br><br>' +
        'DVI and HDMI 1.0–1.2 only supported 8&nbsp;bpc RGB color*. In this system, each pixel is represented by 24 bits of data, ' +
        'so the TMDS character rate also happens to be equal to the number of pixels per second. ' +
        'For this reason, the term "pixel clock" is often used to refer to the character rate. However, they are only the same value in certain cases. ' +
        'is often informally referred to as the "Pixel Clock". However, this relationship is only true ' +
        'when using 8&nbsp;bpc color depth. actual pixel clock may be a different value when not using 8&nbsp;bpc color depth.<br><br>' +
        'In HDMI, the character rate is the number of TMDS characters transmitted across a single data channel per second. This is sometimes informally referred to as the "TMDS clock" or "Pixel Clock", because these values were all equal in older versions of HDMI. ' +
        'However, this is no longer the case.<br><br>A TMDS character is a group of 10 bits. 8 of the bits represent data, and the remaining 2 bits are used for DC balancing. HDMI versions 1.0–1.4 have three data channels, and transmit one TMDS character per TMDS clock cycle on each channel. ' +
        'This results in a total of 30 bits (24 bits of data) transmitted per TMDS clock cycle.<br><br>With standard 8&nbsp;bpc (24&nbsp;bit/px) color depth, this is exactly one pixel of data. Thus, the TMDS clock rate, character rate, and pixel clock all have the same value. ' +
        'With the introduction of Deep Color (30&nbsp;bit/px, 36&nbsp;bit/px, and 48&nbsp;bit/px color depth) in HDMI&nbsp;1.3, this is no longer the case, and the actual pixel clock will be lower than the character rate and TMDS clock rate.<br><br>' +
        'In addition, the HDMI&nbsp;2.0 specifies that character rates above 340&nbsp;MHz will use a lower TMDS clock frequency and transmit 4 TMDS characters per clock cycle per channel instead of one. In these cases, the character rate is no longer equal to the TMDS clock.<br><br>' +
        'HDMI 1.0–1.2 support a maximum character rate of 165&nbsp;MHz<br>' +
        'HDMI 1.3–1.4 support a maximum character rate of 340&nbsp;MHz<br>' +
        'HDMI 2.0 supports a maximum character rate of 600&nbsp;MHz<br>' +
        'HDMI 2.1 uses a much different system with 4 data channels, and 16 bits of data per 18 bits transmitted',

    'results_pixel_rate':
        '',

    'results_pixel_rate_active':
        '',

    'results_resolution':
        '',

    'results_active_px':
        '',

    'results_blank_px':
        '',

    'results_total_px':
        '',

    'results_overhead_px':
        '',

    'results_format':
        '',

    'results_bpc':
        '',

    'results_bpp':
        '',

    'results_palette':
        '',

    'results_px_format':
        '',

    'results_scan':
        '',

    'results_v_refresh':
        '',

    'results_v_freq':
        '',

    'results_v_freq_actual':
        '',

    'results_v_freq_dev':
        '',

    'results_v_freq_dev_perc':
        '',

    'results_v_per':
        '',

    'results_v_per_actual':
        '',

    'results_v_per_dev':
        '',

    'results_v_per_dev_perc':
        '',

    'results_v_refresh_int':
        '',

    'results_v_field':
        '',

    'results_v_field_dev':
        '',

    'results_v_field_dev_perc':
        '',

    'results_v_framerate':
        '',

    'results_v_framerate_actual':
        '',

    'results_v_framerate_dev':
        '',

    'results_v_framerate_dev_perc':
        '',

    'results_v_field_per':
        '',

    'results_v_field_per_actual':
        '',

    'results_v_field_per_dev':
        '',

    'results_v_field_per_dev_perc':
        '',

    'results_h_refresh':
        '',

    'results_h_freq':
        '',

    'results_h_per':
        '',

}

