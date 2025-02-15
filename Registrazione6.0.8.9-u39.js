const ContenitoreVideoGuida = document.getElementById('ContenitoreVideoGuida');
const ContenitoreLineaTemporale = document.getElementById('Contenitore');
const ContenitoreRighello = document.getElementById('ContenitoreRighello');
const Monitors = document.getElementById('Monitors');
const ComandiPlayer = document.getElementById('ComandiPlayer');
const pulRegistra = document.getElementById('Registra');
const imgRegistra = document.getElementById('imgRegistra');
const TestoPulRegistra = document.getElementById('TestoPulRegistra');
const pulStopRegistrazione = document.getElementById('StopRegistrazione');
const pulAnnullaRegistrazione = document.getElementById('AnnullaRegistrazione');
const pulPlay = document.getElementById('Play');
const imgPlayPausa = document.getElementById('imgPlay');
const Cursore = document.getElementById('Cursore'), CursoreAnteprima = document.getElementById('CursoreAnteprima');
const ContenitorePulMessaggioVocale = document.getElementById('ContenitorePulMessaggioVocale'), didascaliaMessaggioVocale = document.getElementById('didascaliaMessaggioVocale'), pulMessaggioVocale = document.getElementById('pulMessaggioVocale'), selUtenteMessaggioVocale = document.getElementById('selUtenteMessaggioVocale');
const BC = document.getElementById('ProgressoCaricamento'), ContornoBC = document.getElementById('BarraProgressoCaricamento');

const lblVolumeVideoGuida = document.getElementById('lblVolumeVideoGuida');
const slideVolumeVideoGuida = document.getElementById('VolumeVideoGuida');
const MinutaggioMinuti = document.getElementById('MinutaggioMinuti');
const MinutaggioSecondi = document.getElementById('MinutaggioSecondi');
const slideMinutaggioAttuale = document.getElementById('slideMinutaggioAttuale');
const lblSwitchColonnaInternazionale = document.getElementById('pulSwitchCI_testo');
const pulSwitchColonnaInternazionale = document.getElementById('pulSwitchColonnaInternazionale');

const divMinutaggiRighello = document.getElementById('MinutaggiRighello');
const divContenutoTracce = document.getElementById('ContenutoTracce');
const divLineaTemporale = document.getElementById('LineaTemporale');
const imgAttesaIniziale = document.getElementById('imgAttesaIniziale');
const imgAttesa = document.getElementById('imgAttesa');
const Righello = document.getElementById('Righello');
const pulVariaAltezzaTracce = document.getElementById('pulVariaAltezzaTracce');
const opzFunzionalitaPreRegistrazione = document.getElementById('opzFunzionalitaPreRegistrazione');
const checkAscoltaClipDuranteRegistrazione = document.getElementById('checkAscoltaClipDuranteRegistrazione');
const inputCountdownRegistrazione = document.getElementById('inputCountdownRegistrazione');
const divElencoCandidati = document.getElementById('divElencoCandidatiRuoliDaAssegnare');
const divVetro = document.getElementById('Vetro');

const instantMeter = document.querySelector('#instant meter');
const selectQualitaRegistrazione = document.getElementById('selectQualitaRegistrazione');
/* var slowMeter = document.querySelector('#slow meter');
var clipMeter = document.querySelector('#clip meter');
var instantValueDisplay = document.querySelector('#instant .value');
var slowValueDisplay = document.querySelector('#slow .value');
var clipValueDisplay = document.querySelector('#clip .value'); */

const simboloEffetto = { 'radio': "fa-bullhorn", 'ovattato': "fa-cloud", 'echo': "fa-bullseye", 'riverbero': "fa-rss" };
const riquadroSimboloEffettoELT = 'btn btn-info btn-sm fa ';
const simboloEffettoELT = { '': "", 'radio': riquadroSimboloEffettoELT + simboloEffetto.radio, 'ovattato': riquadroSimboloEffettoELT + simboloEffetto.ovattato, 'echo': riquadroSimboloEffettoELT + simboloEffetto.echo, 'riverbero': riquadroSimboloEffettoELT + simboloEffetto.riverbero };

const Provino = (TipoProgetto == 'Provino');

const SecondiPrecaricamentoAlPlay = (ModalitaStreaming ? 60 : 120), SecondiPrecaricamentoAlPlayPrimaDiRegistrare = 120;

const ID_Opzioni = 'OpzioniClip';

const formatoQualitaAlta = "flac", formatoQualitaMedia = "ogg";

const toolStandard = 0, toolDividiClip = 1, toolEscludiClip = 2, toolMarcatore = 3, puntatoreTool = ["pointer", "url(images/CursoreMouseLineaTemporale_toolDividiClip.png) 8 0, auto", "url(images/CursoreMouseLineaTemporale_toolEscludiClip.png) 8 0, auto", "url(images/CursoreMouseLineaTemporale_toolMarcatore.png) 8 0, auto"];

const pausa = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

/** @type {MediaStreamAudioSourceNode} la sorgente audio selezionata (il microfono) **/
var sorgenteAudioSelezionata = false;
/** @type {AudioWorkletNode} il processo personalizzato di analisi e registrazione audio in RAW **/
var registrazione = false, canaleAudio = [], LunghezzaNuovaRegistrazione = 0, QualitaAltaRegistrazione = true;
/** @type {MediaRecorder} il processo di registrazione audio del browser **/
var regMediaRecorder = false, recordedBlobs = [];
/** @type {AnalyserNode} serve ad analizzare e poi rappresentare l'onda sonora **/
var analizzatoreAudio = false, audioAnalizzato = [], CanvasOnda, canvasCtx;
var sampleAudioData;
var DatiAudioRegistrato = [], DatiAudioRegistrato_Registrazione = {}, ClipDaRiprodurre = [];
var AudioBufferColonnaInternazionale = [], ColonnaInternazionaleAttivata = false, SpezzoniAudioCI = [];
var MinutaggioPartenzaRegistrazione = 0, MinutaggioUltimaRegistrazione = 0, DurataUltimaRegistrazione = 0;
var MessaggiIstantaneiAttivi = false, MessaggioIstantaneoInRiproduzione = false;
var ELTDaSpostare = false, ELTCliccato = false, ELTDaRiordinare = [];
var StrumentoMouse = 0;
var RiproduzioneInCorso = false;
var MinutaggioPrecaricamentoClip = 0, FunzioneAlTerminePrecaricamento = false, totClipDaPrecaricare = 0, ContatoreClipPrecaricate = 0, intervalloControllaClipPrecaricate;
var StoRegistrando = false;
var totClipAudioCaricate = 0;
var totDurataVideoGuida = 0;
var DimensioneRighello = 100;
var AltezzaTracce = 0, AltezzaTracceMinima, AltezzaTracceMassima;
var TracciaDaRidimensionare = false, AltezzaMinimaTraccia = 0, LimiteMinimoTracciaDaRidimensionare = 0;
var WindowScrollY = 0, WindowScrollY_Iniziale = 0;
var TracceEscluse = [];
var RuoliDaAssegnare_CandidatoSelezionato = "RuoliDaAssegnare";
var FunzioneNormaleAlTimeUpdate, FunzioneRiproduzioneClip;
var NumeroTotaleAudioCaricamentoIniziale = 0, CaricamentoInizialeTerminato = false;
var UtentiAttivi = [], UtentiAttiviOltreMe = [];
var SolaVisione = SessioneOspite;
var SistemaAttualeAndroid = false;
var currentTimeIniziale = 0, orarioIniziale = 0;

var tmrCaricamento, tmrImmagineAttesa, tmrContoAllaRovescia, tmrAggiornaClip, tmrRidisegnaRighello, tmrPulsanteStopRegistrazione, tmrRitardoScorrimentoCursore, tmrLampeggiaCestino = [], tmrELTCliccato, tmrRiposizionamentoAutomaticoELT, tmrRitornoDisposizioneOriginaleELT, tmrVisualizzaElencoCandidati, tmrAggiornaChatCandidato = false, tmrAggiornaNotificheCandidatiRuoliDaAssegnare, tmrComparsaTitoloVideo, tmrComparsaCrediti, tmrRidimensionamentoElementi;

var GuadagnoPrincipale = [], FiltroBandaAR = [], GuadagnoDelay1 = [], EffettoDelay1 = [], GuadagnoDelay2 = [], EffettoDelay2 = [], GuadagnoDelay3 = [], EffettoDelay3 = [];

var LatenzaAudio = 0;

var ev_cambiamento = new Event('change');

var ZPremuto = false;

pulRegistra.addEventListener('click', toggleRecording);
pulStopRegistrazione.addEventListener('click', stopRecording);
pulAnnullaRegistrazione.addEventListener('click', AnnullaRegistrazione);
pulPlay.addEventListener('click', PlayPausa);


/*** Verifiche compatibilità browser ***/
try {
    audioContext = new AudioContext();
} catch (err) {
    alert(strWebAudioAPINonSupportata);
}
/***************************************/

var ingressi = {};

var MinutaggiRighello = {
    StepRighello: 0, NumeroMinutaggi: 0,

    Disegna: function () {
        var R, Minutaggio;
        this.StepRighello = parseInt(50 * totDurataVideoGuida / document.getElementById('MinutaggiRighello').clientWidth) + 1; /* console.log("StepRighello", this.StepRighello, Righello.clientWidth, totDurataVideoGuida); */
        const LunghezzaRighello = totDurataVideoGuida - this.StepRighello;
        Minutaggio = new MinutiESecondi(totDurataVideoGuida);
        MinutaggioMinuti.max = Minutaggio.Minuti; MinutaggioSecondi.max = 59.999;

        for (var I = InizioVideoGuida; I < LunghezzaRighello; I += this.StepRighello) {
            Minutaggio = new MinutiESecondi(I); this.NumeroMinutaggi++;
            R = CreaElemento('span', 'R' + this.NumeroMinutaggi, 'MinutaggiRighello', "<img src='images/Cursore.png' class='SegnoRighello'>&nbsp;" + Minutaggio.Minuti + ":" + ("0" + parseInt(Minutaggio.Secondi)).slice(-2));
            R.iStyle({ position: "absolute", top: "0px", left: ((I / totDurataVideoGuida) * 100) + "%", width: "100%", fontFamily: "Verdana", fontSize: "8px", lineHeight: "10pt", verticalAlign: "top" });
        }
    },

    Cancella: function () {
        for (var I = 1; I <= this.NumeroMinutaggi; I++) { divMinutaggiRighello.removeChild(document.getElementById('R' + I)); }
        this.NumeroMinutaggi = 0;
    },

    Ridisegna: function () {
        this.Cancella();
        this.Disegna();
    }
};

/*** Zoom e affini ***/
function CambiaZoom() {
    const DimensioneRighelloPrec = DimensioneRighello;
    DimensioneRighello = document.getElementById('Zoom').value;
    clearTimeout(tmrRidisegnaRighello); clearTimeout(tmrRitardoScorrimentoCursore);

    CambiaDimensioneContenitoreTracce();
    setTimeout(SeguiCursore, 200);
    if (+DimensioneRighelloPrec > +DimensioneRighello) { MinutaggiRighello.Cancella(); }
    tmrRidisegnaRighello = setTimeout(() => { MinutaggiRighello.Ridisegna(); CompattaMarcatori(); }, 1000);
}

function CambiaDimensioneContenitoreTracce() {
    ['ContenutoTracce', 'MinutaggiRighello'].forEach(CambiaDimensione);
}

function CambiaDimensione(ID) {
    document.getElementById(ID).style.width = DimensioneRighello + "%";
}

document.getElementById('Zoom').addEventListener('change', CambiaZoom);
/*********************/

/*** Mantiene fissi gli elementi principali ***/
window.addEventListener('scroll', PosizionaElementiScroll);

function PosizionaElementiScroll() {
    divMinutaggiRighello.style.top = (15 + window.scrollY) + "px"; divMinutaggiRighello.style.zIndex = 10000 * (window.scrollY > 0)
    Cursore.style.top = window.scrollY + "px"; CursoreAnteprima.style.top = Cursore.style.top;
    document.getElementById('NomiTracce').style.top = ((+ContenitoreLineaTemporale.offsetTop) + 30 - window.scrollY) + "px";
    WindowScrollY = window.scrollY;
}
/**********************************************/

function OpacitaRighello(LivelloOpacita) {
    Righello.style.opacity = LivelloOpacita;
}

/*** Per i pulsanti del pannello destro, lascia la sola icona se lo spazio non basta ***/
function AdattaDimensionePulsanti() {
    const pulsanti = document.querySelectorAll('#ContenitorePannelloDx > .btn'), totPulsanti = pulsanti.length;
    const ClassePulsante = (document.getElementById('ContenitorePannelloDx').offsetHeight < 350) ? "btn-scritta-a-comparsa" : "";
    for (I = 0; I < totPulsanti; I++) {
        pulsanti[I].children[1].className = ClassePulsante;
    }
}
/***************************************************************************************/

/*** Adatta i vari elementi in base alla grandezza della finestra, eventualmente adatta anche l'altezza delle tracce per evitare che il video copra i comandi player ***/
function AutoAdattaElementiInterfaccia() {
    const differenzaAltezzaContenitore = ContenitoreVideoGuida.offsetHeight - Monitors.offsetHeight;
    if (differenzaAltezzaContenitore > 0) { AltezzaTracce += differenzaAltezzaContenitore; VariaAltezzaTracce(); } else { PosizionaElementiScroll(); AdattaDimensionePulsanti(); }
}
/***********************************************************************************************************************************************************************/

/*** Operazioni al ridimensionamento della finestra ***/
function Ridisegna() {
    clearTimeout(tmrRidimensionamentoElementi);
    tmrRidimensionamentoElementi = setTimeout(() => {
        MinutaggiRighello.Ridisegna();
        if (RidimensionaVideo) { RidimensionaVideo(); }
        AutoAdattaElementiInterfaccia();
        CompattaMarcatori();
    }, 1000);
}

window.addEventListener('resize', Ridisegna);
/******************************************************/

/*** Strumento di variazione posizione Y delle tracce ***/
function CliccatoVariazioneAltezzaTracce() {
    document.body.addEventListener('mousemove', SegnaVariazioneAltezzaTracce);
    document.body.addEventListener('mousedown', VariaAltezzaTracce);

    pulVariaAltezzaTracce.className = pulVariaAltezzaTracce.className.replace('default', 'warning');

    RideterminaLimitiAltezzaTracce();

    divVetro.iStyle({ display: "inline", opacity: 1 });
    CreaElemento('div', 'indicatoreVariazioneAltezzaTracce', divVetro.id).iStyle({ position: "absolute", width: "100%", top: (+AltezzaTracceMinima) + (+AltezzaTracce) + "px", borderTop: "5px dashed blue" });
}

function SegnaVariazioneAltezzaTracce(e) {
    const Y = e.clientY, AltezzaIndicata = Y - AltezzaTracceMinima, CondizioneSogliaMinima = (AltezzaIndicata > 0), CondizioneSogliaMassima = (AltezzaIndicata < AltezzaTracceMassima);

    AltezzaTracce = (AltezzaIndicata * CondizioneSogliaMinima * CondizioneSogliaMassima) + (AltezzaTracceMassima * !CondizioneSogliaMassima);

    document.getElementById('indicatoreVariazioneAltezzaTracce').style.top = (+AltezzaTracceMinima) + (+AltezzaTracce) + "px";
}

function VariaAltezzaTracce() {
    const NuovaPosizione = "calc(40% + " + AltezzaTracce + "px)", NuovaPosizioneContenitore = ((+AltezzaTracce) + 52) + "px)";

    document.body.removeEventListener('mousemove', SegnaVariazioneAltezzaTracce); document.body.removeEventListener('mousedown', VariaAltezzaTracce);

    EliminaElemento(document.getElementById('indicatoreVariazioneAltezzaTracce')); divVetro.style.display = "none";

    document.getElementById('Contenitore').style.top = "calc(40% + " + NuovaPosizioneContenitore;
    if (UnitaDiMisura == "%") { document.getElementById('Contenitore').style.height = "calc(60% - " + NuovaPosizioneContenitore; }
    ComandiPlayer.style.top = NuovaPosizione;
    Monitors.style.height = NuovaPosizione;

    PosizionaElementiScroll();

    pulVariaAltezzaTracce.className = pulVariaAltezzaTracce.className.replace('warning', 'default');
    setTimeout(() => { if (RidimensionaVideo) { RidimensionaVideo(); } AdattaDimensionePulsanti(); }, 1000);
}

function RideterminaLimitiAltezzaTracce() {
    AltezzaTracceMinima = (+window.innerHeight * 0.4) + (+ComandiPlayer.offsetHeight); AltezzaTracceMassima = window.innerHeight - SuddivisioneTracce - AltezzaTracceMinima - 25;
}
/****************************************************/

function CaricamentoVideo() {
    const Colore = new Array("blue", "brown", "green", "blue", "red");
    const MessaggiIniziali = document.getElementById('MessaggiIniziali'), vMessaggiAttesa = (ModalitaStreaming ? strAttesaStreaming : (SolaVisione ? strAttesaOspite : (SistemaAttualeAndroid ? strAttesaAndroid : strAttesa)));

    MessaggiIniziali.style.color = Colore[CaricamentoVideo.MessaggioCorrente]; MessaggiIniziali.innerHTML = ((SolaVisione || ModalitaStreaming) ? "" : "<i>" + strConsiglio + "</i>: ") + vMessaggiAttesa[CaricamentoVideo.MessaggioCorrente];
    if (CaricamentoVideo.MessaggioCorrente == vMessaggiAttesa.length - 1) { Monitors.style.opacity = 0.8; } // Visualizza il video nel caso ci siano problemi

    CaricamentoVideo.MessaggioCorrente = ++CaricamentoVideo.MessaggioCorrente * (CaricamentoVideo.MessaggioCorrente < vMessaggiAttesa.length);
}
CaricamentoVideo.MessaggioCorrente = 0;

function AttivaProgramma() {
    VideoGuidaRimuoviEventoAlTermineCaricamento(AttivaProgramma);

    totDurataVideoGuida = (((FineVideoGuida > InizioVideoGuida) && (FineVideoGuida < VideoGuidaDurataTotale())) ? FineVideoGuida : VideoGuidaDurataTotale());

    /*** Visualizzazione ***/
    if (!ModalitaStreaming) {
        DisattivaMessaggiAttesa();
        document.getElementById('Contenitore').style.display = "block"; DisabilitaSchermata();
        MinutaggiRighello.Disegna();
        setTimeout(() => {
            /* Adatta la dimensione degli elementi in base al contenuto e allo spazio a disposizione */
            if (RuoliDaAssegnare_NumeroTraccia !== false) { VariaAltezzaTraccia(RuoliDaAssegnare_NumeroTraccia, (+document.getElementById('divContenutoNomeTraccia' + RuoliDaAssegnare_NumeroTraccia).offsetHeight) + 85); SpostaInBassoTracceSuccessive(); }
            AdattaAltezzaContenitoreTracce();
            AutoAdattaElementiInterfaccia();
        }, 1000);
        CreaElemento('div', 'divContenitoreSlideMinutaggio', 'VideoGuida', '', true).append(slideMinutaggioAttuale);
        if (VisualizzaSuggerimenti) { setTimeout(VisualizzaSuggerimentiNuoviDoppiatori, 2000, SuggerimentiIniziali); }
        if (VisualizzaSuggerimentiRuoliDaAssegnare) { setTimeout(VisualizzaSuggerimentiNuoviDoppiatori, 10000, SuggerimentiRuoliDaAssegnare, 'RuoliDaAssegnare'); }
        setTimeout(() => { document.getElementById('LogoWEDUB').iStyle({ top: 0, right: 0 }); }, 1000);

    } else {
        Monitors.style.opacity = 0.6;
        divVetro.style.opacity = 1;
        const pulSchermoInteroVetro = CreaElemento('div', 'pulSchermoInteroSuVetro', divVetro.id, "<span class='fa fa-desktop'></span> " + strVisualizzaASchermoIntero);
        pulSchermoInteroVetro.iStyle({ position: "fixed", bottom: "10%", right: "10%" }); pulSchermoInteroVetro.className = "btn btn-default btn-lg";
        pulSchermoInteroVetro.onclick = (e) => { document.getElementById('pulSchermoIntero').click(); EliminaElemento(e.currentTarget); };
    }

    divVetro.style.display = "inline";
    slideMinutaggioAttuale.setAttribute('max', totDurataVideoGuida);
    ComandiPlayer.style.display = "block";
    /***********************/

    setTimeout(() => {
        const vol = ((ModalitaStreaming) || ((TipoProgetto == 'Provino') && (SessioneOspite)) ? 0 : 1);
        VideoGuidaPause(); ImpostaStatoPlay(false);
        Posizionati(InizioVideoGuida, false);
        ImpostaVolumeVideoGuida(vol);
        document.getElementById('VideoGuida').style.pointerEvents = "none";
        if (RidimensionaVideo) { setTimeout(RidimensionaVideo, 1000); }
        if ((FineVideoGuida - InizioVideoGuida) < InizioVideoGuida) { document.getElementById('Zoom').value = 1000; setTimeout(CambiaZoom, 1000); }
    }, 500);

    CaricamentoInizialeRegistrazioniAudio();

    navigator.mediaSession.setActionHandler('play', () => { }); navigator.mediaSession.setActionHandler('pause', () => { }); // Disattiva i pulsanti multimediali
    InizializzaVideo();
}

function InizializzaVideo() {
    RiproduzioneInCorso = false;
    VideoGuidaFunzioneRaggiuntaFine(StoppaEventualeRegistrazione);
}

function PlayPausaCliccandoSulVideo(Attiva) {
    ContenitoreVideoGuida.onclick = (Attiva ? PlayPausa : "");
    ContenitoreVideoGuida.style.cursor = (Attiva ? "pointer" : "auto");
}

function VisualizzaSuggerimentiNuoviDoppiatori(Suggerimenti, TipoSuggerimento = '', FunzioneAlTermine = () => { }) {
    const totMessaggi = Suggerimenti.length;
    const boxSuggerimenti = CreaElementoSeInesistente('div', 'boxSuggerimenti', document.body.id), divBoxSuggerimenti = CreaElementoSeInesistente('div', 'divBoxSuggerimenti', boxSuggerimenti.id), pulOkBoxSuggerimenti = CreaElementoSeInesistente('div', 'pulOkBoxSuggerimenti', boxSuggerimenti.id, "OK");
    VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento = 0;

    function SuggerimentoSuccessivo() {
        if (++VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento >= totMessaggi) { EliminaElemento(boxSuggerimenti); AJAX("NonVisualizzareSuggerimenti.php", "TipoSuggerimento=" + encodeURIComponent(TipoSuggerimento), FunzioneAlTermine, "", "", true); } else { VisualizzaSuggerimento(); }
    }

    function VisualizzaSuggerimento() {
        const Sugg = Suggerimenti[VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento];
        boxSuggerimenti.className = "alert btn btn-" + Sugg.stile;
        if (Sugg.VicinoA) { Sugg.VicinoA.append(boxSuggerimenti); boxSuggerimenti.iStyle({ position: "absolute", marginTop: Sugg.scostamentoY, marginLeft: Sugg.scostamentoX, top: '', bottom: '', left: '', right: '' }); } else { boxSuggerimenti.iStyle(Object.assign({}, { position: 'fixed', marginTop: '', marginLeft: '', top: '', bottom: '', left: '', right: '' }, Sugg.coordinate)); }
        divBoxSuggerimenti.innerHTML = "<span class='" + Sugg.simboloSx + "'></span> " + Sugg.testo + " <span class='" + Sugg.simboloDx + "'></span><br />";
        boxSuggerimenti.style.animation = "blink-registrazione 400ms alternate 1s 4";
    }


    boxSuggerimenti.iStyle({ zIndex: 10000000000000, position: "fixed", fontWeight: "bold", transition: "All 2s" });
    pulOkBoxSuggerimenti.className = "btn btn-default"; pulOkBoxSuggerimenti.iStyle({ position: "absolute", right: "0px" }); pulOkBoxSuggerimenti.onclick = SuggerimentoSuccessivo;

    VisualizzaSuggerimento();
}
VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento = 0;

function DisattivaMessaggiAttesa() {
    clearInterval(tmrCaricamento);
    document.getElementById('divCaricamento').style.display = "none";
    document.getElementById('Versione').style.display = "none";
    Monitors.style.opacity = 1;
}

function CambiaTool(Tool) {
    const pulsanteToolAttuale = document.getElementById('pul_tool' + StrumentoMouse);
    const pulsanteToolSelezionato = document.getElementById('pul_tool' + Tool);
    const ELT = document.getElementsByClassName('ELT'), totELT = ELT.length, puntatore = puntatoreTool[Tool];
    const M = document.getElementsByClassName('Marcatore'), totM = M.length, puntatoreMarcatore = ((Tool == toolMarcatore) ? "url(images/CursoreMouseLineaTemporale_toolMarcatore_elimina.png) 8 0, auto" : "");

    /* Evidenzia il pulsante selezionato */
    pulsanteToolAttuale.className = pulsanteToolAttuale.className.replace('primary', 'default');
    pulsanteToolSelezionato.className = pulsanteToolSelezionato.className.replace('default', 'primary');

    /* Modifica il puntatore sopra le clip */
    for (let I = 0; (I < totELT); I++) {
        if (ELT[I].dataset.modificabile) { ELT[I].style.cursor = puntatore; }
    }

    /* Modifica il puntatore sopra i marcatori */
    for (let I = 0; (I < totM); I++) {
        if (M[I].dataset.modificabile) { M[I].style.cursor = puntatoreMarcatore; }
    }

    /* Modifica puntatore e anteprima cursore del contenitore delle tracce */
    divContenutoTracce.onmousemove = (([toolDividiClip, toolMarcatore].includes(Tool)) ? AnteprimaCursore : AnteprimaCursoreSeVuoto);
    divContenutoTracce.style.cursor = ((Tool == toolMarcatore) ? puntatore : "");

    /* Modifica evento al click nella timeline */
    Righello.onmousedown = ((Tool == toolMarcatore) ? AggiungiMarcatore : PosizionatiAlMinutoCliccato);

    /* Aggiorna la variabile globale */
    StrumentoMouse = Tool;
}

/*** Funzioni traccia Ruoli Da Assegnare ***/
function AggiornaElencoCandidatiRuoliDaAssegnare_slow() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    tmrVisualizzaElencoCandidati = setTimeout(AggiornaElencoCandidatiRuoliDaAssegnare, 350);
}

