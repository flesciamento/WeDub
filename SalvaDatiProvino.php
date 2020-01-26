<?php 
    require("ControllaAccesso.php"); require("fEliminaCaratteriSpeciali.php"); require("fSistema.php"); require("SistemaLeVariabiliPerProgetti.php"); require("SistemaLeVariabiliPerProvino.php"); require("connessione.php"); 
	
	$NumeroProgetto = $_POST['NumProgetto'];
		
	query("UPDATE Progetti SET NomeProgetto = '$NomeProgetto', NomeDoppiaggio = '$NomeDoppiaggio', Descrizione = '', LinkCopione = '$LinkCopione', PiattaformaVideo = '" . $_POST['PiattaformaVideo'] . "', PercorsoVideo = '" . $_POST['PercorsoVideo'] . "', RuoloProvino = '$RuoloProvino', SessoProvino = " . $_POST['SessoProvino'] . ", EtaProvino = " . $_POST['EtaProvino'] . ", DescrizioneProvino = '$DescrizioneProvino' WHERE NumProgetto = '$NumeroProgetto'");
	
	header("location: GestioneProvino.php?N=$NumeroProgetto"); exit;
?>
