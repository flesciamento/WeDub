<?php /*** Richiamato con AJAX ***/
	require("fTorna.php"); require("fFaiQuery.php"); require("connessione.php"); 
	
	$Risposta = mysqli_fetch_row(FaiQuery("SELECT ID_CreatoreProgetto FROM Progetti WHERE NumProgetto = '" . $_POST['NumProgetto'] . "'"));
	
	ChiudiMySql();
	
	Torna("{\"ID_CreatoreProgetto\": \"" . $Risposta[0] . "\"}");
?>
