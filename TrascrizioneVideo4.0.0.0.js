const SP = document.getElementById('SceltaPersonaggi'), TestoGuida = document.getElementById('TestoGuida'), divVetro = document.getElementById('Vetro');
var tmrSospendi;

const SecondiRitornoIndietro = 2, MillisecondiRiprendiVideo = 1500;

for (var NomeTasto in TastiIndicazioni) {
	CreaElemento('li', 'li' + NomeTasto, 'infoTasti', "<a class='btn btn-default' data-tasto='" + NomeTasto + "' onclick='ClickPulsanteGraficoScorciatoiaTastiera(event);'><b>" + NomeTasto + "</b></a> " + TastiIndicazioni[NomeTasto]);
}

function Play() {VideoGuidaPlay(); VideoGuidaRimuoviEventoAlTermineCaricamento(Play);}

function Indietro(Secondi = false) {
	const Posizione = VideoGuidaMinutaggioCorrente() - Secondi;
	
	if (Posizione < 0) {VideoGuidaPosizionati(0);} else {VideoGuidaPosizionati(Posizione);}
}

function RiprendiDaPocoPrima(Secondi = SecondiRitornoIndietro) {
	VideoGuidaImpostaEventoAlTermineCaricamento(Play);
    Indietro(Secondi);
	SalvaCopione();
}

function RiprendiDaMinutaggioBloccoTesto(e) {
    const T = e.currentTarget;
    VideoGuidaImpostaEventoAlTermineCaricamento(Play);
    VideoGuidaPosizionati(T.dataset.minutaggio);
    SalvaCopione();
}

function SospendiVideo(e) {
	const T = e.currentTarget, PosizioneCursore = T.selectionStart;
	clearTimeout(tmrSospendi);
	
	VideoGuidaPause();
	
	tmrSospendi = window.setTimeout(RiprendiDaMinutaggioBloccoTesto, MillisecondiRiprendiVideo, e);
	
	switch (e.key) {
		case "(": T.value = T.value.slice(0, PosizioneCursore) + ")" + T.value.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; return 2;
		case "[": T.value = T.value.slice(0, PosizioneCursore) + VisualizzaMinutaggioAttuale() + "] " + T.value.slice(PosizioneCursore); setTimeout(RiprendiDaPocoPrima, 1000); return 2;
/* 		case "Control": if (e.location == 2) {RiprendiDaPocoPrima(6);} */
		case "AltGraph": clearTimeout(tmrSospendi); break;
		case "Enter":
            /** Nuova sezione di testo **/
            /* Sospende il video */
            clearTimeout(tmrSospendi); VideoGuidaPause();
            
            /* Visualizza la lista dei personaggi */
            SP.style.opacity = 1; SP.style.zIndex = 10;
            
            /* Si posiziona o crea la textarea del minutaggio corrispondente e mette il focus su di essa */
            const Minutaggio = VideoGuidaMinutaggioCorrente();
            const nuovatextarea = document.getElementById('t' + Minutaggio) || CreaNuovaTextarea(Minutaggio);
            nuovatextarea.focus();

            /* Attiva gli eventi */
            nuovatextarea.addEventListener('keyup', ScegliPersonaggio); document.body.addEventListener('click', ScegliPersonaggio);
            break;
	}
		
	TestoGuida.innerText = T.value.slice(0, PosizioneCursore + 200).slice(-600);
}

