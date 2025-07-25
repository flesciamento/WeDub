const ContenitoreVideoGuida = document.getElementById('ContenitoreVideoGuida');
const ContenitoreLineaTemporale = document.getElementById('Contenitore');
const ContenitoreRighello = document.getElementById('ContenitoreRighello');
const Monitors = document.getElementById('Monitors');
const ContenitorePannelloSx = document.getElementById('ContenitorePannelloSx');
const ContenitorePannelloDx = document.getElementById('ContenitorePannelloDx');
const ComandiPlayer = document.getElementById('ComandiPlayer');
const pulRegistra = document.getElementById('Registra');
const imgRegistra = document.getElementById('imgRegistra');
const TestoPulRegistra = document.getElementById('TestoPulRegistra');
const pulStopRegistrazione = document.getElementById('StopRegistrazione');
const pulAnnullaRegistrazione = document.getElementById('AnnullaRegistrazione');
const pulPlay = document.getElementById('Play');
const imgPlayPausa = document.getElementById('imgPlay');
var pulPlayInSovrimpressione = document.getElementById('PlayInSovrimpressione'); // var per consentire di determinare il play della finestra corrente
const Cursore = document.getElementById('Cursore'), CursoreAnteprima = document.getElementById('CursoreAnteprima');
const ContenitorePulMessaggioVocale = document.getElementById('ContenitorePulMessaggioVocale'), didascaliaMessaggioVocale = document.getElementById('didascaliaMessaggioVocale'), pulMessaggioVocale = document.getElementById('pulMessaggioVocale'), selUtenteMessaggioVocale = document.getElementById('selUtenteMessaggioVocale');
const BC = document.getElementById('ProgressoCaricamento'), ContornoBC = document.getElementById('BarraProgressoCaricamento');

const lblVolumeVideoGuida = document.getElementById('lblVolumeVideoGuida');
const slideVolumeVideoGuida = document.getElementById('VolumeVideoGuida');
var MinutaggioMinuti = document.getElementById('MinutaggioMinuti'), MinutaggioSecondi = document.getElementById('MinutaggioSecondi'); // var per consentire di richiamarli anche dalle finestre figlie
const divContenitoreSlideMinutaggio = document.getElementById('divContenitoreSlideMinutaggio');
var ControlliInSovrimpressione = document.getElementById('ControlliInSovrimpressione'); // var per consentire di richiamarli anche dalle finestre figlie
const slideZoom = document.getElementById('Zoom');
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
const divContenitoreNotifiche = document.getElementById('divContenitoreNotifiche');
const ContenitoreStrumenti = document.getElementById('fieldsetContenitoreStrumenti');
const divVetro = document.getElementById('Vetro');

const divSelettoreMicrofono = document.getElementById('divSelettoreMicrofono');
const divOpzioniRegistrazione = document.getElementById('OpzioniRegistrazione');
const livelloMic = document.getElementById('divLivelloMic');
const opzTagliaSilenzi = document.getElementById('opzTagliaSilenzi');
const pulMonitorMic = document.getElementById('pulMonitorMic');

const simboloEffetto = {'radio': "fa-bullhorn", 'ovattato': "fa-cloud", 'echo': "fa-bullseye", 'riverbero': "fa-rss"};
const riquadroSimboloEffettoELT = 'btn btn-info btn-sm fa ';
const simboloEffettoELT = {'': "", 'radio': riquadroSimboloEffettoELT + simboloEffetto.radio, 'ovattato': riquadroSimboloEffettoELT + simboloEffetto.ovattato, 'echo': riquadroSimboloEffettoELT + simboloEffetto.echo, 'riverbero': riquadroSimboloEffettoELT + simboloEffetto.riverbero};

const Provino = (TipoProgetto == 'Provino');

const ID_Opzioni = 'OpzioniClip';

const formatoQualitaAlta = "flac", formatoQualitaMedia = "ogg";

const toolStandard = 0, toolDividiClip = 1, toolEscludiClip = 2, toolMarcatore = 3, puntatoreTool = ["pointer", "url(images/CursoreMouseLineaTemporale_toolDividiClip.png) 8 0, auto", "url(images/CursoreMouseLineaTemporale_toolEscludiClip.png) 8 0, auto", "url(images/CursoreMouseLineaTemporale_toolMarcatore.png) 8 0, auto"], scorciatoieTool = ["KeyG", "KeyX", "KeyM", "KeyF"];

/** @type {MediaStreamAudioSourceNode} la sorgente audio selezionata (il microfono) **/
var sorgenteAudioSelezionata = false;
/** @type {AudioWorkletNode} il processo personalizzato di analisi e registrazione audio in RAW **/
var registrazione = false, canaleAudio = [], LunghezzaNuovaRegistrazione = 0, QualitaAltaRegistrazione = true;
/** @type {MediaRecorder} il processo di registrazione audio del browser **/
var regMediaRecorder = false, recordedBlobs = [];
/** @type {AnalyserNode} serve ad analizzare e poi rappresentare l'onda sonora **/
var analizzatoreAudio = false, audioAnalizzato = [], CanvasOnda, canvasCtx;
var ErroreMicrofono = false;
var lunghezzaLivelloMic = 0;
var sampleAudioData;
var DatiAudioRegistrato = [], DatiAudioRegistrato_Registrazione = {}, DatiAudioRegistrato_Utente = {}, ClipDaRiprodurre = [], ClipInCiclo = false;
var AudioBufferColonnaInternazionale = [], ColonnaInternazionaleAttivata = false, SpezzoniAudioCI = [], TracciaCI, OpzioneAutoCI = false;
var MinutaggioPartenzaRegistrazione = 0, MinutaggioUltimaRegistrazione = 0, DurataUltimaRegistrazione = 0;
var MessaggiIstantaneiAttivi = false, MessaggioIstantaneoInRiproduzione = false;
var ELTDaSpostare = false, ELTCliccato = false, ELTDaModificare = [];
var StrumentoMouse = 0;
var RiproduzioneInCorso = false;
var MinutaggioPrecaricamentoClip = 0, FunzioneAlTerminePrecaricamento = false, totClipDaPrecaricare = 0, ContatoreClipPrecaricate = 0, intervalloControllaClipPrecaricate;
var StoRegistrando = false;
var EffettuatoAutoTaglioIniziale = false, SecondiAutoTaglioIniziale = 0;
var NonChiudereFinestra = false;
var totClipAudioCaricate = 0;
var totDurataVideoGuida = 0;
var DimensioneRighello = 100;
var AltezzaComandiPlayer = 0, AltezzaTracce = 0, AltezzaTracceMinima, AltezzaTracceMassima;
var TracciaDaRidimensionare = false, AltezzaMinimaTraccia = 0, LimiteMinimoTracciaDaRidimensionare = 0;
var WindowScrollY_Iniziale = 0;
var TracceEscluse = [];
var RuoliDaAssegnare_CandidatoSelezionato = "RuoliDaAssegnare";
var FunzioneNormaleAlTimeUpdate, FunzioneRiproduzioneClip;
var UtentiAttivi = [], UtentiAttiviOltreMe = [];
var SolaVisione = SessioneOspite;
var SistemaAttualeAndroid = false;
var currentTimeIniziale = 0, orarioIniziale = 0;
var ContenitoreCopione = window;

var tmrCaricamento, tmrImmagineAttesa, tmrContoAllaRovescia, tmrAggiornaClip, tmrRidisegnaRighello, tmrPulsanteStopRegistrazione, tmrRitardoScorrimentoCursore, tmrLampeggiaCestino = [], tmrELTCliccato, tmrRiposizionamentoAutomaticoELT, tmrRitornoDisposizioneOriginaleELT, tmrVisualizzaElencoCandidati, tmrAggiornaChatCandidato = false, tmrAggiornaNotificheCandidatiRuoliDaAssegnare, tmrRidimensionamentoElementi, tmrComandiPlayerModalitaStreaming;

var GuadagnoPrincipale = [], FiltroBandaAR = [], GuadagnoDelay1 = [], EffettoDelay1 = [], GuadagnoDelay2 = [], EffettoDelay2 = [], GuadagnoDelay3 = [], EffettoDelay3 = [];

var LatenzaAudio = 0;

var ev_cambiamento = new Event('change');

var ControlPremuto = false;

pulRegistra.addEventListener('click', toggleRecording);
pulStopRegistrazione.addEventListener('click', stopRecording);
pulAnnullaRegistrazione.addEventListener('click', AnnullaRegistrazione);


/*** Verifiche compatibilità browser ***/
try {
    audioContext = new AudioContext();
} catch (err) {
    alert(strWebAudioAPINonSupportata);
}
/***************************************/

var ingressi = {};

var MinutaggiRighello = {
	Disegna: async function () {
        const StepRighello = Math.floor(50 * totDurataVideoGuida / divMinutaggiRighello.clientWidth) + 1; /* console.log("StepRighello", this.StepRighello, Righello.clientWidth, totDurataVideoGuida); */
        const LunghezzaRighello = totDurataVideoGuida - StepRighello;
		const DurataTotale = new MinutiESecondi(totDurataVideoGuida);
		MinutaggioMinuti.max = DurataTotale.Minuti;

        var Contatore = 0;
		for (var I = InizioVideoGuida; I < LunghezzaRighello; I += StepRighello) {
			const Minutaggio = new MinutiESecondi(I);
            divMinutaggiRighello.insertAdjacentHTML('beforeend', `<span class='MinutaggioRighello' style="left: ${(I / totDurataVideoGuida) * 100}%;"><span class='fa fa-minus MinutaggioRighello-barra'></span>&nbsp;${Minutaggio.Minuti}:${Minutaggio.Secondi.toFixed(0).padStart(2, "0")}</span>`);
            (((++Contatore % 500) == 0) && await pausa(100));
		}
    },
    
    Cancella: function () {
        divMinutaggiRighello.textContent = "";
    },

	Ridisegna: function () {
        this.Cancella();
		this.Disegna();
	}
};

/*** Zoom e affini ***/
function CambiaZoom() {
    const DimensioneRighelloPrec = DimensioneRighello;
    DimensioneRighello = slideZoom.value;
    clearTimeout(tmrRidisegnaRighello); clearTimeout(tmrRitardoScorrimentoCursore);

    CambiaDimensioneContenitoreTracce();
    SeguiCursore();
    if (+DimensioneRighelloPrec > +DimensioneRighello) {MinutaggiRighello.Cancella();}
    tmrRidisegnaRighello = setTimeout(() => {MinutaggiRighello.Ridisegna(); CompattaMarcatori();}, 1000);
    slideZoom.blur(); // permette di continuare ad utilizzare i comandi da tastiera
}

function CambiaDimensioneContenitoreTracce() {
    ['ContenutoTracce', 'MinutaggiRighello'].forEach(CambiaDimensione);
}

function CambiaDimensione(ID) {
	document.getElementById(ID).style.width = DimensioneRighello + "%";
}

slideZoom.addEventListener('change', CambiaZoom);
/*********************/

/*** Mantiene fissi gli elementi principali ***/
window.addEventListener('scroll', PosizionaElementiScroll);

function PosizionaElementiScroll() {
    divMinutaggiRighello.style.top = window.scrollY + "px"; divMinutaggiRighello.style.zIndex = 1000 * (window.scrollY > 0);
    Cursore.style.top = window.scrollY + "px"; CursoreAnteprima.style.top = Cursore.style.top;
    document.getElementById('NomiTracce').style.top = ((+ContenitoreLineaTemporale.offsetTop) + 15 - window.scrollY) + "px";
}
/**********************************************/

function OpacitaRighello(LivelloOpacita) {
	const divOpacitaTraccia = document.getElementsByName('divOpacitaTraccia'), totDivOpacitatraccia = divOpacitaTraccia.length, proprietaBackgroundColor = coloreOpacitaTraccia + (1 - LivelloOpacita).toString() + ")";
    for (let I = 0; I < totDivOpacitatraccia; I++) {
        divOpacitaTraccia[I].style.backgroundColor = proprietaBackgroundColor;
    }
}

divContenitoreNotifiche.onmouseenter = () => {divContenitoreNotifiche.iStyle({opacity: 0.3, pointerEvents: "none"}); setTimeout(() => {divContenitoreNotifiche.iStyle({opacity: '', pointerEvents: ""});}, 2000);};

function AdattaLunghezzaLivelloMic() {
    lunghezzaLivelloMic = divSelettoreMicrofono.offsetWidth;
    livelloMic.style.backgroundSize = lunghezzaLivelloMic + "px 100%";
}

/*** Per i vari pulsanti dei pannelli sinistro e destro, lascia la sola icona se lo spazio non basta ***/
function AdattaDimensionePulsanti() {
    const CondizioneStandardCompressionePulsanti = (window.innerWidth < 1450);
    const pulsantiDx = document.querySelectorAll('#ContenitorePannelloDx > .btn'), totPulsantiDx = pulsantiDx.length;
    const ClassePulsanteDx = (CondizioneStandardCompressionePulsanti ? "btn-scritta-a-comparsa" : "");
    for(I = 0; I < totPulsantiDx; I++) {
        pulsantiDx[I].children[1].className = ClassePulsanteDx;
    }

    const PulsantiTool = document.getElementsByName('pul_tool'), totPulsantiTool = PulsantiTool.length;
    const ClassePulsanteTool = (CondizioneStandardCompressionePulsanti ? "btn-scritta-a-comparsa" : "");
    for (let I = 0; I < totPulsantiTool; I++) {
        PulsantiTool[I].children[1].className = ClassePulsanteTool;
    }
}
/*******************************************************************************************************/

/*** Adatta i vari elementi in base alla grandezza della finestra, eventualmente adatta anche l'altezza delle tracce per evitare che il video copra i comandi del player ***/
function AutoAdattaElementiInterfaccia() {
    ScorrimentoCursore.distanzaMinimaDalBordo = (window.innerWidth / ScorrimentoCursore.frazioneLineaTemporale) | 0;
    
    const AltezzaPannelloSx = ContenitorePannelloSx.offsetHeight, AltezzaPannelloDx = (+ContenitorePannelloDx.offsetTop) + (+ContenitorePannelloDx.offsetHeight), OverflowPannelloSx = (AltezzaPannelloSx > Monitors.offsetHeight), OverflowPannelloDx = (AltezzaPannelloDx > Monitors.offsetHeight);
    if ((OverflowPannelloSx || OverflowPannelloDx) && (pulSchermoIntero.dataset.schermointero == "no")) {AltezzaTracce = ((AltezzaPannelloSx > AltezzaPannelloDx) ? AltezzaPannelloSx : AltezzaPannelloDx); VariaAltezzaTracce();} else {PosizionaElementiScroll(); AdattaDimensionePulsanti();}
}
/***************************************************************************************************************************************************************************/

/*** Operazioni al ridimensionamento della finestra ***/
function Ridisegna() {
    if ((Math.abs(window.innerHeight - Ridisegna.dimensionePrecedente.altezza) < diffMinimaRidimensionaFinestra) || (Math.abs(window.innerWidth - Ridisegna.dimensionePrecedente.larghezza) < diffMinimaRidimensionaFinestra)) {return;}

    clearTimeout(tmrRidimensionamentoElementi);
    tmrRidimensionamentoElementi = setTimeout(() => {
        MinutaggiRighello.Ridisegna();
        AdattaLunghezzaLivelloMic();
        if (RidimensionaVideo) {RidimensionaVideo();}
        AutoAdattaElementiInterfaccia();
        SeguiCursore();
        CompattaMarcatori();
        Ridisegna.dimensionePrecedente = {altezza: window.innerHeight, larghezza: window.innerWidth};
    }, 500);
}
Ridisegna.dimensionePrecedente = {altezza: window.innerHeight, larghezza: window.innerWidth};

window.addEventListener('resize', Ridisegna);
/******************************************************/

/*** Strumento di variazione posizione Y delle tracce ***/
function CliccatoVariazioneAltezzaTracce() {
    document.body.addEventListener('mousemove', SegnaVariazioneAltezzaTracce);
    document.body.addEventListener('mousedown', VariaAltezzaTracce);

    pulVariaAltezzaTracce.className = pulVariaAltezzaTracce.className.replace('default', 'warning');

    RideterminaLimitiAltezzaTracce();
    
    divVetro.iStyle({display: "inline", opacity: 1});
    CreaElemento('div', 'indicatoreVariazioneAltezzaTracce', divVetro.id).iStyle({position: "absolute", width: "100%", top: ((+AltezzaTracce) + (+AltezzaComandiPlayer)) + "px", borderTop: "5px dashed blue"});
}

function SegnaVariazioneAltezzaTracce(e) {
    const Y = e.clientY, AltezzaIndicata = Y, CondizioneSogliaMinima = (AltezzaIndicata > AltezzaTracceMinima), CondizioneSogliaMassima = (AltezzaIndicata < AltezzaTracceMassima);

    const NuovaAltezzaTracce = (+AltezzaIndicata * CondizioneSogliaMinima * CondizioneSogliaMassima) + (+AltezzaTracceMinima * !CondizioneSogliaMinima) + (+AltezzaTracceMassima * !CondizioneSogliaMassima);
    AltezzaTracce = NuovaAltezzaTracce - AltezzaComandiPlayer;

    document.getElementById('indicatoreVariazioneAltezzaTracce').style.top = NuovaAltezzaTracce + "px";
}

function VariaAltezzaTracce() {
    const percAltezzaTracce = (AltezzaTracce / window.innerHeight * 100) + "%";

    document.body.removeEventListener('mousemove', SegnaVariazioneAltezzaTracce); document.body.removeEventListener('mousedown', VariaAltezzaTracce);

    EliminaElemento(document.getElementById('indicatoreVariazioneAltezzaTracce')); divVetro.style.display = "none";

    ContenitoreLineaTemporale.style.top = `calc(${percAltezzaTracce} + ${AltezzaComandiPlayer}px)`;
    divContenutoTracce.style.height = `calc(100% - ${AltezzaComandiPlayer}px)`;
    if (UnitaDiMisura == "%") {const NuovaAltezzaTracciaPerc = "calc(100% - " + percAltezzaTracce + ")"; ContenitoreLineaTemporale.style.height = NuovaAltezzaTracciaPerc; document.getElementById('NomiTracce').style.height = NuovaAltezzaTracciaPerc;}
    Monitors.style.height = percAltezzaTracce;
    ComandiPlayer.style.top = percAltezzaTracce;
    
    PosizionaElementiScroll();

    pulVariaAltezzaTracce.className = pulVariaAltezzaTracce.className.replace('warning', 'default');
    setTimeout(() => {if (RidimensionaVideo) {RidimensionaVideo();} AutoAdattaElementiInterfaccia();}, 1000);
}

function RideterminaLimitiAltezzaTracce() {
    AltezzaTracceMinima = (+window.innerHeight * (0.4 - (0.3 * (FinestraVideoGuida != window)))); AltezzaTracceMassima = window.innerHeight - SuddivisioneTracce - 25;
}
/********************************************************/

function CaricamentoVideo() {
	const Colore = new Array("blue", "brown", "green", "blue", "red");
	const MessaggiIniziali = document.getElementById('MessaggiIniziali'), vMessaggiAttesa = (ModalitaStreaming? strAttesaStreaming : (SolaVisione? strAttesaOspite : (SistemaAttualeAndroid? strAttesaAndroid : strAttesa)));

	MessaggiIniziali.style.color = Colore[CaricamentoVideo.MessaggioCorrente]; MessaggiIniziali.innerHTML = ((SolaVisione || ModalitaStreaming) ? "" : "<i>" + strConsiglio + "</i>: ") + vMessaggiAttesa[CaricamentoVideo.MessaggioCorrente];
	if (CaricamentoVideo.MessaggioCorrente == vMessaggiAttesa.length - 1) { Monitors.style.opacity = 0.8; } // Visualizza il video nel caso ci siano problemi

	CaricamentoVideo.MessaggioCorrente = ++CaricamentoVideo.MessaggioCorrente * (CaricamentoVideo.MessaggioCorrente < vMessaggiAttesa.length);
}
CaricamentoVideo.MessaggioCorrente = 0;

function AttivaProgramma() {
    VideoGuidaRimuoviEventoAlTermineCaricamento(AttivaProgramma);
    const DurataTotaleVideoGuida = VideoGuidaDurataTotale();
    totDurataVideoGuida = (((FineVideoGuida > InizioVideoGuida) && (FineVideoGuida < DurataTotaleVideoGuida)) ? FineVideoGuida : DurataTotaleVideoGuida);

    /*** Visualizzazione ***/
    if (!ModalitaStreaming) {
        DisattivaMessaggiAttesa();
        ContenitoreLineaTemporale.style.display = "block";
        document.getElementById('VideoGuida').style.pointerEvents = "none";
        DisabilitaSchermata();
        MinutaggiRighello.Disegna();
        slideZoom.setAttribute('max', (totDurataVideoGuida * 5) | 0);
        [MinutaggioMinuti, MinutaggioSecondi].forEach(input => FunzioniCasellaNumerica(input));
        if (SessioneOspite && SonoCreatoreProgetto) {document.getElementById('OpzioniDoppiaggio_Registrazione').append(divSelettoreMicrofono, divOpzioniRegistrazione);} // Sposta le opzioni del microfono tra le opzioni del player se siamo il creatore del progetto non doppiatore
        setTimeout(() => {
            /* Adatta la dimensione degli elementi in base al contenuto e allo spazio a disposizione */
            RideterminaLimitiAltezzaTracce();
            AltezzaTracce = window.innerHeight * 0.4;
            
            if (UnitaDiMisura == "px") {AdattaAltezzaTraccia(0);}
            if (RuoliDaAssegnare_NumeroTraccia !== false) {AdattaAltezzaTracciaRuoliDaAssegnare();}
            if (OrientamentoSchermoOrizzontale()) {
                if (NumeroTotaleTracce == 1) {
                    AltezzaTracce = window.innerHeight * 0.6; 
                } else {
                    if (!SonoCreatoreProgetto && !SessioneOspite) {NuovaAltezzaTracce = window.innerHeight - NomiTracce.children[0].offsetHeight - 200; AltezzaTracce = ((NuovaAltezzaTracce > AltezzaTracce) ? NuovaAltezzaTracce : AltezzaTracce);}
                }
            }
            AdattaAltezzaContenitoreTracce();
            VariaAltezzaTracce();
            AdattaLunghezzaLivelloMic();
        }, 1000);
        if (VisualizzaSuggerimenti) {setTimeout(VisualizzaSuggerimentiNuoviDoppiatori, 2000, SuggerimentiIniziali);}
        if (VisualizzaSuggerimentiRuoliDaAssegnare) {setTimeout(VisualizzaSuggerimentiNuoviDoppiatori, 10000, SuggerimentiRuoliDaAssegnare, 'RuoliDaAssegnare');}
        setTimeout(() => {document.getElementById('LogoWEDUB').iStyle({top: 0, right: 0, width: larghezzaLogo});}, 1000);

    } else {
        Monitors.style.opacity = 0.6;
        divVetro.style.opacity = 1;
        const pulSchermoInteroVetro = CreaElemento('div', 'pulSchermoInteroSuVetro', divVetro.id, "<span class='fa fa-desktop'></span> " + strVisualizzaASchermoIntero);
              pulSchermoInteroVetro.iStyle({position: "fixed", bottom: "10%", right: "10%"}); pulSchermoInteroVetro.className = "btn btn-default btn-lg";
              pulSchermoInteroVetro.onclick = (e) => {document.getElementById('pulSchermoIntero').click(); EliminaElemento(e.currentTarget);};
    }

    divVetro.style.display = "inline";
    slideMinutaggioAttuale.setAttribute('max', totDurataVideoGuida); slideMinutaggioAttuale.style.display = "";
    ComandiPlayer.style.display = "block";
    AltezzaComandiPlayer = ComandiPlayer.offsetHeight;
	/***********************/

    setTimeout(() => {
        const vol = ((Provino && SessioneOspite) ? 0 : 1);
        VideoGuidaPause(); ImpostaStatoPlay(false);
        ImpostaVolumeVideoGuida(vol);
        if (RidimensionaVideo) {setTimeout(RidimensionaVideo, 1000);}
        if ((!ModalitaStreaming) && ((FineVideoGuida - InizioVideoGuida) < InizioVideoGuida)) {slideZoom.value = 1000; setTimeout(CambiaZoom, 1000);}
    }, 200);

    CaricamentoInizialeRegistrazioniAudio();

    navigator.mediaSession.setActionHandler('play', () => {}); navigator.mediaSession.setActionHandler('pause', () => {}); // Disattiva i pulsanti multimediali
    FunzioneRiproduzioneClip = () => {};
    InizializzaVideo();
}

function InizializzaVideo() {
    RiproduzioneInCorso = false;
	VideoGuidaFunzioneRaggiuntaFine(StoppaEventualeRegistrazione);
}

function PlayPausaCliccandoSulVideo(Attiva) {
    const CVG = FinestraVideoGuida.document.getElementById('ContenitoreVideoGuida');
    CVG.onclick = (Attiva? PlayPausa : "");
    CVG.style.cursor = (Attiva? "pointer" : "auto");
}

function VisualizzaSuggerimentiNuoviDoppiatori(Suggerimenti, TipoSuggerimento = '', FunzioneAlTermine = () => {}) {
    const totMessaggi = Suggerimenti.length;
    const boxSuggerimenti = CreaElementoSeInesistente('div', 'boxSuggerimenti', document.body.id), divBoxSuggerimenti = CreaElementoSeInesistente('div', 'divBoxSuggerimenti', boxSuggerimenti.id), pulOkBoxSuggerimenti = CreaElementoSeInesistente('div', 'pulOkBoxSuggerimenti', boxSuggerimenti.id, "OK");
    VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento = 0;

    function SuggerimentoSuccessivo(e) {
        e.stopPropagation();
        if (++VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento >= totMessaggi) {EliminaElemento(boxSuggerimenti); AJAX("NonVisualizzareSuggerimenti.php", "TipoSuggerimento=" + encodeURIComponent(TipoSuggerimento), FunzioneAlTermine, "", "", true);} else {VisualizzaSuggerimento();}
    }
    
    function VisualizzaSuggerimento() {
        const Sugg = Suggerimenti[VisualizzaSuggerimentiNuoviDoppiatori.Suggerimento];
        boxSuggerimenti.className = "alert btn btn-" + Sugg.stile;
        if (Sugg.VicinoA) {Sugg.VicinoA.append(boxSuggerimenti); boxSuggerimenti.iStyle({position: "absolute", marginTop: Sugg.scostamentoY, marginLeft: Sugg.scostamentoX, top: '', bottom: '', left: '', right: ''});} else {boxSuggerimenti.iStyle(Object.assign({}, {position: 'fixed', marginTop: '', marginLeft: '', top: '', bottom: '', left: '', right: ''}, Sugg.coordinate));}
        divBoxSuggerimenti.innerHTML = "<span class='" + Sugg.simboloSx + "'></span> " + Sugg.testo + " <span class='" + Sugg.simboloDx + "'></span><br />";
        boxSuggerimenti.style.animation = "blink-registrazione 400ms alternate 1s 4";
    }
    

    boxSuggerimenti.iStyle({zIndex: 10000000000000, position: "fixed", fontWeight: "bold", transition: "All 2s", pointerEvents: "All"});
    pulOkBoxSuggerimenti.className = "btn btn-default"; pulOkBoxSuggerimenti.iStyle({position: "absolute", right: "0px"}); pulOkBoxSuggerimenti.onmousedown = SuggerimentoSuccessivo;

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
    if (Righello.dataset.DisattivaClick == "si") {return false;}

    const pulsanteToolSelezionato = document.getElementById('pul_tool' + Tool);
    if (!pulsanteToolSelezionato) {return false;}
    
    const pulsanteToolAttuale = document.getElementById('pul_tool' + StrumentoMouse);
    const ELT = document.getElementsByClassName('ELT'), totELT = ELT.length, puntatore = puntatoreTool[Tool];
    const M = document.getElementsByClassName('Marcatore'), totM = M.length, pointerEvents_marcatore = ((Tool == toolMarcatore) ? 'auto' : '');
    const ELTStratoColore_EventoTouchStart = ((Tool == toolDividiClip) ? GestioneEventoELTCliccato : "");
    
    /* Evidenzia il pulsante selezionato */
    pulsanteToolAttuale.className = pulsanteToolAttuale.className.replace('primary', 'default');
    pulsanteToolSelezionato.className = pulsanteToolSelezionato.className.replace('default', 'primary');

    /* Modifica il puntatore sopra le clip ed eventuali altri eventi particolari */
    for (let I = 0; (I < totELT); I++) {
        if (ELT[I].dataset.modificabile) {ELT[I].style.cursor = puntatore; document.getElementById(ELT[I].id + 'StratoColore').ontouchstart = ELTStratoColore_EventoTouchStart;}
    }

    /* Rende cliccabili o meno i marcatori */
    for (let I = 0; (I < totM); I++) {
        if (M[I].dataset.modificabile) {M[I].style.pointerEvents = pointerEvents_marcatore;}
    }

    /* Modifica puntatore e anteprima cursore del contenitore delle tracce */
    divContenutoTracce.onmousemove = (([toolDividiClip, toolMarcatore].includes(Tool)) ? AnteprimaCursore : AnteprimaCursoreSeVuoto);
    divContenutoTracce.style.cursor = ((Tool == toolMarcatore) ? puntatore : "");

    /* Modifica evento al click nella timeline */
    Righello.onmousedown = ((Tool == toolMarcatore) ? AggiungiMarcatore : PosizionatiAlMinutoCliccato);

    /* Aggiorna la variabile globale */
    StrumentoMouse = Tool;

    return true;
}

/*** Funzioni traccia Ruoli Da Assegnare ***/
function AggiornaElencoCandidatiRuoliDaAssegnare_slow() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    tmrVisualizzaElencoCandidati = setTimeout(AggiornaElencoCandidatiRuoliDaAssegnare, 200);
}

function AggiornaElencoCandidatiRuoliDaAssegnare() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    if ((divElencoCandidati.style.opacity == 1) || (document.getElementById('OpzioniCandidato'))) {return;}
    const totDatiAudio = DatiAudioRegistrato.length;

    /* Non consente di cambiare utente se ci sono clip in corso di caricamento */
    for (var I = 0; (I < totDatiAudio) && (!DatiAudioRegistrato[I].CreazioneInCorso); I++);
    if (I < totDatiAudio) {return;}
    /***************************************************************************/
    
    let pulElenco;
    document.getElementById('divNotificaNuoveClipRuoliDaAssegnare').style.display = "none";

    divElencoCandidati.innerHTML = "";
    const divTitolo = CreaElemento('div', 'ElencoCandidati_Titolo', divElencoCandidati.id); divTitolo.iStyle({textAlign: "center", fontWeight: "bold"});

    I = 0;
    for(var ID_Doppiatore in DatiDoppiatori) {
        const DoppiatoreConsiderato = DatiDoppiatori[ID_Doppiatore];
        if ((ID_Doppiatore != "RuoliDaAssegnare") && (DoppiatoreConsiderato.numeroTraccia == RuoliDaAssegnare_NumeroTraccia)) {
            pulElenco = CreaElemento('div', 'pulCandidatoRuoliDaAssegnare' + I, divElencoCandidati.id, `<img src='${DoppiatoreConsiderato.FotoProfilo}' height="35" width="35" style='float: left;' /><span name="${ID_Doppiatore}_online"></span> <b>${DoppiatoreConsiderato.nome}</b>`);
            pulElenco.setAttribute('name', 'pulCandidatoRuoliDaAssegnare'); pulElenco.className = 'btn btn-default alert'; pulElenco.setAttribute('title', "-- " + DoppiatoreConsiderato.nome + " -- "); pulElenco.iStyle({position: "relative", left: "0px", top: "0px", width: "100%", whiteSpace: "normal", opacity: 1, transition: "All 1s"});
            if (DoppiatoreConsiderato.DaVisualizzare == 1) {CreaElemento('div', 'indicatoreCandidatoRuoliDaAssegnare' + I, pulElenco.id, strNuoveClip).iStyle({position: "absolute", top: "10px", left: "15px", color: "white", backgroundColor: "red", padding: "2px", borderRadius: "20%", fontWeight: "bold", transform: "rotate(-45deg)"});}
            pulElenco.dataset.idutente = ID_Doppiatore; pulElenco.onclick = CliccatoCandidatoRuoliDaAssegnare;
            I++;
        }
    }

    divTitolo.textContent = ((I > 0) ? strElencoCandidatiDaAssegnare : strNessunCandidato);
    divElencoCandidati.iStyle({opacity: 1, visibility: "visible"});
    CheckUtentiAttivi();
}

function ElencoCandidatiRuoliDaAssegnareScompare_slow() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    tmrVisualizzaElencoCandidati = setTimeout(ElencoCandidatiRuoliDaAssegnareScompare, 1000);
}

function ElencoCandidatiRuoliDaAssegnareScompare() {
    clearTimeout(tmrVisualizzaElencoCandidati);
    divElencoCandidati.iStyle({opacity: 0, visibility: 'hidden'});
}

async function CliccatoCandidatoRuoliDaAssegnare(e) {
    const pulCandidato = e.currentTarget, pulsantiCandidati = document.getElementsByName('pulCandidatoRuoliDaAssegnare'), totPulsantiCandidati = pulsantiCandidati.length;
    for (var I = 0; (I < totPulsantiCandidati) && !(pulsantiCandidati[I].abilita(false)) && !(pulsantiCandidati[I].style.opacity = 0); I++);
    pulCandidato.iStyle({opacity: 1, left: "-50%", top: "-" + pulCandidato.offsetTop + "px"});
    pulCandidato.className = "btn alert-info fa-bounce";
    ElencoCandidatiRuoliDaAssegnareScompare_slow();
    document.getElementById('divTitoloRuoliDaAssegnare').className = "btn btn-success btn-xs";
    SelezionaCandidatoRuoliDaAssegnare(pulCandidato.dataset.idutente);
}

