var tmrCancMex, OggettoDaSpostare = false, FinestraCopione;

function CreaElemento(Tipo, ID, DoveInserirlo, Stringa, Prima) {
	var Elemento = document.createElement(Tipo);
	Elemento.id = ID; Elemento.name = ID;
	oggDoveInserirlo = document.getElementById(DoveInserirlo);
	if (Prima) { oggDoveInserirlo.parentNode.insertBefore(Elemento, oggDoveInserirlo); } else { oggDoveInserirlo.appendChild(Elemento); }

	if (Stringa) { document.getElementById(ID).innerHTML = Stringa; }

	return document.getElementById(ID);
}

function CreaElementoInputNascosto(IDeNome, Form, Dato) {
	var ElementoInputNascosto = CreaElemento('input', IDeNome, Form); ElementoInputNascosto.setAttribute('type', 'hidden'); ElementoInputNascosto.value = Dato;
	return ElementoInputNascosto;
}

function CreaElementoSeInesistente(Tipo, ID, DoveInserirlo, Stringa, Classe) {
	var Elemento = document.getElementById(ID) || CreaElemento(Tipo, ID, DoveInserirlo);
	Elemento.innerHTML = Stringa || "";
	Elemento.className = Classe || "";

	return Elemento;
}

function EliminaElemento(Elemento) {
    try {
        if (Elemento) {
            Elemento.parentNode.removeChild(Elemento);
        }
    } catch (err) {}
}

function SpostaOggettoColMouse(Mouse) {
    try {
        OggettoDaSpostare.style.top  = (Mouse.clientY - document.getElementById('Monitors').offsetTop - 10) + "px";
        OggettoDaSpostare.style.left = (Mouse.clientX - 150) + "px";            
    } catch (e) {}
}

function InserimentoInProporzioneNellaLineaTemporale(ELT, Partenza, Lunghezza) {
    const LunghezzaTotale = totDurataVideoGuida || VideoGuidaDurataTotale();
	ELT.style.left  = (Partenza / LunghezzaTotale * 100) + "%";
	ELT.style.width = (Lunghezza / LunghezzaTotale * 100) + "%";	
}

