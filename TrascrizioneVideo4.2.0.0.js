const SP = document.getElementById('SceltaPersonaggi'), inputSceltaPersonaggio = document.getElementById('inputNomePersonaggio'), inputSecondiRiprendiVideo = document.getElementById('inputSecondiRiprendiVideo'), opzRiprendiVideoSecondi = document.getElementById('opzRiprendiVideoSecondi'), opzRiprendiDaInizioTextarea = document.getElementById('opzRiprendiDaInizioTextarea'), opzACapoPersonaggio = document.getElementById('opzACapoPersonaggio'), opzComparsaCopione = document.getElementById('opzComparsaCopione'), divVetro = document.getElementById('Vetro');
const BarraCaricamento = document.getElementById('ProgressoCaricamento'), ContornoBarraCaricamento = document.getElementById('BarraProgressoCaricamento');
var tmrSospendi, AutoRiproduzioneVideoAttiva = true, UltimaTextareaUtilizzata = false;

const SecondiRitornoIndietro = 2;

for (var NomeTasto in TastiIndicazioni) {
    const Contenuto = TastiIndicazioni[NomeTasto], pos_separatore = Contenuto.indexOf('|'), Testo = Contenuto.slice(0, pos_separatore), Descrizione = Contenuto.slice(pos_separatore + 1);
	const divTasto = CreaElemento('div', 'div' + NomeTasto, 'infoTasti', "<a class='btn btn-default btn-xs' style='pointer-events: none;' data-tasto='" + NomeTasto + "'><b>" + NomeTasto + "</b></a> " + Testo); divTasto.setAttribute('title', Descrizione); divTasto.dataset.tasto = NomeTasto; divTasto.className = 'btn btn-default';
          divTasto.onclick = (e) => {if (UltimaTextareaUtilizzata) {GestisciImmissioneTesto({currentTarget: UltimaTextareaUtilizzata, key: e.currentTarget.dataset.tasto}); UltimaTextareaUtilizzata.focus();}};
}

function Play() {VideoGuidaPlay(); VideoGuidaRimuoviEventoAlTermineCaricamento(Play);}

function Indietro(Secondi = false) {
	const Posizione = VideoGuidaMinutaggioCorrente() - Secondi;
	
	if (Posizione < 0) {VideoGuidaPosizionati(0);} else {VideoGuidaPosizionati(Posizione);}
}

function RiprendiDaPocoPrima(Secondi = SecondiRitornoIndietro) {
    if (AutoRiproduzioneVideoAttiva) {
        VideoGuidaImpostaEventoAlTermineCaricamento(Play);
        Indietro(Secondi);
        SalvaCopione();
    }
}

function RiprendiDaMinutaggioBloccoTesto(Textarea) {
    if (AutoRiproduzioneVideoAttiva && opzRiprendiVideoSecondi.checked) {
        if (opzRiprendiDaInizioTextarea.checked) {
            VideoGuidaImpostaEventoAlTermineCaricamento(Play);
            VideoGuidaPosizionati(Textarea.dataset.minutaggio);
        } else {
            VideoGuidaPlay();
        }
    }

    SalvaCopione(Textarea);
}

function SospendiRipresaVideo(T) {
     /* Sospende la ripresa video */
     AutoRiproduzioneVideoAttiva = false;
            
     /* Salva il testo */
     SalvaCopione(T);

     /* Sospende il video */
     clearTimeout(tmrSospendi); VideoGuidaPause();
}

