<?php /*** Richiamato con AJAX ***/
Session_start();

	require("fNomeFileRegistrazione.php"); require("fTorna.php"); require("fFaiQuery.php"); require("connessione.php"); 
	
	if (!mysqli_num_rows($Registrazioni = FaiQuery("SELECT * FROM Registrazioni WHERE NumProgetto = '" . $_POST['NumProgetto'] . "' AND NumProvino = '" . $_POST['NumProvino'] . "' AND ID_Utente = '" . $_POST['IDUtente'] . "' AND Rimosso = 'no' ORDER BY MinutaggioRegistrazione ASC"))) {Torna("Non c'è nessuna traccia da scaricare per il doppiatore selezionato!", true);}
	
	$DatiProgetto = mysqli_fetch_assoc(FaiQuery("SELECT * FROM Progetti WHERE NumProgetto = '" . $_POST['NumProgetto'] . "'"));
	
	$DatiUtente = mysqli_fetch_assoc(FaiQuery("SELECT * FROM UtentiRegistrati WHERE ID = '" . $_POST['IDUtente'] . "'"));
	
	$NomeDoppiaggio = ($DatiProgetto['Tipo'] == "Doppiaggio" ? $DatiProgetto['NomeDoppiaggio'] : "Provino per " . $DatiProgetto['RuoloProvino']);
	
	$Archivio = new ZipArchive();
	
	$FileZip = "Registrazioni/" . $_SESSION['ID'] . ".zip";	@unlink($FileZip);
	
	if ($Archivio -> open($FileZip, ZIPARCHIVE::CREATE) !== TRUE) {Torna("Errore nella creazione del file zip $FileZip", true);}
	
	while($DatiRegistrazione = mysqli_fetch_assoc($Registrazioni)) {
		$Archivio -> addFile($DatiRegistrazione['Registrazione'], NomeFileRegistrazioneDaScaricare($DatiRegistrazione['Registrazione'], $DatiProgetto['NomeProgetto'], $NomeDoppiaggio, $DatiUtente['Nome'], $DatiRegistrazione['MinutaggioRegistrazione']));
	}
	
	$Archivio -> close();
	
	ChiudiMySql();
	
	Torna("{\"NomeArchivioZip\": \"$FileZip\"}");
?>
