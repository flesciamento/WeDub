var pulLogout = document.getElementById('PulsanteFB');

function StatoLoginUtente(response) {
	
	switch(response.status) {
		case "connected": VerificaUtente(); break;
		
		default: pulLogout.innerHTML = "Sei uscito da Facebook! Verrai reindirizzato al login!"; pulLogout.style.width = "300px"; pulLogout.style.height = "100px"; Logout(true);
	}
	
	function VerificaUtente() {
		console.log('Caricamento...');
		FB.api('/me', {fields: 'id, name, email, picture'}, function(DatiPrincipali) {
			console.log('Login per: ', DatiPrincipali);
			try { if (DatiPrincipali.error.message.indexOf("unknown error") > -1) {return;} } catch(e) {} // Probabile che è stata cambiata pagina prima che l'Api Facebook abbia potuto dare la risposta
			
			if (DatiPrincipali.id != UID) {
				pulLogout.innerHTML = "Hai cambiato identità Facebook! Verrai reindirizzato al login!"; pulLogout.style.width = "300px"; pulLogout.style.height = "100px";
				Logout(true);
			}
		});
	}
}

pulLogout.innerHTML = "";