function AggiornaElencoCandidatiRuoliDaAssegnare() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    if ((divElencoCandidati.style.opacity == 1) || (document.getElementById('OpzioniCandidato'))) { return; }
    const totDatiAudio = DatiAudioRegistrato.length;

    /* Non consente di cambiare utente se ci sono clip in corso di caricamento */
    for (var I = 0; (I < totDatiAudio) && (!DatiAudioRegistrato[I].CreazioneInCorso); I++);
    if (I < totDatiAudio) { return; }
    /***************************************************************************/

    AJAX("ElencoCandidatiRuoliDaAssegnare.php", "N=" + encodeURIComponent(N),
        function (Dati) {
            const totCandidati = Dati.length, strTitolo = ((totCandidati > 0) ? strElencoCandidatiDaAssegnare : strNessunCandidato);
            var pulElenco;
            document.getElementById('divNotificaNuoveClipRuoliDaAssegnare').style.display = "none";

            divElencoCandidati.innerHTML = "<div class='text-center'><b>" + strTitolo + "</b></div>";

            for (var I = 0; I < totCandidati; I++) {
                pulElenco = CreaElemento('div', 'pulCandidatoRuoliDaAssegnare' + I, divElencoCandidati.id, `<img src='${Dati[I].FotoProfilo}' height=35 width=35 style='float: left;' /><span name="${Dati[I].ID}_online"></span> <b>${Dati[I].Nome}</b>`);
                pulElenco.setAttribute('name', 'pulCandidatoRuoliDaAssegnare'); pulElenco.className = 'btn btn-default alert'; pulElenco.setAttribute('title', "-- " + Dati[I].Nome + " -- "); pulElenco.iStyle({ position: "relative", left: "0px", top: "0px", width: "100%", whiteSpace: "normal", transition: "All 1s" });
                if (Dati[I].DaVisualizzare == 1) { CreaElemento('div', 'indicatoreCandidatoRuoliDaAssegnare' + I, pulElenco.id, strNuoveClip).iStyle({ position: "absolute", top: "10px", left: "15px", color: "white", backgroundColor: "red", padding: "2px", borderRadius: "20%", fontWeight: "bold", transform: "rotate(-45deg)" }); }
                pulElenco.dataset.idutente = Dati[I].ID; pulElenco.onclick = CliccatoCandidatoRuoliDaAssegnare;
            }

            divElencoCandidati.className = "SpiegazioniFunzioni";
            divElencoCandidati.iStyle({ opacity: 1, visibility: "visible" });
            CheckUtentiAttivi();
        }, "", "", true
    );
}

function ElencoCandidatiRuoliDaAssegnareScompare_slow() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    tmrVisualizzaElencoCandidati = setTimeout(ElencoCandidatiRuoliDaAssegnareScompare, 400);
}

function ElencoCandidatiRuoliDaAssegnareScompare() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    divElencoCandidati.className = "SpiegazioniFunzioni transizione-morbida-si";
    divElencoCandidati.iStyle({ opacity: 0, visibility: 'hidden' });
}

function CliccatoCandidatoRuoliDaAssegnare(e) {
    const pulCandidato = e.currentTarget, pulsantiCandidati = document.getElementsByName('pulCandidatoRuoliDaAssegnare'), totPulsantiCandidati = pulsantiCandidati.length;
    for (var I = 0; (I < totPulsantiCandidati) && !(pulsantiCandidati[I].abilita(false)) && !(pulsantiCandidati[I].style.opacity = 0); I++);
    pulCandidato.iStyle({ opacity: 1, left: "-50%", top: "-" + pulCandidato.offsetTop + "px" });
    pulCandidato.className = "btn alert-info";
    ElencoCandidatiRuoliDaAssegnareScompare();
    document.getElementById('divTitoloRuoliDaAssegnare').className = "btn btn-success btn-xs";
    SelezionaCandidatoRuoliDaAssegnare(pulCandidato.dataset.idutente);
}

function SelezionaCandidatoRuoliDaAssegnare(ID) {
    if (ID == RuoliDaAssegnare_CandidatoSelezionato) { return; }

    document.getElementById('divContenutoNomeTraccia' + RuoliDaAssegnare_NumeroTraccia).abilita(false); AttivaImmagineAttesa('TrePunti');

    AJAX("DatiUtente.php", "ID=" + encodeURIComponent(ID),
        function (Dati) {
            /* Nasconde le clip del doppiatore precedentemente selezionato e ripristina quelle eventualmente già caricate del doppiatore attualmente selezionato */
            const totAudio = DatiAudioRegistrato.length;
            var datiAudio;
            for (var I = 0; I < totAudio; I++) {
                datiAudio = DatiAudioRegistrato[I];
                switch (datiAudio.ID_Utente) {
                    case RuoliDaAssegnare_CandidatoSelezionato:
                        document.getElementById('ELTReg' + datiAudio.numero).style.display = "none";
                        break;

                    case ID:
                        document.getElementById('ELTReg' + datiAudio.numero).style.display = "inline";
                        break;
                }
            }
            if (!TracceEscluse.includes(RuoliDaAssegnare_CandidatoSelezionato)) { EscludiRipristinaTraccia(RuoliDaAssegnare_CandidatoSelezionato); }

            /* Attiva la traccia per l'utente selezionato */
            const divAggiungiDoppiatoreCandidato = document.getElementById('pulAggiungiDoppiatoreCandidato'), divChatCandidato = document.getElementById('divChatCandidato'), spanUtenteOnline = document.getElementById(RuoliDaAssegnare_CandidatoSelezionato + "_online"), divEscludiRipristinaTraccia = document.getElementById('EscludiRipristinaTraccia' + RuoliDaAssegnare_CandidatoSelezionato), divCestino = document.getElementById('ApriCestinoTraccia' + RuoliDaAssegnare_CandidatoSelezionato);
            document.getElementById('pulRuoliDaAssegnare').title = "-- " + Dati.Nome + " -- ";
            document.getElementById('spanNomeUtenteTraccia' + RuoliDaAssegnare_NumeroTraccia).innerText = Dati.Nome;
            document.getElementById('FotoProfiloTraccia' + RuoliDaAssegnare_NumeroTraccia).src = Dati.FotoProfilo;
            spanUtenteOnline.className = ""; spanUtenteOnline.id = ID + "_online"; spanUtenteOnline.setAttribute('name', spanUtenteOnline.id);
            document.getElementById('DownloadTraccia' + RuoliDaAssegnare_NumeroTraccia).dataset.utente = ID;
            document.getElementById('EsportaTraccia' + RuoliDaAssegnare_NumeroTraccia).dataset.link = `RenderingAudio/Rendering/Rendering.php?N=${N}&P=${P}&ID=${ID}`;
            divEscludiRipristinaTraccia.onclick = function () { EscludiRipristinaTraccia(ID); }; divEscludiRipristinaTraccia.id = 'EscludiRipristinaTraccia' + ID;
            divCestino.dataset.idutente = ID; divCestino.id = 'ApriCestinoTraccia' + ID; divCestino.dataset.ripristinati = "si"; ApriCestinoTraccia({ currentTarget: divCestino }); // Mette nel cestino solo le clip rimosse che erano state eventualmente già caricate per il candidato selezionato
            if (SonoCreatoreProgetto) {
                divChatCandidato.style.display = "inline"; divChatCandidato.dataset.link = `ChatRoom.php?S=${N}&A=${ID}`; divChatCandidato.dataset.idcandidato = ID;
                if (tmrAggiornaChatCandidato === false) { tmrAggiornaChatCandidato = setInterval(NotificaMessaggiChatCandidato, 60000); } NotificaMessaggiChatCandidato();
                divAggiungiDoppiatoreCandidato.style.display = "inline"; divAggiungiDoppiatoreCandidato.dataset.idcandidato = ID; divAggiungiDoppiatoreCandidato.dataset.nomecandidato = Dati.Nome;
            }
            DatiDoppiatori[ID] = { nome: Dati.Nome, numeroTraccia: RuoliDaAssegnare_NumeroTraccia };
            if (!TracceEscluse.includes(ID)) { TracceEscluse.push(ID); } EscludiRipristinaTraccia(ID);
            RuoliDaAssegnare_CandidatoSelezionato = ID;
            SolaVisione = SessioneOspite; // Attiva la possibilità di registrare solo se si è il visitatore candidato.
            if (Righello.dataset.DisattivaClick == "no") { RiabilitaSchermata(); } // Abilita la possibilità eventuale di registrare solo se la schermata era già attiva.
            setTimeout(AggiornaClip, 100, () => {
                EliminaImgAttesa(); setTimeout(() => { document.getElementById('divContenutoNomeTraccia' + RuoliDaAssegnare_NumeroTraccia).abilita(true); }, 1000);
            });
        }, "", "", true
    );
}

function NotificaMessaggiChatCandidato() {
    AJAX("NumeroMessaggiNonLettiChat.php", "ID_Interlocutore=" + encodeURIComponent(document.getElementById('divChatCandidato').dataset.idcandidato) + "&StanzaChat=" + encodeURIComponent(N),
        function (Dati) {
            VisualizzaMessaggiDaLeggere(Dati, 'divChatCandidato_NumeroMessaggiDaLeggere');
        }, "", "", true
    );
}

function AggiungiDoppiatoreCandidatoNelCast(e) {
    const pulAggiungiDoppiatoreCandidatoNelCast = e.currentTarget, DatiDoppiatoreCandidato = pulAggiungiDoppiatoreCandidatoNelCast.dataset, strRuoliDaAssegnare = document.getElementById('spanRuoliTraccia' + RuoliDaAssegnare_NumeroTraccia).innerText;
    /** @type {HTMLElement} **/
    var divPersonaggiLiberi = false, inputPersonaggiLiberi, lblEliminaRuoliDaAssegnare, lblMantieniRuoliDaAssegnare, div;

    var PannelloOpzioni = CreaElemento('div', 'OpzioniCandidato', document.body.id);
    PannelloOpzioni.className = "panel panel-info"; PannelloOpzioni.iStyle({ position: "fixed", top: "100px", left: "10%", zIndex: 100000000 });

    function AnnullaAggiungiDoppiatore() {
        EliminaElemento(PannelloOpzioni);
        window.addEventListener('keydown', ScorciatoieTastiera);
        RiabilitaSchermata();
        pulAggiungiDoppiatoreCandidatoNelCast.abilita(true);
    }

    function AttivaOpzioneTracciaRuoliDaAssegnare(e) {
        const opzMantieni = (e.currentTarget.value == 1), classenormale = 'btn btn-', classe = { [true]: "primary", [false]: "default" };

        if (opzMantieni) {
            divPersonaggiLiberi = CreaElemento('div', divContenuto.id + 'divPersonaggiLiberi', divContenuto.id, strIndicaRuoliDaAssegnare); divPersonaggiLiberi.style.margin = "10px";
            inputPersonaggiLiberi = CreaElemento('input', divPersonaggiLiberi.id + 'input', divPersonaggiLiberi.id); inputPersonaggiLiberi.setAttribute('type', 'text'); inputPersonaggiLiberi.setAttribute('name', 'RuoliDaAssegnare'); inputPersonaggiLiberi.setAttribute('value', strRuoliDaAssegnare); inputPersonaggiLiberi.setAttribute('size', "30");
            const divAiuto = CreaElemento('div', divPersonaggiLiberi.id + 'divAiutoPersonaggiLiberi', divPersonaggiLiberi.id);
            inputPersonaggiLiberi.onchange = () => {
                const Condizione = ValidaCondizioneMinimaCampoDiTesto(inputPersonaggiLiberi);
                inputPersonaggiLiberi.style.border = (Condizione ? "" : "2px dashed red");
                pulSalva.abilita(Condizione);
                divAiuto.innerText = (Condizione ? "" : strCampoCondizioneMinima); divAiuto.className = (Condizione ? "" : "alert alert-warning");
            };
        } else {
            EliminaElemento(divPersonaggiLiberi);
            divPersonaggiLiberi = false;
        }

        lblEliminaRuoliDaAssegnare.className = classenormale + classe[!opzMantieni]; lblMantieniRuoliDaAssegnare.className = classenormale + classe[opzMantieni];

        pulSalva.abilita(true);
    }

    /* Barra del titolo */
    var divTitolo = CreaElemento('div', PannelloOpzioni.id + 'Titolo', PannelloOpzioni.id, "<b>" + strStaiAggiungendoUtente + DatiDoppiatoreCandidato.nomecandidato + " " + strNelCast + "</b>"); divTitolo.className = "panel-heading text-center";
    var a = CreaElemento('a', divTitolo.id + 'Annulla', divTitolo.id); a.className = "btn btn-danger fa fa-times"; a.iStyle({ position: "absolute", top: "5px", left: "10px" }); a.onclick = AnnullaAggiungiDoppiatore;

    /* Opzioni */
    var divContenuto = CreaElemento('div', PannelloOpzioni.id + 'Contenuto', PannelloOpzioni.id); divContenuto.className = "panel-body text-center";

        var divRuoliCandidato = CreaElemento('div', divContenuto.id + 'divRuoli', divContenuto.id, strDescriviPersonaggiDoppiatiDa + "<b>" + DatiDoppiatoreCandidato.nomecandidato + "</b>: "); divRuoliCandidato.style.margin = "10px 20px 40px 20px";
            var inputRuoliCandidato = CreaElemento('input', divRuoliCandidato + 'input', divRuoliCandidato.id); inputRuoliCandidato.setAttribute('type', 'text'); inputRuoliCandidato.setAttribute('name', 'RuoloCandidato'); inputRuoliCandidato.setAttribute('value', strRuoliDaAssegnare); inputRuoliCandidato.setAttribute('size', "30");

        div = CreaElemento('div', divContenuto.id + 'divEliminaRuoliDaAssegnare', divContenuto.id); div.style.margin = "20px";
            lblEliminaRuoliDaAssegnare = CreaElemento('label', div.id + 'label', div.id); lblEliminaRuoliDaAssegnare.className = "btn btn-default";
                var inputEliminaRuoliDaAssegnare = CreaElemento('input', 'inputEliminaRuoliDaAssegnare', lblEliminaRuoliDaAssegnare.id); inputEliminaRuoliDaAssegnare.setAttribute('type', 'radio'); inputEliminaRuoliDaAssegnare.setAttribute('name', 'opzMantenereRuoliDaAssegnare'); inputEliminaRuoliDaAssegnare.value = 0; inputEliminaRuoliDaAssegnare.onclick = AttivaOpzioneTracciaRuoliDaAssegnare;
                CreaElemento('span', 'spanEliminaRuoliDaAssegnare', lblEliminaRuoliDaAssegnare.id, strVoglioEliminareRuoliDaAssegnare);

        div = CreaElemento('div', divContenuto.id + 'divMantieniRuoliDaAssegnare', divContenuto.id); div.style.margin = "20px";
            lblMantieniRuoliDaAssegnare = CreaElemento('label', div.id + 'label', div.id); lblMantieniRuoliDaAssegnare.className = "btn btn-default";
                var inputMantieniRuoliDaAssegnare = CreaElemento('input', 'inputMantieniRuoliDaAssegnare', lblMantieniRuoliDaAssegnare.id); inputMantieniRuoliDaAssegnare.setAttribute('type', 'radio'); inputMantieniRuoliDaAssegnare.setAttribute('name', 'opzMantenereRuoliDaAssegnare'); inputMantieniRuoliDaAssegnare.value = 1; inputMantieniRuoliDaAssegnare.onclick = AttivaOpzioneTracciaRuoliDaAssegnare;
                CreaElemento('span', 'spanMantieniRuoliDaAssegnare', lblMantieniRuoliDaAssegnare.id, strVoglioMantenereRuoliDaAssegnare);

    /* Salva e annulla */
    var divPulsantiFinali = CreaElemento('div', PannelloOpzioni.id + 'PulsantiFinali', PannelloOpzioni.id); divPulsantiFinali.className = 'panel-footer';
        var Tabella = CreaElemento('table', PannelloOpzioni.id + 'TabellaPulsantiFinali', divPulsantiFinali.id); Tabella.className = "TabellaOpzioni"; Tabella.style.width = "100%";
            var tr = CreaElemento('tr', PannelloOpzioni.id + 'RigaTabellaPulsantiFinali', Tabella.id);
                var td = CreaElemento('td', PannelloOpzioni.id + 'CasellaAnnulla', tr.id);
                    const pulAnnulla = CreaElemento('a', PannelloOpzioni.id + 'Annulla', td.id, "<span class='fa fa-times'></span> " + strAnnullalemodifiche); pulAnnulla.className = "btn btn-default";
                    pulAnnulla.onclick = AnnullaAggiungiDoppiatore;

                    td = CreaElemento('td', PannelloOpzioni.id + 'CasellaSalva', tr.id); td.className = "text-right";
                    const pulSalva = CreaElemento('a', PannelloOpzioni.id + 'Salva', td.id, "<span class='fa fa-arrow-right'></span> " + strProcedi); pulSalva.className = "btn btn-success";
                    pulSalva.abilita(false);

                    pulSalva.onclick = () => {
                        pulSalva.abilita(false); pulSalva.innerText = strAttenderePrego;
                        AJAX("InserisciCandidatoNelCast.php", "N=" + encodeURIComponent(N) + "&IDUtenteCandidato=" + encodeURIComponent(DatiDoppiatoreCandidato.idcandidato) + "&RuoloUtenteCandidato=" + encodeURIComponent(inputRuoliCandidato.value) + "&RuoliDaAssegnare=" + encodeURIComponent(divPersonaggiLiberi ? inputPersonaggiLiberi.value : ""),
                            function (Dati) {
                                window.location.reload();
                            }, strAggiornamento, strSalvataggioCompletato
                        );
                    };

    DisabilitaSchermata();
    pulAggiungiDoppiatoreCandidatoNelCast.abilita(false);
    window.removeEventListener('keydown', ScorciatoieTastiera);
    ElencoCandidatiRuoliDaAssegnareScompare();
}

function VerificaNuoveClipAltriCandidati() {
    AJAX("ElencoCandidatiRuoliDaAssegnare.php", "N=" + encodeURIComponent(N),
        function (Dati) {
            const totCandidati = Dati.length, divNotifica = document.getElementById('divNotificaNuoveClipRuoliDaAssegnare');
            var contatoreCandidatiNuoveClip = 0;

            for (var I = 0; I < totCandidati; I++) {
                contatoreCandidatiNuoveClip += (Dati[I].ID != RuoliDaAssegnare_CandidatoSelezionato) && (Dati[I].DaVisualizzare == 1);
                DatiDoppiatori[Dati[I].ID] = { nome: Dati[I].Nome, numeroTraccia: RuoliDaAssegnare_NumeroTraccia }; // Aggiorna l'elenco dei doppiatori per determinare se sono online
            }

            if (contatoreCandidatiNuoveClip > 0) {
                divNotifica.className = 'fa fa-arrow-left';
                divNotifica.innerText = " " + strNuoveClipDa + contatoreCandidatiNuoveClip + " " + strCandidat + ((contatoreCandidatiNuoveClip != 1) ? suffissoMaschilePlurale : suffissoMaschileSingolare);
                divNotifica.style.animation = "blink-registrazione 500ms alternate 2s 10";
                divNotifica.style.display = "inline";
            } else {
                divNotifica.style.display = "none";
            }
        }, "", "", true
    );
}
/************************************/

/*** Funzioni al processamento dell'audio ***/
function ProcessaAudio_Monitora(e) {
    const input = e.data.audioBuffer, totInput = input.length;
    var sum = 0.0, instant = 0.0, i = 0;

    for (i = 0; i < totInput; ++i) {
        sum += (input[i] * input[i]);
    }

    instant = Math.sqrt(sum / totInput);
    instantMeter.value = (0.5 * instantMeter.value) + instant;
}

function ProcessaAudio_AcquisisciRegistrazione(e) {
    canaleAudio = e.data.audioRegistrato;
    LunghezzaNuovaRegistrazione = canaleAudio.length * 128;
    DisconnettiWorkletRegistrazione();
    MandaACreaRegistrazione(CreaRegistrazione_wav);
}
/********************************************/

function handleSuccess(stream) {
    const ac = audioContext, Didascalia = ac.sampleRate + " Hz - buffer-size: " + dimensioneBuffer;

    QualitaAltaRegistrazione = true; regMediaRecorder = false;

    sorgenteAudioSelezionata = ac.createMediaStreamSource(stream);
    registrazione = new window.AudioWorkletNode(ac, 'recorder-worklet');
    sorgenteAudioSelezionata.connect(registrazione).connect(ac.destination);
    AggiornaParametriRegistrazione();
    setTimeout(() => { if (registrazione) { registrazione.port.onmessage = ProcessaAudio_Monitora; } }, 500);

    pulRegistra.disabled = SolaVisione || (Righello.dataset.DisattivaClick == "si");
    instantMeter.setAttribute('title', Didascalia);

    if (selectQualitaRegistrazione.value == 0) {
        regMediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        regMediaRecorder.ondataavailable = handleDataAvailable;
        QualitaAltaRegistrazione = false;
    }
}

function handleError(error) {
    console.log('navigator.mediaDevices.getUserMedia errore: ', error);
    alert(strErroreMic + error);
}

function AttivaIngressi() {
    DisconnettiWorkletRegistrazione();
    if (sorgenteAudioSelezionata) { sorgenteAudioSelezionata.mediaStream.getAudioTracks().forEach(t => t.stop()); }
    navigator.mediaDevices.getUserMedia(ingressi).then(handleSuccess).catch(handleError);
    /* 	console.log("Attivazione ingressi..."); */
}

function DisconnettiWorkletRegistrazione() {
    if (registrazione) {
        try { registrazione.disconnect(); sorgenteAudioSelezionata.disconnect(); } catch (err) { }
        registrazione.port.onmessage = ""; registrazione.port.postMessage({ numCanale: 0, modalita: "Scollega" });
    }
    registrazione = false;
}

function AggiornaDispositivi() {
    const Microfono = SelezioneMicrofono.value ? { exact: SelezioneMicrofono.value } : undefined;
    const SoppressioneRumore = false;

    ingressi = {
        audio: { deviceId: Microfono, echoCancellation: false, autoGainControl: false, noiseSuppression: SoppressioneRumore },
        video: false
    };

    AttivaIngressi();
}

function AggiornaElencoDispositivi() {
    navigator.mediaDevices.enumerateDevices().then(AcquisisciDispositivi).catch(handleError);
}

function AggiornaParametriRegistrazione() {
    if (registrazione) {
        registrazione.port.postMessage({ modalita: "Monitoraggio", numCanale: 0, bufferSize: Number(dimensioneBuffer) });
    }
}


/*** Funzioni richiamate al Time Update del Video Guida ***/
function AggiornaTimeline() {
    const MinutaggioVideo = VideoGuidaMinutaggioCorrente();

    FunzioneRiproduzioneClip(MinutaggioVideo);
    PosizionaCursore(MinutaggioVideo);
    AggiornaMinutaggioVideo(MinutaggioVideo);
}

function AggiornaCursore() {
    const MinutaggioVideo = VideoGuidaMinutaggioCorrente();
    PosizionaCursore(MinutaggioVideo, 100);
    AggiornaMinutaggioVideo(MinutaggioVideo);
}

function AggiornaTimeline_Streaming() {
    const MinutaggioVideo = VideoGuidaMinutaggioCorrente();

    FunzioneRiproduzioneClip(MinutaggioVideo);
    FunzioneVisualizzazioneTitoli(MinutaggioVideo);
    AggiornaMinutaggioVideo(MinutaggioVideo);
    slideMinutaggioAttuale.value = MinutaggioVideo;
}

function AttivaRegistrazione_TimeUpdate() {
    RegistrazioneParti();
    MinutaggioUltimaRegistrazione = VideoGuidaMinutaggioCorrente();

    FunzioneNormaleAlTimeUpdate = (ModalitaUltraLightAttiva ? AggiornaTimeline : AggiornaCursoreConAnteprimaOndaSonoraEAscoltoClip_Analizzatore);
    VideoGuidaRimuoviFunzioneAlTimeUpdate(AttivaRegistrazione_TimeUpdate);
    VideoGuidaFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
}

function AggiornaCursoreConAnteprimaOndaSonora_Analizzatore() {
    AggiornaCursore();
    AnteprimaOndaSonora_Analizzatore();
}

function AggiornaCursoreConAnteprimaOndaSonoraEAscoltoClip_Analizzatore() {
    AggiornaTimeline();
    AnteprimaOndaSonora_Analizzatore();
}

function AnteprimaOndaSonora_Analizzatore() {
    analizzatoreAudio.getFloatTimeDomainData(audioAnalizzato);
    AnteprimaOndaSonora(audioAnalizzato[0]);
}

function AnteprimaOndaSonora(v) {
    const c = CanvasOnda, PartenzaCanvas = c.offsetLeft, HEIGHT = c.height, metaAltezza = HEIGHT / 2;
    const x = Cursore.offsetLeft - PartenzaCanvas, valore = v * HEIGHT, partenzaDisegno = (metaAltezza + valore), colorevalore = valore / HEIGHT * 255;
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'rgb(' + colorevalore + ', ' + (colorevalore / 2) + ', ' + (255 - colorevalore) + ')';
    canvasCtx.moveTo(x, partenzaDisegno);
    canvasCtx.lineTo(x, (partenzaDisegno - (valore * 2)));
    canvasCtx.stroke();
}
/**********************************************************/

function RiproduciClipInSync(MinutaggioVideo) {
    const MinutaggioVideoIniziale = MinutaggioVideo + LatenzaAudio, t = new Date().getTime();

    ClipDaRiprodurre.forEach((I) => {
        const t1 = new Date().getTime(), SecondiTrascorsi = ((t1 - t) / 1000);
        const MinutaggioVideoAggiustato = MinutaggioVideoIniziale + SecondiTrascorsi;
        const datiAudio = DatiAudioRegistrato[I], MinutaggioAudio = datiAudio.MinutaggioRegistrazione, InizioAudio = (+MinutaggioAudio) + (+datiAudio.taglioIniziale), ClipNelMinutaggioAttuale = (InizioAudio <= MinutaggioVideoAggiustato), SecondiPartenzaAudio = ((InizioAudio - MinutaggioVideoAggiustato) * !ClipNelMinutaggioAttuale);
        const InizioClip = (+datiAudio.taglioIniziale) + ((MinutaggioVideoAggiustato - InizioAudio) * ClipNelMinutaggioAttuale), FineClip = (+datiAudio.taglioFinale) - InizioClip;
        datiAudio.audio.start(audioContext.currentTime + SecondiPartenzaAudio, InizioClip, FineClip * (FineClip > 0));
        datiAudio.avviato = true;
        if (datiAudio.alPlay) { clearTimeout(datiAudio.tmrEventoAlPlay); datiAudio.tmrEventoAlPlay = setTimeout(() => { datiAudio.alPlay(datiAudio); }, (SecondiPartenzaAudio + 2) * 1000); }
    });

    ClipDaRiprodurre = [];
    FunzioneRiproduzioneClip = function () { };

    /* if (new Date().getTime() - t > 100) {StoppaTutteLeRegistrazioni(); ElaboraClipDaRiprodurre();} // Se l'elaborazione ci ha messo troppo tempo le clip potrebbero essere sfasate e quindi ripete l'operazione. */
}

function MinutaggioCambiato() {
    const MinutaggioNuovo = Number(MinutaggioSecondi.value) + (Number(MinutaggioMinuti.value) * 60);
    Posizionati(MinutaggioNuovo);
}

function slide_SpostatiAlMinutaggioSelezionato() {
    Posizionati((slideMinutaggioAttuale.value * (slideMinutaggioAttuale.value >= InizioVideoGuida)) || InizioVideoGuida);
}

Righello.onmousedown = PosizionatiAlMinutoCliccato;
divContenutoTracce.onmousemove = AnteprimaCursoreSeVuoto;
divContenutoTracce.onmouseleave = EliminaAnteprimaCursore;
divMinutaggiRighello.onmousemove = AnteprimaCursore;
divMinutaggiRighello.onmouseleave = EliminaAnteprimaCursore;

function AnteprimaCursoreSeVuoto(e) {
    if (e.target.id.substr(0, 3) != "ELT") { AnteprimaCursore(e); } else { EliminaAnteprimaCursore(); }
}

