const SP = document.getElementById('SceltaPersonaggi'), inputSceltaPersonaggio = document.getElementById('inputNomePersonaggio'), inputSecondiRiprendiVideo = document.getElementById('inputSecondiRiprendiVideo'), opzRiprendiVideoSecondi = document.getElementById('opzRiprendiVideoSecondi'), opzRiprendiDaInizioTextarea = document.getElementById('opzRiprendiDaInizioTextarea'), opzACapoPersonaggio = document.getElementById('opzACapoPersonaggio'), opzComparsaCopione = document.getElementById('opzComparsaCopione'), divContenitoreTesto = document.getElementById('divContenitoreTesto'), divtestaltezza = document.getElementById('divtestaltezza'), divVetro = document.getElementById('Vetro');
const BarraCaricamento = document.getElementById('ProgressoCaricamento'), ContornoBarraCaricamento = document.getElementById('BarraProgressoCaricamento');
var tmrSospendi, AutoRiproduzioneVideoAttiva = true, UltimaTextareaUtilizzata = false, UltimaPosizioneCursore = 0;

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

function SospendiRipresaVideo(T, Salva = true) {
     /* Sospende la ripresa video */
     AutoRiproduzioneVideoAttiva = false;
            
     /* Salva il testo */
     if (Salva) {SalvaCopione(T);}

     /* Sospende il video */
     clearTimeout(tmrSospendi); VideoGuidaPause();
}

function GestisciImmissioneTesto(e) {
	const ElementoAttuale = e.currentTarget, T = ElementoAttuale.parentElement.parentElement, InfoCursore = PosizioneDelCursore(), NodoAttuale = InfoCursore.nodo;
    var nuovatextarea, PosizioneCursore = InfoCursore.p;

    clearTimeout(AggiornaTestoGuida_slow.tmr);

    function MandaA_AttivaSceltaPersonaggio() {
        AttivaSceltaPersonaggio(nuovatextarea, ScriviPersonaggio);
    }

    
    if (Object.keys(TastiIndicazioni).includes(e.key)) {
        if (e.preventDefault) {e.preventDefault();}

        if (e.key == "F1") {
            /** Aggiunta personaggio **/
            if ((InfoCursore.nodo.previousElementSibling?.tagName != "BR") && (ElementoAttuale.previousElementSibling?.previousElementSibling?.tagName == "B")) {
                /* Se il personaggio c'era già, manda alla funzione per sostituirlo */
                FunzioniCopione.FunzioneModificaPersonaggio({currentTarget: ElementoAttuale.previousElementSibling.previousElementSibling});

            } else {
                /* Mette il cursore all'inizio e fa partire la scelta del personaggio */
                PosizionaCursore(NodoAttuale, 0);
                SospendiRipresaVideo(T);
                nuovatextarea = T;
                MandaA_AttivaSceltaPersonaggio();
            }
            return;
        }

        /** Aggiunta indicazione di doppiaggio **/
        const TestoIndicato = TastiIndicazioni[e.key];
        ElementoAttuale.textContent = ElementoAttuale.textContent.slice(0, PosizioneCursore) + ((PosizioneCursore > 0) ? " " : "") + TestoIndicato.slice(0, TestoIndicato.indexOf('|')) + " " + ElementoAttuale.textContent.slice(PosizioneCursore); PosizionaCursore(ElementoAttuale, PosizioneCursore) + TestoIndicato.length + 1;
        SalvaCopione(T);
        return;
    }

    TestoPrec = T.textContent.trim();
	
	switch (e.key) {
		case "(": T.innerHTML = T.innerHTML.slice(0, PosizioneCursore) + ")" + T.innerHTML.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; return 2;
/*		case "[": T.innerHTML = T.innerHTML.slice(0, PosizioneCursore) + VisualizzaMinutaggioAttuale() + "] " + T.innerHTML.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; setTimeout(() => {T.selectionStart = T.selectionEnd = T.innerHTML.length;}, 100); return 2;
 		case "Control": if (e.location == 2) {RiprendiDaPocoPrima(6);}
		case "AltGraph": clearTimeout(tmrSospendi); break; */
        case "ArrowUp":   ((NumeroNodo(InfoCursore.T, NodoAttuale) == 0) && (precedentetextarea = T.previousElementSibling) && (precedentetextarea.lastElementChild.focus())); break;
        case "ArrowDown": ((NumeroNodo(InfoCursore.T, NodoAttuale) == (InfoCursore.T.childNodes.length - 1)) && (textareasuccessiva = T.nextElementSibling) && (textareasuccessiva.focus())); break;

        case "Delete":
        case "Backspace":
            if (T.innerText.trim() == "") {
                AJAX("TrascrizioneVideo_EliminaBloccoTesto.php", "NumID=" + encodeURIComponent(T.dataset.numid) + "&N=" + encodeURIComponent(N), () => {CaricaCopione(FunzioniCopione.AggiornaTestoGuida);}, "", "", true);
            }
            break;

		case "Enter":
            /** Nuova sezione di testo **/
            SospendiRipresaVideo(T);

            e.preventDefault();

            /* Si posiziona o crea la textarea del minutaggio corrispondente e mette il focus su di essa */
            const MinutaggioCorrente = (VideoGuidaMinutaggioCorrente() | 0), Minutaggio = MinutaggioCorrente - (SecondiRitornoIndietro * (MinutaggioCorrente > SecondiRitornoIndietro));
            const DatiTestoAttuale = TrovaDatiCopioneID(T.dataset.numid), DatiTestoSuccessivo = DatiCopione[DatiCopione.indexOf(DatiTestoAttuale) + 1];
            
            if (DatiTestoSuccessivo) {
                nuovatextarea = T;
                MandaA_AttivaSceltaPersonaggio();

            } else {
                if (+Minutaggio <= ((+T.dataset.minutaggio) + (+SecondiRitornoIndietro))) {
                    nuovatextarea = T;
                    MandaA_AttivaSceltaPersonaggio();

                } else {
                    AggiungiNuovoMinutaggio(Minutaggio);
                }
            }
            return;
	}
		
    /* AggiornaTestoGuida_slow(); */
    
    /* Riprendi il video se il testo è stato modificato */
    setTimeout(() => {if (TestoPrec != T.textContent.trim()) {RiprendiVideoAutomaticamente(T);}}, 100);
}

