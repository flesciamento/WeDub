<?php /*** Richiamato con AJAX ***/

	require("fFaiQuery.php"); require("fTorna.php"); require("connessione.php"); 
	
	$DataRimozione = (($Rimosso = ($_POST['Rimosso'] == "si")) ? time() : 0);
	
	FaiQuery("UPDATE Registrazioni SET MinutaggioRegistrazione = '" . $_POST['MinutaggioRegistrazione'] . "', Guadagno = '" . $_POST['Guadagno'] . "', Rimosso = '" . $_POST['Rimosso'] . "', DataRimozione = '$DataRimozione' WHERE N = '" . $_POST['N'] . "'");
	
	ChiudiMySql();
	
	Torna("{\"Aggiornato\": \"OK\"}");
?>
