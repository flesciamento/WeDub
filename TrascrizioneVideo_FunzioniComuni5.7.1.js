const DatiCopione = [], PosizioneDefaultCopione = {top: "0px", left: "70%", right: "0px", bottom: "60%", fontSize: "14px", lineHeight: "15px"};

CreaElemento('style', 'styleTestoGuida', document.body.id = 'bodyPagina',
    `#ContenitoreTestoGuida {position: fixed; overflow-y: scroll; padding: 5px; background-color: rgba(255, 255, 255, 0.9); border-radius: 10pt; line-height: 16px; text-align: left; text-shadow: 1px 1px 1px aliceblue; border: 1px solid grey; opacity: 0; visibility: hidden; transition: opacity 1s; user-select: none; z-index: 10000000;}
     #ManigliaSposta_TestoGuida {position: sticky; top: 0px; width: 100%; font-size: 1.5vh; cursor: row-resize; text-align: center; background-color: rgba(255, 255, 255, 0.6); z-index: 1;}
     #LatoSx_TestoGuida {position: sticky; top: 0px;              left: 0px; height: 100%; width: 3vh; cursor: col-resize; float: left;  z-index: 1;}
     #LatoDx_TestoGuida {position: sticky; top: 0px; left: calc(100% - 3vh); height: 100%; width: 3vh; cursor: col-resize; float: right; z-index: 1;}
     #Base_TestoGuida   {position: sticky; top: calc(100% - 3vh); left: 0px; height: 3vh; width: 100%; cursor: row-resize; z-index: 1;}
     #ImgAttesaTestoGuida {margin: 10px; display: none;}
     #TestoGuida {position: absolute; top: 1.5vh; text-align: justify; padding-right: 5px;} #TestoGuida div {cursor: pointer;} #TestoGuida div:hover {background-image: linear-gradient(rgba(0, 200, 200, 0.2), rgba(0, 200, 200, 0));}
     .TestoGuida-evidenziato {background-color: rgb(200, 255, 200); border-radius: 10px;} .TestoGuida-evidenziato-lieve {background-image: linear-gradient(rgba(0, 255, 255, 0), rgba(200, 255, 200, 0.5), rgba(200, 255, 200, 0.9), rgba(200, 255, 200, 0.1)); .TestoGuida-evidenziato-no {}}`
);
const ContenitoreTestoGuida = CreaElemento('div', 'ContenitoreTestoGuida', document.body.id); ContenitoreTestoGuida.iStyle(PosizioneDefaultCopione);
const ManigliaSposta_TestoGuida = CreaElemento('div', 'ManigliaSposta_TestoGuida', 'ContenitoreTestoGuida', `<span id='OpzSposta_TestoGuida' class="fa fa-navicon" style="cursor: move;"></span>&nbsp;&nbsp;<span id='OpzRiduciTesto_TestoGuida' data-variazione='-1' style="font-size: 75%; cursor: pointer;" class="fa fa-font"></span><sup style="font-size: 5px;" class="fa fa-minus"></sup>&nbsp;&nbsp;<span id='OpzAumTesto_TestoGuida' data-variazione='1' class="fa fa-font" style="cursor: pointer;"></span><sup style="font-size: 8px;" class="fa fa-plus"></sup>`);
const LatoSx_TestoGuida = CreaElemento('div', 'LatoSx_TestoGuida', 'ContenitoreTestoGuida'), LatoDx_TestoGuida = CreaElemento('div', 'LatoDx_TestoGuida', 'ContenitoreTestoGuida'), Base_TestoGuida = CreaElemento('div', 'Base_TestoGuida', 'ContenitoreTestoGuida');
const TestoGuida = CreaElemento('div', 'TestoGuida', 'ContenitoreTestoGuida');
const ImgAttesaTestoGuida = CreaElemento('div', 'ImgAttesaTestoGuida', 'ContenitoreTestoGuida', "<span class='fa fa-spin fa-spinner'></span>");