function AggiungiNuovoMinutaggio(Minutaggio) {
    AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(Minutaggio),
        (Dati) => {
            DatiCopione.push({NumID: Dati.NumID, minutaggio: Minutaggio, testo: ' '});
            FunzioniCopione.Visualizza();
            FocusNuovoMinutaggio(Dati.NumID);
        }, strAttenderePrego, strModificheSalvate
    );
}

function FocusNuovoMinutaggio(NumID) {
    const T = document.getElementById('RifCopione' + NumID), contenitoretesto = T.children[0].children[0];
    contenitoretesto.children[0].insertAdjacentText('afterend', ' ');
    PosizionaCursore(contenitoretesto.childNodes[1], 0);
    AttivaSceltaPersonaggio(T, ScriviPersonaggioNuovaTextarea);
}

async function AttivaSceltaPersonaggio(T, FunzioneAllaSceltaPersonaggio) {
    UltimaPosizioneCursore = PosizioneDelCursore();

    await pausa(100);

    if (!opzACapoPersonaggio.checked) {FunzioneAllaSceltaPersonaggio(T, ''); return;}

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
                (Personaggio) => {FunzioneAllaSceltaPersonaggio(T, Personaggio);},
                
                /* Mancata selezione di un personaggio - riporta quello ev. scritto sul campo */
                () => {
                    const NuovoPersonaggio = inputSceltaPersonaggio.value.replace(RegexNomePersonaggio_CaratteriNonAmmessi, '').slice(0, 25).trim();
                    FunzioneAllaSceltaPersonaggio(T, NuovoPersonaggio.charAt(0).toUpperCase() + NuovoPersonaggio.slice(1));
                    if (NuovoPersonaggio) {AJAX("TrascrizioneVideo_SalvaNuovoPersonaggio.php", "N=" + encodeURIComponent(N) + "&NomePersonaggio=" + encodeURIComponent(NuovoPersonaggio), "", "", "", true);}
                },
                
                /* Cancellazione di un personaggio */
                (PersonaggioDaCancellare) => {
                    if (confirm(strConfermaCancellaNomePersonaggio)) {AJAX("TrascrizioneVideo_EliminaPersonaggioDaLista.php", "N=" + encodeURIComponent(N) + "&NomePersonaggio=" + encodeURIComponent(PersonaggioDaCancellare), () => {AttivaSceltaPersonaggio(T, FunzioneAllaSceltaPersonaggio);}, "", "", true);}
                }
            );
        }, "", "", true
    );
}

