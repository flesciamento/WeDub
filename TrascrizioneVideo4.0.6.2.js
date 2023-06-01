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

function RiprendiDaMinutaggioBloccoTesto(Textarea) {
    VideoGuidaImpostaEventoAlTermineCaricamento(Play);
    VideoGuidaPosizionati(Textarea.dataset.minutaggio);
    SalvaCopione(Textarea);
}

function SospendiVideo(e) {
	const T = e.currentTarget, PosizioneCursore = T.selectionStart;
	clearTimeout(tmrSospendi);
	
	VideoGuidaPause();
	
	switch (e.key) {
		case "(": T.value = T.value.slice(0, PosizioneCursore) + ")" + T.value.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; return 2;
		case "[": T.value = T.value.slice(0, PosizioneCursore) + VisualizzaMinutaggioAttuale() + "] " + T.value.slice(PosizioneCursore); setTimeout(RiprendiDaPocoPrima, 1000); return 2;
/* 		case "Control": if (e.location == 2) {RiprendiDaPocoPrima(6);} */
		case "AltGraph": clearTimeout(tmrSospendi); break;
        case "ArrowUp":   ((PosizioneCursore < 20) && (precedentetextarea = TrovaTextareaVicina(T, -1)) && (precedentetextarea.focus())); break;
        case "ArrowDown": ((PosizioneCursore > (T.value.length - 5))) && (textareasuccessiva = TrovaTextareaVicina(T, 1)) && (textareasuccessiva.focus()); break;
		case "Enter":
            /** Nuova sezione di testo **/
            /* Salva il testo */
            SalvaCopione(T);

            /* Sospende il video */
            clearTimeout(tmrSospendi); VideoGuidaPause();

            /* Si posiziona o crea la textarea del minutaggio corrispondente e mette il focus su di essa */
            const MinutaggioCorrente = (VideoGuidaMinutaggioCorrente() | 0), Minutaggio = MinutaggioCorrente - (SecondiRitornoIndietro * (MinutaggioCorrente > SecondiRitornoIndietro));
            var nuovatextarea;

            function AttivaSceltaPersonaggio() {
                EventiTextarea(nuovatextarea, false);
        
                /* Visualizza la lista dei personaggi */
                SP.style.opacity = 1; SP.style.zIndex = 10;
        
                /* Visualizza la lista dei personaggi */
                AJAX("TrascrizioneVideo_CaricaListaPersonaggi.php", "N=" + encodeURIComponent(N), 
                    (Dati) => {
                        const Personaggi = Dati.ListaPersonaggi, totPersonaggi = Personaggi.length;
                        var DatiPersonaggi = [];
                        for (let I = 0; I < totPersonaggi; I++) {
                            DatiPersonaggi.push({nomedavisualizzare: Personaggi[I], altriRiferimenti: '', riferimentoPrincipale: Personaggi[I]});
                        }
                        CreaListaMenu(DatiPersonaggi, document.getElementById('inputNomePersonaggio'), (Personaggio) => {ScriviPersonaggio(nuovatextarea, Personaggio);}, () => {ScriviPersonaggio(nuovatextarea, '');});
                    }, "", ""
                );
            }


            if (textareasuccessiva = TrovaTextareaVicina(T, 1)) {
                if (Minutaggio < textareasuccessiva.dataset.minutaggio) {
                    nuovatextarea = T;
                    AttivaSceltaPersonaggio();
                } else {
                    nuovatextarea = textareasuccessiva;
                    nuovatextarea.value = "\n" + nuovatextarea.value;
                    nuovatextarea.selectionStart = nuovatextarea.selectionEnd = 0;
                    AttivaSceltaPersonaggio();
                }
            } else {
                if (+Minutaggio <= ((+T.dataset.minutaggio) + 2)) {
                    nuovatextarea = T;
                    AttivaSceltaPersonaggio();
                } else {
                    AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Testo=&Minutaggio=" + encodeURIComponent(Minutaggio),
                        (Dati) => {
                            nuovatextarea = CreaNuovaTextarea(Dati.NumID, Minutaggio);
                            AttivaSceltaPersonaggio();
                        }, strAttenderePrego, strModificheSalvate
                    );
                }
            }
            break;
	}
		
    AggiornaTestoGuida(T);
}