function AnteprimaCursore(e) {
    const X = e.clientX + window.scrollX - ContenitoreRighello.offsetLeft;
    CursoreAnteprima.iStyle({ left: X + "px", opacity: 0.5 });
}

function EliminaAnteprimaCursore() {
    CursoreAnteprima.style.opacity = 0;
}

function DeterminaMinutaggioCliccato(e) {
    var MN = 0;
    var X = e.clientX + window.scrollX;
    var NuovoMinutaggio = (MN = (X - ContenitoreRighello.offsetLeft) * totDurataVideoGuida / divContenutoTracce.clientWidth) * (MN > InizioVideoGuida);
    return NuovoMinutaggio || InizioVideoGuida;
}

function PosizionatiAlMinutoCliccato(e) {
    if ((Righello.dataset.DisattivaClick == "no") && (e.button == 0) && (e.clientY < window.innerHeight - 50)) {
        Posizionati(DeterminaMinutaggioCliccato(e));
    }
}

function PosizionaCursore(Minutaggio, ritardoscorrimento = 500) {
    slideMinutaggioAttuale.value = Minutaggio;
    Cursore.style.left = (Minutaggio / totDurataVideoGuida * 100) + "%";
    tmrRitardoScorrimentoCursore = window.setTimeout(SeguiCursore, ritardoscorrimento);
}

function SeguiCursore() {
    window.scrollTo((Cursore.offsetLeft - 200) * (DimensioneRighello > 100), WindowScrollY);
}

/*** Marcatori sulla timeline ***/
function CaricaMarcatori(FunzioneAlTermine = () => { }) {
    CaricaMarcatori.MarcatoriPrec = CaricaMarcatori.Marcatori;
    CaricaMarcatori.Marcatori = [];
    AJAX('CaricaMarcatori.php', 'NumProgetto=' + N,
        (Dati) => {
            const totMarcatori = Dati.length;
            /* Disegna i nuovi marcatori o aggiorna il testo di quelli già presenti */
            for (let I = 0; I < totMarcatori; I++) {
                const M = Dati[I];
                if (Marcatore = document.getElementById('Marcatore' + M.NumMarcatore)) {
                    const Casella = Marcatore.children[0];
                    if (Casella != document.activeElement) { Casella.value = M.TestoMarcatore; Casella.dispatchEvent(ev_cambiamento); }
                } else {
                    DisegnaMarcatore(M.ID_UtenteMarcatore, M.MinutaggioMarcatore, M.TestoMarcatore, M.NumMarcatore);
                }
                CaricaMarcatori.Marcatori[M.NumMarcatore] = true;
            }

            /* Elimina i marcatori non più presenti */
            CaricaMarcatori.MarcatoriPrec.forEach((I, IDMarcatore) => { if (!CaricaMarcatori.Marcatori[IDMarcatore]) { EliminaElemento(document.getElementById('Marcatore' + IDMarcatore)); } });

            FunzioneAlTermine();
        }, "", "", true
    );
}
CaricaMarcatori.Marcatori = []; CaricaMarcatori.MarcatoriPrec = [];

function AggiungiMarcatore(e) {
    if (e.button != 0) { return; }
    const IDTraccia = ((e.target.id.slice(0, 3) == 'ELT') ? e.target.parentNode.id : e.target.id);
    if (IDTraccia.slice(0, 7) != "Traccia") { return; }

    const IDUtente = document.getElementById(IDTraccia).dataset.idutente, MinutaggioMarcatore = DeterminaMinutaggioCliccato(e);
    if ((ID_Utente == IDUtente) || (SonoCreatoreProgetto)) {
        AJAX('SalvaNuovoMarcatore.php', `NumProgetto=${N}&NumProvino=${P}&Utente=${encodeURIComponent(IDUtente)}&Minutaggio=${encodeURIComponent(MinutaggioMarcatore)}&Testo=${encodeURIComponent(strMarcatoreDescrDefault)}`,
            (Dati) => {
                CaricaMarcatori(() => { document.getElementById('Marcatore' + Dati.IDMarcatore).children[0].select(); });
            }, "", "", true
        );
    }
    CambiaTool(toolStandard);
}

function DisegnaMarcatore(ID_UtenteMarcatore, Minutaggio, Stringa, IDMarcatore) {
    if (!DatiDoppiatori[ID_UtenteMarcatore]) { return; }

    const Modificabile = ((SonoCreatoreProgetto) || (ID_Utente == ID_UtenteMarcatore));

    const Marcatore = CreaElemento('div', 'Marcatore' + IDMarcatore, 'Traccia' + DatiDoppiatori[ID_UtenteMarcatore].numeroTraccia); Marcatore.dataset.id = IDMarcatore; Marcatore.className = 'Marcatore';
    Marcatore.style.left = (Minutaggio / totDurataVideoGuida * 100) + "%";
    if (Modificabile) {
        Marcatore.dataset.modificabile = "si";

        Marcatore.onmousedown = (e) => {
            if ((e.button != 0) || (StrumentoMouse != toolMarcatore) || (e.target.tagName == 'INPUT')) { return; }

            e.stopPropagation();

            if (confirm(strVuoiEliminareMarcatore)) {
                AJAX('EliminaMarcatore.php', `N=${encodeURIComponent(e.currentTarget.dataset.id)}`, "", "", "", true);
                EliminaElemento(e.currentTarget);
            }
        };
    }

    const Casella = CreaElemento('input', 'input' + Marcatore.id, Marcatore.id); Casella.value = Stringa; Casella.readOnly = !Modificabile; Casella.style.pointerEvents = (Modificabile ? "auto" : "none");
    Casella.onmousedown = (e) => { e.stopPropagation(); };
    Casella.onfocus = (e) => {
        const C = e.currentTarget;
        SelezionaTutto(e);
        C.className = ""; // Rimette la casella in orizzontale.
        C.parentNode.style.zIndex = 100000;
    };
    Casella.onchange = (e) => {
        const C = e.currentTarget, M = C.parentNode;
        C.value = C.value.trim();
        if (C.value == "") { C.value = C.dataset.valoreprec; }
        C.size = C.value.length;
        C.dataset.valoreprec = C.value;
        M.setAttribute('title', C.value);
        M.dataset.larghezza = C.offsetWidth; // Per CompattaMarcatori() considera la larghezza del campo di testo, a prescindere se verticale o meno
        CompattaMarcatori();
    };
    Casella.onblur = (e) => {
        const C = e.currentTarget, M = C.parentNode, Testo = C.value.trim();
        if (Testo) { AJAX('AggiornaMarcatore.php', `N=${encodeURIComponent(M.dataset.id)}&Testo=${encodeURIComponent(Testo)}`, "", "", "", true); }
        M.style.zIndex = "";
    };
    Casella.onkeydown = PerdiFocusConInvio;
    Casella.onchange({ currentTarget: Casella });

    return Casella;
}

function CompattaMarcatori() {
    const divM = document.getElementsByClassName('Marcatore'), totM = divM.length;
    var M = [];
    /* Memorizza i dati relativi ai marcatori divisi per traccia */
    for (let I = 0; I < totM; I++) {
        const divMarcatore = divM[I], traccia = +divMarcatore.parentNode.id.slice(7); // Estrapola solo il numero della traccia
        M[traccia] = (M[traccia] || []);
        M[traccia].push({ ID: divMarcatore.id, x: divMarcatore.offsetLeft, larghezza: divMarcatore.dataset.larghezza });
    }

    /* Per ogni traccia, ordina i marcatori per posizione X e verifica se si sovrappongono */
    M.forEach((Mtraccia) => {
        Mtraccia.sort((a, b) => { return a.x - b.x; });
        const totMtracciaDaElaborare = Mtraccia.length - 1;
        for (let I = 0; I < totMtracciaDaElaborare; I++) {
            const Marcatore = Mtraccia[I], MarcatoreSucc = Mtraccia[I + 1], divMarcatore = document.getElementById(Marcatore.ID), Casella = divMarcatore.children[0];
            if (Casella == document.activeElement) { continue; }

            const ComprimiMarcatore = (((+Marcatore.x) + (+Marcatore.larghezza)) > (+MarcatoreSucc.x));
            Casella.className = (ComprimiMarcatore ? "Marcatore-verticale" : "");
            divMarcatore.style.width = (ComprimiMarcatore ? "10px" : "");
        }
    });
}
/*********************/

function AggiornaMinutaggioVideo(Minutaggio) {
    var M = new MinutiESecondi(Minutaggio);
    MinutaggioMinuti.value = M.Minuti; MinutaggioSecondi.value = M.Secondi.toFixed(DecimaliSecondiMinutaggio).padStart(2, "0");

    if (RiproduzioneInCorso) {
        if (Minutaggio >= totDurataVideoGuida) {
            if (StoRegistrando) { stopRecording(); } else { StopVideoGuida(); }
            return;
        }

        if (!StoRegistrando) {
            /* Se il currentTime dell'audioContext è più lento del tempo reale vuol dire che è da un tot di secondi che non riproduce clip. In questo caso viene sospeso e riattivato l'audioContext per rimetterlo in tempo reale (succede principalmente sui sistemi Android). */
            const currentTimeAttuale = audioContext.currentTime, currentTimeCalcolato = (+currentTimeIniziale) + (((new Date().getTime()) - (+orarioIniziale)) / 1000), differenza = currentTimeCalcolato - currentTimeAttuale;
            if (differenza > 0.1) {
                audioContext.suspend().then(() => {
                    audioContext.resume().then(() => {
                        ElaboraClipDaRiprodurre();
                        currentTimeIniziale = audioContext.currentTime;
                        orarioIniziale = new Date().getTime();
                    });
                });
            }
        }
    }
}

async function Posizionati(MinutaggioNuovo, RiabilitaLaSchermata = true) {
    const stavoRiproducendo = RiproduzioneInCorso;

    async function RiattivaVideoGuida() {
        VideoGuidaRimuoviEventoAlTermineCaricamento(RiattivaVideoGuida);
        await pausa(500);
        if (stavoRiproducendo) {
            if ((VideoGuidaMinutaggioCorrente() | 0) != (MinutaggioNuovo | 0)) { setTimeout(RiattivaVideoGuida, 100); return; }
            PlayVideoGuida();
        } else {
            if (RiabilitaLaSchermata) { RiabilitaSchermata(true); }
        }
    }

    if ((VideoGuidaMinutaggioCorrente() == MinutaggioNuovo) || (MinutaggioNuovo > totDurataVideoGuida)) { return; }
    DisabilitaSchermata(true);
    setTimeout(() => { PosizionaCursore(MinutaggioNuovo); }, 100);
    StopVideoGuida(); ClipDaRiprodurre = [];
    clearInterval(tmrRitardoScorrimentoCursore);
    AggiornaMinutaggioVideo(MinutaggioNuovo);
    VideoGuidaImpostaEventoAlTermineCaricamento(RiattivaVideoGuida);
    VideoGuidaPosizionati(MinutaggioNuovo);
}


/*** Precarica clip ***
 * Richiama la funzione CaricaBufferAudio per le clip ancora non caricate, secondo i parametri indicati *
 * @param {Number} DalMinutaggio                        il minutaggio a partire dal quale le clip devono essere precaricate
 * @param {Number} FinoAlMinutaggio                     (facoltativo) il minutaggio entro il quale le clip devono essere precaricate, se non indicato precarica fino alla fine del video
 * @param {FunctionStringCallback} FunzioneAlTermine    (facoltativo) la funzione da lanciare al termine del caricamento di tutte le clip considerate nell'intervallo di tempo scelto.
 *                                                                    Se inserita, lancia il precaricamento di tutte le clip considerate contemporaneamente, altrimenti le clip vengono precaricate una alla volta per non affaticare l'elaborazione.
 * @param {Object} AltreOpzioni                         (facoltativo) opzioni relative al precaricamento, possono essere:
 ** @param {FunctionStringCallback} AltreOpzioni.FunzioneAlTermineSingoloPrecaricamento (facoltativo) la funzione da lanciare al termine di ogni singola clip precaricata
 ** @param {Boolean} AltreOpzioni.SoloBuffer                                            (facoltativo) indicare se per ogni clip precaricata deve memorizzare il solo buffer, senza effettuare altre operazioni */
function PrecaricaClip(DalMinutaggio, FinoAlMinutaggio, FunzioneAlTermine = false, AltreOpzioni = { FunzioneAlTermineSingoloPrecaricamento: () => { }, SoloBuffer: false }) {
    const totAudio = DatiAudioRegistrato.length, SecondiPrecaricamentoMax = 120;
    clearTimeout(PrecaricaClip.tmr);

    if (!FinoAlMinutaggio) { FinoAlMinutaggio = +DalMinutaggio + SecondiPrecaricamentoMax; }
    MinutaggioPrecaricamentoClip = DalMinutaggio;
    FunzioneAlTerminePrecaricamento = FunzioneAlTermine;
    totClipDaPrecaricare = 0; ContatoreClipPrecaricate = 0;

    for (var I = 0; I < totAudio; I++) {
        if (ClipDaPrecaricare(I, DalMinutaggio, FinoAlMinutaggio)) {
            if (FunzioneAlTermine) {
                totClipDaPrecaricare++;
                CaricaBufferAudio(I, AltreOpzioni.FunzioneAlTermineSingoloPrecaricamento, AltreOpzioni.SoloBuffer);
            } else {
                CaricaBufferAudio(I, AltreOpzioni.FunzioneAlTermineSingoloPrecaricamento, AltreOpzioni.SoloBuffer);
                return;
            }
        }
    }

    /* Se non ci sono clip da precaricare */
    if (totClipDaPrecaricare == 0) {
        if (FunzioneAlTerminePrecaricamento) {
            FunzioneAlTerminePrecaricamento();

        } else {
            PrecaricaClip.tmr = setTimeout(() => { MinutaggioPrecaricamentoClip = FinoAlMinutaggio; PrecaricaClipSuccessiva(); console.log("Timeout avviato.", MinutaggioPrecaricamentoClip); }, (+FinoAlMinutaggio - VideoGuidaMinutaggioCorrente() - (SecondiPrecaricamentoMax / 2)) * 1000);
            console.log("Settato Timeout fra", +FinoAlMinutaggio - VideoGuidaMinutaggioCorrente() - (SecondiPrecaricamentoMax / 2), "sec. Precaricamento clip dal secondo", FinoAlMinutaggio);
        }
    }
}
PrecaricaClip.tmr = false;

function ClipDaPrecaricare(Numero, DalMinutaggio, FinoAlMinutaggio) {
    const datiAudio = DatiAudioRegistrato[Numero];
    return ((!datiAudio.buffer) && (!datiAudio.disattivato) && (!datiAudio.Rimosso) && (datiAudio.MinutaggioRegistrazione < FinoAlMinutaggio) && (DalMinutaggio < ((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.Durata))));
}

function CaricaBufferAudio(Numero, FunzioneAlTermine = () => { }, SoloBuffer = false) {
    const datiAudio = DatiAudioRegistrato[Numero];
    if (datiAudio.RichiestoCaricamentoBuffer) { return; }

    datiAudio.RichiestoCaricamentoBuffer = true;
    CaricaAudio(Numero, datiAudio, 'arraybuffer', (ClipAudio) => {
        audioContext.decodeAudioData(ClipAudio).then((buffer) => {
            /** Se si tratta di colonna internazionale, manda alla funzione che si occupa di generare il buffer per concatenare gli spezzoni **/
            if (DatiAudioRegistrato[Numero].numspezzoneCI >= 0) { GeneraBufferCI(DatiAudioRegistrato[Numero], buffer, FunzioneAlTermine); return; }
            /**********************************************************************************************************************************/

            /** Memorizza la clip **/
            DatiAudioRegistrato[Numero].buffer = buffer;

            /** Verifica se era prevista una funzione al termine del precaricamento di tutte le clip considerate **/
            VerificaFunzioneAlTerminePrecaricamento();

            /** Se richiesto di memorizzare il solo buffer, manda la funzione eventualmente passata e termina **/
            if (SoloBuffer) { FunzioneAlTermine(); return; }

            /** Effettua le ulteriori operazioni sulla clip **/
            OperazioniAlBufferCaricato(Numero, FunzioneAlTermine);

            /** Se non è stata passata una funzione al termine del precaricamento di tutte le clip considerate, ma si sta facendo il precaricamento leggero, trova tutte le clip che devono avere lo stesso buffer e glielo assegna **/
            if (!FunzioneAlTerminePrecaricamento) {
                DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione].forEach((da) => { if (!da.buffer) { da.buffer = buffer; OperazioniAlBufferCaricato(da.numero); } });
            }

            /** In caso di riproduzione in corso, attiva la riproduzione delle clip appena caricate **/
            if (RiproduzioneInCorso) { FunzioneRiproduzioneClip = RiproduciClipInSync; }

        }).catch((err) => {
            /** In caso di errore nel caricamento: **/
            console.log(err, datiAudio.NumeroUnivoco, datiAudio.Registrazione);
            /* Se in modalità streaming avvisa soltanto */
            if (ModalitaStreaming) { Messaggio(strErroreCaricamentoClip); return; }

            /* Flagga l'audio come danneggiato */
            AJAX("AggiornaAudioDanneggiato.php", "N=" + datiAudio.NumeroUnivoco + "&Info=" + encodeURIComponent(err + " - " + datiAudio.infoAggiuntive),
                () => {/* Passa avanti col caricamento */
                    if (!CaricamentoInizialeTerminato) { AggiornaCaricamentoClip(); }
                    /* Lo manda nel cestino, così non interferisce con i caricamenti (tanto non verrà più aggiornato) */
                    datiAudio.Rimosso = true; datiAudio.danneggiato = true;
                }, "", "", true);
        });
    });
}

function VerificaFunzioneAlTerminePrecaricamento() {
    if (FunzioneAlTerminePrecaricamento) {
        /* Manda la funzione una volta precaricate tutte le clip */
        if (++ContatoreClipPrecaricate >= totClipDaPrecaricare) { FunzioneAlTerminePrecaricamento(); }
    } else {
        /* Precarica clip successiva */
        setTimeout(PrecaricaClipSuccessiva, 100 + (200 * SistemaAttualeAndroid));
    }
}

function OperazioniAlBufferCaricato(Numero, FunzioneAlTermine = () => { }) {
    /** Attiva la clip se si sta riproducendo **/
    if (RiproduzioneInCorso) { VerificaClipDaRiprodurre(Numero, VideoGuidaMinutaggioCorrente()); }

    /** Visualizza graficamente il caricamento della clip **/
    VisualizzaELTBufferCaricato(Numero);

    /** Manda l'eventuale funzione passata **/
    FunzioneAlTermine();
}

function PrecaricaClipSuccessiva() {
    if (RiproduzioneInCorso) {
        if ((!FunzioneAlTerminePrecaricamento) && (!StoRegistrando || checkAscoltaClipDuranteRegistrazione.checked)) {
            PrecaricaClip(MinutaggioPrecaricamentoClip);
        }
    }
}

function VisualizzaELTBufferCaricato(Numero) {
    const ELT = document.getElementById('ELTReg' + Numero);
    if (ELT) { ELT.iStyle({ opacity: 1, transform: "" }); }
}

function GeneraBufferCI(datiAudio, buffer, FunzioneAlTermine = () => { }) {
    function EseguiFunzioniAlTermineCaricamentoBufferCI() {
        VerificaFunzioneAlTerminePrecaricamento();
        AggiornaRiproduzioneClip(datiAudio.numero);
        FunzioneAlTermine();
    }

    const b = buffer, SampleRate = b.sampleRate;

    if (datiAudio.numspezzoneCI > 0) {
        /* Fade-in primo secondo */
        for (c = 0; c < b.numberOfChannels; c++) {
            bufferCanale = b.getChannelData(c);
            for (s = 0; s < SampleRate; s++) {
                bufferCanale[s] *= s / SampleRate;
            }
        }
    }

    if (SpezzoneSuccessivo = SpezzoniAudioCI[+datiAudio.numspezzoneCI + 1]) {
        CaricaAudio(0, { Registrazione: SpezzoneSuccessivo }, 'arraybuffer',
            (Contenuto) => {
                audioContext.decodeAudioData(Contenuto).then(
                    (bufferSucc) => {
                        /* Fade-out primo secondo del buffer successivo */
                        const SampleRateSucc = bufferSucc.sampleRate;
                        for (c = 0; c < bufferSucc.numberOfChannels; c++) {
                            bufferCanale = bufferSucc.getChannelData(c);
                            for (s = 0; s < SampleRateSucc; s++) {
                                bufferCanale[s] *= (SampleRateSucc - s) / SampleRateSucc;
                            }

                            /* Azzera il secondo successivo al primo per garantire il corretto fade-out */
                            const secondosucc = SampleRateSucc * 2;
                            for (s = SampleRateSucc; s < secondosucc; s++) {
                                bufferCanale[s] = 0;
                            }
                        }

                        datiAudio.buffer = appendBuffer([b, bufferSucc]);
                        datiAudio.Durata = datiAudio.taglioFinale = +b.duration + 1;
                        EseguiFunzioniAlTermineCaricamentoBufferCI();
                    }
                );
            }
        );

    } else {
        datiAudio.buffer = b;
        datiAudio.Durata = datiAudio.taglioFinale = datiAudio.buffer.duration;
        EseguiFunzioniAlTermineCaricamentoBufferCI();
    }
}

function ScaricaMemoria() {
    const MinutaggioVideo = VideoGuidaMinutaggioCorrente() - 2, totAudio = DatiAudioRegistrato.length;
    for (let I = 0; I < totAudio; I++) {
        const datiAudio = DatiAudioRegistrato[I];
        if (datiAudio.buffer && ((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.Durata) < MinutaggioVideo)) {
            datiAudio.audio = null; datiAudio.buffer = null; datiAudio.RichiestoCaricamentoBuffer = false;
        }
    }
}

function DisabilitaSchermata(ImmagineAttesa) {
    Righello.dataset.DisattivaClick = "si"; OpacitaRighello(0.5); clearInterval(tmrAggiornaClip);
    pulMessaggioVocale.abilita(false);
    DisabilitaElementiGenerali(true);
    PlayPausaCliccandoSulVideo(false);
    DisabilitaElementiRegistrazione(true);
    if (ImmagineAttesa) { AttivaImmagineAttesa(); } else { EliminaImgAttesa(); }
}

function RiabilitaSchermata(Aggiorna) {
    Righello.dataset.DisattivaClick = "no"; OpacitaRighello(1); AttivaAggiornamentoClip();
    pulMessaggioVocale.abilita(MessaggiIstantaneiAttivi && !MessaggioIstantaneoInRiproduzione);
    DisabilitaElementiGenerali(false);
    PlayPausaCliccandoSulVideo(true);
    DisabilitaElementiRegistrazione(SolaVisione);
    EliminaImgAttesa();
    if (!CaricamentoInizialeTerminato) { AttivaImmagineAttesa('TrePunti'); }
    if (Aggiorna && !ModalitaStreaming) { AggiornaClip(); }
}

function DisabilitaElementiGenerali(Disabilita) {
    pulPlay.disabled = Disabilita; MinutaggioMinuti.readOnly = Disabilita; MinutaggioSecondi.readOnly = Disabilita; opzFunzionalitaPreRegistrazione.disabled = Disabilita; inputCountdownRegistrazione.disabled = Disabilita; checkAscoltaClipDuranteRegistrazione.disabled = Disabilita; slideMinutaggioAttuale.disabled = Disabilita;
    SelezioneMicrofono.disabled = Disabilita; selectQualitaRegistrazione.disabled = Disabilita;
    document.getElementById('pulEsci').abilita(!Disabilita);
}

function DisabilitaElementiRegistrazione(Disabilita) {
    pulRegistra.disabled = Disabilita;
}

function AttivaImmagineAttesa(Tipo = 'default') {
    const TipoAnimazione = { 'default': "<div class='sk-chase'><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div></div>", 'TrePunti': '<div class="sk-flow"><div class="sk-flow-dot"></div><div class="sk-flow-dot"></div><div class="sk-flow-dot"></div></div>', 'Pulse': ' <div class="sk-pulse"></div>', 'TreCubi': ' <div class="sk-wander"><div class="sk-wander-cube"></div><div class="sk-wander-cube"></div><div class="sk-wander-cube"></div><div class="sk-wander-cube"></div></div>' };
    tmrImmagineAttesa = window.setTimeout(() => { imgAttesa.innerHTML = TipoAnimazione[Tipo]; }, 300);
}

function EliminaImgAttesa() {
    imgAttesa.innerHTML = ""; clearTimeout(tmrImmagineAttesa);
}

function ImpostaVolumeVideoGuida(Volume) {
    slideVolumeVideoGuida.value = Volume;
    CambiaVolumeVideoGuida();
}

function CambiaVolumeVideoGuida() {
    VideoGuidaImpostaVolume(Number(slideVolumeVideoGuida.value));
    CambiaVolumeVideoGuida.volume = slideVolumeVideoGuida.value;
}
CambiaVolumeVideoGuida.volume = 0;

function handleDataAvailable(blob) {
    recordedBlobs.push(blob.data);
}

function handleStop(e) {
    console.log('mediaRecorder si è stoppato: ', e);
}

function toggleRecording() {
    if (StoRegistrando === false) {
        startRecording();
    } else {
        stopRecording();
    }
}

/*** Messaggi vocali istantanei ***/
function GeneraOndaSonoraMessaggioVocale(SorgenteAudio, Didascalia) {
    /** Predispone l'anteprima dell'onda sonora **/
    /* Crea l'analizzatore audio */
    analizzatoreAudio = audioContext.createAnalyser();
    const bufferLength = analizzatoreAudio.frequencyBinCount;
    SorgenteAudio.connect(analizzatoreAudio);
    audioAnalizzato = new Uint8Array(bufferLength);

    /* Crea il canvas */
    const divCanvas = CreaElemento('div', 'divCanvasMessaggioVocale', document.body.id); divCanvas.iStyle({ position: "fixed", bottom: "20%", left: "calc(50% - 100px)", height: "50px", width: "200px", zIndex: 100000 });
    const canvasOndaMessaggioVocale = CreaElemento('canvas', 'canvasOndaMessaggioVocale', divCanvas.id), canvasMVCtx = canvasOndaMessaggioVocale.getContext("2d"); canvasOndaMessaggioVocale.height = 50; canvasOndaMessaggioVocale.width = 200; canvasOndaMessaggioVocale.iStyle({ borderRadius: "5px", opacity: 0.8 });
    CreaElemento('p', 'pCanvasMessaggioVocale', divCanvas.id, Didascalia).iStyle({ textAlign: 'center', fontWeight: 'bold', background: "rgba(255, 255, 255, 0.8)", borderRadius: "5px" });

    GeneraOndaSonoraMessaggioVocale.tmr = setInterval(() => {
        analizzatoreAudio.getByteTimeDomainData(audioAnalizzato);
        const c = canvasOndaMessaggioVocale, sliceWidth = c.width * 1.0 / bufferLength;
        canvasMVCtx.fillStyle = "rgb(0, 0, 0)";
        canvasMVCtx.fillRect(0, 0, c.width, c.height);
        canvasMVCtx.lineWidth = 2;
        canvasMVCtx.strokeStyle = "rgb(0, 200, 0)";
        canvasMVCtx.beginPath();
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = audioAnalizzato[i] / 128.0;
            const y = v * c.height / 2;
            canvasMVCtx.lineTo(x, y);
            x += sliceWidth;
        }

        canvasMVCtx.lineTo(c.width, c.height / 2);
        canvasMVCtx.stroke();
    }, 100);

    GeneraOndaSonoraMessaggioVocale.termina = () => { clearInterval(GeneraOndaSonoraMessaggioVocale.tmr); EliminaElemento(divCanvas); analizzatoreAudio = false; }
}
GeneraOndaSonoraMessaggioVocale.tmr = false;
GeneraOndaSonoraMessaggioVocale.termina = () => { };