function SelezionaCandidatoRuoliDaAssegnare(ID, FunzioneAlTermine = () => {}) {
    if (ID == RuoliDaAssegnare_CandidatoSelezionato) {return;}

    document.getElementById('divContenutoNomeTraccia' + RuoliDaAssegnare_NumeroTraccia).abilita(false); AttivaImmagineAttesa('Pulse'); if (divNotifica = document.getElementById('divNotificaNuoveClipRuoliDaAssegnare')) {divNotifica.style.display = "none"};
    
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

            EscludiRipristinaTraccia(RuoliDaAssegnare_CandidatoSelezionato, "Escludi");

            /* Attiva la traccia per l'utente selezionato */
            const divAggiungiDoppiatoreCandidato = document.getElementById('pulAggiungiDoppiatoreCandidato'), divChatCandidato = document.getElementById('divChatCandidato'), spanUtenteOnline = document.getElementById(RuoliDaAssegnare_CandidatoSelezionato + "_online"), divEscludiRipristinaTraccia = document.getElementById('EscludiRipristinaTraccia' + RuoliDaAssegnare_NumeroTraccia), divCestino = document.getElementById('ApriCestinoTraccia' + RuoliDaAssegnare_NumeroTraccia), divSelezionaTutteLeClip = document.getElementById('SelezionaTutteLeClip' + RuoliDaAssegnare_NumeroTraccia);
            document.getElementById('pulRuoliDaAssegnare').title = "-- " + Dati.Nome + " -- ";
            document.getElementById('spanNomeUtenteTraccia' + RuoliDaAssegnare_NumeroTraccia).innerText = Dati.Nome;
            document.getElementById('FotoProfiloTraccia' + RuoliDaAssegnare_NumeroTraccia).src = Dati.FotoProfilo;
            spanUtenteOnline.className = ""; spanUtenteOnline.id = ID + "_online"; spanUtenteOnline.setAttribute('name', ((ID != ID_Utente) ? spanUtenteOnline.id : ""));
            document.getElementById('DownloadTraccia' + RuoliDaAssegnare_NumeroTraccia).dataset.utente = ID;
            document.getElementById('EsportaTraccia' + RuoliDaAssegnare_NumeroTraccia).dataset.link = `RenderingAudio/Rendering/Rendering.php?N=${N}&P=${P}&ID=${ID}`;
            divEscludiRipristinaTraccia.onclick = () => {EscludiRipristinaTraccia(ID);};
            divCestino.dataset.idutente = ID; divCestino.dataset.ripristinati = "si"; ApriCestinoTraccia({currentTarget: divCestino});
            divSelezionaTutteLeClip.dataset.idutente = ID;
            if (SonoCreatoreProgetto) {
                divChatCandidato.style.display = "inline"; divChatCandidato.dataset.link = `ChatRoom.php?S=${N}&A=${ID}`; divChatCandidato.dataset.idcandidato = ID;
                if (tmrAggiornaChatCandidato === false) {tmrAggiornaChatCandidato = setInterval(NotificaMessaggiChatCandidato, 60000);} NotificaMessaggiChatCandidato();
                divAggiungiDoppiatoreCandidato.style.display = "inline"; divAggiungiDoppiatoreCandidato.dataset.idcandidato = ID; divAggiungiDoppiatoreCandidato.dataset.nomecandidato = Dati.Nome;
            }
            if (!DatiDoppiatori[ID]) {DatiDoppiatori[ID] = {nome: Dati.Nome, numeroTraccia: RuoliDaAssegnare_NumeroTraccia, ruolo: DatiDoppiatori['RuoliDaAssegnare'].ruolo};} // Evita di sovrascrivere le info acquisite da VerificaNuoveClipAltriCandidati()
            EscludiRipristinaTraccia(ID, "Ripristina");
            RuoliDaAssegnare_CandidatoSelezionato = ID;
            SolaVisione = SessioneOspite; // Attiva la possibilità di registrare solo se si è il visitatore candidato (o il creatore del progetto).
            if (Righello.dataset.DisattivaClick == "no") {RiabilitaSchermata();} // Abilita la possibilità eventuale di registrare solo se la schermata era già attiva.
            AttivaImmagineAttesa('TrePunti');
            AdattaAltezzaTracciaRuoliDaAssegnare();
            setTimeout(AggiornaClip, 100, () => {
                EliminaImgAttesa();
                setTimeout(() => {document.getElementById('divContenutoNomeTraccia' + RuoliDaAssegnare_NumeroTraccia).abilita(true);}, 1000);
                FunzioneAlTermine();
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
    const pulAggiungiDoppiatoreCandidatoNelCast = e.currentTarget, DatiDoppiatoreCandidato = pulAggiungiDoppiatoreCandidatoNelCast.dataset, strRuoliDaAssegnare = document.getElementById('spanRuoliTraccia' + RuoliDaAssegnare_NumeroTraccia).innerHTML.replace(/<b>|<\/b>/g, "**");
    /** @type {HTMLElement} **/
    var divPersonaggiLiberi = false, inputPersonaggiLiberi;

    const PannelloOpzioni = CreaElemento('div', 'OpzioniCandidato', document.body.id); PannelloOpzioni.className = "panel panel-info"; PannelloOpzioni.iStyle({position: "fixed", top: "100px", left: "10%", zIndex: 100000000});
    const divBody_id = PannelloOpzioni.id + "Contenuto", inputRuoliCandidato_id = PannelloOpzioni.id + 'RuoliCandidato';

    function AnnullaAggiungiDoppiatore() {
        EliminaElemento(PannelloOpzioni);
        window.addEventListener('keydown', ScorciatoieTastiera);
        RiabilitaSchermata();
        pulAggiungiDoppiatoreCandidatoNelCast.abilita(true);
    }

    function AttivaOpzioneTracciaRuoliDaAssegnare(e) {
        const opzMantieni = (e.currentTarget.value == 1), classenormale = 'btn btn-', classe = {[true]: "primary", [false]: "default"};

        if (opzMantieni) {
            const NuoviElementi = CreaNuoviElementi([
                divBody_id,
                    ['div', {textContent: strIndicaRuoliDaAssegnare}, {margin: "10px"}],,
                        ['input', {onchange: VerificaCampoRuoliLiberi}, {}, {}, {type: "text", name: "RuoliDaAssegnare", size: 30, value: strRuoliDaAssegnare}],
                        ['div']
            ]);
            divPersonaggiLiberi = NuoviElementi[0]; inputPersonaggiLiberi = NuoviElementi[1];
            const divAiuto = NuoviElementi[2];
            
            function VerificaCampoRuoliLiberi() {
                const Condizione = ValidaCondizioneMinimaCampoDiTesto(inputPersonaggiLiberi);
                inputPersonaggiLiberi.style.border = (Condizione? "" : "2px dashed red");
                pulSalva.abilita(Condizione);
                divAiuto.innerText = (Condizione? "" : strCampoCondizioneMinima); divAiuto.className = (Condizione? "" : "alert alert-warning");
            };
        } else {
            EliminaElemento(divPersonaggiLiberi);
            divPersonaggiLiberi = false;
        }

        document.getElementById(PannelloOpzioni.id + 'lblElimina').className = classenormale + classe[!opzMantieni]; document.getElementById(PannelloOpzioni.id + 'lblMantieni').className = classenormale + classe[opzMantieni];

        pulSalva.abilita(true);
    }

    const AttributiPulsantiOpzioni = {type: "radio", name: "opzMantenereRuoliDaAssegnare"};
    const NuoviElementi = CreaNuoviElementi([
        /* Barra del titolo */
        PannelloOpzioni.id,
            ['div', {innerHTML: "<b>" + strStaiAggiungendoUtente + DatiDoppiatoreCandidato.nomecandidato + " " + strNelCast + "</b>", className: "panel-heading text-center"}],,
                ['a', {className: "btn btn-danger fa fa-times", onclick: AnnullaAggiungiDoppiatore}, {position: "absolute", top: "5px", left: "10px"}],
        
        /* Opzioni */
        PannelloOpzioni.id,
            ['div', {id: divBody_id, className: "panel-body text-center"}],,
                ['div', {innerHTML: strDescriviPersonaggiDoppiatiDa + "<b>" + DatiDoppiatoreCandidato.nomecandidato + "</b>&nbsp;"}, {margin: "10px 20px 40px 20px"}],, ['input', {id: inputRuoliCandidato_id}, {}, {}, {type: "text", name: "RuoloCandidato", size: 30, value: strRuoliDaAssegnare}],
                    
            2,  ['div', {}, {margin: "20px"}],, ['label', {id: PannelloOpzioni.id + "lblElimina",  className: "btn btn-default"}],, ['input', {value: 0, onclick: AttivaOpzioneTracciaRuoliDaAssegnare}, {}, {}, AttributiPulsantiOpzioni], ['span', {textContent: strVoglioEliminareRuoliDaAssegnare}],
            2,  ['div', {}, {margin: "20px"}],, ['label', {id: PannelloOpzioni.id + "lblMantieni", className: "btn btn-default"}],, ['input', {value: 1, onclick: AttivaOpzioneTracciaRuoliDaAssegnare}, {}, {}, AttributiPulsantiOpzioni], ['span', {textContent: strVoglioMantenereRuoliDaAssegnare}],

        /* Salva e annulla */
        PannelloOpzioni.id,
            ['div', {className: "panel-footer"}, {height: "60px"}],,
                ['a', {innerHTML: "<span class='fa fa-times'></span> " + strAnnullalemodifiche, className: "btn btn-default", onclick: AnnullaAggiungiDoppiatore}, {position: "absolute", left: "15%"}],
                ['a', {innerHTML: "<span class='fa fa-arrow-right'></span> " + strProcedi, className: "btn btn-success", onclick: InserisciIlDoppiatoreNelCast}, {position: "absolute", right: "15%"}]
    ]);
    const pulSalva = NuoviElementi.al(-1);
    pulSalva.abilita(false);

    function InserisciIlDoppiatoreNelCast() {
        pulSalva.abilita(false); pulSalva.innerText = strAttenderePrego; pulSalva.className += " fa-fade";
        AJAX("InserisciCandidatoNelCast.php", "N=" + encodeURIComponent(N) + "&IDUtenteCandidato=" + encodeURIComponent(DatiDoppiatoreCandidato.idcandidato) + "&RuoloUtenteCandidato=" + encodeURIComponent(document.getElementById(inputRuoliCandidato_id).value) + "&RuoliDaAssegnare=" + encodeURIComponent(divPersonaggiLiberi? inputPersonaggiLiberi.value : ""),
            () => {window.location.reload();}, strAggiornamento, strSalvataggioCompletato
        );
    }

    DisabilitaSchermata();
    pulAggiungiDoppiatoreCandidatoNelCast.abilita(false);
    window.removeEventListener('keydown', ScorciatoieTastiera);
    ElencoCandidatiRuoliDaAssegnareScompare();
}

function VerificaNuoveClipAltriCandidati(FunzioneAlTermine = () => {}) {
    AJAX("ElencoCandidatiRuoliDaAssegnare.php", "N=" + encodeURIComponent(N),
        function (Dati) {
            const totCandidati = Dati.length, divNotifica = document.getElementById('divNotificaNuoveClipRuoliDaAssegnare');
            var contatoreCandidatiNuoveClip = 0;

            for (var I = 0; I < totCandidati; I++) {
                contatoreCandidatiNuoveClip += (Dati[I].ID != RuoliDaAssegnare_CandidatoSelezionato) && (Dati[I].DaVisualizzare == 1);
                DatiDoppiatori[Dati[I].ID] = {nome: Dati[I].Nome, numeroTraccia: RuoliDaAssegnare_NumeroTraccia, ruolo: DatiDoppiatori['RuoliDaAssegnare'].ruolo, FotoProfilo: Dati[I].FotoProfilo, DaVisualizzare: Dati[I].DaVisualizzare}; // Aggiorna l'elenco dei doppiatori per determinare se sono online e per altre funzionalità
            }

            if (contatoreCandidatiNuoveClip > 0) {
                divNotifica.className = 'fa fa-arrow-left';
                divNotifica.innerText = " " + strNuoveClipDa + contatoreCandidatiNuoveClip + " " + strCandidat + ((contatoreCandidatiNuoveClip != 1) ? suffissoMaschilePlurale : suffissoMaschileSingolare);
                divNotifica.style.animation = "blink-registrazione 500ms alternate 2s 10";
                divNotifica.style.display = "inline";
            } else {
                divNotifica.style.display = "none";
            }

            FunzioneAlTermine();
        }, "", "", true
    );
}
/************************************/

/*** Funzioni al processamento dell'audio ***/
function ProcessaAudio_Monitora(e) {
    const input = e.data.audioBuffer, totInput = input.length;
    var sum = 0.0, media = 0.0, i = 0;

    for (i = 0; i < totInput; ++i) {
        sum += Math.abs(input[i]);
    }

   media = sum / totInput;
   const valore = (media * ParametriLivelloMic.percIncidenzaValore) + (ProcessaAudio_Monitora.valoreprec * ParametriLivelloMic.percIncidenzaValorePrec);
   ProcessaAudio_Monitora.valoreprec = media;
   livelloMic.style.width = (valore * lunghezzaLivelloMic) + "px";
}
ProcessaAudio_Monitora.valoreprec = 0;

function ProcessaAudio_AcquisisciRegistrazione(e) {
    canaleAudio = e.data.audioRegistrato;
    LunghezzaNuovaRegistrazione = canaleAudio.length * 128;
    DisconnettiWorkletRegistrazione();
    MandaACreaRegistrazione(CreaRegistrazione_wav);
}
/********************************************/

function handleSuccess(stream) {
    const ac = audioContext, Didascalia = strSpiegazioneSceltaMicrofono + ac.sampleRate + " Hz - buffer-size: " + dimensioneBuffer;

    QualitaAltaRegistrazione = true; regMediaRecorder = false;
    
    sorgenteAudioSelezionata = ac.createMediaStreamSource(stream);
    registrazione = new window.AudioWorkletNode(ac, 'recorder-worklet');
    sorgenteAudioSelezionata.connect(registrazione).connect(ac.destination);
    AggiornaParametriRegistrazione();
    setTimeout(() => {if (registrazione) {registrazione.port.onmessage = ProcessaAudio_Monitora; AdattaLunghezzaLivelloMic();}}, 500);

    pulRegistra.disabled = SolaVisione || (Righello.dataset.DisattivaClick == "si");
    divSelettoreMicrofono.setAttribute('title', Didascalia);

    if (document.getElementById('QualitaRegistrazione').dataset.valore == 0) {
        regMediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
        regMediaRecorder.ondataavailable = handleDataAvailable;
        QualitaAltaRegistrazione = false;
    }

    ErroreMicrofono = false;
}

function handleError(error) {
	console.log('navigator.mediaDevices.getUserMedia errore: ', error);
    alert(strErroreMic + error);
    ErroreMicrofono = error;
}

function AttivaIngressi() {
    DisconnettiWorkletRegistrazione();
    if (sorgenteAudioSelezionata) {sorgenteAudioSelezionata.mediaStream.getAudioTracks().forEach(t => t.stop());}
	navigator.mediaDevices.getUserMedia(ingressi).then(handleSuccess).catch(handleError);
}

function DisconnettiWorkletRegistrazione() {
    if (registrazione) {
        try {registrazione.disconnect(); sorgenteAudioSelezionata.disconnect();} catch (err) {}
        registrazione.port.onmessage = ""; registrazione.port.postMessage({numCanale: 0, modalita: "Scollega"});
    }
    registrazione = false;
    AttivaDisattivaMonitorMic(false);
}

function AggiornaDispositivi() {
    const Microfono = SelezioneMicrofono.dataset.idmic ? { exact: SelezioneMicrofono.dataset.idmic } : undefined;
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
        registrazione.port.postMessage({modalita: "Monitoraggio", numCanale: AcquisisciCanaleRegistrazione(), bufferSize: Number(dimensioneBuffer)});
    }
}

function AcquisisciCanaleRegistrazione() {
    return Number(document.getElementById('CanaleRegistrazione').dataset.valore);
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

    FunzioneNormaleAlTimeUpdate = (ModalitaUltraLightAttiva? AggiornaTimeline : AggiornaCursoreConAnteprimaOndaSonoraEAscoltoClip_Analizzatore);
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
    const x = Cursore.offsetLeft - PartenzaCanvas, valore = v * HEIGHT, partenzaDisegno = (metaAltezza + valore), colorevalore = Math.abs(valore) / metaAltezza * 255;
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'rgb(' + colorevalore + ', ' + (255 - colorevalore) + ', ' + (255 - colorevalore) + ')';
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, partenzaDisegno);
    canvasCtx.lineTo(x, (partenzaDisegno - (valore * 2)));
    canvasCtx.closePath();
    canvasCtx.stroke();
}
/**********************************************************/

function RiproduciClipInSync(MinutaggioVideo) {
    const MinutaggioVideoAggiustato = (+MinutaggioVideo) + (+LatenzaAudio);

    ClipDaRiprodurre.forEach((I) => {
        const datiAudio = DatiAudioRegistrato[I], MinutaggioAudio = datiAudio.MinutaggioRegistrazione, InizioAudio = (+MinutaggioAudio) + (+datiAudio.taglioIniziale), ClipNelMinutaggioAttuale = (InizioAudio <= MinutaggioVideoAggiustato), SecondiPartenzaAudio = ((InizioAudio - MinutaggioVideoAggiustato) * !ClipNelMinutaggioAttuale), PartenzaEffettivaClip = ((MinutaggioVideoAggiustato - InizioAudio) * ClipNelMinutaggioAttuale);
        const InizioClip = (+datiAudio.taglioIniziale) + (+PartenzaEffettivaClip), FineClip = (+datiAudio.taglioFinale) - InizioClip;
        datiAudio.audio.start(audioContext.currentTime + SecondiPartenzaAudio, InizioClip, FineClip * (FineClip > 0));
        datiAudio.avviato = true;
        datiAudio.audio.onended = () => {ScaricaMemoria_slow(); datiAudio.alTermine();};
        datiAudio.alPlay.forEach((DatiEventoAlPlay, N) => {
            clearTimeout(datiAudio.tmrEventoAlPlay[N]);
            const FunzioneAlPlay = DatiEventoAlPlay.FunzioneAlPlay, LatenzaSecondi = (DatiEventoAlPlay.latenzaEventoAlPlay.daltermine ? (+datiAudio.taglioFinale) - (+datiAudio.taglioIniziale) + (+DatiEventoAlPlay.latenzaEventoAlPlay.daltermine) : DatiEventoAlPlay.latenzaEventoAlPlay.secondi), RiduciSeClipNelMinutaggio = DatiEventoAlPlay.latenzaEventoAlPlay.riduciSeClipNelMinutaggio;
            datiAudio.tmrEventoAlPlay[N] = setTimeout(() => {FunzioneAlPlay(datiAudio);}, ((+SecondiPartenzaAudio) + (+LatenzaSecondi) - (PartenzaEffettivaClip * RiduciSeClipNelMinutaggio)) * 1000);
        });
    });

    ClipDaRiprodurre = [];
    FunzioneRiproduzioneClip = function () {};
}

function MinutaggioCambiato() {
	const MinutaggioNuovo = Number(MinutaggioSecondi.value) + (Number(MinutaggioMinuti.value) * 60);
    const MinutaggioNuovoAggiustato = (+MinutaggioNuovo * (MinutaggioNuovo >= 0) * (MinutaggioNuovo <= totDurataVideoGuida)) + (+totDurataVideoGuida * (MinutaggioNuovo > totDurataVideoGuida));
	Posizionati(+MinutaggioNuovoAggiustato);
}

Righello.onmousedown = PosizionatiAlMinutoCliccato;
divContenutoTracce.onmousemove = AnteprimaCursoreSeVuoto;
divContenutoTracce.onmouseleave = EliminaAnteprimaCursore;
divMinutaggiRighello.onmousemove = AnteprimaCursore;
divMinutaggiRighello.onmouseleave = EliminaAnteprimaCursore;

function AnteprimaCursoreSeVuoto(e) {
    if (e.target.id.substr(0, 3) != "ELT") {AnteprimaCursore(e);} else {EliminaAnteprimaCursore();}
}

function AnteprimaCursore(e) {
    const X = e.clientX + window.scrollX - ContenitoreRighello.offsetLeft;
    CursoreAnteprima.iStyle({left: X + "px", opacity: 0.5});
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
    FinestraVideoGuida.slideMinutaggioAttuale.value = Minutaggio;
    Cursore.style.left = (Minutaggio / totDurataVideoGuida * 100) + "%";
    tmrRitardoScorrimentoCursore = window.setTimeout(SeguiCursore, ritardoscorrimento);
}

function SeguiCursore() {
    const PosizioneAttualeCursore = Cursore.offsetLeft, PosizioneAttualeCursoreNellaFinestra = PosizioneAttualeCursore - window.scrollX;
    ((PosizioneAttualeCursoreNellaFinestra < 0) || (PosizioneAttualeCursoreNellaFinestra > ScorrimentoCursore.distanzaMinimaDalBordo)) && window.scrollTo({left: PosizioneAttualeCursore - ScorrimentoCursore.distanzaMinimaDalBordo});
}

/*** Marcatori sulla timeline ***/
function CaricaMarcatori(FunzioneAlTermine = () => {}) {
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
                    if (Casella != document.activeElement) {Casella.value = M.TestoMarcatore; Casella.dispatchEvent(ev_cambiamento);}
                } else {
                    DisegnaMarcatore(M.ID_UtenteMarcatore, M.MinutaggioMarcatore, M.TestoMarcatore, M.NumMarcatore);
                }
                CaricaMarcatori.Marcatori[M.NumMarcatore] = true;
            }

            /* Elimina i marcatori non più presenti */
            CaricaMarcatori.MarcatoriPrec.forEach((I, IDMarcatore) => {if (!CaricaMarcatori.Marcatori[IDMarcatore]) {EliminaElemento(document.getElementById('Marcatore' + IDMarcatore));}});

            FunzioneAlTermine();
        }, "", "", true
    );
}
CaricaMarcatori.Marcatori = []; CaricaMarcatori.MarcatoriPrec = [];

function AggiungiMarcatore(e) {
    if (e.button != 0) {return;}
    const IDTraccia = ((e.target.id.slice(0, 3) == 'ELT') ? document.getElementById(e.target.id.replace(/(ELTReg[0-9]+).+/, "$1")).parentNode.id : e.target.id);
    if (IDTraccia.slice(0, 7) != "Traccia") {return;}

    const IDUtente = document.getElementById(IDTraccia).dataset.idutente, MinutaggioMarcatore = DeterminaMinutaggioCliccato(e);
    if ((ID_Utente == IDUtente) || (SonoCreatoreProgetto)) {
        AJAX('SalvaNuovoMarcatore.php', `NumProgetto=${N}&NumProvino=${P}&Utente=${encodeURIComponent(IDUtente)}&Minutaggio=${encodeURIComponent(MinutaggioMarcatore)}&Testo=${encodeURIComponent(strMarcatoreDescrDefault)}`,
            (Dati) => {
                CaricaMarcatori(() => {document.getElementById('inputMarcatore' + Dati.IDMarcatore).select();});
            }, "", "", true
        );
    }
    CambiaTool(toolStandard);
}

function DisegnaMarcatore(ID_UtenteMarcatore, Minutaggio, Stringa, IDMarcatore) {
    if (!DatiDoppiatori[ID_UtenteMarcatore]) {return;}

    const Modificabile = ((SonoCreatoreProgetto) || (ID_Utente == ID_UtenteMarcatore));

    const Marcatore = CreaElemento('div', 'Marcatore' + IDMarcatore, 'Traccia' + DatiDoppiatori[ID_UtenteMarcatore].numeroTraccia); Marcatore.dataset.id = IDMarcatore; Marcatore.className = 'Marcatore';
          Marcatore.iStyle({left: (Minutaggio / totDurataVideoGuida * 100) + "%", cursor: "url(images/CursoreMouseLineaTemporale_toolMarcatore_elimina.png) 8 0, auto", zIndex: 1000000 + (+IDMarcatore)});
            if (Modificabile) {
                Marcatore.dataset.modificabile = "si";
                
                Marcatore.onmousedown = (e) => {
                    if ((e.button != 0) || (StrumentoMouse != toolMarcatore) || (e.target.tagName == 'INPUT')) {return;}
                    
                    e.stopPropagation();

                    if (confirm(strVuoiEliminareMarcatore + "(" + e.currentTarget.children[0].value + ") ?")) {
                        AJAX('EliminaMarcatore.php', `N=${encodeURIComponent(e.currentTarget.dataset.id)}`, "", "", "", true);
                        EliminaElemento(e.currentTarget);
                    }
                };
            }

            const Casella = CreaElemento('input', 'input' + Marcatore.id, Marcatore.id); Casella.value = Stringa; Casella.readOnly = !Modificabile; Casella.style.pointerEvents = (Modificabile? "all" : "none");
                  Casella.onmousedown = (e) => {e.stopPropagation();};
                  Casella.onfocus = (e) => {
                        const C = e.currentTarget;
                        SelezionaTutto(e);
                        C.className = ""; // Rimette la casella in orizzontale.
                  };
                  Casella.onchange = (e) => {
                        const C = e.currentTarget, M = C.parentNode;
                        C.value = C.value.trim();
                        if (C.value == "") {C.value = C.dataset.valoreprec;}
                        C.size = C.value.length;
                        C.dataset.valoreprec = C.value;
                        M.setAttribute('title', C.value);
                        M.dataset.larghezza = C.offsetWidth; // Per CompattaMarcatori() considera la larghezza del campo di testo, a prescindere se verticale o meno
                        CompattaMarcatori();
                  };
                  Casella.onblur = (e) => {
                        const C = e.currentTarget, M = C.parentNode, Testo = C.value.trim();
                        if (Testo) {AJAX('AggiornaMarcatore.php', `N=${encodeURIComponent(M.dataset.id)}&Testo=${encodeURIComponent(Testo)}`, "", "", "", true);}
                  };
                  Casella.onkeydown = PerdiFocusConInvio;
                  Casella.onchange({currentTarget: Casella});

    return Casella;
}

function CompattaMarcatori() {
    const divM = document.getElementsByClassName('Marcatore'), totM = divM.length;
    var M = [];
    /* Memorizza i dati relativi ai marcatori divisi per traccia */
    for(let I = 0; I < totM; I++) {
        const divMarcatore = divM[I], traccia = +divMarcatore.parentNode.id.slice(7); // Estrapola solo il numero della traccia
        M[traccia] = (M[traccia] || []);
        M[traccia].push({ID: divMarcatore.id, x: divMarcatore.offsetLeft, larghezza: divMarcatore.dataset.larghezza});
    }

    /* Per ogni traccia, ordina i marcatori per posizione X e verifica se si sovrappongono */
    M.forEach((Mtraccia) => {
        Mtraccia.sort((a, b) => {return a.x - b.x;});
        const totMtracciaDaElaborare = Mtraccia.length - 1;
        for(let I = 0; I < totMtracciaDaElaborare; I++) {
            const Marcatore = Mtraccia[I], MarcatoreSucc = Mtraccia[I + 1], divMarcatore = document.getElementById(Marcatore.ID), Casella = divMarcatore.children[0];
            if (Casella == document.activeElement) {continue;}

            const ComprimiMarcatore = (((+Marcatore.x) + (+Marcatore.larghezza)) > (+MarcatoreSucc.x));
            Casella.className = (ComprimiMarcatore? "Marcatore-verticale" : "");
            divMarcatore.style.width = (ComprimiMarcatore? "10px" : "");
        }
    });
}
/*********************/

/*** Monitor del microfono ***/
function toggleMonitorMic() {
    AttivaDisattivaMonitorMic(pulMonitorMic.dataset.attivato == "no");
}

function AttivaDisattivaMonitorMic(Attiva) {
    if (sorgenteAudioSelezionata) {
        if (Attiva) {
            if (pulMonitorMic.dataset.attivato == "no") {
                sorgenteAudioSelezionata.connect(audioContext.destination);
                pulMonitorMic.className = pulMonitorMic.className.replace('default', 'warning');
                pulMonitorMic.dataset.attivato = "si";
            }
        } else {
            if (pulMonitorMic.dataset.attivato == "si") {
                try {sorgenteAudioSelezionata.disconnect(audioContext.destination);} catch (err) {}
                pulMonitorMic.className = pulMonitorMic.className.replace('warning', 'default');
                pulMonitorMic.dataset.attivato = "no";
            }
        }
    }
}
/*****************************/

function AggiornaMinutaggioVideo(Minutaggio) {
	var M = new MinutiESecondi(Minutaggio);
	MinutaggioMinuti.value = M.Minuti; MinutaggioSecondi.value = M.Secondi.toFixed(DecimaliSecondiMinutaggio).padStart(2, "0");
    
    if (RiproduzioneInCorso) {
        if (Minutaggio >= totDurataVideoGuida) {
            if (StoRegistrando) {stopRecording();} else {StopVideoGuida();}
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

function DisabilitaComandiPerRiprodurre(Disabilita) {
    pulPlay.disabled = Disabilita; PlayPausaCliccandoSulVideo(!Disabilita); DisabilitaElementiRegistrazione(Disabilita || SolaVisione); FinestraVideoGuida.pulPlayInSovrimpressione.style.display = (Disabilita ? "none" : "");
}

function Posizionati(MinutaggioNuovo, RiabilitaTuttaLaSchermata = false, FunzioneAlTermine = () => {}) {
    const stavoRiproducendo = (RiproduzioneInCorso && (Posizionati.InAttesaRiattivazione == false)); // Non riattiva in automatico la riproduzione se è stato modificato il minutaggio prima che potesse posizionarsi

    function RiattivaVideoGuida() {
        if ((Math.round(VideoGuidaMinutaggioCorrente())) != (Math.round(MinutaggioNuovo))) {Posizionati.tmr = setTimeout(RiattivaVideoGuida, 1000); return;}
        Posizionati.InAttesaRiattivazione = false;
        ImmagineAttesaVideoGuida(false);
        if (stavoRiproducendo) {
            PlayVideoGuida();
        } else {
            RiabilitaLaSchermataSeRichiesto();
            if (ContenitoreCopione.FunzioniCopione.CopioneVisualizzato) {ContenitoreCopione.FunzioniCopione.RiattivaCopione(); AttivaScorrimentoCopione();}
        }
        FunzioneAlTermine();
    }

    function RiabilitaLaSchermataSeRichiesto() {
        if (RiabilitaTuttaLaSchermata) {
            RiabilitaSchermata();
        } else {
            if (Righello.dataset.DisattivaClick == "no") {DisabilitaComandiPerRiprodurre(false);}
        }
    }

    if ((MinutaggioNuovo < 0) || (VideoGuidaMinutaggioCorrente() == MinutaggioNuovo) || (MinutaggioNuovo > totDurataVideoGuida)) {RiabilitaLaSchermataSeRichiesto(); return;}
    
    DisabilitaComandiPerRiprodurre(true);

    clearInterval(tmrRitardoScorrimentoCursore);
    setTimeout(() => {PosizionaCursore(MinutaggioNuovo); AggiornaMinutaggioVideo(MinutaggioNuovo);}, 100);
    FunzioneAlTerminePrecaricamento = false;
    EliminaImgAttesa();
    StopVideoGuida();
    ImmagineAttesaVideoGuida(true);
    VideoGuidaPosizionati(MinutaggioNuovo);
    Posizionati.InAttesaRiattivazione = true;
    clearTimeout(Posizionati.tmr);
    Posizionati.tmr = setTimeout(RiattivaVideoGuida, 500);
}
Posizionati.tmr = false; Posizionati.InAttesaRiattivazione = false;


/*** Funzioni gestione del copione ***/
function AttivaScorrimentoCopione() {
    if (RiproduzioneInCorso) {ContenitoreCopione.FunzioniCopione.AttivaTestoGuida();} else {ContenitoreCopione.FunzioniCopione.AggiornaTestoGuida();}
}

function SwitchCopioneEditabile(e) {
    e.stopPropagation();
    const pulSwitchCopioneEditabile = ContenitoreCopione.document.getElementById('pulSwitchCopioneEditabile'), classe_pulsante = ["default", "warning"];
    ContenitoreCopione.FunzioniCopione.CopioneEditabile = 1 * (ContenitoreCopione.FunzioniCopione.CopioneEditabile == 0);
    pulSwitchCopioneEditabile.className = pulSwitchCopioneEditabile.className.replace(classe_pulsante[1 - ContenitoreCopione.FunzioniCopione.CopioneEditabile], classe_pulsante[ContenitoreCopione.FunzioniCopione.CopioneEditabile]);
    const s = ContenitoreCopione.TestoGuida.querySelectorAll("[name='ContenutoEditabile']"), tots = s.length;
    if (ContenitoreCopione.FunzioniCopione.CopioneEditabile) {
        Messaggio(str_copione_ModalitaEditAttivata_spiegazione + str_copione_ModalitaEditAttivata_modifiche[1 * SonoCreatoreProgetto]);
        for (let I = 0; I < tots; I++) {
            s[I].setAttribute('contenteditable', true);
        }
    } else {
        for (let I = 0; I < tots; I++) {
            s[I].removeAttribute('contenteditable');
        }
    }
}

function ApriCopioneInAltraFinestra(e) {
    e.stopPropagation();
    ApriCopione({currentTarget: {dataset: {link: "CopioneInFinestraSeparata.php?N=" + N + "&I=" + OpzEvidenzia_TestoGuida.selectedIndex}}});
    ContenitoreCopione = FinestraCopione;
    ContenitoreTestoGuida.style.display = "none";
}
/**************************************/

/*** Video in finestra ***/
function FinestraVideoGuida_cambia(e) {
    e.stopPropagation();
    if (pulSchermoIntero.dataset.schermointero == "si") {pulSchermoIntero.click();}
    e.currentTarget.className += " fa-bounce";
    StopVideoGuida();
    DisabilitaSchermata();
    setTimeout(() => {
        FinestraVideoGuida = ApriFinestra({currentTarget: {dataset: {link: "VideoGuidaInFinestraSeparata.php?N=" + N, nomefinestra: "FinestraVideoGuida"}}});
    }, 500);
}
/*************************/


/*** Precarica clip ***
 * Richiama la funzione CaricaBufferAudio per le clip ancora non caricate, secondo i parametri indicati *
 * @param {Number} DalMinutaggio                        il minutaggio a partire dal quale le clip devono essere precaricate
 * @param {Number} FinoAlMinutaggio                     (facoltativo) il minutaggio entro il quale le clip devono essere precaricate, se non indicato precarica fino ai SecondiPrecaricamentoMax
 * @param {FunctionStringCallback} FunzioneAlTermine    (facoltativo) la funzione da lanciare al termine del caricamento di tutte le clip considerate nell'intervallo di tempo scelto.
 *                                                                    Se inserita, lancia il precaricamento di tutte le clip considerate contemporaneamente, altrimenti le clip vengono precaricate una alla volta per non affaticare l'elaborazione.
 * @param {Object} AltreOpzioni                         (facoltativo) opzioni relative al precaricamento, possono essere:
 ** @param {FunctionStringCallback} AltreOpzioni.FunzioneAlTermineSingoloPrecaricamento (facoltativo) la funzione da lanciare al termine di ogni singola clip precaricata
 ** @param {Boolean} AltreOpzioni.SoloBuffer                                            (facoltativo) indicare se per ogni clip precaricata deve memorizzare il solo buffer, senza effettuare altre operazioni */
function PrecaricaClip(DalMinutaggio, FinoAlMinutaggio, FunzioneAlTermine = false, AltreOpzioni = {FunzioneAlTermineSingoloPrecaricamento: () => {}, SoloBuffer: false}) {
    const totAudio = DatiAudioRegistrato.length;
    clearTimeout(PrecaricaClip.tmr);

    if (!FinoAlMinutaggio) {FinoAlMinutaggio = +DalMinutaggio + SecondiPrecaricamentoMax;}
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
            const SecondiTimeout = +FinoAlMinutaggio - VideoGuidaMinutaggioCorrente() - (SecondiPrecaricamentoMax / 2);
            PrecaricaClip.tmr = setTimeout(() => {MinutaggioPrecaricamentoClip = FinoAlMinutaggio; PrecaricaClipSuccessiva(); console.log("Timeout avviato.", MinutaggioPrecaricamentoClip);}, SecondiTimeout * 1000);
            console.log("Settato Timeout fra", SecondiTimeout, "sec. Precaricamento clip dal secondo", FinoAlMinutaggio);
        }
    }
}
PrecaricaClip.tmr = false;

function ClipDaPrecaricare(Numero, DalMinutaggio, FinoAlMinutaggio) {
    const datiAudio = DatiAudioRegistrato[Numero];
    return ((!datiAudio.buffer) && (!datiAudio.disattivato) && (!datiAudio.Rimosso) && (((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioIniziale)) < FinoAlMinutaggio) && (DalMinutaggio < ((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioFinale))));
}

function CaricaBufferAudio(Numero, FunzioneAlTermine = () => {}, SoloBuffer = false) {
    const datiAudio = DatiAudioRegistrato[Numero];
    console.log("CaricaBufferAudio", datiAudio.numero, "RichiestoCaricamentoBuffer:", datiAudio.RichiestoCaricamentoBuffer);
    if (datiAudio.RichiestoCaricamentoBuffer) {return;}

    datiAudio.RichiestoCaricamentoBuffer = true;
    CaricaAudio(Numero, datiAudio, 'arraybuffer', (ClipAudio) => {
        audioContext.decodeAudioData(ClipAudio).then((buffer) => {
            /** Se si tratta di colonna internazionale, manda alla funzione che si occupa di generare il buffer per concatenare gli spezzoni **/
            if (DatiAudioRegistrato[Numero].ID_Utente == 'CI') {GeneraBufferCI(DatiAudioRegistrato[Numero], buffer, FunzioneAlTermine); return;}
            /**********************************************************************************************************************************/

            /** Memorizza la clip **/
            DatiAudioRegistrato[Numero].buffer = buffer;

            /** Verifica se era prevista una funzione al termine del precaricamento di tutte le clip considerate **/
            VerificaFunzioneAlTerminePrecaricamento();

            /** Se richiesto di memorizzare il solo buffer, manda la funzione eventualmente passata e termina **/
            if (SoloBuffer) {FunzioneAlTermine(); return;}

            /** Effettua le ulteriori operazioni sulla clip **/
            OperazioniAlBufferCaricato(Numero, FunzioneAlTermine);

            /** Se non è stata passata una funzione al termine del precaricamento di tutte le clip considerate, ma si sta facendo il precaricamento leggero, trova tutte le clip che devono avere lo stesso buffer e glielo assegna **/
            if (!FunzioneAlTerminePrecaricamento) {
                DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione].forEach((da) => {if (!da.buffer) {da.buffer = buffer; OperazioniAlBufferCaricato(da.numero);}});
            }

            /** In caso di riproduzione in corso, attiva la riproduzione delle clip appena caricate **/
            if (RiproduzioneInCorso) {FunzioneRiproduzioneClip = RiproduciClipInSync;}

        }).catch((err) => {
            /** In caso di errore nel caricamento: **/
            console.log(err, datiAudio.NumeroUnivoco, datiAudio.Registrazione);
            /* Se in modalità streaming avvisa soltanto */
            if (ModalitaStreaming) {Messaggio(strErroreCaricamentoClip); return;}

            if (datiAudio.Durata) {
                Messaggio(strErroreCaricamentoClip + " " + err);
            } else {
                /* Se la prima volta che prova a caricarlo fallisce, flagga l'audio come danneggiato */
                AJAX("AggiornaAudioDanneggiato.php", "N=" + datiAudio.NumeroUnivoco + "&Info=" + encodeURIComponent(err + " - " + datiAudio.infoAggiuntive),
                    () => {/* Passa avanti col caricamento 
                        if (!CaricamentoInizialeTerminato) {AggiornaCaricamentoClip();}*/
                        /* Lo manda nel cestino, così non interferisce con i caricamenti (tanto non verrà più aggiornato) */
                        datiAudio.Rimosso = true; datiAudio.danneggiato = true;
                    }, "", "", true);
            }
        });
    });
}