const PatternRegexNomePersonaggio = "A-z0-9\.\(\) ", RegexNomePersonaggio_CaratteriNonAmmessi = new RegExp('[^' + PatternRegexNomePersonaggio + ']', 'g'), RegexNomePersonaggio_CaratteriAmmessi = new RegExp('[' + PatternRegexNomePersonaggio + ']', 'g');

var FunzioniCopione = {
    /*** Funzioni principali ***/
    AggiornaTestoGuida: function (MinutaggioAttuale = VideoGuidaMinutaggioCorrente()) {
        clearTimeout(FunzioniCopione.tmr);
        (document.querySelector('.' + FunzioniCopione.ClasseEvidenziaBattuta) || {}).className = '';

        const PosizioneCopione = DatiCopione.find( el => ((el.minutaggio <= MinutaggioAttuale) && (MinutaggioAttuale < ((DatiCopione[+DatiCopione.indexOf(el) + 1]) || ({minutaggio: totDurataVideoGuida})).minutaggio)) );
        ((PosizioneCopione) && (SezioneTesto = document.getElementById('RifCopione' + PosizioneCopione.NumID)) && (SezioneTesto.className = FunzioniCopione.ClasseEvidenziaBattuta) && (SezioneTesto.scrollIntoView({behavior: 'smooth', block: 'center'})));

        return DatiCopione.indexOf(PosizioneCopione);
    },

    AttivaTestoGuida: function () {
        clearTimeout(FunzioniCopione.tmr);
        const MinutaggioAttuale = VideoGuidaMinutaggioCorrente();
        const ElementoCopione = FunzioniCopione.AggiornaTestoGuida(MinutaggioAttuale);
        if (TestoSuccessivo = DatiCopione[+ElementoCopione + 1]) {
            FunzioniCopione.tmr = setTimeout(FunzioniCopione.AttivaTestoGuida, (TestoSuccessivo.minutaggio - MinutaggioAttuale) * 1000);
        }
    },

    DisattivaTestoGuida: function (Scompari = false) {
        clearTimeout(FunzioniCopione.tmr);
        if (Scompari) {FunzioniCopione.Scompari();}
    },

    Visualizza: function () {
        const totBT = DatiCopione.length, FunzioneOnClickBattuta = (FunzioniCopione.CopioneCliccabile? "onclick='FunzioniCopione.PosizionaVideo(event);'" : '');;
        var Testo = "";
        for (let I = 0; I < totBT; I++) {
            Testo += "<div id='RifCopione" + DatiCopione[I].NumID + "' data-numid='" + DatiCopione[I].NumID + "' " + FunzioneOnClickBattuta + "><br>" + DatiCopione[I].testo + "</div>";
        }
        TestoGuida.innerHTML = Testo.replace(/\n/g, '<br>').replace(new RegExp('<br>([' + PatternRegexNomePersonaggio + ']+):', 'g'), "<br style='line-height: 5px;'><b>$1</b>:") + "<br style='line-height: 4vh;' />";
        ContenitoreTestoGuida.iStyle({opacity: 1, visibility: "visible"});
        FunzioniCopione.CopioneVisualizzato = true;
        FunzioniCopione.Eventi(true);
    },

    Scompari: function () {
        TestoGuida.textContent = ""; 
        ContenitoreTestoGuida.iStyle({opacity: 0, visibility: "hidden"});
        FunzioniCopione.CopioneVisualizzato = false;
        FunzioniCopione.Eventi(false);
    },

    PosizionaVideo: function (e) {
        const BloccoTestoCliccato = e.currentTarget, Minutaggio = TrovaDatiCopioneID(BloccoTestoCliccato.dataset.numid).minutaggio;
        if (Math.round(VideoGuidaMinutaggioCorrente()) == Math.round(Minutaggio)) {return;}
        FunzioniCopione.FunzionePosizionaVideo(Minutaggio);
        FunzioniCopione.DisattivaCopione(BloccoTestoCliccato);
    },

    FunzionePosizionaVideo: function () {},
    /************************/

    /*** Salva la posizione e la dimensione del copione ***/
    SalvaPosizioneCopione: function () {
        AJAX("TrascrizioneVideo_SalvaPosizioneCopione.php", "top=" + encodeURIComponent(ContenitoreTestoGuida.style.top) + "&left=" + encodeURIComponent(ContenitoreTestoGuida.style.left) + "&right=" + encodeURIComponent(ContenitoreTestoGuida.style.right) + "&bottom=" + encodeURIComponent(ContenitoreTestoGuida.style.bottom) + "&fontSize=" + encodeURIComponent(ContenitoreTestoGuida.style.fontSize), "", "", "", true);
    },
    /******************************************************/

    /*** Attiva/Disattiva copione ***/
    DisattivaCopione: function (BloccoTesto = false) {
        if (BloccoTesto) {BloccoTesto.append(ImgAttesaTestoGuida); ImgAttesaTestoGuida.style.display = "inline";}
        TestoGuida.iStyle({pointerEvents: 'none', opacity: FunzioniCopione.OpacitaCopioneDisattivato});
    },

    RiattivaCopione: function () {
        ImgAttesaTestoGuida.style.display = "none";
        TestoGuida.iStyle({pointerEvents: 'auto', opacity: 1});
    },
    /********************************/

    /*** Attiva/Disattiva eventi ***/
    Eventi: function (Attiva) {
        const OpzSposta_TestoGuida = document.getElementById('OpzSposta_TestoGuida'), OpzRiduciTesto_TestoGuida = document.getElementById('OpzRiduciTesto_TestoGuida'), OpzAumTesto_TestoGuida = document.getElementById('OpzAumTesto_TestoGuida');
        OpzSposta_TestoGuida.onmousedown = OpzSposta_TestoGuida.ontouchstart = (Attiva? FunzioniCopione.SpostaTestoGuida_Attiva : '');
        OpzRiduciTesto_TestoGuida.onmousedown = OpzAumTesto_TestoGuida.onmousedown = (Attiva? FunzioniCopione.ModificaDimensioniTesto : '');
        ManigliaSposta_TestoGuida.onmousedown = ManigliaSposta_TestoGuida.ontouchstart = LatoSx_TestoGuida.onmousedown = LatoSx_TestoGuida.ontouchstart = LatoDx_TestoGuida.onmousedown = LatoDx_TestoGuida.ontouchstart = Base_TestoGuida.onmousedown = Base_TestoGuida.ontouchstart = (Attiva? FunzioniCopione.RidimensionaTestoGuida_Attiva : '');
    },
    /*******************************/

    /*** Sposta e ridimensiona ***/
    /** Sposta copione col mouse **/
    SpostaTestoGuida_Attiva: function (e) {
        const X = (e.clientX || e.touches[0].clientX);
        ContenitoreTestoGuida.style.cursor = 'grab';
        ContenitoreTestoGuida.dataset.posizionedelmouse = +X - ContenitoreTestoGuida.offsetLeft;
        ContenitoreTestoGuida.iStyle({width: ContenitoreTestoGuida.offsetWidth + "px", height: ContenitoreTestoGuida.offsetHeight + "px", right: '', bottom: ''});
        document.body.addEventListener('mousemove', FunzioniCopione.SpostaTestoGuida);           document.body.addEventListener('touchmove', FunzioniCopione.SpostaTestoGuida);
        document.body.addEventListener('mouseup',   FunzioniCopione.SpostaTestoGuida_Disattiva); document.body.addEventListener('touchend',  FunzioniCopione.SpostaTestoGuida_Disattiva);
       
        FunzioniCopione.DisattivaVideoGuida();
    },

    SpostaTestoGuida: function (e) {
        const X = (e.clientX || e.touches[0].clientX), Y = (e.clientY || e.touches[0].clientY);
        e.preventDefault(); e.stopPropagation();
        ContenitoreTestoGuida.iStyle({top: (Y / window.innerHeight * 100) + "%", left: ((+X - ContenitoreTestoGuida.dataset.posizionedelmouse) / window.innerWidth * 100) + "%"});
    },

    SpostaTestoGuida_Disattiva: function () {
        ContenitoreTestoGuida.style.cursor = '';
        ContenitoreTestoGuida.iStyle({right: ((window.innerWidth - ContenitoreTestoGuida.offsetWidth - ContenitoreTestoGuida.offsetLeft) / window.innerWidth * 100) + "%", bottom: ((window.innerHeight - ContenitoreTestoGuida.offsetHeight - ContenitoreTestoGuida.offsetTop) / window.innerHeight * 100) + "%", width: '', height: ''});
        document.body.removeEventListener('mousemove', FunzioniCopione.SpostaTestoGuida);           document.body.removeEventListener('touchmove', FunzioniCopione.SpostaTestoGuida);
        document.body.removeEventListener('mouseup',   FunzioniCopione.SpostaTestoGuida_Disattiva); document.body.removeEventListener('touchend',  FunzioniCopione.SpostaTestoGuida_Disattiva);
        FunzioniCopione.SalvaPosizioneCopione();

        FunzioniCopione.RiattivaVideoGuida();
    },

    /** Ridimensiona copione col mouse **/
    RidimensionaTestoGuida_Attiva: function (e) {
        const DaModificare = {'LatoSx_TestoGuida': {style: 'left', CoordinatePuntatore: 'clientX', MisuraDiPartenza: 0, MisuraComparazione: +window.innerWidth}, 'LatoDx_TestoGuida': {style: 'right', CoordinatePuntatore: 'clientX', MisuraDiPartenza: +window.innerWidth, MisuraComparazione: +window.innerWidth}, 'ManigliaSposta_TestoGuida': {style: 'top', CoordinatePuntatore: 'clientY', MisuraDiPartenza: 0, MisuraComparazione: +window.innerHeight}, 'Base_TestoGuida': {style: 'bottom', CoordinatePuntatore: 'clientY', MisuraDiPartenza: +window.innerHeight, MisuraComparazione: +window.innerHeight}};
        const DatiRidimensionamento = DaModificare[e.currentTarget.id];
        ContenitoreTestoGuida.dataset.styledamodificare     = DatiRidimensionamento.style;
        ContenitoreTestoGuida.dataset.coordinatepuntatore   = DatiRidimensionamento.CoordinatePuntatore;
        ContenitoreTestoGuida.dataset.misuradipartenza      = DatiRidimensionamento.MisuraDiPartenza;
        ContenitoreTestoGuida.dataset.misuracomparazione    = DatiRidimensionamento.MisuraComparazione;
        document.body.addEventListener('mousemove', FunzioniCopione.RidimensionaTestoGuida);           document.body.addEventListener('touchmove', FunzioniCopione.RidimensionaTestoGuida);
        document.body.addEventListener('mouseup',   FunzioniCopione.RidimensionaTestoGuida_Disattiva); document.body.addEventListener('touchend',  FunzioniCopione.RidimensionaTestoGuida_Disattiva);

        FunzioniCopione.DisattivaVideoGuida();
    },

    RidimensionaTestoGuida: function (e) {
        const Coordinata = (e[ContenitoreTestoGuida.dataset.coordinatepuntatore] || e.touches[0][ContenitoreTestoGuida.dataset.coordinatepuntatore]);
        e.preventDefault(); e.stopPropagation();
        ContenitoreTestoGuida.style[ContenitoreTestoGuida.dataset.styledamodificare] = Math.abs((ContenitoreTestoGuida.dataset.misuradipartenza - Coordinata) / ContenitoreTestoGuida.dataset.misuracomparazione * 100) + "%";
    },

    RidimensionaTestoGuida_Disattiva: async function () {
        const soglia_altezza = 200, soglia_larghezza = 350;

        document.body.removeEventListener('mousemove', FunzioniCopione.RidimensionaTestoGuida);           document.body.removeEventListener('touchmove', FunzioniCopione.RidimensionaTestoGuida);
        document.body.removeEventListener('mouseup',   FunzioniCopione.RidimensionaTestoGuida_Disattiva); document.body.removeEventListener('touchend',  FunzioniCopione.RidimensionaTestoGuida_Disattiva);

        if (ContenitoreTestoGuida.offsetHeight < soglia_altezza)   {ContenitoreTestoGuida.style.height = soglia_altezza + "px";  await pausa(100); ContenitoreTestoGuida.style.bottom = ((window.innerHeight - ContenitoreTestoGuida.offsetTop - ContenitoreTestoGuida.offsetHeight) / window.innerHeight * 100) + "%"; await pausa(100); ContenitoreTestoGuida.style.height = "";}
        if (ContenitoreTestoGuida.offsetWidth  < soglia_larghezza) {ContenitoreTestoGuida.style.width = soglia_larghezza + "px"; await pausa(100); ContenitoreTestoGuida.style.right = ((window.innerWidth - ContenitoreTestoGuida.offsetLeft - ContenitoreTestoGuida.offsetWidth) / window.innerWidth * 100) + "%";    await pausa(100); ContenitoreTestoGuida.style.width = "";}

        FunzioniCopione.SalvaPosizioneCopione();

        FunzioniCopione.RiattivaVideoGuida();
    },
    /*************************/

    ModificaDimensioniTesto: function (e) {
        const dimensionetestoattuale = parseInt(ContenitoreTestoGuida.style.fontSize), variazione = e.currentTarget.dataset.variazione;

        var nuovadimensione = (+dimensionetestoattuale) + (+variazione);

        const sogliaminima = 8, sogliamassima = 30, condizionesogliaminima = (nuovadimensione >= sogliaminima), condizionesogliamassima = (nuovadimensione <= sogliamassima);

        ContenitoreTestoGuida.style.fontSize = ((nuovadimensione * condizionesogliaminima * condizionesogliamassima) + (sogliaminima * !condizionesogliaminima) + (sogliamassima * !condizionesogliamassima)) + "px";
        ContenitoreTestoGuida.style.lineHeight = ContenitoreTestoGuida.style.fontSize;

        FunzioniCopione.SalvaPosizioneCopione();

        FunzioniCopione.RiattivaVideoGuida(); // Potrebbe averlo disattivato intercettando gli altri eventi
    },

    DisattivaVideoGuida: function () {
        const VG = document.getElementById('VideoGuida');
        VG.dataset.pointerEvents = (VG.style.pointerEvents || '');
        setTimeout(() => {VG.style.pointerEvents = 'none';}, 100);
    },

    RiattivaVideoGuida: function () {
        const VG = document.getElementById('VideoGuida');
        VG.style.pointerEvents = VG.dataset.pointerEvents;
    },
    /****************************/

    /*** Proprietà ***/
    CopioneVisualizzato: false,
    CopioneCliccabile: true,
    ClasseEvidenziaBattuta: "TestoGuida-evidenziato-lieve",
    OpacitaCopioneDisattivato: 0.6,
    /*****************/

    /*** Timer ***/
    tmr: false
    /*************/
};

/*** Caricamento iniziale posizione copione ***/
setTimeout(() => {AJAX("TrascrizioneVideo_CaricaPosizioneCopione.php", "", (Dati) => {if (!Dati.NessunaPosizioneSalvata) {ContenitoreTestoGuida.iStyle(Object.assign({}, PosizioneDefaultCopione, Dati)); ContenitoreTestoGuida.style.lineHeight = ContenitoreTestoGuida.style.fontSize;}}, "", "", true);}, 100);
/**********************************************/

/*** Varie ***/
function TrovaDatiCopioneID(NumID) {
    return DatiCopione.find(el => el.NumID == NumID);
}
/*************/