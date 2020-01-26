<?php /*** Richiamato con AJAX ***/

	require("fSistema.php"); require("fFaiQuery.php"); require("fTorna.php"); require("connessione.php"); 
		
	$NomeRicerca = Sistema($_POST['Nome']);
		
	$Contenuto = FaiQuery("SELECT ID, Nome, FotoProfilo FROM UtentiRegistrati WHERE LOCATE('$NomeRicerca', Nome) ORDER BY Nome ASC");
	
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
