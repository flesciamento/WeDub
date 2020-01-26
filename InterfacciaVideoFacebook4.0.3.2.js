var FBVideo = CreaElemento('div', 'VideoGuida', 'ContenitoreVideoGuida'); FBVideo.className = "fb-video";
FBVideo.dataset.width = "1024px"; FBVideo.dataset.autoplay = 'false'; FBVideo.dataset.href = 'https://www.facebook.com/facebook/videos/' + PercorsoVideoGuida + '/';

var VideoGuida, FBEvento_Play, FBEvento_Pausa, FBEvento_Ended, FBEvento_Buffering, FBEvento_TermineBuffering, FBEvento_Errore, FBVideoBuffering = false, FunzioneAlPlay, FunzioneAlTimeUpdate, FunzioneAlTermineCaricamento, tmrCaricamentoInizialeFB, tmrEventoTimeUpdateFB;

/*** Controlli Player ***/
function VideoGuidaPlay() {
	VideoGuida.play();
}

function VideoGuidaPause() {
	VideoGuida.pause();
}

function VideoGuidaPosizionati(Secondi) {
	VideoGuida.seek(Secondi);
}

function VideoGuidaImpostaVolume(Valore) {
	VideoGuida.setVolume(Valore);
}
/************************/

/*** Informazioni Player ***/
function VideoGuidaMinutaggioCorrente() {
	return VideoGuida.getCurrentPosition();
}

function VideoGuidaDurataTotale() {
	return VideoGuida.getDuration();
}
/***************************/

/*** Gestione eventi ***/
function VideoGuidaImpostaEventoAlPlay(FunzionePlay) {
	FunzioneAlPlay = FunzionePlay;
}

function VideoGuidaRimuoviEventoAlPlay(FunzioneAlPlay) {
	FunzioneAlPlay = "";
}

/*** Costruzione dell'evento che si attiva al termine del caricamento di un segmento di video ***/
function VideoGuidaImpostaEventoAlTermineCaricamento(FunzioneTermineCaricamento) {
	window.setTimeout(function () {EventoAlTermineCaricamento(FunzioneTermineCaricamento);}, 300);
}

function EventoAlTermineCaricamento(FunzioneTermineCaricamento) {
	if (FBVideoBuffering) {FunzioneAlTermineCaricamento = FunzioneTermineCaricamento;} else {FunzioneTermineCaricamento();}
}

function VideoGuidaRimuoviEventoAlTermineCaricamento(FunzioneTermineCaricamento) {
	FunzioneAlTermineCaricamento = "";
}
/************************************************************************************************/

/*** Monitoraggio del Buffering ***/
function IniziatoBuffering() {
	FBVideoBuffering = true;
}

function TerminatoBuffering() {
	FBVideoBuffering = false;
	if (FunzioneAlTermineCaricamento) {FunzioneAlTermineCaricamento();}
}
/**********************************/

/*** Costruzione dell'evento TimeUpdate ***/
function VideoGuidaFunzioneAlTimeUpdate(FunzioneTimeUpdate) {
	FunzioneAlTimeUpdate = FunzioneTimeUpdate;
}

function AggiornaEventoTimeUpdate() {
	SospendiEventoTimeUpdate();
	tmrEventoTimeUpdateFB = window.setInterval(FunzioneAlTimeUpdate, 250);
}

function SospendiEventoTimeUpdate() {
	clearInterval(tmrEventoTimeUpdateFB);
}
/******************************************/

function VideoGuidaFunzioneRaggiuntaFine(FunzioneRaggiuntaFine) {
	FBEvento_Ended = VideoGuida.subscribe('finishedPlaying', FunzioneRaggiuntaFine);
}

function FunzioniEventoPlay() {
	console.log("FunzioniEventoPlay");
    if (FunzioneAlPlay) {FunzioneAlPlay();}
    
    if (FunzioneAlTimeUpdate) {AggiornaEventoTimeUpdate();}
}

function AttivaPausa() {
	if (pulStopRegistrazione.disabled === false) {PlayVideoGuida();} else {StopVideoGuida(); SospendiEventoTimeUpdate();}
}
/***********************/

/*** Primo Caricamento ***/
function VideoGuidaCaricaEAvvia(Percorso) {
	imgAttesaIniziale.style.opacity = 0;
	window.setTimeout(RidimensionaVideo, 1000);
}
/*************************/

/*** Costruzione dell'evento che verifica se ha caricato il video a sufficienza per poterlo eseguire senza interruzioni ***/
function VideoGuidaImpostaEventoPrimoCaricamento(FunzioneTermineCaricamento) {
	tmrCaricamentoInizialeFB = window.setInterval(function () {VerificaCaricatoAbbastanza(FunzioneTermineCaricamento);}, 500);
}

function VerificaCaricatoAbbastanza(FunzioneTermineCaricamento) {
	if (VideoGuida.getDuration()) {
		clearInterval(tmrCaricamentoInizialeFB);
		FBEvento_Pausa = VideoGuida.subscribe('paused', AttivaPausa);
		FBEvento_Play  = VideoGuida.subscribe('startedPlaying', FunzioniEventoPlay);
		FBEvento_Buffering = VideoGuida.subscribe('startedBuffering', IniziatoBuffering);
		FBEvento_TermineBuffering = VideoGuida.subscribe('finishedBuffering', TerminatoBuffering);
		VideoGuida.unmute();
		FunzioneTermineCaricamento();
	}
	console.log(VideoGuida.getDuration());
}
/**************************************************************************************************************************/

function RidimensionaVideo() {
	Monitors.style.opacity = 0;
	var V = document.querySelector("#VideoGuida span");
	window.setTimeout(function () {FBVideo.style.width = LarghezzaVideo(V.clientWidth, V.clientHeight); Monitors.style.opacity = 1;}, 1000);
}


 function AvviaCaricamentoVideoFB() {
	console.log("Richiesta in corso...");
	FB.Event.subscribe('xfbml.ready', function(msg) {
		if (msg.type === 'video') {
			VideoGuida = msg.instance;
			Monitors.style.opacity = 0;
			window.setTimeout(VideoGuidaPronto, 500);
		}
		console.log("XFBML", msg);
	});
 }
