'use strict';

app.factory("Formater", function(){
    var Formater = {};

    Formater.timestampToAgo = function(_timestamp) {
        var createdDate = Math.round(_timestamp/1000),
            currentDate = Math.round(new Date().getTime()/1000),
            difference  = currentDate - createdDate,
            lengths     = ["60","60","24","7","4.35","12","10"],
            i           = 0;

        for(i; difference >= lengths[i]; i++) {
            difference /= lengths[i];
        }

        difference = Math.round(difference);

        return formateTimestampToAgo(difference, i);

    };

    function formateTimestampToAgo(_difference, _pIdx) {
        var periodes    = ["Sekunden", "Minuten", "Stunden", "Tage", "Wochen", "Monaten", "Jahre", "Jahrzehnte"];

        if(_difference == 1) {
            periodes[_pIdx] = periodes[_pIdx].substring(0, periodes[_pIdx].length-1);
        }

        return (_pIdx != 0) ? "vor " + _difference + " " + periodes[_pIdx] : "vor wenigen Sekunden";
    }



    //thanks to Patrick Desjardins (http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript)
    Formater.floatToMoney = function(n) {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "," : d,
            t = t == undefined ? "." : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    return Formater;
});