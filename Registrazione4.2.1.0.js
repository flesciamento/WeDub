/*var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var sourceBuffer;*/
var mediaRecorder;
var recordedBlobs;
var sampleAudioData;
var options;
var AudioVideoRegistrato = [];
var MinutaggioUltimaRegistrazione = 0;

var ContenitoreVideoGuida = document.getElementById('ContenitoreVideoGuida');
var Monitors = document.getElementById('Monitors');
var gumVideo = document.querySelector('video#gum');
var pulRegistra = document.getElementById('Registra');
var imgRegistra = document.getElementById('imgRegistra');
var TestoPulRegistra = document.getElementById('TestoPulRegistra');
var pulStopRegistrazione = document.getElementById('StopRegistrazione');
var pulAnnullaRegistrazione = document.getElementById('AnnullaRegistrazione');
var pulPlay = document.getElementById('Play');
var imgPlayPausa = document.getElementById('imgPlay');

var MinutaggioMinuti = document.getElementById('MinutaggioMinuti');
var MinutaggioSecondi = document.getElementById('MinutaggioSecondi');

var divLineaTemporale = document.getElementById('LineaTemporale');
var imgAttesaIniziale = document.getElementById('imgAttesaIniziale');
var imgAttesa = document.getElementById('imgAttesa');
var Righello = document.getElementById('Righello');

var instantMeter = document.querySelector('#instant meter');
var slowMeter = document.querySelector('#slow meter');
var clipMeter = document.querySelector('#clip meter');
var instantValueDisplay = document.querySelector('#instant .value');
var slowValueDisplay = document.querySelector('#slow .value');
var clipValueDisplay = document.querySelector('#clip .value');

var tmrCaricamento, tmrImmagineAttesa, tmrRidimensionamento, tmrContoAllaRovescia, tmrAnimazioneRegistrazione, tmrAggiornamento, tmrAggiornaAltriUtenti;

var DimensioneRighello = 100;
var GuadagnoAVR = [], FiltroAVR = [];

var StoRegistrando = false;

var CreatoreAttualeProgetto = "";
var Provino = (TipoProgetto == 'Provino');
var ev_cambiamento = new Event('change');

pulRegistra.addEventListener('mousedown', toggleRecording);
pulStopRegistrazione.addEventListener('mousedown', stopRecording);
pulAnnullaRegistrazione.addEventListener('mousedown', AnnullaRegistrazione);
pulPlay.addEventListener('mousedown', play);


/*** Verifiche compatibilità browser ***/
try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API non supportata!');
}
/***************************************/

var ingressi = {
  audio: true,
  video: false
};

function MinutiESecondi(Secondi) {
	this.Minuti = Math.floor(Secondi / 60);
	this.Secondi = ((Secondi / 60) - this.Minuti) * 60;
}

var MinutaggiRighello = {
	StepRighello : 0, NumeroMinutaggi : 0,
	
	Disegna : function () {
		var R, Minutaggio;
		this.StepRighello = parseInt(50 * VideoGuidaDurataTotale() / Righello.clientWidth) + 1; console.log("StepRighello", this.StepRighello, Righello.clientWidth, VideoGuidaDurataTotale());
		Minutaggio = new MinutiESecondi(VideoGuidaDurataTotale());
		MinutaggioMinuti.max = Minutaggio.Minuti; MinutaggioSecondi.max = 59.999;
	
		for(var I = 0; I < VideoGuidaDurataTotale() - this.StepRighello; I += this.StepRighello) {
			Minutaggio = new MinutiESecondi(I); this.NumeroMinutaggi++;
			R = CreaElemento('span', 'R' + this.NumeroMinutaggi, 'MinutaggiRighello', "<img src='images/Cursore.png' class='SegnoRighello'>&nbsp;" + Minutaggio.Minuti + ":" + ("0" + parseInt(Minutaggio.Secondi)).slice(-2));
			R.style.position = "absolute"; R.style.left = (I / VideoGuidaDurataTotale() * DimensioneRighello) + "%"; R.style.top = "0px"; R.style.width = "100px";
			R.style.fontFamily = "Verdana"; R.style.fontSize = "10px"; R.style.verticalAlign = "top";
		}
	},
	
	Ridisegna : function () {
		for(var I = 1; I <= this.NumeroMinutaggi; I++) {document.getElementById('MinutaggiRighello').removeChild(document.getElementById('R' + I));}
		this.NumeroMinutaggi = 0;
		this.Disegna();
	},
};

