const DatiCopione = [];

CreaElemento('style', 'styleTestoGuida', document.body.id, `.TestoGuida-evidenziato {background-color: rgba(200, 255, 200); border-radius: 10px;}`);
const TestoGuida = CreaElemento('div', 'TestoGuida', 'ContenitoreVideoGuida'); TestoGuida.iStyle({position: "absolute", bottom: "50px", width: "100%", maxHeight: "20%", overflowY: "scroll", padding: "5px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "10pt", fontSize: "2vh", lineHeight: "3vh", textAlign: "left", textShadow: "1px 1px 1px aliceblue", opacity: 0, visibility: "hidden", transition: "500ms"});

const PatternRegexNomePersonaggio = "A-z0-9\.\(\) ", RegexNomePersonaggio_CaratteriNonAmmessi = new RegExp('[^' + PatternRegexNomePersonaggio + ']', 'g'), RegexNomePersonaggio_CaratteriAmmessi = new RegExp('[' + PatternRegexNomePersonaggio + ']', 'g');

var FunzioniCopione = {
    AggiornaTestoGuida: function (MinutaggioAttuale = VideoGuidaMinutaggioCorrente()) {
        clearTimeout(FunzioniCopione.tmr);
        (document.querySelector('.TestoGuida-evidenziato') || {}).className = '';

        const MinutiRange = 5;
        const PosizioneCopione = DatiCopione.find( el => ((MinutaggioAttuale - MinutiRange) < el.minutaggio) );
        ((PosizioneCopione) && (SezioneTesto = document.getElementById('RifCopione' + PosizioneCopione.NumID)) && (SezioneTesto.className = "TestoGuida-evidenziato") && (SezioneTesto.scrollIntoView({behavior: 'smooth', block: 'center'})));

        return DatiCopione.indexOf(PosizioneCopione);
    },

    AttivaTestoGuida: function () {
        clearTimeout(FunzioniCopione.tmr);
        const MinutaggioAttuale = VideoGuidaMinutaggioCorrente();
        const ElementoCopione = FunzioniCopione.AggiornaTestoGuida(MinutaggioAttuale);
        if ((ElementoCopione > -1) && (TestoSuccessivo = DatiCopione[+ElementoCopione + 1])) {
            FunzioniCopione.tmr = setTimeout(FunzioniCopione.AttivaTestoGuida, (TestoSuccessivo.minutaggio - MinutaggioAttuale) * 1000);
        }
    },

    DisattivaTestoGuida: function (Scompari = false) {
        clearTimeout(FunzioniCopione.tmr);
        if (Scompari) {FunzioniCopione.Scompari();}
    },

    Visualizza: function () {
        const totBT = DatiCopione.length;
        var Testo = "";
        for (let I = 0; I < totBT; I++) {
            Testo += "<div id='RifCopione" + DatiCopione[I].NumID + "'><br>" + DatiCopione[I].testo + "</div>";
        }
        TestoGuida.innerHTML = Testo.replace(/\n/g, '<br>').replace(new RegExp('<br>([' + PatternRegexNomePersonaggio + ']+):', 'g'), "<br style='line-height: 5px;'><b>$1</b>:");
        TestoGuida.iStyle({opacity: 1, visibility: "visible"});
    },

    Scompari: function () {
        TestoGuida.textContent = ""; 
        TestoGuida.iStyle({opacity: 0, visibility: "hidden"});
    },

    tmr: false,
};


