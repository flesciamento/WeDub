<?php
function HTTPS_RichiestaGET($Indirizzo, $Parametri) {
	/* Richiesta GET
	 * Indirizzo è l'indirizzo della pagina
	 * Parametri dev'essere inviata come stringa */
	$url = "$Indirizzo?$Parametri";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_GET, 1);
	//curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	$json = json_decode($response, true);
	curl_close($ch);
	return $json;
}

function HTTPS_RichiestaPOST($Indirizzo, $Parametri) {
	/* Richiesta POST
	 * Indirizzo è l'indirizzo della pagina
	 * Parametri dev'essere inviata come stringa */
	$ch = curl_init($Indirizzo);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $Parametri);
	$response = curl_exec($ch);
	$json = json_decode($response, true);
	curl_close($ch);
	return $json;
}

function HTTPS_RichiestaDELETE($Indirizzo, $Parametri) {
	$url = "$Indirizzo?$Parametri";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	$json = json_decode($response, true);
	curl_close($ch);
	return $json;
}
?>