async function ScriviPersonaggio(T, Personaggio) {
    VisualizzaBoxSceltaPersonaggio(false);

    await pausa(100);

    /* var NuovaPosizioneCursore = UltimaPosizioneCursore.p, NodoCursore = UltimaPosizioneCursore.T.childNodes[UltimaPosizioneCursore.numeroNodo];  */
	
    const NodoCursore = UltimaPosizioneCursore.nodo, PosizioneCursore = UltimaPosizioneCursore.p, span = NodoCursore.parentElement, NumNodo = NumeroNodo(span, NodoCursore), totNodi = span.childNodes.length;

    var RigaCompleta = "";
    for (let I = NumNodo; I < totNodi; I++) {
        RigaCompleta += span.childNodes[I].textContent || "<br>";
    }

    const TestoPrimaInvio = RigaCompleta.slice(0, PosizioneCursore), TestoDopoInvio = RigaCompleta.slice(PosizioneCursore) || " ";
    NodoCursore.textContent = TestoPrimaInvio;

    if (Personaggio) {    
        span.parentElement.insertAdjacentElement('afterend', br = document.createElement('br'));
        br.insertAdjacentElement('afterend', s = document.createElement('span'));
        s.append(s2 = document.createElement('span'));
        s2.innerHTML = `${Personaggio}: ${TestoDopoInvio}`;
        PosizionaCursore(s2.childNodes[0], 0);
         
    } else {
        const br = document.createElement('br');

        if (NumNodo < (totNodi - 1)) {
            span.insertBefore(br, span.childNodes[NumNodo + 1]);
        } else {
            span.append(br);
        }
        
        br.insertAdjacentText('afterend', TestoDopoInvio.slice(0, (TestoDopoInvio + "<br>").indexOf('<br>')));
        PosizionaCursore(span.childNodes[NumNodo + 2], 0);
    }

    SalvaCopione(T, (Personaggio != ""));

    OperazioniAlTermineSceltaPersonaggio(Personaggio);
}

async function ScriviPersonaggioNuovaTextarea(T, Personaggio) {
    VisualizzaBoxSceltaPersonaggio(false);

    await pausa(100);

    const NodoCursore = UltimaPosizioneCursore.nodo;

    if (Personaggio) {
        NodoCursore.textContent = `${Personaggio}:  `;
    } else {
        await pausa(100);
        T.querySelector("[contenteditable='true']").focus();
    }

    SalvaCopione(T, (Personaggio != ""));

    OperazioniAlTermineSceltaPersonaggio(Personaggio);
}

async function OperazioniAlTermineSceltaPersonaggio(Personaggio) {
    await pausa(300);
    if (opzRiprendiVideoSecondi.checked && Personaggio) {VideoGuidaPlay();}
    await pausa(100);
    AutoRiproduzioneVideoAttiva = true;
}


function ModificaPersonaggio(T, Personaggio) {
    VisualizzaBoxSceltaPersonaggio(false);

    if (Personaggio) {
        T.textContent = Personaggio;

    } else {
        if (confirm(strVuoiEliminarePersonaggio)) {T.textContent = ''; T.nextElementSibling.textContent = '';} else {return;}
    }

    SalvaCopione(T.parentElement.parentElement);
}

function VisualizzaMinutaggioAttuale() {
	const Minutaggio = new MinutiESecondi(VideoGuidaMinutaggioCorrente());
	return Minutaggio.Minuti + ":" + (Minutaggio.Secondi | 0).toString().padStart(2, "0");
}

