<?php 
$DatiAPP = HTTPS_RichiestaGET("https://graph.facebook.com/oauth/access_token", "client_id=[APP ID]&client_secret=[CLIENT SECRET]&grant_type=client_credentials");
	
$TokenAPP = $DatiAPP['access_token'];
?>