function RegistraMessaggioVocale_slow() {
    pulMessaggioVocale.className = "btn btn-primary";
    RegistraMessaggioVocale_slow.tmr = setTimeout(RegistraMessaggioVocale, 400);
}
RegistraMessaggioVocale_slow.tmr = false;

function RegistraMessaggioVocale() {
    if (MessaggioIstantaneoInRiproduzione) { return; }

    DisabilitaSchermata(); instantMeter.style.display = "none"; pulMessaggioVocale.abilita(true);
    if (QualitaAltaRegistrazione) {
        registrazione.port.onmessage = "";
        registrazione.port.postMessage({ numCanale: 0, modalita: "Registrazione" });
    } else {
        DisconnettiWorkletRegistrazione();
        regMediaRecorder.start();
    }

    GeneraOndaSonoraMessaggioVocale(sorgenteAudioSelezionata, strTuMessaggioVocale);

    pulMessaggioVocale.className = "btn btn-warning";
    RegistraMessaggioVocale.RegistrazionePartita = true;
    RegistraMessaggioVocale.tmr = setTimeout(MandaMessaggioVocale, 120000);
}
RegistraMessaggioVocale.RegistrazionePartita = false;
RegistraMessaggioVocale.tmr = false;

function MandaMessaggioVocale() {
    clearTimeout(RegistraMessaggioVocale_slow.tmr);
    clearTimeout(RegistraMessaggioVocale.tmr);

    if (RegistraMessaggioVocale.RegistrazionePartita) {
        RegistraMessaggioVocale.RegistrazionePartita = false;
        GeneraOndaSonoraMessaggioVocale.termina();
        setTimeout(() => { instantMeter.style.display = "inline"; }, 100);
        pulMessaggioVocale.abilita(false);
        ffmpeg_TotaleProcessi = 0; ffmpeg_FunzioneAlTermineProcessi = SalvaMessaggioVocale;
        if (QualitaAltaRegistrazione) {
            registrazione.port.onmessage = ProcessaAudio_AcquisisciRegistrazione;
            registrazione.port.postMessage({ numCanale: 0, modalita: "AcquisisciRegistrazione" });
        } else {
            regMediaRecorder.onstop = () => { MandaACreaRegistrazione(CreaRegistrazione_mediaRecorder); };
            try { regMediaRecorder.stop(); } catch (err) { RiattivaInterfacciaDopoRegistrazione(); }
        }
        pulMessaggioVocale.className = "btn btn-info";
        pulMessaggioVocale.children[0].className = "fa fa-spin fa-spinner";

    } else {
        Messaggio(pulMessaggioVocale.title, "OK");
        pulMessaggioVocale.className = "btn btn-default";
    }
}

function SalvaMessaggioVocale(Contenuto) {
    const MessaggioVocale = new File([Contenuto], "MessaggioVocale.wav"), FormatoFile = "wav", UtentiDestinatari = selUtenteMessaggioVocale.value;
    RiabilitaSchermata(); pulMessaggioVocale.abilita(false); setTimeout(AttivaIngressi, 500);
    AJAX("MandaMessaggioIstantaneo.php", CreaParametri({ N: N, FileMessaggioIstantaneo: MessaggioVocale, Formato: FormatoFile, Destinatari: UtentiDestinatari }), () => { pulMessaggioVocale.className = "btn btn-default"; pulMessaggioVocale.children[0].className = "fa fa-microphone"; pulMessaggioVocale.abilita(Righello.dataset.DisattivaClick == "no"); }, strInvioInCorso, strInviato, true, true);
    setTimeout(AggiornaClip, 500);
}

function CheckMessaggiVocaliIstantanei() {
    AJAX("CaricaMessaggioIstantaneo.php", "N=" + N,
        (Dati) => {
            if (!Dati.FileMessaggioIstantaneo) { CheckMessaggiVocaliIstantanei.tmr = setTimeout(CheckMessaggiVocaliIstantanei, 2500); return; }

            if ((!RegistraMessaggioVocale.RegistrazionePartita) && (!MessaggioIstantaneoInRiproduzione) && (!StoRegistrando)) {
                MessaggioIstantaneoInRiproduzione = true;
                CaricaAudio(0, { Registrazione: Dati.FileMessaggioIstantaneo }, 'arraybuffer',
                    (Contenuto) => {
                        audioContext.decodeAudioData(Contenuto).then((buffer) => {
                            const MI = new AudioBufferSourceNode(audioContext, { buffer: buffer });
                            const compressore = audioContext.createDynamicsCompressor(); compressore.threshold.value = -50; compressore.knee.value = 40;
                            MI.connect(compressore).connect(audioContext.destination);
                            MI.onended = () => { GeneraOndaSonoraMessaggioVocale.termina(); pulMessaggioVocale.abilita(Righello.dataset.DisattivaClick == "no"); AJAX("EliminaMessaggioIstantaneo.php", "ID=" + Dati.ID_MessaggioIstantaneo + "&N=" + N, () => { MessaggioIstantaneoInRiproduzione = false; CheckMessaggiVocaliIstantanei(); }, "", "", true); };
                            GeneraOndaSonoraMessaggioVocale(MI, Dati.Nome);
                            pulMessaggioVocale.abilita(false);
                            setTimeout(() => { MI.start(); }, 200);
                        });
                    }
                );

            } else {
                if (StoRegistrando) { Messaggio("<b>" + Dati.Nome + "</b>" + strMessaggioVocaleRiprodottoDopoRegistrazione, "OK"); }
                if (!MessaggioIstantaneoInRiproduzione) { CheckMessaggiVocaliIstantanei.tmr = setTimeout(CheckMessaggiVocaliIstantanei, 3000); }
            }
        }, "", "", true
    );
}
CheckMessaggiVocaliIstantanei.tmr = false;
/*****************************/

function startRecording() {
    if (MessaggioIstantaneoInRiproduzione) { return; }

    /* Inizializza */
    canaleAudio = []; canaleAudio.length = 0; recordedBlobs = []; LunghezzaNuovaRegistrazione = 0; StoRegistrando = true;

    if (QualitaAltaRegistrazione) {
        registrazione.port.onmessage = "";
    } else {
        DisconnettiWorkletRegistrazione();
    }

    if (!ModalitaUltraLightAttiva) {
        /** Predispone l'anteprima dell'onda sonora **/
        /* Crea l'analizzatore audio */
        analizzatoreAudio = audioContext.createAnalyser();
        sorgenteAudioSelezionata.connect(analizzatoreAudio);
        audioAnalizzato = new Float32Array(analizzatoreAudio.fftSize);

        /* Crea il canvas */
        const IDTraccia = "Traccia" + DatiDoppiatori[ID_Utente].numeroTraccia, c = CreaElemento('canvas', 'canvasOnda', IDTraccia), CT = document.getElementById(IDTraccia);
        c.iStyle({ position: "absolute", top: "0%", height: "100%", left: Cursore.offsetLeft + "px" });
        c.width = CT.offsetWidth - Cursore.offsetLeft; c.height = CT.offsetHeight;
        CanvasOnda = c; canvasCtx = c.getContext("2d");
    }

    /* Stoppa il filmato e predispone l'interfaccia */
    VideoGuidaRimuoviFunzioneAlTimeUpdate(AggiornaTimeline);
    StopVideoGuida(); DisabilitaSchermata(true); pulPlay.style.opacity = 0;

    /* Memorizza il minutaggio di partenza della registrazione (utilizzato solo in caso di annullamento per riposizionarsi) */
    MinutaggioPartenzaRegistrazione = VideoGuidaMinutaggioCorrente();

    /* Disabilita monitoraggio microfono */
    instantMeter.value = 0; instantMeter.style.display = "none";

    /* Impedisce all'utente di intervenire */
    window.removeEventListener('keydown', ScorciatoieTastiera);
    PlayPausaCliccandoSulVideo(false);

    /* Riduce il volume del filmato se troppo alto */
    if ((!ColonnaInternazionaleAttivata) && (slideVolumeVideoGuida.value > 0.8)) { ImpostaVolumeVideoGuida(0.2); }

    /* Visualizza l'interfaccia */
    imgRegistra.style.display = "none"; TestoPulRegistra.style.display = "inline"; TestoPulRegistra.innerHTML = "<span class='fa fa-circle'></span>"; pulRegistra.style.opacity = 1;

    /* Attiva la funzionalità di pre-registrazione a seconda della scelta dell'utente */
    if (inputCountdownRegistrazione.value == 0) { opzFunzionalitaPreRegistrazione.selectedIndex = 0; } // Se i secondi sono impostati a zero, lo considera sempre countdown
    switch (opzFunzionalitaPreRegistrazione.value) {
        case "countdown":
            AvviaContoAllaRovesciaRegistrazione(); break;

        case "preroll":
            const MinutaggioPreroll = VideoGuidaMinutaggioCorrente() - Math.abs(inputCountdownRegistrazione.value), MinutaggioEffettivoPreroll = MinutaggioPreroll * (MinutaggioPreroll > 0);
            inputCountdownRegistrazione.value = parseInt(VideoGuidaMinutaggioCorrente() - MinutaggioEffettivoPreroll); // Aggiorna i secondi in base al minutaggio effettivo del pre-roll
            if (inputCountdownRegistrazione.value == 0) { opzFunzionalitaPreRegistrazione.selectedIndex = 0; AvviaContoAllaRovesciaRegistrazione(); return; } // Se i secondi effettivi sono pari a zero, diventa countdown
            VideoGuidaImpostaEventoAlTermineCaricamento(AvviaVideoGuidaPreroll);
            VideoGuidaPosizionati(MinutaggioEffettivoPreroll);
            PosizionaCursore(MinutaggioEffettivoPreroll); AggiornaMinutaggioVideo(MinutaggioEffettivoPreroll);
            break;
    }
}

function AvviaContoAllaRovesciaRegistrazione() {
    EliminaImgAttesa();
    if (!checkAscoltaClipDuranteRegistrazione.checked) { DisattivaClipNonCI(true); }
    const MinutaggioVideo = VideoGuidaMinutaggioCorrente();
    DisabilitaSchermata(true); PrecaricaClip(MinutaggioVideo, MinutaggioVideo + SecondiPrecaricamentoAlPlayPrimaDiRegistrare, EliminaImgAttesa); // Precarica le eventuali clip da riprodurre nell'attesa del conto alla rovescia
    tmrContoAllaRovescia = window.setInterval(ContoAllaRovescia, 1000);
}

function AvviaVideoGuidaPreroll() {
    VideoGuidaRimuoviEventoAlTermineCaricamento(AvviaVideoGuidaPreroll);
    EliminaImgAttesa();
    VideoGuidaRimuoviEventoAlPlay(AvviaContoAllaRovesciaAlPlay); VideoGuidaImpostaEventoAlPlay(AvviaContoAllaRovesciaAlPlay);
    setTimeout(PlayVideoGuida, 800);
}

function AvviaContoAllaRovesciaAlPlay() {
    VideoGuidaRimuoviEventoAlPlay(AvviaContoAllaRovesciaAlPlay);
    ContoAllaRovescia();
    tmrContoAllaRovescia = window.setInterval(ContoAllaRovescia, 1000);
}

function ContoAllaRovescia() {
    if (pulAnnullaRegistrazione.disabled) {
        ContoAllaRovescia.Conteggio = Math.abs(inputCountdownRegistrazione.value) + 1;
        pulAnnullaRegistrazione.disabled = false;
    }

    ContoAllaRovescia.Conteggio--;
    TestoPulRegistra.innerHTML = ContoAllaRovescia.Conteggio;
    if (ContoAllaRovescia.Conteggio == 0) {
        ResettaContoAllaRovescia();

        if (opzFunzionalitaPreRegistrazione.value == "preroll") {
            if (!checkAscoltaClipDuranteRegistrazione.checked) { StoppaTutteLeRegistrazioni(true); DisattivaClipNonCI(true); }
            VideoGuidaRimuoviFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
            VideoGuidaFunzioneAlTimeUpdate(AttivaRegistrazione_TimeUpdate);
        } else {
            FunzioneNormaleAlTimeUpdate = AttivaRegistrazione_TimeUpdate;
            PlayVideoGuida();
        }
    }
}
ContoAllaRovescia.Conteggio = 0

function ResettaContoAllaRovescia() {
    clearInterval(tmrContoAllaRovescia);
    TestoPulRegistra.innerHTML = ""; TestoPulRegistra.style.display = "none"; imgRegistra.style.display = "inline";
}

function RegistrazioneParti() {
    if (QualitaAltaRegistrazione) {
        registrazione.port.postMessage({ numCanale: 0, modalita: "Registrazione" });
    } else {
        regMediaRecorder.start();
    }

    pulRegistra.style.animation = ((ModalitaLightAttiva || SistemaAttualeAndroid) ? "" : "blink-registrazione 1200ms ease 1s infinite");
    tmrPulsanteStopRegistrazione = setTimeout(() => { pulStopRegistrazione.disabled = false; window.addEventListener('keydown', ScorciatoieDiTastiera_Registrazione); }, 3000);
}

function AnnullaRegistrazione() {
    regMediaRecorder.onstop = "";
    FermaRegistrazione(); RiabilitaSchermata(true); StoRegistrando = false;
    EliminaAnteprimaOndaSonora();
    if (VideoGuidaMinutaggioCorrente() != MinutaggioPartenzaRegistrazione) { window.setTimeout(() => { Posizionati(MinutaggioPartenzaRegistrazione); }, 500); }
    setTimeout(AttivaIngressi, 300);
    Messaggio(strRegistrazioneAnnullata);
}

function FermaRegistrazione() {
    /* Ferma la registrazione (se era partita) */
    if ((regMediaRecorder.stop) && (regMediaRecorder.state != 'inactive')) { regMediaRecorder.stop(); }

    /* Ripristina l'interfaccia di default */
    ResettaContoAllaRovescia();
    clearTimeout(tmrPulsanteStopRegistrazione);
    pulPlay.style.opacity = ""; pulStopRegistrazione.disabled = true; pulAnnullaRegistrazione.disabled = true;
    pulRegistra.style.animation = "";
    instantMeter.style.display = "inline";

    /* Ferma il video, ripristina le eventuali clip disattivate e rimette la funzione al time update di default */
    StopVideoGuida(); DisattivaClipNonCI(false);
    VideoGuidaRimuoviFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
    FunzioneNormaleAlTimeUpdate = AggiornaTimeline;

    /* Ripristina i controlli per l'utente */
    window.removeEventListener('keydown', ScorciatoieDiTastiera_Registrazione);
    window.addEventListener('keydown', ScorciatoieTastiera);
    PlayPausaCliccandoSulVideo(true);
}

function EliminaAnteprimaOndaSonora() {
    EliminaElemento(CanvasOnda);
}

/*** Salvataggio registrazione ***/
function stopRecording() {
    ffmpeg_TotaleProcessi = 2; ffmpeg_FunzioneAlTermineProcessi = SalvaNuovaRegistrazione;
    if (QualitaAltaRegistrazione) {
        ffmpeg_Processi = ["-i clip1 output." + formatoQualitaAlta, "-i clip1 -lavfi \"showwavespic=s=3000x200:colors=blue\" onda.gif"];
        registrazione.port.onmessage = ProcessaAudio_AcquisisciRegistrazione;
        registrazione.port.postMessage({ numCanale: 0, modalita: "AcquisisciRegistrazione" });
    } else {
        ffmpeg_Processi = ["-i clip1 output." + formatoQualitaMedia, "-i clip1 -lavfi \"showwavespic=s=3000x200:colors=blue\" onda.gif"];
        regMediaRecorder.onstop = () => { MandaACreaRegistrazione(CreaRegistrazione_mediaRecorder); };
    }

    FermaRegistrazione();

    var ELT;
    const NumeroTraccia = Number(DatiDoppiatori[ID_Utente].numeroTraccia), id_ELTprovvisorio = 'ELTprovvisorio';
    DisabilitaSchermata(true);
    StoRegistrando = false;

    DurataUltimaRegistrazione = VideoGuidaMinutaggioCorrente() - MinutaggioUltimaRegistrazione;

    if (document.getElementById(id_ELTprovvisorio) == null) {
        ELT = CreaElemento('div', id_ELTprovvisorio, "Traccia" + NumeroTraccia, strInElaborazione);
        ELT.iStyle({ position: 'absolute', top: "0%", height: "100%", border: "1px dashed grey", display: 'inline', verticalAlign: 'middle', color: 'grey' });
        InserimentoInProporzioneNellaLineaTemporale(ELT, MinutaggioUltimaRegistrazione, DurataUltimaRegistrazione);
    }
}

function MandaACreaRegistrazione(Funzione) {
    window.setTimeout(Funzione, 300); // La latenza è importante per permettere al pc di elaborare quanto registrato
}

function CreaRegistrazione_mediaRecorder() {
    var fileAudio = new Blob(recordedBlobs, { 'type': regMediaRecorder.mimeType });

    var URLBuffer = URL.createObjectURL(fileAudio);

    console.log("MediaRecorder", URLBuffer, regMediaRecorder.mimeType);

    CaricaAudio(0, { Registrazione: URLBuffer }, 'arraybuffer',
        function (Contenuto) {
            /* Per una resa più fedele, l'audio viene decodificato in audiobuffer e trasformato in un arraybuffer formato audio wav prima di essere convertito nel formato desiderato */
            audioContext.decodeAudioData(Contenuto).then((buffer) => {
                var ConversioneWav = audiobufferToWav(buffer);

                if (ffmpeg_TotaleProcessi > 0) {
                    initWorker();
                    sampleAudioData = new Uint8Array(ConversioneWav);
                    runCommand(ffmpeg_Processi[0]);
                    if (ffmpeg_TotaleProcessi == 2) { setTimeout(() => { runCommand(ffmpeg_Processi[1]); }, 1000); }
                    Messaggio(strCaricamentoInCorso); ComparsaBarraCaricamento();
                    BC.style.transition = "all 10s"; VisualizzaProgressoBarraCaricamento(BC, 0.5);
                } else {
                    ffmpeg_FunzioneAlTermineProcessi(ConversioneWav);
                }
            });
        }
    );

    recordedBlobs = [];
}

/*** Codifica un audiobuffer in un arraybuffer formato audio wav ***
 * codice di mattdesl https://github.com/Jam3/audiobuffer-to-wav/blob/master/index.js */
function audiobufferToWav(buffer, opt) {
    function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
        var bytesPerSample = bitDepth / 8
        var blockAlign = numChannels * bytesPerSample

        var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
        var view = new DataView(buffer)

        /* RIFF identifier */
        writeString(view, 0, 'RIFF')
        /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * bytesPerSample, true)
        /* RIFF type */
        writeString(view, 8, 'WAVE')
        /* format chunk identifier */
        writeString(view, 12, 'fmt ')
        /* format chunk length */
        view.setUint32(16, 16, true)
        /* sample format (raw) */
        view.setUint16(20, format, true)
        /* channel count */
        view.setUint16(22, numChannels, true)
        /* sample rate */
        view.setUint32(24, sampleRate, true)
        /* byte rate (sample rate * block align) */
        view.setUint32(28, sampleRate * blockAlign, true)
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, blockAlign, true)
        /* bits per sample */
        view.setUint16(34, bitDepth, true)
        /* data chunk identifier */
        writeString(view, 36, 'data')
        /* data chunk length */
        view.setUint32(40, samples.length * bytesPerSample, true)
        if (format === 1) { // Raw PCM
            floatTo16BitPCM(view, 44, samples)
        } else {
            writeFloat32(view, 44, samples)
        }

        return buffer
    }

    function writeFloat32(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 4) {
            output.setFloat32(offset, input[i], true)
        }
    }

    function floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]))
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
    }

    function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i))
        }
    }


    opt = opt || {};
    const numChannels = 1, sampleRate = buffer.sampleRate, format = (opt.float32 ? 3 : 1), bitDepth = (format === 3 ? 32 : 16);

    return encodeWAV(buffer.getChannelData(0), format, sampleRate, numChannels, bitDepth);
}