function SalvaCopione(Textarea, AggiornaTesto = false) {
    /* var Testo = "";
    Textarea.childNodes.forEach((n) => {if (n.tagName != "BR") {Testo += n.textContent + "<br>";}});
    Testo = Testo.slice(0, -4); */
    const Testo = Textarea.innerText.trim(), NumID = Textarea.dataset.numid;
    console.log(Textarea, Testo, NumID);
    TrovaDatiCopioneID(NumID).testo = Testo;

    if (AggiornaTesto) {
        const ID_ElementoContenitore = Textarea.id, InfoCursore = PosizioneDelCursore(), NumeroChildren = Array.from(Textarea.children).indexOf(InfoCursore.nodo.parentElement.parentElement);

        console.log(Textarea.innerHTML, ID_ElementoContenitore, InfoCursore, NumeroChildren);

        FunzioniCopione.Visualizza();

        let s = document.getElementById(ID_ElementoContenitore).children[NumeroChildren], spanContenitoreTestoAggiornato;
        spanContenitoreTestoAggiornato = (s? s : document.getElementById(ID_ElementoContenitore).lastElementChild);
        spanContenitoreTestoAggiornato.querySelector("[contenteditable='true']").focus();
    }
/*     const c = PosizioneDelCursore(), NumNodo = NumeroNodoCursore(c.T, c.nodo);
    Textarea.innerHTML = Testo;
    if (c.T == Textarea) {PosizionaCursore(c.T.childNodes[NumNodo], c.p);} // Rimette il cursore dov'era. Ritrova il nodo attraverso il numero.
 */    
    /* Textarea.textContent = Textarea.textContent.replace(/<+/g, '«').replace(/>+/g, '»').replace(/\\/g, '/');   AdattaAltezzaTextarea_MemorizzaTesto({currentTarget: Textarea});*/ /*  AggiornaTestoGuida_slow(); */
	/* AJAX("TrascrizioneVideo_SalvaCopione-unstable.php", "NumID=" + encodeURIComponent(NumID) + "&N=" + encodeURIComponent(N) + "&Testo=" + encodeURIComponent(Testo) + "&Minutaggio=" + encodeURIComponent(Textarea.dataset.minutaggio), "", "", strModificheSalvate, true); */
}

