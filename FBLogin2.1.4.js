var pulLoginFB = document.getElementById('PulsanteFB');

function CreaElementoInputNascosto(IDeNome, Form, Dato) {
	var ElementoInputNascosto = CreaElemento('input', IDeNome, Form); ElementoInputNascosto.setAttribute('type', 'hidden'); ElementoInputNascosto.value = Dato;
}
	
	function StatoLoginUtente(response) {
		console.log('StatoLoginUtente', response);
		
		switch(response.status) {
			case "connected": AttivaPulsantiAccediIscriviti(false); AcquisisciInfo(response.authResponse.accessToken); break;
			
			case "not_authorized": pulLoginFB.innerHTML = '<img src="images/FB_PulsanteLogin.png">'; pulLoginFB.style.width = "400px"; pulLoginFB.addEventListener('click', FaiLogin);
								   AttivaPulsantiAccediIscriviti(true); break;
			
			default: pulLoginFB.innerHTML = '<img src="images/FB_PulsanteAccedi_norm_350.png">'; pulLoginFB.style.width = "400px"; pulLoginFB.addEventListener('click', FaiLogin);
					 AttivaPulsantiAccediIscriviti(true);
					 // Il pulsante di Facebook non conviene perché alcuni browser bloccano il popup - document.getElementById('CaricamentoFB').innerHTML = '<div id="pulFB" class="fb-login-button" onlogin="StatoLoginUtente" scope="public_profile,user_friends,email" data-width="800" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true"></div>';
		}
	}

	function AttivaPulsantiAccediIscriviti(Attiva) {
		var pulAccedi, pulIscriviti;
		try {pulAccedi = document.getElementById('pulAccedi');} catch(err) {pulAccedi = false;}
		try {pulIscriviti = document.getElementById('pulIscriviti');} catch(err) {pulIscriviti = false;}
		
		if (pulAccedi) {pulAccedi.style.display = Attiva? 'inline' : 'none';}
		if (pulIscriviti) {pulIscriviti.style.display = Attiva? 'inline' : 'none';}
		
		if (Attiva) {
			try {AzioneInCasoNonLoggatoFB();} catch(err) {}
		}
	}

	function FaiLogin() {
		FB.login(function(response) {
			StatoLoginUtente(response);
		}, {scope: 'public_profile,email'});
	}
  
    function AcquisisciInfo(T) {
		console.log('Caricamento...');
		FB.api('/me', {fields: 'id, name, email, picture'}, function(DatiPrincipali) {
			console.log('Login per: ', DatiPrincipali);
			pulLoginFB.innerHTML = "";
			var frmDatiPrincipali = CreaElemento('form', 'frmDatiPrincipali', 'PulsanteFB');
				CreaElementoInputNascosto('id', 'frmDatiPrincipali', DatiPrincipali.id); CreaElementoInputNascosto('name', 'frmDatiPrincipali', DatiPrincipali.name);
				CreaElementoInputNascosto('T', 'frmDatiPrincipali', T);
				if (DatiPrincipali.email) {CreaElementoInputNascosto('email', 'frmDatiPrincipali', DatiPrincipali.email);}
				CreaElementoInputNascosto('picture', 'frmDatiPrincipali', DatiPrincipali.picture.data.url);
				
				CreaElementoInputNascosto('Pag', 'frmDatiPrincipali', document.getElementById('Pag').value); CreaElementoInputNascosto('FB', 'frmDatiPrincipali', 1);
				
			frmDatiPrincipali.method = "post"; frmDatiPrincipali.action = "https://" + window.location.hostname + "/WEDUB/FaiLogin.php";
			document.getElementById('imgFotoProfilo').src = "";
			CreaElemento('div', 'pulfrmLogin', 'frmDatiPrincipali', '<img class="FotoProfilo" src="' + DatiPrincipali.picture.data.url + '">&nbsp;<img src="images/FB_PulsanteAccedi_maiuscolo_350.png">');
			pulLoginFB.style.width = "500px"; pulLoginFB.removeEventListener('click', FaiLogin);
			pulLoginFB.addEventListener('click', function () {document.getElementById('frmDatiPrincipali').submit();});
			
			AzioneDopoLoginFB(DatiPrincipali);
		});
		
		//~ FB.api("/me/friends", function(response) {
			//~ // Visualizza solo gli amici che usano l'app
			//~ console.log(response);
			//~ if (response.data.length) {
				//~ CreaElemento('ul', 'ElencoPuntato', 'amici');
				//~ response.data.forEach(VisualizzaAmici);
			//~ }
		//~ });
				
    }
  
	//~ function VisualizzaAmici(Amico, Indice) {
		//~ CreaElemento('li', 'EP' + Indice, 'ElencoPuntato', Amico.name);
	//~ }
