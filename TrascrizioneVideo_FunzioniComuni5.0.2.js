const DatiCopione = [];

CreaElemento('style', 'styleTestoGuida', document.body.id,
    `.TestoGuida-evidenziato {background-color: rgba(200, 255, 200); border-radius: 10px;}
     #ManigliaSposta_TestoGuida {width: fit-content; margin: 0px auto; cursor: pointer; font-size: 1.5vh;}
     #LatoSx_TestoGuida {position: absolute; top: 0px;    left: 0px; height: 100%; width: 1vh; cursor: col-resize;}
     #LatoDx_TestoGuida {position: absolute; top: 0px;   right: 0px; height: 100%; width: 1vh; cursor: col-resize;}
     #Tetto_TestoGuida  {position: absolute; top: 0px;    left: 0px; height: 1vh; width: 100%; cursor: row-resize;}
     #Base_TestoGuida   {position: absolute; bottom: 0px; left: 0px; height: 1vh; width: 100%; cursor: row-resize;}
     #TestoGuida:hover > #ManigliaSposta_TestoGuida {display: inline;}`
);
const ContenitoreTestoGuida = CreaElemento('div', 'ContenitoreTestoGuida', 'ContenitoreVideoGuida'); ContenitoreTestoGuida.iStyle({position: "fixed", top: "calc(" + ContenitoreVideoGuida.offsetHeight + "px - 20%)", left: "30%", right: "30%", bottom: "10%", overflowY: "scroll", padding: "5px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "10pt", fontSize: "1.5vh", lineHeight: "2vh", textAlign: "left", textShadow: "1px 1px 1px aliceblue", opacity: 0, visibility: "hidden", transition: "opacity 1s", userSelect: "none"});
const ManigliaSposta_TestoGuida = CreaElemento('div', 'ManigliaSposta_TestoGuida', 'ContenitoreTestoGuida', "<span class='fa fa-navicon'></span>"); ManigliaSposta_TestoGuida.onmousedown = SpostaTestoGuida_Attiva;
const LatoSx = CreaElemento('div', 'LatoSx_TestoGuida', 'ContenitoreTestoGuida'), LatoDx = CreaElemento('div', 'LatoDx_TestoGuida', 'ContenitoreTestoGuida'), Tetto = CreaElemento('div', 'Tetto_TestoGuida', 'ContenitoreTestoGuida'), Base = CreaElemento('div', 'Base_TestoGuida', 'ContenitoreTestoGuida'); LatoSx.onmousedown = RidimensionaTestoGuida_Attiva; LatoDx.onmousedown = RidimensionaTestoGuida_Attiva; Tetto.onmousedown = RidimensionaTestoGuida_Attiva; Base.onmousedown = RidimensionaTestoGuida_Attiva;
const TestoGuida = CreaElemento('div', 'TestoGuida', 'ContenitoreTestoGuida');


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

/*** Sposta testo guida col mouse ***/
function SpostaTestoGuida_Attiva(e) {
    const X = (e.clientX || e.touches[0].clientX);
    ContenitoreTestoGuida.style.cursor = 'grab';
    ContenitoreTestoGuida.dataset.posizionedelmouse = +X - ContenitoreTestoGuida.offsetLeft;
    ContenitoreTestoGuida.iStyle({width: ContenitoreTestoGuida.offsetWidth + "px", height: ContenitoreTestoGuida.offsetHeight + "px", right: '', bottom: ''});
    document.body.addEventListener('mousemove', SpostaTestoGuida);
    document.body.addEventListener('mouseup', SpostaTestoGuida_Disattiva);
}

function SpostaTestoGuida(e) {
    const X = (e.clientX || e.touches[0].clientX), Y = (e.clientY || e.touches[0].clientY);
    ContenitoreTestoGuida.iStyle({top: Y + "px", left: (+X - ContenitoreTestoGuida.dataset.posizionedelmouse) + "px"});
}

function SpostaTestoGuida_Disattiva() {
    ContenitoreTestoGuida.style.cursor = '';
    ContenitoreTestoGuida.iStyle({right: window.innerWidth - ContenitoreTestoGuida.offsetWidth - ContenitoreTestoGuida.offsetLeft + "px", bottom: window.innerHeight - ContenitoreTestoGuida.offsetHeight - ContenitoreTestoGuida.offsetTop + "px", width: '', height: ''});
    document.body.removeEventListener('mousemove', SpostaTestoGuida);
    document.body.removeEventListener('mouseup', SpostaTestoGuida_Disattiva);
}
/************************************/

/*** Ridimensiona testo guida col mouse ***/
function RidimensionaTestoGuida_Attiva(e) {
    const DaModificare = {'LatoSx_TestoGuida': {style: 'left', CoordinatePuntatore: 'clientX', MisuraDiPartenza: 0}, 'LatoDx_TestoGuida': {style: 'right', CoordinatePuntatore: 'clientX', MisuraDiPartenza: window.innerWidth}, 'Tetto_TestoGuida': {style: 'top', CoordinatePuntatore: 'clientY', MisuraDiPartenza: 0}, 'Base_TestoGuida': {style: 'bottom', CoordinatePuntatore: 'clientY', MisuraDiPartenza: window.innerHeight}};
    const DatiRidimensionamento = DaModificare[e.currentTarget.id];
    ContenitoreTestoGuida.dataset.styledamodificare = DatiRidimensionamento.style;
    ContenitoreTestoGuida.dataset.coordinatepuntatore = DatiRidimensionamento.CoordinatePuntatore;
    ContenitoreTestoGuida.dataset.misuradipartenza = DatiRidimensionamento.MisuraDiPartenza;
    document.body.addEventListener('mousemove', RidimensionaTestoGuida);
    document.body.addEventListener('mouseup',   RidimensionaTestoGuida_Disattiva);
}

function RidimensionaTestoGuida(e) {
    const Coordinata = (e[ContenitoreTestoGuida.dataset.coordinatepuntatore] || e.touches[0][ContenitoreTestoGuida.dataset.coordinatepuntatore]);
    ContenitoreTestoGuida.iStyle({[ContenitoreTestoGuida.dataset.styledamodificare]: (-ContenitoreTestoGuida.dataset.misuradipartenza + Coordinata) + "px"})
}

function RidimensionaTestoGuida_Disattiva() {
    document.body.removeEventListener('mousemove', RidimensionaTestoGuida);
    document.body.removeEventListener('mouseup',   RidimensionaTestoGuida_Disattiva);
}
/******************************************/
