var rawEnhancements = null;
var enhancements = null;
var rawUnits = null;
var units = null;
var materials = [];
var selectedEnhancements = [];
var currentFilter = "all";

$(function() {
    $(".wheelable").bind("mousewheel", onWheel);
    $(".autocomplete").combobox({ bsVersion: 3 });
    $(".cryst input").on("change", saveData);
    $("#addEnhancement").on("click", addEnhancement)
    $("#selectedEnhancementsList").on("click", "a[data-delete]", removeEnhancement);
    $("#selectedEnhancementsList").on("click", "a[data-moveup]", moveUpEnhancement);
    $("#selectedEnhancementsList").on("click", "a[data-movedown]", moveDownEnhancement);
    $("#selectedEnhancementsList").on("click", "a[data-done]", doneEnhancements);

    loadData();
});

function onWheel(event, delta) {
    if (isNaN(this.value) || this.value == "") value = 0;
    else value = parseInt(this.value);
    if (delta > 0) {
        this.value = value + 1;
    } else {
        if (value > 0) {
            this.value = value - 1;
        }
    }
    saveData();
    return false;
}

function loadData() {
    $.get("/data/enhancements.json", null, loadEnhancements)
    $.get("/data/units.json", null, loadUnits)
}

function loadEnhancements(data) {
    rawEnhancements = data;
    if (rawEnhancements != null && rawUnits != null) loadUserData();
}

function loadUnits(data) {
    rawUnits = data;
    if (rawEnhancements != null && rawUnits != null) loadUserData();
}

function loadAddCombos() {
    units = {};
    for (var eid in rawEnhancements) {
        var e = rawEnhancements[eid];
        for (var ui in e.units) {
            var uid = e.units[ui];
            if (!(uid in units)) {
                units[uid] = {
                    "id": uid,
                    "name": rawUnits[uid].name
                };
            }
        }
    }
    unitsSorted = Object.keys(units).sort(function(a, b) { return units[a].name.localeCompare(units[b].name); });

    $("#units").empty();
    $("#units").append($("<option>", { value: "", text: ""}));
    $.each(unitsSorted, function (i, item) {
        $("#units").append($("<option>", { value: units[item].id, text: units[item].name}));
    });
    $("#units").combobox("refresh");
    $("#units").on("change", changedUnit);
}

function changedUnit() {
    var selectedUnit = $(this).val();
    enhancements = [];
    if (selectedUnit == "") {
        $("#skill").val("");
        $("#skill").empty();
        $("#skill").combobox("refresh");
        $("#skill").combobox("toggle");
        return;
    }

    selectedUnit = parseInt(selectedUnit);

    var added = {};
    var allIds = [];
    var totalGil = 0;
    var allMaterials = {};

    for (var eid in rawEnhancements) {
        var secEnh = false;

        var e = rawEnhancements[eid];
        if ($.inArray(selectedUnit, e.units) < 0) continue;

        allIds.push(eid);
        totalGil += e.cost.gil;
        $.each(e.cost.materials, function(i, item) { if (i in allMaterials) allMaterials[i] += item; else allMaterials[i] = item; })

        if (e.name in added) secEnh = true;

        enhancements.push({
            "id": eid,
            "name": e.name + (secEnh ? " +2" : " +1"),
            "gil": e.cost.gil,
            "materials": e.cost.materials,
            "unit": selectedUnit
        });

        if (secEnh) {
            var bothMats = {};
            $.each(e.cost.materials, function(i, item) { if (i in bothMats) bothMats[i] += item; else bothMats[i] = item; })
            $.each(added[e.name].materials, function(i, item) { if (i in bothMats) bothMats[i] += item; else bothMats[i] = item; })
            enhancements.push({
                "id": added[e.name].id + "|" + eid,
                "name": e.name + " +1/+2",
                "gil": e.cost.gil + added[e.name].gil,
                "materials": bothMats,
                "unit": selectedUnit
            });
        }
        added[e.name] = { "id": eid, "gil": e.cost.gil, "materials": e.cost.materials };
    }

    enhancements.push({
        "id": allIds.join("|"),
        "name": "All enhancements +1/+2",
        "gil": totalGil,
        "materials": allMaterials,
        "unit": selectedUnit
    })

    $("#skill").empty();
    $("#skill").append($("<option>", { value: "", text: ""}));
    $.each(enhancements, function (i, item) {
        $("#skill").append($("<option>", { value: item.id, text: item.name}));
    });
    $("#skill").combobox("refresh");
}