function CaricaCopione(FunzioneAlTermine = () => {}) {
    DisabilitaSchermata();
	AJAX("TrascrizioneVideo_CaricaCopione.php", "N=" + encodeURIComponent(N),
        async function (Dati) {
                const BlocchiDiTesto = Dati.BlocchiDiTesto, totBlocchiDiTesto = BlocchiDiTesto.length;

                /* var textareaCreate = 0, tmr = setInterval(() => {VisualizzaProgressoBarraCaricamento(BarraCaricamento, textareaCreate / totBlocchiDiTesto);}, 2000); */
                DatiCopione = [];
                for (let I = 0; I < totBlocchiDiTesto; I++) {
                    const BT = BlocchiDiTesto[I];
                    DatiCopione.push({NumID: BT.Num, minutaggio: BT.Minutaggio, testo: BT.Testo});
/*                     const T = CreaNuovaTextarea(BT.Num, BT.Minutaggio);
                    T.innerHTML = BT.Testo;
                    MemorizzaTestoTextarea(T);
                    textareaCreate++;
                    
                   await pausa(10); */
                }
                

                if (totBlocchiDiTesto == 0) {
                    /** Pulsante per creare la prima textarea **/
                    const divContenitoreID = 'divContenitoreOpzioniIniziali';
                    document.getElementById('ContenitoreTesto').insertAdjacentHTML('beforeend', `<div id='${divContenitoreID}' style='padding: 100px; width: 100%; text-align: center;'></div>`);
                    const pulAvvia = CreaElemento('a', 'pulAvvia', divContenitoreID, strPulAvvia); pulAvvia.className = "btn btn-primary btn-lg";
                    pulAvvia.onclick = (e) => {
                        const pulsante = e.currentTarget;
                        pulsante.abilita(false);
                        VideoGuidaPause();
                        const Minutaggio = VideoGuidaMinutaggioCorrente();
                        AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(Minutaggio), 
                            () => {
                                document.getElementById('ContenitoreTesto').textContent = "";
                                CaricaCopione(() => {
                                    DatiCopione[0].testo = ' ';
                                    FocusNuovoMinutaggio(DatiCopione[0].NumID);
                                })
                            }, strAttenderePrego, strModificheSalvate
                        );
                    };

                    /* Interlinea */
                    CreaElemento('div', 'br1tdContenitoreTesto', divContenitoreID, "<br><br>");

                    /** Form per caricare file di sottotitoli **/
                    const Errori = {ErrCaricamento: str_err_CaricamentoSottotitoli, ErrTipo: str_err_TipoFileSottotitoli};
                    const divCaricaSottotitoli = CreaElemento('div', 'ContenitoreCaricaSottotitoli', divContenitoreID, `<fieldset><legend>${strCaricaSottotitoli}</legend>${(ErrCaricamentoSottotitoli? "<div class='alert alert-danger'>" + (Errori[ErrCaricamentoSottotitoli] || "") + "</div>" : "")}<form id='frmFileSottotitoli' action="TrascrizioneCopione_CaricaSottotitoli.php" method="post" enctype='multipart/form-data'></form></fieldset>`); divCaricaSottotitoli.className = 'btn btn-default';
                        const inputFileSottotitoli = CreaElemento('input', 'inputFileSottotitoli', 'frmFileSottotitoli'); inputFileSottotitoli.setAttribute('type', 'file'); inputFileSottotitoli.setAttribute('name', 'Sottotitoli');
                        inputFileSottotitoli.onchange = () => {
                            CreaElementoInputNascosto('N', 'frmFileSottotitoli', N);
                            document.getElementById('frmFileSottotitoli').submit();
                        };
                        divCaricaSottotitoli.onclick = () => {inputFileSottotitoli.click();};

                } else {
                    FunzioniCopione.Visualizza();
                    ContenitoreTestoGuida.iStyle({top: "60%", left: "0%", right: "0%", bottom: "0%"});
                }

				//document.getElementById('divContenitoreVideoGuida').dataset.PosizioneInizialeVideo = Dati.PosizioneVideo;
                
                await pausa(500);

				FunzioneAlTermine();
			}, strCaricamentoInCorso, strCopioneCaricato
	);
}

function PartenzaProgramma() {
    const LogoWEDUB = document.getElementById('LogoWEDUB'), divAJAX = document.getElementById('divAJAX');
    document.getElementById('divContenitoreVideoGuida').style.opacity = 1;
    document.getElementById('ContenitoreInfo').style.display = "inline";
    document.getElementById('InfoBrowser').style.display = "none";
    document.getElementById('pannelloContenitoreInfo').append(divAJAX); divAJAX.iStyle({position: "static", width: ""}); VisualizzaProgressoBarraCaricamento(BarraCaricamento, 1); setTimeout(() => {BarraCaricamento.style.opacity = 0;}, 1000);
    document.getElementById('divContenitorePrincipale').append(LogoWEDUB); LogoWEDUB.iStyle({top: '0px', right: '0px'});

	VideoGuidaPause();
    AttivaVetro(false);
}