function VerificaFunzioneAlTerminePrecaricamento() {
    if (FunzioneAlTerminePrecaricamento) {
        /* Manda la funzione una volta precaricate tutte le clip */
        if (++ContatoreClipPrecaricate >= totClipDaPrecaricare) {setTimeout(FunzioneAlTerminePrecaricamento, 100);}
    } else {
        /* Precarica clip successiva */
        setTimeout(PrecaricaClipSuccessiva, 100 + (200 * SistemaAttualeAndroid));
    }
}

function OperazioniAlBufferCaricato(Numero, FunzioneAlTermine = () => {}) {
    const datiAudio = DatiAudioRegistrato[Numero];
    
    /** Attiva la clip se si sta riproducendo **/
    if (RiproduzioneInCorso) {VerificaClipDaRiprodurre(Numero, VideoGuidaMinutaggioCorrente());}

    /** Visualizza graficamente il caricamento della clip **/
    VisualizzaELTBufferCaricato(Numero);

    /** Aggiorna i secondi del parlato per la clip da ascoltare **/
    AggiornaAudioDaAscoltare(datiAudio);

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
    if (ELT) {ELT.iStyle({opacity: OpacitaClipCaricata, transform: ""});}
}

function VisualizzaELTBufferScaricato(Numero) {
    const ELT = document.getElementById('ELTReg' + Numero);
    if (ELT) {ELT.style.opacity = OpacitaClipNonCaricata;}
}

function GeneraBufferCI(datiAudio, buffer, FunzioneAlTermine = () => {}) {
    function EseguiFunzioniAlTermineCaricamentoBufferCI() {
        VerificaFunzioneAlTerminePrecaricamento();
        AggiornaRiproduzioneClip(datiAudio.numero);
        FunzioneAlTermine();
    }

    function TrovaSpezzoneVicino(datiAudio, distanza) {
        return DatiAudioRegistrato.find(el => ((!el.disattivato) && (el.numBloccoCI == datiAudio.numBloccoCI) && (el.numSpezzone == (+datiAudio.numSpezzone) + (+distanza))));
    }

    const b = buffer, SampleRate = b.sampleRate, numCanali = b.numberOfChannels, lunghezzabytetempomix = tempomixCIPrec * SampleRate;

    if ((datiAudio_SpezzonePrecedente = TrovaSpezzoneVicino(datiAudio, -1)) && (VideoGuidaMinutaggioCorrente() < datiAudio.minutaggiodefault)) {
        async function AggiungiPezzoMix() {
            if (!datiAudio_SpezzonePrecedente.buffer) {if (!RiproduzioneInCorso && !FunzioneAlTerminePrecaricamento) {datiAudio.RichiestoCaricamentoBuffer = false; return;} console.log("AggiungiPezzoMix()", "minutaggio corrente:", new MinutiESecondi(VideoGuidaMinutaggioCorrente()), "spezzone CI:", datiAudio.NumeroUnivoco, "minutaggio spezzone CI:", new MinutiESecondi(datiAudio.minutaggiodefault), "Attesa buffer spezzone", datiAudio_SpezzonePrecedente.NumeroUnivoco); await pausa(500); datiAudio_SpezzonePrecedente = TrovaSpezzoneVicino(datiAudio, -1); AggiungiPezzoMix(); return;} // Attende che abbia caricato il buffer dello spezzone precedente prima di continuare.

            /* Aggiunge l'ultimo pezzo del buffer precedente */
            datiAudio.buffer = appendBuffer([datiAudio_SpezzonePrecedente.bufferdalegare, b]);
            
            datiAudio.MinutaggioRegistrazione = (+datiAudio_SpezzonePrecedente.MinutaggioRegistrazione) + (+datiAudio_SpezzonePrecedente.Durata) - datiAudio_SpezzonePrecedente.bufferdalegare.duration;

            /* Fade-in */
            for(c = 0; c < numCanali; c++) {
                bufferCanale = datiAudio.buffer.getChannelData(c);
                for(s = 0; s < lunghezzabytetempomix; s++) {
                    bufferCanale[s] *= s / lunghezzabytetempomix;
                }
            }

            TerminaBufferCI();
        }
        AggiungiPezzoMix();

    } else {
        datiAudio.MinutaggioRegistrazione = datiAudio.minutaggiodefault;
        datiAudio.buffer = b;
        TerminaBufferCI();
    }
    
    function TerminaBufferCI() {
        datiAudio.Durata = datiAudio.taglioFinale = datiAudio.buffer.duration;

        if (TrovaSpezzoneVicino(datiAudio, 1)) {
            const LunghezzaBuffer = datiAudio.buffer.length;
            datiAudio.bufferdalegare = appendBuffer([datiAudio.buffer], LunghezzaBuffer - lunghezzabytetempomix - 1);

            /* Fade-out */
            for(c = 0; c < numCanali; c++) {
                bufferCanale = datiAudio.buffer.getChannelData(c);
                for(s = lunghezzabytetempomix; s >= 0; s--) {
                    bufferCanale[LunghezzaBuffer - s - 1] *= s / lunghezzabytetempomix;
                }
            }

        } else {
            if (datiAudio.effettuareFadeOutCI) {
                /* Fade-out se ultimo spezzone di colonna internazionale (v. CaricaColonnaInternazionale) */
                const LunghezzaBuffer = datiAudio.buffer.length;
                const lunghezzabytemixCIeOriginale = MixCIeOriginale.tempoFadeOutCI * SampleRate;
                for(c = 0; c < numCanali; c++) {
                    bufferCanale = datiAudio.buffer.getChannelData(c);
                    for(s = lunghezzabytemixCIeOriginale; s >= 0; s--) {
                        bufferCanale[LunghezzaBuffer - s - 1] *= s / lunghezzabytemixCIeOriginale;
                    }
                }
            }
        }
    
        console.log("Spezzone CI", datiAudio.NumeroUnivoco, "minutaggio", new MinutiESecondi(datiAudio.MinutaggioRegistrazione), "durata", datiAudio.Durata);
        
        EseguiFunzioniAlTermineCaricamentoBufferCI();
    }
}

function CI_DisattivaAudioOriginaleAlPlay(datiAudio) {
    datiAudio.alPlay.push({FunzioneAlPlay: CI_DisattivaAudioOriginale, latenzaEventoAlPlay: {secondi: +MixCIeOriginale.latenzaDisattivazioneOriginale, riduciSeClipNelMinutaggio: false}});
}

function CI_AttivaAudioOriginalePocoPrimaDelTermine(datiAudio) {
    datiAudio.alPlay.push({FunzioneAlPlay: CI_AttivaAudioOriginale, latenzaEventoAlPlay: {daltermine: -MixCIeOriginale.anticipoFadeInOriginale, riduciSeClipNelMinutaggio: true}});
}

function PosizioneAttualeDatiCI(secondisucc = 0) {
    const Minutaggio = (+VideoGuidaMinutaggioCorrente()) + (+secondisucc);
    return DatiCI.find(el => ((el.Partenza <= Minutaggio) && (Minutaggio <= (DatiCI[+DatiCI.indexOf(el) + 1] || {Partenza: totDurataVideoGuida}).Partenza)));
}

function AutoCI_VerificaPresenzaClip(DatiAudioConsiderati) {
    const MinutaggioCorrente = VideoGuidaMinutaggioCorrente(), totDatiAudioConsiderati = DatiAudioConsiderati.length;
    for (let I = 0; I < totDatiAudioConsiderati; I++) {
        const datiAudio = DatiAudioConsiderati[I];
        if (datiAudio.iniziobattuta && !datiAudio.Rimosso && !datiAudio.Escluso && !TracceEscluse.includes(datiAudio.ID_Utente) && ((datiAudio.iniziobattuta - 0.4) < MinutaggioCorrente) && (MinutaggioCorrente < datiAudio.finebattuta)) {return true;}
    }
    return false;
}

function AutoCI_AttivaAudioOriginale(datiAudioConsiderato) {
    if (ColonnaInternazionaleAttivata && RiproduzioneInCorso && (DatiCIAttuale = PosizioneAttualeDatiCI()).AutoCI) {
        da = DatiAudioRegistrato.slice(); da.splice(datiAudioConsiderato.numero, 1);
        if (AutoCI_VerificaPresenzaClip(da)) {return;}
        console.log("Non trovate altre clip nel minutaggio corrente, attivo audio originale.");
        CI_VolumeAudioOriginale(DatiCIAttuale);
    }
}

function CI_AttivaAudioOriginale() {
    if (ColonnaInternazionaleAttivata && RiproduzioneInCorso) {
        const DatiCIAttuale = PosizioneAttualeDatiCI(+MixCIeOriginale.anticipoFadeInOriginale + 0.1);
        if (CI_CondizioniAudioOriginaleDisattivato(DatiCIAttuale)) {return;}
        CI_VolumeAudioOriginale(DatiCIAttuale);
    }
}

function CI_VolumeAudioOriginale(DatiCIAttuale) {
    const Volume = DatiCIAttuale.VolumeVideoGuida;
    if (SistemaAttualeAndroid) {ImpostaVolumeAudioOriginale(Volume);} else {FadeInVolumeAudioOriginale(Volume);}
}

function AutoCI_DisattivaAudioOriginale() {
    if (ColonnaInternazionaleAttivata && RiproduzioneInCorso && PosizioneAttualeDatiCI().AutoCI) {VideoGuidaImpostaVolume(0);}
}

function CI_DisattivaAudioOriginale() {
    if (ColonnaInternazionaleAttivata && RiproduzioneInCorso) {VideoGuidaImpostaVolume(0);}
}

function DeterminaVolumeVideoGuidaPerCI() {
    if (ColonnaInternazionaleAttivata) {
        const DatiCIAttuale = PosizioneAttualeDatiCI();
        if (CI_CondizioniAudioOriginaleDisattivato(DatiCIAttuale)) {
            VideoGuidaImpostaVolume(0);
        } else {
            ImpostaVolumeAudioOriginale(DatiCIAttuale.VolumeVideoGuida);
        }
    }
}

function CI_CondizioniAudioOriginaleDisattivato(DatiCIAttuale) {
    return (!DatiCIAttuale || DatiCIAttuale.CI || (DatiCIAttuale.AutoCI && AutoCI_VerificaPresenzaClip(DatiAudioRegistrato)));
}

function CalcolaVolumeAudioOriginale(Volume) {
    return Volume * (AudioBufferColonnaInternazionale.length ? GuadagnoPrincipale[AudioBufferColonnaInternazionale[0].numero].gain.value : slideVolumeVideoGuida.value);
}

function ImpostaVolumeAudioOriginale(Volume) {
    VideoGuidaImpostaVolume(CalcolaVolumeAudioOriginale(Volume));
}

function FadeInVolumeAudioOriginale(Volume) {
    const VolumeFinale = CalcolaVolumeAudioOriginale(Volume), Incremento = (VolumeFinale / MixCIeOriginale.suddivisioneVolumeFadeInOriginale).arrotonda(2);
    var I = 0;
    
    async function FadeIn() {
        I = ((+I) + (+Incremento)).arrotonda(2);
        const CondizioneMassima = (I < VolumeFinale), v = (I * CondizioneMassima) + (VolumeFinale * !CondizioneMassima);
        VideoGuidaImpostaVolume(v);
        await pausa(10);
        if (v < VolumeFinale) {FadeIn();}
    }

    FadeIn();
}

/*** Interfaccia gestione Colonna Internazionale ***/
const strDatiCIDefault = JSON.stringify([{Partenza: 0, VolumeVideoGuida: 0}]);

function AggiornaRappresentazioneColonnaInternazionale(AggiornaSeModificato = false) {
    const strDatiCI = JSON.stringify(DatiCI);
    if (strDatiCI == AggiornaRappresentazioneColonnaInternazionale.strDatiCIPrec) {return;}

    const id_divCI = 'Traccia' + (NumeroTotaleTracce - 1).toString(), totDatiCI = DatiCI.length;
    TracciaCI = document.getElementById(id_divCI); TracciaCI.innerHTML = "";
    
    function PercentualeMinutaggio(Minutaggio) {return (Minutaggio / totDurataVideoGuida * 100).toString() + "%, ";}

    function GestisciSceltaOpzioneCI(dato) {
        const NumeroSegmentoCI = parseInt(dato);
        if (dato.indexOf("V") > -1) {const BloccoCI = DatiCI[+NumeroSegmentoCI]; BloccoCI.VolumeVideoGuida = Number(dato.slice(-1)); BloccoCI.AutoCI = (dato.indexOf("A") > -1); SalvaEAggiornaColonnaInternazionale(); return;}
        if (dato.indexOf("MCI") > -1) {ApriFinestraCI_e_monitora({currentTarget: {dataset: {larghezza: 950, altezza: 600, link: "UploadCI.php?N=" + N + "&SegmentoCI=" + NumeroSegmentoCI + "&DurataVideoGuida=" + Math.floor(totDurataVideoGuida), nomefinestra: "ColonnaInternazionale"}}});}
    }
    
    OpzioneAutoCI = false;
    var strSfondo = "", percPartenza = PercentualeMinutaggio(InizioVideoGuida), MenuADiscesa = [];
    for (let I = 0; I < totDatiCI; I++) {
        const BloccoCI = DatiCI[I], colore = (BloccoCI.CI ? "rgba(0, 150, 0, 0.5)" : (BloccoCI.AutoCI? "rgba(200, 200, 255, 0.5)" : `rgba(255, 255, 255, ${BloccoCI.VolumeVideoGuida})`)) + " ", percTermine = PercentualeMinutaggio((DatiCI[+I + 1] || {Partenza: totDurataVideoGuida}).Partenza);
        strSfondo += colore + percPartenza + colore + percTermine;

        MenuADiscesa.push({DoveInserirlo: id_divCI, ID_Menu: 'pulMenuCI' + I, stiliContenitore: {position: "absolute", left: percPartenza.slice(0, -2), width: `calc(${percTermine.slice(0, -2)} - ${percPartenza.slice(0, -2)})`, margin: 0}, stiliMenu: {position: "sticky", left: ContenitoreRighello.style.left, textAlign: "left", color: ((BloccoCI.CI || BloccoCI.VolumeVideoGuida == 0) ? "white" : "black"), fontWeight: (BloccoCI.CI ? "bold" : ""), backgroundColor: colore, width: "fit-content", maxWidth: "100%", minWidth: "20px", overflow: "hidden", textOverflow: "ellipsis"},
            Elementi: (BloccoCI.CI
                        ? [{dato: I + "CI", stringa: strOpzCI_CICaricata, predefinito: true, nascosto: true}, {dato: I + "MCI", stringa: "<span class='fa fa-edit'></span> " + strOpzCI_CIModifica}]
                        : [{dato: I + "V1", stringa: "<span class='fa fa-volume-up'></span> " + strOpzCI_V1, predefinito: (!BloccoCI.AutoCI && ((BloccoCI.VolumeVideoGuida || 0) > 0))}, {dato: I + "VA1", stringa: "<span class='fa fa-unlink'></span> " + strOpzCI_VA1, predefinito: BloccoCI.AutoCI}, {dato: I + "V0", stringa: "<span class='fa fa-volume-off'></span> " + strOpzCI_V0, predefinito: (!BloccoCI.AutoCI && ((BloccoCI.VolumeVideoGuida || 0) == 0))}, {dato: I + "MCI", stringa: "<span class='fa fa-upload'></span> " + strOpzCI_CICarica}]),
            FunzioneAlClick: GestisciSceltaOpzioneCI
        });

        OpzioneAutoCI += (BloccoCI.AutoCI || 0);

        percPartenza = percTermine;
    }

    const colorePorzioneTagliata = "rgb(200, 200, 200)";
    TracciaCI.iStyle({backgroundImage: `linear-gradient(90deg, ${colorePorzioneTagliata} 0%, ${colorePorzioneTagliata} ${PercentualeMinutaggio(InizioVideoGuida)} ${strSfondo.slice(0, -2)})`, backgroundSize: "100% 1%"});
    CreaMenuADiscesa(MenuADiscesa);

    AggiornaRappresentazioneColonnaInternazionale.strDatiCIPrec = strDatiCI;
    clearInterval(ApriFinestraCI_e_monitora.tmr);

    if (AggiornaSeModificato) {AggiornaCIModificata();}
}
AggiornaRappresentazioneColonnaInternazionale.strDatiCIPrec = "";

function AggiornaCIModificata() {
    DisattivaVecchiaCI();
    CaricaColonnaInternazionale({volume: VolumeAttualeCI()});
    if (FunzioneAlTerminePrecaricamento) {FunzioneAlTerminePrecaricamento();}  // Se è PlayVideoGuida() rifarà la verifica delle clip da precaricare.
}

function SalvaEAggiornaColonnaInternazionale() {
    const strDatiCI = JSON.stringify(DatiCI), DatiDaSalvare = ((strDatiCI == strDatiCIDefault) ? "" : strDatiCI);
    AJAX("SalvaCI.php", "N=" + N + "&ListaCI=" + encodeURIComponent(DatiDaSalvare) + "&SoloParametri=1", "", "", "", true);
    AggiornaRappresentazioneColonnaInternazionale();
    if (RiproduzioneInCorso) {DeterminaVolumeVideoGuidaPerCI();}
}

function ApriFinestraCI_e_monitora(e) {
    ApriFinestra(e);
    clearInterval(ApriFinestraCI_e_monitora.tmr);
    AbilitaTracciaCI(false);
    ApriFinestraCI_e_monitora.tmr = setInterval(() => {AJAX("AttivitaFinestraCI.php", "", (Dati) => {if (((new Date().getTime() / 1000) - Dati.DataUltimoRilevamentoFinestraCI) > 10) {AcquisisciNuovaCI(); clearInterval(ApriFinestraCI_e_monitora.tmr);}}, "", "", true);}, 3000);
}
ApriFinestraCI_e_monitora.tmr = false;

function DisattivaVecchiaCI() {
    AudioBufferColonnaInternazionale.forEach((datiAudio) => {datiAudio.disattivato = true;});
}

function AcquisisciNuovaCI() {
    AJAX("AcquisisciPercorsoCI.php", "NumProgetto=" + N,
        (Dati) => {
            DatiCI = Dati.DatiCI;
            if (TracciaCI) {AggiornaRappresentazioneColonnaInternazionale(true); AbilitaTracciaCI(true);} else {AggiornaCIModificata();}
        }, "", "", true
    );
}

function AbilitaTracciaCI(Abilita) {
    TracciaCI.abilita(Abilita);
    TracciaCI.style.opacity = 0.4 + (0.6 * Abilita);
}
/***************************************************/


function ScaricaMemoria_slow() {
    setTimeout(ScaricaMemoria, RitardoScaricoMemoriaClip);
}

function ScaricaMemoria(AncheSuccessivi = false) {
    const MinutaggioVideo = VideoGuidaMinutaggioCorrente(), totAudio = DatiAudioRegistrato.length;
    for (let I = 0; I < totAudio; I++) {
        const datiAudio = DatiAudioRegistrato[I];
        if (datiAudio.buffer && (!datiAudio.nonscaricarebuffer) && (((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioFinale) < MinutaggioVideo) || (AncheSuccessivi && ((+datiAudio.MinutaggioRegistrazione) > MinutaggioVideo)))) {
            datiAudio.audio = null; datiAudio.buffer = null; datiAudio.bufferdalegare = null; datiAudio.RichiestoCaricamentoBuffer = false;
            VisualizzaELTBufferScaricato(datiAudio.numero);
        }
    }
}

function DisabilitaSchermata(ImmagineAttesa) {
	Righello.dataset.DisattivaClick = "si"; OpacitaRighello(0.5); clearInterval(tmrAggiornaClip);
    pulMessaggioVocale.abilita(false);
	DisabilitaElementiGenerali(true);
    PlayPausaCliccandoSulVideo(false);
	DisabilitaElementiRegistrazione(true);
    ContenitoreCopione.FunzioniCopione.DisattivaCopione();
	if (ImmagineAttesa) {AttivaImmagineAttesa();} else {EliminaImgAttesa();}
}

function RiabilitaSchermata(Aggiorna) {
	Righello.dataset.DisattivaClick = "no"; OpacitaRighello(0.5 + (0.5 * !document.getElementById(ID_Opzioni))); AttivaAggiornamentoClip();
    pulMessaggioVocale.abilita(MessaggiIstantaneiAttivi && !MessaggioIstantaneoInRiproduzione);
	DisabilitaElementiGenerali(false);
    PlayPausaCliccandoSulVideo(true);
	DisabilitaElementiRegistrazione(SolaVisione);
	EliminaImgAttesa();
    ContenitoreCopione.FunzioniCopione.RiattivaCopione();
	if (Aggiorna && !ModalitaStreaming) {AggiornaClip();}
}

function DisabilitaElementiGenerali(Disabilita) {
    pulPlay.disabled = Disabilita; MinutaggioMinuti.readOnly = Disabilita; MinutaggioSecondi.readOnly = Disabilita; opzFunzionalitaPreRegistrazione.disabled = Disabilita; inputCountdownRegistrazione.disabled = Disabilita; checkAscoltaClipDuranteRegistrazione.disabled = Disabilita; FinestraVideoGuida.slideMinutaggioAttuale.disabled = Disabilita; FinestraVideoGuida.ControlliInSovrimpressione.abilita(!Disabilita); FinestraVideoGuida.pulPlayInSovrimpressione.style.display = (Disabilita ? "none" : "");

    divSelettoreMicrofono.abilita(!Disabilita); divOpzioniRegistrazione.abilita(!Disabilita);
    if (ContenitoreStrumenti && !document.getElementById(ID_Opzioni)) {ContenitoreStrumenti.abilita(!Disabilita);}
    document.getElementById('pulEsci').abilita(!Disabilita);
}

function DisabilitaElementiRegistrazione(Disabilita) {
    pulRegistra.disabled = Disabilita;
}

function AttivaImmagineAttesa(Tipo = 'default') {
    const TipoAnimazione = {'default': "<div class='sk-chase'><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div><div class='sk-chase-dot'></div></div>", 'TrePunti': '<div class="sk-flow"><div class="sk-flow-dot"></div><div class="sk-flow-dot"></div><div class="sk-flow-dot"></div></div>', 'Pulse': ' <div class="sk-pulse"></div>', 'TreCubi': ' <div class="sk-wander"><div class="sk-wander-cube"></div><div class="sk-wander-cube"></div><div class="sk-wander-cube"></div><div class="sk-wander-cube"></div></div>'};
    tmrImmagineAttesa = window.setTimeout(() => {imgAttesa.innerHTML = TipoAnimazione[Tipo];}, 300);
}

function EliminaImgAttesa() {
    imgAttesa.innerHTML = ""; clearTimeout(tmrImmagineAttesa);
}

function ImmagineAttesaVideoGuida(Attiva) {
    const imgAttesaVideoGuida = FinestraVideoGuida.document.getElementById('imgAttesaVideoGuida');
    if (Attiva) {
        if (!imgAttesaVideoGuida) {div = FinestraVideoGuida.document.createElement('div'); div.id = 'imgAttesaVideoGuida'; div.innerHTML = '<div class="sk-circle-fade"><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div><div class="sk-circle-fade-dot"></div></div>'; div.iStyle({position: "absolute", top: "60%", left: "50%"}); FinestraVideoGuida.document.getElementById('ContenitoreVideoGuida').append(div);}
    } else {
       EliminaElemento(imgAttesaVideoGuida);
    }
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
    const divCanvas = CreaElemento('div', 'divCanvasMessaggioVocale', document.body.id); divCanvas.iStyle({position: "fixed", bottom: "20%", left: "calc(50% - 100px)", height: "50px", width: "200px", zIndex: 100000});
        const canvasOndaMessaggioVocale = CreaElemento('canvas', 'canvasOndaMessaggioVocale', divCanvas.id), canvasMVCtx = canvasOndaMessaggioVocale.getContext("2d"); canvasOndaMessaggioVocale.height = 50; canvasOndaMessaggioVocale.width = 200; canvasOndaMessaggioVocale.iStyle({borderRadius: "5px", opacity: 0.8});
        CreaElemento('p', 'pCanvasMessaggioVocale', divCanvas.id, Didascalia).iStyle({textAlign: 'center', fontWeight: 'bold', background: "rgba(255, 255, 255, 0.8)", borderRadius: "5px"});

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

    GeneraOndaSonoraMessaggioVocale.termina = () => {clearInterval(GeneraOndaSonoraMessaggioVocale.tmr); EliminaElemento(divCanvas); analizzatoreAudio = false;}
}
GeneraOndaSonoraMessaggioVocale.tmr = false;
GeneraOndaSonoraMessaggioVocale.termina = () => {};

function RegistraMessaggioVocale_slow() {
    pulMessaggioVocale.className = "btn btn-primary";
    RegistraMessaggioVocale_slow.tmr = setTimeout(RegistraMessaggioVocale, 400);
}
RegistraMessaggioVocale_slow.tmr = false;

