<?php /*** Richiamato con AJAX ***/
	require("fFaiQuery.php"); require("fTorna.php"); require("ControllaAccesso_AJAX.php"); require("connessione.php");
		
	$Contenuto = FaiQuery("SELECT ID, Nome, FotoProfilo FROM UtentiRegistrati WHERE Cancellato = false AND LOCATE('" . str_replace("'", "\\'", $_POST['Filtro']) . "', Nome) ORDER BY Nome ASC");
	
	if (mysqli_num_rows($Contenuto)) {
		$strUtenti = "[";
		while($Elementi = mysqli_fetch_assoc($Contenuto)) {
			$strUtenti .= "{";
			foreach($Elementi as $Nome => $Valore) {
				$strUtenti .= "\"$Nome\": \"$Valore\",";
			}
			$strUtenti = substr($strUtenti, 0, -1) . "},";
		}
		$strUtenti = substr($strUtenti, 0, -1) . "]";
	}
	
	ChiudiMySql();
	
	Torna($strUtenti);
?>