function ScriviPersonaggio(T, Personaggio) {
	const PosizioneCursore = T.selectionStart;
    var NuovaPosizioneCursore = PosizioneCursore;
	
	SP.style.opacity = 0; SP.style.zIndex = -10;
		
    if (Personaggio) {
        T.value = T.value.slice(0, PosizioneCursore) + Personaggio + ": " + T.value.slice(PosizioneCursore);
        NuovaPosizioneCursore += (+Personaggio.length) + 2;
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

    EventiTextarea(T, true);
    AdattaAltezzaTextarea({currentTarget: T});
    T.focus();

    setTimeout(VideoGuidaPlay, 300);
}

function AltriAutomatismiTastiera(e) {
	const T = e.currentTarget, PosizioneCursore = T.selectionStart;
	
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

function AggiornaTestoGuida(T) {
    TestoGuida.innerText = T.value.slice(0, +T.selectionStart + 200).slice(-600);
}

function VisualizzaMinutaggioAttuale() {
	const Minutaggio = new MinutiESecondi(VideoGuidaMinutaggioCorrente());
	return Minutaggio.Minuti + ":" + (Minutaggio.Secondi | 0).toString().padStart(2, "0");
}

function SalvaCopione(Textarea) {
	AJAX("TrascrizioneVideo_SalvaCopione.php", "NumID=" + encodeURIComponent(Textarea.dataset.numid) + "&N=" + encodeURIComponent(N) + "&Testo=" + encodeURIComponent(Textarea.value) + "&Minutaggio=" + encodeURIComponent(Textarea.dataset.minutaggio), "", "", strModificheSalvate);
}

function CaricaCopione(FunzioneAlTermine = () => {}) {
    DisabilitaSchermata();
	AJAX("TrascrizioneVideo_CaricaCopione.php", "N=" + encodeURIComponent(N),
        function (Dati) {
                const BlocchiDiTesto = Dati.BlocchiDiTesto, totBlocchiDiTesto = BlocchiDiTesto.length;
                for (let I = 0; I < totBlocchiDiTesto; I++) {
                    const BT = BlocchiDiTesto[I];
                    const T = CreaNuovaTextarea(BT.Num, BT.Minutaggio);
                    T.value = BT.Testo;
                    T.selectionStart = T.value.length; T.selectionEnd = T.selectionStart;
                    void T.offsetHeight;
                    AdattaAltezzaTextarea({currentTarget: T});
                }

                if (totBlocchiDiTesto == 0) {
                    const pulAvvia = CreaElemento('a', 'pulAvvia', 'ContenitoreTesto', strPulAvvia); pulAvvia.className = "btn btn-default";
                    pulAvvia.onclick = (e) => {
                        const pulsante = e.currentTarget;
                        pulsante.abilita(false);
                        VideoGuidaPause();
                        AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Testo=&Minutaggio=" + encodeURIComponent(VideoGuidaMinutaggioCorrente()), 
                            () => {
                                EliminaElemento(pulsante);
                                CaricaCopione(() => {document.getElementsByTagName('textarea')[0].focus();});
                            }, strAttenderePrego, strModificheSalvate
                        );
                    };
                }

				//document.getElementById('divContenitoreVideoGuida').dataset.PosizioneInizialeVideo = Dati.PosizioneVideo;
				FunzioneAlTermine();
			}, strCaricamentoInCorso, strCopioneCaricato
	);
}

function PartenzaProgramma() {
	//VideoGuidaPosizionati(document.getElementById('divContenitoreVideoGuida').dataset.PosizioneInizialeVideo);
	document.getElementById('Attendere').style.display = "none"; AttivazioneSchermata();
}

function CreaNuovaTextarea(NumID, Minutaggio) {
    const NumRigo = (++CreaNuovaTextarea.num), MinutaggioMassimo = new MinutiESecondi(totDurataVideoGuida), MinutaggioAttuale = new MinutiESecondi(Minutaggio);
    const tr = CreaElemento('tr', 'tr' + NumRigo, "ContenitoreTesto");
            td = CreaElemento('td', 'tdInfoMinutaggio' + NumRigo, tr.id); td.iStyle({width: "100px", backgroundColor: "white", textAlign: "center", verticalAlign: "top", fontSize: "10px"});
                    M = CreaElemento('input', 'MinutaggioMinuti' + NumRigo, td.id); M.setAttribute("type", "text"); M.readOnly = true; M.iStyle({width: "50px", textAlign: "right"});
                    M.setAttribute("min", "0"); M.setAttribute("max", MinutaggioMassimo.Minuti); M.setAttribute("step", "1");
                    M.value = MinutaggioAttuale.Minuti;
                    M.dataset.rifRigo = NumRigo;
                    /* M.addEventListener("change", ...); */
            
                    CreaElemento('span', 'spandivisore' + NumRigo, td.id, ":");
                
                    S = CreaElemento('input', 'MinutaggioSecondi' + NumRigo, td.id); S.setAttribute("type", "number"); S.style.width = "40px";
                    S.setAttribute("min", "-1"); S.setAttribute("max", "60"); S.setAttribute("step", "1");
                    S.value = Math.round(MinutaggioAttuale.Secondi);
                    S.dataset.numid = NumID;
                    S.dataset.rifRigo = NumRigo;
                    S.addEventListener('change', (e) => {
                        const sec = e.currentTarget, min = document.getElementById('MinutaggioMinuti' + sec.dataset.rifRigo), minutosuccessivo = (sec.value > 59), minutoprecedente = (sec.value < 0);

                        /* Sale o scende il minuto in automatico, agendo solo sui secondi */
                        if (minutosuccessivo || minutoprecedente) {
                            min.value = (+min.value) + (1 + (-2 * minutoprecedente));
                            sec.value = 59 * minutoprecedente;
                        }

                        /* Verifica di rimanere nel range del minutaggio del blocco considerato */
                        var MinutaggioNuovo = ((min.value * 60) + (+sec.value));
                        const T = document.getElementById('t' + sec.dataset.rifRigo), textareaprecedente = TrovaTextareaVicina(T, -1) || ({dataset: {minutaggio: -2}}), textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});
                        const LimiteMinimo = +textareaprecedente.dataset.minutaggio + 2, LimiteMinimoRispettato = (LimiteMinimo < MinutaggioNuovo), LimiteMassimo = +textareasuccessiva.dataset.minutaggio - 1, LimiteMassimoRispettato = (MinutaggioNuovo < LimiteMassimo);
                        MinutaggioNuovo = MinutaggioNuovo * (LimiteMinimoRispettato * LimiteMassimoRispettato) + (LimiteMinimo * !LimiteMinimoRispettato) + (LimiteMassimo * !LimiteMassimoRispettato);
                        const MN = new MinutiESecondi(MinutaggioNuovo);
                        min.value = MN.Minuti;
                        sec.value = Math.round(MN.Secondi);

                    })
                    /* S.addEventListener("change", ...); */

            td = CreaElemento('td', 'tdTesto' + NumRigo, tr.id);
                const NuovaTextarea = CreaElemento('textarea', 't' + NumRigo, td.id);
                NuovaTextarea.dataset.numid = NumID;
                NuovaTextarea.dataset.minutaggio = Minutaggio;
                NuovaTextarea.dataset.rifRigo = NumRigo;
                EventiTextarea(NuovaTextarea, true);

    return NuovaTextarea;
}
CreaNuovaTextarea.num = 0;

