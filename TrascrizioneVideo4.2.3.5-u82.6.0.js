const SP = document.getElementById('SceltaPersonaggi'), inputSceltaPersonaggio = document.getElementById('inputNomePersonaggio'), inputSecondiRiprendiVideo = document.getElementById('inputSecondiRiprendiVideo'), opzRiprendiVideoSecondi = document.getElementById('opzRiprendiVideoSecondi'), opzRiprendiDaInizioTextarea = document.getElementById('opzRiprendiDaInizioTextarea'), opzACapoPersonaggio = document.getElementById('opzACapoPersonaggio'), opzScorrimentoAutomatico = document.getElementById('opzScorrimentoAutomatico'), divContenitoreTesto = document.getElementById('divContenitoreTesto'), divInfoTasti = document.getElementById('infoTasti'), divVetro = document.getElementById('Vetro');
const BarraCaricamento = document.getElementById('ProgressoCaricamento'), ContornoBarraCaricamento = document.getElementById('BarraProgressoCaricamento');
var tmrSospendi, AutoRiproduzioneVideoAttiva = true, UltimaTextareaUtilizzata = false, UltimaPosizioneCursore = 0;

const SecondiRitornoIndietro = 2;

for (var NomeTasto in TastiIndicazioni) {
    const Contenuto = TastiIndicazioni[NomeTasto], pos_separatore = Contenuto.indexOf('|'), Testo = Contenuto.slice(0, pos_separatore), Descrizione = Contenuto.slice(pos_separatore + 1);
	const divTasto = CreaElemento('div', 'div' + NomeTasto, 'infoTasti', "<a class='btn btn-default btn-xs' style='pointer-events: none;' data-tasto='" + NomeTasto + "'><b>" + NomeTasto + "</b></a> " + Testo); divTasto.setAttribute('title', Descrizione); divTasto.dataset.tasto = NomeTasto; divTasto.className = 'btn btn-default btn-xs';
          divTasto.onclick = (e) => {if (UltimaTextareaUtilizzata && TrovaCampoTestoVicino(UltimaTextareaUtilizzata, 0)) {UltimaTextareaUtilizzata.focus(); GestisciImmissioneTesto({currentTarget: UltimaTextareaUtilizzata, key: e.currentTarget.dataset.tasto});}};
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

async function GestisciImmissioneTesto(e) {
	const ElementoAttuale = e.currentTarget, spanBattuta = ElementoAttuale.parentElement, T = spanBattuta.parentElement, InfoCursore = PosizioneDelCursore(), NodoAttuale = InfoCursore.nodo;
    var nuovatextarea, PosizioneCursore = InfoCursore.p;

    clearTimeout(AggiornaTestoGuida_slow.tmr);

    function MandaA_AttivaSceltaPersonaggio() {
        UltimaPosizioneCursore = PosizioneDelCursore();
        AttivaSceltaPersonaggio(nuovatextarea, ScriviPersonaggio);
    }

    
    if (Object.keys(TastiIndicazioni).includes(e.key)) {
        if (e.preventDefault) {e.preventDefault();}

        if (e.key == "F1") {
            /** Aggiunta/modifica personaggio **/
            ElementoAttuale.previousElementSibling.previousElementSibling.click();
            return;
        }

        /** Aggiunta indicazione di doppiaggio **/
        const StringaTasto = TastiIndicazioni[e.key], TestoDaAggiungere = StringaTasto.slice(0, StringaTasto.indexOf("|")), testoNodo = NodoAttuale.textContent;
        NodoAttuale.textContent = testoNodo.slice(0, PosizioneCursore) + ((testoNodo.slice(PosizioneCursore - 1, PosizioneCursore) != " ") ? " " : "") + TestoDaAggiungere + " " + testoNodo.slice(PosizioneCursore); PosizionaCursore(NodoAttuale, (+PosizioneCursore) + (+TestoDaAggiungere.length) + 1);
        SalvaCopione(T);
        return;
    }

    TestoPrec = T.textContent.trim();
	
	switch (e.key) {
/*		case "(": NodoAttuale.textContent = NodoAttuale.textContent.slice(0, PosizioneCursore) + ")" + NodoAttuale.textContent.slice(PosizioneCursore); ; return 2;
		case "[": T.innerHTML = T.innerHTML.slice(0, PosizioneCursore) + VisualizzaMinutaggioAttuale() + "] " + T.innerHTML.slice(PosizioneCursore); T.selectionEnd = PosizioneCursore; setTimeout(() => {T.selectionStart = T.selectionEnd = T.innerHTML.length;}, 100); return 2;
 		case "Control": if (e.location == 2) {RiprendiDaPocoPrima(6);}
		case "AltGraph": clearTimeout(tmrSospendi); break; */
        case "V":
        case "v": if (e.ctrlKey) {await pausa(200); PosizionaCursore(ElementoAttuale.childNodes[0], ElementoAttuale.textContent.length); return;}
        case "ArrowUp":   if ((PosizioneCursore < 200) && (campoprecedente = TrovaCampoTestoVicino(ElementoAttuale, -1))) {await pausa(100); campoprecedente.focus();} return;
        case "ArrowDown": if ((PosizioneCursore > NodoAttuale.textContent.length - 200) && (camposuccessivo = TrovaCampoTestoVicino(ElementoAttuale, 1))) {await pausa(100); camposuccessivo.focus();} return;

        case "Delete":
        case "Backspace":
            if (T.innerText.trim() == "") {
                AJAX("TrascrizioneVideo_EliminaBloccoTesto.php", "NumID=" + encodeURIComponent(T.dataset.numid) + "&N=" + encodeURIComponent(N), () => {const divPrecedente_id = T.previousElementSibling?.id; DatiCopione.splice(DatiCopione.indexOf(TrovaDatiCopioneID(T.dataset.numid)), 1); EliminaElemento(T); ( (div = document.getElementById(divPrecedente_id)) && (div.lastElementChild.querySelector("[contenteditable='true']").focus()) );}, "", "", true);
                return;
            } else {
                if ((e.key == "Delete") && (PosizioneCursore >= NodoAttuale.textContent.rtrim().length)) {
                    const brSuccessivo = ElementoAttuale.nextElementSibling;
                    if ((brSuccessivo) && (brSuccessivo.tagName == "BR")) {
                        e.preventDefault();
                        const NumCaratteriRiga = NodoAttuale.textContent.length;
                        EliminaElemento(brSuccessivo);
                        SalvaCopione(T, true, NumeroChildren(T, spanBattuta), NumeroChildren(spanBattuta, ElementoAttuale));
                        PosizionaCursore(PosizioneDelCursore().nodo, NumCaratteriRiga);
                    }

                }
                if ((e.key == "Backspace") && (PosizioneCursore <= /\S/.exec(NodoAttuale.textContent + ".").index)) {
                    e.preventDefault();
                    const tagNomePersonaggio = ElementoAttuale.previousElementSibling.previousElementSibling, tagduepunti = ElementoAttuale.previousElementSibling, ContenutoTagNomePersonaggio = tagNomePersonaggio.textContent.trim(), PresentePersonaggio = (ContenutoTagNomePersonaggio != ""), NumeroSpanBattuta = NumeroChildren(T, spanBattuta), NumeroSpan = NumeroChildren(spanBattuta, ElementoAttuale), brPrecedente = tagNomePersonaggio.previousElementSibling;
                    console.log(NumeroSpanBattuta, spanBattuta, PresentePersonaggio, spanBattuta.previousElementSibling, tagNomePersonaggio.previousElementSibling);
                    
                    if (PresentePersonaggio) {
                        EliminaPersonaggioDallaRiga(tagNomePersonaggio);
                        return;
                    } else {
                        /* Se è la prima battuta del minutaggio, mantiene lo spazio iniziale */
                        if ((NumeroSpanBattuta <= 2) && (ElementoAttuale == spanBattuta.querySelector("[contenteditable='true']"))) {
                            tagNomePersonaggio.innerHTML = "&nbsp;";
                            return;
                            
                        } else {
                            tagNomePersonaggio.textContent = ""; tagduepunti.textContent = "";
                            EliminaElemento(brPrecedente);
                            const NumCaratteriRigaPrecedente = TrovaCampoTestoVicino(ElementoAttuale, -1).textContent.length;
                            /* Salva il copione, aggiorna il testo e si posiziona nella casella da editare */
                            SalvaCopione(T, true, NumeroSpanBattuta, NumeroSpan - 4);
                            PosizionaCursore(PosizioneDelCursore().nodo, NumCaratteriRigaPrecedente);
                        }
                    }
                    
                    return;
                }
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
    
    /* Riprendi il video se il testo è stato modificato */
    setTimeout(() => {if (TestoPrec != T.textContent.trim()) {RiprendiVideoAutomaticamente(T);}}, 100);
}

function AggiungiNuovoMinutaggio(Minutaggio) {
    AJAX("TrascrizioneVideo_AggiungiNuovoMinutaggio.php", "N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(Minutaggio),
        (Dati) => {
            DatiCopione.push({NumID: Dati.NumID, minutaggio: Minutaggio, testo: ' '});
            FunzioniCopione.Visualizza();
            AttivaSceltaPersonaggio(document.getElementById('RifCopione' + Dati.NumID), ScriviPersonaggioNuovaTextarea);
        }, strAttenderePrego, strModificheSalvate
    );
}

async function AttivaSceltaPersonaggio(T, FunzioneAllaSceltaPersonaggio, PersonaggioDaModificare = false) {
    const RichiestaModificaPersonaggio = (typeof PersonaggioDaModificare == 'string');
    await pausa(100);
    clearTimeout(AggiornaTestoGuida_slow.tmr);

    if (!opzACapoPersonaggio.checked && !RichiestaModificaPersonaggio) {FunzioneAllaSceltaPersonaggio(T, ''); return;}

    VisualizzaBoxSceltaPersonaggio(true);
    inputSceltaPersonaggio.value = ""; setTimeout(() => {inputSceltaPersonaggio.focus();}, 100);

    
    const pulEliminaPersonaggio = document.getElementById('pulEliminaPersonaggioDaRiga');
    pulEliminaPersonaggio.style.display = "none";

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
                    if (NuovoPersonaggio) {
                        /* In caso di nuovo personaggio, lo salva nella lista */
                        AJAX("TrascrizioneVideo_SalvaNuovoPersonaggio.php", "N=" + encodeURIComponent(N) + "&NomePersonaggio=" + encodeURIComponent(NuovoPersonaggio), "", "", "", true);
                    } else {
                        /* In caso di nessuna scelta (stringa vuota), verifica se si tratta di modifica del personaggio esistente, in tal caso mantiene quel personaggio */
                        if (RichiestaModificaPersonaggio) {FunzioneAllaSceltaPersonaggio(T, PersonaggioDaModificare); return;}
                    }

                    FunzioneAllaSceltaPersonaggio(T, NuovoPersonaggio.charAt(0).toUpperCase() + NuovoPersonaggio.slice(1));
                },
                
                /* Cancellazione di un personaggio */
                (PersonaggioDaCancellare) => {
                    if (confirm(strConfermaCancellaNomePersonaggio)) {AJAX("TrascrizioneVideo_EliminaPersonaggioDaLista.php", "N=" + encodeURIComponent(N) + "&NomePersonaggio=" + encodeURIComponent(PersonaggioDaCancellare), () => {AttivaSceltaPersonaggio(T, FunzioneAllaSceltaPersonaggio);}, "", "", true);}
                }
            );

            /* Visualizza il pulsante per eliminare il personaggio da modificare */
            pulEliminaPersonaggio.style.display = (PersonaggioDaModificare? "inline" : "none");
            pulEliminaPersonaggio.onclick = (PersonaggioDaModificare? () => {EliminaPersonaggioDallaRiga(T);} : "");

            /* Sovrascrive la funzione body_click */
            document.body.onclick = (e) => {if (e.target == divVetro) {inputSceltaPersonaggio.value = ""; CreaListaMenu.EsciSenzaSelezionare();}};
        }, "", "", true
    );
}