function RegistraMessaggioVocale() {
    if (ErroreMicrofono) {Messaggio(strErroreMic + ErroreMicrofono, "A"); return;}
    if (MessaggioIstantaneoInRiproduzione) {return;}

    DisabilitaSchermata(); livelloMic.style.width = 0; pulMessaggioVocale.abilita(true);
    AttivaDisattivaMonitorMic(false);
    if (QualitaAltaRegistrazione) {
        registrazione.port.onmessage = "";
        registrazione.port.postMessage({numCanale: AcquisisciCanaleRegistrazione(), modalita: "Registrazione"});
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
        pulMessaggioVocale.abilita(false);
        ffmpeg_TotaleProcessi = 0; ffmpeg_FunzioneAlTermineProcessi = SalvaMessaggioVocale;
        TrattamentoClip.TaglioFinale.applica = false;
        if (QualitaAltaRegistrazione) {
            registrazione.port.onmessage = ProcessaAudio_AcquisisciRegistrazione;
            registrazione.port.postMessage({numCanale: AcquisisciCanaleRegistrazione(), modalita: "AcquisisciRegistrazione"});
        } else {
            regMediaRecorder.onstop = () => {MandaACreaRegistrazione(CreaRegistrazione_mediaRecorder);};
            try {regMediaRecorder.stop();} catch (err) {RiattivaInterfacciaDopoRegistrazione();}
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
    AJAX("MandaMessaggioIstantaneo.php", CreaParametri({N: N, FileMessaggioIstantaneo: MessaggioVocale, Formato: FormatoFile, Destinatari: UtentiDestinatari}), () => {pulMessaggioVocale.className = "btn btn-default"; pulMessaggioVocale.children[0].className = "fa fa-microphone"; pulMessaggioVocale.abilita(Righello.dataset.DisattivaClick == "no");}, strInvioInCorso, strInviato, true, true);
    setTimeout(AggiornaClip, 500);
}

function CheckMessaggiVocaliIstantanei() {
    AJAX("CaricaMessaggioIstantaneo.php", "N=" + N,
        (Dati) => {
            if (!Dati.FileMessaggioIstantaneo) {CheckMessaggiVocaliIstantanei.tmr = setTimeout(CheckMessaggiVocaliIstantanei, 2500); return;}

            if ((!RegistraMessaggioVocale.RegistrazionePartita) && (!MessaggioIstantaneoInRiproduzione) && (!StoRegistrando)) {
                MessaggioIstantaneoInRiproduzione = true;
                CaricaAudio(0, {Registrazione: Dati.FileMessaggioIstantaneo}, 'arraybuffer',
                    (Contenuto) => {
                        audioContext.decodeAudioData(Contenuto).then((buffer) => {
                            const MI = new AudioBufferSourceNode(audioContext, {buffer: buffer});
                            const compressore = audioContext.createDynamicsCompressor(); compressore.threshold.value = -50; compressore.knee.value = 40;
                            MI.connect(compressore).connect(audioContext.destination);
                            MI.onended = () => {GeneraOndaSonoraMessaggioVocale.termina(); pulMessaggioVocale.abilita(Righello.dataset.DisattivaClick == "no"); AJAX("EliminaMessaggioIstantaneo.php", "ID=" + Dati.ID_MessaggioIstantaneo + "&N=" + N, () => {MessaggioIstantaneoInRiproduzione = false; CheckMessaggiVocaliIstantanei();}, "", "", true);};
                            GeneraOndaSonoraMessaggioVocale(MI, Dati.Nome);
                            pulMessaggioVocale.abilita(false);
                            setTimeout(() => {MI.start();}, 200);
                        });
                    }
                );

            } else {
                if (StoRegistrando) {Messaggio("<b>" + Dati.Nome + "</b>" + strMessaggioVocaleRiprodottoDopoRegistrazione, "OK");}
                if (!MessaggioIstantaneoInRiproduzione) {CheckMessaggiVocaliIstantanei.tmr = setTimeout(CheckMessaggiVocaliIstantanei, 3000);}
            }
        }, "", "", true
    );
}
CheckMessaggiVocaliIstantanei.tmr = false;
/*****************************/

function startRecording() {
    if (ErroreMicrofono) {Messaggio(strErroreMic + ErroreMicrofono, "A"); return;}

    if (MessaggioIstantaneoInRiproduzione) {return;}

    if (document.getElementById(ID_Opzioni)) {Messaggio(strNonSiPuoRegistrareSeFinestraOpzioni); return;}

    if (registrazione == false) {return;}

    console.log("startRecording()");
    /* Inizializza */
    canaleAudio = []; canaleAudio.length = 0; recordedBlobs = []; LunghezzaNuovaRegistrazione = 0; StoRegistrando = true;

    const MonitorMicAttivato = (pulMonitorMic.dataset.attivato == "si");

    if (QualitaAltaRegistrazione) {
        registrazione.port.onmessage = "";
    } else {
        DisconnettiWorkletRegistrazione();
        if (MonitorMicAttivato) {AttivaDisattivaMonitorMic(true);}
    }

    if (!ModalitaUltraLightAttiva) {
        /** Predispone l'anteprima dell'onda sonora **/
        /* Crea l'analizzatore audio */
        analizzatoreAudio = audioContext.createAnalyser();
        sorgenteAudioSelezionata.connect(analizzatoreAudio);
        audioAnalizzato = new Float32Array(analizzatoreAudio.fftSize);

        /* Crea il canvas */
        const IDTraccia = "Traccia" + DatiDoppiatori[ID_Utente].numeroTraccia, c = CreaElemento('canvas', 'canvasOnda', IDTraccia), CT = document.getElementById(IDTraccia), maxLunghezzaCanvas = 4000;
        let lunghezzaCanvas;
        c.iStyle({position: "absolute", top: "0%", height: "100%", left: Cursore.offsetLeft + "px"});
        c.width = ((lunghezzaCanvas = CT.offsetWidth - Cursore.offsetLeft) * (lunghezzaCanvas <= maxLunghezzaCanvas)) + (maxLunghezzaCanvas * (lunghezzaCanvas > maxLunghezzaCanvas)); c.height = CT.offsetHeight;
        CanvasOnda = c; canvasCtx = c.getContext("2d");
    }

    /* Stoppa il filmato e predispone l'interfaccia */
    VideoGuidaRimuoviFunzioneAlTimeUpdate(AggiornaTimeline);
	StopVideoGuida();
    ContenitoreCopione.FunzioniCopione.OpacitaCopioneDisattivato = 1; pulPlay.style.opacity = 0;
    DisabilitaSchermata(true);

    /* Memorizza il minutaggio di partenza della registrazione (utilizzato solo in caso di annullamento per riposizionarsi) */
    MinutaggioPartenzaRegistrazione = VideoGuidaMinutaggioCorrente();

    /* Disabilita monitoraggio microfono */
    livelloMic.iStyle({width: 0, display: "none"});

    /* Impedisce all'utente di intervenire */
    window.removeEventListener('keydown', ScorciatoieTastiera);
    PlayPausaCliccandoSulVideo(false);

    /* Riduce il volume del filmato se troppo alto */
    if ((!ColonnaInternazionaleAttivata) && (slideVolumeVideoGuida.value > 0.8)) {ImpostaVolumeVideoGuida(0.2);}

    /* Visualizza l'interfaccia */
	imgRegistra.style.display = "none"; TestoPulRegistra.style.display = "inline"; TestoPulRegistra.innerHTML = "<span class='fa fa-circle'></span>"; pulRegistra.style.opacity = 1;
    
    /* Attiva la funzionalità di pre-registrazione a seconda della scelta dell'utente */
    if (inputCountdownRegistrazione.value == 0) {opzFunzionalitaPreRegistrazione.selectedIndex = 0;} // Se i secondi sono impostati a zero, lo considera sempre countdown
    switch (opzFunzionalitaPreRegistrazione.value) {
        case "countdown":
            AvviaContoAllaRovesciaRegistrazione(); break;

        case "preroll":
            const MinutaggioCorrente = VideoGuidaMinutaggioCorrente(), MinutaggioPreroll = MinutaggioCorrente - Math.abs(inputCountdownRegistrazione.value), MinutaggioEffettivoPreroll = MinutaggioPreroll * (MinutaggioPreroll > 0);
            inputCountdownRegistrazione.value = (MinutaggioCorrente - MinutaggioEffettivoPreroll) | 0; // Aggiorna i secondi in base al minutaggio effettivo del pre-roll
            if (inputCountdownRegistrazione.value == 0) {opzFunzionalitaPreRegistrazione.selectedIndex = 0; AvviaContoAllaRovesciaRegistrazione(); return;} // Se i secondi effettivi sono pari a zero, diventa countdown
            VideoGuidaImpostaEventoAlTermineCaricamento(AvviaVideoGuidaPreroll);
            VideoGuidaPosizionati(MinutaggioEffettivoPreroll);
            PosizionaCursore(MinutaggioEffettivoPreroll); AggiornaMinutaggioVideo(MinutaggioEffettivoPreroll);
            break;
    }
}

function AvviaContoAllaRovesciaRegistrazione() {
    EliminaImgAttesa();
    if (!checkAscoltaClipDuranteRegistrazione.checked) {DisattivaClipNonCI(true);}
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
            if (!checkAscoltaClipDuranteRegistrazione.checked) {StoppaTutteLeRegistrazioni(true); DisattivaClipNonCI(true);}
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
        registrazione.port.postMessage({numCanale: AcquisisciCanaleRegistrazione(), modalita: "Registrazione"});
    } else {
        regMediaRecorder.start();
    }
    
    pulRegistra.style.animation = ((ModalitaLightAttiva || SistemaAttualeAndroid) ? "" : "blink-registrazione 1200ms ease 1s infinite");
    tmrPulsanteStopRegistrazione = setTimeout(() => {pulStopRegistrazione.disabled = false; window.addEventListener('keydown', ScorciatoieDiTastiera_Registrazione);}, 3000);
}

function AnnullaRegistrazione() {
    regMediaRecorder.onstop = "";
    FermaRegistrazione(); RiabilitaSchermata(true); StoRegistrando = false;
    EliminaAnteprimaOndaSonora();
    if (VideoGuidaMinutaggioCorrente() != MinutaggioPartenzaRegistrazione) {window.setTimeout(() => {Posizionati(MinutaggioPartenzaRegistrazione);}, 500);}
    setTimeout(AttivaIngressi, 300);
    Messaggio(strRegistrazioneAnnullata);
}

function FermaRegistrazione() {
    /* Ferma la registrazione (se era partita) */
    if ((regMediaRecorder.stop) && (regMediaRecorder.state != 'inactive')) {regMediaRecorder.stop();}

    /* Ripristina l'interfaccia di default */
    ResettaContoAllaRovescia();
    clearTimeout(tmrPulsanteStopRegistrazione);
    pulPlay.style.opacity = ""; pulStopRegistrazione.disabled = true; pulAnnullaRegistrazione.disabled = true;
    pulRegistra.style.animation = "";
    livelloMic.style.display = "";
    ContenitoreCopione.FunzioniCopione.OpacitaCopioneDisattivato = 0.6;

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
        registrazione.port.postMessage({numCanale: AcquisisciCanaleRegistrazione(), modalita: "AcquisisciRegistrazione"});
    } else {
        ffmpeg_Processi = ["-i clip1 output." + formatoQualitaMedia, "-i clip1 -lavfi \"showwavespic=s=3000x200:colors=blue\" onda.gif"];
        regMediaRecorder.onstop = () => {MandaACreaRegistrazione(CreaRegistrazione_mediaRecorder);};
    }

    FermaRegistrazione();

    var ELT;
    const NumeroTraccia = Number(DatiDoppiatori[ID_Utente].numeroTraccia), id_ELTprovvisorio = 'ELTprovvisorio';
	DisabilitaSchermata(true);
	StoRegistrando = false; NonChiudereFinestra = true;

    DurataUltimaRegistrazione = VideoGuidaMinutaggioCorrente() - MinutaggioUltimaRegistrazione;
    
    if (document.getElementById(id_ELTprovvisorio) == null) {
        ELT = CreaElemento('div', id_ELTprovvisorio, "Traccia" + NumeroTraccia, strInElaborazione);
        ELT.iStyle({position: 'absolute', top: "0%", height: "100%", border: "1px dashed grey", display: 'inline', verticalAlign: 'middle', color: 'grey'});
        InserimentoInProporzioneNellaLineaTemporale(ELT, MinutaggioUltimaRegistrazione, DurataUltimaRegistrazione);
    }
}

function MandaACreaRegistrazione(Funzione) {
	window.setTimeout(Funzione, 300); // La latenza è importante per permettere al pc di elaborare quanto registrato
}

function CreaRegistrazione_mediaRecorder() {
    const fileAudio = new Blob(recordedBlobs, {'type': regMediaRecorder.mimeType});

    const URLBuffer = URL.createObjectURL(fileAudio);
    
    console.log("MediaRecorder", URLBuffer, regMediaRecorder.mimeType);

    CaricaAudio(0, {Registrazione: URLBuffer}, 'arraybuffer',
        function (Contenuto) {
            /* Per una resa più fedele, l'audio viene decodificato in audiobuffer e trasformato in un arraybuffer formato audio wav prima di essere convertito nel formato desiderato */
            audioContext.decodeAudioData(Contenuto).then((buffer) => {
                var ConversioneWav = audiobufferToWav(buffer.getChannelData(AcquisisciCanaleRegistrazione()), buffer.sampleRate);

                if (ffmpeg_TotaleProcessi > 0) {
                    initWorker();
                    sampleAudioData = new Uint8Array(ConversioneWav);
                    runCommand(ffmpeg_Processi[0]);
                    if (ffmpeg_TotaleProcessi == 2) {setTimeout(() => {runCommand(ffmpeg_Processi[1]);}, 1000);}
                    Messaggio(strCaricamentoInCorso); ComparsaBarraCaricamento();
                    BC.style.transition = "all 10s"; VisualizzaProgressoBarraCaricamento(BC, 0.5);
                    
                } else {
                    ffmpeg_FunzioneAlTermineProcessi(ConversioneWav);
                }
            });
            URL.revokeObjectURL(URLBuffer);
        }
    );

    recordedBlobs = [];
}

/*** Codifica un audiobuffer in un arraybuffer formato audio wav ***
 * codice di mattdesl https://github.com/Jam3/audiobuffer-to-wav/blob/master/index.js */
function audiobufferToWav(buffer, sampleRate, opt) {
    function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
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
      
    function writeFloat32 (output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 4) {
            output.setFloat32(offset, input[i], true)
        }
    }
      
    function floatTo16BitPCM (output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]))
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
    }
      
    function writeString (view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i))
        }
    }


    opt = opt || {};
    const numChannels = 1, format = (opt.float32 ? 3 : 1), bitDepth = (format === 3 ? 32 : 16);

    return encodeWAV((opt.notrattamento? buffer : EffettuaTrattamentoAudio(buffer, sampleRate)), format, sampleRate, numChannels, bitDepth);
}

function EffettuaTrattamentoAudio(buffer, sampleRate) {
    CentraOndaSonora(buffer);

    /** Auto taglia silenzi iniziali (se attivato) **/
    if (opzTagliaSilenzi.checked) {
        taglioiniziale = buffer.indexOf(buffer.find((a) => {return a > TrattamentoClip.AutoTaglioIniziale.SogliaDB;})) - (TrattamentoClip.AutoTaglioIniziale.Tolleranza * sampleRate);
        EffettuatoAutoTaglioIniziale = (taglioiniziale > 0);
        taglioiniziale *= EffettuatoAutoTaglioIniziale;
        buffer = buffer.slice(taglioiniziale);
        SecondiAutoTaglioIniziale = (taglioiniziale / sampleRate);
        MinutaggioUltimaRegistrazione += SecondiAutoTaglioIniziale;
    }

    /** Taglia ultimo pezzo (elimina click del mouse e altri suoni non intenzionali al termine della registrazione) **/
    if (TrattamentoClip.TaglioFinale.applica) {
        buffer = buffer.slice(0, buffer.length - (TrattamentoClip.TaglioFinale.secondi * sampleRate));
    }
    TrattamentoClip.TaglioFinale.applica = true; // Riattiva sempre il taglio finale

    /** Fade-out **/
    if (TrattamentoClip.FadeOut.applica) {
        const lunghezzafadeout = TrattamentoClip.FadeOut.secondi * sampleRate, LunghezzaBuffer = buffer.length;
        for(s = lunghezzafadeout; s >= 0; s--) {
            buffer[LunghezzaBuffer - s - 1] *= s / lunghezzafadeout;
        }
    }
    TrattamentoClip.FadeOut.applica = true; // Riattiva sempre il fade-out

    return buffer;
}

/** Centra l'onda sonora a 0 db **/
function CentraOndaSonora(buffer) {
    const lunghezzaBuffer = buffer.length;
    var somma = 0;
    for(let I = 0; I < lunghezzaBuffer; I++) {
        somma += buffer[I];
    }
    var media = somma / lunghezzaBuffer;
    for(let I = 0; I < lunghezzaBuffer; I++) {
        buffer[I] -= media;
    }
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

    var buffer = flattenArray(canaleAudio, LunghezzaNuovaRegistrazione);
    var ConversioneWav = audiobufferToWav(buffer, sampleRate, {float32: true});
    /****************************/

    if (ffmpeg_TotaleProcessi > 0) {
        // var fileAudio = new Blob([ConversioneWav], { type: 'audio/wav' }); var URLBuffer = URL.createObjectURL(fileAudio); console.log(URLBuffer);
        initWorker();
        sampleAudioData = new Uint8Array(ConversioneWav);
        runCommand(ffmpeg_Processi[0]);
        if (ffmpeg_TotaleProcessi == 2) {setTimeout(() => {runCommand(ffmpeg_Processi[1]);}, 1000);}
        Messaggio(strCaricamentoInCorso); ComparsaBarraCaricamento();
        BC.style.transition = "all 10s"; VisualizzaProgressoBarraCaricamento(BC, 0.5);

    } else {
        ffmpeg_FunzioneAlTermineProcessi(ConversioneWav);
    }
}

function SalvaNuovaRegistrazione(Contenuto, OndaSonora) {
    const ContenutoRegistrazione = Contenuto.slice(), OndaSonoraRegistrazione = OndaSonora.slice(), MinutaggioAttualeRegistrazione = MinutaggioUltimaRegistrazione, FormatoFile = (QualitaAltaRegistrazione? formatoQualitaAlta : formatoQualitaMedia), InfoAggiuntiveRegistrazione = `${SistemaOperativoAttuale} ${NomeBrowserAttuale} ${VersioneBrowserAttuale} - ${audioContext.sampleRate} Hz - qualità ${(QualitaAltaRegistrazione? "alta" : "media")}, modalità ${(ModalitaLightAttiva? (ModalitaUltraLightAttiva? "ultra light" : "light") : "normale")} - ${(EffettuatoAutoTaglioIniziale? "effettuato auto taglio iniziale per circa " + (SecondiAutoTaglioIniziale).arrotonda(1) + "sec." : "nessun auto taglio iniziale.")} ${VersioneJS}`;
    RiattivaInterfacciaDopoRegistrazione();
    clearInterval(tmrAggiornaClip); EliminaAnteprimaOndaSonora();
    
	AJAX("SalvaNuovaRegistrazione.php", CreaParametri({ "NumProgetto": N, "NumProvino": P, "Utente": ID_Utente, "Registrazione": ContenutoRegistrazione, "MinutaggioRegistrazione": MinutaggioAttualeRegistrazione, "OndaSonora": OndaSonoraRegistrazione, "Formato": FormatoFile, "InfoAggiuntive": InfoAggiuntiveRegistrazione }),
        function () {
            EliminaElemento(document.getElementById('ELTprovvisorio')); setTimeout(AggiornaClip, 100); AttivaAggiornamentoClip(); NonChiudereFinestra = false;
        }, strSalvataggioInCorso, strSalvataggioCompletato, true, true
    );
}

function RiattivaInterfacciaDopoRegistrazione() {
    if (worker) {worker.terminate(); isWorkerLoaded = false; worker = false;}
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
        if (datiAudio.audio && datiAudio.audio.stop) {datiAudio.audio.stop();}
        datiAudio.avviato = false;
        datiAudio.tmrEventoAlPlay.forEach(clearTimeout);
        Guadagno = DisconnettiEffettiAudio(datiAudio.numero);
        CreaDatiGuadagnoPrincipale(datiAudio.numero, Guadagno);
    }
    delete datiAudio.audio;
}

function PlayVideoGuida() {
    if (Math.round(VideoGuidaMinutaggioCorrente()) >= Math.round(totDurataVideoGuida)) {RiproduzioneInCorso = true; Posizionati(InizioVideoGuida); return;}

    if (RiproduzioneInCorso == false) {
        LatenzaAudio = (+audioContext.baseLatency * 2);
        currentTimeIniziale = audioContext.currentTime; orarioIniziale = new Date().getTime();
        clearInterval(tmrAggiornaClip);
        VideoGuidaRimuoviFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
        VideoGuidaFunzioneAlTimeUpdate(FunzioneNormaleAlTimeUpdate);
        ImpostaStatoPlay(true);
        if (ContenitoreCopione.FunzioniCopione.CopioneVisualizzato) {ContenitoreCopione.FunzioniCopione.AttivaTestoGuida();}
        if (StoRegistrando == false) {
            if (VerificaClipPrecaricate(SecondiPrecaricamentoAlPlay) == false) {return;}
            ElaboraClipDaRiprodurre();
            if (ModalitaStreaming) {
                tmrComandiPlayerModalitaStreaming = setTimeout(() => {ComandiPlayer.style.opacity = 0;}, 2000);
                ComandiPlayer.onmousemove = ComandiPlayer_ScomparsaAutomatica;
                FunzioneVisualizzazioneTitoli = VisualizzaTitoliInSync;
            }
            intervalloControllaClipPrecaricate = setInterval(() => {ScaricaMemoria(); VerificaClipPrecaricate(SecondiPrecaricamentoAlPlay, false);}, SecondiPrecaricamentoAlPlay * 1000);
            RiabilitaSchermata();
            VideoGuidaPlay();
            VideoGuidaImpostaEventoBuffering(SospendiRiproduzione, RiprendiRiproduzione);

        } else {
            if (VerificaClipPrecaricate(SecondiPrecaricamentoAlPlayPrimaDiRegistrare) == false) {return;}
            ElaboraClipDaRiprodurre();
            
            DisabilitaSchermata();
            VideoGuidaPlay();
        }
        DeterminaVolumeVideoGuidaPerCI();
    }
}

function StopVideoGuida() {
	if (RiproduzioneInCorso) {
        ImpostaStatoPlay(false);
        StoppaTutteLeRegistrazioni();
        VideoGuidaPause();
        FunzioneAlTerminePrecaricamento = false;
        AttivaAggiornamentoClip();
        VideoGuidaRimuoviEventoBuffering(SospendiRiproduzione, RiprendiRiproduzione);
        clearInterval(intervalloControllaClipPrecaricate);
        clearInterval(PrecaricaClip.tmr);
        ScaricaMemoria(true);
        ContenitoreCopione.FunzioniCopione.DisattivaTestoGuida();
        if (ModalitaStreaming) {ComandiPlayer.onmousemove = ""; ComandiPlayer_Visualizzato();}
	}
}

function ImpostaStatoPlay(StatoPlay) {
    const playpausa = ["play", "pause"], simboloattuale = playpausa[+StatoPlay], simboloprecedente = playpausa[1 - StatoPlay];
    RiproduzioneInCorso = StatoPlay;
    imgPlayPausa.src = "images/" + simboloattuale + "-blue.png";
    FinestraVideoGuida.pulPlayInSovrimpressione.className = FinestraVideoGuida.pulPlayInSovrimpressione.className.replace(simboloprecedente, simboloattuale);
}

function SospendiRiproduzione() {
    StoppaTutteLeRegistrazioni();
}

function RiprendiRiproduzione() {
    ElaboraClipDaRiprodurre();
    if (ModalitaStreaming) {FunzioneVisualizzazioneTitoli = VisualizzaTitoliInSync;}
}

function StoppaTutteLeRegistrazioni(EsclusaCI = false) {
    if (EsclusaCI) {
        DatiAudioRegistrato.forEach((datiAudio) => {if (datiAudio.ID_Utente != 'CI') {StoppaClipAudio(datiAudio);}});
    } else {
        StoppaAutomaticamenteAscoltoInSolo();
        DatiAudioRegistrato.forEach(StoppaClipAudio);
        ClipDaRiprodurre = [];
        if (ModalitaStreaming) {InterrompiTitoli();}
    }
}

/*** Verifica se ci sono clip da precaricare nei prossimi secondi ***
 * se ci sono attende il precaricamento di esse prima di avviare il video e dopo fa partire il precaricamento leggero delle successive
 * se non ce ne sono fa soltanto partire il precaricamento leggero delle successive */
function VerificaClipPrecaricate(SecondiMinimiClipPrecaricate, PrecaricamentoLeggero = true) {
    const totAudio = DatiAudioRegistrato.length, MinutaggioVideo = VideoGuidaMinutaggioCorrente(), MinutaggioClipPrecaricate = MinutaggioVideo + SecondiMinimiClipPrecaricate;

    for (var I = 0; I < totAudio; I++) {
        if (ClipDaPrecaricare(I, MinutaggioVideo, MinutaggioClipPrecaricate)) {
            AttivaImmagineAttesa(); DisabilitaComandiPerRiprodurre(true); StopVideoGuida(); PrecaricaClip(MinutaggioVideo, MinutaggioClipPrecaricate, PlayVideoGuida);
            return false;
        }
    }

    if (PrecaricamentoLeggero) {setTimeout(() => {PrecaricaClip(MinutaggioClipPrecaricate);}, 100);}

    return true;
}

