const DatiCopione = [];

const TestoGuida = CreaElemento('div', 'TestoGuida', document.body.id); TestoGuida.iStyle({position: "fixed", top: "0", right: "5px", width: "20%", padding: "5px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "10pt", fontSize: "2vh", lineHeight: "3vh", textShadow: "1px 1px 1px aliceblue", opacity: 0, visibility: "hidden", transition: "500ms"});

const PatternRegexNomePersonaggio = "A-z0-9\.\(\) ", RegexNomePersonaggio_CaratteriNonAmmessi = new RegExp('[^' + PatternRegexNomePersonaggio + ']', 'g'), RegexNomePersonaggio_CaratteriAmmessi = new RegExp('[' + PatternRegexNomePersonaggio + ']', 'g');

var FunzioniCopione = {
    AggiornaTestoGuida: function (MinutaggioAttuale = VideoGuidaMinutaggioCorrente()) {
        clearTimeout(FunzioniCopione.tmr);
        const MinutiRange = 15;
        var Testo = "";
        const MappaRange = DatiCopione.map( el => (((MinutaggioAttuale - MinutiRange) < el.minutaggio) && (el.minutaggio < (+MinutaggioAttuale + MinutiRange))) );
        const PrimoElemento = MappaRange.indexOf(true), UltimoElemento = MappaRange.lastIndexOf(true);
        if (PrimoElemento > -1) {
            for (let I = PrimoElemento; I <= UltimoElemento; I++) {
                Testo += "\n\n" + DatiCopione[I].testo;
            }
            TestoGuida.innerHTML = Testo.trim().replace(/\n/g, '<br>').replace(new RegExp('<br>([' + PatternRegexNomePersonaggio + ']+):', 'g'), '<br><b>$1</b>:');
            FunzioniCopione.Visualizza();
        }

        return UltimoElemento;
    },

    AttivaTestoGuida: function () {
        console.log("AttivaTestoGuida");
        clearTimeout(FunzioniCopione.tmr);
        const MinutaggioAttuale = VideoGuidaMinutaggioCorrente();
        const UltimoElemento = FunzioniCopione.AggiornaTestoGuida(MinutaggioAttuale);
        if (TestoSuccessivo = DatiCopione[+UltimoElemento + 1]) {
            FunzioniCopione.tmr = setTimeout(FunzioniCopione.AggiornaTestoGuida, (TestoSuccessivo.minutaggio - MinutaggioAttuale) * 1000);
        }
    },

    DisattivaTestoGuida: function (Scompari = false) {
        console.log("DisattivaTestoGuida");
        clearTimeout(FunzioniCopione.tmr);
        if (Scompari) {FunzioniCopione.Scompari();}
    },

    Visualizza: function () {
        TestoGuida.iStyle({opacity: 1, visibility: "visible"});
    },

    Scompari: function () {
        TestoGuida.textContent = ""; 
        TestoGuida.iStyle({opacity: 0, visibility: "hidden"});
    },

    tmr: false,
};