/*** Zoom e affini ***/
function CambiaZoom() {
	clearTimeout(tmrRidimensionamento);
	DimensioneRighello = document.getElementById('Zoom').value;
	
	OndeSonore.forEach(CancellaOndeSonore);
	CambiaDimensioneContenitoreTracce();
	PosizionaCursore(Number(MinutaggioSecondi.value) + Number(MinutaggioMinuti.value) * 60);
	tmrRidimensionamento = window.setTimeout(function () {SeguiCursore(); OndeSonore.forEach(RidisegnaOndeSonore);}, 1300);
}

function CambiaDimensioneContenitoreTracce() {
	CambiaDimensione(Array('ContenitoreRighello'), 10);
	CambiaDimensione(Array('ContenutoTracce', 'MinutaggiRighello'), 0);
}

function CambiaDimensione(Elementi, Differenza) {
	Elementi.forEach(function (ID) {document.getElementById(ID).style.width = (DimensioneRighello - Differenza) + "%";});
}

document.getElementById('Zoom').addEventListener('change', CambiaZoom);
/*********************/

/*** Mantiene fissi gli elementi principali ***/
window.addEventListener('scroll', function() {document.getElementById('NomiTracce').style.left = window.scrollX + "px"; document.getElementById('MinutaggiRighello').style.top = (15 + window.scrollY) + "px";});
/**********************************************/

function OpacitaRighello(LivelloOpacita) {
	Righello.style.opacity = LivelloOpacita;
}

function CaricamentoVideo() {
	var Colore = new Array("blue", "brown", "green", "orange", "red");
	
	var MessaggiIniziali = document.getElementById('MessaggiIniziali');
	
	if (typeof CaricamentoVideo.MessaggioCorrente == 'undefined') {CaricamentoVideo.MessaggioCorrente = 0;}
	
	MessaggiIniziali.style.color = Colore[CaricamentoVideo.MessaggioCorrente]; MessaggiIniziali.innerHTML = "<i>Consiglio</i>: " + strAttesa[CaricamentoVideo.MessaggioCorrente];
	if (CaricamentoVideo.MessaggioCorrente == strAttesa.length - 1) {Monitors.style.opacity = 0.8;} //Visualizza il video nel caso ci siano problemi
	
	CaricamentoVideo.MessaggioCorrente = ++CaricamentoVideo.MessaggioCorrente * (CaricamentoVideo.MessaggioCorrente < strAttesa.length);
}

function AttivaProgramma() {
	clearInterval(tmrCaricamento); VideoGuidaRimuoviEventoAlTermineCaricamento(AttivaProgramma);
	
	/*** Visualizzazione ***/
	document.getElementById('divCaricamento').style.display = "none";
	document.getElementById('Versione').style.display = "none";
	Monitors.style.opacity = 1;
	document.getElementById('ComandiPlayer').style.display = "block";
	document.getElementById('Contenitore').style.display = "block"; DisabilitaSchermata();
	/***********************/
	
	/*** Disegno del righello ***/
	MinutaggiRighello.Disegna();
	
	Righello.dataset.DisattivaClick = "no";
	/****************************/
	
	CaricaAVR();
	
	VideoGuidaPause(); VideoGuidaPosizionati(0); VideoGuidaImpostaVolume(1); VolumeVideoGuida.value = 1;
	
	setTimeout(function () {OndeSonore.forEach(CancellaOndeSonore); document.getElementById('Zoom').value = 110; CambiaZoom();}, 1000); // Evita un noioso bug di Chrome che rende la linea temporale leggermente "ballerina"

	InizializzaVideo(); initWorker();
}

function InizializzaVideo() {
	ContenitoreVideoGuida.dataset.Riproduzione = "no";
	VideoGuidaFunzioneAlTimeUpdate(AggiornaTimeline); VideoGuidaFunzioneRaggiuntaFine(StoppaEventualeRegistrazione);
	VideoGuidaImpostaEventoAlPlay(PlayVideoGuida);
}

