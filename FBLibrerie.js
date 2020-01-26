window.fbAsyncInit = function() {
    FB.init({
      appId      : '[APP ID]',
      cookie	 : true,
      xfbml      : true,
      version    : 'v3.3'
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
