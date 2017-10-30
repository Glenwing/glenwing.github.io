var box = document.getElementById("a");
var button = document.getElementById("button");
var f1 = document.getElementById("f1");
var f2 = document.getElementById("f2");

var c1 = "";
var c2 = "";

var on = false;

/*function UpdateC() {
    var v1 = document.getElementById("c1 in").value;
    var v2 = document.getElementById("c2 in").value;
    c1 = "#" + v1 + v1 + v1;
    c2 = "#" + v2 + v2 + v2;
    console.log("Colors updated; C1: " + c1 + "; C2: " + c2);
}*/

function OnOffToggle() {
    if (on) {
        on = false;
        console.log('Toggled Off');
    }
    else if (!on) {
        on = true;
        console.log('Toggled On');
    }
}

function UpdateCR() {
    var v1 = $("input[name=c1radio]:checked", "#c1form").val();
    var v2 = $("input[name=c2radio]:checked", "#c2form").val();
    c1 = "RGB(" + v1 + "," + v1 + "," + v1 + ")";
    c2 = "RGB(" + v2 + "," + v2 + "," + v2 + ")";
    console.log("Colors updated; C1: " + c1 + "; C2: " + c2);
}

//document.getElementById("c1 in").value = "00";
//document.getElementById("c2 in").value = "FF";

UpdateCR();

function setS1() {
    if (on == true) {
        box.style.backgroundColor = c1;
        requestAnimationFrame(setS2);
    }
}

function setS2() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setS1);
}



function setD1() {
    if (on == true) {
        box.style.backgroundColor = c1;
        requestAnimationFrame(setD2);
    }
}

function setD2() {
    box.style.backgroundColor = c1;
    requestAnimationFrame(setD3);
}

function setD3() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setD4);
}

function setD4() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setD1);
}



function setQ1() {
    if (on == true) {
        box.style.backgroundColor = c1;
        requestAnimationFrame(setQ2);
    }
}

function setQ2() {
    box.style.backgroundColor = c1;
    requestAnimationFrame(setQ3);
}

function setQ3() {
    box.style.backgroundColor = c1;
    requestAnimationFrame(setQ4);
}

function setQ4() {
    box.style.backgroundColor = c1;
    requestAnimationFrame(setQ5);
}

function setQ5() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setQ6);
}

function setQ6() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setQ7);
}

function setQ7() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setQ8);
}

function setQ8() {
    box.style.backgroundColor = c2;
    requestAnimationFrame(setQ1);
}


function RunC() {
    
    if (f1.checked) {
        requestAnimationFrame(setS1);
    }
    else if (f2.checked) {
        requestAnimationFrame(setD1);
    }
    else if (f4.checked) {
        requestAnimationFrame(setQ1);
    }
}

function turnBlack() {
    box.style.backgroundColor = c1;
}

function turnWhite() {
    box.style.backgroundColor = c2;
}