function EventiTextarea(T, Attiva) {
    if (Attiva) {
        T.addEventListener('keydown', SospendiVideo);
        T.addEventListener('keydown', AltriAutomatismiTastiera);
        T.addEventListener('input', RiprendiVideoAutomaticamente);
        T.addEventListener('input', AdattaAltezzaTextarea);
        T.addEventListener('focus', focusTextarea);
    } else {
        T.removeEventListener('keydown', SospendiVideo);
        T.removeEventListener('keydown', AltriAutomatismiTastiera);
        T.removeEventListener('input', RiprendiVideoAutomaticamente);
        T.removeEventListener('input', AdattaAltezzaTextarea);
        T.removeEventListener('focus', focusTextarea);
    }
}

function RiprendiVideoAutomaticamente(e) {
    clearTimeout(tmrSospendi);
    tmrSospendi = window.setTimeout(RiprendiDaMinutaggioBloccoTesto, MillisecondiRiprendiVideo, e.currentTarget);
}

function AdattaAltezzaTextarea(e) {
    const T = e.currentTarget;
    T.style.height = ""; T.style.height = T.scrollHeight + "px";
    document.getElementById('tdInfoMinutaggio' + T.dataset.rifRigo).style.height = T.style.height;
}

function focusTextarea(e) {
    const T = e.currentTarget;
    const MinutaggioCorrente = VideoGuidaMinutaggioCorrente(), MinutaggioPartenzaBloccoTesto = T.dataset.minutaggio;
    const textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: +MinutaggioPartenzaBloccoTesto + 10}});

    AggiornaTestoGuida(T);

    /* Verifica se ci si trova all'interno del minutaggio cui si riferisce il blocco di testo, altrimenti si posiziona all'inizio del minutaggio */
    if ((MinutaggioPartenzaBloccoTesto <= MinutaggioCorrente) && (MinutaggioCorrente <= textareasuccessiva.dataset.minutaggio)) {return;}

    VideoGuidaPosizionati(MinutaggioPartenzaBloccoTesto);
}

function TrovaTextareaVicina(T, PosRelativa) {
    return document.getElementById('t' + (+T.dataset.rifRigo + PosRelativa));
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

FunzioneDopoInizializzazioneVideoGuida = () => {CaricaCopione(PartenzaProgramma);};

SP.style.zIndex = -10;
