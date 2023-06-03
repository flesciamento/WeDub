const DatiCopione = [];

CreaElemento('style', 'styleTestoGuida', document.body.id,
    `.TestoGuida-evidenziato {background-color: rgba(200, 255, 200); border-radius: 10px;}
     #ManigliaSposta_TestoGuida {position: absolute; top: 0px; width: fit-content; margin: 0px auto; cursor: pointer;}
     #TestoGuida:hover > #ManigliaSposta_TestoGuida {display: inline;}`
);
const ContenitoreTestoGuida = CreaElemento('div', 'ContenitoreTestoGuida', 'ContenitoreVideoGuida'); ContenitoreTestoGuida.iStyle({position: "fixed", top: "calc(" + ContenitoreVideoGuida.offsetHeight + "px - 20%)", right: "30%", width: ContenitoreVideoGuida.offsetWidth, height: "20%", overflowY: "scroll", padding: "5px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "10pt", fontSize: "1.5vh", lineHeight: "2vh", textAlign: "left", textShadow: "1px 1px 1px aliceblue", opacity: 0, visibility: "hidden", transition: "500ms"});
const TestoGuida = CreaElemento('div', 'TestoGuida', 'ContenitoreTestoGuida');
const ManigliaSposta_TestoGuida = CreaElemento('div', 'MenuTestoGuida', 'TestoGuida'); ManigliaSposta_TestoGuida.className = 'fa fa-navicon'; ManigliaSposta_TestoGuida.onmousedown = SpostaTestoGuida_Attiva;

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
        ContenitoreTestoGuida.iStyle({opacity: 1, visibility: "visible"});
    },

    Scompari: function () {
        TestoGuida.textContent = ""; 
        ContenitoreTestoGuida.iStyle({opacity: 0, visibility: "hidden"});
    },

    tmr: false,
};

function SpostaTestoGuida_Attiva(e) {
    const X = (e.clientX || e.touches[0].clientX);
    TestoGuida.style.cursor = "grab";
    TestoGuida.dataset.posizionedelmouse = +X - TestoGuida.offsetLeft;
    document.body.addEventListener('mousemove', SpostaTestoGuida);
    document.body.addEventListener('mouseup', SpostaTestoGuida_Disattiva);
}

function SpostaTestoGuida(e) {
    const X = (e.clientX || e.touches[0].clientX), Y = (e.clientY || e.touches[0].clientY);
    TestoGuida.iStyle({top: Y + "px", left: (+X - TestoGuida.dataset.posizionedelmouse) + "px"});
}

function SpostaTestoGuida_Disattiva() {
    TestoGuida.style.cursor = "";
    document.body.removeEventListener('mousemove', SpostaTestoGuida);
    document.body.removeEventListener('mouseup', SpostaTestoGuida_Disattiva);
}