function ScegliPersonaggio(e) {
	const Personaggi = document.querySelectorAll('#Personaggi option'), Lettera = (e.key || '').toLowerCase(), T = e.currentTarget, PosizioneCursore = T.selectionStart;
    var NuovaPosizioneCursore = PosizioneCursore;
	
	SP.style.opacity = 0; SP.style.zIndex = -10;
	
	for(var I = 0; (I < Personaggi.length) && (Personaggi[I].innerText.toLowerCase() != Lettera); I++);
	console.log(Lettera, T.selectionStart);
		
	if (I < Personaggi.length) {
		T.value = T.value.slice(0, PosizioneCursore - 1) + Personaggi[I].value + ": " + T.value.slice(PosizioneCursore);
		NuovaPosizioneCursore += Personaggi[I].value.length + 1;
	}
	
	var Porzione = T.value.slice(0, T.value.indexOf('\nScena', PosizioneCursore)), strElencoPersonaggiNellaScena = "", strElencoPersonaggiPrecedente = "", ElencoPersonaggiNellaScena = [];
	if ((p = Porzione.lastIndexOf(']\n(')) > -1) {
		const PosizioneParentesiAperta = p + 3, PosizioneParentesiChiusa = T.value.indexOf(')\n', p);
		const PersonaggiNellaScena = Porzione.slice(PosizioneParentesiChiusa).match(/(\n|- )(?!Scena)[\w \(\)\.]+(:| -)/g) || [], totPersonaggiNellaScena = PersonaggiNellaScena.length;
		strElencoPersonaggiPrecedente = Porzione.slice(PosizioneParentesiAperta, PosizioneParentesiChiusa);
		
		for(var numPersonaggio = 0; numPersonaggio < totPersonaggiNellaScena; numPersonaggio++) {
			ElencoPersonaggiNellaScena[PersonaggiNellaScena[numPersonaggio].replace(/\n|:|- | -/g, '')] = true;
		}
		
		strElencoPersonaggiNellaScena = Object.keys(ElencoPersonaggiNellaScena).join(", ");
		T.value = T.value.slice(0, PosizioneParentesiAperta) + strElencoPersonaggiNellaScena + T.value.slice(PosizioneParentesiChiusa);
	}
	
	T.selectionEnd = NuovaPosizioneCursore + strElencoPersonaggiNellaScena.length - strElencoPersonaggiPrecedente.length;
	console.log(T.selectionEnd, "Differenza caratteri personaggi scena:", strElencoPersonaggiNellaScena.length, strElencoPersonaggiPrecedente.length, strElencoPersonaggiPrecedente);

	T.removeEventListener('keyup', ScegliPersonaggio);
    document.body.removeEventListener('click', ScegliPersonaggio);
	T.addEventListener('keyup', SospendiVideo);

    AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Testo=" + encodeURIComponent(T.value) + "&Minutaggio=" + encodeURIComponent(T.dataset.minutaggio), 
        () => {
            tmrSospendi = window.setTimeout(VideoGuidaPlay, 1000);
        }, strAttenderePrego, strModificheSalvate
    );
}

function AltriAutomatismiTastiera(e) {
	const PosizioneCursore = T.selectionStart;
	
	if (Object.keys(TastiIndicazioni).includes(e.key)) {
		if (e.preventDefault) {e.preventDefault();}
		if (e.key == "F1") {
			var p = -1, contScena = 0;
			for(contScena = 0; (p = T.value.indexOf('\nScena ', p + 1)) > -1; contScena++);
			T.value = `${T.value.slice(0, PosizioneCursore)}\nScena ${(++contScena)} [${VisualizzaMinutaggioAttuale()}]\n()\n${T.value.slice(PosizioneCursore)}`;
			setTimeout(SospendiVideo, 500, {key: "Enter"});
		} else {
			T.value = T.value.slice(0, PosizioneCursore) + TastiIndicazioni[e.key] + " " + T.value.slice(PosizioneCursore); T.selectionStart = PosizioneCursore + TastiIndicazioni[e.key].length + 1; T.selectionEnd = T.selectionStart;
		}		
	}	
}

function ClickPulsanteGraficoScorciatoiaTastiera(e) {
    AltriAutomatismiTastiera({key: e.currentTarget.dataset.tasto});
}

function VisualizzaMinutaggioAttuale() {
	const Minutaggio = new MinutiESecondi(VideoGuidaMinutaggioCorrente());
	return Minutaggio.Minuti + ":" + (Minutaggio.Secondi | 0).toString().padStart(2, "0");
}