function DisattivaClipNonCI(Disattiva) {
    DatiAudioRegistrato.forEach((datiAudio) => {
        if (datiAudio.ID_Utente != 'CI') {datiAudio.disattivato = Disattiva;}
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
    ( (!ClipDaRiprodurre.includes(I)) && (datiAudio.buffer) && (!datiAudio.disattivato) && (!datiAudio.Rimosso) && (!datiAudio.Escluso) && (!TracceEscluse.includes(datiAudio.ID_Utente)) && (MinutaggioVideo < ((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioFinale))) && (ClipDaRiprodurre.push(I) && CreaClipAudio(I)) );
}

function StoppaEventualeRegistrazione() {
    if (StoRegistrando) { stopRecording(); } else { StopVideoGuida(); }
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
    const Volume = Number(e.currentTarget.value);
    document.getElementById('OpzioniClipTabellaOpzioniRigaVolumeCasella').value = (Volume * 100) | 0;

    ELTDaModificare.forEach((clipELT) => {
        CambiaVolumeClip(clipELT.dataset.RiferimentoRegistrazione, Volume);
    });
}

function evcasella_CambiaVolumeClip(e) {
    const Volume = Math.abs(e.currentTarget.value / 100);
    document.getElementById('OpzioniClipTabellaOpzioniRigaVolumeSlide').value = Volume;

    ELTDaModificare.forEach((clipELT) => {
        CambiaVolumeClip(clipELT.dataset.RiferimentoRegistrazione, Volume);
    });
}

function CambiaVolumeClip(Numero, Volume) {
    /* Aggiorna il controller del guadagno */
    GuadagnoPrincipale[Numero].gain.value = Number(Volume);

    /* Visualizza graficamente l'onda sonora in base al guadagno */
    if (!ModalitaStreaming) {VisualizzaAmpiezzaOndaSonora(Numero);}
}

function VisualizzaAmpiezzaOndaSonora(Numero) {
    const OndaSonoraVisualizzata = document.getElementById("ELTReg" + Numero + "OndaSonora");
    if (OndaSonoraVisualizzata) {const percVolume = (GuadagnoPrincipale[Numero].gain.value * 100) | 0; OndaSonoraVisualizzata.iStyle({height: percVolume + "%", top: ((100 - percVolume) / 2) + "%"});}
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

/*** Visualizzazione grafica taglio clip ***
 * Visualizza graficamente il taglio della clip, visualizzando l'onda sonora completamente oppure solo per la parte tagliata a seconda del parametro globale impostato oppure indicando tale parametro di volta in volta.
 * @param {Number}  Numero          il numero della clip
 * @param {Boolean} OndaCompleta    (facoltativo) true: visualizza l'onda sonora completa, false: visualizza solo l'onda sonora relativa alla parte tagliata. Se il parametro non viene passato, si comporta in base al parametro globale impostato. */
function VisualizzazioneGraficaTaglioClip(Numero, OndaCompleta = VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta) {
    const datiAudio = DatiAudioRegistrato[Numero], StratoColore = document.getElementById('ELTReg' + datiAudio.numero + 'StratoColore'), Contenitore = document.getElementById('ELTReg' + datiAudio.numero + 'Contenuto'), LunghezzaRegistrazione = datiAudio.Durata;

    if (StratoColore) {
        StratoColore.style.left  = (datiAudio.taglioIniziale / LunghezzaRegistrazione * 100) + "%";
        StratoColore.style.right = ((LunghezzaRegistrazione - datiAudio.taglioFinale) / LunghezzaRegistrazione * 100) + "%";
        Contenitore.style.clipPath = (OndaCompleta? "none" : "inset(0% " + StratoColore.style.right + " 0% " + StratoColore.style.left + ")");
    }
}
VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = false;
/*********************************************************/

function DuplicaClip(Numero, FunzioneAlTermine = () => {}) {
    AJAX("DuplicaClip.php", "N=" + DatiAudioRegistrato[Numero].NumeroUnivoco,
        function (Dati) {
            AggiornaClip(() => {
                const ClipNuova = TrovaClip(Dati.N), ClipOriginale = DatiAudioRegistrato[Numero];
                /** Assegna alla nuova clip lo stesso buffer della clip duplicata e la riproduce se siamo in riproduzione **/
                if (ClipOriginale.buffer) {
                    ClipNuova.buffer = ClipOriginale.buffer;
                    OperazioniAlBufferCaricato(ClipNuova.numero);
                    if (RiproduzioneInCorso) {FunzioneRiproduzioneClip = RiproduciClipInSync;}
                }
                
                FunzioneAlTermine(ClipNuova);
            });
        }, strDuplicazioneClip, strClipDuplicata, true
    );
}

function MinutaggioCliccatoNellaClip(X) {
    const DurataClip = DatiAudioRegistrato[ELTCliccato.dataset.RiferimentoRegistrazione].Durata;
    var Minutaggio = (+X + window.scrollX - ContenitoreRighello.offsetLeft - ELTCliccato.offsetLeft) / ELTCliccato.clientWidth * DurataClip;
    return Minutaggio * (Minutaggio > 0) * (Minutaggio < DurataClip) + (DurataClip * (Minutaggio >= DurataClip));
}

function DividiClip_puntatorerilasciato(e) {
    const ELT = ELTCliccato, ClientX = e.clientX || e.touches[0].clientX, MinutaggioPrimoClick = MinutaggioCliccatoNellaClip(+ELT.dataset.posizionePuntatoreInizioTaglio), MinutaggioRilascio = MinutaggioCliccatoNellaClip(ClientX), TrascinatoVersoDestra = MinutaggioPrimoClick < MinutaggioRilascio;
    const secondiInizioTaglio = (TrascinatoVersoDestra? MinutaggioPrimoClick : MinutaggioRilascio), secondiFineTaglio = (TrascinatoVersoDestra? MinutaggioRilascio : MinutaggioPrimoClick);
    EliminaEventiPuntatoreDividiClip();
    VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = false;
    DisabilitaSchermata();

    /*** Se taglio senza trascinamento, si limita a dividere la clip in due senza chiedere niente ***/
    if ((secondiFineTaglio - secondiInizioTaglio) < taglioclip_diffmin) {DividiClip(ELT.dataset.RiferimentoRegistrazione, secondiInizioTaglio, secondiFineTaglio); return;}
    /************************************************************************************************/

    /*** Se taglio con trascinamento, apre la finestrella per conferma operazione effettuata ***/
    const PannelloOpzioni_id = "OpzioniDividiClip";
    function VisualizzaAttenderePrego(PulsanteSelezionato) {
        const PannelloOpzioni = document.getElementById(PannelloOpzioni_id), pulAnnulla = document.getElementById(PannelloOpzioni_id + 'pulAnnulla');
        PannelloOpzioni.abilita(false);
        PulsanteSelezionato.className = 'btn btn-primary';
        pulAnnulla.innerHTML = strAttenderePrego; pulAnnulla.className = 'btn-lg';
    }

    const styleImmagini = "style='float: left; height: 40px; border-radius: 20%;'", classePulsanti = 'btn btn-default btn-lg';
    let Opzioni = [
        document.body.id,
            ['div', {id: PannelloOpzioni_id, className: "panel panel-info"}, {position: "fixed", top: "100px", left: "30%", zIndex: 100000000}],,

            /* Barra del titolo */
                ['div', {textContent: strCosaVuoiFare, className: "panel-heading text-center"}],,
                    ['a', {className: "btn btn-danger fa fa-times", onclick: TerminaDividiClip}, {position: "absolute", top: "5px", left: "10px"}],

            /* Opzioni */
            0,  ['div', {className: "panel-body text-center"}],,
                    ['div'],, ['span', {innerHTML: "<img " + styleImmagini + " src='images/Esempio_taglio_segmento.png' />&nbsp;" + strTagliaViaSelezionato, className: classePulsanti, onclick: EliminaSegmentoSelezionato}, {width: "100%", fontSize: "14pt", margin: "20px 0", lineHeight: 1.8}],
                3,  ['div'],, ['span', {innerHTML: "<img " + styleImmagini + " src='images/Esempio_mantenimento_segmento.png' />&nbsp;" + strTagliaViaIlResto, className: classePulsanti, onclick: MantieniSoloSegmentoSelezionato}, {width: "100%", fontSize: "14pt", marginBottom: "20px", lineHeight: 1.8}],

            /* Annulla */
            0,  ['div', {className: "panel-footer"}],,
                    ['a', {id: PannelloOpzioni_id + "pulAnnulla", innerHTML: "<span class='fa fa-times'></span> " + strAnnullalemodifiche, className: "btn btn-default", onclick: TerminaDividiClip}]
    ];
    
    /* Se la selezione è tutta all'interno della clip, prevede anche la terza opzione: "Separa la zona selezionata dal resto della clip" */
    if ((secondiInizioTaglio > taglioclip_diffmin) && (secondiFineTaglio < (DatiAudioRegistrato[ELT.dataset.RiferimentoRegistrazione].Durata - taglioclip_diffmin))) {
        Opzioni = Opzioni.concat([
                3,  ['div'],, ['span', {innerHTML: "<img " + styleImmagini + " src='images/Esempio_taglio_nuova_clip.png' />&nbsp;" + strTagliaECreaNuovaClip, className: classePulsanti, onclick: CreaNuovaClipDaSegmentoSelezionato}, {width: "100%", fontSize: "14pt", lineHeight: 1.8}]
        ]);
    }

    CreaNuoviElementi(Opzioni);
    
    function EliminaSegmentoSelezionato(e) {
        VisualizzaAttenderePrego(e.currentTarget);
        DividiClip(ELT.dataset.RiferimentoRegistrazione, secondiInizioTaglio, secondiFineTaglio, strSegmentoTagliato);
    }

    function MantieniSoloSegmentoSelezionato(e) {
        const datiAudio = DatiAudioRegistrato[ELT.dataset.RiferimentoRegistrazione];
        datiAudio.taglioIniziale = secondiInizioTaglio; datiAudio.taglioFinale = secondiFineTaglio;
        SalvaModificheClipAudio(datiAudio.numero, () => {AggiornaClip(TerminaDividiClip);});
        AggiornaAudioDaAscoltare(datiAudio);
        VisualizzaAttenderePrego(e.currentTarget);
    }

    function CreaNuovaClipDaSegmentoSelezionato(e) {
        VisualizzaAttenderePrego(e.currentTarget);
        const PrimoTaglio = MinutaggioPrimoClick, SecondoTaglio = MinutaggioRilascio, NumeroClipConsiderata = ELT.dataset.RiferimentoRegistrazione;
        DividiClip(NumeroClipConsiderata, PrimoTaglio, PrimoTaglio, "",
            (ClipNuova) => {
                const ClipDaSuddividere = (TrascinatoVersoDestra? ClipNuova : DatiAudioRegistrato[NumeroClipConsiderata]);
                if (ClipDaSuddividere) {DividiClip(ClipDaSuddividere.numero, SecondoTaglio, SecondoTaglio, strClipSeparata);} else {TerminaDividiClip();}
            }
        );
    }
}

function DividiClip(Numero, secondiInizioTaglio, secondiFineTaglio, MessaggioAlTermine = strClipDivisa, FunzioneAlTermine = TerminaDividiClip) {
     AJAX("DividiClip.php", "N=" + DatiAudioRegistrato[Numero].NumeroUnivoco + "&InizioTaglio=" + encodeURIComponent(secondiInizioTaglio) + "&FineTaglio=" + encodeURIComponent(secondiFineTaglio),
        function (Dati) {
            AggiornaClip(() => {
                const ClipDivisa = DatiAudioRegistrato[Numero];
                var ClipNuova = false;
                if (!Dati.SecondaClipNonCreata) {
                    ClipNuova = TrovaClip(Dati.N);
                    
                    /** Assegna alla nuova clip lo stesso buffer della clip divisa, se siamo in riproduzione aggiorna la riproduzione della clip originale e riproduce la nuova **/
                    if (ClipDivisa.buffer) {
                        ClipNuova.buffer = ClipDivisa.buffer;
                        OperazioniAlBufferCaricato(ClipNuova.numero);
                    }
                }

                AggiornaRiproduzioneClip(Numero);
                AggiornaAudioDaAscoltare(ClipDivisa);

                FunzioneAlTermine(ClipNuova);
            });
        }, strDivisioneClip, MessaggioAlTermine, true
    );
}

function EliminaEventiPuntatoreDividiClip() {
    Righello.removeEventListener('mousemove', AnteprimaSelezioneClip.Visualizza); Righello.removeEventListener('touchmove', AnteprimaSelezioneClip.Visualizza);
    Righello.removeEventListener('mouseup',   DividiClip_puntatorerilasciato);
}

function TerminaDividiClip() {
    AnteprimaSelezioneClip.Elimina();
    EliminaElemento(document.getElementById('OpzioniDividiClip'));
    RiabilitaSchermata();
    CambiaTool(toolStandard); // Onde evitare tagli involontari, torna sempre al tool standard.
}

function TrovaClip(NumeroUnivoco) {
    const totClipAudio = DatiAudioRegistrato.length;
    for (var I = 0; (I < totClipAudio) && (DatiAudioRegistrato[I].NumeroUnivoco != NumeroUnivoco); I++);
    return DatiAudioRegistrato[I] || false;
}

function DownloadTraccia(NumeroTraccia) {
	const ID_UtenteTraccia = document.getElementById('DownloadTraccia' + NumeroTraccia).dataset.utente;
	const Parametri = "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&IDUtente=" + encodeURIComponent(ID_UtenteTraccia);

	AJAX("DownloadTraccia.php", Parametri,
		function (Dati) {
			const NomeFileZip = (NomeProgetto + " - " + NomeDoppiaggio + " - " + strBattute + " " + DatiDoppiatori[ID_UtenteTraccia].nome + ".zip").replace(/[^a-zA-Z0-9\-\. ]/g, "_");
            CreaNuoviElementi(["bodyPagina", ['a', {href: Dati.NomeArchivioZip, download: NomeFileZip}]])[0].click();

			Messaggio(strCreazioneZipCompletata, "OK");
		}, strCreazioneZipInCorso, "", true
	);
}

/*** Escludi/Ripristina Traccia ***
 * Esclude o ripristina una traccia in base all'IDUtente.
 * @param {String} IDUtente la traccia da escludere o ripristinare
 * @param {String} EscludiRipristina (facoltativo) determina se la traccia in questione va esclusa ("Escludi") o ripristinata ("Ripristina"). Se non è indicato nulla, passa al comportamento di default (esclude o ripristina la traccia in base al suo stato precedente). */
function EscludiRipristinaTraccia(IDUtente, EscludiRipristina = "") {
    const pulEscludiRipristinaTraccia = document.getElementById('EscludiRipristinaTraccia' + DatiDoppiatori[IDUtente]?.numeroTraccia);
    
    function CambiaIconaVolume(Stato) {
        const classebtn = ["danger", "default"], classevolume = ["off", "up"];
        if (pulEscludiRipristinaTraccia) {pulEscludiRipristinaTraccia.className = "btn btn-" + classebtn[+Stato] + " btn-xs fa fa-volume-" + classevolume[+Stato];}
    }

    if (TracceEscluse.includes(IDUtente)) {
        /* Riattiva la traccia */
        if (EscludiRipristina == "Escludi") {CambiaIconaVolume(false); return;}
        
        TracceEscluse.splice(TracceEscluse.indexOf(IDUtente), 1);
        if (RiproduzioneInCorso) {
            const MinutaggioVideo = VideoGuidaMinutaggioCorrente();
            if (DatiAudioRegistrato_Utente[IDUtente]) {DatiAudioRegistrato_Utente[IDUtente].forEach((datiAudio) => {VerificaClipDaRiprodurre(datiAudio.numero, MinutaggioVideo);});}
            FunzioneRiproduzioneClip = RiproduciClipInSync;
        }
        
        CambiaIconaVolume(true);

    } else {
        /* Esclude la traccia */
        if (EscludiRipristina == "Ripristina") {CambiaIconaVolume(true); return;}
        
        TracceEscluse.push(IDUtente);

        if (RiproduzioneInCorso) {
            if (DatiAudioRegistrato_Utente[IDUtente]) {DatiAudioRegistrato_Utente[IDUtente].forEach((datiAudio) => {EliminaClipDaRiprodurre(datiAudio.numero); StoppaClipAudio(datiAudio);});}
        }

        CambiaIconaVolume(false);
    }
}

function EscludiRipristinaClip(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero];

    datiAudio.Escluso = !datiAudio.Escluso;
    document.getElementById('ELTReg' + Numero + "StratoColore").style.backgroundColor = (datiAudio.Escluso? "grey" : "");
    if (datiAudio.Escluso) {EliminaClipDaRiprodurre(Numero);}
    AggiornaRiproduzioneClip(Numero);
}

function CancellaRipristinaRegistrazione(Numero, Ripristina) {
    VisualizzaClipAudio(Numero, Ripristina);
    
    if (Ripristina == false) {
        CestinaClip(Numero);
        if (VisualizzaSuggerimentiCestinaClip) {
            const Cestino = document.getElementById('ApriCestinoTraccia' + DatiDoppiatori[DatiAudioRegistrato[Numero].ID_Utente].numeroTraccia);
            const S = [
                {testo: Sugg_CestinaClip_DoveSonoLeClip, stile: 'info',     simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino.parentNode, scostamentoX: '5px', scostamentoY: '-10px'},
                {testo: Sugg_CestinaClip_VisualizzaClip, stile: 'warning',  simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino, scostamentoX: '5px', scostamentoY: '-15px'},
                {testo: Sugg_CestinaClip_RimettiCestino, stile: 'default',  simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino, scostamentoX: '5px', scostamentoY: '-15px'},
                {testo: Sugg_CestinaClip_GiorniEliminaz, stile: 'info',     simboloSx: 'fa fa-arrow-left', simboloDx: 'fa fa-trash-o', VicinoA: Cestino.parentNode, scostamentoX: '5px', scostamentoY: '-10px'},
            ];

            VisualizzaSuggerimentiNuoviDoppiatori(S, 'CestinaClip', () => {VisualizzaSuggerimentiCestinaClip = false;});
        }
    }

	OpzioniClip(Numero, false, true);
}

async function CestinaClip(Numero, SenzaAnimazione = false, RiposizionamentoAutomatico = true) {
    const ELT = document.getElementById('ELTReg' + Numero), Cestino = document.getElementById('ApriCestinoTraccia' + DatiDoppiatori[DatiAudioRegistrato[Numero].ID_Utente].numeroTraccia);

    if (ELT) {
        if (SenzaAnimazione) {
            ELT.style.visibility = "hidden";
        } else {
            ELT.iStyle({left: "-5px", width: "10px", visibility: "hidden"});
            if (RiposizionamentoAutomatico) {
                await pausa(1000);
                RiposizionamentoAutomaticoClipSovrapposte(ELT);
            }
        }
    }

    if (Cestino) {
        Cestino.style.animation = ""; Cestino.dataset.ripristinati = "no"; clearTimeout(tmrLampeggiaCestino[Cestino.id]);
        tmrLampeggiaCestino[Cestino.id] = setTimeout(() => {Cestino.style.animation = "blink 500ms ease 0s 4";}, 2000);
    }
}

function VisualizzaClipAudio(Numero, Attivo) {
    DatiAudioRegistrato[Numero].Rimosso = !Attivo;
   
    document.getElementById('ELTReg' + Numero + "Contenuto").style.opacity = (Attivo? 1 : 0.3);
}

async function ApriCestinoTraccia(e) {
    const Cestino = e.currentTarget;
    var AudioDellaTraccia = [];

    if (datiAudioTraccia = DatiAudioRegistrato_Utente[Cestino.dataset.idutente]) {
        datiAudioTraccia.forEach((datiAudio) => {
            if (!datiAudio.danneggiato) {AudioDellaTraccia.push(datiAudio);}
        });
    }

    const totAudioDellaTraccia = AudioDellaTraccia.length;
    if (totAudioDellaTraccia) {
        Cestino.style.animation = "";
        Cestino.className += " fa-bounce";
        await pausa(100);
        if (Cestino.dataset.ripristinati == "si") {
            let AudioNonCestinati = [];
            for (let I = 0; I < totAudioDellaTraccia; I++) {
                if (CestinaClipRimosse(AudioDellaTraccia[I])) {await pausa(30);} else {AudioNonCestinati.push(AudioDellaTraccia[I]);}
            }

            const totAudioNonCestinati = AudioNonCestinati.length;
            for (let I = 0; I < totAudioNonCestinati; I++) {
                RiposizionamentoAutomaticoELT_NumClipAudio(AudioNonCestinati[I].numero);
            }

            Cestino.className = "btn btn-default btn-xs fa fa-trash-o";
            
        } else {
            for (let I = 0; I < totAudioDellaTraccia; I++) {
                VisualizzaClipRimosse(AudioDellaTraccia[I]);
                await pausa(30);
            }
            Cestino.className = "btn btn-warning btn-xs fa fa-trash-o"; Cestino.dataset.ripristinati = "si";
        }
    }
}

function CestinaClipRimosse(datiAudio, SenzaAnimazione = false) {
    if (datiAudio.Rimosso) {CestinaClip(datiAudio.numero, SenzaAnimazione, false);} // CestinaClip si occuperà anche di resettare il flag "ripristinati"
    return datiAudio.Rimosso;
}

function VisualizzaClipRimosse(datiAudio) {
    const Numero = datiAudio.numero, ELT = document.getElementById('ELTReg' + Numero);
    ELT.style.visibility = "visible";
    VisualizzaELTNormale(Numero);
    InserimentoInProporzioneNellaLineaTemporale(ELT, datiAudio.MinutaggioRegistrazione, datiAudio.Durata);
    setTimeout(() => {RiposizionamentoAutomaticoELT_NumClipAudio(Numero);}, 1000);
}


function SalvaModificheClipAudio(Numero, FunzioneAlTermine = () => {}) {
    const datiAudio = DatiAudioRegistrato[Numero], AutoreCommentoClip = (SonoCreatoreProgetto? "CreatoreProgetto" : "Doppiatore"), ModificatoDaAscoltare = (document.getElementById(ID_Opzioni + 'labelPulDaAscoltare')?.dataset?.cliccato == "si");
	var Parametri = "N=" + encodeURIComponent(datiAudio.NumeroUnivoco) + "&MinutaggioRegistrazione=" + encodeURIComponent(datiAudio.MinutaggioRegistrazione) + "&Guadagno=" + encodeURIComponent(GuadagnoPrincipale[Numero].gain.value) + "&TaglioIniziale=" + encodeURIComponent(datiAudio.taglioIniziale) + "&TaglioFinale=" + encodeURIComponent(datiAudio.taglioFinale) + "&Effetti=" + encodeURIComponent(datiAudio.effetti) + "&IntensitaEffetti=" + encodeURIComponent(datiAudio.intensitaeffetti) + "&Rimosso=" + encodeURIComponent((datiAudio.Rimosso ? "si" : "no"));
    if (datiAudio['commenti' + AutoreCommentoClip + '_prec'] != datiAudio['commenti' + AutoreCommentoClip]) {Parametri += "&Commenti" + AutoreCommentoClip + "=" + encodeURIComponent(datiAudio['commenti' + AutoreCommentoClip]); datiAudio['commenti' + AutoreCommentoClip + '_prec'] = datiAudio['commenti' + AutoreCommentoClip];}
    if (ModificatoDaAscoltare) {Parametri += "&Visualizzato=" + (datiAudio.daAscoltare ? "0" : "1");}
    
	AJAX("AggiornaRegistrazione.php", Parametri, FunzioneAlTermine, strAggiornamento, strSalvataggioCompletato, true);
}

function CaricamentoInizialeRegistrazioniAudio() {
	DisabilitaSchermata(true); Messaggio(strCaricamentoInCorso);
    AJAX("CaricaRegistrazione.php", "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&Streaming=" + (ModalitaStreaming? "1" : "0") + "&SoloMieRegistrazioni=" + (ModalitaUltraLightAttiva? "1" : "0"), CreazioneClipPrimoCaricamento, "", "", true);
}

function CreazioneClipPrimoCaricamento(DatiClipAudio) {
    const totClipAudio = DatiClipAudio.length, PresenteColonnaInternazionale = DatiCI.find(el => el.CI || el.AutoCI), CondizionePulsanteSwitchColonnaInternazionale = (!Provino && !ModalitaStreaming && (PresenteColonnaInternazionale || SonoCreatoreProgetto));

    CaricaColonnaInternazionale({volume: 1});
    ColonnaInternazionaleAttivata = (ModalitaStreaming || CondizionePulsanteSwitchColonnaInternazionale);

    if (CondizionePulsanteSwitchColonnaInternazionale) {SwitchColonnaInternazionale(); setTimeout(() => {pulSwitchColonnaInternazionale.style.display = "";}, 500); if (SonoCreatoreProgetto && (pulEscludiTracciaCI = document.getElementById('EscludiRipristinaTraccia' + (NumeroTotaleTracce - 1).toString()))) {pulEscludiTracciaCI.onclick = pulSwitchColonnaInternazionale.onclick;}}

    for (let I = 0; I < totClipAudio; I++) {
        CreaNuovaClipAudio(DatiClipAudio[I]);
    }

    TermineCaricamentoClip();
}

async function TermineCaricamentoClip() {
    Messaggio(strCaricamentoCompletato + (!ModalitaStreaming ? "<div style='font-size: 12px'; font-style: italic;'>" + (SessioneOspite? (Provino || ProgettoCompletato) ? strModalitaVisualizzazione + "</div>" : strNonHaiNessunRuolo + (!SonoCreatoreProgetto ? "<br />" + strPuoiSoloVisualizzare : "") : "") + "</div>" + (SonoCreatoreProgetto? "<div style='font-size: 13px; font-weight: bold; font-style: italic;'>" + strPoteriCreatoreProgetto + "</div>" : "") : ""), "OK");
    if (ModalitaStreaming) {
        const pulPlayIniziale = CreaElemento('div', 'divPulsantonePlayIniziale', divVetro.id, "<span class='fa fa-play-circle'></span> Play"); pulPlayIniziale.className = "btn btn-success"; pulPlayIniziale.iStyle({position: "relative", top: "40%", width: "100%", margin: "0px auto", fontSize: "30px", fontWeight: "bold"});
        pulPlayIniziale.onclick = () => {if (pulPlay.disabled == false) {CancMex(); AttivaScorciatoieDiTastiera_ModalitaStreaming(); pulPlayIniziale.onclick = ""; divVetro.style.display = "none"; setTimeout(PlayVideoGuida, 100);}};
        DisattivaMessaggiAttesa();
        AttivaInterfaccia();
        document.getElementById('LogoWEDUB').iStyle({top: 0, right: 0, opacity: 0.5, width: larghezzaLogo});

    } else {
        let PosizioneInizialeCursore = InizioVideoGuida;

        function PosizionatiEAttivaInterfaccia() {AttivaInterfaccia(PosizioneInizialeCursore);}

        /*** Posizionati su prima clip da ascoltare ***
         *   Se presente DoppiatoreConsiderato        */
        function PosizionatiSuPrimaClipDaAscoltare() {
            if (DoppiatoreConsiderato) {
                function TrovaClipEPosizionati() {
                    if (DatiAudioUtente = DatiAudioRegistrato_Utente[DoppiatoreConsiderato]) {
                        const PrimaClipDaAscoltare = DatiAudioUtente.find((el) => el.daAscoltare && !el.Rimosso);
                        if (PrimaClipDaAscoltare) {PosizioneInizialeCursore = PrimaClipDaAscoltare.MinutaggioRegistrazione - 2; slideZoom.value = 1000; CambiaZoom(); window.scroll({top: document.getElementById('Traccia' + DatiDoppiatori[DoppiatoreConsiderato].numeroTraccia).offsetTop - 90});}
                    }
                    PosizionatiEAttivaInterfaccia();
                }
                
                if (DatiDoppiatori[DoppiatoreConsiderato].numeroTraccia === RuoliDaAssegnare_NumeroTraccia) {SelezionaCandidatoRuoliDaAssegnare(DoppiatoreConsiderato, TrovaClipEPosizionati);} else {TrovaClipEPosizionati();}

            } else {
                PosizionatiEAttivaInterfaccia();
            }
        }
        /**********************************************/

        AttivaAggiornamentoClip();
        EliminaImgAttesa();
        AttivaScorciatoieDiTastiera();
        if (RuoliDaAssegnare_NumeroTraccia !== false) { // La traccia "RuoliDaAssegnare" è presente solo se si è il creatore del progetto oppure l'utente visitatore
            if (SonoCreatoreProgetto) {tmrAggiornaNotificheCandidatiRuoliDaAssegnare = setInterval(VerificaNuoveClipAltriCandidati, 180000); VerificaNuoveClipAltriCandidati(PosizionatiSuPrimaClipDaAscoltare);} else {SolaVisione = true; pulRegistra.disabled = true; SelezionaCandidatoRuoliDaAssegnare(ID_Utente); PosizionatiEAttivaInterfaccia();}
        } else {
            PosizionatiSuPrimaClipDaAscoltare();
        }
        divVetro.style.display = "none";
        setTimeout(CaricaMarcatori, 1500);
        setTimeout(CheckUtentiAttivi, 1000);
        setTimeout(CheckMessaggiVocaliIstantanei, 1000);
        if (SonoCreatoreProgetto && !Provino) {setTimeout(AggiornaRappresentazioneColonnaInternazionale, 100);}

        const totAudio = DatiAudioRegistrato.length;
        for (let I = 0; I < totAudio; I++) {
            if (CestinaClipRimosse(DatiAudioRegistrato[I], true)) {await pausa(30);}
        }
    }
    AzzeraBarraCaricamento(BC, ContornoBC, {loaded: 1, total: 1});
}

function AttivaInterfaccia(Posizionamento = InizioVideoGuida) {
    FunzioneNormaleAlTimeUpdate = (ModalitaStreaming? AggiornaTimeline_Streaming : AggiornaTimeline);
    StartAudioContext(audioContext);
    Posizionati(Posizionamento, true); // Riabilita la schermata non appena si posiziona.
}

function AttivaScorciatoieDiTastiera() {
    window.addEventListener('keydown', ScorciatoieTastiera);
    window.addEventListener('keyup', ScorciatoieTastiera_TastiSollevati);
    ContenitoreLineaTemporale.addEventListener('mousedown', GestisciMouseDown);
    document.body.addEventListener('mouseup', GestisciMouseUp);
    ContenitoreLineaTemporale.addEventListener('mouseleave', GestisciMouseUp);
    ContenitoreLineaTemporale.addEventListener('wheel', GestisciRotellinaMouse);
    if (SistemaAttualeAndroid) {
        ContenitoreLineaTemporale.addEventListener('touchstart', GestisciTouchStartLineaTemporale);
        ContenitoreLineaTemporale.addEventListener('touchmove',  GestisciTouchMoveLineaTemporale);
    }
    AttivaPulsantiMultimediali();
}

function AttivaScorciatoieDiTastiera_ModalitaStreaming() {
    window.addEventListener('keydown', ScorciatoieTastiera_ModalitaStreaming);
    AttivaPulsantiMultimediali();
}

function ComandiPlayer_Visualizzato() {
    clearTimeout(tmrComandiPlayerModalitaStreaming);
    ComandiPlayer.style.opacity = 1;
}

function ComandiPlayer_ScomparsaAutomatica() {
    ComandiPlayer_Visualizzato();
    tmrComandiPlayerModalitaStreaming = setTimeout(() => {ComandiPlayer.style.opacity = 0;}, latenzaScomparsaAutomaticaComandiPlayer);
}

function AttivaPulsantiMultimediali() {
    navigator.mediaSession.setActionHandler('play', PlayPausa); navigator.mediaSession.setActionHandler('pause', PlayPausa);
}

function AggiornaClip(FunzioneAlTermine = () => {}, FunzioneNuovaClip = RiposizionamentoAutomaticoELTRiferitoAllaRegistrazione) {
	AJAX("CaricaRegistrazione.php", "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&SoloMieRegistrazioni=" + (ModalitaLightAttiva? "1" : "0") + "&IDCandidatoRuoliDaAssegnare=" + encodeURIComponent(RuoliDaAssegnare_CandidatoSelezionato),
		function (Dati) {
            const totDati = Dati.length, totAudio = DatiAudioRegistrato.length;
            var I, NumAudio, AudioDaRipristinare = [], NuoviAudio = false;
            
			for (I = 0; I < totDati; I++) {
                const DatiAggiornati = Dati[I];
                /* Trova il numero identificativo della clip, se non la trova si tratta di una nuova clip */
				for (NumAudio = 0; (NumAudio < totAudio) && (DatiAudioRegistrato[NumAudio].NumeroUnivoco != DatiAggiornati.N); NumAudio++);

				if (NumAudio >= totAudio) {
                    /** Nuova clip audio **/
                    CreaNuovaClipAudio(DatiAggiornati, FunzioneNuovaClip);
                    NuoviAudio = true;
                    
				} else {
                    /** Aggiorna i valori della clip già presente **/
                    if (document.getElementById(ID_Opzioni) || (DatiAggiornati.DurataRegistrazione == 0) || (ModalitaStreaming)) {continue;}
                    const datiAudio = DatiAudioRegistrato[NumAudio];
                    if (datiAudio.CreazioneInCorso) {continue;}
                    
                    /* Posizione nella linea temporale */
                    if (datiAudio.MinutaggioRegistrazione != DatiAggiornati.MinutaggioRegistrazione) { SpostaMinutaggioRegistrazione(NumAudio, Number(DatiAggiornati.MinutaggioRegistrazione)); }
                    
                    /* Guadagno */
                    CambiaVolumeClip(NumAudio, DatiAggiornati.Guadagno);
                    
                    /* Taglio iniziale e finale */
                    if ((datiAudio.taglioIniziale != DatiAggiornati.taglioIniziale) || (datiAudio.taglioFinale != DatiAggiornati.taglioFinale)) {datiAudio.taglioIniziale = DatiAggiornati.TaglioIniziale; datiAudio.taglioFinale = DatiAggiornati.TaglioFinale; VisualizzazioneGraficaTaglioClip(NumAudio); AggiornaAudioDaAscoltare(datiAudio);}
                   
                    /* Effetti */
                    datiAudio.effetti = DatiAggiornati.Effetti; datiAudio.intensitaeffetti = DatiAggiornati.IntensitaEffetti; VisualizzaEffettiAudio(NumAudio); if (datiAudio.audio) {AttivaEffettiAudio(NumAudio);}

                    /* Commenti */
                    if ((datiAudio.ID_Utente == ID_Utente) || (SonoCreatoreProgetto)) {
                        datiAudio.commentiVisualizzatiDoppiatore = DatiAggiornati.CommentiVisualizzatiDoppiatore; datiAudio.commentiVisualizzatiCreatoreProgetto = DatiAggiornati.CommentiVisualizzatiCreatoreProgetto;
                        datiAudio.commentiDoppiatore = DatiAggiornati.CommentiDoppiatore; datiAudio.commentiCreatoreProgetto = DatiAggiornati.CommentiCreatoreProgetto;
                        datiAudio.commentiDoppiatore_prec = datiAudio.commentiDoppiatore; datiAudio.commentiCreatoreProgetto_prec = datiAudio.commentiCreatoreProgetto;
                        
                        VisualizzaCommentiELT(NumAudio);
                    }
                    
                    /* Mantenuto/Rimosso */
                    const AudioRimosso = (DatiAggiornati.Rimosso == "si");
					if (datiAudio.Rimosso != AudioRimosso) {
                        datiAudio.Rimosso = AudioRimosso; VisualizzaELTNormale(NumAudio);
                        if (AudioRimosso) {
                            CestinaClip(NumAudio);
                        } else {
                            AudioDaRipristinare.push(datiAudio);
                        }
                    }

                    /* Ascoltato */
                    if (SonoCreatoreProgetto && (datiAudio.daAscoltare != !(+DatiAggiornati.Visualizzato))) {datiAudio.daAscoltare = !(+DatiAggiornati.Visualizzato); ResetBordoAudioAscoltato(datiAudio); AggiornaAudioDaAscoltare(datiAudio);}
				}
            }
            
            setTimeout(() => {
                AudioDaRipristinare.forEach(VisualizzaClipRimosse);
                FunzioneAlTermine();
                if (NuoviAudio && RiproduzioneInCorso && (!FunzioneAlTerminePrecaricamento) && (!StoRegistrando)) {VerificaClipPrecaricate(SecondiPrecaricamentoAlPlay);} // Verifica se deve precaricare e quindi riprodurre le clip appena caricate
                CheckUtentiAttivi();
                CaricaMarcatori();
            }, 250);
		}, "", "", true
	);
}

function AttivaAggiornamentoClip() {
    window.clearInterval(tmrAggiornaClip);
    if (!ModalitaStreaming && !ModalitaLightAttiva) {tmrAggiornaClip = window.setInterval(AggiornaClip, 30000);}
}

function CheckUtentiAttivi() {
    var ID_Doppiatori = Object.keys(DatiDoppiatori);
    if (!ID_Doppiatori.includes(ID_CreatoreProgetto)) {ID_Doppiatori.push(ID_CreatoreProgetto);}
    AJAX("UtentiNelProgetto.php", "N=" + N + "&ID=" + encodeURIComponent(ID_Doppiatori.join("|")),
        (Dati) => {
            const totUtenti = Dati.length;
            UtentiAttivi = [];
            for (let I = 0; I < totUtenti; I++) {
                const UtenteSiTrovaNelProgetto = (+Dati[I].UtenteNelProgetto == +N);
                if (UtenteAttivo(Dati[I].DataUltimaAzione) && UtenteSiTrovaNelProgetto) {UtentiAttivi.push(Dati[I]);}
                VisualizzaUtenteAttivoProgettoDoppiaggio(Dati[I].ID, Dati[I].DataUltimaAzione, UtenteSiTrovaNelProgetto);
            }
            UtentiAttiviOltreMe = UtentiAttivi.slice(); UtentiAttiviOltreMe.splice(UtentiAttiviOltreMe.findIndex(el => el.ID == ID_Utente), 1);

            clearInterval(CheckMessaggiVocaliIstantanei.tmr);
            const totUtentiAttiviOltreMe = UtentiAttiviOltreMe.length;
            if (totUtentiAttiviOltreMe) {
                if (!SessioneOspite || (SonoCreatoreProgetto && !ProgettoCompletato)) {
                    MessaggiIstantaneiAttivi = true; ContenitorePulMessaggioVocale.style.display = "inline-block"; pulMessaggioVocale.abilita(true); CheckMessaggiVocaliIstantanei();

                    const TantiUtentiOnline = (totUtentiAttiviOltreMe > 1);
                    const SelezionePrecedente = selUtenteMessaggioVocale.value;
                    var StringaDidascaliaMessaggioVocale = "", StringaPulMessaggioVocale = "";

                    selUtenteMessaggioVocale.innerHTML = "";

                    CreaElemento('option', 'opzTutti' + selUtenteMessaggioVocale.id, selUtenteMessaggioVocale.id, strSelMessaggioVocaleTutti).value = UtentiAttiviOltreMe.reduce((a, b) => (a += b.ID + "|"), "").slice(0, -1)
                    for (let I = 0; I < totUtentiAttiviOltreMe; I++) {
                        CreaElemento('option', 'opz' + selUtenteMessaggioVocale.id + I, selUtenteMessaggioVocale.id, UtentiAttiviOltreMe[I].Nome).value = UtentiAttiviOltreMe[I].ID;
                    }

                    if (TantiUtentiOnline) {
                        selUtenteMessaggioVocale.style.display = "inline";
                        selUtenteMessaggioVocale.value = SelezionePrecedente;
                        ((!selUtenteMessaggioVocale.value) && (selUtenteMessaggioVocale.selectedIndex = 0)); // Se non trova l'utente precedentemente selezionato, sposta la selezione in "Tutti gli utenti".

                        StringaDidascaliaMessaggioVocale = strMessaggioVocaleVariUtentiOnline;
                        StringaPulMessaggioVocale = strParlaCon;

                    } else {
                        selUtenteMessaggioVocale.style.display = "none";
                        selUtenteMessaggioVocale.value = UtentiAttiviOltreMe[0].ID;

                        const NomeUtenteOnline = "<b>" + selUtenteMessaggioVocale.options[1].innerText + "</b>";
                        StringaDidascaliaMessaggioVocale = NomeUtenteOnline + strMessaggioVocaleSingoloUtenteOnline;
                        StringaPulMessaggioVocale = strParlaCon + NomeUtenteOnline;
                    }

                    didascaliaMessaggioVocale.innerHTML = StringaDidascaliaMessaggioVocale;
                    pulMessaggioVocale.children[1].innerHTML = StringaPulMessaggioVocale;

                    AutoAdattaElementiInterfaccia(); // Il banner che avvisa dell'utente online può apparire sopra i comandi del player
                }

            } else {
                MessaggiIstantaneiAttivi = false; pulMessaggioVocale.abilita(false); ContenitorePulMessaggioVocale.style.display = "none";
            }
        }, "", "", true
    );
}

function RiposizionamentoAutomaticoELTRiferitoAllaRegistrazione(datiAudio) {
    setTimeout(() => {RiposizionamentoAutomaticoELT_NumClipAudio(datiAudio.numero);}, 100);
}

function RiposizionamentoAutomaticoELT_NumClipAudio(Numero) {
    if (!ModalitaStreaming) {RiposizionamentoAutomaticoClipSovrapposte(document.getElementById('ELTReg' + Numero));}
}

function SwitchColonnaInternazionale() {
    ColonnaInternazionaleAttivata = !ColonnaInternazionaleAttivata;
    const CI = ColonnaInternazionaleAttivata;
    lblVolumeVideoGuida.innerText = (CI ? strVolumeInternazionale : strVolumeFilmato);
    slideVolumeVideoGuida.value = (CI ? VolumeAttualeCI() : CambiaVolumeVideoGuida.volume);
    slideVolumeVideoGuida.onchange = (CI ? CambiaVolumeCI : CambiaVolumeVideoGuida);
    if (CI) {DeterminaVolumeVideoGuidaPerCI()} else {VideoGuidaImpostaVolume(CambiaVolumeVideoGuida.volume);}

    if (pulSwitchColonnaInternazionale) {
        pulSwitchColonnaInternazionale.className = "btn btn-" + (CI ? "primary" : "default");
        document.getElementById('pulSwitchCI_Interruttore').className = "slider round" + (CI ? " slider-attivo" : "");
    }
    
    EscludiRipristinaTraccia("CI", (CI ? "Ripristina" : "Escludi"));
}

function VolumeAttualeCI() {
    return (AudioBufferColonnaInternazionale.length ? GuadagnoPrincipale[AudioBufferColonnaInternazionale[0].numero].gain.value : 1);
}

function CambiaVolumeCI() {
    const Volume = Number(slideVolumeVideoGuida.value);

    AudioBufferColonnaInternazionale.forEach((datiAudioCI) => {
        GuadagnoPrincipale[datiAudioCI.numero].gain.value = Volume;
    });

    DeterminaVolumeVideoGuidaPerCI();
}

function appendBuffer(vBuffer, partenzaprimobuffer = 0) {
    const totBuffer = vBuffer.length;
    const CanaliAudio = vBuffer[0].numberOfChannels;
    const SampleRate = vBuffer[0].sampleRate;
    var lunghezzaTotale = 0 - partenzaprimobuffer; vBuffer.forEach((b) => {lunghezzaTotale += b.length;});
    var buffernuovo = audioContext.createBuffer(CanaliAudio, lunghezzaTotale, SampleRate);
    for (var c = 0; c < CanaliAudio; c++) {
        var partenza = 0;
        for (let b = 0; b < totBuffer; b++) {
            partenzabuffer = (partenzaprimobuffer * (b == 0));
            buffernuovo.copyToChannel(vBuffer[b].getChannelData(c).slice(partenzabuffer), c, partenza);
            partenza += vBuffer[b].length - partenzabuffer;
        }
    }
    return buffernuovo;
}

function CreaNuovaClipAudio(Dati, FunzioneAlTermine, Visualizzazione = true) {
    GeneraDatiAudio(Dati, ++CreaNuovaClipAudio.N, ((ModalitaStreaming || !Visualizzazione) ? "" : VisualizzazioneNellaLineaTemporale), FunzioneAlTermine);
}
CreaNuovaClipAudio.N = -1;

function CaricaColonnaInternazionale(Opzioni) {
    OpzioneAutoCI = false;
    const totDatiCI = DatiCI.length;
    for(I = 0; I < totDatiCI; I++) {
        if (DatiCI[I].CI) {
            const SpezzoniAudioCI = DatiCI[I].CI, UltimoSpezzoneAudioCI = SpezzoniAudioCI.length - 1, PartenzaPrimoSpezzone = DatiCI[I].Partenza;
            SpezzoniAudioCI.forEach((SpezzoneAudio, NumSpezzone) => {
                CreaNuovaClipAudio({Registrazione: SpezzoneAudio, N: "CI" + I.toString() + "-" + NumSpezzone.toString(), ID_Utente: 'CI', MinutaggioRegistrazione: +PartenzaPrimoSpezzone + (75 * NumSpezzone), TaglioIniziale: 0, TaglioFinale: 75, DurataRegistrazione: 75, Guadagno: Opzioni.volume},
                    (datiAudio) => {
                        datiAudio.minutaggiodefault = datiAudio.MinutaggioRegistrazione;
                        datiAudio.numBloccoCI = I; datiAudio.numSpezzone = NumSpezzone;
                        AudioBufferColonnaInternazionale.push(datiAudio);
                        if (NumSpezzone == 0) {CI_DisattivaAudioOriginaleAlPlay(datiAudio);}
                        if ((NumSpezzone == UltimoSpezzoneAudioCI) && DatiCI[+I + 1] && !DatiCI[+I + 1].CI) {CI_AttivaAudioOriginalePocoPrimaDelTermine(datiAudio); datiAudio.effettuareFadeOutCI = true;}
                    }, false);
                }
            );
        } else {
            OpzioneAutoCI += (DatiCI[I].AutoCI || 0);
        }
    }
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

        /** Verifica se si tratta di Colonna Internazionale **
        * in questo caso disattiva le vecchie clip e ricarica la CI aggiornata */
        if (Dati.Registrazione.slice(0, 13) == "ColonneAudio/") {
            AcquisisciNuovaCI();
        } else {
            window.setTimeout(() => {CaricaAudio(Numero, Dati, TipoDato, Funzione, FunzioneAlTermine1, FunzioneAlTermine2);}, 1000);
        }
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
        effetti: Dati.Effetti || "", intensitaeffetti: Dati.IntensitaEffetti || 0.5,
        alPlay: [], tmrEventoAlPlay: [], alTermine: () => {},
        daAscoltare: ((Dati.Visualizzato == 0) && (SonoCreatoreProgetto)),
        infoAggiuntive: Dati.InfoAggiuntive || "",
        commentiDoppiatore: Dati.CommentiDoppiatore || "", commentiDoppiatore_prec: Dati.CommentiDoppiatore || "", commentiCreatoreProgetto: Dati.CommentiCreatoreProgetto || "", commentiCreatoreProgetto_prec: Dati.CommentiCreatoreProgetto || "", commentiVisualizzatiDoppiatore: Dati.CommentiVisualizzatiDoppiatore, commentiVisualizzatiCreatoreProgetto: Dati.CommentiVisualizzatiCreatoreProgetto
    };

    /** Cataloga i DatiAudioRegistrato per file **/
    DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione] = (DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione] || []);
    DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[Numero].Registrazione].push(DatiAudioRegistrato[Numero]);
    /*********************************************/

    /** Cataloga i DatiAudioRegistrato per utente **/
    DatiAudioRegistrato_Utente[DatiAudioRegistrato[Numero].ID_Utente] = (DatiAudioRegistrato_Utente[DatiAudioRegistrato[Numero].ID_Utente] || []);
    DatiAudioRegistrato_Utente[DatiAudioRegistrato[Numero].ID_Utente].push(DatiAudioRegistrato[Numero]);
    /***********************************************/

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
                if (datiAudio.Durata > 0) {AJAXSalvaDurataClipAudio(datiAudio);} else {console.log("Problema durata clip", datiAudio); return;} // Quando si registra una nuova clip, la durata viene salvata solo al caricamento della registrazione, che consente di calcolarla con precisione. Se l'utente esce dalla pagina prima che venga effettuato questo salvataggio, esso verrà richiamato al prossimo caricamento.
            }

            VisualizzaClipCaricata(Numero, Funzione, SecondaFunzione);
            OperazioniAlBufferCaricato(Numero);
            if (RiproduzioneInCorso) {FunzioneRiproduzioneClip = RiproduciClipInSync;}
        }, true);

    } else {
        VisualizzaClipCaricata(Numero, Funzione, SecondaFunzione);
    }
}

