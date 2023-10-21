const PosizioneDefaultCopione = {top: "0px", left: "70%", right: "0px", bottom: "60%", fontSize: "14px", lineHeight: "15px"};
var DatiCopione = [];

CreaElemento('style', 'styleTestoGuida', document.body.id = 'bodyPagina',
    `#ContenitoreTestoGuida {position: fixed; overflow-y: scroll; padding: 5px; background-color: rgba(255, 255, 255, 0.9); border-radius: 10pt; line-height: 16px; text-align: left; text-shadow: 1px 1px 1px aliceblue; border: 1px solid grey; opacity: 0; visibility: hidden; transition: opacity 1s; user-select: none; z-index: 10000000;}
     #ManigliaSposta_TestoGuida {position: sticky; top: 0px; width: 100%; font-size: 1.5vh; cursor: row-resize; text-align: left; background-color: rgba(255, 255, 255, 0.8); z-index: 10000000000;}
     #LatoSx_TestoGuida {position: sticky; top: 0px;              left: 0px; height: 100%; width: 3vh; cursor: col-resize; float: left;  z-index: 1;}
     #LatoDx_TestoGuida {position: sticky; top: 0px; left: calc(100% - 3vh); height: 100%; width: 3vh; cursor: col-resize; float: right; z-index: 1;}
     #Base_TestoGuida   {position: sticky; top: calc(100% - 3vh); left: 0px; height: 3vh; width: 100%; cursor: row-resize; z-index: 1;}
     #ImgAttesaTestoGuida {margin: 10px; display: none;}
     #TestoGuida {position: absolute; top: 1.5vh; text-align: justify; padding-right: 5px;} #TestoGuida div {cursor: pointer;} #TestoGuida div:hover {background-image: linear-gradient(rgba(0, 200, 200, 0.2), rgba(0, 200, 200, 0));}
     .TestoGuida-evidenziato {background-color: rgb(200, 255, 200); border-radius: 10px;} .TestoGuida-evidenziato-lieve {background-image: linear-gradient(rgba(0, 255, 255, 0), rgba(200, 255, 200, 0.5), rgba(200, 255, 200, 0.9), rgba(200, 255, 200, 0.1)); .TestoGuida-evidenziato-no {}}
     .PersonaggioCliccabile {cursor: pointer;} .PersonaggioCliccabile:hover {background-color: white;}
     .battuta-evidenziata {font-weight: bold; color: darkblue;}`
);
const ContenitoreTestoGuida = CreaElemento('div', 'ContenitoreTestoGuida', document.body.id); ContenitoreTestoGuida.iStyle(PosizioneDefaultCopione);
const ManigliaSposta_TestoGuida = CreaElemento('div', 'ManigliaSposta_TestoGuida', 'ContenitoreTestoGuida', `<div style='width: 100%; text-align: center;'><div id='OpzSposta_TestoGuida' class="fa fa-navicon" style="cursor: move; position: absolute;"></div></div><div style='position: absolute; right: 0px;'><span class='fa fa-search'></span><select id='OpzEvidenzia_TestoGuida' style='font-size: 80%;'></select></div><span id='OpzRiduciTesto_TestoGuida' data-variazione='-1' style="font-size: 13px;" class="btn btn-default fa fa-font"><sup class="fa fa-caret-down"></sup></span>&nbsp;<span id='OpzAumTesto_TestoGuida' data-variazione='1' class="btn btn-default fa fa-font"><sup class="fa fa-caret-up"></sup></span>&nbsp;<span id='OpzVisualizzaAltraFinestra_TestoGuida' class="btn btn-default fa fa-print"></span>`), OpzEvidenzia_TestoGuida = document.getElementById('OpzEvidenzia_TestoGuida');
const LatoSx_TestoGuida = CreaElemento('div', 'LatoSx_TestoGuida', 'ContenitoreTestoGuida'), LatoDx_TestoGuida = CreaElemento('div', 'LatoDx_TestoGuida', 'ContenitoreTestoGuida'), Base_TestoGuida = CreaElemento('div', 'Base_TestoGuida', 'ContenitoreTestoGuida');
const TestoGuida = CreaElemento('div', 'TestoGuida', 'ContenitoreTestoGuida');
const ImgAttesaTestoGuida = CreaElemento('div', 'ImgAttesaTestoGuida', 'ContenitoreTestoGuida', "<span class='fa fa-spin fa-spinner'></span>");