function loadUserData() {
    loadAddCombos();
    materials = JSON.parse(localStorage.getItem("inventory")) || [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];

    fillData(materials);

    loadSelectedEnhancements();
    printSelectedEnhancements();
    buildFilter();

    $("#app").show();
}

function fillData(data) {
    $("#white-alcryst").val(data[0][0]);
    $("#white-milcryst").val(data[0][1]);
    $("#white-heavycryst").val(data[0][2]);
    $("#white-giancryst").val(data[0][3]);
    $("#white-purecryst").val(data[0][4]);

    $("#black-alcryst").val(data[1][0]);
    $("#black-milcryst").val(data[1][1]);
    $("#black-heavycryst").val(data[1][2]);
    $("#black-giancryst").val(data[1][3]);
    $("#black-purecryst").val(data[1][4]);

    $("#green-alcryst").val(data[2][0]);
    $("#green-milcryst").val(data[2][1]);
    $("#green-heavycryst").val(data[2][2]);
    $("#green-giancryst").val(data[2][3]);
    $("#green-purecryst").val(data[2][4]);

    $("#power-alcryst").val(data[3][0]);
    $("#power-milcryst").val(data[3][1]);
    $("#power-heavycryst").val(data[3][2]);
    $("#power-giancryst").val(data[3][3]);
    $("#power-purecryst").val(data[3][4]);

    $("#guard-alcryst").val(data[4][0]);
    $("#guard-milcryst").val(data[4][1]);
    $("#guard-heavycryst").val(data[4][2]);
    $("#guard-giancryst").val(data[4][3]);
    $("#guard-purecryst").val(data[4][4]);

    $("#healing-alcryst").val(data[5][0]);
    $("#healing-milcryst").val(data[5][1]);
    $("#healing-heavycryst").val(data[5][2]);
    $("#healing-giancryst").val(data[5][3]);
    $("#healing-purecryst").val(data[5][4]);

    $("#support-alcryst").val(data[6][0]);
    $("#support-milcryst").val(data[6][1]);
    $("#support-heavycryst").val(data[6][2]);
    $("#support-giancryst").val(data[6][3]);
    $("#support-purecryst").val(data[6][4]);

    $("#tech-alcryst").val(data[7][0]);
    $("#tech-milcryst").val(data[7][1]);
    $("#tech-heavycryst").val(data[7][2]);
    $("#tech-giancryst").val(data[7][3]);
    $("#tech-purecryst").val(data[7][4]);
}

function loadSelectedEnhancements() {
    selectedEnhancements = JSON.parse(localStorage.getItem("enhancements")) || [];
}

function getCrysts() {
    return [
        [safeVal($("#white-alcryst")), safeVal($("#white-milcryst")), safeVal($("#white-heavycryst")), safeVal($("#white-giancryst")), safeVal($("#white-purecryst"))],
        [safeVal($("#black-alcryst")), safeVal($("#black-milcryst")), safeVal($("#black-heavycryst")), safeVal($("#black-giancryst")), safeVal($("#black-purecryst"))],
        [safeVal($("#green-alcryst")), safeVal($("#green-milcryst")), safeVal($("#green-heavycryst")), safeVal($("#green-giancryst")), safeVal($("#green-purecryst"))],
        [safeVal($("#power-alcryst")), safeVal($("#power-milcryst")), safeVal($("#power-heavycryst")), safeVal($("#power-giancryst")), safeVal($("#power-purecryst"))],
        [safeVal($("#guard-alcryst")), safeVal($("#guard-milcryst")), safeVal($("#guard-heavycryst")), safeVal($("#guard-giancryst")), safeVal($("#guard-purecryst"))],
        [safeVal($("#healing-alcryst")), safeVal($("#healing-milcryst")), safeVal($("#healing-heavycryst")), safeVal($("#healing-giancryst")), safeVal($("#healing-purecryst"))],
        [safeVal($("#support-alcryst")), safeVal($("#support-milcryst")), safeVal($("#support-heavycryst")), safeVal($("#support-giancryst")), safeVal($("#support-purecryst"))],
        [safeVal($("#tech-alcryst")), safeVal($("#tech-milcryst")), safeVal($("#tech-heavycryst")), safeVal($("#tech-giancryst")), safeVal($("#tech-purecryst"))]
    ];
}