async function ScriviPersonaggio(T, Personaggio) {
    await pausa(100);
	
    const NodoCursore = UltimaPosizioneCursore.nodo, PosizioneCursore = UltimaPosizioneCursore.p, span = NodoCursore.parentElement, spanBattuta = span.parentElement, NumeroSpan = NumeroChildren(spanBattuta, span), NumeroSpanBattuta = NumeroChildren(T, spanBattuta), NumeroChildrenBattutaSuccessivo = +NumeroSpan + 1, totChildrenBattuta = spanBattuta.childNodes.length;

    /* Memorizza il testo dal nodo del cursore in poi, eliminando i children successivi */
    var RigaCompleta = NodoCursore.textContent;
    for (let I = NumeroChildrenBattutaSuccessivo; I < totChildrenBattuta; I++) {
        const ChildrenBattutaSuccessivo = spanBattuta.children[NumeroChildrenBattutaSuccessivo];
        RigaCompleta += ((ChildrenBattutaSuccessivo.tagName == "BR") ? "<br>" : ChildrenBattutaSuccessivo.textContent);
        EliminaElemento(ChildrenBattutaSuccessivo);
    }

    const TestoPrimaInvio = RigaCompleta.slice(0, PosizioneCursore), TestoDopoInvio = RigaCompleta.slice(PosizioneCursore).trim() || ".";
    NodoCursore.textContent = TestoPrimaInvio;

    if (Personaggio) {
        spanBattuta.insertAdjacentHTML('afterend', `<br>${Personaggio}: ${TestoDopoInvio}`);
        SalvaCopione(T, true, +NumeroSpanBattuta + 2);
         
    } else {
        span.insertAdjacentHTML('afterend', `<br>&nbsp;${TestoDopoInvio}`);
        SalvaCopione(T, true, NumeroSpanBattuta, +NumeroSpan + 4); // +4 perché salta il br, il tag contenente lo spazio, lo span vuoto e arriva allo span del testo.
    }

    if (TestoDopoInvio == ".") {const NodoAttuale = PosizioneDelCursore().nodo; PosizionaCursore(NodoAttuale, 0, NodoAttuale.textContent.length);}

    OperazioniAlTermineSceltaPersonaggio(Personaggio);
}

