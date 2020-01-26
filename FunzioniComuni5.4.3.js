var OndeSonore = [], OggettoDaSpostare = false, ELTDaSpostare = false, tmrCancMex, tmrELTCliccato;

function CreaElemento(Tipo, ID, DoveInserirlo, Stringa) {
	var Elemento = document.createElement(Tipo);
	Elemento.id = ID; Elemento.name = ID;
	document.getElementById(DoveInserirlo).appendChild(Elemento);
	
	if (Stringa) {document.getElementById(ID).innerHTML = Stringa;} 
	
	return document.getElementById(ID);
}

function InserimentoInProporzioneNellaLineaTemporale(ELT, Partenza, Lunghezza) {
	ELT.style.left = (Partenza / VideoGuidaDurataTotale() * 100) + "%";
	ELT.style.width = (Lunghezza / VideoGuidaDurataTotale() * 100) + "%";	
}

function CreaElementoLineaTemporale(ID, Partenza, Lunghezza, Stringa, RiferimentoRegistrazione, Video, Posizione, Altezza) {
	var ELT = CreaElemento('div', ID, 'ContenutoTracce');

	ELT.title = Stringa;
	ELT.style.position = "absolute";
	ELT.style.border = "2px dotted blue"; ELT.style.transition = "all 1s";
	ELT.style.top = Posizione;
	ELT.style.height = Altezza; ELT.style.verticalAlign = "middle";
	ELT.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
	InserimentoInProporzioneNellaLineaTemporale(ELT, Partenza, Lunghezza);
	
	OndeSonore.push(new OndaSonora(ID, RiferimentoRegistrazione)); OndeSonore[OndeSonore.length - 1].Disegna();
	
	if ( ( (AudioVideoRegistrato[RiferimentoRegistrazione].dataset.ID_Utente == ID_Utente) && (SolaVisione == false) ) || (ID_Utente == CreatoreAttualeProgetto)) {
		ELT.style.cursor = "pointer";
		
		/*** Crea la finestrella delle opzioni ***/
		var divContenitoreOpzioni = CreaElemento('div', ID_Opzioni = ID + 'Opzioni', 'Monitors');
		divContenitoreOpzioni.style.display = "none";
		divContenitoreOpzioni.style.position = "absolute";
		divContenitoreOpzioni.style.backgroundColor = "white"; 
		divContenitoreOpzioni.style.top = "20px";
		divContenitoreOpzioni.className = "panel panel-default";
		divContenitoreOpzioni.style.zIndex = 100 + Number(RiferimentoRegistrazione);
		
		/** Barra del titolo **/
		var div = CreaElemento('div', ID + 'OpzioniTitolo', divContenitoreOpzioni.id, strOpzioniTraccia); div.className = "panel-heading text-center";
			div.style.cursor = "move";
			div.addEventListener('mousedown', function () {OggettoDaSpostare = this.parentNode;});
			document.getElementById('Monitors').addEventListener('mousemove', function (Mouse) {
				if (OggettoDaSpostare) {
					OggettoDaSpostare.style.top  = (Mouse.clientY - document.getElementById('Monitors').offsetTop - 10) + "px";
					OggettoDaSpostare.style.left = (Mouse.clientX - 150) + "px";
				}
			});
			divContenitoreOpzioni.addEventListener('mouseup', function () {OggettoDaSpostare = false; this.style.cursor = "";});
	
		/*var x = CreaElemento('div', ID + 'X', ID + 'Opzioni', "X");
		x.style.position = "absolute"; x.style.top = "5px"; x.style.right = "5px";
		x.style.color = "grey"; x.style.fontFamily = "Verdana";
		x.style.cursor = "pointer";
		x.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
		x.addEventListener('click', function () {OpzioniTraccia(this.dataset.RiferimentoRegistrazione, false);});*/
	
			var pulCancellaRegistrazione = CreaElemento('a', ID_Opzioni + 'Cancella', div.id); pulCancellaRegistrazione.style.position = "absolute"; pulCancellaRegistrazione.style.top = "5px"; pulCancellaRegistrazione.style.left = "10px";
				pulCancellaRegistrazione.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
				pulCancellaRegistrazione.onclick = function() {CancellaRegistrazione(this.dataset.RiferimentoRegistrazione);};
		
		/** Contenuto **/
		div = CreaElemento('div', ID_Opzioni + 'ContenitoreOpzioniBody', ID_Opzioni); div.className = "panel-body";
			var Tabella = CreaElemento('table', ID_Opzioni + 'TabellaOpzioni', div.id); Tabella.className = "TabellaOpzioni"; Tabella.style.width = "100%";
			    										
														/* Minutaggio */
				var	tr = CreaElemento('tr', ID_Opzioni + 'TabellaOpzioniRiga1', Tabella.id);
					var td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneLabel', tr.id, strPosizione); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";
					    td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneMinutiSecondi', tr.id);
					    	var SottoTabella = CreaElemento('table', ID_Opzioni + 'SottoTabellaMinutiSecondi', td.id);
					    		tr = CreaElemento('tr', ID_Opzioni + 'SottoTabellaRiga1', SottoTabella.id);
					    			td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneMinutiLabel', tr.id, strMinuti); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";
					    			td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneVuoto', tr.id);
					    			td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneSecondiLabel', tr.id, strSecondi); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";
								
					    		tr = CreaElemento('tr', ID_Opzioni + 'SottoTabellaRiga2', SottoTabella.id);
					    			td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneMinuti', tr.id);
							    		var Max = Number(VideoGuidaDurataTotale()) - Number(Lunghezza);
										var MinutaggioAttuale = new MinutiESecondi(Partenza); var MinutaggioMassimo = new MinutiESecondi(Max);
										var M = CreaElemento('input', ID_Opzioni + 'MinutaggioMinuti', td.id); M.setAttribute("type", "number"); M.className = "SelettoreMinutaggioMinuti";
										M.setAttribute("min", "0"); M.setAttribute("max", MinutaggioMassimo.Minuti); M.setAttribute("step", "1");
										M.value = MinutaggioAttuale.Minuti;
										M.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
										M.addEventListener("change", function () {SpostaMinutaggioRegistrazione(this.dataset.RiferimentoRegistrazione);});
								
									td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneDivisore', tr.id, ":");
										
									td = CreaElemento('td', ID_Opzioni + 'tdOpzionePosizioneSecondi', tr.id);
										var S = CreaElemento('input', ID_Opzioni + 'MinutaggioSecondi', td.id); S.setAttribute("type", "number"); S.className = "SelettoreMinutaggioSecondi";
										S.setAttribute("min", "0"); S.setAttribute("max", "59.999"); S.setAttribute("step", "0.1");
										S.value = MinutaggioAttuale.Secondi;
										S.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
										S.addEventListener("change", function () {SpostaMinutaggioRegistrazione(this.dataset.RiferimentoRegistrazione);});
										
						
														/* Guadagno */				
					tr = CreaElemento('tr', ID_Opzioni + 'TabellaOpzioniRiga2', Tabella.id);
						td = CreaElemento('td', ID_Opzioni + 'tdOpzioneVolumeLabel', tr.id, strVolume); td.style.fontFamily = "Verdana"; td.style.fontSize = "12px";
						td = CreaElemento('td', ID_Opzioni + 'tdOpzioneVolumeSlide', tr.id);
							var slide = CreaElemento('input', ID_Opzioni + 'SlideVolume', td.id);
								slide.setAttribute("type", "range"); slide.setAttribute("min", "0"); slide.setAttribute("max", "5"); slide.setAttribute("step", "0.01"); 
								slide.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
								slide.addEventListener('input', evslide_CambiaVolumeClip);
						td = CreaElemento('td', ID_Opzioni + 'tdOpzioneVolumeValore', tr.id);
							var c = CreaElemento('input', ID_Opzioni + 'CasellaVolume', td.id); c.style.width = "60px";
								c.setAttribute("type", "number"); c.setAttribute("min", "0"); c.setAttribute("max", "500"); c.setAttribute("step", "10");
								c.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
								c.addEventListener('change', evcasella_CambiaVolumeClip);
							CreaElemento('span', ID_Opzioni + 'CasellaVolumelabel', td.id, "%");
						CambiaVolumeClip(RiferimentoRegistrazione, GuadagnoAVR[RiferimentoRegistrazione].gain.value);
						
														/* Varie */
					tr = CreaElemento('tr', ID_Opzioni + 'TabellaOpzioniRiga3', Tabella.id);
						td = CreaElemento('td', ID_Opzioni + 'tdOpzioneAscoltaClip', tr.id); td.style.width = "150px";
							var pulAscolta = CreaElemento('a', ID_Opzioni + 'PulAscolta', td.id); ResettaPulAscolta(pulAscolta);
								pulAscolta.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
								AudioVideoRegistrato[RiferimentoRegistrazione].addEventListener('pause', ev_ResettaPulAscolta);
								pulAscolta.addEventListener('click', 
									function (e) {
										var p = e.currentTarget;
										if (p.dataset.inriproduzione == "no") {
											AudioVideoRegistrato[p.dataset.RiferimentoRegistrazione].currentTime = 0;
											AudioVideoRegistrato[p.dataset.RiferimentoRegistrazione].play();
											p.className = "btn btn-warning btn-sm fa fa-stop"; p.innerText = " " + strInterrompiAscolto;
											p.dataset.inriproduzione = "si";
										} else {
											AudioVideoRegistrato[p.dataset.RiferimentoRegistrazione].pause();
										}
									}
								);
						
						td = CreaElemento('td', ID_Opzioni + 'tdOpzioneScaricaClip', tr.id);
							var pulDownload = CreaElemento('a', ID_Opzioni + 'Download', td.id);
								pulDownload.className = "btn btn-default btn-sm fa fa-download"; pulDownload.innerHTML = " " + strScaricaRegistrazione;
								pulDownload.title = "Scarica registrazione";
								pulDownload.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione; pulDownload.dataset.Video = Video;
								pulDownload.addEventListener('click', function () {Download(this.dataset.RiferimentoRegistrazione);});
								
						td = CreaElemento('td', ID_Opzioni + 'tdVuoto', tr.id);
			
							
		/** Pulsanti salva e annulla **/
		div = CreaElemento('div', ID_Opzioni + 'PulsantiFinali', ID_Opzioni); div.className = "panel-footer";
			Tabella = CreaElemento('table', ID_Opzioni + 'TabellaPulsantiFinali', div.id); Tabella.className = "TabellaOpzioni"; Tabella.style.width = "100%";
				tr = CreaElemento('tr', ID_Opzioni + 'RigaTabellaPulsantiFinali', Tabella.id);
					td = CreaElemento('td', ID_Opzioni + 'CasellaAnnulla', tr.id);
						var pulAnnulla = CreaElemento('a', ID_Opzioni + 'Annulla', td.id, " " + strAnnullalemodifiche); pulAnnulla.className = "btn btn-default fa fa-times";
							pulAnnulla.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
							pulAnnulla.dataset.idopzioni = ID_Opzioni;
							pulAnnulla.addEventListener('click',
								function (e) {
									var FinestraOpzioni = document.getElementById(this.dataset.idopzioni);
									/** Rimette i valori iniziali **/
									/* Minutaggio */
									document.getElementById(FinestraOpzioni.id + 'MinutaggioMinuti').value = FinestraOpzioni.dataset.minutiprec; document.getElementById(FinestraOpzioni.id + 'MinutaggioSecondi').value = FinestraOpzioni.dataset.secondiprec;
									SpostaMinutaggioRegistrazione(this.dataset.RiferimentoRegistrazione);
									/* Guadagno */
									CambiaVolumeClip(this.dataset.RiferimentoRegistrazione, FinestraOpzioni.dataset.guadagnoprec);
									
									/** Chiude la finestra **/
									OpzioniTraccia(this.dataset.RiferimentoRegistrazione, false);
								}
							);
							
					td = CreaElemento('td', ID_Opzioni + 'CasellaSalva', tr.id); td.className = "text-right";
						var pulSalva = CreaElemento('a', ID_Opzioni + 'Salva', td.id, " " + strSalva); pulSalva.className = "btn btn-success fa fa-check";
							pulSalva.dataset.RiferimentoRegistrazione = RiferimentoRegistrazione;
							pulSalva.addEventListener('click', function () {OpzioniTraccia(this.dataset.RiferimentoRegistrazione, false);});
							
		/*** Eventi al click dell'elemento nella linea temporale ***/
		ELT.addEventListener('mousedown',
			function(e) {
				var ELTCliccato = e.currentTarget;
				ELTCliccato.dataset.cliccato = "si";
				
				if (Righello.dataset.DisattivaClick == "no") {	
					OpzioniTraccia(ELTCliccato.dataset.RiferimentoRegistrazione, true);	
					console.log("ELTCliccato", ELTCliccato);
					tmrELTCliccato = setTimeout(
						function () {
							ELTDaSpostare = ELTCliccato;
							ELTDaSpostare.style.transition = "";
						}, 200
					);
				}
			},	true
		);
		
		ELT.addEventListener('mouseup',
			function(e) {
				var ELTCliccato = e.currentTarget;
				ELTCliccato.dataset.cliccato = "no";
			}, true
		);
	}
	
	VisualizzaELTNormale(RiferimentoRegistrazione);
}

