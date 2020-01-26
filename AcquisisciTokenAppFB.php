<?php 
$DatiAPP = HTTPS_RichiestaGET("https://graph.facebook.com/oauth/access_token", "client_id=[INSERT CLIENT ID]&client_secret=[INSERT CLIENT SECRET]&grant_type=client_credentials");
	
$TokenAPP = $DatiAPP['access_token'];
?>