async function ScriviPersonaggioNuovaTextarea(T, Personaggio) {
    await pausa(100);

    const span = T.querySelector("[contenteditable='true']");

    if (Personaggio) {
        span.previousElementSibling.previousElementSibling.textContent = "";
        span.textContent = `${Personaggio}:  `;
        SalvaCopione(T, true, 2);
    } else {
        await pausa(100);
        span.focus();
        SalvaCopione(T);
    }

    OperazioniAlTermineSceltaPersonaggio(Personaggio);
}

async function OperazioniAlTermineSceltaPersonaggio(Personaggio, AvviaVideoSePrevisto = true) {
    VisualizzaBoxSceltaPersonaggio(false);
    await pausa(100);
    if (AvviaVideoSePrevisto && opzRiprendiVideoSecondi.checked && Personaggio) {VideoGuidaPlay();}
    AutoRiproduzioneVideoAttiva = true;
}


function ModificaPersonaggio(b, Personaggio) {
    if (Personaggio) {
        const spanBattuta = b.parentElement, divContenitore = spanBattuta.parentElement, NumeroSpanBattuta = NumeroChildren(divContenitore, spanBattuta), NonEraPresentePersonaggio = (b.textContent.trim() == "");
        b.textContent = Personaggio;
        b.nextElementSibling.textContent = ": ";
        SalvaCopione(divContenitore, true, +NumeroSpanBattuta + (2 * NonEraPresentePersonaggio));

    }

    OperazioniAlTermineSceltaPersonaggio(Personaggio, false);
}