function VisualizzaELTNormale(Numero) {
	if (AudioVideoRegistrato[Numero].dataset.Rimosso == "no") {VisualizzaAVRAttivo(Numero);} else {VisualizzaAVRCancellato(Numero);}
}

function OpzioniTraccia(Numero, Apri) {
	var IDELT = 'ELT' + AudioVideoRegistrato[Numero].id, ELT = document.getElementById(IDELT);
	var IDOpzioniTraccia = IDELT + 'Opzioni';
	
	try {
		var OpzTraccia = document.getElementById(IDOpzioniTraccia);
		if (Apri) {
			var Posizionamento = parseInt((Number(AudioVideoRegistrato[Numero].dataset.MinutaggioRegistrazione) - 100) / VideoGuidaDurataTotale() * window.innerWidth);
			var PosizioneX = Posizionamento * (Posizionamento > 0) - (350 * (Righello.offsetLeft + Posizionamento + 200 > window.innerWidth));
			OpzTraccia.style.left = PosizioneX + "px";
			
			OpzTraccia.dataset.minutiprec = document.getElementById(OpzTraccia.id + "MinutaggioMinuti").value; OpzTraccia.dataset.secondiprec = document.getElementById(OpzTraccia.id + "MinutaggioSecondi").value;
			OpzTraccia.dataset.guadagnoprec = GuadagnoAVR[Numero].gain.value;
			
			window.onkeydown = function (Tasto) {
				switch(Tasto.keyCode) {
					case 27: document.getElementById(OpzTraccia.id + "Annulla").click(); // [ESC]
					case 13: document.getElementById(OpzTraccia.id + "Salva").click();   // [INVIO]
				}
			};
		} else {
			window.onkeydown = "";
		}
		
		OpzTraccia.style.display = (Apri ? "block" : "none");
	} catch(e) {}
	
	ELT.style.borderStyle = (Apri ? "ridge" : "dotted");
	if (Apri) {ELT.style.opacity = 1;} else {VisualizzaELTNormale(Numero);}
	
	Righello.dataset.DisattivaClick = (Apri ? "si" : "no");
	
	if (Apri) {DisabilitaSchermata();} else {SalvaModificheAVR(Numero); ELTDaSpostare = false; ELT.style.transition = "all 1s"; AudioVideoRegistrato[Numero].pause(); ResettaPulAscolta(document.getElementById(OpzTraccia.id + 'PulAscolta')); RiabilitaSchermata();}
	console.log("OpzioniTraccia", Numero, Apri);
}