function CreaNuovaTextarea(NumID, Minutaggio) {
    DatiCopione.push({NumID: NumID, minutaggio: Minutaggio, testo: ''});
    const NumRigo = (++CreaNuovaTextarea.num), MinutaggioAttuale = new MinutiESecondi(Minutaggio);
    const Rigo = CreaElemento('div', 'RigoBloccoTesto' + NumRigo, "ContenitoreTesto"); Rigo.style.backgroundColor = "white";
            
            /** Minutaggio **/
            im = CreaElemento('div', 'divInfoMinutaggio' + NumRigo, Rigo.id); im.className = "colonna-minutaggio";
                const contenitorems = CreaElemento('div', 'divcontenitorems' + NumRigo, im.id); contenitorems.className = "contenitore-minuti-secondi";
                    M = CreaElemento('span', 'MinutaggioMinuti' + NumRigo, contenitorems.id, MinutaggioAttuale.Minuti || "0"); M.style.textAlign = "right";
                        CreaElemento('span', 'spandivisore' + NumRigo, contenitorems.id, ":");
                    S = CreaElemento('span', 'MinutaggioSecondi' + NumRigo, contenitorems.id, VisualizzaSecondi(MinutaggioAttuale.Secondi));
                
                fs = CreaElemento('span', 'freccias' + NumRigo, im.id); fs.className = "btn btn-default btn-xs fa fa-arrow-up";   fs.iStyle({fontSize: "6px", float: "right"}); fs.dataset.rifRigo = NumRigo; fs.dataset.differenza = 1;  fs.dataset.numid = NumID; fs.onclick = AggiornaMinutaggio;
                fg = CreaElemento('span', 'frecciag' + NumRigo, im.id); fg.className = "btn btn-default btn-xs fa fa-arrow-down"; fg.iStyle({fontSize: "6px", float: "right"}); fg.dataset.rifRigo = NumRigo; fg.dataset.differenza = -1; fg.dataset.numid = NumID; fg.onclick = AggiornaMinutaggio;

            /** Textarea **/
            const NuovaTextarea = CreaElemento('div', 't' + NumRigo, Rigo.id);
            NuovaTextarea.className = 'testo';
            NuovaTextarea.contentEditable = true;
            NuovaTextarea.dataset.numid = NumID;
            NuovaTextarea.dataset.eliminata = "0";
            NuovaTextarea.dataset.minutaggio = Minutaggio;
            NuovaTextarea.dataset.rifRigo = NumRigo;
            EventiTextarea(NuovaTextarea, true);
            
            CreaElemento('div', 'chiusurariga' + NumRigo, Rigo.id).style.clear = "both";

    return NuovaTextarea;
}
CreaNuovaTextarea.num = 0;

function VisualizzaSecondi(Secondi) {return Math.round(Secondi).toString().padStart(2, "0");}

function AggiornaMinutaggioTextarea(T, Minutaggio) {T.dataset.minutaggio = Minutaggio; TrovaDatiCopioneID(T.dataset.numid).minutaggio = Minutaggio;}