function GestisciImmissioneTesto(e) {
	const T = e.currentTarget, PosizioneCursore = T.selectionStart;
    var nuovatextarea;

    if (Object.keys(TastiIndicazioni).includes(e.key)) {
        if (e.preventDefault) {e.preventDefault();}

        if (e.key = "F1") {
            /** Aggiunta personaggio **/
            /* Posiziona il cursore all'inizio del periodo */
            const StringaConsiderata = T.value.slice(0, T.selectionStart);
            T.selectionStart = T.selectionEnd = StringaConsiderata.lastIndexOf('\n') + 1;
            nuovatextarea = T;
            SospendiRipresaVideo(T);
            AttivaSceltaPersonaggio();
            return;
        }

        /** Aggiunta indicazione di doppiaggio **/
        const TestoIndicato = TastiIndicazioni[e.key];
        T.value = T.value.slice(0, PosizioneCursore) + ((PosizioneCursore > 0) ? " " : "") + TestoIndicato.slice(0, TestoIndicato.indexOf('|')) + " " + T.value.slice(PosizioneCursore); T.selectionStart = PosizioneCursore + TestoIndicato.length + 1; T.selectionEnd = T.selectionStart;
        return;
    }

    TestoPrec = T.value.trim();
	
	switch (e.key) {
		case "(": T.value = T.value.slice(0, PosizioneCursore) + ")" + T.value.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; return 2;
/*		case "[": T.value = T.value.slice(0, PosizioneCursore) + VisualizzaMinutaggioAttuale() + "] " + T.value.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; setTimeout(() => {T.selectionStart = T.selectionEnd = T.value.length;}, 100); return 2;
 		case "Control": if (e.location == 2) {RiprendiDaPocoPrima(6);}
		case "AltGraph": clearTimeout(tmrSospendi); break; */
        case "ArrowUp":   ((PosizioneCursore < 20) && (precedentetextarea = TrovaTextareaVicina(T, -1)) && (precedentetextarea.focus())); break;
        case "ArrowDown": ((PosizioneCursore > (T.value.length - 5))) && (textareasuccessiva = TrovaTextareaVicina(T, 1)) && (textareasuccessiva.focus()); break;
		case "Enter":
            /** Nuova sezione di testo **/
            SospendiRipresaVideo(T);

            /* Si posiziona o crea la textarea del minutaggio corrispondente e mette il focus su di essa */
            const MinutaggioCorrente = (VideoGuidaMinutaggioCorrente() | 0), Minutaggio = MinutaggioCorrente - (SecondiRitornoIndietro * (MinutaggioCorrente > SecondiRitornoIndietro));

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
                if (+Minutaggio <= ((+T.dataset.minutaggio) + (+SecondiRitornoIndietro))) {
                    nuovatextarea = T;
                    AttivaSceltaPersonaggio();
                } else {
                    AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(Minutaggio),
                        (Dati) => {
                            nuovatextarea = CreaNuovaTextarea(Dati.NumID, Minutaggio);
                            AttivaSceltaPersonaggio();
                        }, strAttenderePrego, strModificheSalvate
                    );
                }
            }
            break;
	}

    function AttivaSceltaPersonaggio() {
        if (!opzACapoPersonaggio.checked) {ScriviPersonaggio(nuovatextarea, ''); return;}

        VisualizzaBoxSceltaPersonaggio(true);
        inputSceltaPersonaggio.value = ""; setTimeout(() => {inputSceltaPersonaggio.focus();}, 100);

        AJAX("TrascrizioneVideo_CaricaListaPersonaggi.php", "N=" + encodeURIComponent(N), 
            (Dati) => {
                const Personaggi = Dati.ListaPersonaggi, totPersonaggi = Personaggi.length;
                var DatiPersonaggi = [];

                for (let I = 0; I < totPersonaggi; I++) {
                    DatiPersonaggi.push({nomedavisualizzare: Personaggi[I], altriRiferimenti: '', riferimentoPrincipale: Personaggi[I]});
                }

                CreaListaMenu(DatiPersonaggi, inputSceltaPersonaggio,
                    /* Selezione di un personaggio */
                    (Personaggio) => {ScriviPersonaggio(nuovatextarea, Personaggio);},
                    
                    /* Mancata selezione di un personaggio - riporta quello ev. scritto sul campo */
                    () => {
                        const NuovoPersonaggio = inputSceltaPersonaggio.value.replace(RegexNomePersonaggio_CaratteriNonAmmessi, '').slice(0, 25).trim();
                        ScriviPersonaggio(nuovatextarea, NuovoPersonaggio.charAt(0).toUpperCase() + NuovoPersonaggio.slice(1));
                        if (NuovoPersonaggio) {AJAX("TrascrizioneVideo_SalvaNuovoPersonaggio.php", "N=" + encodeURIComponent(N) + "&NomePersonaggio=" + encodeURIComponent(NuovoPersonaggio), "", "", "", true);}
                    },
                    
                    /* Cancellazione di un personaggio */
                    (PersonaggioDaCancellare) => {
                        if (confirm(strConfermaCancellaNomePersonaggio)) {AJAX("TrascrizioneVideo_EliminaPersonaggioDaLista.php", "N=" + encodeURIComponent(N) + "&NomePersonaggio=" + encodeURIComponent(PersonaggioDaCancellare), AttivaSceltaPersonaggio, "", "", true);}
                    }
                );
            }, "", "", true
        );
    }
		
    AggiornaTestoGuida_slow();
    
    /* Riprendi il video se il testo è stato modificato */
    setTimeout(() => {if (TestoPrec != T.value.trim()) {RiprendiVideoAutomaticamente(T);}}, 100);
}