function handleSuccess(stream) {
  pulRegistra.disabled = SolaVisione;
  console.log('Ingressi attivati', stream);
  window.stream = stream;
  mediaRecorder = new MediaStreamRecorder(stream);
  // mediaRecorder.stream = stream;
  mediaRecorder.mimeType = 'audio/wav';
  mediaRecorder.audioChannels = 1;
  mediaRecorder.bufferSize = 0;
  
  console.log('Creato MediaRecorder', mediaRecorder, 'di tipo', mediaRecorder.mimeType);
  
  var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
	soundMeter.connectToSource(stream, function(e) {
	    if (e) {alert(e); return;}
	    
	    setInterval(function() {
			instantMeter.value = instantValueDisplay.innerText = soundMeter.instant.toFixed(2);
			slowMeter.value = slowValueDisplay.innerText = soundMeter.slow.toFixed(2);
			clipMeter.value = clipValueDisplay.innerText = soundMeter.clip.toFixed(5);
	    }, 200);
	});
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function AttivaIngressi() {
	navigator.mediaDevices.getUserMedia(ingressi).then(handleSuccess).catch(handleError);
	console.log("Attivazione ingressi...");
}

function AggiornaDispositivi() {
	var Microfono = SelezioneMicrofono.value ? {exact: SelezioneMicrofono.value} : undefined;
	var WebCam = SelezioneWebcam.selectedIndex ? {deviceId: {exact: SelezioneWebcam.value}, width: {exact: 320}, height: {exact: 240} } : false;
	
	ingressi = {
		audio: {deviceId: Microfono},
		video: WebCam
	};
	
	AggiornaElencoDispositivi();
	
	AttivaIngressi();
}

function AggiornaElencoDispositivi() {
	navigator.mediaDevices.enumerateDevices().then(AcquisisciDispositivi).catch(handleError);
}

/*function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer(options.mimeType);
  console.log('Source buffer: ', sourceBuffer);
}*/

function AggiornaTimeline() {	
	PosizionaCursore(VideoGuidaMinutaggioCorrente());
	AggiornaMinutaggioVideo(VideoGuidaMinutaggioCorrente());
	
	if (StoRegistrando === false && ContenitoreVideoGuida.dataset.Riproduzione == "si") {
		var PartenzaAudio = 0;
		for(var I = 0; I < AudioVideoRegistrato.length; I++) {
			
			if ((AudioVideoRegistrato[I].dataset.Rimosso == "no") && (AudioVideoRegistrato[I].dataset.StoRiproducendoRegistrazione == "no")) {

				PartenzaAudio = Number(AudioVideoRegistrato[I].dataset.MinutaggioRegistrazione);
				if ((PartenzaAudio <= VideoGuidaMinutaggioCorrente()) && (VideoGuidaMinutaggioCorrente() <= PartenzaAudio + Number(AudioVideoRegistrato[I].dataset.Durata))) {
					playRegistrazione(I, Number(VideoGuidaMinutaggioCorrente() - PartenzaAudio));
				}
				
			}
			
		}
	}
}

function MinutaggioCambiato() {
	var MinutaggioNuovo = Number(MinutaggioSecondi.value) + Number(MinutaggioMinuti.value) * 60;
	Posizionati(MinutaggioNuovo);
}

Righello.addEventListener('mousedown', PosizionatiAlMinutoCliccato);
document.getElementById('MinutaggiRighello').addEventListener('mousedown', PosizionatiAlMinutoCliccato);

function PosizionatiAlMinutoCliccato(e) {
	if (Righello.dataset.DisattivaClick == "no") {
		if (!e) {e = window.event;}
		if (e.clientY > window.innerHeight - 50) {return;}
		var MN = 0;
		var X = e.clientX + window.scrollX;
		var MinutaggioNuovo = (MN = (X - Righello.offsetLeft) * VideoGuidaDurataTotale() / (Righello.clientWidth * (DimensioneRighello / 100))) * (MN > 0);
		Posizionati(MinutaggioNuovo);
	}
}

Righello.addEventListener('mousemove', SpostaELT);

function SpostaELT(e) {
	try {
		if (ELTDaSpostare.dataset.cliccato == "si") {
			if (!e) {e = window.event;}
			var X = e.clientX + window.scrollX;
			var MN = 0;
			var MinutaggioNuovo = (MN = (X - (Righello.offsetLeft + (ELTDaSpostare.offsetWidth / 2))) * VideoGuidaDurataTotale() / (Righello.clientWidth * (DimensioneRighello / 100))) * (MN > 0);
			console.log(MN, MinutaggioNuovo);
			SpostaMinutaggioRegistrazione(ELTDaSpostare.dataset.RiferimentoRegistrazione, MinutaggioNuovo);
		}
	} catch(e) {}
}

function PosizionaCursore(Minutaggio) {
	Cursore.style.left = (Minutaggio / VideoGuidaDurataTotale() * DimensioneRighello) + "%";
	window.setTimeout(SeguiCursore, 500);
}

function SeguiCursore() {
	window.scrollTo((Cursore.offsetLeft - 200) * (DimensioneRighello > 100), window.scrollY);
}

function AggiornaMinutaggioVideo(Minutaggio) {
	var M = new MinutiESecondi(Minutaggio);
	MinutaggioMinuti.value = M.Minuti;	MinutaggioSecondi.value = M.Secondi.toFixed(3);
}

function Posizionati(MinutaggioNuovo) {
	PosizionaCursore(MinutaggioNuovo);
	AggiornaMinutaggioVideo(MinutaggioNuovo);
	VideoGuidaPosizionati(MinutaggioNuovo);	
	AudioVideoRegistrato.forEach(StoppaRegistrazioni);
	DisabilitaSchermata(true);
	VideoGuidaImpostaEventoAlTermineCaricamento(RiattivaVideoGuida);
}

function RiattivaVideoGuida() {
	RiabilitaSchermata(true);
	VideoGuidaRimuoviEventoAlTermineCaricamento(RiattivaVideoGuida);
}

function DisabilitaSchermata(ImmagineAttesa) {
	Righello.dataset.DisattivaClick = "si"; OpacitaRighello(0.5); clearInterval(tmrAggiornaAltriUtenti);
	pulPlay.disabled = true;  pulRegistra.disabled = true; MinutaggioMinuti.readOnly = true; MinutaggioSecondi.readOnly = true;
	SelezioneMicrofono.disabled = true; SelezioneWebcam.disabled = true; document.getElementById('pulEsci').disabled = true;
	if (ImmagineAttesa) {tmrImmagineAttesa = window.setTimeout(function () {imgAttesa.style.display = "block";}, 300);}
}

function RiabilitaSchermata(Aggiorna) {
	Righello.dataset.DisattivaClick = "no"; OpacitaRighello(1); AttivaAggiornamentoAltriUtenti();
	pulPlay.disabled = false; pulRegistra.disabled = SolaVisione; MinutaggioMinuti.readOnly = false; MinutaggioSecondi.readOnly = false;
	SelezioneMicrofono.disabled = SolaVisione; SelezioneWebcam.disabled = SolaVisione; document.getElementById('pulEsci').disabled = false;
	imgAttesa.style.display = "none"; clearTimeout(tmrImmagineAttesa);
	if (Aggiorna) {AggiornaAltriUtenti();}
}


function CambiaVolumeVideoGuida() {
	VideoGuidaImpostaVolume(Number(VolumeVideoGuida.value));
}

function handleDataAvailable(blob) {
	if (blob && blob.size > 0) {
		recordedBlobs.push(blob);
		console.log("richiamato data available", blob);
	}
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}

function toggleRecording() {
	if (StoRegistrando === false) {
	    startRecording();
	} else {
	    stopRecording();
	}
}

function startRecording() {
	recordedBlobs = [];
	
	StopVideoGuida(); DisabilitaSchermata(); pulPlay.style.opacity = 0;
	VideoGuidaRimuoviEventoAlPlay(PlayVideoGuida);
	VideoGuidaImpostaEventoAlPlay(StopVideoGuida);
	StoRegistrando = true;
	mediaRecorder.onstop = handleStop;
	mediaRecorder.ondataavailable = handleDataAvailable;
	
	imgRegistra.style.display = "none"; TestoPulRegistra.style.display = "inline"; TestoPulRegistra.innerHTML = "<span class='fa fa-circle'></span>";
	tmrContoAllaRovescia = window.setInterval(ContoAllaRovescia, 1000);
}

function ContoAllaRovescia() {
	var Partenza = 4;
	
	if (typeof ContoAllaRovescia.Conteggio == 'undefined') {ContoAllaRovescia.Conteggio = Partenza;}
	ContoAllaRovescia.Conteggio--;
	TestoPulRegistra.innerHTML = ContoAllaRovescia.Conteggio;
	if (ContoAllaRovescia.Conteggio === 0) {
		clearInterval(tmrContoAllaRovescia);
		ContoAllaRovescia.Conteggio = Partenza;
		TestoPulRegistra.innerHTML = ""; TestoPulRegistra.style.display = "none"; imgRegistra.style.display = "block";
		
		MinutaggioUltimaRegistrazione = VideoGuidaMinutaggioCorrente();
		VideoGuidaRimuoviEventoAlPlay(StopVideoGuida);
		VideoGuidaImpostaEventoAlPlay(RegistrazioneParti);
		PlayVideoGuida();
	}
}

function RegistrazioneParti() {
	mediaRecorder.start(180000);
	VideoGuidaRimuoviEventoAlPlay(RegistrazioneParti);
	pulStopRegistrazione.disabled = false; pulAnnullaRegistrazione.disabled = false;
	AttivaAnimazioneRegistrazione();
	console.log('MediaRecorder partito', mediaRecorder);
}

function AnnullaRegistrazione() {
	FermaRegistrazione(); RiabilitaSchermata(true); StoRegistrando = false;
	window.setTimeout(function () {Posizionati(MinutaggioUltimaRegistrazione);}, 500);
	Messaggio("Registrazione annullata.");
}

function FermaRegistrazione() {
	mediaRecorder.stop(); // mediaRecorder.stream.stop();
	console.log('Recorded Blobs: ', recordedBlobs);
	
	VideoGuidaImpostaEventoAlPlay(PlayVideoGuida);
	StopVideoGuida(); pulPlay.style.opacity = ""; pulStopRegistrazione.disabled = true; pulAnnullaRegistrazione.disabled = true;
	
	TerminaAnimazioneRegistrazione();
}

/*** Salvataggio registrazione ***/
function stopRecording() {
	FermaRegistrazione();	
    imgAttesa.style.display = "block";
    StoRegistrando = false;
	
	MandaACreaRegistrazione();
}

function MandaACreaRegistrazione() {
	window.setTimeout(CreaRegistrazione, 200); // La latenza è importante per permettere al pc di elaborare quanto registrato
}

function CreaRegistrazione() {
	mediaRecorder.GeneraAudio(
		function (superBuffer) {
			var reader = new FileReader();
			
			reader.addEventListener("loadend", function() {
                sampleAudioData = new Uint8Array(this.result);
                runCommand("-i clip1 output.flac");
			});
			
			reader.addEventListener("error", MandaACreaRegistrazione);
			
			reader.readAsArrayBuffer(superBuffer);
		}
    );
}

function SalvaNuovaRegistrazione(Contenuto) {
	var MinutaggioAttualeRegistrazione = MinutaggioUltimaRegistrazione, Durata = VideoGuidaMinutaggioCorrente() - MinutaggioAttualeRegistrazione, Video = (ingressi.video ? "si" : "no");
	
	AJAX("SalvaNuovaRegistrazione.php", CreaParametri({"NumProgetto": N, "NumProvino": P, "Utente": ID_Utente, "Registrazione": Contenuto, "MinutaggioRegistrazione": MinutaggioAttualeRegistrazione, "DurataRegistrazione": Durata, "Video": Video}),
		function (Dati) {
			var NuovoAudioVideo = AudioVideoRegistrato[CreaNuovoAVR()];
			NuovoAudioVideo.dataset.NumeroUnivoco = Dati.Numero;
			NuovoAudioVideo.dataset.ID_Utente = ID_Utente;
			NuovoAudioVideo.src = Dati.NomeFile; NuovoAudioVideo.load();
			NuovoAudioVideo.dataset.MinutaggioRegistrazione = MinutaggioAttualeRegistrazione;
			NuovoAudioVideo.dataset.Durata = Durata;
			var d = new Date();	NuovoAudioVideo.dataset.Data = "di oggi alle " + d.getHours() + ":" + d.getMinutes().duecifre();
			NuovoAudioVideo.dataset.StoRiproducendoRegistrazione = "no"; NuovoAudioVideo.dataset.Rimosso = "no";
			NuovoAudioVideo.dataset.Video = Video;
			VisualizzazioneNellaLineaTemporale(NuovoAudioVideo);
		}, strSalvataggioInCorso, strSalvataggioCompletato, true, true
    );

    RiabilitaSchermata(true);
}
/*********************/

/*** Analisi e visualizzazione grafica della registrazione nella linea temporale ***/
function VisualizzazioneNellaLineaTemporale(AVR) {
	var NumeroTraccia = Number(document.getElementById('NumeroTraccia_' + AVR.dataset.ID_Utente).value), NomeDoppiatore = document.getElementById('NomeDoppiatore_' + AVR.dataset.ID_Utente).value;
	var Altezza = Number(document.getElementById('SuddivisioneTracce').value), UnitaDiMisura = document.getElementById('UnitaDiMisura').value;
	var Didascalia = (ID_Utente == AVR.dataset.ID_Utente ? strTuaRegistrazione + " " : strTracciaDi + " " + NomeDoppiatore + " ") + AVR.dataset.Data;
	CreaElementoLineaTemporale('ELT' + AVR.id, AVR.dataset.MinutaggioRegistrazione, AVR.dataset.Durata, Didascalia, AVR.dataset.numero, AVR.dataset.Video, (NumeroTraccia * Altezza) + UnitaDiMisura, Altezza + UnitaDiMisura);
}
/***********************************************************************************/


function playRegistrazione(Numero, Partenza) {
	AudioVideoRegistrato[Numero].currentTime = Partenza;
	AudioVideoRegistrato[Numero].play();
	AudioVideoRegistrato[Numero].dataset.StoRiproducendoRegistrazione = "si";
}

function play() {
	if (ContenitoreVideoGuida.dataset.Riproduzione == "no") {PlayVideoGuida();} else {StopVideoGuida();}
}

function StoppaRegistrazioni(AVR) {
	AVR.pause();
	AVR.dataset.StoRiproducendoRegistrazione = "no";
}

function PlayVideoGuida() {
	if (ContenitoreVideoGuida.dataset.Riproduzione == "no") {
		VideoGuidaPlay();
		AudioVideoRegistrato.forEach(StoppaRegistrazioni);
		ContenitoreVideoGuida.dataset.Riproduzione = "si";
		imgPlayPausa.src = "images/pause-blue.png";
	}
}

function StopVideoGuida() {
	if (ContenitoreVideoGuida.dataset.Riproduzione == "si") {
		VideoGuidaPause();
		AudioVideoRegistrato.forEach(StoppaRegistrazioni);
		ContenitoreVideoGuida.dataset.Riproduzione = "no";
		imgPlayPausa.src = "images/play-blue.png";
	}
}

function StoppaEventualeRegistrazione() {
	if (pulStopRegistrazione.disabled === false) {stopRecording();} else {StopVideoGuida();}
}

function AttivaAnimazioneRegistrazione() {
	pulRegistra.style.opacity = 0;
	tmrAnimazioneRegistrazione = window.setInterval(AnimazioneRegistrazione, 800);
}

function AnimazioneRegistrazione() {
	pulRegistra.style.opacity = 1 * (pulRegistra.style.opacity == "0");
}

function TerminaAnimazioneRegistrazione() {
	clearInterval(tmrAnimazioneRegistrazione);
	pulRegistra.style.opacity = "";
}

function SpostaMinutaggioRegistrazione(Numero, NuovaPartenzaRegistrazione) {
	var IDELT_Opzioni = (IDELT = 'ELT' + AudioVideoRegistrato[Numero].id) + 'Opzioni';
	var M = document.getElementById(IDELT_Opzioni + 'MinutaggioMinuti');
	var S = document.getElementById(IDELT_Opzioni + 'MinutaggioSecondi');
	
	if (!NuovaPartenzaRegistrazione) { // Se NuovaPartenzaRegistrazione è passata come argomento vuol dire che il valore non è stato direttamente selezionato dall'utente, ma è stato inviato da una chiamata automatica (v. ad es.: AggiornaAltriUtenti) 
		NuovaPartenzaRegistrazione = Number(S.value) + Number(M.value) * 60;
	}
	
	NuovaPartenzaRegistrazione = NuovaPartenzaRegistrazione * (NuovaPartenzaRegistrazione > 0) + ((-NuovaPartenzaRegistrazione + VideoGuidaDurataTotale() - AudioVideoRegistrato[Numero].dataset.Durata) * (NuovaPartenzaRegistrazione > VideoGuidaDurataTotale() - 2));
	
	try {
		var Minutaggio = new MinutiESecondi(NuovaPartenzaRegistrazione);
		M.value = Minutaggio.Minuti; S.value = Minutaggio.Secondi;
	} catch(e) {}

	
	AudioVideoRegistrato[Numero].dataset.MinutaggioRegistrazione = NuovaPartenzaRegistrazione;
	InserimentoInProporzioneNellaLineaTemporale(document.getElementById(IDELT), NuovaPartenzaRegistrazione, AudioVideoRegistrato[Numero].dataset.Durata);
}

function evslide_CambiaVolumeClip(e) {
	CambiaVolumeClip(e.currentTarget.dataset.RiferimentoRegistrazione, e.currentTarget.value);
}

function evcasella_CambiaVolumeClip(e) {
	CambiaVolumeClip(e.currentTarget.dataset.RiferimentoRegistrazione, e.currentTarget.value / 100);
}

function CambiaVolumeClip(Numero, Volume) {
	var IDELT_Opzioni = 'ELT' + AudioVideoRegistrato[Numero].id + 'Opzioni';
	GuadagnoAVR[Numero].gain.value = Volume;
	try {
		document.getElementById(IDELT_Opzioni + 'SlideVolume').value = Volume;
		document.getElementById(IDELT_Opzioni + 'CasellaVolume').value = parseInt(Volume * 100);		
	} catch (e) {}
}

function Download(Numero) {
	var Parametri = "NomeProgetto=" + encodeURIComponent(NomeProgetto) + "&NomeDoppiaggio=" + encodeURIComponent(NomeDoppiaggio) + "&NomeUtente=" + encodeURIComponent(document.getElementById('NomeDoppiatore_' + AudioVideoRegistrato[Numero].dataset.ID_Utente).value) + "&MinutaggioRegistrazione=" + encodeURIComponent(AudioVideoRegistrato[Numero].dataset.MinutaggioRegistrazione) + "&FileOriginale=" + encodeURIComponent(AudioVideoRegistrato[Numero].src);
	
	AJAX("DownloadSingolaRegistrazione.php", Parametri,
		function (Dati) {
			Messaggio(strCreazioneCompletata + " <a class='btn btn-default' href='" + AudioVideoRegistrato[Numero].src + "' download='" + Dati.NomeFile + "'>" + strScaricaQuiAudio + "</a>", "OK");
		}, strElaborazioneFileInCorso, "", true
	);
}

function DownloadTraccia(NumeroTraccia) {
	var ID_UtenteTraccia = document.getElementById('DownloadTraccia' + NumeroTraccia).dataset.utente;
	var Parametri = "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P) + "&IDUtente=" + encodeURIComponent(ID_UtenteTraccia);
	
	AJAX("DownloadTraccia.php", Parametri,
		function (Dati) {
			var NomeFileZip = NomeProgetto + " - " + NomeDoppiaggio + " - " + strBattute + " " + document.getElementById('NomeDoppiatore_' + ID_UtenteTraccia).value + ".zip";
			NomeFileZip.replace(/[^a-zA-Z0-9\. ]/g, "_");
			
			Messaggio(strCreazioneZipCompletata + " <a class='btn btn-default' href=\"" + Dati.NomeArchivioZip + "\" download=\"" + NomeFileZip + "\">" + strScaricaQuiZip + "</a>", "OK");
		}, strCreazioneZipInCorso, "", true
	);
}

function CancellaRegistrazione(Numero) {
	VisualizzaAVRCancellato(Numero);
		
	OpzioniTraccia(Numero, false);
}

function VisualizzaAVRCancellato(Numero) {
	AudioVideoRegistrato[Numero].dataset.Rimosso = "si";
	
	var IDELT = 'ELT' + AudioVideoRegistrato[Numero].id;
	var ELT = document.getElementById(IDELT);
	ELT.style.opacity = "0.2"; ELT.style.backgroundColor = "white";
	
	try {
		var c = document.getElementById(IDELT + 'OpzioniCancella');
		c.className = 'btn btn-info fa fa-undo';
		c.title = strRipristinaClip;
		c.onclick = function () {RipristinaRegistrazione(this.dataset.RiferimentoRegistrazione);};
	} catch(e) {}
}

function RipristinaRegistrazione(Numero) {
	VisualizzaAVRAttivo(Numero);
	
	OpzioniTraccia(Numero, false);
}

function VisualizzaAVRAttivo(Numero) {
	AudioVideoRegistrato[Numero].dataset.Rimosso = "no";
	
	var IDELT = 'ELT' + AudioVideoRegistrato[Numero].id;
	var ELT = document.getElementById(IDELT);
	ELT.style.backgroundColor = "orange"; ELT.style.opacity = "0.6";
	
	try {
		var c = document.getElementById(IDELT + 'OpzioniCancella');
		c.className = 'btn btn-danger fa fa-trash-o';
		c.title = strCancellaClip;
		c.onclick = function () {CancellaRegistrazione(this.dataset.RiferimentoRegistrazione);};
	} catch(e) {}
}

function SalvaModificheAVR(Numero) {
	var Parametri = "N=" + encodeURIComponent(AudioVideoRegistrato[Numero].dataset.NumeroUnivoco) + "&MinutaggioRegistrazione=" + encodeURIComponent(AudioVideoRegistrato[Numero].dataset.MinutaggioRegistrazione) + "&Guadagno=" + encodeURIComponent(GuadagnoAVR[Numero].gain.value) + "&Rimosso=" + encodeURIComponent(AudioVideoRegistrato[Numero].dataset.Rimosso);
	
	AJAX("AggiornaRegistrazione.php", Parametri, "", strAggiornamento, strSalvataggioCompletato, true);
}

function CaricaAVR() {
	AJAX("CaricaRegistrazione.php", "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P),
		function (Dati) {
			var Numero = 0, I;
			for(I = 0; I < Dati.length; I++) {
				CreaNuovoAVR(Dati[I]);
			}
			
			AttivaAggiornamentoAltriUtenti();
		}, strCaricamentoInCorso, strCaricamentoCompletato
	);
}

function AggiornaAltriUtenti() {
	var d = new Date(), ora = parseInt(d.getTime() / 1000); 

	AJAX("CaricaRegistrazione.php", "NumProgetto=" + encodeURIComponent(N) + "&NumProvino=" + encodeURIComponent(P), 
		function (Dati) {
			var I, NumAVR;
			for(I = 0; I < Dati.length; I++) {
				for(NumAVR = 0; (NumAVR < AudioVideoRegistrato.length) && (AudioVideoRegistrato[NumAVR].dataset.NumeroUnivoco != Dati[I].N); NumAVR++);
				if (NumAVR >= AudioVideoRegistrato.length) {
					CreaNuovoAVR(Dati[I]);
				} else {
					if (AudioVideoRegistrato[NumAVR].dataset.MinutaggioRegistrazione != Dati[I].MinutaggioRegistrazione) {SpostaMinutaggioRegistrazione(NumAVR, Dati[I].MinutaggioRegistrazione);}
					CambiaVolumeClip(NumAVR, Dati[I].Guadagno);
					if (AudioVideoRegistrato[NumAVR].dataset.Rimosso != Dati[I].Rimosso) {
						if (Dati[I].Rimosso == "si") {VisualizzaAVRCancellato(NumAVR);} else {VisualizzaAVRAttivo(NumAVR);}
					}
				}

				document.getElementById(Dati[I].ID_Utente + "_online").className = (((ora - Dati[I].DataUltimaAzione) < 1000) ? "fa fa-circle" : "");
			}
		}, "", "", true
	);
}

function AttivaAggiornamentoAltriUtenti() {
	window.clearInterval(tmrAggiornaAltriUtenti);
	tmrAggiornaAltriUtenti = window.setInterval(AggiornaAltriUtenti, 30000);
}

function CreaNuovoAVR(Dati) {
	/** Crea la nuova clip audio **/
	AudioVideoRegistrato.push(CreaElemento('audio', 'Reg' + AudioVideoRegistrato.length, 'Contenitore'));
	Numero = AudioVideoRegistrato.length - 1;
	AudioVideoRegistrato[Numero].dataset.numero = Numero;
	/******************************/
	
	/** Crea il controller del guadagno **/
	var audioCtx = new AudioContext();
	var sorgente = audioCtx.createMediaElementSource(AudioVideoRegistrato[Numero]);
	GuadagnoAVR.push(audioCtx.createGain()); GuadagnoAVR[Numero].channelCount = 1; GuadagnoAVR[Numero].gain.value = 1;
	FiltroAVR.push(audioCtx.createBiquadFilter()); FiltroAVR[Numero].channelCount = 1; FiltroAVR[Numero].frequency.value = 22050;
	sorgente.connect(GuadagnoAVR[Numero]);
	GuadagnoAVR[Numero].connect(FiltroAVR[Numero]);
	FiltroAVR[Numero].connect(audioCtx.destination);
	/**************************************/
	
	/** Inserisce i dati eventualmente passati **/
	if (Dati) {
		AudioVideoRegistrato[Numero].dataset.NumeroUnivoco = Dati.N;
		AudioVideoRegistrato[Numero].dataset.ID_Utente = Dati.ID_Utente;
		AudioVideoRegistrato[Numero].src = Dati.Registrazione;
		AudioVideoRegistrato[Numero].dataset.MinutaggioRegistrazione = Dati.MinutaggioRegistrazione;
		AudioVideoRegistrato[Numero].dataset.Durata = Dati.DurataRegistrazione;
		AudioVideoRegistrato[Numero].dataset.Data = Dati.Data;
		AudioVideoRegistrato[Numero].dataset.Video = Dati.Video;
		AudioVideoRegistrato[Numero].dataset.Rimosso = Dati.Rimosso;
		AudioVideoRegistrato[Numero].dataset.StoRiproducendoRegistrazione = "no";
		GuadagnoAVR[Numero].gain.volume = Dati.Guadagno;
		VisualizzazioneNellaLineaTemporale(AudioVideoRegistrato[Numero]);
	}
	/*********************************************/
	
	/** Eventi vari **/
	AudioVideoRegistrato[Numero].addEventListener('ended', function (e) {window.setTimeout(function () {e.target.dataset.StoRiproducendoRegistrazione = "no";}, 350);});
	/*****************/
	
	return Numero;
}


function VideoGuidaPronto() {
	VideoGuidaCaricaEAvvia(PercorsoVideoGuida);
	
	document.getElementById('MsgCaricamentoIniziale').innerHTML = strAttendereFineCaricamento;
	
	AJAX("CreatoreProgetto.php", "NumProgetto=" + encodeURIComponent(N),
		function (Dati) {
			var Stringa = "";
			
			CreatoreAttualeProgetto = Dati.ID_CreatoreProgetto;

			if (SessioneOspite) {Stringa = (Provino? strModalitaVisualizzazione + "<br>" : strNonHaiNessunRuolo + "<br>" + ((ID_Utente != CreatoreAttualeProgetto) ? strPuoiSoloVisualizzare : ""));}
			
			if (SolaVisione) {document.getElementById('SelezioneMicrofono').style.display = "none";} else {AggiornaElencoDispositivi(); AttivaIngressi();}
			
			Stringa += (ID_Utente == CreatoreAttualeProgetto) ? "<span style='font-size: 13px; font-weight: bold; font-style: italic;'>" + strPoteriCreatoreProgetto + "</span>" : "";
			document.getElementById('MessaggiUlteriori').innerHTML = Stringa;
			
			VideoGuidaImpostaEventoPrimoCaricamento(AttivaProgramma);
		}, "", "", true
	);
}

window.setTimeout(CaricamentoVideo, 2000); tmrCaricamento = window.setInterval(CaricamentoVideo, 10000);
