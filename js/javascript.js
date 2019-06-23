//hides device not connected tags from main screen
function hide_unused(csstag, plctag) {
    if (plctag == '1') {
        //$('#'+csstag).css("display:'table-row'");
        document.getElementById(csstag).style.display = "table-row";
    } else {
        document.getElementById(csstag).style.display = "none";
    }
}

//main screen amkes red rows when alarming is present per tag
function show_alarms(csstag, plctag) {
    if (plctag == '1') {
        document.getElementById(csstag).style.backgroundColor = "rgb(255, 219, 219)";
    } else {
        document.getElementById(csstag).style.backgroundColor = "rgb(255, 255, 255)";
    }
}

//on change
//discrete function
//if the discrete enabled cbx is checked, set hidden text box to '1'
function discrete_cbxOnChange(cbxstr, hidcbx) {
    if (document.getElementById(cbxstr).checked == true) {
        document.getElementById(hidcbx).value = '1';
    } else {
        document.getElementById(hidcbx).value = '0';
    }

}

//initialize checkbox on page load compared to actual plc values
//if plctag for discrete enabled is 1, (un)check the box.
function discrete_cbxInitialize(cbxstr, strhid, plctag) {
    if (plctag == '1') {
        document.getElementById(cbxstr).checked = true;
        document.getElementById(strhid).value = 1;
    } else {
        document.getElementById(cbxstr).checked = false;
        document.getElementById(strhid).value = 0;
    }

}

//alternate discrete ALARMTSTATE values by adjusting colors and hidden text box
function myClick(strfalse, strtrue, strhid) {
    if (document.getElementById(strfalse).style.color == "rgb(209, 209, 209)") {
        document.getElementById(strfalse).style.color = "black";
        document.getElementById(strtrue).style.color = "rgb(209, 209, 209)";
        document.getElementById(strhid).value = 0;
    } else {
        document.getElementById(strfalse).style.color = "rgb(209, 209, 209)";
        document.getElementById(strtrue).style.color = "black";
        document.getElementById(strhid).value = 1;
    }
}

//initialize ALARMSTATE based on hidden textbox (uses plctag values collected on startup)
function parseAlarmState(strfalse, strtrue, strhid) {
    if (document.getElementById(strhid).value == '1') {
        document.getElementById(strfalse).style.color = "rgb(209, 209, 209)";
        document.getElementById(strtrue).style.color = "black";
    } else {
        document.getElementById(strfalse).style.color = "black";
        document.getElementById(strtrue).style.color = "rgb(209, 209, 209)";
    }
}


//initializes the checkbox state on page load. Do not combine with hide_notconnected because
//hide_notconnected is activated onchange and we dont want to re-initialize the checkboxes
//before we submit the form.
function cbx_Initialize(hidtxt, cbxstr, plctag) {
    if (plctag == "1") {
        document.getElementById(cbxstr).checked = true;
        document.getElementById(hidtxt).value = 1;
    } else {
        document.getElementById(cbxstr).checked = false;
        document.getElementById(hidtxt).value = 0;
    }

}

//hides sections of the user interface based on "not connected" checkbox status
function hide_notconnected(hidtxt, cbxstr, elementstr) {
    var y = document.getElementsByClassName(elementstr);
    var i;
    if (document.getElementById(cbxstr).checked == true) {
        for (i = 0; i < y.length; i++) {
            y[i].style.display = "";
        }
        //$('.'+elementstr).css("display:''");
        document.getElementById(hidtxt).value = 1;
    } else {
        for (i = 0; i < y.length; i++) {
            y[i].style.display = "none";
        }
        //$('.'+elementstr).css("display:none");
        document.getElementById(hidtxt).value = 0;
    }
}

