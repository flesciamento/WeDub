<?php 
$DatiAPP = HTTPS_RichiestaGET("https://graph.facebook.com/oauth/access_token", "client_id=806415089524313&client_secret=52dfbd3b25c3c848102152bdd98aacb7&grant_type=client_credentials");
	
$TokenAPP = $DatiAPP['access_token'];
?>
