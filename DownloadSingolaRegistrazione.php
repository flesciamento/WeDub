<?php /*** Richiamato con AJAX ***/
	require("fNomeFileRegistrazione.php");
	
	echo "{\"NomeFile\": \"" . NomeFileRegistrazioneDaScaricare($_POST['FileOriginale'], $_POST['NomeProgetto'], $_POST['NomeDoppiaggio'], $_POST['NomeUtente'], $_POST['MinutaggioRegistrazione']) . "\"}";
?>
