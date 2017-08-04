/// DESCRIPTION: for displaying followup questions contained within an element that has the same id (or name if id not given) appended with the value unless target element's id is specified and value is given
/// PARAMETERS: [element] - always this
///       [matchesValue](optional) - the value to compare it to
///       [elementid](optional) - specify id to show
///       [invert](optional) - false to show only if it does NOT match the [matchesValue]
///   if no optional parameters passed takes the id (or name if not exists) appends the value and looks for element with that id; 
/// IMPLEMENTATION: <input type=checkbox value=ON onchange="subOptions(this)" id="CB1" /> <div id="CB1ON" class=hide><input type=text name=Other /></div>
///  spanCB1 will show if checkbox is checked
/// IMPLEMENTATION: <select onchange="subOptions(this,'Other')" id=SL1> ... <div id="SL1Other" class=hide><input type=text name=Other /></div>
///  spanSL1 will show if selected value Other
/// IMPLEMENTATION: <select onchange="subOptions(this)" id=SL1><option>BB</option><option>CC</option> ... <div id="SL1CC" class=hide><input type=text name=CC /></div>
///  SL1CC will show if CC is selected  ------ SL1BB will show if BB is selected 
function subOptions(element, matchesValue, elementid, invert, action) {
    var loopOthers = false;
    if (typeof invert === "undefined")
        invert = false;
    if (typeof action === "undefined")
        action = "show";
    var typ = "";
    var res = [];//retain elements selected
    var siblings = [];
    try { typ = element.type; } catch (e) { typ = e.toString(); }
    if (typ == "checkbox" || typ == "radio" && typeof element.name != "undefined" && element.name != "") {
        siblings = document.getElementsByName(element.name);
        $("input[name=" + element.name + "]:checked").each(
          function () { res.push(this.value); }
        );
    } else if (typ == "select-multiple") {
        for (var m = 0; m < element.options.length; m++) {
            siblings.push(element.options[m]);
        }
        if (typeof element.name != "undefined" && element.name != "") {
            $("select[name=" + element.name + "] :selected").each(
              function () { res.push(this.value); }
            );
        }
        if (typeof element.id != "undefined" && element.id != "") {
            $("select#" + element.id + " :selected").each(
              function () { res.push(this.value); }
            );
        }
    } else if (typ == "select-one") {
        var vl = $(element).val();
            res.push(vl);
        for (var m = 0; m < element.options.length; m++) {
            siblings.push(element.options[m]);
        }
    }
    else {
        res.push($(element).val());
        siblings.push(element);
    }
    var loopsiblings = false;
    if (res.length > 0) {
        if (elementid != null && matchesValue != null) {
            var trgt = findelement(elementid);
            }
        if (typeof trgt !== "undefined" && trgt.length > 0) {
                if (matchesValue == "*") {
                    if ($.trim(res[i]) !== "")
                        subOptCase(trgt, !invert, action);
                    else 
                        subOptCase(trgt, invert, action);
                } else if (matchesValue == "!") {
                    if ($.trim(res[i]) !== "")
                        subOptCase(trgt, invert, action);
                    else
                        subOptCase(trgt, !invert, action);
                    
                } else {
                for (var i = 0; i < res.length; i++) {
                    if (matches(res[i], matchesValue)) {
                        subOptCase(trgt, invert, action);
                        break;
                    }
                    else
                        subOptCase(trgt, !invert, action);
                }
            
            }
        } else {
            loopsiblings = true;
        }
    } else {
        var showElement = $('');
        if (typeof elementid === "undefined" && element.value != "") {
            if (element.value != "" && typeof element.id != "undefined" && element.id != "") {
                elementid = element.id + element.value.replace(/\s/g, "_");
            }
            if ((typeof elementid != "undefined" && document.getElementById(elementid) == null) || (typeof elementid === "undefined" && typeof element.name != "undefined" && element.name != "")) {
                elementid = element.name + element.value.replace(/\s/g, "_");
            }
        }
        if (Object.prototype.toString.call(elementid) === '[object String]') {
            showElement = $("#" + elementid);
            if (showElement.length == 0)
                showElement = $("." + elementid);
        }
        else if (elementid instanceof jQuery)
            showElement = elementid;
        if (showElement !== null && showElement.length) {
            subOptCase(showElement, !invert, action);
        } else if (element.value != null && element.value == "") {
            loopsiblings = true;
        }
    }
    if (loopsiblings) {
        for (var j = 0; j < siblings.length; j++) {
            var siblingid = "";
            if (siblings[j].value != "") {
                if (element.value != "" && typeof element.id != "undefined" && element.id != "") {
                    siblingid = element.id + siblings[j].value.replace(/\s/g, "_");
                }
                if (siblingid == "" && typeof element.name != "undefined" && element.name != "" && element.value != "" || (siblingid != "" && document.getElementById(siblingid) == null)) {
                    siblingid = element.name + siblings[j].value.replace(/\s/g, "_");
                }
                if (siblingid !== "") {
                    var findElement = $("#" + siblingid);
                    if (findElement == null || findElement.length == 0)
                        findElement = $("." + siblingid);
                    if (findElement !== null && findElement.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            if ((matchesValue == null && siblings[j].value == res[i]) || (matches(res[i], matchesValue) && matches(siblings[j].value, matchesValue))) {
                                subOptCase(findElement, invert, action);
                                break;
                            }
                            else
                                subOptCase(findElement, !invert, action);
                        }
                    }
                }
            }
        }
    }
}
function visibleOptions(element, matchesValue, elementid, invert, action) {
    subOptions(element, matchesValue, elementid, invert, "visible");
}
function showOptions(element, matchesValue, elementid, invert, action) {
    subOptions(element, matchesValue, elementid, invert, "show");
}
function slideOptions(element, matchesValue, elementid, invert, action) {
    subOptions(element, matchesValue, elementid, invert, "slide");
}
function disableOptions(element, matchesValue, elementid, invert, action) {
    subOptions(element, matchesValue, elementid, invert, "disable");
}
function subOptCase(showElement, invert, action) {
    switch (action) {
        case "hide":
        case "show":
        default:
            invert ? showElement.hide().addClass("subOptHide") : showElement.show().removeClass("subOptHide");
            break;
        case "slide":
            invert ? showElement.slideUp().addClass("subOptHide") : showElement.slideDown().removeClass("subOptHide");
            break;
        case "visible":
        case "visibility":
            invert ? showElement.addClass("subOptHide").css("visibility", "hidden") : showElement.removeClass("subOptHide").css("visibility", "visible");
            break;
        case "disable":
        case "disabled":
        case "grey":
        case "gray":
        case "greyout":
        case "grayout":
        case "grey-out":
        case "gray-out":
            disableInputs(showElement, invert);
            if (invert)
                showElement.removeClass("subOptHide");
            else
                showElement.addClass("subOptHide");
            break;
    }
}
function disableInputs(elem, invert) {
    var findElement = null;
    if (typeof invert == "undefined")
        invert = false;
    if (Object.prototype.toString.call(elem) === '[object String]')
        findElement = document.getElementById(elem);
    else if (elem instanceof jQuery)
        findElement = elem;
    if (findElement != null) {
        if (findElement.length) {
            resetElementValues(findElement);
            findElement.find('input, select, textarea').each(function () {
                $(this).prop("disabled", !invert);
            });
        }
    }
}
///reset all elements within an element
function resetElementValues(obj, keepDefault) {
    if (typeof keepDefault == "undefined")
        keepDefault = false;
    else if ($.type(keepDefault) == "boolean")
        keepDefault = keepDefault;
    else
        keepDefault = true;
    if (obj != null) {
        var div = findelement(obj);
        div.find(':input').each(function (index, ele) {
            var elem = $(ele);
            if (elem.is("select")) {
                elem.find('option').each(function (i, opt) {
                    opt.selected = keepDefault ? opt.defaultSelected : $(opt).prop('selectedIndex', 0);
                });
            } else if (elem.is(":text, textarea") && elem.prop("defaultValue") != null && elem.val() != elem.prop("defaultValue")) {
                var vl = keepDefault ? elem.prop("defaultValue") : '';
                elem.val(vl);
            } else if (elem.prop("defaultChecked") != null) {
                var ck = keepDefault ? elem.prop("defaultChecked") : false;
                elem.prop("checked", ck);
            }
        });
    }
}
/// looking for a match of one of array items
/// eg matches('ac','ac') yields true
/// eg matches('ac',['da','ba','ac']) yields true
/// if contains parameter is true then checks if obja contains objb
/// eg matches('ac',['yes','no'],true) yields false
/// eg matches('ac',['back','front'], true) yields true
/// for use with formValid
/// checks if field is empty or matches regex exp
function matches(obja, objb, contains) {
    var retvalue = false;
    if (typeof contains == "undefined")
        contains = false;
    else
        contains = true;
    if (typeof objb != 'undefined' && typeof obja != 'undefined') {
        try {
            if (Object.prototype.toString.call(obja) === '[object Array]' && Object.prototype.toString.call(objb) === '[object Array]') {
                for (var i = 0; i < obja.length; i++) {
                    for (var j = 0; j < objb.length; j++) {
                        if (objb[j] != null && obja[i] != null) {
                            if (contains) {
                                if (objb[j].toString().toLowerCase().indexOf(obja[i].toString().toLowerCase()) >= 0 || obja[i].toString().toLowerCase().indexOf(objb[j].toString().toLowerCase()) >= 0) {
                                    retvalue = true;
                                    break;
                                }
                            } else {
                                if (objb[j].toString().toLowerCase() == obja[i].toString().toLowerCase()) {
                                    retvalue = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (Object.prototype.toString.call(obja) === '[object Array]' && Object.prototype.toString.call(objb) === '[object String]') {
                for (var i = 0; i < obja.length; i++) {
                    if (objb != null && obja[i] != null) {
                        if (contains) {
                            if (obja[i].toString().toLowerCase().indexOf(objb.toString().toLowerCase()) >= 0) {
                                retvalue = true;
                                break;
                            }
                        } else {
                            if (objb.toString().toLowerCase() == obja[i].toString().toLowerCase()) {
                                retvalue = true;
                                break;
                            }
                        }
                    }
                }
            } else if (Object.prototype.toString.call(obja) === '[object String]' && Object.prototype.toString.call(objb) === '[object Array]') {
                for (var i = 0; i < objb.length; i++) {
                    if (obja != null && objb[i] != null) {
                        if (contains) {
                            if (objb[i].toString().toLowerCase().indexOf(obja.toString().toLowerCase()) >= 0) {
                                retvalue = true;
                                break;
                            }
                        } else {
                            if (objb[i].toString().toLowerCase() == obja.toString().toLowerCase()) {
                                retvalue = true;
                                break;
                            }
                        }
                    }
                }
            } else if (Object.prototype.toString.call(obja) === '[object String]' && Object.prototype.toString.call(objb) === '[object String]') {
                if (contains) {
                    if (objb.toString().toLowerCase().indexOf(objb.toString().toLowerCase()) >= 0)
                        retvalue = true;
                } else {
                    if (obja.toString().toLowerCase() == objb.toString().toLowerCase())
                        retvalue = true;
                }
            }
        } catch (e) { }
    }
    return retvalue;
}
/// similar to matches but return index of array
/// if found, otherwise return -1
/// only works for arrays in first param
/// second param can be array or string to find
/// if second param is array, returns an array of indicies found
function arrayIndexOf(obja, objb, contains) {
    var retvalue = -1;
    var retArr = [];
    if (typeof contains == "undefined")
        contains = false;
    else
        contains = true;
    if (typeof objb != 'undefined' && typeof obja != 'undefined') {
        try {
            if (Object.prototype.toString.call(obja) === '[object Array]' && Object.prototype.toString.call(objb) === '[object Array]') {
                for (var i = 0; i < obja.length; i++) {
                    for (var j = 0; j < objb.length; j++) {
                        if (objb[j] != null && objb[j] != "" && obja[i] != null && obja[i] != "") {
                            if (contains) {
                                if (objb[j].toString().toLowerCase().indexOf(obja[i].toString().toLowerCase()) >= 0 || obja[i].toString().toLowerCase().indexOf(objb[j].toString().toLowerCase()) >= 0) {
                                    retArr.push(i);
                                }
                            } else {
                                if (objb[j].toString().toLowerCase() == obja[i].toString().toLowerCase()) {
                                    retArr.push(i);
                                }
                            }
                        }
                    }
                }
            } else if (Object.prototype.toString.call(obja) === '[object Array]' && Object.prototype.toString.call(objb) === '[object String]') {
                for (var i = 0; i < obja.length; i++) {
                    if (objb != null && objb != "" && obja[i] != null && obja[i] != "") {
                        if (contains) {
                            if (obja[i].toString().toLowerCase().indexOf(objb.toString().toLowerCase()) >= 0) {
                                retvalue = i;
                                break;
                            }
                        } else {
                            if (objb.toString().toLowerCase() == obja[i].toString().toLowerCase()) {
                                retvalue = i;
                                break;
                            }
                        }
                    }
                }
            }
        } catch (e) { }
    }
    if (retArr.length > 0)
        return retArr;
    else
        return retvalue;
}
function blank(field) {
    var isblank = "";
    var content = "";
    var fieldval = $(field).val();
    if (typeof fieldval !== "undefined" && fieldval != null)
        content = fieldval.replace(/^\s+|\s+$/g, '');
    var inputtype = $(field).prop('type');
    var fieldname = "";
    var required = $(field).attr("check");
    var errtxt = $(field).attr("message");
    if (typeof required !== "undefined")
        fieldname = required.replace(/^\s+|\s+$/g, '');
    if ($(field).is(":visible")) {
        if (content.length == 0) {
            if (fieldname.indexOf("empty") >= 0) {
                isblank = "Field is empty";
            }
        }
        else if (fieldname.indexOf("email") >= 0) {
            var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            var isValid = filter.test(content);
            if (!isValid) {
                if (errtxt != null && errtxt != "")
                    isblank = errtxt;
                else
                    isblank = "Email is not in the correct syntax";
            }
        } else if (fieldname.indexOf("phone") >= 0) {
            var filter = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d\)?[\-\.\ \\\/]?){7,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
            var isValid = filter.test(content);
            if (!isValid) {
                if (errtxt != null && errtxt != "")
                    isblank = errtxt;
                else
                    isblank = "Phone number must be in correct format e.g. &quot;1 (234) 567-8901 ext1234&quot;";
            }
        } else if (fieldname.indexOf("numeric") >= 0 || fieldname.indexOf("number") >= 0) {
            var filter = /^[0-9]+$/;
            var isValid = filter.test(content);
            if (!isValid) {
                if (errtxt != null && errtxt != "")
                    isblank = errtxt;
                else
                    isblank = "Numeric digits only";
            }
        } else if (fieldname.indexOf("zip") >= 0) {
            var filter = /^[0-9]{5}$/;
            var isValid = filter.test(content);
            if (!isValid) {
                if (errtxt != null && errtxt != "")
                    isblank = errtxt;
                else
                    isblank = "Zip code must be 5 numerical digits only";
            }
        } else if (fieldname.indexOf("date") >= 0) {
            var filter = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
            //YYYY-MM-DD
            var isValid = filter.test(content);
            var isValid2 = /^(0{0,1}[1-9]|1[012])[- /.]((0{0,1}[1-9])|[12][0-9]|3[01])[- /.](19|20)(\d\d)$/.test(content);
            //MM-DD-YYYY
            if (!isValid && !isValid2) {
                if (errtxt != null && errtxt != "")
                    isblank = errtxt;
                else
                    isblank = "Date Format is not correct";
            }
        } else if (fieldname.indexOf("time") >= 0) {
            var filter = /^[1]{0,}[0-9]:[0-5][\d]\s{0,}[aApP][mM]$/;
            var isValid = filter.test(content);
            if (!isValid) {
                if (errtxt != null && errtxt != "")
                    isblank = errtxt;
                else
                    isblank = "Time must be in valid format HH:MM AM/PM";
            }
        } else if (fieldname.indexOf("empty") != 0) {
            if (fieldname.length > 0) {
                var getrgx = fieldname.replace(" empty", "");
                var rgflg = "i";
                var rgxtest = /\/(.+)\/([gim]{0,3})/;
                if (rgxtest.test(getrgx)) {
                    rgflg = getrgx.replace(rgxtest, "$2");
                    getrgx = getrgx.replace(rgxtest, "$1");
                }
                var filter = new RegExp(getrgx, rgflg);
                var isValid = filter.test(content);
                if (!isValid) {
                    if (errtxt != null && errtxt != "")
                        isblank = errtxt;
                    else
                        isblank = "Not in the correct format";
                }
            }
        }
    }
    return isblank;
}
/**********************
all pages startup scripts
**********************/
$(document).ready(function () {
    $('.expandretract').on("keyup", function () {
        var thd = $(this)[0];
        var totalHeight = 0, currentHeight = 0;
        if (typeof thd.clientHeight != "undefined")
            currentHeight = thd.clientHeight;
        if (typeof thd.scrollHeight != "undefined")
            totalHeight = thd.scrollHeight;
        if (currentHeight < totalHeight)
            $(this).css({
                height: totalHeight
            });
    }).focus(function () {
        var thd = $(this)[0];
        var totalHeight = 0, currentHeight = 0;
        if (typeof thd.clientHeight != "undefined")
            currentHeight = thd.clientHeight;
        if (typeof thd.scrollHeight != "undefined")
            totalHeight = thd.scrollHeight;
        if (currentHeight < totalHeight)
            $(this).css({
                height: totalHeight
            });
    }).blur(function () {
        var rw = $(this)[0].rows;
        if (typeof rw == "undefined" || rw == 0 || rw == null)
            rw = 1;
        $(this).css({
            height: rw * 14
        });
    });
    $('textarea.autoexpand, div.autoexpand, li.autoexpand, p.autoexpand').on("keyup change", function () {
        var thd = $(this)[0];
        var totalHeight = 0, currentHeight = 0;
        if (typeof thd.clientHeight != "undefined")
            currentHeight = thd.clientHeight;
        if (typeof thd.scrollHeight != "undefined")
            totalHeight = thd.scrollHeight;
        if (currentHeight < totalHeight)
            $(this).css({
                height: totalHeight
            });
    });
    $(':text.autoexpand').on("keyup change", function () {
        var thd = $(this);
        var totalWidth = thd.parent().width(), currentWidth = 0;
        currentWidth = thd.width ? thd.width : (thd.clientWidth ? thd.clientWidth : 0);
        if (currentWidth < totalWidth)
            $(this).css({
                width: totalWidth
            });
    });
    $('textarea.autoexpand, div.autoexpand, li.autoexpand, p.autoexpand').each(function () {
        var thd = $(this)[0];
        var totalHeight = 0, currentHeight = 0;
        if (typeof thd.clientHeight != "undefined")
            currentHeight = thd.clientHeight;
        if (typeof thd.scrollHeight != "undefined")
            totalHeight = thd.scrollHeight;
        if (currentHeight < totalHeight)
            $(this).css({
                height: totalHeight
            });
    });
    $(':text.autoexpand').each(function () {
        var thd = $(this);
        var totalWidth = thd.parent().width(), currentWidth = 0;
        currentWidth = thd.width ? thd.width : (thd.clientWidth ? thd.clientWidth : 0);
        if (currentWidth < totalWidth)
            $(this).css({
                width: totalWidth
            });
    });
    /*********************************
  //use in the following
  <textarea class="remainder" char="50"></textarea>
  <textarea class="remainder" words="200"></textarea>
  <textarea class="remainder"></textarea> //assumes 255 characters
  ******************************/
    $('textarea.remainder, input.remainder').on("keyup", function () {
        var cnt = 255;
        var wrds = 0;
        var sz = this.value.length;
        if ($(this).attr("char") != null)
            cnt = $(this).attr("char");
        cnt = parseInt(cnt);
        if (isNaN(cnt))
            cnt = 255;
        if ($(this).attr("words") != null)
            wrds = $(this).attr("words");
        wrds = parseInt(wrds);
        if (isNaN(wrds))
            wrds = 0;
        if (wrds == 0 && sz > cnt) {
            return false;
        }
        if (wrds > 0 && this.value.match(/\S+/g)) {
            sz = this.value.match(/\S+/g).length;
            var showspan = $(this).next("span.remainder");
            if (showspan.length) {
                showspan.html("Words Remaining: " + (wrds - sz));
                if (sz > wrds)
                    showspan.addClass("error");
                else
                    showspan.removeClass("error");
            }
            else {
                var sp = $("<span>");
                sp.html("Words Remaining: " + (wrds));
                sp.addClass("smaller remainder" + ((sz > wrds) ? " error" : ""));
                $(this).after(sp);
            }
        } else {
            var showspan = $(this).next("span.remainder");
            if (showspan.length)
                showspan.html("Remaining: " + (cnt - sz));
            else {
                var sp = $("<span>");
                sp.html("Remaining: " + (cnt - sz));
                sp.addClass("smaller remainder");
                $(this).after(sp);
            }
        }
    });
    $('.noinput').on('focus', function () {
        $(this).blur();
    });
    TimeChooser();
});
$(document).on('focus click', 'input.jdatepicker', function () {
    $(this).datepicker({
        yearRange: "-100:+5",
        changeMonth: true,
        changeYear: true
    });
});
/*********************************
function QuickSubmitReturn(){
  var frmsb = $("#formsubmission");
  if(frmsb!=null && frmsb.length)
    frmsb.show();
}
//use in the following
var openFormTime = new Date();
    if($("#duration").val()!=""){
    var tt = parseTime($("#duration").val());
    if(tt.length){
//subtract the difference of time already logged.
        if(tt.hh.toString().length){
          openFormTime.setHours(openFormTime.getHours()-tt.hh);
        }
        if(tt.mm.toString().length){
          openFormTime.setMinutes(openFormTime.getMinutes()-tt.mm);
        }
        if(tt.ss.toString().length){
          openFormTime.setSeconds(openFormTime.getSeconds()-tt.ss);
        }
      }
    }
var startClock=setInterval(function(){
var rt = runTimer(openFormTime);
  $("#duration").val(rt.duration);
  $("#endtime").val(rt.endtime);
},1000);
******************************/
function replaceSpecialChars(ele, keepopenhtmltags) {
    if (typeof keepopenhtmltags == "undefined") {
        keepopenhtmltags = true;
    }
    
    var s = "";
    if (typeof ele == "string") {
        s = ele;
    }
    if (typeof ele == "object") {
        s = ele.value;
    }
    if (s!=null && s.length > 0) {
        // smart single quotes and apostrophe
        s = s.replace(/[\u2018\u2019\u201A]/g, "\'");
        // smart double quotes
        s = s.replace(/[\u201C\u201D\u201E]/g, "\"");
        // ellipsis
        s = s.replace(/\u2026/g, "...");
        // dashes
        s = s.replace(/[\u2013\u2014]/g, "-");
        // circumflex
        s = s.replace(/\u02C6/g, "^");
        // open angle bracket
        s = s.replace(/\u2039/g, "<");
        // close angle bracket
        s = s.replace(/\u203A/g, ">");
        // spaces
        s = s.replace(/[\u02DC\u00A0]/g, " ");
        // open tag as html code to prevent trying to render
        if (keepopenhtmltags)
            s = s.replace(/</g, "&#60;");
        ele.value = s;
    }
    return s;
}
function parseTime(s) {
    var part = s.match(/(\d+):(\d+)(:(\d+))?/i);
    var hh = 0, mm = 0, ss = 0, ap = "";
    if (part != null && part[1] != null && part[1].length > 0)
        hh = parseInt(part[1], 10);
    if (part != null && part[2] != null && part[2].length > 0)
        mm = parseInt(part[2], 10);
    if (part != null && part[3] != null && part[3].length > 0) {
        ap = part[3] ? part[3].toUpperCase() : null;
    }
    if (part != null && part[4] != null && part[4].length > 0) {
        ss = parseInt(part[4], 10);
    }
    if (ap === "AM") {
        if (hh == 12) {
            hh = 0;
        }
    }
    if (ap === "PM") {
        if (hh != 12) {
            hh += 12;
        }
    }
    return { hh: hh, mm: mm, ss: ss };
}
function runTimer(d2) {
    var d = new Date();
    if (d2 > d) {
        d2.setDate(d2.getDate() + 1);
    }
    var diff = d - d2;
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    var dur = hh + ":" + (mm > 9 ? mm : "0" + mm) + ":" + (ss > 9 ? ss : "0" + ss);
    var endtm = d.toLocaleTimeString();
    return { duration: dur, endtime: endtm }
}

// call it from a field onchange event
// <input type="text" class="jdatepicker" onchange="AgeCalc(this,'Element_Id_for_Result')"

// call it from a script
// var age = AgeCalc("01/15/1942")

// or set your own date fields
// var age = AgeCalc("November 03, 1981", null, "January 1,2020"); 
// alert(age);

// pass your own date objects too
// var day1 = new Date(date);
// var d = new Date();
// d.setFullYear(2020, 11, 14); // set date to December 14, 2020
// var newage = AgeCalc(day1, null, d);
// Dont forget to pass a NULL if you want a return value instead


function AgeCalc(elem, divid, nxelem, options) {
    var dateFormat = "mm/dd/yy";
    if (jdateformat != null && jdateformat.length > 0)
        dateFormat = jdateformat;
    if (typeof elem != "undefined" && elem != null) {
        var fromdate, todate;
        if ($.type(elem) === "date")
            fromdate = elem;
        else if ($.type(elem) === "string") {
            var isdt = $.datepicker.parseDate(dateFormat, elem);
            if (isdt != null && !isNaN(isdt)) {
                fromdate = isdt;
            } else {
                var val = findvalue(elem);
                if (val != null && val.length > 0)
                    fromdate = $.datepicker.parseDate(dateFormat, val);
            }
        }
        if ($.type(fromdate) !== "date" || isNaN(fromdate))
            return;
        if (nxelem != null) {
            if ($.type(nxelem) === "date")
                todate = nxelem;
            else if ($.type(nxelem) === "string") {
                var nxdt = $.datepicker.parseDate(dateFormat, nxelem);
                if (nxdt != null && !isNaN(nxdt)) {
                    todate = nxdt;
                } else {
                    var nxval = findvalue(nxelem);
                    if (nxval != null && nxval.length > 0)
                        todate = $.datepicker.parseDate(dateFormat, nxval);
                }
            }
        }
        if ($.type(todate) !== "date")
            todate = new Date();
        var age = [],
            y = [todate.getFullYear(), fromdate.getFullYear()],
            ydiff = y[0] - y[1],
            m = [todate.getMonth(), fromdate.getMonth()],
            mdiff = m[0] - m[1],
            d = [todate.getDate(), fromdate.getDate()],
            ddiff = d[0] - d[1];

        if (mdiff < 0 || (mdiff === 0 && ddiff < 0))--ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0) {
            fromdate.setMonth(m[1] + 1, 0);
            ddiff = fromdate.getDate() - d[1] + d[0];
            --mdiff;
        }
        if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        if (!matches(options, "nomonth"))
            if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's ' : ''));
        if (!matches(options, "noday"))
            if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
    }
    findvalue(divid, age.join(''));
    return age.join('');
}
function AgeYear(elem, divid, nxelem) {
    var opt = ["noday", "nomonth"];
    AgeCalc(elem, divid, nxelem, opt);
}
function AgeMonth(elem, divid, nxelem) {
    AgeCalc(elem, divid, nxelem, "noday");
}

/// return objects value
/// setter only takes string to set the value or text of the object
/// var x = findvalue('abc123'); looks for an element with an id of abc123
/// var x = findvalue($('input[name=abc123])); already a jQuery object so just returns its value
/// if(x=="somevalue"){runstuff();}
function findvalue(itm, setter) {
    var setit = false;
    if ($.type(setter) === "string") {
        setit = true;
    }
    if (itm != null) {
        var isinput = false;
        var $pass = findelement(itm);
        if ($pass != null && $pass.length > 0) {
            isinput = $pass.is(':input');
            if (isinput) {
                var inputtype = $pass.prop("type");
                if (matches(inputtype, ['checkbox', 'radio'])) {
                    if (setit) {
                        var el = $pass.filter(function () {
                            return matches($(this).val(), (inputtype == 'checkbox') ? setter.split(',') : setter);

                        });
                        el.prop("checked", true);
                    } else {
                        return $pass.filter(":checked").val();
                    }
                }
                else if (matches(inputtype, ['select-one', 'select-multiple'])) {
                    if (setit) {
                        $pass.find('option').each(function () {
                            if (matches($(this).val(), (inputtype == 'select-multiple') ? setter.split(',') : setter))
                                $(this).prop("selected", true);
                        });

                    } else {
                        return $pass.filter(":selected").val();
                    }
                } else {
                    if (setit) {
                        $pass.val(setter);
                    } else {
                        return $pass.val();
                    }
                }
            } else {
                if (setit) {
                    $pass.text(setter);
                } else {
                    return $pass.text();
                }
            }
        }
    }

    return null;
}

/// return jQuery object 
/// finds element by id or css selector or just returns jQuery object back if passed in
function findelement(itm) {
    var $pass = $('');
    if (itm != null) {
        $pass = itm;
        if ($.type(itm) === "string") {
            $pass = $(itm);
            if ($pass != null && $pass.length == 0)
                $pass = $("#" + itm);
            if ($pass != null && $pass.length == 0)
                $pass = $("[name='" + itm.replace(/'/g,"''") + "']");
        } else if ($.type(itm) === "object") {
            if (itm instanceof jQuery)
                $pass = itm;
            else if (itm instanceof Element)
                $pass = $(itm);
        }

    }

    return $pass;
}

function printDiv(divid) {
    var divToPrint = findelement(divid);
    if (divToPrint != null && divToPrint.length > 0) {
        var newWin = window.open("", "prntview", "location=no,width=600, height=825, left=100, top=25");
        newWin.document.write(divToPrint.html());
        newWin.document.close();
        newWin.print();
    }
}

function carryoverdrop(select1, select2, select3, parentHide) {
    var addhide = false;
    if ($.type(select3) == "boolean") {
        addhide = select3;
    }
    else if ($.type(parentHide) == "boolean") {
        addhide = parentHide;
    }
    var drop1 = findelement(select1);
    var drop2 = findelement(select2);
    var drop3 = findelement(select3);
    if (drop1 != null && drop1.length > 0 && (drop1.prop('type') == 'select-one' || drop1.prop('type') == 'select-multiple') && drop2 != null && drop2.length > 0 && (drop2.prop('type') == 'select-one' || drop2.prop('type') == 'select-multiple')) {
        if (addhide)
            drop2.parent().hide();
        var drop3list;
        if (drop3 != null && drop3.length > 0 && drop3.prop('type') == 'select-one') {
            if (addhide)
                drop3.parent().hide();
            drop3list = drop3.find('option').clone();
        }
        var drop2list = drop2.find('option').clone();
        drop1.on('change', function () {
            var selectedDrop2 = $(this).find('option:selected');
            if (selectedDrop2 != null && selectedDrop2 != "") {
                var availdrop2 = selectedDrop2.val();
                if (addhide && availdrop2 != null && $.trim(availdrop2) != "")
                    drop2.parent().show();
                if (addhide && availdrop2 != null && availdrop2 == "") {
                    drop2.parent().show();
                    drop2.html(drop2list);
                }
                if (drop3 != null && drop3.length > 0 && (drop3.prop('type') == 'select-one' || drop3.prop('type') == 'select-multiple')) {
                    if (addhide)
                        drop3.parent().hide();
                    drop3.val('');
                }
                drop2.html(drop2list.filter(function () {
                    var cls = $(this).attr("class");
                    var mm = -1;
                    if (cls != null)
                        mm = $.inArray(availdrop2, cls.split(/[\t ,]+/));
                    else if ($(this).val() == "")
                        mm = 1;
                    return mm >= 0;
                }));
                var nwDropOptn = drop2.find('option');

                if (nwDropOptn.length > 0) {
                    nwDropOptn.each(function(i,el){
                        if ($(el).prop("selected")) {
                            drop2.val(el.value);
                            if (drop2.hasClass("comboboxsource"))
                                drop2.next().find("input").val(el.value);
                        }
                    });
                } else if(nwDropOptn.length==1) {
                    nwDropOptn.prop("selected", true);
                } else {
                    drop2.val('');
                }
            }
        });

        if (drop3 != null && drop3.length > 0 && (drop3.prop('type') == 'select-one' || drop3.prop('type') == 'select-multiple')) {
            drop2.on('change', function () {
                var $whichdrop2 = $(this).find('option:selected');
                if ($whichdrop2 != null && $whichdrop2 != "") {
                    var drop2Val = $whichdrop2.val();
                    if (addhide && drop2Val != null && $.trim(drop2Val) != "")
                        drop3.parent().show();
                    if (addhide && drop2Val != null && $.trim(drop2Val) != "") {
                        drop3.parent().show();
                        drop3.html(drop3list);
                    }
                    drop3.html(drop3list.filter(function () {
                        var pgm = $(this).attr("class");
                        var tt = -1;
                        if (pgm != null)
                            tt = $.inArray(drop2Val, pgm.split(" "));
                        else if ($(this).val() == "")
                            tt = 1;
                        return tt >= 0;
                    }));
                    var nxDropOptn = drop3.find('option');
                    if (nxDropOptn.length > 0) {
                        nxDropOptn.each(function (i, el) {
                            if ($(el).prop("selected"))
                                drop3.val(el.value);
                        });
                    } else if (nxDropOptn.length == 1) {
                        nxDropOptn.prop("selected", true);
                    } else {
                        drop3.val('');
                    }
                }
            });
            drop2.trigger("change");
        }
        drop1.trigger("change");
    }
}

/**** 
  * TimePicker
  * with 15 minute increments
  * TimePicker(15);
  * military time with every minute
  * TimePicker(1,true);
  * set a custom selector
  * TimePicker("#thisFieldID, #andThisOne",1,true);
  ****/

function calcDurationDates(d, d2) {
    if ($.type(d) == "date" && $.type(d2) == "date" && !isNaN(d) && !isNaN(d2)) {
        if (d2 < d) {
            d.setDate(d.getDate() - 1);
        }
        var diff = d2 - d;

        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        var dur = hh + ":" + (mm > 9 ? mm : "0" + mm);

        return dur;
    } else
        return null;
}
function TimeChooser(selector, incr, hr24) {
    var steps = 900;
    var militarytime = false;
    var timePicker = $('.timePicker');
    if (selector != null) {
        if ($.type(selector) !== "number" && $.type(selector) !== "boolean")
            timePicker = findelement(selector);
        else if ($.type(selector) == "number")
            steps = selector * 60;
        else if ($.type(selector) == "boolean")
            militarytime = selector * 60;
    }
    if (incr != null) {
        if ($.type(incr) == "number")
            steps = incr * 60;
        else if ($.type(incr) == "boolean")
            militarytime = incr;
    }
    if (hr24 != null && $.type(hr24) == "boolean")
        militarytime = hr24;

    timePicker.each(function () {
        var $ths = $(this);
        var thsvl = $ths.val();
        var currHour = "", currMin = "";
        if (thsvl != null && $.trim(thsvl).length > 0) {
            var sdf = new Date("01/01/2020 " + thsvl);
            currHour = sdf.getHours();
            currMin = sdf.getMinutes();
        }
        var divhldr = $("<div />");
        var lft = $ths.position().left;
        if (isNaN(lft))
            lft = 0;
        lft = lft + $ths.width() + 8;
        var tp = $ths.position().top;
        if (isNaN(tp))
            tp = 0;

        divhldr.css({ left: lft, top: tp, position: 'absolute', padding: '1em', background: '#fff', border: 'solid thin #ddd' });
        var hourDrop = $("<select class=\"TimePicker PickHour\" />");
        var hourRng = (militarytime ? 23 : 12);
        var hourStrt = (militarytime ? 0 : 1);

        if (!militarytime) {
            if (currHour > 12)
                currHour = currHour - 12;
        }
        for (var h = hourStrt; h <= hourRng; h++) {
            var hrOpt = $("<option />");
            hrOpt.val(h);
            hrOpt.text(h);
            if (!isNaN(currHour) && h == currHour)
                hrOpt.prop("selected", true);
            hourDrop.append(hrOpt);
        }
        var minDrop = $("<select class=\"TimePicker PickMinute\" />");
        for (var m = 0; m < (60 * 60) ; m = m + steps) {
            var mnOpt = $("<option />");
            mnOpt.val((m / 60));
            mnOpt.text((m / 60));
            if (thsvl != null && thsvl.length > 0 && (m / 60) == parseInt(currMin))
                mnOpt.prop("selected", true);
            minDrop.append(mnOpt);
        }
        divhldr.append(hourDrop);
        divhldr.append(minDrop);
        var pamDrop = $("<select class=\"TimePicker PickPAM\" />");
        if (!militarytime) {
            var amOpt = $("<option />");
            amOpt.val("AM");
            amOpt.text("AM");
            var pmOpt = $("<option />");
            pmOpt.val("PM");
            pmOpt.text("PM");
            if (currHour > 12)
                pmOpt.prop('selected', true);
            pamDrop.append(amOpt);
            pamDrop.append(pmOpt);
            divhldr.append(pamDrop);
        }
        hourDrop.add(minDrop).add(pamDrop).on('click', function () {
            var newt = zt10(hourDrop.val()) + "" + zt10(minDrop.val()) + "";
            if (!militarytime)
                newt = hourDrop.val() + ":" + zt10(minDrop.val()) + " " + pamDrop.val();
            $ths.val(newt);
            $ths.trigger("change");
        });

        divhldr.hide();
        $ths.after(divhldr);
        $ths.on('focus', function () {
            divhldr.show();
            var $fcs = $(this);
            var fcsvl = $fcs.val();
            var fcsdt = new Date("01/01/2020 " + fcsvl);
            var curHour = fcsdt.getHours();
            var curMin = fcsdt.getMinutes();
            if (!militarytime) {
                if (curHour > 12) {
                    curHour = curHour - 12;
                    divhldr.find(".PickPAM").val("PM");
                } else {
                    divhldr.find(".PickPAM").val("AM");
                }
            }
            if (curHour != null && curHour.length > 0) {
                divhldr.find(".PickHour").val(curHour);
            }
            if (curMin != null && curMin.length > 0)
                divhldr.find(".PickMinute").val(curMin);
        });
        $ths.on('change', function () {
            var hrDrop = divhldr.find(".PickHour");
            var mnDrop = divhldr.find(".PickMinute");
            var pmDrop = divhldr.find(".PickPAM");
            var $blr = $(this);
            var newt = zt10(hrDrop.val()) + "" + zt10(mnDrop.val()) + "";
            if (!militarytime)
                newt = hrDrop.val() + ":" + zt10(mnDrop.val()) + " " + pmDrop.val();
            $blr.val(newt);
        });
        $ths.on('keyup', function (e) {
            var $kyp = $(this);
            var str = $kyp.val();
            var hrDrop = divhldr.find(".PickHour");
            var mnDrop = divhldr.find(".PickMinute");
            var pmDrop = divhldr.find(".PickPAM");
            var crHr = "", crMn = "0", crPAM = "AM";
            switch (e.which) {
                case 9:
                case 10:
                case 13:
                    break;
                default:
                    var myRegexp = /^(\d{1,2})([\:\.]?\d{1,2})?([ ]?[a|p]m?)?$/ig;
                    var res = myRegexp.exec(str);
                    if (res[1] != null && res[1].length > 0) {
                        crHr = res[1];
                        if (res[2] != null && res[2].length > 0) {
                            crMn = res[2].replace(/[\:\.]/g, "");
                            var rating = parseInt(crMn);
                            if (isNaN(rating))
                                rating = 0;
                            crMn = (Math.round(rating / (steps / 60)) * (steps / 60)).toFixed(0);
                        }
                        if (res[3] != null && res[3].length > 0)
                            crPAM = $.trim(res[3]).replace(/([a|p])m?/i, "$1m").toUpperCase();
                    }
                    break;
            }
            if (!militarytime) {
                if (parseInt(crHr) > 12) {
                    crHr = parseInt(crHr) - 12;
                    pmDrop.val("PM");
                } else {
                    pmDrop.val(crPAM);
                }
            }

            if (crHr != null && crHr.length > 0) {
                hrDrop.val(crHr);
            }
            if (crMn != null && crMn.length > 0) {
                mnDrop.val(crMn);
            }
        });
        $(document).on('click', function (e) {
            if (($(e.target).closest($ths).length == 0) && ($(e.target).closest(divhldr).length == 0)) {
                divhldr.hide();
            }
        });
        divhldr.focusin(function (ev) {
            ev.stopPropagation()
        });
        $('body').focusin(function () {
            divhldr.hide();
        });
    });
}
function zt10(t) {
    if (t < 10)
        return "0" + t;
    else
        return t;
}
function select_all(el) {
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}
String.prototype.toProperCase = function () {
    return this.toLowerCase().replace(/\b((m)(a?c))?(\w)/g,
    function ($1, $2, $3, $4, $5) { if ($2) { return $3.toUpperCase() + $4 + $5.toUpperCase(); } return $1.toUpperCase(); });
}

function runProperCase(ele) {
    return ele.value = ele.value.toProperCase();
}

$(document).ready(function () {
    $(".autocloseform").click(function (e) {
        e.preventDefault();
        var _this = $(this);
        var _form = _this.closest("form");
        var validator = _form.validate(); // obtain validator
        var anyError = false;
        _form.find("input").each(function () {
            if (!validator.element(this)) {
                anyError = true;
            }
        });
        if (anyError) {
            return false; // exit if any error found    
        }
        var btnnmvl = "";
        if (_this.attr('name') != null && _this.attr('value') != null) {
            btnnmvl = '&' + encodeURI(_this.attr('name')) + '=' + encodeURI(_this.attr('value'));
        }
        $.post(_form.attr("action"), _form.serialize()+btnnmvl, function (data) {
            loadscr();
            $("body").html(data);
        }).fail(function (xhr, status, error) {
            // error handling
            var modelStateErrors = xhr.responseJSON;
            if (modelStateErrors != null) {
                for (var i = 0; i < modelStateErrors.length; i++) { $('span[data-valmsg-for="' + modelStateErrors[i].key + '"]').text(modelStateErrors[i].errors[0]); }
            } else { alert(status + "\n" + error); }
        }).done(function (msg) {
            unloadscr();
            $("body").html(msg);
        });
    });
});
function loadscr() {
    $("content").hide();
    $("div#loadingContent").slideDown(); setTimeout(function () {
        $("#revertLoad").show();
    }, 15000);
}
function unloadscr() {
    $("content").show();
    $("div#loadingContent").hide();
}
var newwindows = {};
function popitup(url, nm) {
    var wdt = 1200;
    var hgt = 650;
    var wd = parseInt($("#mainwinwdth").val());
    var ht = parseInt($("#mainwinhght").val());
    if (wd != null && $.type(wd) == "number" && !isNaN(wd))
        wdt = wd;
    if (ht != null && $.type(ht) == "number" && !isNaN(wd))
        hgt = ht;
    if ((newwindows[nm] == null) || (newwindows[nm].closed)) {
        newwindows[nm] = window.open(url, nm, 'width=' + wdt + ',height=' + hgt + ',scrollbars=yes,resizable=yes');
        newwindows[nm].focus();
    } else {
        newwindows[nm].focus();
    }
}
function popclose(trg,url) {
    if (trg != null && url!=null) {
        var tg = findelement(trg);
        $("#btn" + trg).show();
        tg.load(url);
    }
}

function submtFrm(ele) {
    var ths = $(ele);
    var t = ths.closest("form");
    //var t = ths.parent();
    t.submit();
    unloadscr();
}