function CreaRegistrazione_wav() {
    const sampleRate = audioContext.sampleRate;

    /*** Creazione audio wav ***
     * codice di meziantou https://gist.github.com/meziantou/edb7217fddfbb70e899e */
    function flattenArray(channelBuffer, recordingLength) {
        var result = new Float32Array(recordingLength);
        var offset = 0;
        for (var i = 0; i < channelBuffer.length; i++) {
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    function writeUTFBytes(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    var leftBuffer = flattenArray(canaleAudio, LunghezzaNuovaRegistrazione);
    var buffer = new ArrayBuffer(44 + leftBuffer.length * 2);
    var view = new DataView(buffer);

    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + leftBuffer.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, leftBuffer.length * 2, true);

    var index = 44;
    var volume = 1;
    for (var i = 0; i < leftBuffer.length; i++) {
        view.setInt16(index, leftBuffer[i] * (0x7FFF * volume), true);
        index += 2;
    }

    var fileAudio = new Blob([view], { type: 'audio/wav' });
    /*************************************************/

    if (ffmpeg_TotaleProcessi > 0) {
        var URLBuffer = URL.createObjectURL(fileAudio);
        console.log(URLBuffer);
        CaricaAudio(0, { Registrazione: URLBuffer }, 'arraybuffer',
            function (Contenuto) {
                sampleAudioData = new Uint8Array(Contenuto);
                runCommand(ffmpeg_Processi[0]);
                if (ffmpeg_TotaleProcessi == 2) { setTimeout(() => { runCommand(ffmpeg_Processi[1]); }, 1000); }
                Messaggio(strCaricamentoInCorso); ComparsaBarraCaricamento();
                BC.style.transition = "all 10s"; VisualizzaProgressoBarraCaricamento(BC, 0.5);
            }
        );

        initWorker();
    } else {
        ffmpeg_FunzioneAlTermineProcessi(fileAudio);
    }
}

function SalvaNuovaRegistrazione(Contenuto, OndaSonora) {
    const ContenutoRegistrazione = Contenuto.slice(), OndaSonoraRegistrazione = OndaSonora.slice(), MinutaggioAttualeRegistrazione = MinutaggioUltimaRegistrazione, FormatoFile = (QualitaAltaRegistrazione ? formatoQualitaAlta : formatoQualitaMedia), InfoAggiuntiveRegistrazione = `${SistemaOperativoAttuale} ${NomeBrowserAttuale} ${VersioneBrowserAttuale} - ${audioContext.sampleRate} Hz - qualità ${(QualitaAltaRegistrazione ? "alta" : "media")}, modalità ${(ModalitaLightAttiva ? (ModalitaUltraLightAttiva ? "ultra light" : "light") : "normale")} ${VersioneJS}`;
    RiattivaInterfacciaDopoRegistrazione();
    clearInterval(tmrAggiornaClip); EliminaAnteprimaOndaSonora();

    AJAX("SalvaNuovaRegistrazione.php", CreaParametri({ "NumProgetto": N, "NumProvino": P, "Utente": ID_Utente, "Registrazione": ContenutoRegistrazione, "MinutaggioRegistrazione": MinutaggioAttualeRegistrazione, "OndaSonora": OndaSonoraRegistrazione, "Formato": FormatoFile, "InfoAggiuntive": InfoAggiuntiveRegistrazione }),
        function (Dati) {
            EliminaElemento(document.getElementById('ELTprovvisorio')); setTimeout(AggiornaClip, 100); AttivaAggiornamentoClip();
        }, strSalvataggioInCorso, strSalvataggioCompletato, true, true
    );
}

function RiattivaInterfacciaDopoRegistrazione() {
    if (worker) { worker.terminate(); isWorkerLoaded = false; worker = false; }
    setTimeout(AttivaIngressi, 500); setTimeout(RiabilitaSchermata, 1000);
}
/*********************/

function PlayPausa() {
    setTimeout(() => {
        if (pulPlay.disabled == false) {
            if (RiproduzioneInCorso == false) { PlayVideoGuida(); } else { StopVideoGuida(); }
        }
    }, 100);
}

function StoppaClipAudio(datiAudio) {
    if (datiAudio.avviato) {
        if (datiAudio.audio && datiAudio.audio.stop) { datiAudio.audio.stop(); }
        datiAudio.avviato = false;
        clearTimeout(datiAudio.tmrEventoAlPlay);
        Guadagno = DisconnettiEffettiAudio(datiAudio.numero);
        CreaDatiGuadagnoPrincipale(datiAudio.numero, Guadagno);
    }
    delete datiAudio.audio;
}

function PlayVideoGuida() {
    if (VideoGuidaMinutaggioCorrente() >= totDurataVideoGuida) { RiproduzioneInCorso = true; Posizionati(InizioVideoGuida); return; }

    setTimeout(() => {
        if (RiproduzioneInCorso == false) {
            LatenzaAudio = (+audioContext.baseLatency * 2);
            currentTimeIniziale = audioContext.currentTime; orarioIniziale = new Date().getTime();
            clearInterval(tmrAggiornaClip);
            VideoGuidaRimuoviFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
            VideoGuidaFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
            ImpostaStatoPlay(true);
            if (StoRegistrando == false) {
                if (VerificaClipPrecaricate(SecondiPrecaricamentoAlPlay) == false) { return; }
                ElaboraClipDaRiprodurre();
                setTimeout(() => {
                    if (ModalitaStreaming) {
                        setTimeout(() => { ImpostaVolumeVideoGuida(0); ComandiPlayer.style.opacity = 0; }, 2000);
                        FunzioneVisualizzazioneTitoli = VisualizzaTitoliInSync;
                    }
                    intervalloControllaClipPrecaricate = setInterval(() => { ScaricaMemoria(); VerificaClipPrecaricate(SecondiPrecaricamentoAlPlay, false); }, SecondiPrecaricamentoAlPlay * 1000);
                    RiabilitaSchermata();
                    VideoGuidaPlay();
                    VideoGuidaImpostaEventoBuffering(SospendiRiproduzione, RiprendiRiproduzione);
                }, 100);

            } else {
                if (VerificaClipPrecaricate(SecondiPrecaricamentoAlPlayPrimaDiRegistrare) == false) { return; }
                ElaboraClipDaRiprodurre();

                DisabilitaSchermata();
                VideoGuidaPlay();
            }
        }
    }, 100);
}

function StopVideoGuida() {
    if (RiproduzioneInCorso) {
        ImpostaStatoPlay(false);
        StoppaTutteLeRegistrazioni();
        VideoGuidaPause();
        AttivaAggiornamentoClip();
        VideoGuidaRimuoviEventoBuffering(SospendiRiproduzione, RiprendiRiproduzione);
        clearInterval(intervalloControllaClipPrecaricate);
        clearInterval(PrecaricaClip.tmr);
    }
}

function ImpostaStatoPlay(StatoPlay) {
    RiproduzioneInCorso = StatoPlay;
    imgPlayPausa.src = (StatoPlay ? "images/pause-blue.png" : "images/play-blue.png");
}

function SospendiRiproduzione() {
    StoppaTutteLeRegistrazioni();
}

function RiprendiRiproduzione() {
    ElaboraClipDaRiprodurre();
    if (ModalitaStreaming) { FunzioneVisualizzazioneTitoli = VisualizzaTitoliInSync; }
}

function StoppaTutteLeRegistrazioni(EsclusaCI = false) {
    if (EsclusaCI) {
        DatiAudioRegistrato.forEach((datiAudio) => { if (datiAudio.ID_Utente != 'CI') { StoppaClipAudio(datiAudio); } });
    } else {
        DatiAudioRegistrato.forEach(StoppaClipAudio);
        ClipDaRiprodurre = [];
        if (ModalitaStreaming) { InterrompiTitoli(); }
    }
}

/*** Verifica se ci sono clip da precaricare nei prossimi secondi ***
 * se ci sono attende il precaricamento di esse prima di avviare il video e dopo fa partire il precaricamento leggero delle successive
 * se non ce ne sono fa soltanto partire il precaricamento leggero delle successive */
function VerificaClipPrecaricate(SecondiMinimiClipPrecaricate, PrecaricamentoLeggero = true) {
    const totAudio = DatiAudioRegistrato.length, MinutaggioVideo = VideoGuidaMinutaggioCorrente(), MinutaggioClipPrecaricate = MinutaggioVideo + SecondiMinimiClipPrecaricate;

    for (var I = 0; I < totAudio; I++) {
        if (ClipDaPrecaricare(I, MinutaggioVideo, MinutaggioClipPrecaricate)) {
            DisabilitaSchermata(true); StopVideoGuida(); PrecaricaClip(MinutaggioVideo, MinutaggioClipPrecaricate, PlayVideoGuida);
            return false;
        }
    }

    if (PrecaricamentoLeggero) { setTimeout(() => { PrecaricaClip(MinutaggioClipPrecaricate); }, 100); }

    return true;
}

function DisattivaClipNonCI(Disattiva) {
    DatiAudioRegistrato.forEach((datiAudio) => {
        if (datiAudio.ID_Utente != 'CI') { datiAudio.disattivato = Disattiva; }
    })
}

function ElaboraClipDaRiprodurre() {
    const totAudio = DatiAudioRegistrato.length, MinutaggioVideo = VideoGuidaMinutaggioCorrente() + LatenzaAudio;
    ClipDaRiprodurre = [];

    for (var I = 0; I < totAudio; I++) {
        VerificaClipDaRiprodurre(I, MinutaggioVideo);
    }

    FunzioneRiproduzioneClip = RiproduciClipInSync;
}

function VerificaClipDaRiprodurre(I, MinutaggioVideo) {
    const datiAudio = DatiAudioRegistrato[I];
    ((datiAudio.buffer) && (!datiAudio.disattivato) && (!datiAudio.Rimosso) && (!datiAudio.Escluso) && (!TracceEscluse.includes(datiAudio.ID_Utente)) && (MinutaggioVideo < ((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioFinale))) && (ClipDaRiprodurre.push(I) && CreaClipAudio(I)));
}

function StoppaEventualeRegistrazione() {
    if (pulStopRegistrazione.disabled === false) { stopRecording(); } else { StopVideoGuida(); }
}

function SpostaMinutaggioRegistrazione(Numero, NuovaPartenzaRegistrazione) {
    const datiAudio = DatiAudioRegistrato[Numero];
    const IDELT_Opzioni = "OpzioniClip", IDELT = 'ELTReg' + Numero;
    const M = document.getElementById(IDELT_Opzioni + 'MinutaggioMinuti');
    const S = document.getElementById(IDELT_Opzioni + 'MinutaggioSecondi');
    const DurataVideoGuida = totDurataVideoGuida, PartenzaAudio = Number(datiAudio.taglioIniziale);

    if (!NuovaPartenzaRegistrazione) { // Se NuovaPartenzaRegistrazione è passata come argomento vuol dire che il valore non è stato direttamente selezionato dall'utente, ma è stato inviato da una chiamata automatica (v. ad es.: AggiornaClip) 
        NuovaPartenzaRegistrazione = Number(S.value) + Number(M.value) * 60;
    }

    NuovaPartenzaRegistrazione = NuovaPartenzaRegistrazione + ((-NuovaPartenzaRegistrazione - PartenzaAudio) * ((NuovaPartenzaRegistrazione + Number(PartenzaAudio)) < 0)) + ((-NuovaPartenzaRegistrazione + DurataVideoGuida - datiAudio.Durata) * (NuovaPartenzaRegistrazione > (DurataVideoGuida - 2)));

    if (M) {
        const Minutaggio = new MinutiESecondi(NuovaPartenzaRegistrazione);
        M.value = Minutaggio.Minuti; S.value = Minutaggio.Secondi;
    }

    datiAudio.MinutaggioRegistrazione = Number(NuovaPartenzaRegistrazione);
    InserimentoInProporzioneNellaLineaTemporale(document.getElementById(IDELT), NuovaPartenzaRegistrazione, datiAudio.Durata);
}

/*** Gestione del guadagno della clip ***/
function evslide_CambiaVolumeClip(e) {
    const Volume = Number(e.currentTarget.value), Numero = e.currentTarget.dataset.RiferimentoRegistrazione;
    document.getElementById('OpzioniClipTabellaOpzioniRigaVolumeCasella').value = parseInt(Volume * 100);

    CambiaVolumeClip(Numero, Volume);
}

function evcasella_CambiaVolumeClip(e) {
    const Volume = Math.abs(e.currentTarget.value / 100), Numero = e.currentTarget.dataset.RiferimentoRegistrazione;
    document.getElementById('OpzioniClipTabellaOpzioniRigaVolumeSlide').value = Volume;

    CambiaVolumeClip(Numero, Volume);
}

function CambiaVolumeClip(Numero, Volume) {
    /* Aggiorna il controller del guadagno */
    GuadagnoPrincipale[Numero].gain.value = Number(Volume);

    /* Visualizza graficamente l'onda sonora in base al guadagno */
    if (!ModalitaStreaming) { VisualizzaAmpiezzaOndaSonora(Numero); }
}

function VisualizzaAmpiezzaOndaSonora(Numero) {
    const percVolume = parseInt(GuadagnoPrincipale[Numero].gain.value * 100), OndaSonoraVisualizzata = document.getElementById("ELTReg" + Numero + "OndaSonora");
    if (OndaSonoraVisualizzata) { OndaSonoraVisualizzata.iStyle({ height: percVolume + "%", top: parseInt((100 - percVolume) / 2) + "%" }); }
}
/***************************************/

/*** Gestione dei tagli (iniziali e finali) della clip ***/
const taglioclip_diffmin = 0.1;
function ev_CambiaTaglioInizialeClip(e) {
    var TaglioIniziale = Math.abs(e.currentTarget.value);
    const Numero = e.currentTarget.dataset.RiferimentoRegistrazione, IDELT_Opzioni = "OpzioniClipTabellaOpzioniRigaTaglio", datiAudio = DatiAudioRegistrato[Numero], sogliamassima = (datiAudio.taglioFinale - taglioclip_diffmin), condizione = (TaglioIniziale < sogliamassima);

    TaglioIniziale = (TaglioIniziale * condizione) + (sogliamassima * !condizione);

    const slideTaglioIniziale = document.getElementById(IDELT_Opzioni + 'InizialeSlide'), casellaTaglioIniziale = document.getElementById(IDELT_Opzioni + 'InizialeCasella');
    const slideTaglioFinale = document.getElementById(IDELT_Opzioni + 'FinaleSlide'), casellaTaglioFinale = document.getElementById(IDELT_Opzioni + 'FinaleCasella');
    slideTaglioIniziale.value = TaglioIniziale; casellaTaglioIniziale.value = TaglioIniziale;
    slideTaglioFinale.min = (+TaglioIniziale) + (+taglioclip_diffmin); casellaTaglioFinale.min = slideTaglioFinale.min;

    CambiaTaglioInizialeClip(Numero, TaglioIniziale);
}

function CambiaTaglioInizialeClip(Numero, TaglioIniziale) {
    DatiAudioRegistrato[Numero].taglioIniziale = Number(TaglioIniziale);
    VisualizzazioneGraficaTaglioClip(Numero);
}

function ev_CambiaTaglioFinaleClip(e) {
    var TaglioFinale = e.currentTarget.value;
    const Numero = e.currentTarget.dataset.RiferimentoRegistrazione, IDELT_Opzioni = "OpzioniClipTabellaOpzioniRigaTaglio", datiAudio = DatiAudioRegistrato[Numero], sogliaminima = (+datiAudio.taglioIniziale) + (+taglioclip_diffmin), condizioneSogliaMinima = (TaglioFinale > sogliaminima), sogliamassima = Number(datiAudio.Durata), condizioneSogliaMassima = (TaglioFinale < sogliamassima);

    TaglioFinale = (TaglioFinale * condizioneSogliaMinima * condizioneSogliaMassima) + (sogliaminima * !condizioneSogliaMinima) + (sogliamassima * !condizioneSogliaMassima);

    const slideTaglioIniziale = document.getElementById(IDELT_Opzioni + 'InizialeSlide'), casellaTaglioIniziale = document.getElementById(IDELT_Opzioni + 'InizialeCasella');
    const slideTaglioFinale = document.getElementById(IDELT_Opzioni + 'FinaleSlide'), casellaTaglioFinale = document.getElementById(IDELT_Opzioni + 'FinaleCasella');
    slideTaglioFinale.value = TaglioFinale; casellaTaglioFinale.value = TaglioFinale;
    slideTaglioIniziale.max = TaglioFinale - taglioclip_diffmin; casellaTaglioIniziale.max = slideTaglioIniziale.max;

    CambiaTaglioFinaleClip(Numero, TaglioFinale);
}

function CambiaTaglioFinaleClip(Numero, TaglioFinale) {
    DatiAudioRegistrato[Numero].taglioFinale = Number(TaglioFinale);
    VisualizzazioneGraficaTaglioClip(Numero);
}

function VisualizzazioneGraficaTaglioClip(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero], StratoColore = document.getElementById('ELTReg' + datiAudio.numero + 'StratoColore'), LunghezzaRegistrazione = datiAudio.Durata;

    if (StratoColore) {
        StratoColore.style.left = Number(datiAudio.taglioIniziale / LunghezzaRegistrazione * 100) + "%";
        StratoColore.style.right = Number((LunghezzaRegistrazione - datiAudio.taglioFinale) / LunghezzaRegistrazione * 100) + "%";
    }
}
/*********************************************************/

function AttivaDisattivaEffetto(e) {
    const pulEffetto = e.currentTarget, Effetto = pulEffetto.dataset.effetto, Numero = pulEffetto.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero];
    const pulsantiEffetti = document.getElementsByName('pulEffetto'), totPulsantiEffetti = pulsantiEffetti.length, classe_default = "btn btn-default";

    for (var I = 0; (I < totPulsantiEffetti) && (pulsantiEffetti[I].className = classe_default); I++);

    if (datiAudio.effetti != Effetto) {
        datiAudio.effetti = Effetto; pulEffetto.className = "btn btn-warning";
    } else {
        datiAudio.effetti = "";
    }

    if (datiAudio.audio) { AttivaEffettiAudio(Numero); } else { VisualizzaEffettiAudio(Numero); }
}

function DuplicaClip(Numero) {
    AJAX("DuplicaClip.php", "N=" + DatiAudioRegistrato[Numero].NumeroUnivoco,
        function (Dati) {
            AggiornaClip(() => {
                const ClipNuova = TrovaClip(Dati.N);
                /** Assegna alla nuova clip lo stesso buffer della clip duplicata e la riproduce se siamo in riproduzione **/
                ClipNuova.buffer = DatiAudioRegistrato[Numero].buffer;
                OperazioniAlBufferCaricato(ClipNuova.numero);
                if (RiproduzioneInCorso) { FunzioneRiproduzioneClip = RiproduciClipInSync; }
            });
        }, strDuplicazioneClip, strClipDuplicata, true
    );
}

function MinutaggioCliccatoNellaClip(X) {
    return (+X + window.scrollX - ContenitoreRighello.offsetLeft - ELTCliccato.offsetLeft) / ELTCliccato.clientWidth * DatiAudioRegistrato[ELTCliccato.dataset.RiferimentoRegistrazione].Durata;
}


function DividiClip_puntatorerilasciato(e) {
    const ELT = ELTCliccato, MinutaggioPrimoClick = MinutaggioCliccatoNellaClip(+ELT.dataset.posizionePuntatoreInizioTaglio), MinutaggioRilascio = MinutaggioCliccatoNellaClip(e.clientX), TrascinatoVersoDestra = MinutaggioPrimoClick < MinutaggioRilascio;
    const secondiInizioTaglio = (TrascinatoVersoDestra? MinutaggioPrimoClick : MinutaggioRilascio), secondiFineTaglio = (TrascinatoVersoDestra? MinutaggioRilascio : MinutaggioPrimoClick);
    document.body.removeEventListener('mouseup', DividiClip_puntatorerilasciato); ELT.removeEventListener('mousemove', AnteprimaSelezioneClip.Visualizza);
    CambiaTool(toolStandard);
    DisabilitaSchermata();

    /*** Finestrella per conferma operazione effettuata ***/
    function VisualizzaAttenderePrego(PulsanteSelezionato) {
        PannelloOpzioni.abilita(false);
        PulsanteSelezionato.className = 'btn btn-primary';
        tdProcedi.innerText = strAttenderePrego;
    }

    const PannelloOpzioni = CreaElemento('div', 'OpzioniDividiClip', document.body.id);
          PannelloOpzioni.className = "panel panel-info"; PannelloOpzioni.iStyle({position: "fixed", top: "100px", left: "10%", zIndex: 100000000});

        /* Barra del titolo */
        const divTitolo = CreaElemento('div', PannelloOpzioni.id + 'Titolo', PannelloOpzioni.id, strCosaVuoiFare); divTitolo.className = "panel-heading text-center";
                    const a = CreaElemento('a', divTitolo.id + 'Annulla', divTitolo.id); a.className = "btn btn-danger fa fa-times"; a.iStyle({position: "absolute", top: "5px", left: "10px"}); a.onclick = TerminaDividiClip;

        /* Opzioni */
        const divContenuto = CreaElemento('div', PannelloOpzioni.id + 'Contenuto', PannelloOpzioni.id); divContenuto.className = "panel-body text-center";
                const pulTagliaViaSelezionato = CreaElemento('a', 'DividiClip_pulTagliaViaSelezionato', divContenuto.id, strTagliaViaSelezionato); pulTagliaViaSelezionato.className = 'btn btn-default';
                      pulTagliaViaSelezionato.onclick = (e) => {VisualizzaAttenderePrego(e.currentTarget); DividiClip(ELT.dataset.RiferimentoRegistrazione, secondiInizioTaglio, secondiFineTaglio);};

                const pulTagliaViaIlResto = CreaElemento('a', 'DividiClip_pulTagliaViaIlResto', divContenuto.id, strTagliaViaIlResto); pulTagliaViaIlResto.className = 'btn btn-default';
                      pulTagliaViaIlResto.onclick = (e) => {
                        const datiAudio = DatiAudioRegistrato[ELT.dataset.RiferimentoRegistrazione];
                        datiAudio.taglioIniziale = secondiInizioTaglio; datiAudio.taglioFinale = secondiFineTaglio;
                        SalvaModificheClipAudio(datiAudio.numero, () => {AggiornaClip(TerminaDividiClip);});
                        VisualizzaAttenderePrego(e.currentTarget);
                      };

        /* Annulla */
        const divPulsantiFinali = CreaElemento('div', PannelloOpzioni.id + 'PulsantiFinali', PannelloOpzioni.id); divPulsantiFinali.className = 'panel-footer';
            const Tabella = CreaElemento('table', PannelloOpzioni.id  + 'TabellaPulsantiFinali', divPulsantiFinali.id); Tabella.className = "TabellaOpzioni"; Tabella.style.width = "100%";
                const tr = CreaElemento('tr', PannelloOpzioni.id  + 'RigaTabellaPulsantiFinali', Tabella.id);
                    const td = CreaElemento('td', PannelloOpzioni.id  + 'CasellaAnnulla', tr.id);
                        const pulAnnulla = CreaElemento('a', PannelloOpzioni.id + 'Annulla', td.id, "<span class='fa fa-times'></span> " + strAnnullalemodifiche); pulAnnulla.className = "btn btn-default";
                              pulAnnulla.onclick = TerminaDividiClip;

                    const tdProcedi = CreaElemento('td', PannelloOpzioni.id + 'CasellaProcedi', tr.id); tdProcedi.className = 'alert alert-info';
}

function DividiClip(Numero, secondiInizioTaglio, secondiFineTaglio) {
    AJAX("DividiClip-prova.php", "N=" + DatiAudioRegistrato[Numero].NumeroUnivoco + "&InizioTaglio=" + encodeURIComponent(secondiInizioTaglio) + "&FineTaglio=" + encodeURIComponent(secondiFineTaglio),
        function (Dati) {
            AggiornaClip(() => {
                if (!Dati.SoloTaglioInizialeFinale) {
                    const ClipNuova = TrovaClip(Dati.N);
                    /** Assegna alla nuova clip lo stesso buffer della clip divisa, se siamo in riproduzione aggiorna la riproduzione della clip originale e riproduce la nuova **/
                    ClipNuova.buffer = DatiAudioRegistrato[Numero].buffer;
                    OperazioniAlBufferCaricato(ClipNuova.numero);
                    PosizioneOriginaleClipSovrapposte();
                }

                AggiornaRiproduzioneClip(Numero);

                TerminaDividiClip();
            });
        }, strDivisioneClip, strClipDivisa, true
    );
}

function TerminaDividiClip() {
    AnteprimaSelezioneClip.Elimina();
    EliminaElemento(document.getElementById('OpzioniDividiClip'));
    RiabilitaSchermata();
}

function TrovaClip(NumeroUnivoco) {
    const totClipAudio = DatiAudioRegistrato.length;
    for (var I = 0; (I < totClipAudio) && (DatiAudioRegistrato[I].NumeroUnivoco != NumeroUnivoco); I++);
    return DatiAudioRegistrato[I] || false;
}

function Download(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero], IDUtente = datiAudio.ID_Utente, M = new MinutiESecondi(datiAudio.MinutaggioRegistrazione), NomeFile = `${NomeProgetto} ${NomeDoppiaggio} ${DatiDoppiatori[IDUtente].nome} Battuta a ${M.Minuti.duecifre()} min ${M.Secondi.toFixed(3)} sec${datiAudio.Registrazione.slice(datiAudio.Registrazione.lastIndexOf("."))}`.replace(/[^a-zA-Z0-9\.]/g, "_");
    CaricaAudio(Numero, { Registrazione: datiAudio.Registrazione }, 'blob', function (ContenutoFile) {
        const link = URL.createObjectURL(ContenutoFile);
        Messaggio(strCreazioneCompletata + " <a class='btn btn-default' href='" + link + "' download='" + NomeFile + "'>" + strScaricaQuiAudio + "</a>", "OK");
    });
}

function DownloadTraccia(NumeroTraccia) {
    const ID_UtenteTraccia = document.getElementById('DownloadTraccia' + NumeroTraccia).dataset.utente;
    const Parametri = "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&IDUtente=" + encodeURIComponent(ID_UtenteTraccia);

    AJAX("DownloadTraccia.php", Parametri,
        function (Dati) {
            const NomeFileZip = NomeProgetto + " - " + NomeDoppiaggio + " - " + strBattute + " " + DatiDoppiatori[ID_UtenteTraccia].nome + ".zip";
            NomeFileZip.replace(/[^a-zA-Z0-9\. ]/g, "_");

            Messaggio(strCreazioneZipCompletata + " <a class='btn btn-default' href=\"" + Dati.NomeArchivioZip + "\" download=\"" + NomeFileZip + "\">" + strScaricaQuiZip + "</a>", "OK");
        }, strCreazioneZipInCorso, "", true
    );
}

function EscludiRipristinaTraccia(IDUtente) {
    const pulEscludiRipristinaTraccia = document.getElementById('EscludiRipristinaTraccia' + IDUtente);

    if (TracceEscluse.includes(IDUtente)) {
        /* Riattiva la traccia */
        TracceEscluse.splice(TracceEscluse.indexOf(IDUtente), 1);
        if (pulEscludiRipristinaTraccia) { pulEscludiRipristinaTraccia.className = "btn btn-default btn-xs fa fa-volume-up"; }
        if (RiproduzioneInCorso) {
            const totClipAudio = DatiAudioRegistrato.length, MinutaggioVideo = VideoGuidaMinutaggioCorrente();
            for (let I = 0; I < totClipAudio; I++) {
                if (DatiAudioRegistrato[I].ID_Utente == IDUtente) { VerificaClipDaRiprodurre(I, MinutaggioVideo); }
            }
            FunzioneRiproduzioneClip = RiproduciClipInSync;
        }

    } else {
        /* Esclude la traccia */
        TracceEscluse.push(IDUtente);
        if (pulEscludiRipristinaTraccia) { pulEscludiRipristinaTraccia.className = "btn btn-danger btn-xs fa fa-volume-off"; }

        if (RiproduzioneInCorso) {
            const totClipAudio = DatiAudioRegistrato.length;
            for (let I = 0; I < totClipAudio; I++) {
                const datiAudio = DatiAudioRegistrato[I];
                if (datiAudio.ID_Utente == IDUtente) { StoppaClipAudio(datiAudio); }
            }
        }
    }
}

function EscludiRipristinaClip(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero];

    datiAudio.Escluso = !datiAudio.Escluso;
    document.getElementById('ELTReg' + Numero + "StratoColore").style.backgroundColor = (datiAudio.Escluso ? "grey" : "");
    AggiornaRiproduzioneClip(Numero);
}

function CancellaRipristinaRegistrazione(Numero, Ripristina) {
    VisualizzaClipAudio(Numero, Ripristina);

    if (Ripristina == false) {
        CestinaClip(Numero);
        if (VisualizzaSuggerimentiCestinaClip) {
            const Cestino = document.getElementById('ApriCestinoTraccia' + DatiAudioRegistrato[Numero].ID_Utente);
            const S = [
                { testo: Sugg_CestinaClip_DoveSonoLeClip, stile: 'info', simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino.parentNode, scostamentoX: '5px', scostamentoY: '-10px' },
                { testo: Sugg_CestinaClip_VisualizzaClip, stile: 'warning', simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino, scostamentoX: '5px', scostamentoY: '-15px' },
                { testo: Sugg_CestinaClip_RimettiCestino, stile: 'default', simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino, scostamentoX: '5px', scostamentoY: '-15px' },
                { testo: Sugg_CestinaClip_GiorniEliminaz, stile: 'info', simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino.parentNode, scostamentoX: '5px', scostamentoY: '-10px' },
            ];

            VisualizzaSuggerimentiNuoviDoppiatori(S, 'CestinaClip', () => { VisualizzaSuggerimentiCestinaClip = false; });
        }
    }

    OpzioniClip(Numero, false, true);
}

function CestinaClip(Numero) {
    const ELT = document.getElementById('ELTReg' + Numero), Cestino = document.getElementById('ApriCestinoTraccia' + DatiAudioRegistrato[Numero].ID_Utente);

    if (ELT) { ELT.iStyle({ left: "-5px", width: "10px" }); setTimeout(() => { ELT.style.display = "none"; }, 2000); }

    if (Cestino) {
        Cestino.style.animation = ""; Cestino.dataset.ripristinati = "no"; clearTimeout(tmrLampeggiaCestino[Cestino.id]);
        tmrLampeggiaCestino[Cestino.id] = setTimeout(() => { Cestino.style.animation = "blink 500ms ease 0s 4"; }, 2000);
    }
}

function VisualizzaClipAudio(Numero, Attivo) {
    const id_ELT = 'ELTReg' + Numero;
    DatiAudioRegistrato[Numero].Rimosso = !Attivo;

    document.getElementById(id_ELT + "Contenuto").style.opacity = (Attivo ? 0.8 : 0.2);
    document.getElementById(id_ELT + "StratoColore").style.opacity = (Attivo ? 1 : 0.1);
}

function ApriCestinoTraccia(e) {
    const Cestino = e.currentTarget, totAudio = DatiAudioRegistrato.length;
    var datiAudio, I, AudioDaRipristinare = [];

    for (I = 0; I < totAudio; I++) {
        datiAudio = DatiAudioRegistrato[I];
        if ((datiAudio.ID_Utente == Cestino.dataset.idutente) && (!datiAudio.danneggiato)) {
            document.getElementById('ELTReg' + datiAudio.numero).style.display = "inline";
            AudioDaRipristinare.push(datiAudio);
        }
    }

    if (AudioDaRipristinare.length) {
        setTimeout(() => {
            if (Cestino.dataset.ripristinati == "si") {
                AudioDaRipristinare.forEach(CestinaClipRimosse);
                Cestino.className = "btn btn-default btn-xs fa fa-trash-o";
                setTimeout(PosizioneOriginaleClipSovrapposte, 1000);

            } else {
                AudioDaRipristinare.forEach(VisualizzaClipRimosse);
                Cestino.className = "btn btn-warning btn-xs fa fa-trash-o"; Cestino.dataset.ripristinati = "si";

            }
        }, 100);
    }
}

function CestinaClipRimosse(datiAudio) {
    if (datiAudio.Rimosso) { CestinaClip(datiAudio.numero); } // CestinaClip si occuperà anche di resettare il flag "ripristinati"
}

function VisualizzaClipRimosse(datiAudio) {
    const Numero = datiAudio.numero, ELT = document.getElementById('ELTReg' + Numero);
    VisualizzaELTNormale(datiAudio.numero);
    InserimentoInProporzioneNellaLineaTemporale(ELT, datiAudio.MinutaggioRegistrazione, datiAudio.Durata);
    setTimeout(() => { RiposizionamentoAutomaticoELT_NumClipAudio(Numero); }, 1000);
}


function SalvaModificheClipAudio(Numero, FunzioneAlTermine = () => {}) {
    const datiAudio = DatiAudioRegistrato[Numero], AutoreCommentoClip = (SonoCreatoreProgetto ? "CreatoreProgetto" : "Doppiatore");
    var Parametri = "N=" + encodeURIComponent(datiAudio.NumeroUnivoco) + "&MinutaggioRegistrazione=" + encodeURIComponent(datiAudio.MinutaggioRegistrazione) + "&Guadagno=" + encodeURIComponent(GuadagnoPrincipale[Numero].gain.value) + "&TaglioIniziale=" + encodeURIComponent(datiAudio.taglioIniziale) + "&TaglioFinale=" + encodeURIComponent(datiAudio.taglioFinale) + "&Effetti=" + encodeURIComponent(datiAudio.effetti) + "&Rimosso=" + encodeURIComponent((datiAudio.Rimosso ? "si" : "no"));
    if (datiAudio['commenti' + AutoreCommentoClip + '_prec'] != datiAudio['commenti' + AutoreCommentoClip]) { Parametri += "&Commenti" + AutoreCommentoClip + "=" + encodeURIComponent(datiAudio['commenti' + AutoreCommentoClip]); datiAudio['commenti' + AutoreCommentoClip + '_prec'] = datiAudio['commenti' + AutoreCommentoClip]; }

    AJAX("AggiornaRegistrazione.php", Parametri, FunzioneAlTermine, strAggiornamento, strSalvataggioCompletato, true);
}

function CaricamentoInizialeRegistrazioniAudio() {
    DisabilitaSchermata(true); Messaggio(strCaricamentoInCorso);
    AJAX("CaricaRegistrazione.php", "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&Streaming=" + (ModalitaStreaming ? "1" : "0") + "&SoloMieRegistrazioni=" + (ModalitaUltraLightAttiva ? "1" : "0"), CreazioneClipPrimoCaricamento, "", "", true);
}

