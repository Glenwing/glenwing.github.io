// Returns true if input is an integer, false if input is a non-integer number or NaN
function isInt(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == false) {
                return false;
            }
        }
        return true;
    }
    else
        return Number.isInteger(parseNum(num));
}

// Returns true if input is a number with a decimal point in it, false otherwise (integer inputs or NaN)
function isFloat(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isInteger(parseNum(num[a])) == true || Number.isNaN(num[a]) == true) {
                return false;
            }
        }
        return true;
    }
    else
        return !(Number.isInteger(parseNum(num)) || Number.isNaN(parseNum(num)));
}


// Returns true if input is a number >= 1, false otherwise (numbers between 0 and 1, zero, negative number, or NaN)
function isGTEOne(num) {
    if (Array.isArray(num) == true) {
        for (a = 0; a < num.length; a++) {
            if (Number.isNaN(parseNum(num[a])) == true)
                return false;
            else if (num[a] < 1)
                return false;
        }
        return true;
    }
    else {
        if (Number.isNaN(parseNum(num)) == true)
            return false;
        else if (num >= 1)
            return true;
        else {
            return false;
        }
    }
}


// Returns true if input is a number > 0, false otherwise (zero, negative number, or NaN)
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

// Returns true if input is a number >= 0, false otherwise (negative number or NaN)
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
            if (Number.isNaN(parseNum(num[a])) == true) { return false; }
            else { continue; }
        }
        return true;
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

function a_or_an(num) {
    if (isNum(num) === false) {
        return NaN;
    }

    num = parseNum(num);

    numstr = num.toString();
    intdigits = numstr.length;
    if (isFloat(num) == true) {
        intdigits = Math.floor(num).toString().length;
    }

    if (intdigits == 1) {
        if (num == 8) {
            return 'an';
        }
    }
    else if (numstr.substring(0, 1) == '8' || ((numstr.substring(0, 2) == '11' || numstr.substring(0, 2) == '18') && (intdigits == 4 || intdigits % 3 == 2))) {
        return 'an';
    }

    return 'a';
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

function activateMatchmaker() {
    $('#matchmaker_button').css('display', 'none');
    $('#eq_height_section').css('display', 'flex');

    $('#selectArea').css('display', 'none');
    $('#selectTotalPx').css('display', 'none');
    $('#selectPxPitch').css('display', 'none');

    $('#Sidebar_DDC').removeClass('selected');
    $('#Sidebar_DDC').attr('onclick', 'deactivateMatchmaker();');

    $('#Sidebar_Matchmaker').addClass('selected');
    $('#Sidebar_Matchmaker').attr('onclick', '');

    update();
}

function deactivateMatchmaker() {
    $('#matchmaker_button').css('display', 'flex');
    $('#eq_height_section').css('display', 'none');

    $('#selectArea').css('display', 'table-row');
    $('#selectTotalPx').css('display', 'table-row');
    $('#selectPxPitch').css('display', 'table-row');

    $('#Sidebar_Matchmaker').removeClass('selected');
    $('#Sidebar_Matchmaker').attr('onclick', 'activateMatchmaker();');

    $('#Sidebar_DDC').addClass('selected');
    $('#Sidebar_DDC').attr('onclick', '');

    update();
}

window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.onload = function () {
    var directoryName = localStorage.getItem('directoryName');
    var queryString = localStorage.getItem('queryString');
    if (directoryName === null) { directoryName = 'ddc'; }
    if (queryString === null) { queryString = ''; }
    var pathName = window.location.pathname.replace('frame.html', directoryName);
    history.replaceState(null, '', pathName + queryString);
    $('#MainWindow').load(pathName + '/' + directoryName + '.html');
};