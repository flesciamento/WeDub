<?php

require("fRichiesteHTTPS.php");

function VerificaTokenFB($TokenDaEsaminare, $ID_Utente) {
	require("AcquisisciTokenAppFB.php");
	
	$Verifica = HTTPS_RichiestaGET("https://graph.facebook.com/debug_token", "input_token=$TokenDaEsaminare&access_token=$TokenAPP");
	
	return !(isset($Verifica['error']) || isset($Verifica['data']['error']) || ($Verifica['data']['app_id'] != "[APP ID]") || ($Verifica['data']['user_id'] != $ID_Utente));
}
?>

