$(function() {
    $(".wheelable").bind("mousewheel", function(event, delta) {
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
     });
     $(".cryst input").on("change", saveData);

     loadData();
});

function loadData() {
    var data = JSON.parse(localStorage.getItem("inventory")) || [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];

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

function getCrysts() {
    returun [
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
    localStorage.setItem("inventory", JSON.stringify(getCrysts()));
}

function safeVal($) {
    return isNaN($.val()) || $.val() == "" ? 0 : parseInt($.val());
}