function AggiornaMinutaggio(e) {
    const frecciapremuta = e.currentTarget, sec = document.getElementById('MinutaggioSecondi' + frecciapremuta.dataset.rifRigo), min = document.getElementById('MinutaggioMinuti' + frecciapremuta.dataset.rifRigo);
    sec.textContent = (+sec.textContent) + (+frecciapremuta.dataset.differenza);
    const minutosuccessivo = (sec.textContent > 59), minutoprecedente = (sec.textContent < 0);

    /* Sale o scende il minuto in automatico, agendo solo sui secondi */
    if (minutosuccessivo || minutoprecedente) {
        min.textContent = (+min.textContent) + (1 + (-2 * minutoprecedente));
        sec.textContent = 59 * minutoprecedente;
    }

    /* Verifica di rimanere nel range del minutaggio del blocco considerato */
    var MinutaggioNuovo = ((min.textContent * 60) + (+sec.textContent));
    const T = document.getElementById('t' + frecciapremuta.dataset.rifRigo), textareaprecedente = TrovaTextareaVicina(T, -1) || ({dataset: {minutaggio: -2}}), textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});
    const LimiteMinimo = +textareaprecedente.dataset.minutaggio + 2, LimiteMinimoRispettato = (LimiteMinimo < MinutaggioNuovo), LimiteMassimo = +textareasuccessiva.dataset.minutaggio - 1, LimiteMassimoRispettato = (MinutaggioNuovo < LimiteMassimo);
    MinutaggioNuovo = MinutaggioNuovo * (LimiteMinimoRispettato * LimiteMassimoRispettato) + (LimiteMinimo * !LimiteMinimoRispettato) + (LimiteMassimo * !LimiteMassimoRispettato);
    const MN = new MinutiESecondi(MinutaggioNuovo);
    min.textContent = MN.Minuti;
    sec.textContent = VisualizzaSecondi(MN.Secondi);

    /* Aggiorna il minutaggio della textarea e salva */
    AggiornaMinutaggioTextarea(T, MinutaggioNuovo);
    clearTimeout(AggiornaMinutaggio.tmr);
    AggiornaMinutaggio.tmr = setTimeout(() => {AJAX("TrascrizioneVideo_SalvaMinutaggio.php", "NumID=" + encodeURIComponent(frecciapremuta.dataset.numid) + "&N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(MinutaggioNuovo), "", "", "", true);}, 1000);
}
AggiornaMinutaggio.tmr = false;


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
    if (['Delete', 'Backspace'].includes(e.key) && (T.innerHTML == "") && (T.dataset.rifRigo > 1)) {
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
    /* Adatta l'altezza della textarea in base al suo contenuto 
    divtestaltezza.innerHTML = T.value.replace(/\n/g, '<br>');
    T.style.height = document.getElementById('divInfoMinutaggio' + T.dataset.rifRigo).style.height = divtestaltezza.offsetHeight + "px";*/
}

function MemorizzaTestoTextarea(T) {
    TrovaDatiCopioneID(T.dataset.numid).testo = T.innerHTML;
}

function focusTextarea(e) {
 /*   const T = e.currentTarget;
     const MinutaggioCorrente = VideoGuidaMinutaggioCorrente(), MinutaggioPartenzaBloccoTesto = T.dataset.minutaggio;
    const textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});
 */
    UltimaTextareaUtilizzata = e.currentTarget.parentElement.parentElement;

    /* AdattaAltezzaTextarea(T);

     Verifica se ci si trova all'interno del minutaggio cui si riferisce il blocco di testo, altrimenti si posiziona all'inizio del minutaggio 
    if ((MinutaggioPartenzaBloccoTesto <= MinutaggioCorrente) && (MinutaggioCorrente < textareasuccessiva.dataset.minutaggio)) {return;}

    PosizionatiAlMinutaggio(MinutaggioPartenzaBloccoTesto, false); */
}

function GestisciBlur(e) {
    UltimaTextareaUtilizzata = e.currentTarget;
    if (AutoRiproduzioneVideoAttiva) {AggiornaTestoGuida_slow();}
}

function MettiFocusTextareaCorrispondente() {
   /*  console.log("MettiFocusTextareaCorrispondente()");
    setTimeout(() => {
        if (GestioneBufferingVideo.BufferingInCorso) {return;}

        const MinutaggioCorrente = Math.round(VideoGuidaMinutaggioCorrente()), textarea = document.querySelectorAll("textarea[data-eliminata='0']"), totTextarea = textarea.length;
        for (let I = 0; I < totTextarea; I++) {
            const T = textarea[I], textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});
            if ((T.dataset.minutaggio <= MinutaggioCorrente) && (MinutaggioCorrente < textareasuccessiva.dataset.minutaggio) && (UltimaTextareaUtilizzata != T)) {T.focus(); break;}
        }
    
        setTimeout(() => {if (RiproduzioneInCorso) {FunzioniCopione.AttivaTestoGuida();}}, 350);            
    }, 1000); */
}

function PosizionatiAlMinutaggio(Minutaggio, FocusTextareaCorrispondente = true) {
    /* PosizionatiAlMinutaggio.FocusTextareaCorrispondente = FocusTextareaCorrispondente;
    if (VideoGuidaMinutaggioCorrente() == Minutaggio) {MandaAdAggiornaTestoGuida(); return;} */
    MandaAdAggiornaTestoGuida.Minutaggio = Minutaggio;
    VideoGuidaImpostaEventoAlTermineCaricamento(MandaAdAggiornaTestoGuida);
    VideoGuidaPosizionati(Minutaggio);
}
PosizionatiAlMinutaggio.FocusTextareaCorrispondente = true;

function MandaAdAggiornaTestoGuida() {
    VideoGuidaRimuoviEventoAlTermineCaricamento(MandaAdAggiornaTestoGuida);
    FunzioniCopione.RiattivaCopione();

    AggiornaTestoGuida_slow();
    /* if (PosizionatiAlMinutaggio.FocusTextareaCorrispondente) {MettiFocusTextareaCorrispondente();} */
}
MandaAdAggiornaTestoGuida.Minutaggio = 0;

function AggiornaTestoGuida_slow() {
    DatiCopione.sort((a, b) => {return a.minutaggio - b.minutaggio;});
    AggiornaTestoGuida_slow.tmr = setTimeout(() => {
        if (UltimaTextareaUtilizzata) {
            DatiTestoAttuale = TrovaDatiCopioneID(UltimaTextareaUtilizzata.dataset.numid);
            DatiTestoSuccessivo = DatiCopione[DatiCopione.indexOf(DatiTestoAttuale) + 1] || {minutaggio: totDurataVideoGuida};
    
            if (!((DatiTestoAttuale.minutaggio <= MandaAdAggiornaTestoGuida.Minutaggio) && (MandaAdAggiornaTestoGuida.Minutaggio < DatiTestoSuccessivo.minutaggio))) {FunzioniCopione.Visualizza();}
        }
        FunzioniCopione.AggiornaTestoGuida(); if (RiproduzioneInCorso) {FunzioniCopione.AttivaTestoGuida();
    }}, 2000);
}
AggiornaTestoGuida_slow.tmr = false;

function TrovaTextareaVicina(T, PosRelativa) {
    var NuovaPosizioneRelativa = PosRelativa;
    while ((document.getElementById('RigoBloccoTesto' + ((+T.dataset.rifRigo) + (+NuovaPosizioneRelativa))) || ({style: {display: ''}})).style.display == 'none') {NuovaPosizioneRelativa = (+NuovaPosizioneRelativa) + (+PosRelativa);}
    return document.getElementById('t' + ((+T.dataset.rifRigo) + (+NuovaPosizioneRelativa)));
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
        /* AggiornaTestoGuida_slow(); */
        GestioneBufferingVideo.BufferingInCorso = false;
    },

    BufferingInCorso: false
};

AltreFunzioniPlayVideoGuida = () => {/* AggiornaTestoGuida_slow();  */ FunzioniCopione.AttivaTestoGuida(); if (InizioVideo || FineVideo) {VerificaRiproduzioneSegmento(InizioVideo, FineVideo);}};
AltreFunzioniStopVideoGuida = FunzioniCopione.DisattivaTestoGuida;

FunzioneRaggiuntaFineVideo = () => {};

AltreFunzioniDisabilitaSchermata = () => {AbilitaTextarea(false);}
AltreFunzioniRiabilitaSchermata  = () => {AbilitaTextarea(true);}

/** Parametri copione **/
FunzioniCopione.CopioneEditabile = 2;
FunzioniCopione.FunzioneModificaPersonaggio = (e) => {SospendiRipresaVideo(e.currentTarget, false); AttivaSceltaPersonaggio(e.currentTarget, ModificaPersonaggio)};
FunzioniCopione.FunzioneModificaBattuta = GestisciImmissioneTesto;
FunzioniCopione.FunzioneOnClickBattuta = focusTextarea;

FunzioniCopione.Ridimensionabile = false;
FunzioniCopione.Spostabile = false;

FunzioniCopione.ClasseEvidenziaBattuta = "TestoGuida-evidenziato";
FunzioniCopione.FunzionePosizionaVideo = PosizionatiAlMinutaggio;
/***********************/

async function AdattaAltezzeTextarea() {
   /*  const textarea = document.getElementsByTagName('textarea'), totTextarea = textarea.length;

    for (let I = 0; I < totTextarea; I++) {
        /*const T = textarea[I];
         if (TextareaVisibileASchermo(T)) {AdattaAltezzaTextarea(T);} else {continue;} 
        AdattaAltezzaTextarea(textarea[I]);
        (((I % 200) == 0) && (await pausa(10)));
    } */
}

function PosizioneDelCursore() {
    const InfoCursore = document.getSelection(), T = InfoCursore.anchorNode.parentElement;

    return {p: InfoCursore.anchorOffset, T: T, nodo: InfoCursore.anchorNode};
}

function NumeroNodo(T, Nodo) {
    return Array.from(T.childNodes).indexOf(Nodo);
}

function PosizionaCursore(Nodo, posizione) {
    document.getSelection().setBaseAndExtent(Nodo, posizione, Nodo, posizione);
    return true;
}

window.onresize = () => {
    if (RidimensionaVideo) {setTimeout(RidimensionaVideo, 500);}
    AdattaAltezzeTextarea();
};

AttivaVetro(true);