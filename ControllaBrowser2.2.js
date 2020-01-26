var BrowserAttuale = "";

function VerificaVersione(Browser, Versione) {
	var NomeBrowser = Browser.charAt(0).toUpperCase() + Browser.slice(1);
	
	if (navigator.userAgent.toLowerCase().indexOf(Browser) > -1) {
		var VersioneAttuale = parseInt(navigator.userAgent.substring(navigator.userAgent.toLowerCase().indexOf(Browser + '/') + Browser.length + 1));
		try {
			if (VersioneAttuale >= Versione) {Testo.innerHTML = "La tua versione di " + NomeBrowser + " (" + VersioneAttuale + ") va bene!"; Testo.style.color = "green";} else {Testo.style.color = "orange"; Testo.innerHTML = "Per funzionare correttamente è necessario Firefox 29 o Chrome 47 o superiori.<br>Devi aggiornare il tuo browser " + NomeBrowser + "!";}
		} catch(e) {}
		BrowserAttuale = Browser;
		return true;
	} else {
		try {Testo.style.color = "red"; Testo.innerHTML = "Il tuo Browser probabilmente non supporta questa web-app!<br>Per funzionare correttamente è necessario Firefox 29 o Chrome 47 o superiori.";} catch(e) {}
		return false;
	}
}

if (!VerificaVersione('firefox', 29)) {VerificaVersione('chrome', 47);}

