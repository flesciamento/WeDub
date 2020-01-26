CreaElemento('div', 'VideoGuida', 'ContenitoreVideoGuida');

var tmrCaricamentoInizialeDM;

var VideoGuida = DM.player(document.getElementById("VideoGuida"), {
	    width: "100%",
	    height: "100%",
	    params: {
	        'autoplay': true,
	        'controls': false,
	        'mute': false,
	        'endscreen-enable': false,
	        'sharing-enable': false,
	        'subtitles-default': "it"
	    }
	});

function VideoGuidaRilevazionePercentualeCaricamento() {
	var AvanzamentoCaricamento = 0;
	console.log(VideoGuida.bufferedTime, VideoGuida.duration);
	if (VideoGuida.bufferedTime && VideoGuida.duration) {AvanzamentoCaricamento = VideoGuida.bufferedTime / VideoGuida.duration;}
	return AvanzamentoCaricamento;
}

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
	return VideoGuida.currentTime;
}

function VideoGuidaDurataTotale() {
	return VideoGuida.duration;
}
/***************************/

/*** Gestione eventi ***/
function VideoGuidaImpostaEventoAlPlay(FunzioneAlPlay) {
	VideoGuida.addEventListener('playing', FunzioneAlPlay);
}

function VideoGuidaRimuoviEventoAlPlay(FunzioneAlPlay) {
	VideoGuida.removeEventListener('playing', FunzioneAlPlay);
}

function VideoGuidaImpostaEventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	VideoGuida.addEventListener("seeked", FunzioneAlTermineCaricamento);
	VideoGuida.addEventListener("play", FunzioneAlTermineCaricamento);
}
function VideoGuidaRimuoviEventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	VideoGuida.removeEventListener("seeked", FunzioneAlTermineCaricamento);
	VideoGuida.removeEventListener("play", FunzioneAlTermineCaricamento);
}

function VideoGuidaFunzioneAlTimeUpdate(FunzioneTimeUpdate) {
	VideoGuida.addEventListener("timeupdate", FunzioneTimeUpdate);
}

function VideoGuidaFunzioneRaggiuntaFine(FunzioneRaggiuntaFine) {
	VideoGuida.addEventListener('video_end', FunzioneRaggiuntaFine);
}

function AttivaPausa() {
	if (pulStopRegistrazione.disabled === false) {PlayVideoGuida();} else {StopVideoGuida();}
}
/***********************/

/*** Primo Caricamento ***/
function VideoGuidaCaricaEAvvia(Percorso) {
	imgAttesaIniziale.style.opacity = 0; VideoGuida.setVolume(0);
	VideoGuida.load(Percorso, {autoplay: true, mute: false});
	VideoGuida.addEventListener('pause', PlayVideoGuida);
}
/*************************/

/*** Costruzione dell'evento che verifica se ha caricato il video a sufficienza per poterlo eseguire senza interruzioni ***/
function VideoGuidaImpostaEventoPrimoCaricamento(FunzioneAlTermineCaricamento) {
	tmrCaricamentoInizialeDM = window.setInterval(function () {VerificaCaricatoAbbastanza(FunzioneAlTermineCaricamento);}, 300);
}

function VerificaCaricatoAbbastanza(FunzioneAlTermineCaricamento) {
	if (VideoGuidaRilevazionePercentualeCaricamento() > 0.02) {
		clearInterval(tmrCaricamentoInizialeDM);
		VideoGuida.removeEventListener('pause', PlayVideoGuida);
		VideoGuida.removeEventListener('ad_play', VisualizzaPubblicita);
		VideoGuida.removeEventListener('ad_end', RipristinaDopoPubblicita);
		Monitors.style.opacity = "";
		
		Inizializza();
		FunzioneAlTermineCaricamento();
	}
}

function Inizializza() {
	VideoGuida.addEventListener('ad_play', DisabilitaSchermata); VideoGuida.addEventListener('ad_end', RiabilitaSchermata);
	VideoGuida.addEventListener('pause', AttivaPausa);
	VideoGuida.addEventListener('end', function () {Inizializza(); InizializzaVideo();}); // Quando arriva alla fine del video, Dailymotion scorda tutte le impostazioni relative agli eventi.
}
/**************************************************************************************************************************/


/*** Eventi aggiuntivi Player Dailymotion ***/
VideoGuida.addEventListener('ad_play', VisualizzaPubblicita); 

VideoGuida.addEventListener('ad_end', RipristinaDopoPubblicita);

function VisualizzaPubblicita() {
	Info.innerHTML = "Devi saltare la pubblicità di DailyMotion (o attendere che sia finita) per procedere con il caricamento"; Info.style.color = "blue";
	Monitors.style.opacity = 1;
}

function RipristinaDopoPubblicita() {
	Info.innerHTML = ""; Monitors.style.opacity = 0; window.setTimeout(function () {VideoGuida.setVolume(0);}, 500);
}
/********************************************/

Monitors.style.opacity = 0.1;

VideoGuida.addEventListener("apiready", VideoGuidaPronto);