function ev_ResettaPulAscolta(e) {
	ResettaPulAscolta(document.getElementById('ELT' + e.currentTarget.id + 'OpzioniPulAscolta'));
}

function ResettaPulAscolta(p) {
	p.className = "btn btn-default btn-sm fa fa-play-circle";
	p.innerText = " " + strAscoltaClip;
	p.dataset.inriproduzione = "no";
}

function OndaSonora(ID, Numero) {
	this.ID = ID; this.Numero = Numero; this.Disegnata = false;
	
	this.Disegna = function () {
		if (this.Disegnata) {this.Cancella();}
		this.NuovaOndaSonora = WaveSurfer.create({container: '#' + this.ID, waveColor: 'blue', progressColor: 'blue', height: document.getElementById(this.ID).clientHeight, hideScrollbar: true, interact: false, cursorColor: 'transparent'}); this.NuovaOndaSonora.load(AudioVideoRegistrato[this.Numero].src);
		this.Disegnata = true;
	};
	
	this.Cancella = function () {
		this.NuovaOndaSonora.destroy();
		this.Disegnata = false;
	};
}

function CancellaOndeSonore(Onda) {
	Onda.Cancella();
}

function RidisegnaOndeSonore(Onda) {
	Onda.Disegna();
}

function Ridisegna() {
	try {document.getElementById('Zoom').value = 100; document.getElementById('Zoom').dispatchEvent(ev_cambiamento);} catch(e) {}
	try {MinutaggiRighello.Ridisegna();} catch(e) {}
	try {RidimensionaVideo();} catch(e) {}
}

