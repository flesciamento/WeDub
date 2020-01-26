function CancellaAccount() {
	Testo = document.getElementById('divCancellaAccount');
	Testo.innerHTML = "Attendere prego...";
	
	FB.api("/me/permissions", "DELETE", function(Risposta) {
		if (Risposta.success) {Testo.innerHTML = "Account WEDUB cancellato con successo!"; window.setTimeout(function () {Logout();}, 1000);} else {Testo.innerHTML = "Si è verificato un errore nel tentativo di cancellare il tuo account Facebook, può darsi che il tuo account sia già stato cancellato oppure si è verificato un problema di connessione.";}
	});
}
