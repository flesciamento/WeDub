<?php /*** Richiamato con AJAX ***/
Session_start();

	require("fNomeFileRegistrazione.php"); require("fTorna.php"); require("fFaiQuery.php"); require("connessione.php"); 
	
	if (!mysqli_num_rows($Registrazioni = FaiQuery("SELECT * FROM Registrazioni WHERE NumProgetto = '" . $_POST['NumProgetto'] . "' AND NumProvino = '" . $_POST['NumProvino'] . "' AND ID_Utente = '" . $_POST['IDUtente'] . "' AND Rimosso = 'no' ORDER BY MinutaggioRegistrazione ASC"))) {Torna("Non c'è nessuna traccia da scaricare per il doppiatore selezionato!", true);}
	
	$DatiProgetto = mysqli_fetch_assoc(FaiQuery("SELECT * FROM Progetti WHERE NumProgetto = '" . $_POST['NumProgetto'] . "'"));
	
	$DatiUtente = mysqli_fetch_assoc(FaiQuery("SELECT * FROM UtentiRegistrati WHERE ID = '" . $_POST['IDUtente'] . "'"));
	
	
	$NomeFile = "Registrazioni/" . $_SESSION['ID'] . ".ogg"; @unlink($NomeFile);
	
	$ClipAudio = ""; $Silenzio = file_get_contents("Silenzio.ogg"); $MinutaggioPrec = 0; $DurataPrec = 0;
	while($DatiRegistrazione = mysqli_fetch_assoc($Registrazioni)) {
		$PosizioneFinalePrec = floatval($MinutaggioPrec + $DurataPrec);
		$PosizioneAttuale = intval((floatval($DatiRegistrazione['MinutaggioRegistrazione']) - $PosizioneFinalePrec) * 10);
		$ClipAudio .= str_repeat($Silenzio, ($PosizioneAttuale < 0 ? 0 : $PosizioneAttuale)) . file_get_contents($DatiRegistrazione['Registrazione']);  // purtroppo facendo così crea un file della lunghezza giusta, ma vuoto. Togliendo la ripetizione del Silenzio, invece, si crea un file continuo di tutte le clip, inutile.
		
		$MinutaggioPrec = floatval($DatiRegistrazione['MinutaggioRegistrazione']); $DurataPrec = floatval($DatiRegistrazione['DurataRegistrazione']);
	}
	
	file_put_contents($NomeFile, $ClipAudio);

		//~ $TaggingFormat = 'UTF-8';
		//~ require('getID3-master/getid3/getid3.php');
		//~ // Initialize getID3 engine
		//~ $getID3 = new getID3;
		//~ $getID3->setOption(array('encoding'=>$TaggingFormat));

		//~ require('getID3-master/getid3/write.php');
		//~ // Initialize getID3 tag-writing module
		//~ $tagwriter = new getid3_writetags;
		//~ //$tagwriter->filename = '/path/to/file.mp3';
		//~ $tagwriter->filename = $NomeFile;
		//~ //$tagwriter->tagformats = array('id3v1', 'id3v2.3');
		//~ //$tagwriter->tagformats = array('id3v2.3');
		//~ // set various options (optional)
		//~ $tagwriter->overwrite_tags = true;
		//~ $tagwriter->tag_encoding = $TaggingFormat;
		//~ $tagwriter->remove_other_tags = true;
		//~ // populate data array
		//~ $TagData = array(
			//~ 'title'   => array('WEDUB'),
			//~ 'artist'  => array($DatiUtente['Nome']),
			//~ 'album'   => array($DatiProgetto['NomeProgetto']),
			//~ 'year'    => array($DatiProgetto['NomeDoppiaggio']),
			//~ 'track'   => array(Date("d/m/Y")),
		//~ );
		//~ $tagwriter->tag_data = $TagData;
		//~ // write tags
		//~ $tagwriter->WriteTags();
	
	ChiudiMySql();
	
	Torna("{\"NomeTracciaUnica\": \"$NomeFile\", \"PosizioneAttualeUltima\": \"$PosizioneAttuale\", \"PosizioneFinalePrecUltima\": \"$PosizioneFinalePrec\"}");
?>
