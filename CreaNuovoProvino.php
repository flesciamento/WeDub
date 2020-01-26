<?php Session_start();
	require("fEliminaCaratteriSpeciali.php"); require("fSistema.php"); require("SistemaLeVariabiliPerProgetti.php"); require("SistemaLeVariabiliPerProvino.php"); require("fChiavePrimariaUltimaOperazione.php"); require("connessione.php"); 

	query("INSERT INTO Progetti (DataCreazione, ID_CreatoreProgetto, Tipo, NomeProgetto, NomeDoppiaggio, Descrizione, LinkCopione, Stato, PiattaformaVideo, PercorsoVideo, RuoloProvino, SessoProvino, EtaProvino, DescrizioneProvino, DataUltimaModifica) VALUES(" . time() . ", '" . $_SESSION['ID'] . "', 'Provino', '$NomeProgetto', '$NomeDoppiaggio', '', '$LinkCopione', 0, '" . $_POST['PiattaformaVideo'] . "', '" . $_POST['PercorsoVideo'] . "', '$RuoloProvino', " . $_POST['SessoProvino'] . ", " . $_POST['EtaProvino'] . ", '$DescrizioneProvino', " . time() . ")");

	$NumeroProgetto = ChiavePrimariaUltimaOperazione();
	
	header("location: GestioneProvino.php?N=$NumeroProgetto"); exit;
?>