function CreazioneClipPrimoCaricamento(Dati) {
    const totClipAudio = Dati.length, PresenteColonnaInternazionale = (LinkColonnaInternazionale != "");
    var I;

    NumeroTotaleAudioCaricamentoIniziale = totClipAudio + (+ModalitaStreaming) + ((+LinkColonnaInternazionale.split(',').length) * PresenteColonnaInternazionale);

    if (PresenteColonnaInternazionale) { CaricaColonnaInternazionale({ Spezzoni: LinkColonnaInternazionale, volume: 1 }); }

    for (I = 0; I < totClipAudio; I++) {
        CreaNuovaClipAudio(Dati[I]);
    }

    if (ModalitaStreaming) {
        const totClipAudioComplessive = DatiAudioRegistrato.length; // Comprende anche gli audio da colonna internazionale se presenti
        const FinePrecaricamento = (+InizioVideoGuida) + (+SecondiPrecaricamentoAlPlay);
        for (I = 0; I < totClipAudioComplessive; I++) {
            NumeroTotaleAudioCaricamentoIniziale += +ClipDaPrecaricare(I, InizioVideoGuida, FinePrecaricamento);
        }
        Messaggio(strCaricamentoPrimeClip);
        PrecaricaClip(InizioVideoGuida, FinePrecaricamento, () => { AggiornaCaricamentoClip(true); }, { FunzioneAlTermineSingoloPrecaricamento: () => { AggiornaCaricamentoClip(true); }, SoloBuffer: true });

    } else {
        setTimeout(() => {
            AttivaInterfaccia();
            AttivaScorciatoieDiTastiera();
            if (RuoliDaAssegnare_NumeroTraccia !== false) { // La traccia "RuoliDaAssegnare" è presente solo se si è il creatore del progetto oppure l'utente visitatore
                if (SonoCreatoreProgetto) { tmrAggiornaNotificheCandidatiRuoliDaAssegnare = setInterval(VerificaNuoveClipAltriCandidati, 180000); VerificaNuoveClipAltriCandidati(); } else { SolaVisione = true; pulRegistra.disabled = true; SelezionaCandidatoRuoliDaAssegnare(ID_Utente); }
            }
            divVetro.style.display = "none";
            if (!CaricamentoInizialeTerminato) { AttivaImmagineAttesa('TrePunti'); }
            setTimeout(CaricaMarcatori, 1500);
            setTimeout(CheckUtentiAttivi, 1000);
        }, 1000);
    }

    if (NumeroTotaleAudioCaricamentoIniziale == 0) { TermineCaricamentoClip(); }
}

function TermineCaricamentoClip() {
    if (!CaricamentoInizialeTerminato) {
        Messaggio(strCaricamentoCompletato, "OK");
        setTimeout(() => {
            if (ModalitaStreaming) {
                const pulPlayIniziale = CreaElemento('div', 'divPulsantonePlayIniziale', divVetro.id, "<span class='fa fa-play-circle'></span> Play"); pulPlayIniziale.className = "btn btn-success"; pulPlayIniziale.iStyle({ position: "relative", top: "40%", width: "100%", margin: "0px auto", fontSize: "30px", fontWeight: "bold" });
                ComandiPlayer.addEventListener('mousemove', () => { ComandiPlayer.style.opacity = ""; });
                pulPlayIniziale.onclick = () => { CancMex(); AttivaScorciatoieDiTastiera_ModalitaStreaming(); pulPlayIniziale.onclick = ""; divVetro.style.display = "none"; PlayVideoGuida(); };
                DisattivaMessaggiAttesa();
                AttivaInterfaccia();
                document.getElementById('LogoWEDUB').iStyle({ top: 0, right: 0, opacity: 0.5 });
                /*                 PrecaricaClip(SecondiPrecaricamentoAlPlay); */
            } else {
                DatiAudioRegistrato.forEach(CestinaClipRimosse);
                AttivaAggiornamentoClip();
                EliminaImgAttesa();
            }
        }, 1000);
        CaricamentoInizialeTerminato = true;
    }
    setTimeout(() => { AzzeraBarraCaricamento(BC, ContornoBC, 1); }, 1000);
}

function AttivaInterfaccia() {
    FunzioneNormaleAlTimeUpdate = (ModalitaStreaming ? AggiornaTimeline_Streaming : AggiornaTimeline);
    StartAudioContext(audioContext);
    RiabilitaSchermata();
}

function AttivaScorciatoieDiTastiera() {
    window.addEventListener('keydown', ScorciatoieTastiera);
    window.addEventListener('keyup', ScorciatoieTastiera_TastiSollevati);
    ContenitoreLineaTemporale.addEventListener('mousedown', GestisciMouseDown);
    document.body.addEventListener('mouseup', GestisciMouseUp);
    ContenitoreLineaTemporale.addEventListener('mouseleave', GestisciMouseUp);
    ContenitoreLineaTemporale.addEventListener('wheel', GestisciRotellinaMouse);
    AttivaPulsantiMultimediali();
}

function AttivaScorciatoieDiTastiera_ModalitaStreaming() {
    window.addEventListener('keydown', ScorciatoieTastiera_ModalitaStreaming);
    AttivaPulsantiMultimediali();
}

function AttivaPulsantiMultimediali() {
    navigator.mediaSession.setActionHandler('play', PlayPausa); navigator.mediaSession.setActionHandler('pause', PlayPausa);
}

function AggiornaClip(FunzioneAlTermine) {
    AJAX("CaricaRegistrazione.php", "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&SoloMieRegistrazioni=" + (ModalitaLightAttiva ? "1" : "0") + "&IDCandidatoRuoliDaAssegnare=" + encodeURIComponent(RuoliDaAssegnare_CandidatoSelezionato),
        function (Dati) {
            const totDati = Dati.length, totAudio = DatiAudioRegistrato.length;
            var I, NumAudio, datiAudio, AudioRimosso, AudioDaRipristinare = [], NuoviAudio = false;

            for (I = 0; I < totDati; I++) {
                /* Trova il numero identificativo della clip, se non la trova si tratta di una nuova clip */
                for (NumAudio = 0; (NumAudio < totAudio) && (DatiAudioRegistrato[NumAudio].NumeroUnivoco != Dati[I].N); NumAudio++);

                if (NumAudio >= totAudio) {
                    /** Nuova clip audio **/
                    CreaNuovaClipAudio(Dati[I], RiposizionamentoAutomaticoELTRiferitoAllaRegistrazione);
                    NuoviAudio = true;

                } else {
                    /** Aggiorna i valori della clip già presente **/
                    datiAudio = DatiAudioRegistrato[NumAudio];
                    if ((datiAudio.CreazioneInCorso) || (Dati[I].DurataRegistrazione == 0) || (ModalitaStreaming)) { continue; }

                    /* Posizione nella linea temporale */
                    if (datiAudio.MinutaggioRegistrazione != Dati[I].MinutaggioRegistrazione) { SpostaMinutaggioRegistrazione(NumAudio, Number(Dati[I].MinutaggioRegistrazione)); }

                    /* Guadagno */
                    CambiaVolumeClip(NumAudio, Dati[I].Guadagno);

                    /* Taglio iniziale e finale */
                    datiAudio.taglioIniziale = Dati[I].TaglioIniziale; datiAudio.taglioFinale = Dati[I].TaglioFinale; VisualizzazioneGraficaTaglioClip(NumAudio);

                    /* Effetti */
                    datiAudio.effetti = Dati[I].Effetti; VisualizzaEffettiAudio(NumAudio); // Gli effetti audio verranno applicati solo alla creazione del buffer (v. CreaClipAudio)

                    /* Commenti */
                    if ((datiAudio.ID_Utente == ID_Utente) || (SonoCreatoreProgetto)) {
                        datiAudio.commentiVisualizzatiDoppiatore = Dati[I].CommentiVisualizzatiDoppiatore; datiAudio.commentiVisualizzatiCreatoreProgetto = Dati[I].CommentiVisualizzatiCreatoreProgetto;
                        datiAudio.commentiDoppiatore = Dati[I].CommentiDoppiatore; datiAudio.commentiCreatoreProgetto = Dati[I].CommentiCreatoreProgetto;
                        datiAudio.commentiDoppiatore_prec = datiAudio.commentiDoppiatore; datiAudio.commentiCreatoreProgetto_prec = datiAudio.commentiCreatoreProgetto;

                        VisualizzaCommentiELT(NumAudio);
                    }

                    /* Mantenuto/Rimosso */
                    AudioRimosso = (Dati[I].Rimosso == "si");
                    if (datiAudio.Rimosso != AudioRimosso) {
                        datiAudio.Rimosso = AudioRimosso; VisualizzaELTNormale(NumAudio);
                        if (AudioRimosso) {
                            CestinaClip(NumAudio);
                        } else {
                            document.getElementById('ELTReg' + datiAudio.numero).style.display = "inline";
                            AudioDaRipristinare.push(datiAudio);
                        }
                    }
                }
            }

            setTimeout(() => {
                AudioDaRipristinare.forEach(VisualizzaClipRimosse);
                if (FunzioneAlTermine) { FunzioneAlTermine(); }
                if (NuoviAudio && RiproduzioneInCorso && (!FunzioneAlTerminePrecaricamento) && (!StoRegistrando)) { VerificaClipPrecaricate(SecondiPrecaricamentoAlPlay); } // Verifica se deve precaricare e quindi riprodurre le clip appena caricate
                CheckUtentiAttivi();
                CaricaMarcatori();
            }, 250);
        }, "", "", true
    );
}

function AttivaAggiornamentoClip() {
    window.clearInterval(tmrAggiornaClip);
    if (!ModalitaStreaming && !ModalitaLightAttiva) { tmrAggiornaClip = window.setInterval(AggiornaClip, 30000); }
}

function CheckUtentiAttivi() {
    var ID_Doppiatori = Object.keys(DatiDoppiatori);
    if (!ID_Doppiatori.includes(ID_CreatoreProgetto)) { ID_Doppiatori.push(ID_CreatoreProgetto); }
    AJAX("AcquisisciDataUltimaAzione.php", "ID=" + encodeURIComponent(ID_Doppiatori.join("|")),
        (Dati) => {
            const totUtenti = Dati.length;
            UtentiAttivi = [];
            for (let I = 0; I < totUtenti; I++) {
                const UtenteSiTrovaNelProgetto = (+Dati[I].UtenteNelProgetto == +N);
                if (UtenteAttivo(Dati[I].DataUltimaAzione) && UtenteSiTrovaNelProgetto) { UtentiAttivi.push(Dati[I].ID); }
                VisualizzaUtenteAttivoProgettoDoppiaggio(Dati[I].ID, Dati[I].DataUltimaAzione, UtenteSiTrovaNelProgetto);
            }
            UtentiAttiviOltreMe = UtentiAttivi.slice(); UtentiAttiviOltreMe.splice(UtentiAttiviOltreMe.indexOf(ID_Utente), 1);

            console.log("Utenti attivi:", UtentiAttivi);
            clearInterval(CheckMessaggiVocaliIstantanei.tmr);
            const totUtentiAttiviOltreMe = UtentiAttiviOltreMe.length;
            if (totUtentiAttiviOltreMe) {
                if (!SessioneOspite || (SonoCreatoreProgetto && !ProgettoCompletato)) {
                    MessaggiIstantaneiAttivi = true; ContenitorePulMessaggioVocale.style.display = "inline-block"; pulMessaggioVocale.abilita(true); CheckMessaggiVocaliIstantanei();

                    const TantiUtentiOnline = (totUtentiAttiviOltreMe > 1);
                    const SelezionePrecedente = selUtenteMessaggioVocale.value;
                    var StringaDidascaliaMessaggioVocale = "", StringaPulMessaggioVocale = "";

                    selUtenteMessaggioVocale.innerHTML = "";

                    CreaElemento('option', 'opzTutti' + selUtenteMessaggioVocale.id, selUtenteMessaggioVocale.id, strSelMessaggioVocaleTutti).value = UtentiAttiviOltreMe.join("|");
                    for (let I = 0; I < totUtentiAttiviOltreMe; I++) {
                        CreaElemento('option', 'opz' + selUtenteMessaggioVocale.id + I, selUtenteMessaggioVocale.id, (DatiDoppiatori[UtentiAttiviOltreMe[I]] || { nome: NomeCreatoreProgetto }).nome).value = UtentiAttiviOltreMe[I];
                    }

                    if (TantiUtentiOnline) {
                        selUtenteMessaggioVocale.style.display = "inline";
                        selUtenteMessaggioVocale.value = SelezionePrecedente;
                        (!selUtenteMessaggioVocale.value) && (selUtenteMessaggioVocale.selectedIndex = 0); // Se non trova l'utente precedentemente selezionato, sposta la selezione in "Tutti gli utenti".

                        StringaDidascaliaMessaggioVocale = strMessaggioVocaleVariUtentiOnline;
                        StringaPulMessaggioVocale = strParlaCon;

                    } else {
                        selUtenteMessaggioVocale.style.display = "none";
                        selUtenteMessaggioVocale.value = UtentiAttiviOltreMe[0];

                        const NomeUtenteOnline = "<b>" + selUtenteMessaggioVocale.options[1].innerText + "</b>";
                        StringaDidascaliaMessaggioVocale = NomeUtenteOnline + strMessaggioVocaleSingoloUtenteOnline;
                        StringaPulMessaggioVocale = strParlaCon + NomeUtenteOnline;
                    }

                    didascaliaMessaggioVocale.innerHTML = StringaDidascaliaMessaggioVocale;
                    pulMessaggioVocale.children[1].innerHTML = StringaPulMessaggioVocale;
                }

            } else {
                MessaggiIstantaneiAttivi = false; pulMessaggioVocale.abilita(false); ContenitorePulMessaggioVocale.style.display = "none";
            }
        }, "", "", true
    );
}

function RiposizionamentoAutomaticoELTRiferitoAllaRegistrazione(datiAudio) {
    RiposizionamentoAutomaticoELT_NumClipAudio(datiAudio.numero);
}

function RiposizionamentoAutomaticoELT_NumClipAudio(Numero) {
    if (!ModalitaStreaming) { RiposizionamentoAutomaticoClipSovrapposte(document.getElementById('ELTReg' + Numero)); }
}

function SwitchColonnaInternazionale(CI) {
    ColonnaInternazionaleAttivata = CI;
    VideoGuidaImpostaVolume((CI ? 0 : CambiaVolumeVideoGuida.volume));
    lblVolumeVideoGuida.innerText = (CI ? strVolumeInternazionale : strVolumeFilmato);
    slideVolumeVideoGuida.value = (CI ? GuadagnoPrincipale[AudioBufferColonnaInternazionale[0].numero].gain.value : CambiaVolumeVideoGuida.volume);
    slideVolumeVideoGuida.onchange = (CI ? CambiaVolumeCI : CambiaVolumeVideoGuida);

    lblSwitchColonnaInternazionale.innerText = (CI ? strDisattivaColonnaInternazionale : strAttivaColonnaInternazionale);
    pulSwitchColonnaInternazionale.onclick = (CI ? PassaAllaColonnaVideoGuida : PassaAllaColonnaInternazionale);

    pulSwitchColonnaInternazionale.className = "btn btn-" + (CI ? "primary" : "default");
    document.getElementById('pulSwitchCI_Interruttore').className = "slider round" + (CI ? " slider-attivo" : "");

    EscludiRipristinaTraccia("CI");
}

function PassaAllaColonnaInternazionale() {
    SwitchColonnaInternazionale(true);
}

function PassaAllaColonnaVideoGuida() {
    SwitchColonnaInternazionale(false);
}

function CambiaVolumeCI() {
    const Volume = Number(slideVolumeVideoGuida.value);

    AudioBufferColonnaInternazionale.forEach((datiAudioCI) => {
        GuadagnoPrincipale[datiAudioCI.numero].gain.value = Volume;
    });
}

function appendBuffer(vBuffer) {
    const totBuffer = vBuffer.length;
    const CanaliAudio = vBuffer[0].numberOfChannels;
    var lunghezzaTotale = 0; vBuffer.forEach((b) => { lunghezzaTotale += b.length; });
    var tmp = audioContext.createBuffer(CanaliAudio, lunghezzaTotale, vBuffer[0].sampleRate);
    for (var i = 0; i < CanaliAudio; i++) {
        var channel = tmp.getChannelData(i);

        var partenza = 0;
        for (let b = 0; b < totBuffer; b++) {
            channel.set(vBuffer[b].getChannelData(i), partenza);
            partenza += vBuffer[b].length;
        }
    }
    return tmp;
}

function CreaNuovaClipAudio(Dati, FunzioneAlTermine, Visualizzazione = true) {
    GeneraDatiAudio(Dati, ++CreaNuovaClipAudio.N, ((ModalitaStreaming || !Visualizzazione) ? "" : VisualizzazioneNellaLineaTemporale), FunzioneAlTermine);
}
CreaNuovaClipAudio.N = -1;

function CaricaColonnaInternazionale(Dati) {
    if (pulSwitchColonnaInternazionale) { pulSwitchColonnaInternazionale.abilita(false); }

    SpezzoniAudioCI = Dati.Spezzoni.split(',');

    SpezzoniAudioCI.forEach((SpezzoneAudio, NumSpezzone) => {
        CreaNuovaClipAudio({ Registrazione: SpezzoneAudio, N: "CI" + NumSpezzone, ID_Utente: 'CI', MinutaggioRegistrazione: +InizioVideoGuida + (75 * NumSpezzone), TaglioIniziale: 0, TaglioFinale: 75, DurataRegistrazione: 75, Guadagno: Dati.volume }, (datiAudio) => { datiAudio.numspezzoneCI = NumSpezzone; AudioBufferColonnaInternazionale.push(datiAudio); }, false);
    });

    if (pulSwitchColonnaInternazionale) { SwitchColonnaInternazionale(false); setTimeout(() => { pulSwitchColonnaInternazionale.abilita(true); }, 500); }
}

function CaricaAudio(Numero, Dati, TipoDato, Funzione, FunzioneAlTermine1, FunzioneAlTermine2) {
    var XHR = new XMLHttpRequest();
    XHR.open("GET", Dati.Registrazione, true);
    XHR.responseType = TipoDato;

    XHR.onload = function () {
        if (this.status == 200) {
            Funzione(this.response, Dati, Numero, FunzioneAlTermine1, FunzioneAlTermine2);
        } else {
            XHR.onerror();
        }
    }

    XHR.onerror = function () {
        console.log("Errore caricamento clip audio", Numero, Dati.Registrazione);
        window.setTimeout(() => { CaricaAudio(Numero, Dati, TipoDato, Funzione, FunzioneAlTermine1, FunzioneAlTermine2); }, 1000);
    };

    XHR.send(null);
}

function GeneraDatiAudio(Dati, Numero, FunzioneAlTermine1, FunzioneAlTermine2) {
    DatiAudioRegistrato[Numero] = {
        audio: false, buffer: false, avviato: false, CreazioneInCorso: true,
        numero: Numero, NumeroUnivoco: Dati.N, ID_Utente: Dati.ID_Utente, Data: Dati.Data,
        MinutaggioRegistrazione: Number(Dati.MinutaggioRegistrazione),
        durataMemorizzata: (+Dati.DurataRegistrazione) || 0,
        taglioIniziale: Number(Dati.TaglioIniziale),
        taglioFinale: Number(Dati.TaglioFinale),
        Rimosso: (Dati.Rimosso == "si"),
        Escluso: false,
        Registrazione: Dati.Registrazione, imgOndaSonora: Dati.Registrazione.slice(0, Dati.Registrazione.lastIndexOf(".")) + ".png",
        guadagnoiniziale: Dati.Guadagno,
        effetti: Dati.Effetti || "",
        alPlay: false,
        daVisualizzare: ((Dati.Visualizzato == 0) && (SonoCreatoreProgetto)),
        infoAggiuntive: Dati.InfoAggiuntive || "",
        commentiDoppiatore: Dati.CommentiDoppiatore || "", commentiDoppiatore_prec: Dati.CommentiDoppiatore || "", commentiCreatoreProgetto: Dati.CommentiCreatoreProgetto || "", commentiCreatoreProgetto_prec: Dati.CommentiCreatoreProgetto || "", commentiVisualizzatiDoppiatore: Dati.CommentiVisualizzatiDoppiatore, commentiVisualizzatiCreatoreProgetto: Dati.CommentiVisualizzatiCreatoreProgetto
    };

    /** Cataloga i DatiAudioRegistrato per file **/
    DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione] = (DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione] || []);
    DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione].push(DatiAudioRegistrato[Numero]);
    /*********************************************/

    CreaDatiGuadagnoPrincipale(Numero, Dati.Guadagno);

    OttieniDurataAudio(Numero, FunzioneAlTermine1, FunzioneAlTermine2);
}

function OttieniDurataAudio(Numero, Funzione, SecondaFunzione) {
    const datiAudio = DatiAudioRegistrato[Numero];

    if ((datiAudio.Durata = datiAudio.durataMemorizzata) == 0) {
        CaricaBufferAudio(Numero, () => {
            /** Memorizza la durata **/
            datiAudio.Durata = datiAudio.buffer.duration || 0;
            if (datiAudio.ID_Utente != 'CI') {
                if (datiAudio.Durata > 0) { AJAXSalvaDurataClipAudio(datiAudio); } else { console.log("Problema durata clip", datiAudio); return; } // Quando si registra una nuova clip, la durata viene salvata solo al caricamento della registrazione, che consente di calcolarla con precisione. Se l'utente esce dalla pagina prima che venga effettuato questo salvataggio, esso verrà richiamato al prossimo caricamento.
            }

            VisualizzaClipCaricata(Numero, Funzione, SecondaFunzione);
            if (RiproduzioneInCorso) { VerificaClipDaRiprodurre(Numero, VideoGuidaMinutaggioCorrente()); FunzioneRiproduzioneClip = RiproduciClipInSync; }
        }, true);

    } else {
        VisualizzaClipCaricata(Numero, Funzione, SecondaFunzione);
    }
}

function VisualizzaClipCaricata(Numero, Funzione, SecondaFunzione) {
    const datiAudio = DatiAudioRegistrato[Numero];

    /** Lancia la prima funzione **/
    if (Funzione) { Funzione(datiAudio); }

    /** Visualizza gli effetti audio **/
    VisualizzaAmpiezzaOndaSonora(Numero); VisualizzaEffettiAudio(Numero);

    /** Lancia la seconda funzione **/
    if (SecondaFunzione) { SecondaFunzione(datiAudio); }

    /** Se siamo nel caricamento iniziale, aggiorna l'andamento **/
    if (!CaricamentoInizialeTerminato) { AggiornaCaricamentoClip(); }

    /** Se il buffer è stato già precaricato, visualizza l'ELT di conseguenza **/
    if (datiAudio.buffer) { VisualizzaELTBufferCaricato(Numero); }

    /** Elimina il flag CreazioneInCorso **/
    datiAudio.CreazioneInCorso = false;
}

function AJAXSalvaDurataClipAudio(datiAudio) {
    AJAX("SalvaDurataRegistrazione.php", "N=" + encodeURIComponent(datiAudio.NumeroUnivoco) + "&DurataRegistrazione=" + encodeURIComponent(datiAudio.Durata), "", "", "", true);
    datiAudio.taglioIniziale = 0; datiAudio.taglioFinale = datiAudio.Durata;
}

function CreaDatiGuadagnoPrincipale(Numero, Guadagno) {
    GuadagnoPrincipale[Numero] = { gain: { value: Guadagno }, disconnect: function () { } };
}

function AggiornaCaricamentoClip(VisualizzaBarraCaricamento = false) {
    totClipAudioCaricate++;
    if (VisualizzaBarraCaricamento) { ComparsaBarraCaricamento(); VisualizzaProgressoBarraCaricamento(BC, totClipAudioCaricate / NumeroTotaleAudioCaricamentoIniziale); }
    if (totClipAudioCaricate >= NumeroTotaleAudioCaricamentoIniziale) { TermineCaricamentoClip(); }
}

function CreaClipAudio(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero];
    datiAudio.audio = new AudioBufferSourceNode(audioContext, { buffer: datiAudio.buffer, channelCount: 1 });
    AttivaEffettiAudio(Numero);
}

function DisconnettiEffettiAudio(Numero) {
    var GuadagnoPrecedente = GuadagnoPrincipale[Numero].gain.value; GuadagnoPrincipale[Numero].disconnect(); GuadagnoPrincipale[Numero] = null;
    if (FiltroBandaAR[Numero]) { FiltroBandaAR[Numero].disconnect(); delete FiltroBandaAR[Numero]; }
    if (EffettoDelay1[Numero]) { GuadagnoDelay1[Numero].disconnect(); EffettoDelay1[Numero].disconnect(); delete GuadagnoDelay1[Numero]; delete EffettoDelay1[Numero]; }
    if (EffettoDelay2[Numero]) { GuadagnoDelay2[Numero].disconnect(); EffettoDelay2[Numero].disconnect(); delete GuadagnoDelay2[Numero]; delete EffettoDelay2[Numero]; }
    if (EffettoDelay3[Numero]) { GuadagnoDelay3[Numero].disconnect(); EffettoDelay3[Numero].disconnect(); delete GuadagnoDelay3[Numero]; delete EffettoDelay3[Numero]; }

    return GuadagnoPrecedente;
}

function AttivaEffettiAudio(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero], GuadagnoPrecedente = DisconnettiEffettiAudio(Numero);

    switch (datiAudio.effetti) {
        case "radio": CreaEffettoRadio(Numero); break;
        case "ovattato": CreaEffettoOvattato(Numero); break;
        case "echo": CreaEffettoEcho(Numero); break;
        case "riverbero": CreaEffettoRiverbero(Numero); break;

        default: CreaControllerGuadagno(Numero); break;
    }

    GuadagnoPrincipale[Numero].gain.value = GuadagnoPrecedente;

    VisualizzaEffettiAudio(Numero);
}

function VisualizzaEffettiAudio(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero], simbolo = document.getElementById('ELTReg' + datiAudio.numero + "SimboloEffetto");
    if (simbolo) { simbolo.className = "SimboloEffettoELT " + simboloEffettoELT[datiAudio.effetti]; simbolo.style.left = document.getElementById('ELTReg' + datiAudio.numero + "StratoColore").style.left; }
}

function CreaGuadagnoPrincipale(Numero) {
    GuadagnoPrincipale[Numero] = audioContext.createGain(); GuadagnoPrincipale[Numero].channelCount = 1;
}

function CreaControllerGuadagno(Numero) {
    const ac = audioContext;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
}

function CreaEffettoRadio(Numero) {
    const ac = audioContext;
    FiltroBandaAR[Numero] = ac.createBiquadFilter(); FiltroBandaAR[Numero].channelCount = 1;
    FiltroBandaAR[Numero].type = "highpass"; FiltroBandaAR[Numero].frequency.value = 1500;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(FiltroBandaAR[Numero]).connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
}

function CreaEffettoOvattato(Numero) {
    const ac = audioContext;
    FiltroBandaAR[Numero] = ac.createBiquadFilter(); FiltroBandaAR[Numero].channelCount = 1;
    FiltroBandaAR[Numero].type = "lowpass"; FiltroBandaAR[Numero].frequency.value = 800;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(FiltroBandaAR[Numero]).connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
}