const PatternRegexNomePersonaggio = "A-z0-9àéèìòù\.\(\) ", RegexNomePersonaggio_CaratteriNonAmmessi = new RegExp('[^' + PatternRegexNomePersonaggio + ']', 'g'), RegexNomePersonaggio_CaratteriAmmessi = new RegExp('[' + PatternRegexNomePersonaggio + ']', 'g');

var FunzioniCopione = {
    /*** Funzioni principali ***/
    AggiornaTestoGuida: function (MinutaggioAttuale = VideoGuidaMinutaggioCorrente()) {
        clearTimeout(FunzioniCopione.tmr);
        (document.querySelector('.' + FunzioniCopione.ClasseEvidenziaBattuta) || {}).className = '';

        const PosizioneCopione = DatiCopione.find( el => ((el.minutaggio <= MinutaggioAttuale) && (MinutaggioAttuale < ((DatiCopione[+DatiCopione.indexOf(el) + 1]) || ({minutaggio: totDurataVideoGuida})).minutaggio)) );
        ((PosizioneCopione) && (SezioneTesto = document.getElementById('RifCopione' + PosizioneCopione.NumID)) && (SezioneTesto.className = FunzioniCopione.ClasseEvidenziaBattuta) && (FunzioniCopione.ScorrimentoAutomatico) && (SezioneTesto.scrollIntoView({behavior: 'smooth', block: 'center'})));

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

    DisattivaTestoGuida: function (Scompari = false, EliminaContenuto = true) {
        clearTimeout(FunzioniCopione.tmr);
        if (Scompari) {FunzioniCopione.Scompari(EliminaContenuto);}
    },

    Visualizza: function (Partenza = 0) {
        const totBT = DatiCopione.length, FunzioneOnClickBattuta = (FunzioniCopione.CopioneCliccabile? "onclick='FunzioniCopione.PosizionaVideo(event);'" : '');

        /* Scrive e formatta il testo */
        var Testo = "";
        for (let I = Partenza; I < totBT; I++) {
            Testo += "<div id='RifCopione" + DatiCopione[I].NumID + "' data-numid='" + DatiCopione[I].NumID + "' data-minutaggio='" + DatiCopione[I].minutaggio + "' " + FunzioneOnClickBattuta + "><span><span><br>" + DatiCopione[I].testo + "</span></span></div>";
        }

        if (Partenza == 0) {
            TestoGuida.innerHTML = "<br style='line-height: 1vh;' />" + FunzioniCopione.FormattaTesto(Testo) + "<br id='brTermineCopione' style='line-height: 4vh;' />";
        } else {
            document.getElementById('brTermineCopione').insertAdjacentHTML('beforebegin', FunzioniCopione.FormattaTesto(Testo));
        }
        /******************************/

        /* Memorizza ed elenca i nomi di tutti i personaggi */
        const Battute = document.querySelectorAll("[data-battuta='1']"), totBattute = Battute.length;
        FunzioniCopione.NomiPersonaggi = [];
        for (let I = 0; I < totBattute; I++) {
            FunzioniCopione.NomiPersonaggi[Battute[I].getAttribute('name').slice(8)] = true;
        }

        const NP = Object.keys(FunzioniCopione.NomiPersonaggi).sort(), totNP = NP.length;

        OpzEvidenzia_TestoGuida.textContent = "";
        CreaElemento('option', 'opzNP_TestoGuida_vuoto', 'OpzEvidenzia_TestoGuida', '').value = '';
        for (let I = 0; I < totNP; I++) {
            CreaElemento('option', 'opzNP_TestoGuida' + I, 'OpzEvidenzia_TestoGuida', NP[I]).value = NP[I];
        }
        /***************************************************/

        FunzioniCopione.Appari();
    },

    FormattaTesto: function (Testo) {
        const FunzioniNomePersonaggio = ((FunzioniCopione.CopioneEditabile == 2) ? " class='PersonaggioCliccabile' onclick='FunzioniCopione.FunzioneModificaPersonaggio(event)'" : ""), TestoEditabile = "name='ContenutoEditabile' onpaste='FunzioniCopione.GestisciIncolla(event);'" + ((FunzioniCopione.CopioneEditabile > 0) ? " contenteditable='true' onkeydown='FunzioniCopione.FunzioneModificaBattuta(event);' onfocus='FunzioniCopione.FunzioneOnFocusBattuta(event);'" : "");
        return Testo.replace(/\n/g, '<br>').replace(new RegExp('<br>\\s+|<br>(?![' + PatternRegexNomePersonaggio + ']+:)', 'g'), `</span><br><b ${FunzioniNomePersonaggio}>&nbsp;</b><span></span><span ${TestoEditabile}>`).replace(new RegExp('<br>([' + PatternRegexNomePersonaggio + ']+):', 'g'), `</span></span><br style='line-height: 5px;'><span data-battuta='1' name=\"Battuta_$1\"><b ${FunzioniNomePersonaggio}>$1</b><span>: </span><span ${TestoEditabile}>`);
    },

    Appari: function () {
        ContenitoreTestoGuida.iStyle({opacity: 1, visibility: "visible"});
        FunzioniCopione.CopioneVisualizzato = true;
        FunzioniCopione.Eventi(true);
    },

    Scompari: function (EliminaContenuto = true) {
        if (EliminaContenuto) {TestoGuida.textContent = "";}
        ContenitoreTestoGuida.iStyle({opacity: 0, visibility: "hidden"});
        FunzioniCopione.CopioneVisualizzato = false;
        FunzioniCopione.Eventi(false);
    },

    PosizionaVideo: function (e) {
        const BloccoTestoCliccato = e.currentTarget, Minutaggio = TrovaDatiCopioneID(BloccoTestoCliccato.dataset.numid).minutaggio;
        
        if (FunzioniCopione.CopioneEditabile > 0) {
            /* Se il rigo è vuoto, seleziona lo span contenteditable */
            if (BloccoTestoCliccato.innerText.trim() == "") {BloccoTestoCliccato.children[0].querySelector("[contenteditable='true']").focus();}
            /* Se si è cliccato il rigo evidenziato, non si riposiziona */
            if (e.currentTarget.className == FunzioniCopione.ClasseEvidenziaBattuta) {return;}
        } 
        
        /* Posiziona al minuto considerato */
        if (Math.round(VideoGuidaMinutaggioCorrente()) == Math.round(Minutaggio)) {return;}
        FunzioniCopione.DisattivaCopione((FunzioniCopione.CopioneEditabile? false : BloccoTestoCliccato));
        FunzioniCopione.FunzionePosizionaVideo(Minutaggio);
    },
    /************************/

    /*** Salva la posizione e la dimensione del copione ***/
    SalvaPosizioneCopione: function () {
        if (FunzioniCopione.CopioneEditabile < 2) {
            AJAX("TrascrizioneVideo_SalvaPosizioneCopione.php", "top=" + encodeURIComponent(ContenitoreTestoGuida.style.top) + "&left=" + encodeURIComponent(ContenitoreTestoGuida.style.left) + "&right=" + encodeURIComponent(ContenitoreTestoGuida.style.right) + "&bottom=" + encodeURIComponent(ContenitoreTestoGuida.style.bottom) + "&fontSize=" + encodeURIComponent(ContenitoreTestoGuida.style.fontSize), "", "", "", true);
        }
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
        const OpzSposta_TestoGuida = document.getElementById('OpzSposta_TestoGuida'), OpzRiduciTesto_TestoGuida = document.getElementById('OpzRiduciTesto_TestoGuida'), OpzAumTesto_TestoGuida = document.getElementById('OpzAumTesto_TestoGuida'), OpzFinestraAParte = document.getElementById('OpzVisualizzaAltraFinestra_TestoGuida');
        OpzSposta_TestoGuida.onmousedown = OpzSposta_TestoGuida.ontouchstart = ((Attiva && FunzioniCopione.Spostabile) ? FunzioniCopione.SpostaTestoGuida_Attiva : '');
        OpzSposta_TestoGuida.style.display = (FunzioniCopione.Spostabile? '' : 'none');
        OpzEvidenzia_TestoGuida.onchange = (Attiva? FunzioniCopione.EvidenziaPersonaggio : '');
        OpzRiduciTesto_TestoGuida.onmousedown = OpzAumTesto_TestoGuida.onmousedown = (Attiva? FunzioniCopione.ModificaDimensioniTesto : '');
        OpzFinestraAParte.onmousedown = FunzioniCopione.VisualizzaSuAltraFinestra;
        ManigliaSposta_TestoGuida.onmousedown = ManigliaSposta_TestoGuida.ontouchstart = LatoSx_TestoGuida.onmousedown = LatoSx_TestoGuida.ontouchstart = LatoDx_TestoGuida.onmousedown = LatoDx_TestoGuida.ontouchstart = Base_TestoGuida.onmousedown = Base_TestoGuida.ontouchstart = ((Attiva && FunzioniCopione.Ridimensionabile) ? FunzioniCopione.RidimensionaTestoGuida_Attiva : '');
        LatoSx_TestoGuida.style.display = LatoDx_TestoGuida.style.display = Base_TestoGuida.style.display = (FunzioniCopione.Ridimensionabile? '' : 'none');
    },
    /*******************************/

    /*** Sposta e ridimensiona ***/
    /** Sposta copione col mouse **/
    SpostaTestoGuida_Attiva: function (e) {
        e.stopPropagation();
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

    SpostaTestoGuida_Disattiva: function (e) {
        e.stopPropagation();
        ContenitoreTestoGuida.style.cursor = '';
        ContenitoreTestoGuida.iStyle({right: ((window.innerWidth - ContenitoreTestoGuida.offsetWidth - ContenitoreTestoGuida.offsetLeft) / window.innerWidth * 100) + "%", bottom: ((window.innerHeight - ContenitoreTestoGuida.offsetHeight - ContenitoreTestoGuida.offsetTop) / window.innerHeight * 100) + "%", width: '', height: ''});
        document.body.removeEventListener('mousemove', FunzioniCopione.SpostaTestoGuida);           document.body.removeEventListener('touchmove', FunzioniCopione.SpostaTestoGuida);
        document.body.removeEventListener('mouseup',   FunzioniCopione.SpostaTestoGuida_Disattiva); document.body.removeEventListener('touchend',  FunzioniCopione.SpostaTestoGuida_Disattiva);
        FunzioniCopione.SalvaPosizioneCopione();

        FunzioniCopione.RiattivaVideoGuida();
    },

    /** Ridimensiona copione col mouse **/
    RidimensionaTestoGuida_Attiva: function (e) {
        e.stopPropagation();
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

    /** Evidenzia personaggio **/
    EvidenziaPersonaggio: function (e) {
        const PersonaggioDaEvidenziare = e.currentTarget.value;

        const battute_evidenziate = document.getElementsByClassName('battuta-evidenziata'), totbattute_evidenziate = battute_evidenziate.length;
        for (let I = 0; I < totbattute_evidenziate; I++) {
            battute_evidenziate[0].className = '';
        }

        const battute = document.getElementsByName('Battuta_' + PersonaggioDaEvidenziare), totbattute = battute.length;
        for (let I = 0; I < totbattute; I++) {
            battute[I].className = 'battuta-evidenziata';
        }
    },
    /***************************/

    /** Modifica le dimensioni del testo **/
    ModificaDimensioniTesto: function (e) {
        e.preventDefault(); e.stopPropagation();

        const dimensionetestoattuale = parseInt(ContenitoreTestoGuida.style.fontSize), variazione = e.currentTarget.dataset.variazione;

        var nuovadimensione = (+dimensionetestoattuale) + (+variazione);

        const sogliaminima = 8, sogliamassima = 30, condizionesogliaminima = (nuovadimensione >= sogliaminima), condizionesogliamassima = (nuovadimensione <= sogliamassima);

        ContenitoreTestoGuida.style.fontSize = ((nuovadimensione * condizionesogliaminima * condizionesogliamassima) + (sogliaminima * !condizionesogliaminima) + (sogliamassima * !condizionesogliamassima)) + "px";
        ContenitoreTestoGuida.style.lineHeight = ContenitoreTestoGuida.style.fontSize;

        FunzioniCopione.SalvaPosizioneCopione();
    },
    /**************************************/

    /** Visualizza copione su altra finestra **/
    VisualizzaSuAltraFinestra: function () {
        finestra = ApriFinestra({currentTarget: {dataset: {altezza: 800, larghezza: 500, nomefinestra: 'CopioneTestoGuida', link: 'TestoGuidaStampabile.php?N=' + encodeURIComponent(N)}}});
        finestra.postMessage({Copione: TestoGuida.innerHTML}, window.location.origin);
    },
    /******************************************/

    /** Funzioni copione editabile **/
    GestisciIncolla: async function (e) {
        const spanEditabile = e.currentTarget;
        await pausa(100);
        spanEditabile.innerHTML = spanEditabile.innerText;
    },
    /********************************/

    DisattivaVideoGuida: function () {
        const VG = document.getElementById('VideoGuida');
        VG.dataset.pointerEvents = (VG.style.pointerEvents || '');
        FunzioniCopione.tmrDisattivaVG = setTimeout(() => {VG.style.pointerEvents = 'none'; VG.dataset.modificatopointerevents = "1";}, 100);
    },

    RiattivaVideoGuida: function () {
        const VG = document.getElementById('VideoGuida');
        clearInterval(FunzioniCopione.tmrDisattivaVG);
        if (VG.dataset.modificatopointerevents == "1") {VG.style.pointerEvents = VG.dataset.pointerEvents; VG.dataset.modificatopointerevents = "0";}
    },
    /****************************/

    /** @type {Boolean} indica se il copione è attualmente visualizzato o meno **/
    CopioneVisualizzato: false,

    /*** Proprietà ***/
    /** @type {Boolean} indica se si può cliccare su una battuta del copione per posizionarsi al minutaggio desiderato. Impostare la FunzionePosizionaVideo. **/
    CopioneCliccabile: true,

    /** @type {Boolean} indica se si può ridimensionare e/o spostare la finestra del copione **/
    Ridimensionabile: true,
    Spostabile: true,

    /** @type {Number} indica se il copione può essere editato. 0 = no. 1 = solo le battute. 2 = battute e personaggi **/
    CopioneEditabile: 0,

    /** @type {Boolean} indica se il copione si posiziona automaticamente sulla battuta evidenziata **/
    ScorrimentoAutomatico: true,

    /** @type {String} la classe css per evidenziare la battuta corrente **/
    ClasseEvidenziaBattuta: "TestoGuida-evidenziato-lieve",

    /** @type {Number} il livello di opacità quando il copione viene disattivato **/
    OpacitaCopioneDisattivato: 0.6,
    /*****************/

    /** Funzioni da personalizzare **/
    FunzionePosizionaVideo: function () {},
    FunzioneModificaPersonaggio: function () {},
    FunzioneModificaBattuta: function () {},
    FunzioneOnFocusBattuta: function () {},
    /********************************/

    /*** Dati ***/
    NomiPersonaggi: {},
    /************/

    /*** Timer ***/
    tmr: false,
    tmrDisattivaVG: false
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