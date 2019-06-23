"use strict";

var plcType;

/*  upon document ready,
    check for s7-1200 and s7-1500 type plc. If found, continue, otherwise, alert.
    program continues to run regardless of plc type but type matters for proper execution.
*/
$(document).ready(function () {
    // every time if the DOM refresh
    if (plcType != "1200" && plcType != "1500") {
        $.ajax({ type: "GET", url: "../../../Portal/Intro.mwsl", data: "", dataType: "text" })
            .done(function (webpageData) { // .success
                var search12 = webpageData.search("CPU12");
                var search15 = webpageData.search("CPU15");
                if (search12 >= 0) {
                    plcType = "1200";
                    $.init();
                }
                else if (search15 >= 0) {
                    plcType = "1500";
                    $.init();
                }
                else {
                    alert("The PLC Type coudn't be identified!");
                }
            })
            .fail(function (webpageData) { // .error

                alert("The PLC Type coudn't be identified!");
            });
    }

})

//initializes the realtime connection to the PLC
$.init = function () {
    S7Framework.initialize(plcType, "");

    //readData and givt it to the function "updateValues"
    //reads the json in an interesting format:
    /*
        <!-- AWP_In_Variable Name='"Plc2Web".speed' -->
        <!-- AWP_In_Variable Name='"Plc2Web".name' -->
        <!-- AWP_In_Variable Name='"Plc2Web".age' -->
        {
        "val" :	":="Plc2Web".webserverString:",
        "len" :	"8;1;4",
        "typ" :	"2;0;2",
        "str" : ""
        }

        DINT (DINT) + BOOL (BOOL) +  INT (INT)

        “val” corresponds to the string to be read.

        “len” describes the “length” of the variable (variable type)
        1 =   1 bit => corresponds to:   BOOL
        2 =   8 bits => corresponds to: BYTE
        4 = 16 bits => corresponds to:  INT / WORD
        8 = 32 bits => corresponds to:  DINT / DWORD / REAL
        16 = 64 bits => corresponds to:  LINT / LWORD / LREAL

        “typ” describes the variable type (defined in the S7 Framework)
        0 = BOOL;
        1 = UINT;
        2 = INT/DINT;
        3 = REAL;
        4 = LREAL;
        5 = STRING;
        “str” is used for loading variables that were not converted to the string
    */


    //-------------------------------------------------------------------
    //---------------  webserverString Read & Tag Update  ---------------
    //-------------------------------------------------------------------
    //the order of AWP_In_Variables determines the location of data written to the PLC.
    //webserverstring is a concatenation of speed + name + age and
    //len / typ determine the data type of speed + name + age within webserverstring
    S7Framework.readData("script/data.json", "init read data", updateValues);

    //-------------------------------------------------------------------
    //---------------          Single Data Write          ---------------
    //-------------------------------------------------------------------
    //if the value in the input "speed" changed write new value to PLC
    //this happens instantly, upon change, and ONLY 'speed' is written.
    $("#speed").change(function () {
        var data = '"Plc2Web".speed' + "=" + $("#speed").val();;
        S7Framework.writeData("script/data.json", data, "speed transmition failed");
    });

    //-------------------------------------------------------------------
    //---------------           All Data Write.           ---------------
    //-------------------------------------------------------------------
    //if the button "sendFormular" was clicked send the data of the formular to PLC
    //this happens on button click and writes all data found in JSON directly to the tags.
    //PLC does not need to parse the webserverstring to break out speed + name + age. Values are written direct.
    $("#sendFormular").click(function () {
        S7Framework.writeForm("script/data.json", "#formular", "transmition of personal data failed");
    });
}


// updates HTML graphics to match tag values read earlier
function updateValues(values) {
    //values[0]=Position of myRect, the Rect should start 100px out of the svg to appear step by step
    $("#myRect").attr("x", values[0] - 100);

    //values[1]=lightbarrier (it is true if its broken)
    if (values[1] == true) {
        $("#myCircle").attr("fill", "red");
    }
    else {
        $("#myCircle").attr("fill", "green");
    }

    //writes down how many times the Rect passed
    $("#counter").html(values[2]);

    //=> cyclic reading
    //technically setTimeout only happens 1x after a delay, but this is recursively called so it becomes cyclical
    //this is an elegant way to include the update of HTML graphics in the recursive loop
    setTimeout(function () { S7Framework.readData("script/data.json", "cyclic read data", updateValues) }, 500);
}

