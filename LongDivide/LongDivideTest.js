LongDivide.Test = function () {
    var Test = LongDivide.TestCase;
    var Err = 'Error';
    // Basic arithmetic tests
    var Case = [
        [0, 1, '0'],
        [1, 0, Err],
        [1, 1, '1'],
        [1, 2, '0.5'],
        [2, 1, '2'],
        [8, 5, '1.6'],
        [-2, 1, '\u22122'],
        [2, -1, '\u22122'],
        [-2, -1, '2'],
        [4, 3, '1.<span style="text-decoration:overline;">33</span>'], // Single-digit repeating pattern
        [64, 27, '2.<span style="text-decoration:overline;">370</span>'], // Multi-digit repeating pattern
        [43, 18, '2.3<span style="text-decoration:overline;">88</span>'], // Single-digit repeating pattern with prefix
        [256, 135, '1.8<span style="text-decoration:overline;">962</span>'], // Multi-digit repeating pattern with prefix
        // Precision argument testing
        [8, 5, '\u22482', 0], // Tests ability to bump integer portion when p_max is 0 (shortcut division is used)
        [8, 5, '1.6', 1],
        [8, 5, '1.60', 2],
        [199, 100, '\u22482.0', 1], // Tests ability to bump integer portion when p_max is > 0 (full division algorithm used)
        [4, 3, '\u22481', 0],
        [4, 3, '1.<span style="text-decoration:overline;">3</span>', 1],
        [4, 3, '1.<span style="text-decoration:overline;">33</span>', 2],
        [4, 3, '1.<span style="text-decoration:overline;">333</span>', 3],
        [16, 9, '\u22482', 0],
        [16, 9, '1.<span style="text-decoration:overline;">7</span>', 1],
        [16, 9, '1.<span style="text-decoration:overline;">77</span>', 2],
        [16, 9, '1.<span style="text-decoration:overline;">777</span>', 3],
        [64, 27, '\u22482.37', 2],
        [64, 27, '2.<span style="text-decoration:overline;">370</span>', 3],
        [64, 27, '2.3<span style="text-decoration:overline;">703</span>', 4], // Test repeating pattern cycling
        [64, 27, '2.37<span style="text-decoration:overline;">037</span>', 5],
        [64, 27, '2.<span style="text-decoration:overline;">370370</span>', 6], // Test repeating pattern duplicating
        [256, 135, '\u22481.90', 2], // Test repeating pattern cycling with prefix
        [256, 135, '1.8<span style="text-decoration:overline;">962</span>', 4], // Test repeating pattern with prefix
        [256, 135, '1.89<span style="text-decoration:overline;">629</span>', 5], // Test repeating pattern cycling with prefix
        [6000, 1001, '\u22485.994006', 6], // Test up-rounding repeating pattern
        [6000, 1001, '\u22486.0', 1], // Test up-rounding repeating pattern that bumps integer portion
        [2.56, 1.35, '1.8<span style="text-decoration:overline;">962</span>', 4], // Test float inputs with repeating pattern and prefix
        [6, 1.001, '5.<span style="text-decoration:overline;">994005</span>', 6], // Test float inputs with repeating pattern
        [6, 1.001, '\u22486.0', 1], // Test float inputs with up-rounding repeating pattern that bumps integer portion
        // Format string testing
        [8, 5, '\u22482', ''], // Blank format string
        [8, 5, '\u22482', '0'], // Blank format string
        [8, 5, '1.60', 2],
        [199, 100, '\u22482.0', 1], // Tests ability to bump integer portion when p_max is > 0 (full division algorithm used)
        [4, 3, '\u22481', 0],
        [4, 3, '1.<span style="text-decoration:overline;">3</span>', 1],
        [4, 3, '1.<span style="text-decoration:overline;">33</span>', 2],
        [4, 3, '1.<span style="text-decoration:overline;">333</span>', 3],
        [16, 9, '\u22482', 0],
        [16, 9, '1.<span style="text-decoration:overline;">7</span>', 1],
        [16, 9, '1.<span style="text-decoration:overline;">77</span>', 2],
        [16, 9, '1.<span style="text-decoration:overline;">777</span>', 3],
        [64, 27, '\u22482.37', 2],
        [64, 27, '2.<span style="text-decoration:overline;">370</span>', 3],
        [64, 27, '2.3<span style="text-decoration:overline;">703</span>', 4], // Test repeating pattern cycling
        [64, 27, '2.37<span style="text-decoration:overline;">037</span>', 5],
        [64, 27, '2.<span style="text-decoration:overline;">370370</span>', 6], // Test repeating pattern duplicating
        [256, 135, '\u22481.90', 2], // Test repeating pattern cycling with prefix
        [256, 135, '1.8<span style="text-decoration:overline;">962</span>', 4], // Test repeating pattern with prefix
        [256, 135, '1.89<span style="text-decoration:overline;">629</span>', 5], // Test repeating pattern cycling with prefix
        [6000, 1001, '\u22485.994006', 6], // Test up-rounding repeating pattern
        [6000, 1001, '\u22486.0', 1], // Test up-rounding repeating pattern that bumps integer portion
        [2.56, 1.35, '1.8<span style="text-decoration:overline;">962</span>', 4], // Test float inputs with repeating pattern and prefix
        [6, 1.001, '5.<span style="text-decoration:overline;">994005</span>', 6], // Test float inputs with repeating pattern
        [6, 1.001, '\u22486.0', 1], // Test float inputs with up-rounding repeating pattern that bumps integer portion

    ];
    for (var i = 0; i < Case.length; i++) {
        if (Case[i].length == 3) { Result = TestCase(Case[i][0], Case[i][1], Case[i][2]); }
        else if (Case[i].length == 4) { Result = TestCase(Case[i][0], Case[i][1], Case[i][2], Case[i][3]); }
        if (Result !== '') { return Result; }
    }
    return 'Tests successful!';
}

LongDivide.TestCase = function(A, B, Expected, Options) {
    var Result = '';
    var Output;
    if (typeof(Options) === 'undefined') {
        Output = LongDivide(A, B);
        if (Output !== Expected) {
            Result = 'Failed LongDivide(' + A + ', ' + B + '). Expected "' + Expected + '", Returned "' + Output + '"';
        }
    }
    else if (typeof(Options) === 'string') {
        Output = LongDivide(A, B, Options);
        if (Output !== Expected) {
            Result = 'Failed LongDivide(' + A + ', ' + B + ', ' + Options + '). Expected "' + Expected + '", Returned "' + Output + '"';
        }
    }
    else {
        Output = LongDivide(A, B, JSON.parse(Options));
        if (Output !== Expected) {
            Result = 'Failed LongDivide(' + A + ', ' + B + ', ' + Options + '). Expected "' + Expected + '", Returned "' + Output + '"';
        }
    }
    return Result;
}

LongDivide.Test();