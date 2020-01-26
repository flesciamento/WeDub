CreaElemento('div', 'VideoGuida', 'ContenitoreVideoGuida');

var VideoGuida, FunzioneInCasoPlay, FunzioneInCasoPausa, FunzioneInCasoTerminaCaricamento, FunzioneAlTimeUpdate, FunzioneRaggiuntaFineVideo, HaFattoBuffering = false, tmrCaricamentoInizialeYT, tmrEventoTimeUpdateYT;


function VideoGuidaRilevazionePercentualeCaricamento() {
	var AvanzamentoCaricamento = 0;
	console.log(VideoGuida.getVideoLoadedFraction());
	if (VideoGuida.getVideoLoadedFraction()) {AvanzamentoCaricamento = VideoGuida.getVideoLoadedFraction();}
	return AvanzamentoCaricamento;
}

/*** Controlli Player ***/
function VideoGuidaPlay() {
	VideoGuida.playVideo();
}

function VideoGuidaPause() {
	VideoGuida.pauseVideo();
}

function VideoGuidaPosizionati(Secondi) {
	VideoGuida.seekTo(Secondi, true);
}

function VideoGuidaImpostaVolume(Valore) {
	VideoGuida.setVolume(Valore * 100);
}
/************************/

/*** Informazioni Player ***/
function VideoGuidaMinutaggioCorrente() {
	return VideoGuida.getCurrentTime();
}

function VideoGuidaDurataTotale() {
	return VideoGuida.getDuration();
}
/***************************/

/*** Primo Caricamento ***/
function VideoGuidaCaricaEAvvia(Percorso) {
	VideoGuida.loadVideoById(Percorso);
	VideoGuida.setVolume(0);
	imgAttesaIniziale.style.opacity = 0;
	
	FunzioneInCasoPlay = PlayVideoGuida;
	
	VideoGuida.addEventListener('onStateChange', Monitora);
}
/*************************/

/*** Costruzione dell'evento che si attiva al Play ***/
function VideoGuidaImpostaEventoAlPlay(FunzioneAlPlay) {
	FunzioneInCasoPlay = FunzioneAlPlay;
}

function VideoGuidaRimuoviEventoAlPlay(FunzioneAlPlay) {
	FunzioneInCasoPlay = "";
}
/*****************************************************/

/*** Costruzione dell'evento che verifica se ha caricato il video a sufficienza per poterlo eseguire senza interruzioni ***/
function VideoGuidaImpostaEventoPrimoCaricamento(FunzioneAlTermineCaricamento) {
	tmrCaricamentoInizialeYT = window.setInterval(function () {VerificaCaricatoAbbastanza(FunzioneAlTermineCaricamento);}, 500);
}

function VerificaCaricatoAbbastanza(FunzioneAlTermineCaricamento) {
	if (VideoGuida.getDuration()) {
		clearInterval(tmrCaricamentoInizialeYT);
		FunzioneInCasoPausa = AttivaPausa;
		FunzioneAlTermineCaricamento();
	}
	console.log(VideoGuida.getDuration());
}
/**************************************************************************************************************************/

/*** Costruzione dell'evento TimeUpdate ***/
function VideoGuidaFunzioneAlTimeUpdate(FunzioneTimeUpdate) {
	FunzioneAlTimeUpdate = FunzioneTimeUpdate;
}

function AggiornaEventoTimeUpdate() {
	SospendiEventoTimeUpdate();
	tmrEventoTimeUpdateYT = window.setInterval(FunzioneAlTimeUpdate, 250);
}

function SospendiEventoTimeUpdate() {
	clearInterval(tmrEventoTimeUpdateYT);
}
/******************************************/

/*** Costruzione dell'evento che si attiva al termine del caricamento di un segmento di video ***/
function VideoGuidaImpostaEventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	window.setTimeout(function () {EventoAlTermineCaricamento(FunzioneAlTermineCaricamento);}, 300);
}

function EventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	if (HaFattoBuffering) {FunzioneInCasoTerminaCaricamento = FunzioneAlTermineCaricamento;} else {FunzioneAlTermineCaricamento();} // Se ha fatto il buffering, al termine del caricamento verrà intercettato l'evento "onStateChange" in quanto lo stato del Player tornerà Play o Pause, altrimenti vuol dire che il segmento di filmato è già caricato.
}

function VideoGuidaRimuoviEventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	FunzioneInCasoTerminaCaricamento = "";
}
/************************************************************************************************/

function VideoGuidaFunzioneRaggiuntaFine(FunzioneRaggiuntaFine) {
	FunzioneRaggiuntaFineVideo = FunzioneRaggiuntaFine;
}


function AttivaPausa() {
	if (pulStopRegistrazione.disabled === false) {PlayVideoGuida();} else {StopVideoGuida();}
}

function Monitora(e) {
	switch(e.data) {
		case YT.PlayerState.PLAYING:   FunzioneInCasoPlay();  HaFattoBuffering = false; if (FunzioneInCasoTerminaCaricamento) {FunzioneInCasoTerminaCaricamento();} if (FunzioneAlTimeUpdate) {AggiornaEventoTimeUpdate();} break;
		
		case YT.PlayerState.ENDED:     FunzioneRaggiuntaFineVideo(); /* falls through */
		case YT.PlayerState.PAUSED:    FunzioneInCasoPausa(); HaFattoBuffering = false; if (FunzioneInCasoTerminaCaricamento) {FunzioneInCasoTerminaCaricamento();} SospendiEventoTimeUpdate(); break;     
		
		case YT.PlayerState.BUFFERING: HaFattoBuffering = true;
	}
}

/*** Inizializzazione ***/
window.onYouTubeIframeAPIReady = function () {
	VideoGuida = new YT.Player('VideoGuida', {
	  width: '100%',
	  height: '100%',
	  playerVars: { 'autoplay': 0, 'controls': 0, 'cc_load_policy': 1, 'disablekb': 1, 'fs': 0, 'hl': 1, 'iv_load_policy': 3, 'rel': 0}
	});
	
	VideoGuida.addEventListener('onReady', VideoGuidaPronto);
};
/************************/