function VisualizzaClipCaricata(Numero, Funzione, SecondaFunzione) {
    const datiAudio = DatiAudioRegistrato[Numero];

    /** Lancia la prima funzione **/
    if (Funzione) {Funzione(datiAudio);}

    /** Visualizza gli effetti audio **/
    VisualizzaAmpiezzaOndaSonora(Numero); VisualizzaEffettiAudio(Numero);

    /** Lancia la seconda funzione **/
    if (SecondaFunzione) {SecondaFunzione(datiAudio);}

    /** Elimina il flag CreazioneInCorso **/
    datiAudio.CreazioneInCorso = false;
}

function AJAXSalvaDurataClipAudio(datiAudio) {
    AJAX("SalvaDurataRegistrazione.php", "N=" + encodeURIComponent(datiAudio.NumeroUnivoco) + "&DurataRegistrazione=" + encodeURIComponent(datiAudio.Durata), "", "", "", true);
    datiAudio.taglioIniziale = 0; datiAudio.taglioFinale = datiAudio.Durata;
}

function CreaDatiGuadagnoPrincipale(Numero, Guadagno) {
    GuadagnoPrincipale[Numero] = {gain: {value: Guadagno}, disconnect: function () {}};
}

function CreaClipAudio(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero];
    datiAudio.audio = new AudioBufferSourceNode(audioContext, {buffer: datiAudio.buffer, channelCount: 1});
    AttivaEffettiAudio(Numero);
}

function DisconnettiEffettiAudio(Numero) {
    var GuadagnoPrecedente = GuadagnoPrincipale[Numero].gain.value; GuadagnoPrincipale[Numero].disconnect(); GuadagnoPrincipale[Numero] = null;
    if (FiltroBandaAR[Numero]) {FiltroBandaAR[Numero].disconnect(); delete FiltroBandaAR[Numero];}
    if (EffettoDelay1[Numero]) {GuadagnoDelay1[Numero].disconnect(); EffettoDelay1[Numero].disconnect(); delete GuadagnoDelay1[Numero]; delete EffettoDelay1[Numero];}
    if (EffettoDelay2[Numero]) {GuadagnoDelay2[Numero].disconnect(); EffettoDelay2[Numero].disconnect(); delete GuadagnoDelay2[Numero]; delete EffettoDelay2[Numero];}
    if (EffettoDelay3[Numero]) {GuadagnoDelay3[Numero].disconnect(); EffettoDelay3[Numero].disconnect(); delete GuadagnoDelay3[Numero]; delete EffettoDelay3[Numero];}

    return GuadagnoPrecedente;
}

function AttivaEffettiAudio(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero], GuadagnoPrecedente = DisconnettiEffettiAudio(Numero);

    switch (datiAudio.effetti) {
        case "radio"    : CreaEffettoRadio(Numero); break;
        case "ovattato" : CreaEffettoOvattato(Numero); break; 
        case "echo"     : CreaEffettoEcho(Numero); break;
        case "riverbero": CreaEffettoRiverbero(Numero); break;

        default: CreaControllerGuadagno(Numero); break;
    }

    GuadagnoPrincipale[Numero].gain.value = GuadagnoPrecedente;

    VisualizzaEffettiAudio(Numero);
}

function VisualizzaEffettiAudio(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero], simbolo = document.getElementById('ELTReg' + datiAudio.numero + "SimboloEffetto");
    if (simbolo) {simbolo.className = "SimboloEffettoELT " + simboloEffettoELT[datiAudio.effetti]; simbolo.style.left = document.getElementById('ELTReg' + datiAudio.numero + "StratoColore").style.left;}
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
    GestisciIntensitaEffetto(Numero);
}

function CreaEffettoOvattato(Numero) {
    const ac = audioContext;
    FiltroBandaAR[Numero] = ac.createBiquadFilter(); FiltroBandaAR[Numero].channelCount = 1;
    FiltroBandaAR[Numero].type = "lowpass"; FiltroBandaAR[Numero].frequency.value = 800;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(FiltroBandaAR[Numero]).connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
    GestisciIntensitaEffetto(Numero);
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
    GestisciIntensitaEffetto(Numero);
}

function CreaEffettoRiverbero(Numero) {
    const ac = audioContext;
    GuadagnoDelay1[Numero] = ac.createGain(); GuadagnoDelay1[Numero].channelCount = 1; GuadagnoDelay1[Numero].gain.value = 1;
    EffettoDelay1[Numero] = ac.createDelay(); EffettoDelay1[Numero].channelCount = 1; EffettoDelay1[Numero].delayTime.value = 0.08
    GuadagnoDelay2[Numero] = ac.createGain(); GuadagnoDelay2[Numero].channelCount = 1; GuadagnoDelay2[Numero].gain.value = 0.45;
    EffettoDelay2[Numero] = ac.createDelay(); EffettoDelay2[Numero].channelCount = 1; EffettoDelay2[Numero].delayTime.value = 0.08;
    GuadagnoDelay3[Numero] = ac.createGain(); GuadagnoDelay3[Numero].channelCount = 1; GuadagnoDelay3[Numero].gain.value = 0.2;
    EffettoDelay3[Numero] = ac.createDelay(); EffettoDelay3[Numero].channelCount = 1; EffettoDelay3[Numero].delayTime.value = 0.02;
    CreaGuadagnoPrincipale(Numero);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoDelay1[Numero]).connect(EffettoDelay1[Numero]).connect(GuadagnoDelay2[Numero]).connect(EffettoDelay2[Numero]).connect(GuadagnoDelay3[Numero]).connect(EffettoDelay3[Numero]).connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
    DatiAudioRegistrato[Numero].audio.connect(GuadagnoPrincipale[Numero]).connect(ac.destination);
    GestisciIntensitaEffetto(Numero);
}

function GestisciIntensitaEffetto(Numero) {
    const datiAudio = DatiAudioRegistrato[Numero];
    if (!datiAudio.audio) {return;}
    
    const Intensita = datiAudio.intensitaeffetti;

    switch (datiAudio.effetti) {
        case "radio": FiltroBandaAR[Numero].frequency.value = 1500 / 0.5 * Intensita; break;
        case "ovattato": FiltroBandaAR[Numero].frequency.value = 800 / 1.5 * (2 - Intensita); break;
        case "echo": EffettoDelay2[Numero].delayTime.value = 0.2 / 0.5 * Intensita; break;
        case "riverbero": EffettoDelay3[Numero].delayTime.value = 0.02 / 0.5 * Intensita; break;
    }
}

/*** Analisi e visualizzazione grafica della registrazione nella linea temporale ***/
function VisualizzazioneNellaLineaTemporale(datiAudio) {
    if (ModalitaLightAttiva && (datiAudio.ID_Utente != ID_Utente)) {return;}
    try {
        const NumeroTraccia = Number(DatiDoppiatori[datiAudio.ID_Utente].numeroTraccia), NomeDoppiatore = DatiDoppiatori[datiAudio.ID_Utente].nome;
        const Didascalia = ((ID_Utente == datiAudio.ID_Utente) ? strTuaRegistrazione + " " : strClipDi + NomeDoppiatore + " ") + datiAudio.Data;
        CreaElementoLineaTemporale('ELTReg' + datiAudio.numero, 'Traccia' + NumeroTraccia, datiAudio.MinutaggioRegistrazione, datiAudio.Durata, Didascalia, datiAudio.numero, "0%", "100%", datiAudio.imgOndaSonora).style.display = "inline";
    } catch (err) {
        CreaElementoLineaTemporale('ELTReg' + datiAudio.numero, 'ContenutoTracce', datiAudio.MinutaggioRegistrazione, datiAudio.Durata, "", datiAudio.numero, "-100px", "0px", ""); // Se il doppiatore è stato aggiunto dopo il caricamento della pagina e quindi non trova la traccia corrispondente, crea l'ELT nascosto in maniera tale da creare comunque l'elemento (ed evitare che si generino errori di elemento non trovato)
    }
}

function CreaElementoLineaTemporale(ID, DoveInserirlo, PartenzaRegistrazione, LunghezzaRegistrazione, Stringa, RiferimentoRegistrazione, Posizione, Altezza, imgOndaSonora) {
	const ELT = CreaElemento('div', ID, DoveInserirlo), datiAudio = DatiAudioRegistrato[RiferimentoRegistrazione];
    ELT.title = Stringa; ELT.className = "ELT transizione-morbida-si"; ELT.setAttribute("name", "ELT"); ELT.iStyle({display: "none", opacity: OpacitaClipNonCaricata, transform: "scaleY(0.9)", position: 'absolute', top: Posizione, height: Altezza});
    ELT.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    InserimentoInProporzioneNellaLineaTemporale(ELT, PartenzaRegistrazione, LunghezzaRegistrazione);
    
        const ContenutoELT = CreaElemento('div', ID + "Contenuto", ID); ContenutoELT.className = "ContenutoELT";

            const StratoColoreELT   = CreaElemento('div', ID + 'StratoColore', ContenutoELT.id); StratoColoreELT.className = "StratoColoreELT"; StratoColoreELT.style.transition = "all 2s"; StratoColoreELT.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;

            const OndaSonoraELT     = CreaElemento('img', ID + 'OndaSonora', ContenutoELT.id); OndaSonoraELT.className = "OndaSonoraELT"; OndaSonoraELT.src = imgOndaSonora;

            const SimboloEffettoELT = CreaElemento('div', ID + 'SimboloEffetto', ContenutoELT.id); SimboloEffettoELT.className = "SimboloEffettoELT";
	
	if ( ( (datiAudio.ID_Utente == ID_Utente) && (SolaVisione == false) ) || (SonoCreatoreProgetto) ) {
        ELT.style.cursor = puntatoreTool[StrumentoMouse];
        ELT.dataset.modificabile = "si";
                 
        /*** Eventi al click dell'elemento nella linea temporale ***/
        StratoColoreELT.addEventListener('mousedown', GestioneEventoELTCliccato);
        
        ELT.addEventListener('mouseup', DisattivaSpostamentoManualeClip, true);

        /*** Eventi al passaggio del mouse ***/
        ELT.addEventListener('mouseenter', (e) => {
            if (StrumentoMouse != toolStandard) {return;}

            const ELTAttuale = e.currentTarget;
            VisualizzazioneGraficaTaglioClip(ELTAttuale.dataset.RiferimentoRegistrazione, (ELTDaModificare.length == 0));

            if (!ELTDaSpostare) {ELTAttuale.style.zIndex = 10000000;}

            tmrRiposizionamentoAutomaticoELT = setTimeout(() => {RiposizionamentoAutomaticoClipSovrapposte(ELTAttuale);}, 200);
        });

        ELT.addEventListener('mouseleave', (e) => {
            if (StrumentoMouse != toolStandard) {return;}
            clearTimeout(tmrRiposizionamentoAutomaticoELT); VisualizzazioneGraficaTaglioClip(e.currentTarget.dataset.RiferimentoRegistrazione);
            if (!ELTDaSpostare) {e.currentTarget.style.zIndex = 0;}
        });

        if (SonoCreatoreProgetto) {ContrassegnaClipDaAscoltare(datiAudio);}
        
        /*** Visualizzazione eventuali commenti ***/
        setTimeout(() => {VisualizzaCommentiELT(RiferimentoRegistrazione);}, 1000);
	}
    
    /*** Visualizzazione ELT ***/
    VisualizzazioneGraficaTaglioClip(RiferimentoRegistrazione);
    VisualizzaELTNormale(RiferimentoRegistrazione);

    return ELT;
}

/*** Gestione dell'audio da ascoltare ***/
function ContrassegnaClipDaAscoltare(datiAudio) {
    if (datiAudio.daAscoltare) {
        document.getElementById('ELTReg' + datiAudio.numero + 'Contenuto').style.border = StileBordoClipDaAscoltare;
        const secondifineultimabattuta = TrovaInizioTermineBattuta(datiAudio, false);
        if (secondifineultimabattuta > -1) {datiAudio.alPlay = [{FunzioneAlPlay: AJAXSalvaAudioAscoltato, latenzaEventoAlPlay: {secondi: +secondifineultimabattuta + 0.5, riduciSeClipNelMinutaggio: true}}];}
    }
}

function TrovaInizioTermineBattuta(datiAudio, Inizio) {
    const Guadagno = GuadagnoPrincipale[datiAudio.numero].gain.value;
    if (datiAudio.buffer && Guadagno) {
        const SampleRate = audioContext.sampleRate, s = datiAudio.buffer.getChannelData(0).slice(datiAudio.taglioIniziale * SampleRate, datiAudio.taglioFinale * SampleRate), SogliaBattuta = TrattamentoClip.AutoTaglioIniziale.SogliaDB / ((Guadagno * (Guadagno > 1)) || 1); // La soglia si adatta al guadagno della clip: più è elevato più la soglia è sensibile. Se il guadagno è inferiore a 1 la soglia si mantiene standard.
        return (Inizio? s.findIndex(v => v >= SogliaBattuta) / SampleRate : s.findLastIndex(v => v > SogliaBattuta) / SampleRate);
    }

    return -1;
}

function AJAXSalvaAudioAscoltato(datiAudio) {
    AJAX('SalvaRegistrazioneAscoltata.php', "N=" + datiAudio.NumeroUnivoco, "", "", "", true);
    datiAudio.daAscoltare = false;
    VisualizzaModificaAudioAscoltato(datiAudio);
    document.getElementById('ELTReg' + datiAudio.numero + 'Contenuto').style.border = StileBordoClipAscoltata;
}

function VisualizzaModificaAudioAscoltato(datiAudio) {
    ResetBordoAudioAscoltato(datiAudio);
    const NumEventoAlPlay = datiAudio.alPlay.find(el => (el.FunzioneAlPlay == AJAXSalvaAudioAscoltato));
    if (NumEventoAlPlay > -1) {datiAudio.alPlay.splice(NumEventoAlPlay, 1);}
    ContrassegnaClipDaAscoltare(datiAudio);
}

function ResetBordoAudioAscoltato(datiAudio) {document.getElementById('ELTReg' + datiAudio.numero + 'Contenuto').style.border = "";}

function AggiornaAudioDaAscoltare(datiAudio) {
    datiAudio.alPlay = []; datiAudio.iniziobattuta = datiAudio.finebattuta = false;
    if (datiAudio.daAscoltare) {VisualizzaModificaAudioAscoltato(datiAudio);}
    if (OpzioneAutoCI) {
        const secondiiniziobattuta = TrovaInizioTermineBattuta(datiAudio, true);
        if (secondiiniziobattuta > -1) {
            const secondifinebattuta = TrovaInizioTermineBattuta(datiAudio, false);
            const FunzioniAlPlay = [{FunzioneAlPlay: AutoCI_DisattivaAudioOriginale, latenzaEventoAlPlay: {secondi: secondiiniziobattuta, riduciSeClipNelMinutaggio: true}}, {FunzioneAlPlay: AutoCI_AttivaAudioOriginale, latenzaEventoAlPlay: {secondi: secondifinebattuta, riduciSeClipNelMinutaggio: true}}].concat(datiAudio.alPlay);
            datiAudio.alPlay = FunzioniAlPlay;
            datiAudio.iniziobattuta = (+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioIniziale) + (+secondiiniziobattuta); datiAudio.finebattuta = (+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioIniziale) + (+secondifinebattuta);
        }
    }
}
/***************************************/

function VisualizzaELTNormale(Numero) {
    VisualizzaClipAudio(Numero, (DatiAudioRegistrato[Numero].Rimosso == false));
}

function GestioneEventoELTCliccato(e) {
    if (((e.button != 0) && (!e.touches)) || (StrumentoMouse == toolMarcatore)) {return;}

    const NumeroAudio = +e.currentTarget.dataset.RiferimentoRegistrazione, X = e.clientX || e.touches[0].clientX;

    e.stopPropagation(); // Impedisce di attivare l'evento mousedown del righello.
    
    if ((!StoRegistrando) && ( (Righello.dataset.DisattivaClick == "no") || ((StrumentoMouse == toolStandard) && ELTDaSpostare)) ) { // Attiva la finestra delle opzioni, il trascinamento col mouse o la selezione multipla se il righello è attivo oppure se era stata selezionata almeno una clip
        switch(StrumentoMouse) {
            case toolStandard   : SelezionaESpostaELT(NumeroAudio, X); break;
            case toolDividiClip : DividiClipELT(NumeroAudio, X); break;
            case toolEscludiClip: EscludiRipristinaClip(NumeroAudio); break;
        }
    }
}

function SelezionaESpostaELT(NumeroAudio, X = 0) {
    if ((OpzClip = document.getElementById(ID_Opzioni)) && (OpzClip.dataset.nonmodificareselezionemultipla)) {return;}

    const ELT = document.getElementById('ELTReg' + NumeroAudio);
    ELTCliccato = ELT;
    const ELTSelezionatoInPrecedenza = ELTDaModificare.includes(ELTCliccato);
    EvidenziaELTSelezionato(ELTCliccato, !ELTSelezionatoInPrecedenza || (ELTDaModificare.length == 1));
    if (!ELTDaSpostare) {
        ELTDaSpostare = ELTCliccato;
        ELTDaModificare.push(ELTCliccato);
        OpzioniClip(NumeroAudio, true); // Se ancora ELTDaSpostare non è stato definito vuol dire che è la prima volta e apre la finestra delle opzioni.
    } else {
        if (!ELTSelezionatoInPrecedenza) {
            ELTDaModificare.push(ELTCliccato);
        } else {
            if (ELTDaModificare.length > 1) {ELTDaModificare.splice(ELTDaModificare.indexOf(ELTCliccato), 1); DatiAudioRegistrato[NumeroAudio].nonscaricarebuffer = false;}
        }
    }

    const SingoloELTDaModificare = (ELTDaModificare.length == 1);

    if (SingoloELTDaModificare) {
        /* Se l'unica clip rimasta selezionata è diversa dalla prima, resetta la finestra delle opzioni per settarla sull'unica clip selezionata */
        const OpzClip = document.getElementById(ID_Opzioni);
        if (ELTDaModificare[0].dataset.RiferimentoRegistrazione != OpzClip.dataset.RiferimentoRegistrazione) {
            EliminaElemento(OpzClip);
            CreaFinestraOpzioniClip(ELTDaModificare[0].dataset.RiferimentoRegistrazione);
        }
        /*****************************************************************************************************************************************/
        ELTDaSpostare = ELTDaModificare[0]; // Ribadisce che l'ELT da spostare è l'unico rimasto selezionato.
        if (X != 0) {
            ELTDaSpostare.dataset.posizionedelmouse = (+X + window.scrollX) - ContenitoreRighello.offsetLeft - ELTDaSpostare.offsetLeft;
            tmrELTCliccato = setTimeout(() => {
                ELTDaSpostare.className = "ELT transizione-morbida-no"; VisualizzazioneGraficaTaglioClip(NumeroAudio, false);
                Righello.addEventListener('mousemove', SpostaELT); Righello.addEventListener('touchmove', SpostaELT);
            }, 300);
            document.getElementById(ELTDaSpostare.id + 'StratoColore').ontouchstart = GestioneEventoELTCliccato;
        }

    } else {
        StoppaAutomaticamenteAscoltoInSolo(); StoppaCicloClip();                                // Stoppa l'eventuale ascolto in solo o la clip in ciclo
        document.getElementById(ELTDaSpostare.id + 'StratoColore').ontouchstart = "";           // Impedisce di muovere la prima clip
        VisualizzazioneGraficaTaglioClip(ELTDaModificare[0].dataset.RiferimentoRegistrazione);  // Visualizza solo la parte arancione della clip selezionata
    }

    /* Adattamento interfaccia in base al numero delle clip selezionate */
    document.getElementById(ID_Opzioni + 'Cancella').style.display = document.getElementById(ID_Opzioni + 'Duplica').style.display = document.getElementById(ID_Opzioni + 'divContenitoreTabellaMinutaggio').style.display = document.getElementById(ID_Opzioni + 'TabellaOpzioniRigaTaglioIniziale').style.display = document.getElementById(ID_Opzioni + 'TabellaOpzioniRigaTaglioFinale').style.display = document.getElementById(ID_Opzioni + 'divOpzioniRigaVarie').style.display = document.getElementById(ID_Opzioni + 'textareaCommenti').style.display = (SingoloELTDaModificare ? "" : "none");
    [document.getElementById(ID_Opzioni + 'labelPulDaAscoltare'), document.getElementById(ID_Opzioni + 'TabellaOpzioniRigaVolume'), document.getElementById(ID_Opzioni + 'divOpzioneEffetti')].forEach((opzionemodificamultipla) => {
        if (opzionemodificamultipla) {
            opzionemodificamultipla.style.opacity = 1 - (0.5 * (!SingoloELTDaModificare || (opzionemodificamultipla.dataset?.cliccato == "no")));
            opzionemodificamultipla.onclick = opzionemodificamultipla.ontouchstart = (e) => {e.currentTarget.style.opacity = 1;};
        }
    });
    document.getElementById(ID_Opzioni + 'divOpzioneEffetti').className = (SingoloELTDaModificare? "col-lg-7" : "");
    VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = SingoloELTDaModificare;
}

function DividiClipELT(NumeroAudio, X) {
    const ELT = document.getElementById('ELTReg' + NumeroAudio);
    ELTCliccato = ELT;
    const MinutaggioSelezionatoClip = MinutaggioCliccatoNellaClip(X), datiAudio = DatiAudioRegistrato[NumeroAudio];
    if ((datiAudio.taglioIniziale < MinutaggioSelezionatoClip) && (MinutaggioSelezionatoClip < datiAudio.taglioFinale)) {
        ELT.dataset.posizionePuntatoreInizioTaglio = X;
        AnteprimaSelezioneClip(ELT, X, DividiClip_puntatorerilasciato);
        EliminaEventiPuntatoreDividiClip();
        Righello.addEventListener('mousemove', AnteprimaSelezioneClip.Visualizza); Righello.addEventListener('touchmove', AnteprimaSelezioneClip.Visualizza);
        Righello.addEventListener('mouseup', DividiClip_puntatorerilasciato);
        Righello.dataset.DisattivaClick = "si";
    }
}

function GestioneEventoCommentoELTCliccato(e) {
    if ((e.button == 0) && (StrumentoMouse == toolStandard)) {GestioneEventoELTCliccato(e);}
}

function EvidenziaELTSelezionato(ELT, Selezionato) {
    ELT.className = "ELT transizione-morbida-" + (Selezionato? "no" : "si");
    ELT.style.zIndex = 5000000 * Selezionato;
    document.getElementById(ELT.id + "Contenuto").style.backgroundColor = (Selezionato? "rgba(255, 255, 255, 0.8)" : "");
    document.getElementById(ELT.id + 'StratoColore').style.transition = (Selezionato? "" : "all 2s");
    ELT.children[0].style.borderStyle = (Selezionato? "ridge" : "dotted");
}

function DisattivaSpostamentoManualeClip() {
    clearTimeout(tmrELTCliccato);
    Righello.removeEventListener('mousemove', SpostaELT);
    Righello.removeEventListener('touchmove', SpostaELT);
    if (ELTDaSpostare) {VisualizzazioneGraficaTaglioClip(ELTDaSpostare.dataset.RiferimentoRegistrazione);}
}

function DisabilitaELT_tranne(ELT, Disabilita) {
    const StratoColoreAltriELT = document.querySelectorAll(".StratoColoreELT:not(#" + ELT.id + "StratoColore)"), totStratoColoreAltriELT = StratoColoreAltriELT.length, stylePointerEvents = (Disabilita? "none" : "");
    
    for (let I = 0; I < totStratoColoreAltriELT; I++) {
        StratoColoreAltriELT[I].style.pointerEvents = stylePointerEvents;
    }
}

/*** Anteprima selezione clip ***
 * Visualizza in anteprima la selezione dell'onda all'interno della clip considerata.
 * @param {HTMLElement} ELTConsiderato  l'ELT selezionato
 * @param {Number}      ClientX         il valore x di partenza della selezione
 * @param {FunctionStringCallback} FunzioneTouchEnd Dato che l'evento touchend non viene intercettato in automatico, si può indicare la funzione prevista che verrà lanciata quando capisce che l'utente ha terminato la selezione. */
function AnteprimaSelezioneClip(ELTConsiderato, ClientX, FunzioneTouchEnd = () => {}) {
    const ELT = ELTConsiderato, x = (+ClientX + window.scrollX) - ContenitoreRighello.offsetLeft - ELT.offsetLeft;
    const div = CreaElemento('div', 'selezioneprovvisoria' + ELT.id, ELT.id + 'StratoColore', '', true); div.iStyle({position: "absolute", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.5)", zIndex: 1, left: x + "px"});
    ELT.iStyle({zIndex: 500000000, pointerEvents: "auto"}); DisabilitaELT_tranne(ELT, true); VisualizzazioneGraficaTaglioClip(ELT.dataset.RiferimentoRegistrazione, VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = true);

    AnteprimaSelezioneClip.Visualizza = (e) => {
        const DistanzaMouse = ((+(e.clientX || e.touches[0].clientX) + window.scrollX) - ContenitoreRighello.offsetLeft - ELT.offsetLeft) - x;
        div.iStyle({width: Math.abs(DistanzaMouse) + "px", transform: ((DistanzaMouse > 0) ? "" : "translate(-100%, 0)")});
        e.preventDefault();
        if (e.touches) {
            clearTimeout(AnteprimaSelezioneClip.tmr);
            AnteprimaSelezioneClip.tmr = setTimeout(() => {FunzioneTouchEnd(e);}, 300);
        }
    };

    AnteprimaSelezioneClip.Elimina = () => {EliminaElemento(div); VisualizzazioneGraficaTaglioClip(ELT.dataset.RiferimentoRegistrazione, VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = false); ELT.iStyle({zIndex: '', pointerEvents: ''}); DisabilitaELT_tranne(ELT, false); clearTimeout(AnteprimaSelezioneClip.tmr);};
}
AnteprimaSelezioneClip.Visualizza = () => {}; AnteprimaSelezioneClip.Elimina = () => {}; AnteprimaSelezioneClip.tmr = false;


function SelezionaTutteLeClipDiUnUtente(e) {
    const ID_Utente = e.currentTarget.dataset.idutente;
    if ((Righello.dataset.DisattivaClick == "no") && !StoRegistrando && DatiAudioRegistrato_Utente[ID_Utente]) {
        DatiAudioRegistrato_Utente[ID_Utente].forEach((da) => {
            if (da.Rimosso) {return;}
            const ELT = document.getElementById('ELTReg' + da.numero);
            if (ELT && !ELTDaModificare.includes(ELT)) {SelezionaESpostaELT(da.numero);}
        });
        CambiaTool(toolStandard);
    }
}

function RiposizionamentoAutomaticoClipSovrapposte(ELTConsiderato) {
    if (ELTDaSpostare) {return;}

    const tolleranza = 0.5; // Secondi di tolleranza per la sovrapposizione della parte arancione delle clip.
    const datiAudioELTConsiderato = DatiAudioRegistrato[ELTConsiderato.dataset.RiferimentoRegistrazione];
    const ID_UtenteConsiderato = datiAudioELTConsiderato.ID_Utente;

    var Riga = [[]], InizioFineAudio = {}, DatiAudioVisibili = [];
    const PrimaRiga = Riga[0];

    /* Raccoglie tutti i DatiAudioRegistrato visibili sulla timeline per la traccia considerata */
    DatiAudioRegistrato_Utente[ID_UtenteConsiderato].forEach((datiAudio) => {
        ( (ELT = document.getElementById('ELTReg' + datiAudio.numero)) && (ELT.style.display != "none") && (ELT.style.visibility != "hidden") && DatiAudioVisibili.push(datiAudio) );
    });

    function InizioFineClip(da) {
        const inizio = (+da.MinutaggioRegistrazione) + (+da.taglioIniziale);
        const fine = (+da.MinutaggioRegistrazione) + (+da.taglioFinale);
        InizioFineAudio[da.numero] = [inizio, fine];
        return InizioFineAudio[da.numero];
    }

    function ClipSiSovrappongono(a, b) {
        const [inizioA, fineA] = InizioFineAudio[a.numero] || InizioFineClip(a);
        const [inizioB, fineB] = InizioFineAudio[b.numero] || InizioFineClip(b);
        return ((inizioA < (fineB - tolleranza)) && (((+inizioB) + (+tolleranza)) < fineA));
    }

    function TrovaELTDaRiordinare(datiAudioConsiderato) {
        DatiAudioVisibili.forEach((datiAudio) => {
            ( !PrimaRiga.includes(datiAudio) && ClipSiSovrappongono(datiAudio, datiAudioConsiderato) && PrimaRiga.push(datiAudio) );
        });
    }

    /* Trova tutti gli ELT sovrapposti con l'ELTConsiderato e ripete il check per tutti gli ELT trovati */
    TrovaELTDaRiordinare(datiAudioELTConsiderato);
    for(I = 0; I < PrimaRiga.length; I++) {
        TrovaELTDaRiordinare(PrimaRiga[I]);
    }
    
    
    /* Effettua il riposizionamento */
    if (PrimaRiga.length > 0) {
        PrimaRiga.sort((a, b) => ((b.taglioFinale - b.taglioIniziale) - (a.taglioFinale - a.taglioIniziale)));
        let R = 0;
        while (RigaConsiderata = Riga[R]) {
            const NumNuovaRiga = +R + 1;
            for (let C = 0; C < RigaConsiderata.length; C++) {
                const datiAudioConsiderato = RigaConsiderata[C];
                for (let I = 0; I < RigaConsiderata.length; I++) {
                    const datiAudio = RigaConsiderata[I];
                    if (datiAudioConsiderato == datiAudio) {continue;}
                    if (ClipSiSovrappongono(datiAudio, datiAudioConsiderato)) {RigaConsiderata.splice(I, 1); Riga[NumNuovaRiga] = (Riga[NumNuovaRiga] || []); Riga[NumNuovaRiga].push(datiAudio); I--;}
                }
            }
            R++;
        }

        const altezzaclip = 100 / R;
        for (let I = 0; I < R; I++) {
            const topELT = (altezzaclip * I) + "%";
            Riga[I].forEach(da => document.getElementById('ELTReg' + da.numero).iStyle({top: topELT, height: altezzaclip + "%"}));
        }
    }
}

function PosizioneOriginaleClipSovrapposte(ID_Utente) {
    DatiAudioRegistrato_Utente[ID_Utente].forEach((datiAudio) => {
        document.getElementById("ELTReg" + datiAudio.numero).iStyle({top: "0%", height: "100%"});
    });
}

function VisualizzaCommentiELT(Numero) {
    function FormattaCommenti(Commenti) {
        return Commenti.ritorniACapoHTML().replace(/(".+?")/g, "<span style='font-size: 90%; font-style: italic;'>$1</span>");
    }

    const datiAudio = DatiAudioRegistrato[Numero], CommentiDoppiatore = datiAudio.commentiDoppiatore, CommentiCreatoreProgetto = datiAudio.commentiCreatoreProgetto, Doppiaspunta = "<span class='fa fa-check' style='color: white; font-size: 9px;'></span><span class='fa fa-check' style='color: darkturquoise; font-size: 9px; position: relative; left: -5px;'></span>", GrandezzaFont = (SistemaAttualeAndroid ? "20px" : "");
    const id_ELT = 'ELTReg' + datiAudio.numero, id_commentoELT = 'CommentoELT' + Numero, id_freccia = 'freccia' + id_commentoELT, id_commentoDoppiatore = 'testoCommentoDoppiatore' + id_commentoELT, id_commentoCreatoreProgetto = 'testoCommentoCreatoreProgetto' + id_commentoELT;

    if ((CommentiDoppiatore != "") || (CommentiCreatoreProgetto != "")) {
        if (!(DatiDoppiatore = DatiDoppiatori[datiAudio.ID_Utente])) {return;} // Verifica se esiste la traccia del doppiatore considerato (può essere un doppiatore aggiunto dopo il caricamento della pagina)
        const NomeDoppiatore = DatiDoppiatore.nome;
        
        const commentoELT = CreaElementoSeInesistente('div', id_commentoELT, id_ELT, '', 'CommentoELT'); commentoELT.style.left = document.getElementById(id_ELT + 'StratoColore').style.left; commentoELT.dataset.RiferimentoRegistrazione = Numero; commentoELT.onmousedown = GestioneEventoCommentoELTCliccato;
        const FrecciaCommentoELT = CreaElementoSeInesistente('div', id_freccia, id_commentoELT, '', 'FrecciaCommentoELT blu-bordo-semitrasparente');
        
        function CommentoDaLeggere() {
            FrecciaCommentoELT.style.animation = "blink 1s ease 0s infinite";
            document.getElementById(id_ELT).addEventListener('mouseenter', MemorizzaCommentiVisualizzati);
        }

        if (CommentiDoppiatore != "") {
            const CommentiDoppiatoreFormattati = FormattaCommenti(CommentiDoppiatore), CommentiVisualizzatiCP = (datiAudio.commentiVisualizzatiCreatoreProgetto == 1);
            CreaElementoSeInesistente('div', id_commentoDoppiatore, id_commentoELT, `${CommentiDoppiatoreFormattati}${(CommentiVisualizzatiCP? Doppiaspunta : "")}<div class='FirmaCommento'>${NomeDoppiatore}</div><hr />`, 'TestoCommentoELT').style.fontSize = GrandezzaFont;
            if ((SonoCreatoreProgetto) && (!CommentiVisualizzatiCP)) {CommentoDaLeggere();}
        } else {
            EliminaElemento(document.getElementById(id_commentoDoppiatore));
        }

        if (CommentiCreatoreProgetto != "") {
            const CommentiCreatoreProgettoFormattati = FormattaCommenti(CommentiCreatoreProgetto), CommentiVisualizzatiD = (datiAudio.commentiVisualizzatiDoppiatore == 1);
            CreaElementoSeInesistente('div', id_commentoCreatoreProgetto, id_commentoELT, `${CommentiCreatoreProgettoFormattati}${(CommentiVisualizzatiD? Doppiaspunta : "")}<div class='FirmaCommento'>${NomeCreatoreProgetto}</div>`, 'TestoCommentoELT').style.fontSize = GrandezzaFont;
            if ((!SonoCreatoreProgetto) && (!CommentiVisualizzatiD)) {CommentoDaLeggere();}
        } else {
            EliminaElemento(document.getElementById(id_commentoCreatoreProgetto));
        }

    } else {
        EliminaElemento(document.getElementById(id_commentoELT));
    }
}

function MemorizzaCommentiVisualizzati(e) {
    const ELT = e.currentTarget, Numero = ELT.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero], N = datiAudio.NumeroUnivoco;
    const Destinatario = (SonoCreatoreProgetto? "CreatoreProgetto" : "Doppiatore");
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
    for (let I = ((+TracciaDaRidimensionare) + 1); I < NumeroTotaleTracce; I++) {document.getElementById('Traccia' + I).style.opacity = 0; document.getElementById('NomeTraccia' + I).style.opacity = 0;}
    document.body.addEventListener('mousemove', VariazioneAltezzaTracciaConMouse);          ContenitoreLineaTemporale.addEventListener('touchmove', VariazioneAltezzaTracciaConMouse);
    document.body.addEventListener('mouseup',   DisattivaVariazioneAltezzaTracciaConMouse); ContenitoreLineaTemporale.addEventListener('touchend',  DisattivaVariazioneAltezzaTracciaConMouse);
}

