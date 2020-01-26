var Token;
	
	function StatoLoginUtente(response) {
		console.log('StatoLoginUtente', response);
		
		var pulLogin;
		
		switch(response.status) {
			case "connected": testAPI(); break;
			
			case "not_authorized": pulLogin = document.getElementById('pulLogin'); pulLogin.innerHTML = '<img src="images/FB_PulsanteLogin.png">'; pulLogin.addEventListener('click', FaiLogin); break;
			
			default: pulLogin = document.getElementById('pulLogin'); pulLogin.innerHTML = '<img src="images/FB_PulsanteContinua.png">'; pulLogin.addEventListener('click', FaiLogin);
					 // Il pulsante di Facebook non conviene perché alcuni browser bloccano il popup - document.getElementById('status').innerHTML = '<div id="pulFB" class="fb-login-button" onlogin="StatoLoginUtente" scope="public_profile,user_friends,email" data-width="800" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true"></div>';
		}
	}

	function FaiLogin() {
		FB.login(function(response) {
			StatoLoginUtente(response);
		}, {scope: 'public_profile,user_friends,email'});
	}

    function checkLoginState() {
		FB.getLoginStatus(function(response) {
		  StatoLoginUtente(response);
		});
    }  

window.fbAsyncInit = function() {
    FB.init({
      appId      : '[APP ID]',
      cookie	 : true,
      xfbml      : true,
      version    : 'v2.9'
    });
    
    FB.AppEvents.logPageView();
    
    FB.getLoginStatus(function(response) {
		StatoLoginUtente(response);
	});
};

  (function(d, s, id) {
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/it_IT/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   } (document, 'script', 'facebook-jssdk'));

  
    function testAPI() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', {fields: 'id, name, email'}, function(DatiPrincipali) {
			console.log('Login per: ', DatiPrincipali);
			document.getElementById('status').innerHTML = 'Grazie per esserti loggato ' + DatiPrincipali.name + '!<br>';
			var pulLogout = document.getElementById('pulLogout');
			pulLogout.style.display = "block"; pulLogout.addEventListener('click', FaiLogout);
			
			FB.api("/me", {fields: 'email'}, function(response) {
				console.log("{fields: 'email'}", response);
				document.getElementById('status').innerHTML = "La tua e-mail è: " + response.email;
			});
		});
		
		FB.api("/me/friends", function(response) {
			// Visualizza solo gli amici che usano l'app
			console.log(response);
			if (response.data.length) {
				CreaElemento('ul', 'ElencoPuntato', 'amici');
				response.data.forEach(VisualizzaAmici);
			}
		});
				
    }
  
	function VisualizzaAmici(Amico, Indice) {
		CreaElemento('li', 'EP' + Indice, 'ElencoPuntato', Amico.name);
	}
  
    function FaiLogout() {
		FB.logout(function(response) {console.log("Logout", response);});
    }
