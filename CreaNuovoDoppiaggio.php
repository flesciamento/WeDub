<?php Session_start();
	require("fEliminaCaratteriSpeciali.php"); require("fSistema.php"); require("SistemaLeVariabiliPerProgetti.php"); require("fChiavePrimariaUltimaOperazione.php"); require("connessione.php"); 
	
	query("INSERT INTO Progetti (DataCreazione, ID_CreatoreProgetto, Tipo, NomeProgetto, NomeDoppiaggio, Descrizione, LinkCopione, Stato, PiattaformaVideo, PercorsoVideo, DataUltimaModifica) VALUES(" . time() . ", '" . $_SESSION['ID'] . "', 'Doppiaggio', '$NomeProgetto', '$NomeDoppiaggio', '', '$LinkCopione', 0, '" . $_POST['PiattaformaVideo'] . "', '" . $_POST['PercorsoVideo'] . "', " .  time() . ")");

	$NumeroProgetto = ChiavePrimariaUltimaOperazione();
	
	for($I = 1; $I <= $_POST['NumeroDoppiatori']; $I++) {
		if ($ID_Doppiatore = Sistema($_POST["ID_Doppiatore$I"])) {
			$RuoloDoppiatore = EliminaParentesiAcute(Sistema($_POST["RuoloDoppiatore$I"]));
			query("INSERT INTO Ruoli (NumProgetto, ID_Utente, Ruolo) VALUES('$NumeroProgetto', '$ID_Doppiatore', '$RuoloDoppiatore')");
		}
	}
	
	header("location: GestioneProgetto.php?N=$NumeroProgetto"); exit;
?>