function EliminaPersonaggioDallaRiga(b) {
    const spanBattuta = b.parentElement, divContenitore = spanBattuta.parentElement, NumeroSpanBattuta = NumeroChildren(divContenitore, spanBattuta), spanEditabile = b.nextElementSibling.nextElementSibling;
    if (confirm(strVuoiEliminarePersonaggio)) {b.nextElementSibling.textContent = ""; b.innerHTML = "&nbsp;"; SalvaCopione(divContenitore, true, +NumeroSpanBattuta - 2, +spanBattuta.previousElementSibling.previousElementSibling.children.length - 1 + (4 * (spanEditabile.textContent.trim() != "")));}
    OperazioniAlTermineSceltaPersonaggio('');
}

function VisualizzaMinutaggioAttuale() {
	const Minutaggio = new MinutiESecondi(VideoGuidaMinutaggioCorrente());
	return Minutaggio.Minuti + ":" + (Minutaggio.Secondi | 0).toString().padStart(2, "0");
}

function SalvaCopione(divContenitore, AggiornaTesto = false, NumeroSpanBattutaCursore = false, NumeroSpanCursore = 0) {
    const Testo = divContenitore.innerText.slice(1).rtrim().replace(/\\/g, '/').replace(/<+/g, '«').replace(/>+/g, '»'), NumID = divContenitore.dataset.numid; // slice(1) serve per eliminare il primo <br> di default
    console.log(divContenitore, Testo, NumID);
    if (c = TrovaDatiCopioneID(NumID)) {c.testo = Testo;} else {SalvaCopione.salvataggioinsospeso[NumID] = false; return;}

    AJAX("TrascrizioneVideo_SalvaCopione.php", "NumID=" + encodeURIComponent(NumID) + "&N=" + encodeURIComponent(N) + "&Testo=" + encodeURIComponent(Testo) + "&Minutaggio=" + encodeURIComponent(divContenitore.dataset.minutaggio), (Dati) => {SalvaCopione.salvataggioinsospeso[Dati.NumID] = false;}, "", strModificheSalvate, true);

    if (AggiornaTesto) {
        if (NumeroSpanBattutaCursore !== false) {
            const ID_ElementoContenitore = divContenitore.id;

            console.log(divContenitore.innerHTML, ID_ElementoContenitore, NumeroSpanBattutaCursore, NumeroSpanCursore);

            FunzioniCopione.Visualizza();

            if (s = document.getElementById(ID_ElementoContenitore).children[NumeroSpanBattutaCursore]) {
                if (NumeroSpanCursore) {
                    s.childNodes[NumeroSpanCursore].focus();
                } else {
                    s.querySelector("[contenteditable='true']").focus();
                }
            }

        } else {
            FunzioniCopione.Visualizza();
            divInfoTasti.style.display = "none";
        }
    }
}
SalvaCopione.salvataggioinsospeso = [];

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
                    ContenitoreTestoGuida.iStyle({top: "60%", left: "0%", right: "0%", bottom: "0%"});
                    FunzioniCopione.Visualizza();
                    divContenitoreTesto.append(ContenitoreTestoGuida);
                    divContenitoreTesto.append(divInfoTasti);
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

	VideoGuidaPause();
    setTimeout(() => {document.getElementById('divContenitorePrincipale').append(LogoWEDUB); LogoWEDUB.iStyle({top: '0px', right: '0px'}); AttivaVetro(false);}, 500);
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
    const frecciapremuta = e.currentTarget, sec = document.getElementById('SecondiMinutaggioRifCopione'), min = document.getElementById('MinutiMinutaggioRifCopione'), NumID = frecciapremuta.dataset.numid;
    sec.textContent = (+sec.textContent) + (+frecciapremuta.dataset.differenza);
    const minutosuccessivo = (sec.textContent > 59), minutoprecedente = (sec.textContent < 0);

    /* Sale o scende il minuto in automatico, agendo solo sui secondi */
    if (minutosuccessivo || minutoprecedente) {
        min.textContent = (+min.textContent) + (1 + (-2 * minutoprecedente));
        sec.textContent = 59 * minutoprecedente;
    }

    /* Verifica di rimanere nel range del minutaggio del blocco considerato */
    var MinutaggioNuovo = ((min.textContent * 60) + (+sec.textContent));
    const T = document.getElementById('RifCopione' + NumID), textareaprecedente = T.previousElementSibling || ({dataset: {minutaggio: -2}}), textareasuccessiva = T.nextElementSibling || ({dataset: {minutaggio: totDurataVideoGuida}});
    const LimiteMinimo = +textareaprecedente.dataset.minutaggio + 2, LimiteMinimoRispettato = (LimiteMinimo < MinutaggioNuovo), LimiteMassimo = +textareasuccessiva.dataset.minutaggio - 1, LimiteMassimoRispettato = (MinutaggioNuovo < LimiteMassimo);
    MinutaggioNuovo = MinutaggioNuovo * (LimiteMinimoRispettato * LimiteMassimoRispettato) + (LimiteMinimo * !LimiteMinimoRispettato) + (LimiteMassimo * !LimiteMassimoRispettato);
    const MN = new MinutiESecondi(MinutaggioNuovo);
    min.textContent = MN.Minuti;
    sec.textContent = VisualizzaSecondi(MN.Secondi);

    /* Aggiorna il minutaggio della textarea e salva */
    AggiornaMinutaggioTextarea(T, MinutaggioNuovo);
    if (AggiornaMinutaggio.tmr[NumID]) {clearTimeout(AggiornaMinutaggio.tmr[NumID]);}
    AggiornaMinutaggio.tmr[NumID] = setTimeout(() => {AJAX("TrascrizioneVideo_SalvaMinutaggio.php", "NumID=" + encodeURIComponent(NumID) + "&N=" + encodeURIComponent(N) + "&Minutaggio=" + encodeURIComponent(MinutaggioNuovo), "", "", "", true);}, 1000);
}
AggiornaMinutaggio.tmr = [];


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
    SalvaCopione.salvataggioinsospeso[Textarea.dataset.numid] = true;
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
        TrovaCampoTestoVicino(T, -1).focus();
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
    const ElementoAttuale = e.currentTarget, divContenitore = ElementoAttuale.parentElement.parentElement;
 /*   const T = e.currentTarget;
     const MinutaggioCorrente = VideoGuidaMinutaggioCorrente(), MinutaggioPartenzaBloccoTesto = T.dataset.minutaggio;
    const textareasuccessiva = TrovaTextareaVicina(T, 1) || ({dataset: {minutaggio: totDurataVideoGuida}});
 */
    /* Memorizza l'ultima area editabile utilizzata */
    UltimaTextareaUtilizzata = ElementoAttuale;

    /** Visualizza i tool **/
    /* Minutaggio */
    const MinutaggioAttuale = new MinutiESecondi(divContenitore.dataset.minutaggio);
    const freccias = document.getElementById('freccias'), frecciag = document.getElementById('frecciag');
    document.getElementById('MinutiMinutaggioRifCopione').textContent = MinutaggioAttuale.Minuti;
    document.getElementById('SecondiMinutaggioRifCopione').textContent = VisualizzaSecondi(MinutaggioAttuale.Secondi);
    freccias.dataset.numid = frecciag.dataset.numid = divContenitore.dataset.numid;

    /* Tasto personaggio */
    document.getElementById('divF1').childNodes[1].textContent = " " + ((ElementoAttuale.previousElementSibling.previousElementSibling.textContent.trim() != "") ? str_tastopersonaggio_ModificaPersonaggio : str_tastopersonaggio_AggiungiPersonaggio);
    /**********************/

    /* Posiziona correttamente i tool */
    if (PosizionaInfoTasti.Elemento) {PosizionaInfoTasti.Elemento.iStyle({paddingTop: '', border: ''});}
    divContenitore.iStyle({paddingTop: "25px", border: "1px dashed blue"});
    PosizionaInfoTasti.Elemento = divContenitore;
    PosizionaInfoTasti();
    divInfoTasti.style.display = "inline";
    ContenitoreTestoGuida.onscroll = PosizionaInfoTasti;
    /* divInfoTasti.style.top = ((+divContenitoreTesto.offsetTop) + (+UltimaTextareaUtilizzata.offsetTop) - (+UltimaTextareaUtilizzata.offsetHeight) - (+ContenitoreTestoGuida.scrollTop)) + "px"; */
    /* ElementoAttuale.style.marginTop = "-" + (parseInt(ContenitoreTestoGuida.style.fontSize) * 2) + "px"; */

    /* AdattaAltezzaTextarea(T);

     Verifica se ci si trova all'interno del minutaggio cui si riferisce il blocco di testo, altrimenti si posiziona all'inizio del minutaggio 
    if ((MinutaggioPartenzaBloccoTesto <= MinutaggioCorrente) && (MinutaggioCorrente < textareasuccessiva.dataset.minutaggio)) {return;}

    PosizionatiAlMinutaggio(MinutaggioPartenzaBloccoTesto, false); */
}

