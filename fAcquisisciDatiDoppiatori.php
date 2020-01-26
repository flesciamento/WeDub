<?php
function AcquisisciDatiDoppiatori($NumeroProgetto) {
	$DD = query("SELECT * FROM Ruoli, UtentiRegistrati WHERE Ruoli.NumProgetto = '$NumeroProgetto' AND UtentiRegistrati.ID = Ruoli.ID_Utente ORDER BY ID_Utente = '" . $_SESSION['ID'] . "' DESC");

	$NumeroDoppiatori = 0;
	while($Elementi = mysqli_fetch_assoc($DD)) {
		$NumeroDoppiatori++;
		foreach($Elementi as $Nome => $Valore) {
			$DatiDoppiatori[$NumeroDoppiatori][$Nome] = $Valore;
		}
	}
	
	return $DatiDoppiatori;
}
?>