function saveData() {
    materials = getCrysts();
    localStorage.setItem("inventory", JSON.stringify(materials));
    printSelectedEnhancements();
}

function saveSelectedEnhancements() {
    localStorage.setItem("enhancements", JSON.stringify(selectedEnhancements));
}

function safeVal($) {
    return isNaN($.val()) || $.val() == "" ? 0 : parseInt($.val());
}

function buildFilter() {
    $("#filterCrystOptions").empty();
    $("#filterCrystOptions").append($("<li data-type=\"all\" data-label=\"All\"><a href=\"#\">All</a></li>"))
        for (var i = 0; i < 8; i++) {
        $("#filterCrystOptions").append($("<li data-type=\"" + buildType(i) + "\" data-label=\"" + buildTypeName(i) + "\"><a href=\"javascript:void(0)\"><img class=\"matpic\" src=\"/img/items/" + buildImage(i, 4) + "\" />&nbsp;&nbsp;" + buildTypeName(i) + "</a></li>"))
    }
    $("#filterCrystOptions li").on("click", applyFilter);
}

function applyFilter() {
    if ($(this).attr("data-type") == "all") {
        $("table.mats tr[data-type]").show();
    } else {
        $("table.mats tr[data-type]").hide();
        $("table.mats tr[data-type=" + $(this).attr("data-type") + "]").show();
    }

    $("#filterCrystLabel").text($(this).attr("data-label"))
    currentFilter = $(this).attr("data-type");

    logEvent("filter", "display", "keyword", $(this).attr("data-label"));

    return true;
}

function addEnhancement() {
    var x = $("#skill").val();
    if (x == null || x == "") return;

    var all = x.split("|")
    for (var i in all) {
        var enh = enhancements.filter(function(t) { return t.id == all[i]; })[0];
        selectedEnhancements.push(enh);
        logEvent("add", "enhancements", units[enh.unit].name, enh.name);
    }
    saveSelectedEnhancements();
    printSelectedEnhancements();
}