function SalvaCopione(e) {
	const Testo = e.currentTarget;
	AJAX("TrascrizioneVideo_SalvaCopione.php", "N=" + encodeURIComponent(N) + "&Testo=" + encodeURIComponent(Testo.value) + "&Minutaggio=" + encodeURIComponent(Testo.dataset.minutaggio), "", "", strModificheSalvate, true);
}

function CaricaCopione() {
	AJAX("TrascrizioneVideo_CaricaCopione.php", "N=" + encodeURIComponent(N),
		function (Dati) {
                const BlocchiDiTesto = Dati.BlocchiDiTesto, totBlocchiDiTesto = BT.length;
                for (let I = 0; I < totBlocchiDiTesto; I++) {
                    const BT = BlocchiDiTesto[I];
                    const T = CreaNuovaTextarea(BT.Minutaggio);
                    T.value = BT.Testo;
                    T.addEventListener('keyup', SospendiVideo);
                    T.addEventListener('keydown', AltriAutomatismiTastiera);
                    T.scrollTop = T.scrollHeight;
                    T.selectionStart = T.value.length; T.selectionEnd = T.selectionStart;
                }

                if (totBlocchiDiTesto == 0) {
                    const T = CreaNuovaTextarea(0);
                    T.onclick = (e) => {
                        const primatextarea = e.currentTarget;
                        VideoGuidaPause();
                        AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Testo=&Minutaggio=" + encodeURIComponent(VideoGuidaMinutaggioCorrente()), 
                            () => {
                                EliminaElemento(primatextarea);
                                CaricaCopione();
                                document.getElementsByTagName('textarea')[0].focus();
                            }, strAttenderePrego, strModificheSalvate
                        );
                    };
                }

				//document.getElementById('divContenitoreVideoGuida').dataset.PosizioneInizialeVideo = Dati.PosizioneVideo;
				FunzioneDopoInizializzazioneVideoGuida = PartenzaProgramma;
			}, strCaricamentoInCorso, strCopioneCaricato
	);
}

function CaricamentoCopione(N, Funzione, MessaggioIniziale, MessaggioFinale) {
	const Parametri = "N=" + encodeURIComponent(N);
	AJAX("TrascrizioneVideo_CaricaCopione.php", Parametri, Funzione, MessaggioIniziale, MessaggioFinale, true);
}

function PartenzaProgramma() {
	//VideoGuidaPosizionati(document.getElementById('divContenitoreVideoGuida').dataset.PosizioneInizialeVideo);
	document.getElementById('Attendere').style.display = "none"; AttivazioneSchermata();
}

function CreaNuovaTextarea(Minutaggio) {
    const NuovaTextarea = CreaElemento('textarea', 't' + Minutaggio, "ContenitoreTesto");
    NuovaTextarea.dataset.minutaggio = Minutaggio;
    return NuovaTextarea;
}

function AttivazioneSchermata() {
	AltreFunzioniRiabilitaSchermata();
	document.getElementById('divContenitoreVideoGuida').style.opacity = 1;
    document.getElementById('ContenitoreInfo').style.display = "inline";
	VideoGuidaPause();
}

AltreFunzioniDisabilitaSchermata = () => {AttivaVetro(true);};
AltreFunzioniRiabilitaSchermata  = () => {AttivaVetro(false);};

function AttivaVetro(Attiva) {
    divVetro.style.display = (Attiva? "inline" : "none");
}

function ScorriAFinePagina() {
	var AltezzaMassimaFinestra = Math.max(
						  document.body.scrollHeight, document.documentElement.scrollHeight,
						  document.body.offsetHeight, document.documentElement.offsetHeight,
						  document.body.clientHeight, document.documentElement.clientHeight
					   );
					   
	window.scrollTo(0, AltezzaMassimaFinestra);
}

CaricaCopione();

SP.style.zIndex = -10;