function PosizionaInfoTasti() {
    divInfoTasti.style.top = PosizionaInfoTasti.Elemento.getBoundingClientRect().y + "px";
}
PosizionaInfoTasti.Elemento = false;

function GestisciBlur(e) {
    UltimaTextareaUtilizzata = e.currentTarget;
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

function PosizionatiAlMinutaggio(Minutaggio) {
    VideoGuidaImpostaEventoAlTermineCaricamento(MandaAdAggiornaTestoGuida);
    PosizionatiAlMinutaggio.MinutaggioRichiesto = Minutaggio;
    VideoGuidaPosizionati(Minutaggio);
}
PosizionatiAlMinutaggio.MinutaggioRichiesto = 0;

function MandaAdAggiornaTestoGuida() {
    VideoGuidaRimuoviEventoAlTermineCaricamento(MandaAdAggiornaTestoGuida);
    if (Math.round(VideoGuidaMinutaggioCorrente()) != Math.round(PosizionatiAlMinutaggio.MinutaggioRichiesto)) {setTimeout(MandaAdAggiornaTestoGuida, 500); return;}

    FunzioniCopione.RiattivaCopione();

    AggiornaTestoGuida_slow();
}

function AggiornaTestoGuida_slow() {
    AggiornaTestoGuida_slow.tmr = setTimeout(() => {
        if (document.activeElement.tagName != "SPAN") {FunzioniCopione.Visualizza(); divInfoTasti.style.display = "none";}
        if (RiproduzioneInCorso) {FunzioniCopione.AttivaTestoGuida();} else {FunzioniCopione.AggiornaTestoGuida();}
    }, 100);
}
AggiornaTestoGuida_slow.tmr = false;

function TrovaCampoTestoVicino(span, PosRelativa) {
    const ce = ContenitoreTestoGuida.querySelectorAll("[contenteditable='true']");
    return ce[Array.from(ce).indexOf(span) + PosRelativa];
}

function AbilitaTextarea(Abilita) {
    const textarea = document.getElementsByTagName('textarea'), totTextarea = textarea.length;

    for (let I = 0; I < totTextarea; I++) {
        textarea[I].disabled = !Abilita;
    }   
}

function AttivaVetro(Attiva) {
    divVetro.style.display = (Attiva? "inline" : "none");
}

function AttivaDisattivaScorrimentoAutomaticoCopione() {
    FunzioniCopione.ScorrimentoAutomatico = opzScorrimentoAutomatico.checked;
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
FunzioniCopione.FunzioneModificaPersonaggio = (e) => {SospendiRipresaVideo(e.currentTarget, false); e.stopPropagation(); AttivaSceltaPersonaggio(e.currentTarget, ModificaPersonaggio, e.currentTarget.textContent.trim());};
FunzioniCopione.FunzioneModificaBattuta = GestisciImmissioneTesto;
FunzioniCopione.FunzioneOnFocusBattuta = focusTextarea;

FunzioniCopione.Ridimensionabile = false;
FunzioniCopione.Spostabile = false;

FunzioniCopione.ClasseEvidenziaBattuta = "TestoGuida-evidenziato";
FunzioniCopione.FunzionePosizionaVideo = PosizionatiAlMinutaggio;
/***********************/

function PosizioneDelCursore() {
    const InfoCursore = document.getSelection(), T = InfoCursore.anchorNode.parentElement;

    return {p: InfoCursore.anchorOffset, T: T, nodo: InfoCursore.anchorNode};
}

function NumeroNodo(T, Nodo) {
    return Array.from(T.childNodes).indexOf(Nodo);
}

function NumeroChildren(T, Children) {
    return Array.from(T.children).indexOf(Children);
}

function PosizionaCursore(Nodo, posizione, termineselezione = posizione) {
    document.getSelection().setBaseAndExtent(Nodo, posizione, Nodo, termineselezione);
    return true;
}

window.onresize = () => {
    if (RidimensionaVideo) {setTimeout(RidimensionaVideo, 500);}
};

AttivaVetro(true);