function printSelectedEnhancements() {
    $("#selectedEnhancementsList").empty();
    $("#selectedEnhancementsList").hide();
    $("#noEnhacementsList").hide();

    if (selectedEnhancements.length == 0) {
        $("#noEnhacementsList").show();
        return;
    } else {
        $("#selectedEnhancementsList").show();
    }

    var totalGil = 0;
    remainingMats = [];
    for (var i = 0; i < 8; i++) {
        remainingMats.push([]);
        for (var j = 0; j < 5; j++) {
            remainingMats[i].push(materials[i][j]);
        }
    }

    for (var e in selectedEnhancements) {
        matOverflow = false;
        var enh = selectedEnhancements[e];

        // calculation
        var fi;
        var mats = transformMaterials(enh.materials);
        for (var i = 0; i < 8; i++) {
            if (mats[i][0] != 0) fi = i;
            for (var j = 0; j < 5; j++) {
                remainingMats[i][j] -= mats[i][j];
                if (remainingMats[i][j] < 0) {
                    //remainingMats[i][j] = 0;
                    if (mats[i][j] > 0) {
                        matOverflow = true;
                    }
                }
            }
        }

        var filterText = (currentFilter == "all" || currentFilter == buildType(fi)) ? "" : " style=\"display: none;\"";

        var text = "<tr data-type=\"" + buildType(fi) + "\" class=\"" + (matOverflow ? "danger" : "success") + "\"" + filterText + ">";
        // unit
        text += "<td>";
        text += "<img class=\"unitpic\" title=\"" + units[enh.unit].name + "\" src=\"/img/units/unit_ills_" + enh.unit + ".png\" />";
        text += "</td>";
        // skill
        text += "<td>";
        text += enh.name;
        text += "</td>";
        // materials
        text += "<td>";
        for (var i = 0; i < 8; i++) {
            if (mats[i][0] == 0) continue;
            for (var j = 0; j < 5; j++) {
                text += "<div class=\"matdiv\">"
                text += "<span class=\"matspan label label-primary\">" + mats[i][j] + "</span>";
                text += "<img class=\"matpic\" title=\"" + buildAlt(i, j) + "\" src=\"/img/items/" + buildImage(i, j) + "\" />";
                text += "</div>"
            }
        }

        text += "<div class=\"matsep\"><span class=\"glyphicon glyphicon-arrow-right\"/></div>"
        for (var j = 0; j < 5; j++) {
            text += "<div class=\"matdiv\">"
            text += "<span class=\"matspan label label-" + (remainingMats[fi][j] < 0 ? "danger" : "success") + "\">" + remainingMats[fi][j] + "</span>";
            text += "<img class=\"matpic\" title=\"" + buildAlt(fi, j) + "\" src=\"/img/items/" + buildImage(fi, j) + "\" />";
            text += "</div>"
        }

        text += "</td>";
        // gil
        text += "<td>";
        text += enh.gil.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        text += "<img class=\"gilpic\" title=\"" + units[enh.unit].name + "\" src=\"/img/gil.png\" />";
        text += "</td>";
        //actions
        text += "<td>";
        if (!matOverflow) {
            text += "<a class=\"btn btn-xs btn-success\" href=\"javascript:void(0)\" data-done=\"" + e + "\"><span class=\"glyphicon glyphicon-ok\" /> Done</a>&nbsp;";
        }
        if (e > 0) {
            text += "<a class=\"btn btn-xs btn-primary\" href=\"javascript:void(0)\" data-moveup=\"" + e + "\"><span class=\"glyphicon glyphicon-arrow-up\" /> Move</a>&nbsp;";
        }
        if (e < (selectedEnhancements.length - 1)) {
            text += "<a class=\"btn btn-xs btn-primary\" href=\"javascript:void(0)\" data-movedown=\"" + e + "\"><span class=\"glyphicon glyphicon-arrow-down\" /> Move</a>&nbsp;";
        }
        text += "<a class=\"btn btn-xs btn-danger\" href=\"javascript:void(0)\" data-delete=\"" + e + "\"><span class=\"glyphicon glyphicon-remove\" /> Remove</a>";
        text += "</td>";

        text += "</tr>";
        $("#selectedEnhancementsList").append($(text));
        totalGil += enh.gil;
    }
}

function removeEnhancement() {
    var i = $(this).attr("data-delete");
    var enh = selectedEnhancements[i];
    selectedEnhancements.splice(i, 1);
    saveSelectedEnhancements();
    printSelectedEnhancements();
    logEvent("remove", "enhancements", units[enh.unit].name, enh.name);
    return true;
}

function moveUpEnhancement() {
    var i = parseInt($(this).attr("data-moveup"));
    if (i == 0) return;
    var enh = selectedEnhancements[i];

    var tmp = selectedEnhancements[i - 1];
    selectedEnhancements[i - 1] = selectedEnhancements[i];
    selectedEnhancements[i] = tmp;

    saveSelectedEnhancements();
    printSelectedEnhancements();
    logEvent("moveUp", "enhancements", units[enh.unit].name, enh.name);
    return true;
}

function moveDownEnhancement() {
    var i = parseInt($(this).attr("data-movedown"));
    if (i == (selectedEnhancements.length - 1)) return;
    var enh = selectedEnhancements[i];

    var tmp = selectedEnhancements[i + 1];
    selectedEnhancements[i + 1] = selectedEnhancements[i];
    selectedEnhancements[i] = tmp;

    saveSelectedEnhancements();
    printSelectedEnhancements();
    logEvent("moveDown", "enhancements", units[enh.unit].name, enh.name);
    return true;
}