async function ScriviPersonaggio(T, Personaggio) {
	const PosizioneCursore = T.selectionStart;
    var NuovaPosizioneCursore = PosizioneCursore;
	
    VisualizzaBoxSceltaPersonaggio(false);
		
    if (Personaggio) {
        T.value = T.value.slice(0, PosizioneCursore) + Personaggio + ": " + T.value.slice(PosizioneCursore);
        NuovaPosizioneCursore += (+Personaggio.length) + 2;
    }
	
	/* var Porzione = T.value.slice(0, T.value.indexOf('\nScena', PosizioneCursore)), strElencoPersonaggiNellaScena = "", strElencoPersonaggiPrecedente = "", ElencoPersonaggiNellaScena = [];
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
	console.log(T.selectionEnd, "Differenza caratteri personaggi scena:", strElencoPersonaggiNellaScena.length, strElencoPersonaggiPrecedente.length, strElencoPersonaggiPrecedente); */

    SalvaCopione(T);
    
    T.selectionStart = T.selectionEnd = NuovaPosizioneCursore;

    await pausa(100);
    T.focus();
    await pausa(300);
    VideoGuidaPlay();
    await pausa(100);
    AutoRiproduzioneVideoAttiva = true;
}

function VisualizzaMinutaggioAttuale() {
	const Minutaggio = new MinutiESecondi(VideoGuidaMinutaggioCorrente());
	return Minutaggio.Minuti + ":" + (Minutaggio.Secondi | 0).toString().padStart(2, "0");
}

function SalvaCopione(Textarea) {
    Textarea.value = Textarea.value.replace(/<+/g, '«').replace(/>+/g, '»').replace(/\\/g, '/'); AdattaAltezzaTextarea_MemorizzaTesto({currentTarget: Textarea}); AggiornaTestoGuida_slow();
	AJAX("TrascrizioneVideo_SalvaCopione.php", "NumID=" + encodeURIComponent(Textarea.dataset.numid) + "&N=" + encodeURIComponent(N) + "&Testo=" + encodeURIComponent(Textarea.value) + "&Minutaggio=" + encodeURIComponent(Textarea.dataset.minutaggio), "", "", strModificheSalvate, true);
}

