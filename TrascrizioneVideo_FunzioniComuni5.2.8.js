const DatiCopione = [], PosizioneInizialeCopione = {top: "0px", left: "70%", right: "0px", bottom: "60%"};

CreaElemento('style', 'styleTestoGuida', document.body.id,
    `#ContenitoreTestoGuida {position: fixed; overflow-y: scroll; padding: 5px; background-color: rgba(255, 255, 255, 0.8); border-radius: 10pt; font-size: 1.5vh; line-height: 2vh; text-align: left; text-shadow: 1px 1px 1px aliceblue; border: 1px solid grey; opacity: 0; visibility: hidden; transition: opacity 1s; user-select: none;}
     #ManigliaSposta_TestoGuida {position: sticky; top: 0px; width: 100%; font-size: 1.5vh; cursor: row-resize; text-align: center; background-color: rgba(255, 255, 255, 0.6); z-index: 1;}
     #LatoSx_TestoGuida {position: absolute; top: 0px;              left: 0px; height: 100%; width: 3vh; cursor: col-resize; z-index: 1;}
     #LatoDx_TestoGuida {position: absolute; top: 0px;             right: 0px; height: 100%; width: 3vh; cursor: col-resize; z-index: 1;}
     #Base_TestoGuida   {position: sticky;   top: calc(100% - 3vh); left: 0px; height: 3vh; width: 100%; cursor: row-resize; z-index: 1;}
     #TestoGuida {position: relative; top: 1.5vh;} #TestoGuida div {cursor: pointer;} #TestoGuida div:hover {background-color: rgba(0, 200, 200, 0.2);}
     .TestoGuida-evidenziato {background-color: rgb(200, 255, 200); border-radius: 10px;}`
);
const ContenitoreTestoGuida = CreaElemento('div', 'ContenitoreTestoGuida', document.body.id); ContenitoreTestoGuida.iStyle(PosizioneInizialeCopione);
const ManigliaSposta_TestoGuida = CreaElemento('div', 'ManigliaSposta_TestoGuida', 'ContenitoreTestoGuida', "<span class='fa fa-navicon' style='cursor: move;'></span>"); ManigliaSposta_TestoGuida.onmousedown = RidimensionaTestoGuida_Attiva; ManigliaSposta_TestoGuida.children[0].onmousedown = SpostaTestoGuida_Attiva;
const LatoSx = CreaElemento('div', 'LatoSx_TestoGuida', 'ContenitoreTestoGuida'), LatoDx = CreaElemento('div', 'LatoDx_TestoGuida', 'ContenitoreTestoGuida'), Base = CreaElemento('div', 'Base_TestoGuida', 'ContenitoreTestoGuida'); LatoSx.onmousedown = RidimensionaTestoGuida_Attiva; LatoDx.onmousedown = RidimensionaTestoGuida_Attiva; Base.onmousedown = RidimensionaTestoGuida_Attiva;
const TestoGuida = CreaElemento('div', 'TestoGuida', 'ContenitoreTestoGuida');


const PatternRegexNomePersonaggio = "A-z0-9\.\(\) ", RegexNomePersonaggio_CaratteriNonAmmessi = new RegExp('[^' + PatternRegexNomePersonaggio + ']', 'g'), RegexNomePersonaggio_CaratteriAmmessi = new RegExp('[' + PatternRegexNomePersonaggio + ']', 'g');

var FunzioniCopione = {
    AggiornaTestoGuida: function (MinutaggioAttuale = VideoGuidaMinutaggioCorrente()) {
        clearTimeout(FunzioniCopione.tmr);
        (document.querySelector('.TestoGuida-evidenziato') || {}).className = '';

        const PosizioneCopione = DatiCopione.find( el => ((el.minutaggio <= MinutaggioAttuale) && (MinutaggioAttuale < ((DatiCopione[+DatiCopione.indexOf(el) + 1]) || ({minutaggio: totDurataVideoGuida})).minutaggio)) );
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
            Testo += "<div id='RifCopione" + DatiCopione[I].NumID + "' data-numid='" + DatiCopione[I].NumID + "' onclick='FunzioniCopione.PosizionaVideo(event);'><br>" + DatiCopione[I].testo + "</div>";
        }
        TestoGuida.innerHTML = Testo.replace(/\n/g, '<br>').replace(new RegExp('<br>([' + PatternRegexNomePersonaggio + ']+):', 'g'), "<br style='line-height: 5px;'><b>$1</b>:");
        ContenitoreTestoGuida.iStyle({opacity: 1, visibility: "visible"});
    },

    Scompari: function () {
        TestoGuida.textContent = ""; 
        ContenitoreTestoGuida.iStyle({opacity: 0, visibility: "hidden"});
    },

    PosizionaVideo: function (e) {        
        FunzioniCopione.FunzionePosizionaVideo(TrovaDatiCopioneID(e.currentTarget.dataset.numid).minutaggio);
    },

    FunzionePosizionaVideo: function () {},

    tmr: false,
};