function CreaEffettoEcho(Numero) {
    const ac = audioContext;
    GuadagnoDelay1[Numero] = ac.createGain(); GuadagnoDelay1[Numero].channelCount = 1; GuadagnoDelay1[Numero].gain.value = 0.6;
    EffettoDelay1[Numero] = ac.createDelay(); EffettoDelay1[Numero].channelCount = 1; EffettoDelay1[Numero].delayTime.value = 0.15
    GuadagnoDelay2[Numero] = ac.createGain(); GuadagnoDelay2[Numero].channelCount = 1; GuadagnoDelay2[Numero].gain.value = 0.3;
    EffettoDelay2[Numero] = ac.createDelay(); EffettoDelay2[Numero].channelCount = 1; EffettoDelay2[Numero].delayTime.value = 0.2;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoDelay1[Numero]).connect(EffettoDelay1[Numero]).connect(GuadagnoDelay2[Numero]).connect(EffettoDelay2[Numero]).connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
}

function CreaEffettoRiverbero(Numero) {
    const ac = audioContext;
    GuadagnoDelay1[Numero] = ac.createGain(); GuadagnoDelay1[Numero].channelCount = 1; GuadagnoDelay1[Numero].gain.value = 0.7;
    EffettoDelay1[Numero] = ac.createDelay(); EffettoDelay1[Numero].channelCount = 1; EffettoDelay1[Numero].delayTime.value = 0.08
    GuadagnoDelay2[Numero] = ac.createGain(); GuadagnoDelay2[Numero].channelCount = 1; GuadagnoDelay2[Numero].gain.value = 0.45;
    EffettoDelay2[Numero] = ac.createDelay(); EffettoDelay2[Numero].channelCount = 1; EffettoDelay2[Numero].delayTime.value = 0.08;
    GuadagnoDelay3[Numero] = ac.createGain(); GuadagnoDelay3[Numero].channelCount = 1; GuadagnoDelay3[Numero].gain.value = 0.2;
    EffettoDelay3[Numero] = ac.createDelay(); EffettoDelay3[Numero].channelCount = 1; EffettoDelay3[Numero].delayTime.value = 0.02;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoDelay1[Numero]).connect(EffettoDelay1[Numero]).connect(GuadagnoDelay2[Numero]).connect(EffettoDelay2[Numero]).connect(GuadagnoDelay3[Numero]).connect(EffettoDelay3[Numero]).connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
}

/*** Analisi e visualizzazione grafica della registrazione nella linea temporale ***/
function VisualizzazioneNellaLineaTemporale(datiAudio) {
    if (ModalitaLightAttiva && (datiAudio.ID_Utente != ID_Utente)) { return; }
    try {
        const NumeroTraccia = Number(DatiDoppiatori[datiAudio.ID_Utente].numeroTraccia), NomeDoppiatore = DatiDoppiatori[datiAudio.ID_Utente].nome;
        const Didascalia = ((ID_Utente == datiAudio.ID_Utente) ? strTuaRegistrazione + " " : strClipDi + NomeDoppiatore + " ") + datiAudio.Data;
        CreaElementoLineaTemporale('ELTReg' + datiAudio.numero, 'Traccia' + NumeroTraccia, datiAudio.MinutaggioRegistrazione, datiAudio.Durata, Didascalia, datiAudio.numero, "0%", "100%", datiAudio.imgOndaSonora, datiAudio.daVisualizzare).style.display = "inline";
    } catch (err) {
        CreaElementoLineaTemporale('ELTReg' + datiAudio.numero, 'ContenutoTracce', datiAudio.MinutaggioRegistrazione, datiAudio.Durata, "", datiAudio.numero, "-100px", "0px", "", false); // Se il doppiatore è stato aggiunto dopo il caricamento della pagina e quindi non trova la traccia corrispondente, crea l'ELT nascosto in maniera tale da creare comunque l'elemento (ed evitare che si generino errori di elemento non trovato)
    }
}

function CreaElementoLineaTemporale(ID, DoveInserirlo, PartenzaRegistrazione, LunghezzaRegistrazione, Stringa, RiferimentoRegistrazione, Posizione, Altezza, imgOndaSonora, DaVisualizzare) {
    const ELT = CreaElemento('div', ID, DoveInserirlo);
    ELT.title = Stringa; ELT.className = "ELT transizione-morbida-si"; ELT.setAttribute("name", "ELT"); ELT.iStyle({ display: "none", opacity: 0.8, transform: "scaleY(0.9)", position: 'absolute', top: Posizione, height: Altezza });
    ELT.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    InserimentoInProporzioneNellaLineaTemporale(ELT, PartenzaRegistrazione, LunghezzaRegistrazione);

    const ContenutoELT = CreaElemento('div', ID + "Contenuto", ID); ContenutoELT.className = "ContenutoELT";

    const StratoColoreELT = CreaElemento('div', ID + 'StratoColore', ContenutoELT.id); StratoColoreELT.className = "StratoColoreELT"; StratoColoreELT.style.transition = "all 2s";

    const OndaSonoraELT = CreaElemento('img', ID + 'OndaSonora', ContenutoELT.id); OndaSonoraELT.className = "OndaSonoraELT"; OndaSonoraELT.src = imgOndaSonora;

    const SimboloEffettoELT = CreaElemento('div', ID + 'SimboloEffetto', ContenutoELT.id); SimboloEffettoELT.className = "SimboloEffettoELT";

    if (((DatiAudioRegistrato[RiferimentoRegistrazione].ID_Utente == ID_Utente) && (SolaVisione == false)) || (SonoCreatoreProgetto)) {
        ELT.style.cursor = puntatoreTool[StrumentoMouse];
        ELT.dataset.modificabile = "si";

        /*** Eventi al click dell'elemento nella linea temporale ***/
        ELT.addEventListener('mousedown',
            function (e) {
                if ((e.button != 0) || (StrumentoMouse == toolMarcatore)) { return; }

                ELTCliccato = e.currentTarget;
                const ELT = e.currentTarget, NumeroAudio = +ELT.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[NumeroAudio];

                e.stopPropagation(); // Impedisce di attivare l'evento mousedown del righello.

                if ((Righello.dataset.DisattivaClick == "no") || ((ELTDaSpostare == ELTCliccato) && (StrumentoMouse == toolStandard))) { // Attiva il trascinamento col mouse se il righello è attivo oppure in ogni caso se l'ELT era stato in precedenza cliccato.
                    switch (StrumentoMouse) {
                        case toolStandard:
                            if (!ELTDaSpostare) { OpzioniClip(NumeroAudio, true); } // Se ancora ELTDaSpostare non è stato definito vuol dire che è la prima volta e apre la finestra delle opzioni.
                            ELTDaSpostare = ELTCliccato;
                            ELTDaSpostare.dataset.posizionedelmouse = (e.clientX + window.scrollX) - ContenitoreRighello.offsetLeft - ELTDaSpostare.offsetLeft;
                            tmrELTCliccato = setTimeout(() => {
                                ELTDaSpostare.className = "ELT transizione-morbida-no";
                                Righello.addEventListener('mousemove', SpostaELT);
                            }, 200
                            );
                            break;

                        case toolDividiClip:
                            const MinutaggioSelezionatoClip = MinutaggioCliccatoNellaClip(e.clientX);
                            if ((datiAudio.taglioIniziale < MinutaggioSelezionatoClip) && (MinutaggioSelezionatoClip < datiAudio.taglioFinale)) {
                                ELT.dataset.posizionePuntatoreInizioTaglio = e.clientX;
                                AnteprimaSelezioneClip(ELT, e.clientX);
                                ELT.addEventListener('mousemove', AnteprimaSelezioneClip.Visualizza);
                                document.body.addEventListener('mouseup', DividiClip_puntatorerilasciato);
                            }
                            break;

                        case toolEscludiClip:
                            EscludiRipristinaClip(NumeroAudio);
                            break;
                    }
                }
            }
        );

        ELT.addEventListener('mouseup', DisattivaSpostamentoManualeClip, true);

        /*** Eventi al passaggio del mouse ***/
        ELT.addEventListener('mouseenter',
            function (e) {
                const ELTAttuale = e.currentTarget;
                clearTimeout(tmrRitornoDisposizioneOriginaleELT);

                tmrRiposizionamentoAutomaticoELT = setTimeout(() => { RiposizionamentoAutomaticoClipSovrapposte(ELTAttuale); }, 500);
            }
        );

        ELT.addEventListener('mouseleave', () => { clearTimeout(tmrRiposizionamentoAutomaticoELT); });

        /*** Memorizza la clip come "Visualizzata" se riprodotta **/
        if (DaVisualizzare) { ContenutoELT.style.border = "3px dashed darkgreen"; DatiAudioRegistrato[RiferimentoRegistrazione].alPlay = AJAXSalvaAudioAscoltato; }

        /*** Visualizzazione eventuali commenti ***/
        setTimeout(() => { VisualizzaCommentiELT(RiferimentoRegistrazione); }, 1000);
    }

    /*** Visualizzazione ELT ***/
    VisualizzazioneGraficaTaglioClip(RiferimentoRegistrazione);
    VisualizzaELTNormale(RiferimentoRegistrazione);

    return ELT;
}

function VisualizzaELTNormale(Numero) {
    VisualizzaClipAudio(Numero, (DatiAudioRegistrato[Numero].Rimosso == false));
}

function DisattivaSpostamentoManualeClip() {
    clearTimeout(tmrELTCliccato);
    Righello.removeEventListener('mousemove', SpostaELT);
}

function AnteprimaSelezioneClip(ELT, ClientX) {
    const x = (+ClientX + window.scrollX) - ContenitoreRighello.offsetLeft - ELT.offsetLeft;
    const div = CreaElemento('div', 'selezioneprovvisoria' + ELT.id, ELT.id + 'StratoColore', '', true); div.iStyle({ position: "absolute", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.5)", zIndex: 1, left: x + "px" });

    AnteprimaSelezioneClip.Visualizza = (e) => {
        const PosizioneMouse = ((+e.clientX + window.scrollX) - ContenitoreRighello.offsetLeft - e.currentTarget.offsetLeft) - x;
        div.iStyle({ width: PosizioneMouse + "px", transform: ((PosizioneMouse > 0) ? "" : "translate(-100%, 0)") });
    };

    AnteprimaSelezioneClip.Elimina = () => { EliminaElemento(div); };
}
AnteprimaSelezioneClip.Visualizza = () => { }; AnteprimaSelezioneClip.Elimina = () => { };

function AJAXSalvaAudioAscoltato(datiAudio) {
    AJAX('SalvaRegistrazioneAscoltata.php', "N=" + datiAudio.NumeroUnivoco, "", "", "", true);

    document.getElementById('ELTReg' + datiAudio.numero).children[0].style.borderColor = "dodgerblue";

    datiAudio.alPlay = false;
}

function RiposizionamentoAutomaticoClipSovrapposte(ELTAttuale) {
    if (ELTDaSpostare == false) {
        const IDTraccia = ELTAttuale.parentNode.id, leftELTAttuale = parseFloat(ELTAttuale.style.left), widthELTAttuale = parseFloat(ELTAttuale.style.width), TermineELTAttuale = leftELTAttuale + widthELTAttuale;
        const ELTTimeline = document.querySelectorAll("#" + IDTraccia + " [name='ELT']"), totELT = ELTTimeline.length;

        /* Trova tutti gli ELT sovrapposti con ELTAttuale */
        var ELTConsiderato, leftELTConsiderato = 0, NuoviELTDaRiordinare = [];
        for (var I = 0; I < totELT; I++) {
            ELTConsiderato = ELTTimeline[I];

            if (ELTConsiderato.style.display != "none") {
                leftELTConsiderato = parseFloat(ELTConsiderato.style.left);
                if ((leftELTConsiderato <= TermineELTAttuale) && (leftELTAttuale <= (leftELTConsiderato + parseFloat(ELTConsiderato.style.width)))) {
                    ELTDaRiordinare[ELTConsiderato.id] = true;
                    NuoviELTDaRiordinare.push(ELTConsiderato);
                }
            }
        }

        /* Effettua il riposizionamento */
        const totELTDaRiordinare = NuoviELTDaRiordinare.length
        if (totELTDaRiordinare > 0) {
            const altezzaclip = 100 / totELTDaRiordinare;
            for (I = 0; I < totELTDaRiordinare; I++) {
                NuoviELTDaRiordinare[I].iStyle({ top: (altezzaclip * I) + "%", height: altezzaclip + "%" });
            }
        }
    }
}

function PosizioneOriginaleClipSovrapposte() {
    if (Righello.dataset.DisattivaClick == "no") {
        for (idELT in ELTDaRiordinare) {
            document.getElementById(idELT).iStyle({ top: "0%", height: "100%" });
        }

        ELTDaRiordinare = [];
    }
}

function VisualizzaCommentiELT(Numero) {
    function FormattaCommenti(Commenti) {
        return Commenti.ritorniACapoHTML().replace(/(".+?")/g, "<span style='font-size: 90%; font-style: italic;'>$1</span>");
    }

    const datiAudio = DatiAudioRegistrato[Numero], CommentiDoppiatore = datiAudio.commentiDoppiatore, CommentiCreatoreProgetto = datiAudio.commentiCreatoreProgetto, Doppiaspunta = "<span class='fa fa-check' style='color: white; font-size: 9px;'></span><span class='fa fa-check' style='color: darkturquoise; font-size: 9px; position: relative; left: -5px;'></span>", GrandezzaFont = (SistemaAttualeAndroid ? "20px" : "");
    const id_ELT = 'ELTReg' + datiAudio.numero, id_commentoELT = 'CommentoELT' + Numero, id_freccia = 'freccia' + id_commentoELT, id_commentoDoppiatore = 'testoCommentoDoppiatore' + id_commentoELT, id_commentoCreatoreProgetto = 'testoCommentoCreatoreProgetto' + id_commentoELT;

    if ((CommentiDoppiatore != "") || (CommentiCreatoreProgetto != "")) {
        if (!(DatiDoppiatore = DatiDoppiatori[datiAudio.ID_Utente])) { return; } // Verifica se esiste la traccia del doppiatore considerato (può essere un doppiatore aggiunto dopo il caricamento della pagina)
        const NomeDoppiatore = DatiDoppiatore.nome;

        const commentoELT = CreaElementoSeInesistente('div', id_commentoELT, id_ELT, '', 'CommentoELT'); commentoELT.style.left = document.getElementById(id_ELT + 'StratoColore').style.left;
        const FrecciaCommentoELT = CreaElementoSeInesistente('div', id_freccia, id_commentoELT, '', 'FrecciaCommentoELT blu-bordo-semitrasparente');

        function CommentoDaLeggere() {
            FrecciaCommentoELT.style.animation = "blink 1s ease 0s infinite";
            document.getElementById(id_ELT).addEventListener('mouseenter', MemorizzaCommentiVisualizzati);
        }

        if (CommentiDoppiatore != "") {
            const CommentiDoppiatoreFormattati = FormattaCommenti(CommentiDoppiatore), CommentiVisualizzatiCP = (datiAudio.commentiVisualizzatiCreatoreProgetto == 1);
            CreaElementoSeInesistente('div', id_commentoDoppiatore, id_commentoELT, `${CommentiDoppiatoreFormattati}${(CommentiVisualizzatiCP ? Doppiaspunta : "")}<div class='FirmaCommento'>${NomeDoppiatore}</div><hr />`, 'TestoCommentoELT').style.fontSize = GrandezzaFont;
            if ((SonoCreatoreProgetto) && (!CommentiVisualizzatiCP)) { CommentoDaLeggere(); }
        } else {
            EliminaElemento(document.getElementById(id_commentoDoppiatore));
        }

        if (CommentiCreatoreProgetto != "") {
            const CommentiCreatoreProgettoFormattati = FormattaCommenti(CommentiCreatoreProgetto), CommentiVisualizzatiD = (datiAudio.commentiVisualizzatiDoppiatore == 1);
            CreaElementoSeInesistente('div', id_commentoCreatoreProgetto, id_commentoELT, `${CommentiCreatoreProgettoFormattati}${(CommentiVisualizzatiD ? Doppiaspunta : "")}<div class='FirmaCommento'>${NomeCreatoreProgetto}</div>`, 'TestoCommentoELT').style.fontSize = GrandezzaFont;
            if ((!SonoCreatoreProgetto) && (!CommentiVisualizzatiD)) { CommentoDaLeggere(); }
        } else {
            EliminaElemento(document.getElementById(id_commentoCreatoreProgetto));
        }

    } else {
        EliminaElemento(document.getElementById(id_commentoELT));
    }
}

function MemorizzaCommentiVisualizzati(e) {
    const ELT = e.currentTarget, Numero = ELT.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero], N = datiAudio.NumeroUnivoco;
    const Destinatario = (SonoCreatoreProgetto ? "CreatoreProgetto" : "Doppiatore");
    AJAX("MemorizzaCommentiVisualizzati.php", "N=" + N + "&Destinatario=" + Destinatario, "", "", "", true);
    datiAudio['commentiVisualizzati' + Destinatario] = 1;
    ELT.removeEventListener('mouseenter', MemorizzaCommentiVisualizzati);
    document.getElementById('frecciaCommentoELT' + Numero).style.animation = "";
}

/*** Variazione altezza singola traccia ***/
function AttivaVariazioneAltezzaTracciaConMouse(e) {
    TracciaDaRidimensionare = e.currentTarget.dataset.numerotraccia;
    AltezzaMinimaTraccia = (+document.getElementById('divContenutoNomeTraccia' + TracciaDaRidimensionare).offsetHeight) + 14;
    LimiteMinimoTracciaDaRidimensionare = (+ContenitoreLineaTemporale.offsetTop) + 15 + (+document.getElementById('Traccia' + TracciaDaRidimensionare).offsetTop) + AltezzaMinimaTraccia;
    WindowScrollY_Iniziale = window.scrollY;
    for (let I = ((+TracciaDaRidimensionare) + 1); I < NumeroTotaleTracce; I++) { document.getElementById('Traccia' + I).style.opacity = 0; document.getElementById('NomeTraccia' + I).style.opacity = 0; }
    document.body.addEventListener('mousemove', VariazioneAltezzaTracciaConMouse); ContenitoreLineaTemporale.addEventListener('touchmove', VariazioneAltezzaTracciaConMouse);
    document.body.addEventListener('mouseup', DisattivaVariazioneAltezzaTracciaConMouse); ContenitoreLineaTemporale.addEventListener('touchend', DisattivaVariazioneAltezzaTracciaConMouse);
}

function VariazioneAltezzaTracciaConMouse(e) {
    const Y = e.clientY || e.touches[0].clientY, NumeroTraccia = TracciaDaRidimensionare, maxAltezza = 800;
    e.preventDefault();
    if (Y > (window.innerHeight - 100)) { window.scrollBy(0, 8); } else { window.scrollTo(window.scrollX, WindowScrollY_Iniziale); }

    const AltezzaIndicata = (Y + window.scrollY) - LimiteMinimoTracciaDaRidimensionare, CondizioneSogliaMinima = (AltezzaIndicata > 0), CondizioneSogliaMassima = (AltezzaIndicata < maxAltezza);
    const Altezza = (+AltezzaMinimaTraccia) + (AltezzaIndicata * CondizioneSogliaMinima * CondizioneSogliaMassima) + (maxAltezza * !CondizioneSogliaMassima);
    VariaAltezzaTraccia(NumeroTraccia, Altezza);
}

function VariaAltezzaTraccia(NumeroTraccia, pxAltezza) {
    document.getElementById('Traccia' + NumeroTraccia).style.height = pxAltezza + "px";
    document.getElementById('NomeTraccia' + NumeroTraccia).style.height = pxAltezza + "px";
}

function DisattivaVariazioneAltezzaTracciaConMouse(e) {
    document.body.removeEventListener('mousemove', VariazioneAltezzaTracciaConMouse); ContenitoreLineaTemporale.removeEventListener('touchmove', VariazioneAltezzaTracciaConMouse);
    document.body.removeEventListener('mouseup', DisattivaVariazioneAltezzaTracciaConMouse); ContenitoreLineaTemporale.removeEventListener('touchend', DisattivaVariazioneAltezzaTracciaConMouse);
    SpostaInBassoTracceSuccessive();
    AdattaAltezzaContenitoreTracce();
    TracciaDaRidimensionare = false;
}

function SpostaInBassoTracceSuccessive() {
    var TracciaPrecedente, NuovoTop, I;
    for (I = ((+TracciaDaRidimensionare) + 1); I < NumeroTotaleTracce; I++) {
        TracciaPrecedente = document.getElementById('Traccia' + (I - 1));
        NuovoTop = ((+TracciaPrecedente.offsetTop) + (+TracciaPrecedente.offsetHeight)) + "px";
        document.getElementById('Traccia' + I).iStyle({ top: NuovoTop, opacity: 1 }); document.getElementById('NomeTraccia' + I).iStyle({ top: NuovoTop, opacity: 1 });
    }
}

function AdattaAltezzaContenitoreTracce() {
    const ContenutoTracce = document.getElementById('ContenutoTracce');
    if (UnitaDiMisura == "%") {
        ContenitoreRighello.style.height = "100%";
        ContenutoTracce.style.height = "100%";
    } else {
        const UltimaTraccia = document.getElementById('Traccia' + (NumeroTotaleTracce - 1));
        ContenutoTracce.style.height = ((+UltimaTraccia.offsetTop) + (+UltimaTraccia.offsetHeight) + 800) + "px";
        ContenitoreLineaTemporale.style.height = ContenutoTracce.style.height;
    }
}
/******************************************/