window.addEventListener('resize', Ridisegna);

/*** Gestore richieste AJAX ***/
function AJAX(Pagina, Parametri, Funzione, MessaggioIniziale, MessaggioOK, NonDisabilitare, EliminaHeader) {
	var XHR = new XMLHttpRequest();
	XHR.open ("post", Pagina, true);
	if (!EliminaHeader) {XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");}
	XHR.onreadystatechange = function () {
		if (XHR.readyState == 4) {
			if (XHR.status == 200) {
				var Dati = JSON.parse(XHR.responseText);
				if (Dati.Errore) {
					Messaggio(Dati.Errore, "A");
				} else {
					
					if (Funzione) {Funzione(Dati);}
					
					if (!NonDisabilitare) {RiabilitaSchermata(true);}
					
					if (MessaggioOK) {Messaggio(MessaggioOK, "OK");}
				}
			} else {Messaggio(strErroreConnessioneAJAX); window.setTimeout(function () {AJAX(Pagina, Parametri, Funzione, MessaggioIniziale, MessaggioOK, NonDisabilitare, EliminaHeader);}, 1000);}
		}
	};
	
	if (!NonDisabilitare) {DisabilitaSchermata();}
	
	if (MessaggioIniziale || MessaggioOK) {VisualizzaProgresso(XHR);}
	
	if (MessaggioIniziale) {Messaggio(MessaggioIniziale);}
	XHR.send(Parametri);
}


function VisualizzaProgresso(XHR) {
	var BarraCaricamento = document.getElementById('ProgressoCaricamento'), ContornoBarraCaricamento = document.getElementById('BarraProgressoCaricamento');
	
	XHR.upload.onloadstart = function (e) {
		BarraCaricamento.style.opacity = 1; ContornoBarraCaricamento.style.opacity = 1;
	    VisualizzaProgressoBarraCaricamento(BarraCaricamento, 0);
	};
	
	XHR.upload.onprogress = function (e) {
	    if (e.lengthComputable) {
	        VisualizzaProgressoBarraCaricamento(BarraCaricamento, e.loaded / e.total);
	    }
	};
	
	XHR.upload.onloadend = function (e) {AzzeraBarraCaricamento(BarraCaricamento, ContornoBarraCaricamento, e);};
	XHR.onload = function (e) {AzzeraBarraCaricamento(BarraCaricamento, ContornoBarraCaricamento, e);};
}

function AzzeraBarraCaricamento(BarraCaricamento, ContornoBarraCaricamento, e) {
	VisualizzaProgressoBarraCaricamento(BarraCaricamento, e.loaded / e.total);
	BarraCaricamento.style.opacity = 0; ContornoBarraCaricamento.style.opacity = 0;
}

function VisualizzaProgressoBarraCaricamento(BarraCaricamento, PercentualeCaricamento) {
	var PC = PercentualeCaricamento * 100;
	BarraCaricamento.style.width = PC + "%";
	BarraCaricamento.innerHTML = parseInt(PC) + "%";
}

function Messaggio(Stringa, Attenzione) {
	window.clearTimeout(tmrCancMex);
	
	var M = document.getElementById('Messaggio');
	M.innerHTML = Stringa;
	switch (Attenzione) {
		case "OK" : M.className = "alert alert-success"; break;
		case "A": M.className = "alert alert-danger"; break;
		default: M.className = "alert alert-warning"; break;
	}
	M.style.opacity = 1;
	
	tmrCancMex = window.setTimeout(CancMex, 15000);
}

function CancMex() {
	document.getElementById('Messaggio').style.opacity = 0;
}

function CreaParametri(vParametri) {
    frmDati = new FormData();

    for(var NomeParametro in vParametri) {
        frmDati.append(NomeParametro, vParametri[NomeParametro]);
    }

    return frmDati;
}
/******************************/

function LarghezzaVideo(LarghezzaOriginale, AltezzaOriginale) {
	return Math.floor(document.getElementById('ComandiPlayer').offsetTop * LarghezzaOriginale / AltezzaOriginale) + "px";
}

function ApriCopione(e) {
	window.open(e.currentTarget.dataset.link, "Copione", "height=600, width=500, menubar=no, location=no, status=no, toolbar=no, scrollbars=yes", false);
}

function ApriFinestra(e) {
	var Altezza = e.currentTarget.dataset.altezza, Larghezza = e.currentTarget.dataset.larghezza;
	window.open(e.currentTarget.dataset.link, "Finestrella", "height=" + Altezza + ", width=" + Larghezza + ", menubar=no, location=no, status=no, toolbar=no, scrollbars=yes", false);
}

/*** Abilita/disabilita i pulsanti personalizzati con css ***/
HTMLElement.prototype.abilita = function (Attivo) {
	this.style.pointerEvents = Attivo? "auto" : "none";
	this.style.color = Attivo? "" : "grey";
};
/************************************************************/

function ContieneCaratteriSpeciali(Stringa) {
	return Stringa.match(/[^a-zA-Z0-9\. ]/g) ? true : false;
}

Number.prototype.duecifre = function () {
	return this.toString().padStart(2, "0");
};

function IsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
