<?php 
    require("ControllaAccesso.php");
	require("fEliminaCaratteriSpeciali.php"); require("fSistema.php"); require("SistemaLeVariabiliPerProgetti.php"); require("connessione.php"); 
	
	$NumeroProgetto = $_POST['NumProgetto']; 
	
	query("UPDATE Progetti SET NomeProgetto = '$NomeProgetto', NomeDoppiaggio = '$NomeDoppiaggio', Descrizione = '', LinkCopione = '$LinkCopione', PiattaformaVideo = '" . $_POST['PiattaformaVideo'] . "', PercorsoVideo = '" . $_POST['PercorsoVideo'] . "' WHERE NumProgetto = '$NumeroProgetto'");
	
	
	query("DELETE FROM Ruoli WHERE NumProgetto = '$NumeroProgetto'");
	
	for($I = 1; $I <= $_POST['NumeroDoppiatori']; $I++) {
		if ($ID_Doppiatore = Sistema($_POST["ID_Doppiatore$I"])) {
			$RuoloDoppiatore = EliminaParentesiAcute(Sistema($_POST["RuoloDoppiatore$I"]));
			query("INSERT INTO Ruoli (NumProgetto, ID_Utente, Ruolo) VALUES('$NumeroProgetto', '$ID_Doppiatore', '$RuoloDoppiatore')");
		}
	}
	
	header("location: GestioneProgetto.php?N=$NumeroProgetto"); exit;
?>
