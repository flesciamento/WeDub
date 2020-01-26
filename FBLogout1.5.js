function StatoLoginUtente(response) {
	
	var pulLogout = document.getElementById('PulsanteFB');
	
	switch(response.status) {
		case "connected": pulLogout.innerHTML = "<img src='images/FB_PulsanteLogout.png'>"; pulLogout.style.width = "300px"; pulLogout.addEventListener('click', FBLogout); break;
		
		default: pulLogout.innerHTML = "Sei uscito da Facebook! Verrai reindirizzato al login!"; pulLogout.style.width = "300px"; pulLogout.style.height = "100px"; Logout(true);
	}
}