function CreaFinestraOpzioniClip(RiferimentoRegistrazione) {
    const datiAudio = DatiAudioRegistrato[RiferimentoRegistrazione], PartenzaRegistrazione = datiAudio.MinutaggioRegistrazione, LunghezzaRegistrazione = datiAudio.Durata, AudioAttivo = !datiAudio.Rimosso;

    /** Memorizza il valore attuale di tutte le opzioni per poterle ripristinare in caso di annullamento **/
    const Max = Number(totDurataVideoGuida) - Number(LunghezzaRegistrazione), MinutaggioAttuale = new MinutiESecondi(PartenzaRegistrazione), MinutaggioMassimo = new MinutiESecondi(Max);
    const minutiprec = MinutaggioAttuale.Minuti, secondiprec = MinutaggioAttuale.Secondi;
    const guadagnoprec = GuadagnoPrincipale[RiferimentoRegistrazione].gain.value;
    const taglioinizialeprec = datiAudio.taglioIniziale, tagliofinaleprec = datiAudio.taglioFinale;
    const effettiprec = datiAudio.effetti;
    /******************************************************************************************************/

    /*** Crea la finestrella delle opzioni ***/
    const divContenitoreOpzioni = CreaElemento('div', ID_Opzioni, document.body.id); divContenitoreOpzioni.className = "panel panel-info";
    divContenitoreOpzioni.iStyle({ display: 'none', position: 'fixed', top: '10px', left: "10%", zIndex: 100000000 + Number(RiferimentoRegistrazione) });
    divContenitoreOpzioni.addEventListener('mouseup', () => { OggettoDaSpostare = false; document.body.removeEventListener('mousemove', SpostaOggettoColMouse); });

    /** Barra del titolo **/
    var div = CreaElemento('div', 'OpzioniTitolo', ID_Opzioni); div.className = "panel-heading text-center";

    const barratitolo = CreaElemento('div', 'lblOpzioniTitolo', div.id, strOpzioniTraccia); barratitolo.iStyle({ width: "70%", margin: "0px auto", cursor: "move" });
    barratitolo.addEventListener('mousedown', () => { OggettoDaSpostare = divContenitoreOpzioni; document.body.addEventListener('mousemove', SpostaOggettoColMouse); });

    const pulCancellaRipristina = CreaElemento('a', ID_Opzioni + 'Cancella', div.id); pulCancellaRipristina.iStyle({ position: "absolute", top: "5px", left: "10px" });
    pulCancellaRipristina.className = (AudioAttivo ? 'btn btn-danger fa fa-trash-o' : 'btn btn-info fa fa-undo'); pulCancellaRipristina.title = (AudioAttivo ? strCancellaClip : strRipristinaClip);
    pulCancellaRipristina.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    pulCancellaRipristina.onclick = (AudioAttivo ? (e) => { CancellaRipristinaRegistrazione(e.currentTarget.dataset.RiferimentoRegistrazione, false); } : (e) => { CancellaRipristinaRegistrazione(e.currentTarget.dataset.RiferimentoRegistrazione, true); });

    const pulDuplicaClip = CreaElemento('a', ID_Opzioni + 'Duplica', div.id, strDuplicaClip_lblPulsante); pulDuplicaClip.iStyle({ position: "absolute", top: "5px", right: "10px" });
    pulDuplicaClip.className = "btn btn-info fa fa-copy"; pulDuplicaClip.title = strDuplicaClip;
    pulDuplicaClip.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    pulDuplicaClip.onclick = (e) => { OpzioniClip(e.currentTarget.dataset.RiferimentoRegistrazione, false, true); DuplicaClip(e.currentTarget.dataset.RiferimentoRegistrazione); };


    /** Contenuto **/
    div = CreaElemento('div', ID_Opzioni + 'ContenitoreOpzioniBody', ID_Opzioni); div.className = "panel-body";
    var Tabella = CreaElemento('table', ID_Opzioni + 'TabellaOpzioni', div.id), tr, td; Tabella.className = "TabellaOpzioni"; Tabella.style.width = "100%";

    /** Funzioni per la creazione degli strumenti dell'interfaccia utente **/
    function CreaSlide(IDRiferimento, Stringa, minSlide, maxSlide, stepSlide, minCasella, maxCasella, stepCasella, labelCasella, FunzioneInputSlide, FunzioneChangeCasella, valoreIniziale) {
        tr = CreaElemento('tr', ID_Opzioni + 'TabellaOpzioniRiga' + IDRiferimento, Tabella.id);
        td = CreaElemento('td', tr.id + 'tdOpzioneLabel', tr.id, Stringa); td.iStyle({ fontFamily: 'Verdana', fontSize: '12px' });
        td = CreaElemento('td', tr.id + 'tdOpzioneSlide', tr.id);
        var slide = CreaElemento('input', tr.id + 'Slide', td.id);
        slide.setAttribute("type", "range"); slide.setAttribute("min", minSlide); slide.setAttribute("max", maxSlide); slide.setAttribute("step", stepSlide);
        slide.value = valoreIniziale;
        slide.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
        slide.addEventListener('input', FunzioneInputSlide);
        td = CreaElemento('td', tr.id + 'tdOpzioneValore', tr.id); td.style.textAlign = "left";
        var c = CreaElemento('input', tr.id + 'Casella', td.id); c.style.width = "80px";
        c.setAttribute("type", "number"); c.setAttribute("min", minCasella); c.setAttribute("max", maxCasella); c.setAttribute("step", stepCasella);
        c.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
        c.addEventListener('change', FunzioneChangeCasella);
        CreaElemento('span', tr.id + 'Casellalabel', td.id, labelCasella);

        setTimeout(() => {
            FunzioneInputSlide({ currentTarget: slide }); // Simula inserimento manuale visualizzando correttamente l'interfaccia utente
        }, 200);
    }

    function CreaPulsanteEffetto(Effetto, IDContenitore, labelPulsante) {
        var pulEffetto = CreaElemento('a', ID_Opzioni + "pulEffetto" + Effetto, IDContenitore, "<span class='fa " + simboloEffetto[Effetto] + "'></span> " + labelPulsante); pulEffetto.className = ((datiAudio.effetti != Effetto) ? "btn btn-default" : "btn btn-warning");
        pulEffetto.setAttribute('name', 'pulEffetto');
        pulEffetto.dataset.effetto = Effetto;
        pulEffetto.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
        pulEffetto.addEventListener('click', AttivaDisattivaEffetto);
    }
    /***********************************************************************/

    /* Minutaggio */
    tr = CreaElemento('tr', ID_Opzioni + 'TabellaOpzioniRiga1', Tabella.id);
    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneLabel', tr.id, strPosizione); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";
    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneMinutiSecondi', tr.id);
    var SottoTabella = CreaElemento('table', ID_Opzioni + 'SottoTabellaMinutiSecondi', td.id);
    tr = CreaElemento('tr', ID_Opzioni + 'SottoTabellaRiga1', SottoTabella.id);
    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneMinutiLabel', tr.id, strMinuti); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";
    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneVuoto', tr.id);
    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneSecondiLabel', tr.id, strSecondi); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";

    tr = CreaElemento('tr', ID_Opzioni + 'SottoTabellaRiga2', SottoTabella.id);
    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneMinuti', tr.id);
    var M = CreaElemento('input', ID_Opzioni + 'MinutaggioMinuti', td.id); M.setAttribute("type", "number"); M.className = "SelettoreMinutaggioMinuti";
    M.setAttribute("min", "0"); M.setAttribute("max", MinutaggioMassimo.Minuti); M.setAttribute("step", "1");
    M.value = MinutaggioAttuale.Minuti;
    M.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    M.addEventListener("change", function () { SpostaMinutaggioRegistrazione(this.dataset.RiferimentoRegistrazione); });

    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneDivisore', tr.id, ":");

    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneSecondi', tr.id);
    var S = CreaElemento('input', ID_Opzioni + 'MinutaggioSecondi', td.id); S.setAttribute("type", "number"); S.className = "SelettoreMinutaggioSecondi";
    S.setAttribute("min", "0"); S.setAttribute("max", "59.999"); S.setAttribute("step", "0.1");
    S.value = MinutaggioAttuale.Secondi;
    S.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    S.addEventListener("change", function () { SpostaMinutaggioRegistrazione(this.dataset.RiferimentoRegistrazione); });

    /* Effetti */
    td = CreaElemento('td', ID_Opzioni + 'tdOpzioneEffetti', ID_Opzioni + 'TabellaOpzioniRiga1');
    CreaElemento('div', ID_Opzioni + 'labelOpzioneEffetti', td.id, strApplicaUnEffetto);
    CreaPulsanteEffetto('radio', td.id, strEffettoRadio);
    CreaPulsanteEffetto('ovattato', td.id, strEffettoOvattato);
    CreaPulsanteEffetto('echo', td.id, strEffettoEco);
    CreaPulsanteEffetto('riverbero', td.id, strEffettoRiverbero);

    /* Guadagno */
    CreaSlide('Volume', strVolume, 0, 30, 0.01, 0, 3000, 10, "%", evslide_CambiaVolumeClip, evcasella_CambiaVolumeClip, GuadagnoPrincipale[RiferimentoRegistrazione].gain.value);

    /* Tagli iniziali e finali */
    CreaSlide('TaglioIniziale', strTaglioIniziale, 0, LunghezzaRegistrazione, 0.01, 0, LunghezzaRegistrazione, 0.01, 'secondi', ev_CambiaTaglioInizialeClip, ev_CambiaTaglioInizialeClip, datiAudio.taglioIniziale);
    CreaSlide('TaglioFinale', strTaglioFinale, taglioclip_diffmin, LunghezzaRegistrazione, 0.01, taglioclip_diffmin, LunghezzaRegistrazione, 0.01, 'secondi', ev_CambiaTaglioFinaleClip, ev_CambiaTaglioFinaleClip, datiAudio.taglioFinale);

    /* Varie */
    tr = CreaElemento('tr', ID_Opzioni + 'TabellaOpzioniRigaVarie', Tabella.id);
    td = CreaElemento('td', ID_Opzioni + 'tdOpzioneAscoltaClip', tr.id); td.style.width = "150px";
    const btnGroup = CreaElemento('div', ID_Opzioni + 'grpPulAscolta', td.id); btnGroup.className = "btn-group";
    const pulAscolta = CreaElemento('a', ID_Opzioni + 'PulAscolta', btnGroup.id); pulAscolta.dataset.toggle = "dropdown"; pulAscolta.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    PulAscoltaPosizioneDefault(pulAscolta);
    if (!datiAudio.buffer) { pulAscolta.abilita(false); pulAscolta.innerHTML = " <span class='fa fa-spin fa-spinner'></span> " + strCaricamento; CaricaBufferAudio(RiferimentoRegistrazione, () => { if (pulAscolta) { PulAscoltaPosizioneDefault(pulAscolta); pulAscolta.abilita(true); } }); }

    const ulPulAscolta = CreaElemento('ul', ID_Opzioni + 'ulMenuPulAscolta', btnGroup.id); ulPulAscolta.className = "dropdown-menu";
    const liAscoltaSoloTaglio = CreaElemento('li', ID_Opzioni + 'liAscoltaSoloTaglio', ulPulAscolta.id, "<span class='fa fa-exchange'></span> " + strSoloTaglio); liAscoltaSoloTaglio.className = "btn btn-default"; liAscoltaSoloTaglio.onclick = AscoltaInSolo_ParteTagliata;
    const liAscoltaTutto = CreaElemento('li', ID_Opzioni + 'liAscoltaTutto', ulPulAscolta.id, "<span class='fa fa-toggle-right'></span> " + strDaInizioAFine); liAscoltaTutto.className = "btn btn-default"; liAscoltaTutto.onclick = AscoltaInSolo_Tutto;


    td = CreaElemento('td', ID_Opzioni + 'tdOpzioneScaricaClip', tr.id);
    const btnMenuScarica = CreaElemento('div', ID_Opzioni + 'grpMenuScarica', td.id); btnMenuScarica.className = "btn-group";
    const pulScaricaClip = CreaElemento('a', ID_Opzioni + 'pulScaricaClip', btnMenuScarica.id, strScaricaRegistrazione + " <span class='caret'></span>"); pulScaricaClip.className = "btn btn-default btn-sm fa fa-download"; pulScaricaClip.dataset.toggle = "dropdown"; pulScaricaClip.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione; pulScaricaClip.onclick = ApriMenuOpzioniScaricamento;
    const ulPulScarica = CreaElemento('ul', ID_Opzioni + 'ulMenuPulScarica', btnMenuScarica.id); ulPulScarica.className = "dropdown-menu";
    const liScaricaOriginale = CreaElemento('li', ID_Opzioni + 'liScaricaOriginale', ulPulScarica.id, "<span class='fa fa-file-audio-o'></span> " + strScaricaClipOriginale); liScaricaOriginale.className = "btn btn-info"; liScaricaOriginale.onclick = DownloadClipFinestraOpzioni;
    const liScaricaConversione = CreaElemento('li', ID_Opzioni + 'liScaricaConversione', ulPulScarica.id, "<span class='fa fa-tasks'></span> " + strScaricaClipConversione); liScaricaConversione.className = "btn btn-primary"; liScaricaConversione.dataset.larghezza = '850px'; liScaricaConversione.dataset.altezza = '500px'; liScaricaConversione.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione; liScaricaConversione.onclick = DownloadClipConversione;


    /* Commenti */
    var textarea = CreaElemento('textarea', ID_Opzioni + 'textareaCommenti', ID_Opzioni, (SonoCreatoreProgetto ? datiAudio.commentiCreatoreProgetto : datiAudio.commentiDoppiatore));
    textarea.iStyle({ margin: "20px", width: "90%", fontSize: (100 + (50 * SistemaAttualeAndroid)) + "%" });
    textarea.setAttribute('placeholder', (SonoCreatoreProgetto ? strLasciaCommentoAlDoppiatore : strLasciaCommentoAlCreatoreProgetto));

    /** Pulsanti salva e annulla **/
    div = CreaElemento('div', ID_Opzioni + 'PulsantiFinali', ID_Opzioni); div.className = "panel-footer";
    Tabella = CreaElemento('table', ID_Opzioni + 'TabellaPulsantiFinali', div.id); Tabella.className = "TabellaOpzioni"; Tabella.style.width = "100%";
    tr = CreaElemento('tr', ID_Opzioni + 'RigaTabellaPulsantiFinali', Tabella.id);
    td = CreaElemento('td', ID_Opzioni + 'CasellaAnnulla', tr.id);
    const pulAnnulla = CreaElemento('a', ID_Opzioni + 'Annulla', td.id, "<span class='fa fa-times'></span> " + strAnnullalemodifiche); pulAnnulla.className = "btn btn-default";
    pulAnnulla.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    pulAnnulla.addEventListener('click',
        function (e) {
            const Numero = e.currentTarget.dataset.RiferimentoRegistrazione;
            /** Rimette i valori iniziali **/
            /* Minutaggio */
            document.getElementById(ID_Opzioni + 'MinutaggioMinuti').value = minutiprec; document.getElementById(ID_Opzioni + 'MinutaggioSecondi').value = secondiprec;
            SpostaMinutaggioRegistrazione(Numero);

            /* Guadagno */
            CambiaVolumeClip(Numero, Number(guadagnoprec));

            /* Tagli iniziali e finali */
            CambiaTaglioInizialeClip(Numero, taglioinizialeprec);
            CambiaTaglioFinaleClip(Numero, tagliofinaleprec);

            /* Effetti */
            datiAudio.effetti = effettiprec; VisualizzaEffettiAudio(Numero);
            if (datiAudio.audio) { AttivaEffettiAudio(Numero); }

            /** Chiude la finestra **/
            OpzioniClip(Numero, false, false);
        }
    );

    td = CreaElemento('td', ID_Opzioni + 'CasellaSalva', tr.id); td.className = "text-right";
    const pulSalva = CreaElemento('a', ID_Opzioni + 'Salva', td.id, "<span class='fa fa-check'></span> " + strSalva); pulSalva.className = "btn btn-success";
    pulSalva.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    pulSalva.addEventListener('click', function () {
        /* Aggiorna i commenti sulla clip */
        const Numero = this.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero], AutoreCommenti = (SonoCreatoreProgetto ? "CreatoreProgetto" : "Doppiatore"), DestinatarioCommenti = (SonoCreatoreProgetto ? "Doppiatore" : "CreatoreProgetto");
        datiAudio['commenti' + AutoreCommenti] = textarea.value.trim(); datiAudio['commentiVisualizzati' + DestinatarioCommenti] *= (datiAudio['commenti' + AutoreCommenti] == datiAudio['commenti' + AutoreCommenti + "_prec"]);
        VisualizzaCommentiELT(Numero);

        /* Aggiorna la visualizzazione degli effetti audio (si aggiornano in automatico in caso di modifica, ma se rimangono uguali aggiusta la visualizzazione sul taglio iniziale) */
        VisualizzaEffettiAudio(Numero);

        /* Chiude la finestra */
        OpzioniClip(Numero, false, true);
    });

    setTimeout(() => { divContenitoreOpzioni.style.display = "inline"; divContenitoreOpzioni.onmouseenter = DisattivaSpostamentoManualeClip; window.addEventListener('keydown', ScorciatoieTastieraFinestraOpzioni); }, 200);

    if ((VisualizzaSuggerimentiFinestraOpzioni) && (AudioAttivo) && (SistemaOperativoAttuale != "Android")) {
        const ELT = document.getElementById('ELTReg' + RiferimentoRegistrazione);
        const S = [
            { testo: Sugg_OpzioniClip_TrascinamentoClip, stile: 'info', simboloSx: 'fa fa-arrow-up', simboloDx: '', VicinoA: ELT, scostamentoX: '0px', scostamentoY: ELT.offsetHeight + "px" },
            { testo: Sugg_OpzioniClip_SpostamentoMinSec, stile: 'info', simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-clock-o', VicinoA: document.getElementById(ID_Opzioni + 'tdOpzionePosizioneSecondi'), scostamentoX: "5px", scostamentoY: "0px" },
            { testo: Sugg_OpzioniClip_SpiegaPossibilita, stile: 'default', simboloSx: 'fa fa-arrow-up', simboloDx: 'fa fa-arrow-up', VicinoA: divContenitoreOpzioni, scostamentoX: '0px', scostamentoY: '10px' },
            { testo: Sugg_OpzioniClip_ComeCestinareClip, stile: 'danger', simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-undo', VicinoA: document.getElementById('OpzioniTitolo'), scostamentoX: '-350px', scostamentoY: '-40px' },
            { testo: Sugg_OpzioniClip_SalvareOAnnullare, stile: 'success', simboloSx: 'fa fa-check', simboloDx: '', VicinoA: divContenitoreOpzioni, scostamentoX: '0px', scostamentoY: '-15px' }
        ];

        VisualizzaSuggerimentiNuoviDoppiatori(S, 'FinestraOpzioni', () => { VisualizzaSuggerimentiFinestraOpzioni = false; });
    }
}

function OpzioniClip(Numero, Apri, SalvaAllaChiusura) {
    const datiAudio = DatiAudioRegistrato[Numero], IDELT = 'ELTReg' + datiAudio.numero, ELT = document.getElementById(IDELT), ELTContenuto = document.getElementById(IDELT + "Contenuto"), StratoColore = document.getElementById(IDELT + 'StratoColore');

    if (Apri) {
        CreaFinestraOpzioniClip(Numero);
        DisabilitaSchermata();
        ELTContenuto.style.opacity = 1;
        StratoColore.style.transition = "";

    } else {
        const OpzClip = document.getElementById("OpzioniClip");
        window.removeEventListener('keydown', ScorciatoieTastieraFinestraOpzioni);
        StratoColore.style.transition = "all 2s";
        VisualizzaELTNormale(Numero);
        ELTDaSpostare = false; ELT.className = "ELT transizione-morbida-si";
        if (document.getElementById('OpzioniClipPulAscolta').className.indexOf('warning') > -1) { datiAudio.audio.onended = ""; StoppaClipAudio(datiAudio); } // L'eliminazione della funzione "onended" serve per evitare che si intercetti l'evento allo stop della registrazione
        if (SalvaAllaChiusura) {
            SalvaModificheClipAudio(Numero);
            AggiornaRiproduzioneClip(Numero);
        }

        OpzClip.parentNode.removeChild(OpzClip);
        RiabilitaSchermata();
        /* tmrRitornoDisposizioneOriginaleELT = setTimeout(PosizioneOriginaleClipSovrapposte, 6000); */
    }

    ELT.children[0].style.borderStyle = (Apri ? "ridge" : "dotted");
    Righello.dataset.DisattivaClick = (Apri ? "si" : "no");

    console.log("OpzioniClip", Numero, Apri);
}

function ScorciatoieTastieraFinestraOpzioni(Tasto) {
    if (document.activeElement.tagName == "TEXTAREA") { return; }

    switch (Tasto.key) {
        case "Escape": document.getElementById("OpzioniClipAnnulla").click(); break;                         // [ESC]
        case "Enter": setTimeout(() => { document.getElementById("OpzioniClipSalva").click(); }, 200); break;  // [INVIO] il timeout permette di soddisfare gli altri eventi prima di salvare
    }
}

function SpostaELT(e) {
    try {
        const X = e.clientX + window.scrollX;
        var MinutaggioNuovo = (X - ContenitoreRighello.offsetLeft - ELTDaSpostare.dataset.posizionedelmouse) * totDurataVideoGuida / (Righello.clientWidth * (DimensioneRighello / 100));
        SpostaMinutaggioRegistrazione(ELTDaSpostare.dataset.RiferimentoRegistrazione, MinutaggioNuovo);
    } catch (e) { }
}

/** Ascolto in singolo **/
function PulAscoltaPosizioneDefault(p) {
    p.className = "btn btn-default btn-sm dropdown-toggle fa fa-play-circle";
    p.innerHTML = " " + strAscoltaClip + " <span class='caret'></span>";
    p.onclick = ApriMenuOpzioniAscolto;
}

function ResettaPulAscolta(p) {
    if (p) {
        PulAscoltaPosizioneDefault(p);
        StoppaClipAudio(DatiAudioRegistrato[p.dataset.RiferimentoRegistrazione]);
    }
}

function ApriMenuOpzioniAscolto() {
    ApriChiudiMenu(ID_Opzioni + 'ulMenuPulAscolta', true);
}

function ChiudiMenuOpzioniAscolto() {
    ApriChiudiMenu(ID_Opzioni + 'ulMenuPulAscolta', false);
}

function AscoltaInSolo_ParteTagliata() {
    const IDELT_Opzioni = "OpzioniClipTabellaOpzioniRigaTaglio";
    AscoltaInSolo(document.getElementById(IDELT_Opzioni + "InizialeSlide").value, document.getElementById(IDELT_Opzioni + "FinaleSlide").value);
    ChiudiMenuOpzioniAscolto();
}

function AscoltaInSolo_Tutto() {
    AscoltaInSolo(0);
    ChiudiMenuOpzioniAscolto();
}

function AscoltaInSolo(Inizio, Fine) {
    const p = document.getElementById(ID_Opzioni + 'PulAscolta'), Numero = p.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero];
    if (!Fine) { Fine = datiAudio.Durata; }
    StoppaClipAudio(datiAudio);
    CreaClipAudio(Numero);
    ClipDaRiprodurre.forEach(function (I, N) { if (I == datiAudio.numero) { delete ClipDaRiprodurre[N]; } }); // Evita di incorrere in errore se durante la riproduzione la clip viene nuovamente avviata da RiproduciClipInSync()
    datiAudio.audio.start(0, Inizio, Fine - Inizio);
    datiAudio.avviato = true;
    p.className = "btn btn-warning btn-sm fa fa-stop"; p.innerText = " " + strInterrompiAscolto;
    p.onclick = StoppaAscoltoInSolo;
    datiAudio.audio.onended = StoppaAscoltoInSolo;
}

function StoppaAscoltoInSolo() {
    ResettaPulAscolta(document.getElementById('OpzioniClipPulAscolta'));
}
/********************************/

function AggiornaRiproduzioneClip(Numero) {
    if (RiproduzioneInCorso) {
        StoppaClipAudio(DatiAudioRegistrato[Numero]); VerificaClipDaRiprodurre(Numero, VideoGuidaMinutaggioCorrente()); FunzioneRiproduzioneClip = RiproduciClipInSync;
    }
}

/** Opzioni scaricamento **/
function ApriMenuOpzioniScaricamento() {
    ApriChiudiMenu(ID_Opzioni + 'ulMenuPulScarica', true);
}

function ChiudiMenuOpzioniScaricamento() {
    ApriChiudiMenu(ID_Opzioni + 'ulMenuPulScarica', false);
}

function DownloadClipFinestraOpzioni() {
    Download(document.getElementById(ID_Opzioni + 'pulScaricaClip').dataset.RiferimentoRegistrazione);
    ChiudiMenuOpzioniScaricamento();
}

function DownloadClipConversione(e) {
    const liScaricaConversione = e.currentTarget, Numero = liScaricaConversione.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero];
    liScaricaConversione.dataset.link = `RenderingAudio/Rendering/Rendering.php?N=${N}&P=${P}&ID=${datiAudio.ID_Utente}&IDClip=${datiAudio.NumeroUnivoco}&PropPers=1&Guadagno=${GuadagnoPrincipale[Numero].gain.value}&TaglioIniziale=${datiAudio.taglioIniziale}&TaglioFinale=${datiAudio.taglioFinale}&Effetti=${encodeURIComponent(datiAudio.effetti)}`;
    ApriFinestra(e);
    ChiudiMenuOpzioniScaricamento();
}
/***********************************************************************************/

function ApriChiudiMenu(ID_Menu, Apri) {
    const Menu = document.getElementById(ID_Menu), display = (Menu.style.display || "none");

    Menu.style.display = ((Apri && (display == "none")) ? "inline" : "none");
}

/*** Gestione Post Message dalla Chat ***/
window.addEventListener("message", (e) => {
    if ((e.origin !== "https://wedub.altervista.org") || (StoRegistrando) || (Righello.dataset.DisattivaClick == "si")) { return; }

    var Dati = e.data;
    if (typeof Dati.progetto == 'undefined') { return; }
    if (Dati.progetto != N) { alert(str_messaggifinestrelle_MessaggioDiAltroProgetto); return; }

    switch (Dati.tipo) {
        case 'minutaggio':
            MinutaggioIndicato = (Dati.minuti * 60) + Number(Dati.secondi);
            if ((MinutaggioIndicato != parseInt(VideoGuidaMinutaggioCorrente())) && (MinutaggioIndicato < totDurataVideoGuida)) { Posizionati(MinutaggioIndicato); } break;
    }

}, false);
/****************************************/

function NascondiVisualizzaAltreTracce(Visualizzazione) {
    for (var I = 1; I < NumeroTotaleTracce; I++) {
        document.getElementById('Traccia' + I).style.display = Visualizzazione; document.getElementById('NomeTraccia' + I).style.display = Visualizzazione;
    }

    VariaAltezzaTraccia(0, parseFloat(document.getElementById('Traccia0').style.height));
}

/*** Gestione scorciatoie di tastiera ***/
function ScorciatoieTastiera(Tasto) {
    if (['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) { return; }
    var TastoPremuto = "", SpiegazioneTasto = "";

    switch (Tasto.code) {
        case "Space": Tasto.preventDefault(); PlayPausa(); // [SPAZIO]
        default: return;
        case "KeyR": if (pulPlay.disabled || pulRegistra.disabled) { return; }
            startRecording(); TastoPremuto = "R"; SpiegazioneTasto = strSpiegazioneTastoRegistra; break; // [R]
        case "KeyZ": ZPremuto = true; TastoPremuto = "Z"; SpiegazioneTasto = strSpiegazioneTastoZoom; break;                    // [Z]
        case "KeyX": CambiaTool(toolDividiClip); TastoPremuto = "X"; SpiegazioneTasto = strSpiegazioneTastoDividiClip; break;   // [X]
        case "KeyM": CambiaTool(toolEscludiClip); TastoPremuto = "M"; SpiegazioneTasto = strSpiegazioneTastoEscludiClip; break; // [M]
        case "KeyS": TastoPremuto = "S";                                                                                        // [S]
        case "KeyG": CambiaTool(toolStandard); TastoPremuto += "G"; TastoPremuto = TastoPremuto.slice(0, 1); SpiegazioneTasto = strSpiegazioneTastoSeleziona; break; // [G]

        case "ShiftRight": if (pulMessaggioVocale.style.pointerEvents == "auto") { RegistraMessaggioVocale_slow(); TastoPremuto = "Shift " + strDestro; SpiegazioneTasto = strSpiegazioneTastoRegistraMessaggioIstantaneo; } else { return; } break;  // [Shift destro]
    }

    Messaggio(strHaiPremuto + " <a class='btn btn-info'>" + TastoPremuto + "</a>: " + SpiegazioneTasto, "OK");
}

function ScorciatoieDiTastiera_Registrazione(Tasto) {
    switch (Tasto.code) {
        case "Escape":                                    // [ESC]
        case "Delete": AnnullaRegistrazione(); break;     // [CANC]
        case "Space": Tasto.preventDefault(); stopRecording(); break; // [SPAZIO]
    }
}

function ScorciatoieTastiera_ModalitaStreaming(Tasto) {
    switch (Tasto.code) {
        case "Space": Tasto.preventDefault(); PlayPausa(); // [SPAZIO]
        default: return;
    }
}

function ScorciatoieTastiera_TastiSollevati(Tasto) {
    switch (Tasto.code) {
        case "KeyZ": ZPremuto = false; CancMex(); break;   // [Z]
        case "ShiftRight": if (pulMessaggioVocale.style.pointerEvents == "auto") { MandaMessaggioVocale(); } break;  // [Shift destro]
    }
}

function GestisciMouseDown(e) {
    if (e.button == 1) {
        e.stopPropagation(); GestisciMouseDown.MouseX = e.clientX; GestisciMouseDown.MouseY = e.clientY;
        Righello.style.cursor = "grabbing";
        ContenitoreLineaTemporale.onmousemove = (m) => { window.scrollBy(GestisciMouseDown.MouseX - m.clientX, GestisciMouseDown.MouseY - m.clientY); GestisciMouseDown.MouseX = m.clientX; GestisciMouseDown.MouseY = m.clientY; };
    }
}
GestisciMouseDown.MouseX = 0; GestisciMouseDown.MouseY = 0;

function GestisciMouseUp(e) {
    Righello.style.cursor = "";
    ContenitoreLineaTemporale.onmousemove = null;
}

function GestisciRotellinaMouse(Rotellina) {
    if (ZPremuto) {
        Rotellina.preventDefault();
        const slideZoom = document.getElementById('Zoom'), zoomprecedente = slideZoom.value;
        slideZoom.value -= 20 - (40 * (Rotellina.deltaY < 0));
        if (zoomprecedente != slideZoom.value) { CambiaZoom(); }
    }
}
/****************************************/

function VideoGuidaPronto() {
    if (ModalitaLightAttiva) { NascondiVisualizzaAltreTracce("none"); }

    SistemaAttualeAndroid = (SistemaOperativoAttuale == "Android");

    if (NotificaMessaggi) { NotificaMessaggi(); }

    if (!BrowserOK) { document.getElementById('MsgCaricamentoIniziale').innerHTML = strBrowserNonAdatto; document.getElementById('imgAttesaIniziale').className = ""; clearInterval(tmrCaricamento); setTimeout(() => { const M = document.getElementById('MessaggiIniziali'); M.innerHTML = strBrowserNonAdatto; M.style.color = "blue"; }, 5000); return; }

    console.log("controllo browser superato", VersioneJS, NomeBrowserAttuale, VersioneBrowserAttuale);
    if (!ModalitaStreaming) {
        var Stringa = "";
        if (SessioneOspite) { Stringa = ((Provino || ProgettoCompletato) ? strModalitaVisualizzazione + "<br />" : strNonHaiNessunRuolo + "<br />" + (!SonoCreatoreProgetto ? strPuoiSoloVisualizzare : "")); }

        Stringa += (ModalitaUltraLightAttiva ? "<p><b>" + strModalitaUltraLightAttiva + "</b></p>" : (ModalitaLightAttiva ? "<p>" + strModalitaLightAttiva + "</p>" : ""));

        if (SolaVisione && !SonoCreatoreProgetto) {
            SelezioneMicrofono.style.display = "none";
        } else {
            audioContext.audioWorklet.addModule(percorsoAudioWorklet).then(AggiornaElencoDispositivi);
        }

        Stringa += (SonoCreatoreProgetto ? "<span style='font-size: 13px; font-weight: bold; font-style: italic;'>" + strPoteriCreatoreProgetto + "</span>" : "");
        document.getElementById('MessaggiUlteriori').innerHTML = Stringa;
    }

    document.getElementById('MsgCaricamentoIniziale').innerHTML = strAttendereFineCaricamento;

    setTimeout(() => { VideoGuidaCaricaEAvvia(PercorsoVideoGuida); ImpostaVolumeVideoGuida(0); VideoGuidaImpostaEventoPrimoCaricamento(AttivaProgramma); }, 500);
}

window.setTimeout(CaricamentoVideo, 2000); tmrCaricamento = window.setInterval(CaricamentoVideo, 10000);