var divErrori = document.getElementById('divErrori');

function StatoLoginUtente(response) {

	switch(response.status) {
		case "connected": VerificaUtente(); break;
		
		default: if (document.getElementById('UtenteFB').value == 0) {Visualizza();} else {divErrori.innerHTML = "Non sei più connesso a Facebook! Verrai reindirizzato al login!"; Logout();}
	}
	
	function VerificaUtente() {
		console.log('Caricamento...');
		FB.api('/me', {fields: 'id, name, email, picture'}, function(DatiPrincipali) {
			console.log('Login per: ', DatiPrincipali);
			AJAX("VerificaIDUtenteLoggato.php", "ID=" + DatiPrincipali.id,
				function(Esito) {
					if (Esito.OK == true) {
						Visualizza();
					} else {
						divErrori.innerHTML = "Hai cambiato identità Facebook! Verrai reindirizzato al login!";
						Logout();
					}
				}, "", "", true
			);
		});
	}
	
}