function doneEnhancements() {
    var i = $(this).attr("data-done");
    var enh = selectedEnhancements[i];
    selectedEnhancements.splice(i, 1);

    var mats = transformMaterials(enh.materials);
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 5; j++) {
            materials[i][j] -= mats[i][j];
        }
    }
    fillData(materials);
    saveData();

    saveSelectedEnhancements();
    printSelectedEnhancements();
    logEvent("done", "enhancements", units[enh.unit].name, enh.name);
    return true;
}

function buildType(i) {
    var data = ["white-cryst", "black-cryst", "green-cryst", "power-cryst", "guard-cryst", "healing-cryst", "support-cryst", "tech-cryst"];
    return data[i];
}

function buildTypeName(i) {
    var data = ["White", "Black", "Green", "Power", "Guard", "Healing", "Support", "Tech"];
    return data[i];
}

function buildAlt(i, j) {
    var data = [
        ["White Alcryst", "White Milcryst", "White Heavycryst", "White Giancryst", "White Purecryst"],
        ["Black Alcryst", "Black Milcryst", "Black Heavycryst", "Black Giancryst", "Black Purecryst"],
        ["Green Alcryst", "Green Milcryst", "Green Heavycryst", "Green Giancryst", "Green Purecryst"],
        ["Power Alcryst", "Power Milcryst", "Power Heavycryst", "Power Giancryst", "Power Purecryst"],
        ["Guard Alcryst", "Guard Milcryst", "Guard Heavycryst", "Guard Giancryst", "Guard Purecryst"],
        ["Healing Alcryst", "Healing Milcryst", "Healing Heavycryst", "Healing Giancryst", "Healing Purecryst"],
        ["Support Alcryst", "Support Milcryst", "Support Heavycryst", "Support Giancryst", "Support Purecryst"],
        ["Tech Alcryst", "Tech Milcryst", "Tech Heavycryst", "Tech Giancryst", "Tech Purecryst"]
    ];
    return data[i][j];
}

function buildImage(i, j) {
    var data = [
        ["item_8220.png", "item_8221.png", "item_8222.png", "item_8223.png", "item_8224.png"],
        ["item_8225.png", "item_8226.png", "item_8227.png", "item_8228.png", "item_8229.png"],
        ["item_8230.png", "item_8231.png", "item_8232.png", "item_8233.png", "item_8234.png"],
        ["item_8245.png", "item_8246.png", "item_8247.png", "item_8248.png", "item_8249.png"],
        ["item_8250.png", "item_8251.png", "item_8252.png", "item_8253.png", "item_8254.png"],
        ["item_8255.png", "item_8256.png", "item_8257.png", "item_8258.png", "item_8259.png"],
        ["item_8260.png", "item_8261.png", "item_8262.png", "item_8263.png", "item_8264.png"],
        ["item_8265.png", "item_8266.png", "item_8267.png", "item_8268.png", "item_8269.png"]
    ];
    return data[i][j];
}

function transformMaterials(materials) {
    return [
        [materials[270000100] || 0, materials[270000200] || 0, materials[270000300] || 0, materials[270000400] || 0, materials[270000500] || 0],
        [materials[270000600] || 0, materials[270000700] || 0, materials[270000800] || 0, materials[270000900] || 0, materials[270001000] || 0],
        [materials[270001100] || 0, materials[270001200] || 0, materials[270001300] || 0, materials[270001400] || 0, materials[270001500] || 0],
        [materials[270002600] || 0, materials[270002700] || 0, materials[270002800] || 0, materials[270002900] || 0, materials[270003000] || 0],
        [materials[270003100] || 0, materials[270003200] || 0, materials[270003300] || 0, materials[270003400] || 0, materials[270003500] || 0],
        [materials[270003600] || 0, materials[270003700] || 0, materials[270003800] || 0, materials[270003900] || 0, materials[270004000] || 0],
        [materials[270004100] || 0, materials[270004200] || 0, materials[270004300] || 0, materials[270004400] || 0, materials[270004500] || 0],
        [materials[270004600] || 0, materials[270004700] || 0, materials[270004800] || 0, materials[270004900] || 0, materials[270005000] || 0]
    ];
}

function logEvent(action, category, label, value) {
    if (window.location.host==="ffbeawakening.com" || window.location.host==="www.ffbeawakening.com") {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });          
    }
}