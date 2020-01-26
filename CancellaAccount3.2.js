var Testo = document.getElementById('divCancellaAccount');

function CancellaAccount(AccountFB) {
	Testo.innerHTML = "Attendere prego...";
	
	if (AccountFB) {
		FB.api("/me/permissions", "DELETE", function(Risposta) {
			if (Risposta.success) {CancellaAccountInterno();} else {Testo.innerHTML = "Si è verificato un errore nel tentativo di cancellare il tuo account Facebook, può darsi che il tuo account sia già stato cancellato oppure si è verificato un problema di connessione.";}
		});
	} else {
		CancellaAccountInterno();
	}
}

function CancellaAccountInterno() {
	// manda chiamata AJAX per eliminare e-mail, pwd e sostituire foto profilo con quella dell'utente cancellato e quindi flaggare come cancellato l'utente in database.
	AJAX("EffettuaCancellazioneAccount.php", "ID=" + encodeURIComponent(document.getElementById('UID').value) + "&CA=" + encodeURIComponent(document.getElementById('CA').value),
		function(Esito) {
			if (Esito.Cancellato == true) {
				Testo.innerHTML = "Account WEDUB cancellato con successo!"; window.setTimeout(function () {Logout();}, 1000);
			} else {
				Testo.innerHTML = "Si è verificato un errore nel tentativo di cancellare il tuo account. È probabile che il tuo account sia già stato cancellato o che ci siano stati problemi di connessione. Se il problema persiste contattare l'amministratore del sito.";
			}
		}, "", "", true
	);
	
}