function CaricaCopione(FunzioneAlTermine = () => {}) {
    DisabilitaSchermata();
    document.getElementById('divAJAX').append()
	AJAX("TrascrizioneVideo_CaricaCopione.php", "N=" + encodeURIComponent(N),
        async function (Dati) {
                const BlocchiDiTesto = Dati.BlocchiDiTesto, totBlocchiDiTesto = BlocchiDiTesto.length;
                
                setTimeout(() => {Messaggio(strCaricamentoInCorso); BarraCaricamento.style.opacity = 1; ContornoBarraCaricamento.style.opacity = 1; VisualizzaProgressoBarraCaricamento(BarraCaricamento, 0);}, 300);

                var textareaCreate = 0, tmr = setInterval(() => {VisualizzaProgressoBarraCaricamento(BarraCaricamento, textareaCreate / totBlocchiDiTesto);}, 2000);
                for (let I = 0; I < totBlocchiDiTesto; I++) {
                    const BT = BlocchiDiTesto[I];
                    const T = CreaNuovaTextarea(BT.Num, BT.Minutaggio);
                    T.value = BT.Testo;
                    T.selectionStart = T.value.length; T.selectionEnd = T.selectionStart;
                    MemorizzaTestoTextarea(T);
                    textareaCreate++;
                    await pausa(10);
                }
                clearInterval(tmr);

                if (totBlocchiDiTesto == 0) {
                    /** Pulsante per creare la prima textarea **/
                    document.getElementById('ContenitoreTesto').insertAdjacentHTML('beforeend', `<tr style='width: 100%;'><td id='tdContenitoreTesto' style='padding: 100px; width: 100%; text-align: center;'></td></tr>`);
                    const pulAvvia = CreaElemento('a', 'pulAvvia', 'tdContenitoreTesto', strPulAvvia); pulAvvia.className = "btn btn-primary btn-lg";
                    pulAvvia.onclick = (e) => {
                        const pulsante = e.currentTarget;
                        pulsante.abilita(false);
                        VideoGuidaPause();
                        AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(VideoGuidaMinutaggioCorrente()), 
                            () => {
                                document.getElementById('ContenitoreTesto').textContent = "";
                                CaricaCopione(() => {document.getElementsByTagName('textarea')[0].focus();});
                            }, strAttenderePrego, strModificheSalvate
                        );
                    };

                    /* Interlinea */
                    CreaElemento('div', 'br1tdContenitoreTesto', 'tdContenitoreTesto', "<br><br>");

                    /** Form per caricare file di sottotitoli **/
                    const Errori = {ErrCaricamento: str_err_CaricamentoSottotitoli, ErrTipo: str_err_TipoFileSottotitoli};
                    const divCaricaSottotitoli = CreaElemento('div', 'ContenitoreCaricaSottotitoli', 'tdContenitoreTesto', `<fieldset><legend>${strCaricaSottotitoli}</legend><div class='alert alert-danger'>${Errori[ErrCaricamentoSottotitoli]}</div><form id='frmFileSottotitoli' action="TrascrizioneCopione_CaricaSottotitoli.php" method="post" enctype='multipart/form-data'></form></fieldset>`); divCaricaSottotitoli.className = 'btn btn-default';
                        const inputFileSottotitoli = CreaElemento('input', 'inputFileSottotitoli', 'frmFileSottotitoli'); inputFileSottotitoli.setAttribute('type', 'file'); inputFileSottotitoli.setAttribute('name', 'Sottotitoli');
                        inputFileSottotitoli.onchange = () => {
                            CreaElementoInputNascosto('N', 'frmFileSottotitoli', N);
                            document.getElementById('frmFileSottotitoli').submit();
                        };
                        divCaricaSottotitoli.onclick = () => {inputFileSottotitoli.click();};

                } else {
                    // AdattaAltezzeTextarea();
                }

				//document.getElementById('divContenitoreVideoGuida').dataset.PosizioneInizialeVideo = Dati.PosizioneVideo;
                
                await pausa(500);

				FunzioneAlTermine();
			}, strCaricamentoInCorso, ""
	);
}

function PartenzaProgramma() {
    const LogoWEDUB = document.getElementById('LogoWEDUB'), divAJAX = document.getElementById('divAJAX');
    document.getElementById('divContenitoreVideoGuida').style.opacity = 1;
    document.getElementById('ContenitoreInfo').style.display = "inline";
    document.getElementById('InfoBrowser').style.display = "none";
    document.getElementById('pannelloContenitoreInfo').append(divAJAX); divAJAX.iStyle({position: "static", width: ""}); VisualizzaProgressoBarraCaricamento(BarraCaricamento, 1); setTimeout(() => {BarraCaricamento.style.opacity = 0; Messaggio(strCopioneCaricato, "OK");}, 1000);
    document.getElementById('divContenitorePrincipale').append(LogoWEDUB); LogoWEDUB.iStyle({top: '0px', right: '0px'});

	VideoGuidaPause();
    AttivaVetro(false);
}