/*** Varie ***/
function TrovaDatiCopioneID(NumID) {
    return DatiCopione.find(el => el.NumID == NumID);
}
/*************/

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
    ContenitoreTestoGuida.iStyle({top: (Y / window.innerHeight * 100) + "%", left: ((+X - ContenitoreTestoGuida.dataset.posizionedelmouse) / window.innerWidth * 100) + "%"});
}

function SpostaTestoGuida_Disattiva() {
    ContenitoreTestoGuida.style.cursor = '';
    ContenitoreTestoGuida.iStyle({right: ((window.innerWidth - ContenitoreTestoGuida.offsetWidth - ContenitoreTestoGuida.offsetLeft) / window.innerWidth * 100) + "%", bottom: ((window.innerHeight - ContenitoreTestoGuida.offsetHeight - ContenitoreTestoGuida.offsetTop) / window.innerHeight * 100) + "%", width: '', height: ''});
    document.body.removeEventListener('mousemove', SpostaTestoGuida);
    document.body.removeEventListener('mouseup', SpostaTestoGuida_Disattiva);
}
/************************************/

/*** Ridimensiona testo guida col mouse ***/
function RidimensionaTestoGuida_Attiva(e) {
    const DaModificare = {'LatoSx_TestoGuida': {style: 'left', CoordinatePuntatore: 'clientX', MisuraDiPartenza: 0, MisuraComparazione: +window.innerWidth}, 'LatoDx_TestoGuida': {style: 'right', CoordinatePuntatore: 'clientX', MisuraDiPartenza: +window.innerWidth, MisuraComparazione: +window.innerWidth}, 'ManigliaSposta_TestoGuida': {style: 'top', CoordinatePuntatore: 'clientY', MisuraDiPartenza: 0, MisuraComparazione: +window.innerHeight}, 'Base_TestoGuida': {style: 'bottom', CoordinatePuntatore: 'clientY', MisuraDiPartenza: +window.innerHeight, MisuraComparazione: +window.innerHeight}};
    const DatiRidimensionamento = DaModificare[e.currentTarget.id];
    ContenitoreTestoGuida.dataset.styledamodificare = DatiRidimensionamento.style;
    ContenitoreTestoGuida.dataset.coordinatepuntatore = DatiRidimensionamento.CoordinatePuntatore;
    ContenitoreTestoGuida.dataset.misuradipartenza = DatiRidimensionamento.MisuraDiPartenza;
    ContenitoreTestoGuida.dataset.misuracomparazione = DatiRidimensionamento.MisuraComparazione;
    document.body.addEventListener('mousemove', RidimensionaTestoGuida);
    document.body.addEventListener('mouseup',   RidimensionaTestoGuida_Disattiva);
}

function RidimensionaTestoGuida(e) {
    const Coordinata = (e[ContenitoreTestoGuida.dataset.coordinatepuntatore] || e.touches[0][ContenitoreTestoGuida.dataset.coordinatepuntatore]);
    ContenitoreTestoGuida.iStyle({[ContenitoreTestoGuida.dataset.styledamodificare]: Math.abs((ContenitoreTestoGuida.dataset.misuradipartenza - Coordinata) / ContenitoreTestoGuida.dataset.misuracomparazione * 100) + "px"})
}

function RidimensionaTestoGuida_Disattiva() {
    document.body.removeEventListener('mousemove', RidimensionaTestoGuida);
    document.body.removeEventListener('mouseup',   RidimensionaTestoGuida_Disattiva);
}
/******************************************/