/*** Gestore richieste AJAX ***/
function AJAX(Pagina, Parametri, Funzione, MessaggioIniziale, MessaggioOK, NonDisabilitare, EliminaHeader) {
	var XHR = new XMLHttpRequest();
	XHR.open ("post", Pagina, true);
	if (!EliminaHeader) {XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");}
	XHR.onreadystatechange = function () {
		if (XHR.readyState == 4) {
            switch(XHR.status) {
                case 200: 
                    var Dati = JSON.parse(XHR.responseText);
                    if (Dati.Errore) {
                        Messaggio(Dati.Errore, "A");
                        if (!NonDisabilitare) {RiabilitaSchermata(true);}
                    } else {
                        if (Funzione) {Funzione(Dati);}
                        
                        if (!NonDisabilitare) {RiabilitaSchermata(true);}
                        
                        if (MessaggioOK) {Messaggio(MessaggioOK, "OK");}
                    }
                    break;
                
                case 413:
                    Messaggio(strFileTroppoGrandeAJAX);
                    if (!NonDisabilitare) {RiabilitaSchermata(true);}
                    break;
                
                default:
                    /* Messaggio(strErroreConnessioneAJAX); */
                    window.setTimeout(function () {AJAX(Pagina, Parametri, Funzione, MessaggioIniziale, MessaggioOK, NonDisabilitare, EliminaHeader);}, 1000); break;
            }
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
		ComparsaBarraCaricamento();
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

function ComparsaBarraCaricamento() {
	document.getElementById('ProgressoCaricamento').style.opacity = 1; document.getElementById('BarraProgressoCaricamento').style.opacity = 1;
}

function Messaggio(Stringa, Attenzione) {
	window.clearTimeout(tmrCancMex);
    
    try {
        const M = document.getElementById('Messaggio');
        M.innerHTML = Stringa;
        switch (Attenzione) {
            case "OK" : M.className = "alert alert-success"; break;
            case "A": M.className = "alert alert-danger"; break;
            default: M.className = "alert alert-warning"; break;
        }
        M.style.opacity = 1;
        M.parentNode.style.pointerEvents = "auto";
        
        tmrCancMex = window.setTimeout(CancMex, 15000);            
    } catch (err) {}
}

function CancMex() {
    const M = document.getElementById('Messaggio');
    M.style.opacity = 0;
    M.parentNode.style.pointerEvents = "none";
}

function CreaParametri(vParametri) {
    frmDati = new FormData();

    for(var NomeParametro in vParametri) {
        frmDati.append(NomeParametro, vParametri[NomeParametro]);
    }

    return frmDati;
}

function AJAXHTML(Pagina, Parametri, Contenitore, Funzione) {
    var XHR = new XMLHttpRequest();
    XHR.responseType = 'document';
    XHR.open("post", Pagina, true);
    XHR.overrideMimeType('text/html');
    XHR.onreadystatechange = function () {
        if (XHR.readyState == 4) {
            if (XHR.status == 200) {
                Contenitore.innerHTML = XHR.responseXML.documentElement.innerHTML;
                AttivaJS(Contenitore);
                if (Funzione) {Funzione();}
            } else {window.setTimeout(function () {AJAXHTML(Pagina, Parametri, Contenitore, Funzione);}, 1000);}
        }
    };

    XHR.send(CreaParametri(Parametri));
}

/** Acquisisce e attiva tutti gli script **/
function AttivaJS(Contenitore) {
	var tagScript = Contenitore.getElementsByTagName('script'), totTagScript = tagScript.length, Contenuto = "";
	for(var I = 0; I < totTagScript; I++) {
		Contenuto = tagScript[0].innerText;
		tagScript[0].parentNode.removeChild(tagScript[0]);
		CreaElemento('script', Contenitore.id + 'script' + I, Contenitore.id, Contenuto);
	}
}
/******************************/

/*** Visualizza Utente Attivo ***/
const classe_utenteonline = "fa fa-circle";

function UtenteAttivo(DataUltimaAzione) {
    var d = new Date(), ora = d.getTime() / 1000;

    return ((ora - DataUltimaAzione) < 1000);
}

function VisualizzaUtenteAttivo(IDContenitore, DataUltimaAzione) {
   try {document.getElementById(IDContenitore).className = (UtenteAttivo(DataUltimaAzione) ? classe_utenteonline : "");} catch (err) {}
}

function VisualizzaUtenteAttivoProgettoDoppiaggio(IDUtenteConsiderato, DataUltimaAzione, UtenteSiTrovaNelProgetto) {
    const Indicatori = document.getElementsByName(IDUtenteConsiderato + "_online"), totIndicatori = Indicatori.length;
    var classedautilizzare = "", colore = "", strTitleUtente = "", strInfoOnline = "Offline";

    if (totIndicatori) {
        if (UtenteAttivo(DataUltimaAzione)) {
            classedautilizzare = classe_utenteonline;
            colore = (UtenteSiTrovaNelProgetto? "green" : "grey");
            strInfoOnline = ((ID_Utente == IDUtenteConsiderato) ? "" : (UtenteSiTrovaNelProgetto? strUtenteOnline_NelProgetto : strUtenteOnline_NonNelProgetto));
        }

        for(I = 0; I < totIndicatori; I++) {
            const Contenitore = Indicatori[I], PulsanteUtente = Contenitore.parentNode;
            Contenitore.className = classedautilizzare;
            Contenitore.style.color = colore;
            strTitleUtente = PulsanteUtente.title;
            PulsanteUtente.title = strTitleUtente.slice(0, strTitleUtente.indexOf(" -- ") + 4) + strInfoOnline;
        }
    }
}

function AggiornaIndicatoriUtenteOnline(IDUtente, DataUltimaAzione, NumeroProgettoDoveSiTrovaUtente = false) {
    const Classe = (UtenteAttivo(DataUltimaAzione) ? classe_utenteonline : ""), Indicatori = document.getElementsByName(IDUtente + "_online"), totIndicatori = Indicatori.length, Colore = {[false]: 'grey', [true]: 'green'};
    var I;
    
    for(I = 0; I < totIndicatori; I++) {
        Indicatori[I].className = Classe;
        Indicatori[I].style.color = (Indicatori[I].dataset.numprogetto? Colore[(+Indicatori[I].dataset.numprogetto == +NumeroProgettoDoveSiTrovaUtente)] : 'green');
    }
}
/********************************/

function LarghezzaVideo(LarghezzaOriginale, AltezzaOriginale) {
	return Math.floor(document.getElementById('ComandiPlayer').offsetTop * LarghezzaOriginale / AltezzaOriginale) + "px";
}

function ApriCopione(e) {
	FinestraCopione = window.open(e.currentTarget.dataset.link, "Copione", "height=600, width=500, menubar=no, location=no, status=no, toolbar=no, scrollbars=yes");
    FinestraCopione.focus();
    document.body.removeEventListener('click', FinestraCopioneInPrimoPiano);
    document.body.addEventListener('click', FinestraCopioneInPrimoPiano);
}

function FinestraCopioneInPrimoPiano() {
    if (document.fullscreenElement == null) {FinestraCopione.focus();}
}

function ApriFinestra(e) {
	var Altezza = e.currentTarget.dataset.altezza, Larghezza = e.currentTarget.dataset.larghezza, NomeFinestra = e.currentTarget.dataset.nomefinestra || "Finestrella";
	window.open(e.currentTarget.dataset.link, NomeFinestra, "height=" + Altezza + ", width=" + Larghezza + ", menubar=no, location=no, status=no, toolbar=no, scrollbars=yes").focus();
}

/*** Abilita/disabilita i pulsanti personalizzati con css ***/
HTMLElement.prototype.abilita = function (Attivo) {
	this.style.pointerEvents = Attivo? "auto" : "none";
	this.style.color = Attivo? "" : "grey";
};
/************************************************************/

function ValidaCondizioneMinimaCampoDiTesto(CampoDiTesto) {
    const testo = CampoDiTesto.value.replace(/\</g, '').trim();
    CampoDiTesto.value = testo;
    
    return (testo.length > 4);
}

function CopiaNegliAppunti(e) {
    const Elemento = e.currentTarget;
    navigator.clipboard.writeText(Elemento.value).then(function() {CreaElementoSeInesistente('div', 'infoClipboard' + Elemento.parentNode.id, Elemento.parentNode.id, "<b>Link copiato negli appunti!<b>");});
}

function SelezionaTutto(e) {
	e.currentTarget.select();
}

function ContieneCaratteriSpeciali(Stringa) {
	return Stringa.match(/[^a-zA-Z0-9\. ]/g) ? true : false;
}

Number.prototype.duecifre = function () {
	return this.toString().padStart(2, "0");
};

String.prototype.ritorniACapoHTML = function () {
    return this.replace(/\n/g, "<br />");
}

HTMLElement.prototype.iStyle = function (stili) {
	for(nome in stili) {
		this.style[nome] = stili[nome];
	}
}

function IsNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}