function CreaNuovaTextarea(NumID, Minutaggio) {
    DatiCopione.push({NumID: NumID, minutaggio: Minutaggio, testo: ''});
    const NumRigo = (++CreaNuovaTextarea.num), MinutaggioMassimo = new MinutiESecondi(totDurataVideoGuida), MinutaggioAttuale = new MinutiESecondi(Minutaggio);
    const tr = CreaElemento('tr', 'RigoBloccoTesto' + NumRigo, "ContenitoreTesto");
            td = CreaElemento('td', 'tdInfoMinutaggio' + NumRigo, tr.id); td.iStyle({width: "100px", backgroundColor: "white", textAlign: "center", verticalAlign: "top", fontSize: "10px"});
                    /** Minutaggio **/
                    function VisualizzaSecondi(Secondi) {return Math.round(Secondi).toString().padStart(2, "0");}
                    function AggiornaMinutaggioTextarea(T, Minutaggio) {T.dataset.minutaggio = Minutaggio; TrovaDatiCopioneID(T.dataset.numid).minutaggio = Minutaggio;}
                    function AggiornaMinutaggio(e) {
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
                        sec.value = VisualizzaSecondi(MN.Secondi);

                        /* Aggiorna il minutaggio della textarea e salva */
                        AggiornaMinutaggioTextarea(T, MinutaggioNuovo);
                        clearTimeout(AggiornaMinutaggio.tmr);
                        AggiornaMinutaggio.tmr = setTimeout(() => {AJAX("TrascrizioneVideo_SalvaMinutaggio.php", "NumID=" + encodeURIComponent(sec.dataset.numid) + "&N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(MinutaggioNuovo), "", "", "", true);}, 1000);
                    }
                    AggiornaMinutaggio.tmr = false;

                    M = CreaElemento('input', 'MinutaggioMinuti' + NumRigo, td.id); M.setAttribute("type", "text"); M.readOnly = true; M.iStyle({width: "50px", textAlign: "right"});
                    M.setAttribute("min", "0"); M.setAttribute("max", MinutaggioMassimo.Minuti); M.setAttribute("step", "1");
                    M.value = MinutaggioAttuale.Minuti;
                    M.dataset.rifRigo = NumRigo;
            
                    CreaElemento('span', 'spandivisore' + NumRigo, td.id, ":");

                    S = CreaElemento('input', 'MinutaggioSecondi' + NumRigo, td.id); S.setAttribute("type", "number"); S.style.width = "40px";
                    S.setAttribute("min", "-1"); S.setAttribute("max", "60"); S.setAttribute("step", "1");
                    S.value = VisualizzaSecondi(MinutaggioAttuale.Secondi);
                    S.dataset.numid = NumID;
                    S.dataset.rifRigo = NumRigo;
                    S.addEventListener('change', AggiornaMinutaggio);

            td = CreaElemento('td', 'tdTesto' + NumRigo, tr.id);
                /** Textarea **/
                const NuovaTextarea = CreaElemento('textarea', 't' + NumRigo, td.id);
                NuovaTextarea.dataset.numid = NumID;
                NuovaTextarea.dataset.eliminata = "0";
                NuovaTextarea.dataset.minutaggio = Minutaggio;
                NuovaTextarea.dataset.rifRigo = NumRigo;
                EventiTextarea(NuovaTextarea, true);

    return NuovaTextarea;
}
CreaNuovaTextarea.num = 0;

function EventiTextarea(T, Attiva) {
    if (Attiva) {
        T.addEventListener('keydown', GestisciImmissioneTesto);
        T.addEventListener('keydown', EliminaBloccoTestoVuoto);
        T.addEventListener('input', AdattaAltezzaTextarea_MemorizzaTesto);
        T.addEventListener('focus', focusTextarea);
        T.addEventListener('blur',  blurTextarea);
    } else {
        T.removeEventListener('keydown', GestisciImmissioneTesto);
        T.removeEventListener('keydown', EliminaBloccoTestoVuoto);
        T.removeEventListener('input', AdattaAltezzaTextarea_MemorizzaTesto);
        T.removeEventListener('focus', focusTextarea);
        T.removeEventListener('blur',  blurTextarea);
    }
}

function RiprendiVideoAutomaticamente(Textarea) {
    VideoGuidaPause();
    clearTimeout(tmrSospendi);
    tmrSospendi = window.setTimeout(RiprendiDaMinutaggioBloccoTesto, inputSecondiRiprendiVideo.value * 1000, Textarea);
}

async function EliminaBloccoTestoVuoto(e) {
    const T = e.currentTarget;
    if (['Delete', 'Backspace'].includes(e.key) && (T.value == "") && (T.dataset.rifRigo > 1)) {
        document.getElementById('RigoBloccoTesto' + T.dataset.rifRigo).style.display = "none";
        T.dataset.eliminata = "1";
        AJAX("TrascrizioneVideo_EliminaBloccoTesto.php", "NumID=" + encodeURIComponent(T.dataset.numid) + "&N=" + encodeURIComponent(N), "", "", "", true);
        DatiCopione.splice(DatiCopione.indexOf(TrovaDatiCopioneID(T.dataset.numid)), 1);

        await pausa(10);
        TrovaTextareaVicina(T, -1).focus();
    }
}

function AdattaAltezzaTextarea_MemorizzaTesto(e) {
    const T = e.currentTarget;
    if (T.dataset.eliminata == "1") {return;}

    AdattaAltezzaTextarea(T);
    MemorizzaTestoTextarea(T);
}

function AdattaAltezzaTextarea(T) {
    /* Adatta altezza della textarea in base al suo contenuto */
    T.style.height = ""; T.style.height = T.scrollHeight + "px";
    document.getElementById('tdInfoMinutaggio' + T.dataset.rifRigo).style.height = T.style.height;
}

function MemorizzaTestoTextarea(T) {
    TrovaDatiCopioneID(T.dataset.numid).testo = T.value;
}

function focusTextarea(e) {
    const T = e.currentTarget;
    const MinutaggioCorrente = VideoGuidaMinutaggioCorrente(), MinutaggioPartenzaBloccoTesto = T.dataset.minutaggio;
    const textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});

    UltimaTextareaUtilizzata = T;

    AdattaAltezzaTextarea(T);

    /* Verifica se ci si trova all'interno del minutaggio cui si riferisce il blocco di testo, altrimenti si posiziona all'inizio del minutaggio */
    if ((MinutaggioPartenzaBloccoTesto <= MinutaggioCorrente) && (MinutaggioCorrente < textareasuccessiva.dataset.minutaggio)) {return;}

    PosizionatiAlMinutaggio(MinutaggioPartenzaBloccoTesto);
}

function blurTextarea(e) {
    UltimaTextareaUtilizzata = e.currentTarget;
}

function MettiFocusTextareaCorrispondente() {
    setTimeout(() => {
        if (GestioneBufferingVideo.BufferingInCorso) {return;}

        const MinutaggioCorrente = Math.round(VideoGuidaMinutaggioCorrente()), textarea = document.querySelectorAll("textarea[data-eliminata='0']"), totTextarea = textarea.length;
        for (let I = 0; I < totTextarea; I++) {
            const T = textarea[I], textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});
            if ((T.dataset.minutaggio <= MinutaggioCorrente) && (MinutaggioCorrente < textareasuccessiva.dataset.minutaggio) && (UltimaTextareaUtilizzata != T)) {T.focus(); break;}
        }
    
        setTimeout(() => {if (RiproduzioneInCorso) {FunzioniCopione.AttivaTestoGuida();}}, 1000);            
    }, 1000)
}