function VariazioneAltezzaTracciaConMouse(e) {
    const Y = e.clientY || e.touches[0].clientY, NumeroTraccia = TracciaDaRidimensionare, maxAltezza = 800; 
    e.preventDefault();
    if (Y > (window.innerHeight - 100)) {window.scrollBy(0, 8);} else {window.scrollTo(window.scrollX, WindowScrollY_Iniziale);}

    const AltezzaIndicata = (Y + window.scrollY) - LimiteMinimoTracciaDaRidimensionare, CondizioneSogliaMinima = (AltezzaIndicata > 0), CondizioneSogliaMassima = (AltezzaIndicata < maxAltezza);
    const Altezza = (+AltezzaMinimaTraccia) + (AltezzaIndicata * CondizioneSogliaMinima * CondizioneSogliaMassima) + (maxAltezza * !CondizioneSogliaMassima);
    VariaAltezzaTraccia(NumeroTraccia, Altezza);
}

function VariaAltezzaTraccia(NumeroTraccia, pxAltezza) {
    document.getElementById('Traccia' + NumeroTraccia).style.height = pxAltezza + "px";
    document.getElementById('NomeTraccia' + NumeroTraccia).style.height = pxAltezza + "px";
}

function DisattivaVariazioneAltezzaTracciaConMouse(e) {
    document.body.removeEventListener('mousemove', VariazioneAltezzaTracciaConMouse);           ContenitoreLineaTemporale.removeEventListener('touchmove', VariazioneAltezzaTracciaConMouse);
    document.body.removeEventListener('mouseup',   DisattivaVariazioneAltezzaTracciaConMouse);  ContenitoreLineaTemporale.removeEventListener('touchend',  DisattivaVariazioneAltezzaTracciaConMouse);
    SpostaInBassoTracceSuccessive();
    AdattaAltezzaContenitoreTracce();
    TracciaDaRidimensionare = false;
}

function SpostaInBassoTracceSuccessive() {
    var TracciaPrecedente, NuovoTop, I;
    for (I = ((+TracciaDaRidimensionare) + 1); I < NumeroTotaleTracce; I++) {
        TracciaPrecedente = document.getElementById('Traccia' + (I - 1));
        NuovoTop = ((+TracciaPrecedente.offsetTop) + (+TracciaPrecedente.offsetHeight)) + "px";
        document.getElementById('Traccia' + I).iStyle({top: NuovoTop, opacity: 1}); document.getElementById('NomeTraccia' + I).iStyle({top: NuovoTop, opacity: 1});
    }
}

function AdattaAltezzaContenitoreTracce() {
    ContenitoreRighello.style.height = "100%";
    if (UnitaDiMisura != "%") {
        const UltimaTraccia = document.getElementById('Traccia' + (NumeroTotaleTracce - 1));
        divContenutoTracce.style.height = ((+UltimaTraccia.offsetTop) + (+UltimaTraccia.offsetHeight) + 800) + "px";
        ContenitoreLineaTemporale.style.height = divContenutoTracce.style.height;
    }
}

function AdattaAltezzaTracciaRuoliDaAssegnare() {
    AdattaAltezzaTraccia(RuoliDaAssegnare_NumeroTraccia);
}

function AdattaAltezzaTraccia(Numero) {
    VariaAltezzaTraccia(Numero, ((+document.getElementById('divContenutoNomeTraccia' + Numero).offsetHeight) + 15));
    SpostaInBassoTracceSuccessive();
}
/******************************************/

function CreaFinestraOpzioniClip(RiferimentoRegistrazione) {
    const datiAudio = DatiAudioRegistrato[RiferimentoRegistrazione], PartenzaRegistrazione = datiAudio.MinutaggioRegistrazione, LunghezzaRegistrazione = datiAudio.Durata, AudioAttivo = !datiAudio.Rimosso;
    var NuovoAudioTrattato = false, NuoveClipCreate = [], Tabella;

    /** Memorizza il valore attuale di tutte le opzioni per poterle ripristinare in caso di annullamento **/
    const Max = Number(totDurataVideoGuida) - Number(LunghezzaRegistrazione), MinutaggioAttuale = new MinutiESecondi(PartenzaRegistrazione), MinutaggioMassimo = new MinutiESecondi(Max);
    const minutiprec = MinutaggioAttuale.Minuti, secondiprec = MinutaggioAttuale.Secondi;
    const guadagnoprec = GuadagnoPrincipale[RiferimentoRegistrazione].gain.value;
    const taglioinizialeprec = datiAudio.taglioIniziale, tagliofinaleprec = datiAudio.taglioFinale;
    const effettiprec = datiAudio.effetti, intensitaeffettiprec = datiAudio.intensitaeffetti;
    var bufferoriginale = false;
    /******************************************************************************************************/

    /** Funzioni per la creazione degli strumenti dell'interfaccia utente **/
    const id_slideEffetto = ID_Opzioni + "slideEffetto";

    function CreaSlide(IDRiferimento, Stringa, minSlide, maxSlide, stepSlide, minCasella, maxCasella, stepCasella, labelCasella, FunzioneInputSlide, FunzioneChangeCasella, valoreIniziale, FunzioneOnChange2 = () => {}) {
        const tr_id = ID_Opzioni + 'TabellaOpzioniRiga' + IDRiferimento;
        CreaNuoviElementi([
            Tabella.id,
                ['tr', {id: tr_id}],,
                    ['td', {innerHTML: Stringa}, {fontSize: '12px'}],
                    ['td'],, ['input', {id: tr_id + "Slide", value: +valoreIniziale, oninput: (e) => {FunzioneInputSlide(e); FunzioneOnChange2(e);}}, {}, {RiferimentoRegistrazione: RiferimentoRegistrazione}, {type: "range", min: minSlide, max: maxSlide, step: stepSlide}],
                0,  ['td', {}, {textAlign: "left"}],, ['input', {id: tr_id + "Casella", onchange: (e) => {FunzioneChangeCasella(e); FunzioneOnChange2(e);}}, {width: "80px"}, {RiferimentoRegistrazione: RiferimentoRegistrazione}, {type: "number", min: minCasella, max: maxCasella, step: stepCasella}], ['span', {textContent: " " + labelCasella}]
        ]);
        FunzioniCasellaNumerica(document.getElementById(tr_id + "Casella"));

        setTimeout(() => {
            if (ELTDaModificare.length == 1) {FunzioneInputSlide({currentTarget: document.getElementById(tr_id + "Slide")});} // Simula inserimento manuale visualizzando correttamente l'interfaccia utente (solo se singola clip)
        }, 200);
    }

    function CreaPulsanteEffetto(Effetto, IDContenitore, labelPulsante) {
        const pulEffetto = CreaElemento('a', ID_Opzioni + "pulEffetto" + Effetto, IDContenitore, "<span class='fa " + simboloEffetto[Effetto] + "'></span> " + labelPulsante); pulEffetto.className = "btn btn-default";
              pulEffetto.setAttribute('name', 'pulEffetto');
              pulEffetto.dataset.effetto = Effetto;
              if (datiAudio.effetti == Effetto) {PulsanteEffettoAttivo(pulEffetto);}
              pulEffetto.addEventListener('click', AttivaDisattivaEffetto);
    }

    function AttivaDisattivaEffetto(e) {
        if (e.target.tagName == "INPUT") {return;} // Non disattiva l'effetto se l'utente ha cliccato sullo slide

        const pulEffetto = e.currentTarget, Effetto = pulEffetto.dataset.effetto, Numero = ELTDaModificare[0].dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero];
        const pulsantiEffetti = document.getElementsByName('pulEffetto'), totPulsantiEffetti = pulsantiEffetti.length, classe_default = "btn btn-default";
    
        /* Resetta graficamente gli effetti */
        for (var I = 0; (I < totPulsantiEffetti) && (pulsantiEffetti[I].className = classe_default); I++);
        EliminaElemento(document.getElementById(id_slideEffetto));
    
        /* Attiva l'eventuale nuovo effetto, se l'effetto era già stato selezionato lo disattiva */
        var EffettoDaInserire = "";
        if (datiAudio.effetti != Effetto) {
            EffettoDaInserire = Effetto;
            PulsanteEffettoAttivo(pulEffetto, true);
        }
    
        ELTDaModificare.forEach((clipELT) => {
            const Numero = clipELT.dataset.RiferimentoRegistrazione, da = DatiAudioRegistrato[Numero];
            da.effetti = EffettoDaInserire;
            if (da.audio) {AttivaEffettiAudio(Numero);} else {VisualizzaEffettiAudio(Numero);}
        });
    }

    function PulsanteEffettoAttivo(pulEffetto, NuovoEffetto = false) {
        const Effetto = pulEffetto.dataset.effetto, IntensitaEffettoIniziale = (NuovoEffetto? 0.5 : datiAudio.intensitaeffetti);
        pulEffetto.className = "btn btn-warning";
        const slideEffetto = CreaElemento('input', id_slideEffetto, pulEffetto.id); slideEffetto.setAttribute("type", "range"); slideEffetto.setAttribute("min", 0.1); slideEffetto.setAttribute("max", 2); slideEffetto.setAttribute("step", 0.1);
              slideEffetto.value = IntensitaEffettoIniziale;
              slideEffetto.onmousedown  = (e) => {ELTDaModificare.forEach((clipELT) => {const Numero = clipELT.dataset.RiferimentoRegistrazione, da = DatiAudioRegistrato[Numero], da_effprec = da.effetti; da.effetti = Effetto; if ((da.audio) && (da_effprec != Effetto)) {AttivaEffettiAudio(Numero);} else {VisualizzaEffettiAudio(Numero);}})}; // Ribadisce l'effetto in caso di più clip selezionate
              slideEffetto.oninput      = (e) => {ELTDaModificare.forEach((clipELT) => {const Numero = clipELT.dataset.RiferimentoRegistrazione, da = DatiAudioRegistrato[Numero]; da.intensitaeffetti = e.currentTarget.value; GestisciIntensitaEffetto(Numero);})};
              ELTDaModificare.forEach((clipELT) => {DatiAudioRegistrato[clipELT.dataset.RiferimentoRegistrazione].intensitaeffetti = IntensitaEffettoIniziale;});
    }
    /***********************************************************************/

    /*** Crea la finestrella delle opzioni ***/
    const divContenitoreOpzioni = CreaElemento('div', ID_Opzioni, document.body.id); divContenitoreOpzioni.className = "panel panel-info"; divContenitoreOpzioni.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
    if (window.innerWidth < ParametriOpzioniClip.larghezzaminimafinestra) {divContenitoreOpzioni.style.width = "600px";}
    if (window.innerHeight < ParametriOpzioniClip.altezzaminimafinestra) {divContenitoreOpzioni.style.transform = "scale(" + (window.innerHeight / ParametriOpzioniClip.altezzaminimafinestra) + ")";}
    divContenitoreOpzioni.addEventListener('mouseup', () => {OggettoDaSpostare = false; document.body.removeEventListener('mousemove', SpostaOggettoColMouse);});
    
    /** Barra del titolo **/
    CreaNuoviElementi([
        ID_Opzioni, ['div', {id: 'OpzioniTitolo', className: "panel-heading text-center"}, {userSelect: "none"}],,
            ['div', {textContent: strOpzioniTraccia, onmousedown: () => {OggettoDaSpostare = divContenitoreOpzioni; document.body.addEventListener('mousemove', SpostaOggettoColMouse);}}, {width: "70%", margin: "0px auto", cursor: "move"}],
            ['a', {id: ID_Opzioni + 'Cancella', className: (AudioAttivo? 'btn btn-danger fa fa-trash-o' : 'btn btn-info fa fa-undo'), title: (AudioAttivo? strCancellaClip : strRipristinaClip), onclick: (e) => {CancellaRipristinaRegistrazione(e.currentTarget.dataset.RiferimentoRegistrazione, !AudioAttivo);}}, {position: "absolute", top: "5px", left: "10px"}, {RiferimentoRegistrazione: RiferimentoRegistrazione}],
            ['a', {id: ID_Opzioni + 'Duplica', innerHTML: "<span class='fa fa-copy'></span>" + strDuplicaClip_lblPulsante, className: "btn btn-info", title: strDuplicaClip, onclick: (e) => {OpzioniClip(e.currentTarget.dataset.RiferimentoRegistrazione, false, true); DuplicaClip(e.currentTarget.dataset.RiferimentoRegistrazione);}}, {position: "absolute", top: "5px", right: "10px"}, {RiferimentoRegistrazione: RiferimentoRegistrazione}]
    ]);
    
    /** Contenuto **/
    const divcontenitorebody = CreaElemento('div', ID_Opzioni + 'ContenitoreOpzioniBody', ID_Opzioni); divcontenitorebody.className = "panel-body";
        
        /* Pulsante clip da ascoltare */
        if (SonoCreatoreProgetto) {
            const labelDaAscoltare = CreaElemento('label', ID_Opzioni + 'labelPulDaAscoltare', divcontenitorebody.id); labelDaAscoltare.className = "btn btn-default btn-xs"; labelDaAscoltare.setAttribute('title', strDaAscoltare_title); labelDaAscoltare.iStyle({position: "absolute", top: "50px", right: "2px", zIndex: 1, opacity: 0.5}); labelDaAscoltare.dataset.cliccato = "no";
                  const pulDaAscoltare = CreaElemento('input', ID_Opzioni + 'checkPulDaAscoltare', labelDaAscoltare.id); pulDaAscoltare.setAttribute('type', 'checkbox'); pulDaAscoltare.checked = datiAudio.daAscoltare;
                        pulDaAscoltare.onclick = () => {ELTDaModificare.forEach((ClipELT) => {const da = DatiAudioRegistrato[ClipELT.dataset.RiferimentoRegistrazione]; da.daAscoltare = pulDaAscoltare.checked; VisualizzaModificaAudioAscoltato(da);}); labelDaAscoltare.dataset.cliccato = "si";};
                  CreaElemento('span', ID_Opzioni + 'lblPulDaAscoltare', labelDaAscoltare.id, " " + strDaAscoltare);
        }
        /******************************/

        /*** Posizione ed effetti della clip ***/
        const tdPosizioneMinuti_id = ID_Opzioni + 'tdOpzionePosizioneMinuti', tdPosizioneSecondi_id = ID_Opzioni + 'tdOpzionePosizioneSecondi', divOpzioneEffetti_id = ID_Opzioni + 'divOpzioneEffetti';
        const stililabel = {fontSize: "12px"};
        function SpostaMinutaggioModificatoManualmente(e) {SpostaMinutaggioRegistrazione(e.currentTarget.dataset.RiferimentoRegistrazione);}
        CreaNuoviElementi([
            divcontenitorebody.id, ['div'],,
                /* Minutaggio */
                ['div', {id: ID_Opzioni + 'divContenitoreTabellaMinutaggio', className: "col-lg-5"}], ['div', {id: divOpzioneEffetti_id}], // la classe: "col-lg-7" viene indicata da SelezionaESpostaELT se selezionata la singola clip
                1, ['table', {id: ID_Opzioni + 'TabellaMinutaggio'}],,
                        ['tr'],,
                            ['td', {textContent: strPosizione}, {fontSize: "12px", verticalAlign: "bottom", paddingBottom: "5px"}], ['td'],,
                                ['table'],,
                                    ['tr'],,
                                        ['td', {textContent: strMinuti}, stililabel], ['td'], ['td', {textContent: strSecondi}, stililabel],
                                -5, ['tr'],,
                                        ['td', {id: tdPosizioneMinuti_id}], ['td', {textContent: ":"}], ['td', {id: tdPosizioneSecondi_id}],
                                        tdPosizioneMinuti_id,
                                            ['input', {id: ID_Opzioni + 'MinutaggioMinuti', className: "SelettoreMinutaggioMinuti", value: MinutaggioAttuale.Minuti, onchange: SpostaMinutaggioModificatoManualmente}, {}, {RiferimentoRegistrazione: RiferimentoRegistrazione}, {type: "number", min: 0, max: MinutaggioMassimo.Minuti, step: 1}],
                                        tdPosizioneSecondi_id,
                                            ['input', {id: ID_Opzioni + 'MinutaggioSecondi', className: "SelettoreMinutaggioSecondi", value: MinutaggioAttuale.Secondi, onchange: SpostaMinutaggioModificatoManualmente}, {}, {RiferimentoRegistrazione: RiferimentoRegistrazione}, {type: "number", min: 0, max: 59.999, step: 0.1}]
        ]).slice(-2).forEach(input => FunzioniCasellaNumerica(input));

                    /* Effetti */
        CreaElemento('div', ID_Opzioni + 'labelOpzioneEffetti', divOpzioneEffetti_id, strApplicaUnEffetto);
        CreaPulsanteEffetto('radio',     divOpzioneEffetti_id, strEffettoRadio);
        CreaPulsanteEffetto('ovattato',  divOpzioneEffetti_id, strEffettoOvattato);
        CreaPulsanteEffetto('echo',      divOpzioneEffetti_id, strEffettoEco);
        CreaPulsanteEffetto('riverbero', divOpzioneEffetti_id, strEffettoRiverbero);
        /**************************************/

        /*** Tabella sliders ***/
        Tabella = CreaElemento('table', ID_Opzioni + 'TabellaOpzioni', divcontenitorebody.id); Tabella.className = "TabellaOpzioni";

                                        /* Guadagno */	
            CreaSlide('Volume', strVolume, 0, 30, 0.01, 0, 3000, 10, "%", evslide_CambiaVolumeClip, evcasella_CambiaVolumeClip, GuadagnoPrincipale[RiferimentoRegistrazione].gain.value, (e) => {VisualizzazioneGraficaTaglioClip(+e.currentTarget.dataset.RiferimentoRegistrazione, false)});

                                    /* Tagli iniziali e finali */
            const FunzioneOnChangePerTagliInizialiEFinali = (e) => {VisualizzazioneGraficaTaglioClip(+e.currentTarget.dataset.RiferimentoRegistrazione, true);};
            CreaSlide('TaglioIniziale',  strTaglioIniziale,                    0, LunghezzaRegistrazione, 0.01,                  0, LunghezzaRegistrazione, 0.01, strsecondi, ev_CambiaTaglioInizialeClip,  ev_CambiaTaglioInizialeClip, datiAudio.taglioIniziale, FunzioneOnChangePerTagliInizialiEFinali);
            CreaSlide('TaglioFinale',      strTaglioFinale,   taglioclip_diffmin, LunghezzaRegistrazione, 0.01, taglioclip_diffmin, LunghezzaRegistrazione, 0.01, strsecondi, ev_CambiaTaglioFinaleClip,    ev_CambiaTaglioFinaleClip,   datiAudio.taglioFinale,   FunzioneOnChangePerTagliInizialiEFinali);
        /**********************/

                                            /* Varie */
        const stiliMenu = {textAlign: "left", width: "100%"}, NomeFile = `${NomeProgetto} ${NomeDoppiaggio} ${DatiDoppiatori[datiAudio.ID_Utente].nome} ${strBattuta} ${strA} ${MinutaggioAttuale.Minuti.duecifre()} min ${MinutaggioAttuale.Secondi.toFixed(3)} sec${datiAudio.Registrazione.slice(datiAudio.Registrazione.lastIndexOf("."))}`.replace(/[^a-zA-Z0-9\.]/g, "_");
        const divOpzioniVarie_id = ID_Opzioni + 'divOpzioniRigaVarie', pulAscolta_id = ID_Opzioni + 'PulAscolta', ulPulAscolta_id = ID_Opzioni + 'ulMenuPulAscolta', ulPulScarica_id = ID_Opzioni + 'ulMenuPulScarica', liAscoltaSoloTaglio_id = ID_Opzioni + "AscoltaSoloTaglio";
        CreaNuoviElementi([
            divcontenitorebody.id, ['div', {id: divOpzioniVarie_id}],,
                ['div', {className: "btn-group"}, {marginRight: "5px", width: "125px"}], ['div', {className: "btn-group"}, {width: "165px"}],
                    1, ['a', {id: pulAscolta_id}, {}, {toggle: "dropdown", RiferimentoRegistrazione: RiferimentoRegistrazione}], ['ul', {id: ulPulAscolta_id, className: "dropdown-menu"}],,
                            ['li', {id: liAscoltaSoloTaglio_id, innerHTML: "<span class='fa fa-exchange'></span> " + strSoloTaglio, className: "btn btn-default", onclick: AscoltaInSolo_ParteTagliata}, stiliMenu],
                            ['li', {innerHTML: "<span class='fa fa-toggle-right'></span> " + strDaInizioAFine,                      className: "btn btn-default", onclick: AscoltaInSolo_Tutto}, stiliMenu],
                            ['li', {innerHTML: "<span class='fa fa-refresh'></span> " + strCiclaClip,                               className: "btn btn-info",    onclick: CiclaClip}, stiliMenu],

                    2, ['a', {innerHTML: " " + strScaricaRegistrazione + " <span class='caret'></span>", className: "btn btn-default btn-sm fa fa-download", onclick: ApriMenuOpzioniScaricamento}, {}, {toggle: "dropdown", RiferimentoRegistrazione: RiferimentoRegistrazione}], ['ul', {id: ulPulScarica_id, className: "dropdown-menu"}],,
                            ['li', {innerHTML: `<span class='fa fa-file-audio-o'></span> ${strScaricaClipOriginale}<a id='${ID_Opzioni}aScaricaOriginale' href="${datiAudio.Registrazione}" download="${NomeFile}" style='display: none;'></a>`, className: "btn btn-info", onclick: DownloadClipFinestraOpzioni}, stiliMenu],
                            ['li', {innerHTML: "<span class='fa fa-tasks'></span> " + strScaricaClipConversione, className: "btn btn-primary", onclick: DownloadClipConversione}, stiliMenu, {larghezza: "850px", altezza: "500px", RiferimentoRegistrazione: RiferimentoRegistrazione}]
        ]);
        const pulAscolta = document.getElementById(pulAscolta_id), liAscoltaSoloTaglio = document.getElementById(liAscoltaSoloTaglio_id);
        PulAscoltaPosizioneDefault(pulAscolta);

            const divTrattamentoAudio_id = ID_Opzioni + 'divTrattamentoAudio';
            CreaNuoviElementi([divOpzioniVarie_id, ['div', {id: divTrattamentoAudio_id, className: "btn"}, {cursor: "auto", width: "fit-content", whiteSpace: "break-spaces"}],, ['fieldset'],, ['legend', {textContent: strTrattamentoAudio}, {fontSize: "16px"}]]);

                    const pulRiduciRumore = CreaElemento('div', ID_Opzioni + 'pulRiduciRumore', divTrattamentoAudio_id, strRiduzioneRumore); pulRiduciRumore.className = "btn btn-default"; pulRiduciRumore.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
                    if (DatiAudioRegistrato[RiferimentoRegistrazione].Registrazione.indexOf('-trattato') == -1) {
                        pulRiduciRumore.onclick = async (e) => {
                            divVetro.iStyle({display: "inline", opacity: 0});
                            const pulsante = e.currentTarget, Numero = pulsante.dataset.RiferimentoRegistrazione, da = DatiAudioRegistrato[Numero], b = da.buffer.getChannelData(0), lunghezzaBuffer = b.length, SampleRate = da.buffer.sampleRate, LimiteSecondiSogliaRumoreAttacco = RiduzioneRumore.SecondiSogliaRumoreAttacco * SampleRate, LimiteSecondiSogliaRumoreTermine = RiduzioneRumore.SecondiSogliaRumoreTermine * SampleRate;

                            /* Inizializzazione interfaccia */
                            StoppaAutomaticamenteAscoltoInSolo(); StoppaCicloClip();
                            pulsante.abilita(false);
                            pulsante.iStyle({border: "none", color: "black"});
                            pulsante.innerHTML = "<span class='fa fa-spin fa-spinner'></span> " + strInElaborazione;

                            /* Copia del buffer originale nell'apposita variabile */
                            bufferoriginale = audioContext.createBuffer(1, lunghezzaBuffer, SampleRate);
                            bufferoriginale.copyToChannel(b, 0);

                            CentraOndaSonora(b);
                            
                            await pausa(100);

                            /* Riduce o annulla il rumore nei punti in cui non c'è il parlato (se l'opzione è attiva e se il volume della clip non è troppo alto: in quest'ultimo caso potrebbe voler dire che la clip è stata registrata ad un volume sotto soglia) */
                            if (RiduzioneRumore.ApplicareSogliaRumore && (GuadagnoPrincipale[Numero].gain.value < 19)) {
                                var contSogliaNonRaggiunta = LimiteSecondiSogliaRumoreTermine;
                                const sogliarumore = TrattamentoClip.AutoTaglioIniziale.SogliaDB;
                                for (let I = 0; I < lunghezzaBuffer; I++) {
                                    const sogliasuperata = ((Math.abs(b[I]) > sogliarumore) || (Math.abs(b[(+I) + (+LimiteSecondiSogliaRumoreAttacco)]) > sogliarumore));
                                    contSogliaNonRaggiunta = ++contSogliaNonRaggiunta * !sogliasuperata;
                                    const condizioneraggiunta = ((sogliasuperata) || (contSogliaNonRaggiunta < LimiteSecondiSogliaRumoreTermine));
                                    b[I] *= (condizioneraggiunta + (RiduzioneRumore.GainRumore * !condizioneraggiunta));
                                }
                                await pausa(100);
                            }

                            const bloburl = URL.createObjectURL(new Blob([audiobufferToWav(b, SampleRate, {float32: true, notrattamento: true})]));
                            ApriFinestra({currentTarget: {dataset: {larghezza: "300px", altezza: "300px", link: "TrattamentoAudio_RiduzioneRumore.php?N=" + encodeURIComponent(da.NumeroUnivoco) + "&Percorso=" + encodeURIComponent(bloburl) + "&Guadagno=" + GuadagnoPrincipale[da.numero].gain.value + "&TaglioIniziale=" + da.taglioIniziale + "&TaglioFinale=" + da.taglioFinale}}});

                            const nomefile = bloburl.slice(bloburl.lastIndexOf('/') + 1) + "." + formatoQualitaAlta;

                            function VerificaTermineProcesso() {
                                AJAX("TrattamentoAudio_VerificaFile.php", "NomeFile=" + encodeURIComponent(nomefile), (Dati) => {
                                    if (Dati.Esiste) {
                                        CaricaAudio(0, {Registrazione: Dati.PercorsoCompleto}, 'arraybuffer', 
                                            (Contenuto) => {
                                                NuovoAudioTrattato = Contenuto.slice();
                                                audioContext.decodeAudioData(Contenuto).then((buffernuovo) => {
                                                    function SelezionaAudio(e) {
                                                        StoppaAutomaticamenteAscoltoInSolo();
                                                        da.buffer = ((e.currentTarget.value == 0) ? bufferoriginale : buffernuovo);
                                                        if (ClipInCiclo) {CiclaClip();} else {liAscoltaSoloTaglio.click();}
                                                    }

                                                    pulsante.innerHTML = "<span class='fa fa-check' style='color: green;'></span> " + strCreazioneCompletata;

                                                    const AttributiPulsanti = {type: "radio", name: "opzAudioOriginaleTrattato"};
                                                    CreaNuoviElementi([
                                                        divTrattamentoAudio_id, ['label', {className: "btn btn-default"}], ['label', {className: "btn btn-default"}],
                                                            0, ['input', {value: 0, onclick: SelezionaAudio},                                        {}, {}, AttributiPulsanti], ['span', {textContent: " " + strSelezionaAudioOriginale}],
                                                            1, ['input', {value: 1, onclick: SelezionaAudio, id: ID_Opzioni + "inputAudioTrattato"}, {}, {}, AttributiPulsanti], ['span', {textContent: " " + strSelezionaAudioTrattato}]
                                                    ])[1].click();

                                                    divVetro.style.display = "none";
                                                }).catch((err) => {console.log("Errore nuovo audio", err); pulsante.innerHTML = strRiduzioneRumore_errore; divVetro.style.display = "none";});
                                                
                                                AJAX("TrattamentoAudio_EliminaFile.php", "NomeFile=" + encodeURIComponent(nomefile), "", "", "", true);
                                                URL.revokeObjectURL(bloburl);
                                            }
                                        );
                                    } else {
                                        setTimeout(VerificaTermineProcesso, 1000);
                                    }
                                }, "", "", true);
                            }

                            setTimeout(VerificaTermineProcesso, 1000);
                        };

                    } else {
                        pulRiduciRumore.innerHTML = strRiduzioneRumore_effettuato;
                        pulRiduciRumore.iStyle({border: "none", pointerEvents: "none"});
                        pulRiduciRumore.dataset.riduzionerumoreapplicata = 1;
                    }

                    CreaElemento('span', ID_Opzioni + 'spaziotrattamentoaudio', divTrattamentoAudio_id, ' ');

                    const pulSpezzaBattute = CreaElemento('div', ID_Opzioni + 'pulSpezzaBattute', divTrattamentoAudio_id, strSpezzaBattute); pulSpezzaBattute.className = "btn btn-default"; pulSpezzaBattute.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione; pulSpezzaBattute.setAttribute('title', strSpezzaBattute_spiegazione);
                    pulSpezzaBattute.onclick = async (e) => {
                        divVetro.iStyle({display: "inline", opacity: 0});
                        const pulsante = e.currentTarget, Numero = pulsante.dataset.RiferimentoRegistrazione, da = DatiAudioRegistrato[Numero], b = da.buffer.getChannelData(0), SampleRate = da.buffer.sampleRate, lunghezzaBufferConsiderata = da.taglioFinale * SampleRate, SogliaAttacco = SpezzaBattute.SogliaAttaccoDB, LimiteSecondiSogliaAttacco = SpezzaBattute.SecondiSogliaAttacco * SampleRate, LimiteSecondiSogliaTermine = SpezzaBattute.SecondiSogliaTermine * SampleRate, SogliaRiposo = SampleRate * 60;
                        var Attacco = true, attacchi = [];

                        /* Inizializzazione interfaccia */
                        StoppaAutomaticamenteAscoltoInSolo();
                        pulsante.abilita(false);
                        pulsante.iStyle({border: "none", color: "black"});
                        pulsante.innerHTML = "<span class='fa fa-spin fa-spinner'></span> " + strInElaborazione;

                        /* Crea un array con alternati inizio e fine battuta. Gli elementi pari sono l'attacco e gli elementi dispari sono la fine della battuta. */
                        var contSogliaNonRaggiunta = LimiteSecondiSogliaTermine;
                        for (let I = da.taglioIniziale * SampleRate; I < lunghezzaBufferConsiderata; I++) {
                            const sogliasuperata = ((Math.abs(b[I]) > SogliaAttacco) || (Math.abs(b[(+I) + (+LimiteSecondiSogliaAttacco)]) > SogliaAttacco));
                            contSogliaNonRaggiunta = ++contSogliaNonRaggiunta * !sogliasuperata;
                            const condizioneraggiunta = ((sogliasuperata) || (contSogliaNonRaggiunta < LimiteSecondiSogliaTermine));
                            if (condizioneraggiunta) {if (Attacco) {Attacco = false; attacchi.push(I / SampleRate);}} else {if (!Attacco) {Attacco = true; attacchi.push(I / SampleRate);}}
                            (((I % SogliaRiposo) == 0) && (await pausa(10)));
                        }

                        const NumeroAttacchi = attacchi.length;

                        if (NumeroAttacchi > 1) {
                            const casellaTaglioIniziale = document.getElementById(ID_Opzioni + 'TabellaOpzioniRigaTaglioInizialeCasella'); casellaTaglioIniziale.value = attacchi[0]; casellaTaglioIniziale.dispatchEvent(ev_cambiamento);
                            const casellaTaglioFinale = document.getElementById(ID_Opzioni + 'TabellaOpzioniRigaTaglioFinaleCasella'); casellaTaglioFinale.value = attacchi[1]; casellaTaglioFinale.dispatchEvent(ev_cambiamento);
                            VisualizzaEffettiAudio(Numero);
                            AggiornaRiproduzioneClip(Numero);
                            AggiornaAudioDaAscoltare(da);
                            if (NumeroAttacchi > 2) {
                                let UltimaNonConsiderarla = false;
                                for(A = 2; A < NumeroAttacchi; A += 2) {
                                    const SecondiAttacco = attacchi[A], SecondiStacco = attacchi[+A + 1] || (lunghezzaBufferConsiderata / SampleRate); // l'ultima battuta potrebbe non avere lo stacco, in questo caso si prende la fine del taglio originale della clip. Se però quest'ultimo segmento è troppo piccolo, non lo crea e salta al termine
                                    if ((SecondiStacco - SecondiAttacco) > SpezzaBattute.SecondiTaglioMinimo) {
                                        DuplicaClip(Numero, (ClipNuova) => {
                                            ClipNuova.taglioIniziale = SecondiAttacco; ClipNuova.taglioFinale = SecondiStacco; SelezionaESpostaELT(ClipNuova.numero); VisualizzazioneGraficaTaglioClip(ClipNuova.numero); VisualizzaEffettiAudio(ClipNuova.numero); AggiornaAudioDaAscoltare(ClipNuova); NuoveClipCreate.push(ClipNuova);
                                            if (NuoveClipCreate.length >= (NumeroAttacchi / 2) - 1 - UltimaNonConsiderarla) {SuddivisioneInBattuteEffettuata();}
                                        });
                                    } else {
                                        UltimaNonConsiderarla = true;
                                        if (NumeroAttacchi == 3) {TagliataSingolaBattuta();} // Se ha trovato solo due battute e l'ultima è troppo corta, conclude il processo.
                                    }
                                }
                            } else {
                                TagliataSingolaBattuta();
                            }
                        } else {
                            Messaggio(strSpezzaBattute_battutenontrovate);
                            Riattiva();
                        }

                        function TagliataSingolaBattuta() {
                            Messaggio(strSpezzaBattute_battutatagliata, "OK");
                            Riattiva();
                        }

                        function SuddivisioneInBattuteEffettuata() {
                            Riattiva();
                            document.getElementById(ID_Opzioni).dataset.nonmodificareselezionemultipla = "1";
                            setTimeout(() => {Messaggio(strSpezzaBattute_battutesuddivise, "OK");}, 1000);
                        }

                        function Riattiva() {
                            pulsante.innerHTML = strSpezzaBattute;
                            pulsante.style.border = "";
                            pulsante.abilita(true);
                            divVetro.style.display = "none";
                        }
                    }

        if (!datiAudio.buffer) {pulAscolta.abilita(false); (!pulRiduciRumore.dataset.riduzionerumoreapplicata && pulRiduciRumore.abilita(false)); pulSpezzaBattute.abilita(false); pulAscolta.innerHTML = " <span class='fa fa-spin fa-spinner'></span> " + strCaricamento; CaricaBufferAudio(RiferimentoRegistrazione, () => {if (pulAscolta) {PulAscoltaPosizioneDefault(pulAscolta); pulAscolta.abilita(true); (!pulRiduciRumore.dataset.riduzionerumoreapplicata && pulRiduciRumore.abilita(true)); pulSpezzaBattute.abilita(true);}});}
        datiAudio.nonscaricarebuffer = true;
                        
                /* Commenti */
        var textarea = CreaElemento('textarea', ID_Opzioni + 'textareaCommenti', ID_Opzioni + 'ContenitoreOpzioniBody', (SonoCreatoreProgetto? datiAudio.commentiCreatoreProgetto : datiAudio.commentiDoppiatore));
            textarea.iStyle({margin: "0 20px", width: "calc(100% - 40px)", fontSize: (100 + (50 * SistemaAttualeAndroid)) + "%"});
            textarea.setAttribute('placeholder', (SonoCreatoreProgetto? strLasciaCommentoAlDoppiatore : strLasciaCommentoAlCreatoreProgetto));

            
    /** Pulsanti salva e annulla **/
    div = CreaElemento('div', ID_Opzioni + 'PulsantiFinali', ID_Opzioni); div.className = "panel-footer"; div.style.height = "60px";
        const pulAnnulla = CreaElemento('a', ID_Opzioni + 'Annulla', div.id, "<span class='fa fa-times'></span> " + strAnnullalemodifiche); pulAnnulla.className = "btn btn-default"; pulAnnulla.iStyle({position: "absolute", left: "15%"});
                pulAnnulla.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
                pulAnnulla.addEventListener('click',
                function (e) {
                    const Numero = e.currentTarget.dataset.RiferimentoRegistrazione;
                    /** Rimette i valori iniziali **/
                    /* Buffer */
                    RiassegnaBufferOriginale();

                    /* Minutaggio */
                    document.getElementById(ID_Opzioni + 'MinutaggioMinuti').value = minutiprec; document.getElementById(ID_Opzioni + 'MinutaggioSecondi').value = secondiprec;
                    SpostaMinutaggioRegistrazione(Numero);
                    
                    /* Guadagno */
                    CambiaVolumeClip(Numero, Number(guadagnoprec));
                    
                    /* Tagli iniziali e finali */
                    CambiaTaglioInizialeClip(Numero, taglioinizialeprec);
                    CambiaTaglioFinaleClip  (Numero, tagliofinaleprec);

                    /* Effetti */
                    datiAudio.effetti = effettiprec; datiAudio.intensitaeffetti = intensitaeffettiprec; VisualizzaEffettiAudio(Numero);
                    if (datiAudio.audio) {AttivaEffettiAudio(Numero);}

                    /* Aggiorna l'audio da ascoltare */
                    AggiornaAudioDaAscoltare(datiAudio);

                    /** Elimina eventuali nuove clip create tramite le opzioni e poi chiude la finestra **/
                    const totNuoveClipCreate = NuoveClipCreate.length;
                    if (totNuoveClipCreate == 0) {
                        OpzioniClip(Numero, false, false);
                    } else {
                        divVetro.iStyle({display: "inline", opacity: 0});
                        var NuoveClipCestinate = 0;
                        NuoveClipCreate.forEach((da) => {da.Rimosso = true; CestinaClip(da.numero); SalvaModificheClipAudio(da.numero, () => {if (++NuoveClipCestinate >= totNuoveClipCreate) {OpzioniClip(Numero, false, false);}});});
                    }
                }
            );
                
        const pulSalva = CreaElemento('a', ID_Opzioni + 'Salva', div.id, "<span class='fa fa-check'></span> " + strSalva); pulSalva.className = "btn btn-success"; pulSalva.iStyle({position: "absolute", right: "15%"});
                pulSalva.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
                pulSalva.addEventListener('click', function (e) {
                    const da = DatiAudioRegistrato[RiferimentoRegistrazione], AudioTrattatoSelezionato = (ELTDaModificare.length == 1) && (AudioTrattato = document.getElementById(ID_Opzioni + "inputAudioTrattato")) && (AudioTrattato.checked) && (NuovoAudioTrattato);
                    e.currentTarget.textContent = strAttenderePrego;
                    AggiornaModificheClip();
                    /* Se è stato selezionato l'audio trattato, mette la clip corrente nel cestino in quanto verrà sostituita dalla nuova */
                    ((AudioTrattatoSelezionato) && (da.Rimosso = true));
                    /* In ogni caso, riassegna alla clip corrente (e a tutte quelle con lo stesso nome del file) il buffer originale */
                    RiassegnaBufferOriginale();

                    /* Chiude la finestra */
                    OpzioniClip(RiferimentoRegistrazione, false, true, (AudioTrattatoSelezionato? () => {AJAX("TrattamentoAudio_ClonaClip.php", CreaParametri({N: da.NumeroUnivoco, Registrazione: new File([NuovoAudioTrattato], "NuovaRegistrazione." + formatoQualitaAlta)}), () => {setTimeout(AggiornaClip, 100);}, strSalvataggioInCorsoClipTrattata, strClipTrattataSalvata, true, true); setTimeout(() => {ComparsaBarraCaricamento(); Messaggio(strSalvataggioInCorsoClipTrattata, "OK");}, 100);} : () => {}));
                });

    function AggiornaModificheClip() {
         /* Aggiorna i commenti sulla clip */
         const Numero = datiAudio.numero, AutoreCommenti = (SonoCreatoreProgetto? "CreatoreProgetto" : "Doppiatore"), DestinatarioCommenti = (SonoCreatoreProgetto? "Doppiatore" : "CreatoreProgetto");
         datiAudio['commenti' + AutoreCommenti] = textarea.value.trim(); datiAudio['commentiVisualizzati' + DestinatarioCommenti] *= (datiAudio['commenti' + AutoreCommenti] == datiAudio['commenti' + AutoreCommenti + "_prec"]);
         VisualizzaCommentiELT(Numero);
         
         /* Aggiorna la visualizzazione degli effetti audio (si aggiornano in automatico in caso di modifica, ma se rimangono uguali aggiusta la visualizzazione sul taglio iniziale) */
         VisualizzaEffettiAudio(Numero);

         /* Aggiorna la modifica della clip da ascoltare (se sono stati modificati i tagli iniziali e/o finali o il guadagno ricalcola i secondi totali da ascoltare) */
         AggiornaAudioDaAscoltare(datiAudio);
    }

    function RiassegnaBufferOriginale() {
        if (bufferoriginale) {DatiAudioRegistrato_Registrazione[DatiAudioRegistrato[RiferimentoRegistrazione].Registrazione].forEach((da) => {if (da.buffer) {da.buffer = bufferoriginale;}});}
    }
    
    setTimeout(() => {
        divContenitoreOpzioni.style.display = "inline";

        /* Riposiziona meglio la finestra se si sovrappone alla clip */
        const ELTRegistrazione = document.getElementById('ELTReg' + RiferimentoRegistrazione), ELT_PosizioneX = ELTRegistrazione.offsetLeft - window.scrollX + ContenitoreRighello.offsetLeft, ELT_PosizioneY = ELTRegistrazione.parentNode.offsetTop - window.scrollY + ContenitoreLineaTemporale.offsetTop + 15;
        if ((divContenitoreOpzioni.offsetLeft <= ELT_PosizioneX) && (ELT_PosizioneX <= (+divContenitoreOpzioni.offsetLeft) + (+divContenitoreOpzioni.offsetWidth)) && (ELT_PosizioneY <= (+divContenitoreOpzioni.offsetTop) + (+divContenitoreOpzioni.offsetHeight))) {divContenitoreOpzioni.iStyle({left: (window.innerWidth - 600) + "px", top: "0px"}); document.getElementById('LogoWEDUB').style.display = "none";}
        /*************************************************************/

        divContenitoreOpzioni.onmouseenter = DisattivaSpostamentoManualeClip;
        window.addEventListener('keydown', ScorciatoieTastieraFinestraOpzioni);
    }, 200);

    if ((VisualizzaSuggerimentiFinestraOpzioni) && (AudioAttivo) && (SistemaOperativoAttuale != "Android")) {
        const ELT = document.getElementById('ELTReg' + RiferimentoRegistrazione);
        const S = [
            {testo: Sugg_OpzioniClip_TrascinamentoClip, stile: 'info',     simboloSx: 'fa fa-arrow-up',    simboloDx: '',               VicinoA: ELT, scostamentoX: '0px', scostamentoY: ELT.offsetHeight + "px"},
            {testo: Sugg_OpzioniClip_SpostamentoMinSec, stile: 'info',     simboloSx: 'fa fa-arrow-left',  simboloDx: 'fa fa-clock-o',  VicinoA: document.getElementById(ID_Opzioni + 'tdOpzionePosizioneSecondi'), scostamentoX: "5px", scostamentoY: "0px"},
            {testo: Sugg_OpzioniClip_SpiegaPossibilita, stile: 'default',  simboloSx: 'fa fa-arrow-up',    simboloDx: 'fa fa-arrow-up', VicinoA: divContenitoreOpzioni, scostamentoX: '0px', scostamentoY: '10px'},
            {testo: Sugg_OpzioniClip_ComeCestinareClip, stile: 'danger',   simboloSx: 'fa fa-arrow-left',  simboloDx: 'fa fa-undo',     VicinoA: document.getElementById('OpzioniTitolo'), scostamentoX: '-350px', scostamentoY: '-40px'},
            {testo: Sugg_OpzioniClip_SalvareOAnnullare, stile: 'success',  simboloSx: 'fa fa-check',       simboloDx: '',               VicinoA: divContenitoreOpzioni, scostamentoX: '0px', scostamentoY: '-15px'}
        ];

        VisualizzaSuggerimentiNuoviDoppiatori(S, 'FinestraOpzioni', () => {VisualizzaSuggerimentiFinestraOpzioni = false;});
    }
}

