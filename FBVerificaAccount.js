var Info = document.getElementById('Info');

function VerificaAccountFB(response) {
	
	switch(response.status) {
		case "connected": VerificaUtente(); break;
		
		default: Info.innerHTML = "Sei uscito da Facebook! Verrai reindirizzato al login!"; Logout(true);
	}
	
	function VerificaUtente() {
		console.log('Caricamento...');
		FB.api('/me', {fields: 'id, name, email, picture'}, function(DatiPrincipali) {
			console.log('Login per: ', DatiPrincipali);
			if (DatiPrincipali.id != ID_Utente) {
				Info.innerHTML = "Hai cambiato identità Facebook! Verrai reindirizzato al login!";
				Logout(true);
			}
		});
	}
}