function PosizionatiAlMinutaggio(Minutaggio) {
    if (VideoGuidaMinutaggioCorrente() == Minutaggio) {MandaAdAggiornaTestoGuida(); return;}
    VideoGuidaImpostaEventoAlTermineCaricamento(MandaAdAggiornaTestoGuida);
    VideoGuidaPosizionati(Minutaggio);
}

function MandaAdAggiornaTestoGuida() {
    VideoGuidaRimuoviEventoAlTermineCaricamento(MandaAdAggiornaTestoGuida);
    FunzioniCopione.RiattivaCopione();
    AggiornaTestoGuida_slow();
    MettiFocusTextareaCorrispondente();
    setTimeout(() => {if (RiproduzioneInCorso) {FunzioniCopione.AttivaTestoGuida();}}, 1000);
}

function AggiornaTestoGuida_slow() {
    if (opzComparsaCopione.checked) {
        DatiCopione.sort((a, b) => {return a.minutaggio - b.minutaggio;});
        setTimeout(() => {FunzioniCopione.Visualizza(); FunzioniCopione.AggiornaTestoGuida();}, 500);
    }
}

function TrovaTextareaVicina(T, PosRelativa) {
    while (Rigo = (document.getElementById('RigoBloccoTesto' + ((+T.dataset.rifRigo) + (+PosRelativa))) || ({style: {display: ''}})).style.display == 'none') {PosRelativa = (+PosRelativa) + (+PosRelativa);}
    return document.getElementById('t' + ((+T.dataset.rifRigo) + (+PosRelativa)));
}

