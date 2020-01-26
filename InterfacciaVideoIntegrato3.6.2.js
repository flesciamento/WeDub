var VideoGuida = CreaElemento('video', 'VideoGuida', 'ContenitoreVideoGuida');


function VideoGuidaRilevazionePercentualeCaricamento() {
	var UltimoBuffer = VideoGuida.buffered.length - 1, AvanzamentoCaricamento = 0;
	if (UltimoBuffer > -1) {AvanzamentoCaricamento = VideoGuida.buffered.end(UltimoBuffer) / VideoGuida.duration;}
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
	VideoGuida.currentTime = Secondi;
}

function VideoGuidaImpostaVolume(Valore) {
	VideoGuida.volume = Valore;
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
	VideoGuida.addEventListener('play', FunzioneAlPlay);
}

function VideoGuidaRimuoviEventoAlPlay(FunzioneAlPlay) {
	VideoGuida.removeEventListener('play', FunzioneAlPlay);
}

function VideoGuidaImpostaEventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	VideoGuida.addEventListener("canplaythrough", FunzioneAlTermineCaricamento);
}
function VideoGuidaRimuoviEventoAlTermineCaricamento(FunzioneAlTermineCaricamento) {
	VideoGuida.removeEventListener("canplaythrough", FunzioneAlTermineCaricamento);
}

function VideoGuidaFunzioneAlTimeUpdate(FunzioneTimeUpdate) {
	VideoGuida.addEventListener("timeupdate", FunzioneTimeUpdate);
}

function VideoGuidaFunzioneRaggiuntaFine(FunzioneRaggiuntaFine) {
	VideoGuida.addEventListener('ended', FunzioneRaggiuntaFine);
}
/***********************/

function VideoGuidaCaricaEAvvia(Percorso) {
	VideoGuida.src = Percorso;
	VideoGuida.load();
	VideoGuidaImpostaVolume(0);
	VideoGuida.play();
	imgAttesaIniziale.style.opacity = 0;
}

function VideoGuidaImpostaEventoPrimoCaricamento(FunzioneAlTermineCaricamento) {
	VideoGuida.addEventListener("canplaythrough", FunzioneAlTermineCaricamento);
}

function RidimensionaVideo() {
	VideoGuida.style.width = LarghezzaVideo(VideoGuida.clientWidth, VideoGuida.clientHeight);
}

RidimensionaVideo();

VideoGuidaPronto();