function OpzioniClip(Numero, Apri, SalvaAllaChiusura, FunzioneAlTermine = () => {}) {
    if (Apri) {
        CreaFinestraOpzioniClip(Numero);
        VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = true;
        ScorciatoieTastiera.sospendi = scorciatoieTool;
        
    } else {
        const OpzClip = document.getElementById(ID_Opzioni);
        OpzClip.abilita(false);
        window.removeEventListener('keydown', ScorciatoieTastieraFinestraOpzioni);
        document.getElementById(ELTDaSpostare.id + 'StratoColore').ontouchstart = "";
        ELTDaSpostare = false;
        StoppaAutomaticamenteAscoltoInSolo();
        StoppaCicloClip();

        ELTDaModificare.forEach((clipELT) => {
            EvidenziaELTSelezionato(clipELT, false);
            VisualizzaELTNormale(clipELT.dataset.RiferimentoRegistrazione);
        });

        if (SalvaAllaChiusura) {
            divVetro.iStyle({display: "inline", opacity: 0});
            ELTDaModificare.forEach((clipELT) => {
                const Numero = clipELT.dataset.RiferimentoRegistrazione;
                SalvaModificheClipAudio(Numero, VerificaSalvataggiCompletati);
                AggiornaRiproduzioneClip(Numero);
            });
        } else {
            ChiudiFinestraOpzioni();
        }

        function VerificaSalvataggiCompletati() {
            VerificaSalvataggiCompletati.ClipSalvate++;
            if (VerificaSalvataggiCompletati.ClipSalvate >= ELTDaModificare.length) {
                VerificaSalvataggiCompletati.ClipSalvate = 0;
                ChiudiFinestraOpzioni();
            }
        }
        VerificaSalvataggiCompletati.ClipSalvate = 0;

        function ChiudiFinestraOpzioni() {
            AggiornaClip(); // Rimette le proprietà di eventuali altre clip modificate e poi deselezionate
            FunzioneAlTermine();

            ELTDaModificare = [];
        
            OpzClip.parentNode.removeChild(OpzClip);
            document.getElementById('LogoWEDUB').style.display = "";
            VisualizzazioneGraficaTaglioClip(Numero, VisualizzazioneGraficaTaglioClip.OndaSonoraCompleta = false);
            DatiAudioRegistrato[Numero].nonscaricarebuffer = false;
            divVetro.style.display = "none";
            ScorciatoieTastiera.sospendi = [];
            RiabilitaSchermata();
        }
    }
    
    //Righello.dataset.DisattivaClick = (Apri ? "si" : "no");
    ContenitoreStrumenti.abilita(!Apri);
    OpacitaRighello(0.5 + (0.5 * !Apri));
	
	console.log("OpzioniClip", Numero, Apri);
}

function ScorciatoieTastieraFinestraOpzioni(Tasto) {
    if (document.activeElement.tagName == "TEXTAREA") {return;}

    switch(Tasto.code) {
        case "Escape": document.getElementById("OpzioniClipAnnulla").click(); break;                         // [ESC]
        case "NumpadEnter":
        case "Enter": setTimeout(() => {document.getElementById("OpzioniClipSalva").click();}, 200); break;  // [INVIO] il timeout permette di soddisfare gli altri eventi prima di salvare
    }
}

function SpostaELT(e) {
	try {
        e.preventDefault();
        const X = +(e.clientX || e.touches[0].clientX) + window.scrollX;
        var MinutaggioNuovo = (X - ContenitoreRighello.offsetLeft - ELTDaSpostare.dataset.posizionedelmouse) * totDurataVideoGuida / (Righello.clientWidth * (DimensioneRighello / 100));
        SpostaMinutaggioRegistrazione(ELTDaSpostare.dataset.RiferimentoRegistrazione, MinutaggioNuovo);
	} catch (e) {}
}

/** Ascolto in singolo o riproduzione ciclica della clip **/
function PulAscoltaPosizioneDefault(p) {
    p.className = "btn btn-default btn-sm dropdown-toggle fa fa-play-circle";
    p.innerHTML = " " + strAscoltaClip + " <span class='caret'></span>";
    p.onclick = ApriMenuOpzioniAscolto;
}

function ResettaPulAscolta() {
    if (p = document.getElementById('OpzioniClipPulAscolta')) {
        const datiAudio = DatiAudioRegistrato[p.dataset.RiferimentoRegistrazione];
        if (datiAudio.audio) {datiAudio.audio.onended = "";} // L'eliminazione della funzione "onended" serve per evitare che si intercetti l'evento allo stop della registrazione
        PulAscoltaPosizioneDefault(p);
        StoppaClipAudio(datiAudio);
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
    if (!Fine) {Fine = datiAudio.Durata;}
    StoppaClipAudio(datiAudio);
    CreaClipAudio(Numero);
    EliminaClipDaRiprodurre(Numero);
    datiAudio.audio.start(0, Inizio, Fine - Inizio);
    datiAudio.avviato = true;
    p.className = "btn btn-warning btn-sm fa fa-stop"; p.innerText = " " + strInterrompiAscolto;
    p.onclick = ResettaPulAscolta;
    datiAudio.audio.onended = ResettaPulAscolta;
}

function EliminaClipDaRiprodurre(Numero) {
    ClipDaRiprodurre.forEach(function (I, N) {if (I == Numero) {delete ClipDaRiprodurre[N];}}); // Evita di incorrere in errore se durante la riproduzione la clip viene avviata da RiproduciClipInSync()
}

function StoppaAutomaticamenteAscoltoInSolo() {
    if (p = document.getElementById(ID_Opzioni + 'PulAscolta')) {
        const datiAudio = DatiAudioRegistrato[p.dataset.RiferimentoRegistrazione];
        if ((datiAudio.audio) && (p.className.indexOf('warning') > -1)) {ResettaPulAscolta();}
    }
}

/*** Cicla clip ***/
function CiclaClip() {
    const p = document.getElementById(ID_Opzioni + 'PulAscolta'), Numero = p.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero];
    p.className = "btn btn-info btn-sm fa fa-stop"; p.innerText = " " + strInterrompiAscolto; p.onclick = StoppaCicloClip;
    
    ClipInCiclo = datiAudio;
    datiAudio.alTermine = () => {};
    StopVideoGuida(); // Tra le altre cose imposta: RiproduzioneInCorso = false
    Posizionati((+datiAudio.MinutaggioRegistrazione) + (+datiAudio.taglioIniziale) - opzCicloClip.secondiprimainizio, false, () => {setTimeout(PlayVideoGuida, 100); datiAudio.alTermine = RiprendiCicloClip;});

    ChiudiMenuOpzioniAscolto();
}

function RiprendiCicloClip() {
    if (ClipInCiclo && RiproduzioneInCorso) {CiclaClip();} else {StoppaCicloClip();}
}

function StoppaCicloClip() {
    if (ClipInCiclo) {
        ClipInCiclo.alTermine = () => {};
        ClipInCiclo = false;
        StopVideoGuida();
        if (p = document.getElementById('OpzioniClipPulAscolta')) {PulAscoltaPosizioneDefault(p);}
    }
}
/*******************/

function AggiornaRiproduzioneClip(Numero) {
    if (RiproduzioneInCorso) {
        StoppaClipAudio(DatiAudioRegistrato[Numero]);
        EliminaClipDaRiprodurre(Numero);
        VerificaClipDaRiprodurre(Numero, VideoGuidaMinutaggioCorrente());
        FunzioneRiproduzioneClip = RiproduciClipInSync;
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
    document.getElementById(ID_Opzioni + 'aScaricaOriginale').click();
    ChiudiMenuOpzioniScaricamento();
}

function DownloadClipConversione(e) {
    const liScaricaConversione = e.currentTarget, Numero = liScaricaConversione.dataset.RiferimentoRegistrazione, datiAudio = DatiAudioRegistrato[Numero];
    liScaricaConversione.dataset.link = `RenderingAudio/Rendering/Rendering.php?N=${N}&P=${P}&ID=${datiAudio.ID_Utente}&IDClip=${datiAudio.NumeroUnivoco}&PropPers=1&Guadagno=${GuadagnoPrincipale[Numero].gain.value}&TaglioIniziale=${datiAudio.taglioIniziale}&TaglioFinale=${datiAudio.taglioFinale}&Effetti=${encodeURIComponent(datiAudio.effetti)}&IntensitaEffetti=${encodeURIComponent(datiAudio.intensitaeffetti)}`;
    ApriFinestra(e);
    ChiudiMenuOpzioniScaricamento();
}
/***********************************************************************************/

/*** Gestione Post Message ***/
window.addEventListener("message", (e) => {
  if ((e.origin !== window.location.origin) || (StoRegistrando) || (Righello.dataset.DisattivaClick == "si")) {return;}
  
    var Dati = e.data;
    if (typeof Dati.progetto == 'undefined') {return;}
    if (Dati.progetto != N) {alert(str_messaggifinestrelle_MessaggioDiAltroProgetto); return;}

    switch(Dati.tipo) {
        case 'minutaggio': 
            MinutaggioIndicato = (Dati.minuti * 60) + Number(Dati.secondi);
            if ((MinutaggioIndicato != (VideoGuidaMinutaggioCorrente() | 0)) && (MinutaggioIndicato < totDurataVideoGuida)) {Posizionati(MinutaggioIndicato);} break;
    }
}, false);

function InviaPostMessage(Finestra, Messaggio) {
    try {
        Finestra.postMessage(Messaggio, window.location.origin);
    } catch (err) {}
}
/*****************************/

function NascondiVisualizzaAltreTracce(Visualizzazione) {
    for(var I = 1; I < NumeroTotaleTracce; I++) {
        document.getElementById('Traccia' + I).style.display = Visualizzazione; document.getElementById('NomeTraccia' + I).style.display = Visualizzazione;
    }
}

/*** Gestione scorciatoie di tastiera ***/
function ScorciatoieTastiera(e) {
    let Tasto = e.code, TastoPremuto = "", SpiegazioneTasto = "";
    if (['TEXTAREA', 'INPUT', 'SPAN'].includes(document.activeElement.tagName) || ScorciatoieTastiera.sospendi.includes(Tasto)) {return;}

    InclusoIn = (a) => (a.includes(Tasto) ? Tasto : false);

    switch(Tasto) {
        case "Space": e.preventDefault(); PlayPausa();
        default: return;

        case "ArrowLeft":
        case "ArrowRight": e.preventDefault(); Posizionati(((+MinutaggioSecondi.value) + ((+MinutaggioMinuti.value) * 60)) + (0.1 * (1 - (2 * (Tasto == "ArrowLeft"))))); return;
        
        case "KeyR": if (pulPlay.disabled || pulRegistra.disabled) {return;}
                     startRecording(); TastoPremuto = "R"; SpiegazioneTasto = strSpiegazioneTastoRegistra; break;

        case "ControlLeft": e.preventDefault(); ControlPremuto = true; TastoPremuto = "Ctrl"; SpiegazioneTasto = strSpiegazioneTastoZoom; break;

        case "ShiftRight": if (pulMessaggioVocale.style.pointerEvents == "auto") {RegistraMessaggioVocale_slow(); TastoPremuto = "Shift " + strDestro; SpiegazioneTasto = strSpiegazioneTastoRegistraMessaggioIstantaneo;} else {return;} break;

        case "KeyS": Tasto = scorciatoieTool[toolStandard]; TastoPremuto = "S";
        case InclusoIn(scorciatoieTool):
            const ToolScelto = scorciatoieTool.indexOf(Tasto);
            if (!e.ctrlKey && CambiaTool(ToolScelto)) {SpiegazioneTasto = strSpiegazioneTastoTool[ToolScelto];} else {return;}
    }
    
    TastoPremuto = TastoPremuto || Tasto.slice(-1);
    Messaggio(strHaiPremuto + " <a class='btn btn-info'>" + TastoPremuto + "</a>: " + SpiegazioneTasto, "OK");
}
ScorciatoieTastiera.sospendi = [];

function ScorciatoieDiTastiera_Registrazione(Tasto) {
    switch (Tasto.code) {
        case "Escape":                                    // [ESC]
        case "Delete": AnnullaRegistrazione(); break;     // [CANC]
        case "Space": Tasto.preventDefault(); stopRecording(); break; // [SPAZIO]
    }
}

function ScorciatoieTastiera_ModalitaStreaming(Tasto) {
    switch(Tasto.code) {
        case "Space": Tasto.preventDefault(); PlayPausa(); // [SPAZIO]
        default: return;
    }
}

function ScorciatoieTastiera_TastiSollevati(Tasto) {
    switch(Tasto.code) {
        case "ControlLeft": ControlPremuto = false; CancMex(); break;   // [Ctrl]
        case "ShiftRight": if (pulMessaggioVocale.style.pointerEvents == "auto") {MandaMessaggioVocale();} break;  // [Shift destro]
    }
}

function GestisciMouseDown(e) {
    if (e.button == 1) {
        e.stopPropagation(); e.preventDefault(); GestisciMouseDown.MouseX = e.clientX; GestisciMouseDown.MouseY = e.clientY;
        Righello.style.cursor = "grabbing";
        ContenitoreLineaTemporale.onmousemove = (m) => {window.scrollBy(GestisciMouseDown.MouseX - m.clientX, GestisciMouseDown.MouseY - m.clientY); GestisciMouseDown.MouseX = m.clientX; GestisciMouseDown.MouseY = m.clientY;};
    }
}
GestisciMouseDown.MouseX = 0; GestisciMouseDown.MouseY = 0;

function GestisciMouseUp(e) {
    Righello.style.cursor = "";
    ContenitoreLineaTemporale.onmousemove = null;
}

function GestisciRotellinaMouse(Rotellina) {
    if (ControlPremuto) {
        Rotellina.preventDefault();
        const zoomprecedente = slideZoom.value;
        slideZoom.value -= velZoomRotellinaMouse * (1 - (2 * (Rotellina.deltaY < 0)));
        if (zoomprecedente != slideZoom.value) {CambiaZoom();}
    }
}

function GestisciTouchStartLineaTemporale(e) {
    if (e.touches.length == 2) {
        e.preventDefault(); e.stopPropagation();
        GestisciTouchMoveLineaTemporale.toccobasso = ((e.touches[0].clientY > e.touches[1].clientY) ? 0 : 1);
        GestisciTouchMoveLineaTemporale.PosizioneYPrec = e.touches[GestisciTouchMoveLineaTemporale.toccobasso].clientY;
    }
}

function GestisciTouchMoveLineaTemporale(e) {
    if (e.touches.length == 2) {
        e.preventDefault(); e.stopPropagation();
        const zoomprecedente = slideZoom.value;
        slideZoom.value -= GestisciTouchMoveLineaTemporale.PosizioneYPrec - e.touches[GestisciTouchMoveLineaTemporale.toccobasso].clientY;
        if (zoomprecedente != slideZoom.value) {CambiaZoom();}
    }
}
GestisciTouchMoveLineaTemporale.PosizioneYPrec = 0; GestisciTouchMoveLineaTemporale.toccobasso = 0;
/****************************************/

window.onbeforeunload = (e) => {
    if (NonChiudereFinestra) {
        e.preventDefault();
        return true;
    }
    FinestraVideoGuida.close();
    ContenitoreCopione.close();
};

function VideoGuidaPronto() {
    if (ModalitaLightAttiva) {NascondiVisualizzaAltreTracce("none");}

    SistemaAttualeAndroid = (SistemaOperativoAttuale == "Android");
    
    if (NotificaMessaggi) {NotificaMessaggi();}

    if (!BrowserOK) {document.getElementById('MsgCaricamentoIniziale').innerHTML = strBrowserNonAdatto; document.getElementById('imgAttesaIniziale').className = ""; clearInterval(tmrCaricamento); setTimeout(() => {const M = document.getElementById('MessaggiIniziali'); M.innerHTML = strBrowserNonAdatto; M.style.color = "blue";}, 5000); return;}

    console.log("controllo browser superato", VersioneJS, NomeBrowserAttuale, VersioneBrowserAttuale);
    
    CreaMenuADiscesa([
        {DoveInserirlo: 'OpzioniRegistrazione', ID_Menu: 'CanaleRegistrazione',  stiliContenitore: {float: "left"}, stiliMenu: {fontSize: "10px"}, Elementi: [{dato: 0, stringa: strCanaleSx, predefinito: (DatiMicPreferito[IdentificativoPiattaforma].canale == 0)}, {dato: 1, stringa: strCanaleDx, predefinito: (DatiMicPreferito[IdentificativoPiattaforma].canale == 1)}], FunzioneAlClick: () => {if (!ErroreMicrofono) {DatiMicPreferito[IdentificativoPiattaforma].canale = AcquisisciCanaleRegistrazione(); SalvaMicrofonoSelezionato(); AttivaIngressi();}}, SpiegazioneFunzioni: strSpiegazioneCanaleRegistrazione},
        {DoveInserirlo: 'OpzioniRegistrazione', ID_Menu: 'QualitaRegistrazione', stiliContenitore: {float: "left"}, stiliMenu: {fontSize: "10px"}, Elementi: [{dato: 1, stringa: strQualitaAlta, predefinito: !CondizioneQualitaMedia}, {dato: 0, stringa: strQualitaMedia, predefinito: CondizioneQualitaMedia}], FunzioneAlClick: AttivaIngressi, SpiegazioneFunzioni: strSpiegazioneQualitaRegistrazione}
    ]);

    if (!ModalitaStreaming) {
        var Stringa = "";
        Stringa += (ModalitaUltraLightAttiva? "<p><b>" + strModalitaUltraLightAttiva + "</b></p>" : (ModalitaLightAttiva? "<p>" + strModalitaLightAttiva + "</p>" : ""));

        if (SolaVisione && !SonoCreatoreProgetto) {
            divSelettoreMicrofono.style.display = "none";
        } else {
            audioContext.audioWorklet.addModule(percorsoAudioWorklet).then(AggiornaElencoDispositivi);
        }

        document.getElementById('MessaggiUlteriori').innerHTML = Stringa;

        /*** Funzioni per gestire il copione We Dub ***/
        FunzioneAlCaricamentoCopioneWeDub = () => {if (Righello.dataset.DisattivaClick == "no") {pulCopioneWeDub.click();} else {setTimeout(FunzioneAlCaricamentoCopioneWeDub, 1000);}};

        AltreFunzioniVisualizzaCopioneWeDub = () => {
            AttivaScorrimentoCopione();

            if (DatiDoppiatori[ID_Utente] && !OpzEvidenzia_TestoGuida.selectedIndex && !DoppiatoreConsiderato) {
                const vPersonaggi = Array.from(OpzEvidenzia_TestoGuida);
                (vPersonaggi.find(el => new RegExp(DatiDoppiatori[ID_Utente].ruolo, 'i').test(el.value)) || vPersonaggi.find(el => new RegExp(DatiDoppiatori[ID_Utente].ruolo.slice(0, (DatiDoppiatori[ID_Utente].ruolo + ",").indexOf(',')), 'i').test(el.value)) || vPersonaggi.find(el => new RegExp(DatiDoppiatori[ID_Utente].ruolo.slice(0, (DatiDoppiatori[ID_Utente].ruolo + " ").indexOf(' ')), 'i').test(el.value)) || {selected: false}).selected = true;
                OpzEvidenzia_TestoGuida.dispatchEvent(new Event('change'));
            }
        };

        AltreFunzioniNascondiCopioneWeDub = () => {
            if (ContenitoreCopione != window) {ContenitoreCopione.close(); ContenitoreTestoGuida.style.display = "";}
            ContenitoreCopione = window;
        };

        FunzioniCopione.FunzionePosizionaVideo = Posizionati;

        /* Aggiunta del tasto che permette di editare il copione */
        const pulSwitchCopioneEditabile = CreaElemento('span', 'pulSwitchCopioneEditabile', ManigliaSposta_TestoGuida.id); pulSwitchCopioneEditabile.className = "btn btn-default fa fa-edit"; pulSwitchCopioneEditabile.style.marginLeft = "10px"; pulSwitchCopioneEditabile.setAttribute('title', str_copione_ModalitaEditAttivata_title); pulSwitchCopioneEditabile.onmousedown = SwitchCopioneEditabile;
        /* Aggiunta del tasto che permette di aprire il copione in una finestra separata */
        if (!SistemaAttualeAndroid) {const pulCopioneInAltraFinestra = CreaElemento('span', 'pulCopioneInAltraFinestra', ManigliaSposta_TestoGuida.id); pulCopioneInAltraFinestra.className = "btn btn-default fa fa-sign-out"; pulCopioneInAltraFinestra.style.marginLeft = "10px"; pulCopioneInAltraFinestra.setAttribute('title', str_copione_ApriCopioneInAltraFinestra_title); pulCopioneInAltraFinestra.onmousedown = ApriCopioneInAltraFinestra;}
        /**********************************************/
    }

    document.getElementById('MsgCaricamentoIniziale').innerHTML = strAttendereFineCaricamento;

    setTimeout(() => {VideoGuidaCaricaEAvvia(PercorsoVideoGuida); ImpostaVolumeVideoGuida(0); VideoGuidaImpostaEventoPrimoCaricamento(AttivaProgramma);}, 500);
}

window.setTimeout(CaricamentoVideo, 2000); tmrCaricamento = window.setInterval(CaricamentoVideo, 10000); window.setTimeout(() => {document.getElementById('imgLogoWEDUB').src = "assets/img/" + LogoPrincipale;}, secondiCambioLogo);