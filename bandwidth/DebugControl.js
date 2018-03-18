DebugSettings = {};

function DEBUG(text) {
    Fn = DEBUG.caller.name;
    proceed_with_msg = false;

    if ('all' in DebugSettings) {
        if (!DebugSettings['all']) {
            return;
        } // if All == false, always skip
        else if (DebugSettings['all']) {
            //printDebug(Fn, arguments);
            proceed_with_msg = true;
        }
    }
    else if (Fn in DebugSettings) {
        if (DebugSettings[Fn] == false) {
            //printDebug(Fn, arguments)
            proceed_with_msg = false;
        }
    }
    else {
        proceed_with_msg = true;
    }

    if (proceed_with_msg == true) {
        str = 'console.log("[" + Fn + "()] ::"';
        for (var i = 0; i < arguments.length; i++) {
            str += ', arguments[' + i + ']';
        }
        str += ');';
        eval(str);
    }

    return;
}

function DebugConfig(settings) {
    DebugSettings = settings;
}