function AbilitaTextarea(Abilita) {
    const textarea = document.getElementsByTagName('textarea'), totTextarea = textarea.length;

    for (let I = 0; I < totTextarea; I++) {
        textarea[I].disabled = !Abilita;
    }   
}

function AttivaDisattivaComparsaCopione() {
    if (!opzComparsaCopione.checked) {FunzioniCopione.Scompari();}
}

function AttivaVetro(Attiva) {
    divVetro.style.display = (Attiva? "inline" : "none");
}

function VisualizzaBoxSceltaPersonaggio(Visualizza) {
    AttivaVetro(Visualizza);
    SP.iStyle({visibility: (Visualizza? "visible" : "hidden"), opacity: 1 * Visualizza});
}

function ScorriAFinePagina() {
	var AltezzaMassimaFinestra = Math.max(
						  document.body.scrollHeight, document.documentElement.scrollHeight,
						  document.body.offsetHeight, document.documentElement.offsetHeight,
						  document.body.clientHeight, document.documentElement.clientHeight
					   );
					   
	window.scrollTo(0, AltezzaMassimaFinestra);
}

FunzioneDopoInizializzazioneVideoGuida = () => {
    CaricaCopione(PartenzaProgramma);
    VideoGuidaImpostaEventoBuffering(GestioneBufferingVideo.AlBuffering, GestioneBufferingVideo.TerminatoBuffering);
};

var GestioneBufferingVideo = {
    AlBuffering: function () {
        FunzioniCopione.DisattivaTestoGuida();
        GestioneBufferingVideo.BufferingInCorso = true;
    },

    TerminatoBuffering: function () {
        MettiFocusTextareaCorrispondente();
        GestioneBufferingVideo.BufferingInCorso = false;
    },

    BufferingInCorso: false
};

AltreFunzioniPlayVideoGuida = () => {MettiFocusTextareaCorrispondente(); if (InizioVideo || FineVideo) {VerificaRiproduzioneSegmento(InizioVideo, FineVideo);}};
AltreFunzioniStopVideoGuida = FunzioniCopione.DisattivaTestoGuida;

FunzioneRaggiuntaFineVideo = () => {};

AltreFunzioniDisabilitaSchermata = () => {AbilitaTextarea(false);}
AltreFunzioniRiabilitaSchermata  = () => {AbilitaTextarea(true);}

/** Parametri copione **/
FunzioniCopione.FunzionePosizionaVideo = PosizionatiAlMinutaggio;
FunzioniCopione.ClasseEvidenziaBattuta = "TestoGuida-evidenziato";
/***********************/

async function AdattaAltezzeTextarea() {
    const textarea = document.getElementsByTagName('textarea'), totTextarea = textarea.length;

    for (let I = 0; I < totTextarea; I++) {
        AdattaAltezzaTextarea(textarea[I]);
        await pausa(10);
    }
}

window.onresize = () => {
    if (RidimensionaVideo) {setTimeout(() => {RidimensionaVideo();}, 500);}
    AdattaAltezzeTextarea();
};

AttivaVetro(true);