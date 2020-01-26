<?php /*** Richiamato con AJAX ***/
    require("fFaiQuery.php"); require("fTorna.php"); require("ControllaAccesso_AJAX.php"); require("connessione.php"); require("fChiavePrimariaUltimaOperazione.php");
	
	$NumProgetto = $_POST['NumProgetto']; $NumProvino = $_POST['NumProvino']; $Nickname = $_POST['Utente'];

	/*** Determina il nome del file univoco grazie alla data e lo salva ***/	
	$EstensioneFile = ($_POST["Video"] == "si" ? ".webm" : ".flac"); $Data = Date("y-m-d-H-i-s");
	$NomeFileRegistrazione = "Registrazioni/P$NumProgetto-$Nickname-$Data$EstensioneFile";
	fwrite($IDFile = fopen($NomeFileRegistrazione, "wb"), file_get_contents($_POST["Registrazione"])); fclose($IDFile);
	
	/*** Memorizza tutte le informazioni della registrazione ***/
	FaiQuery("INSERT INTO Registrazioni (NumProgetto, NumProvino, ID_Utente, Data, Registrazione, MinutaggioRegistrazione, DurataRegistrazione, Video, Rimosso) VALUES($NumProgetto, $NumProvino, '$Nickname', '" . time() . "', '$NomeFileRegistrazione', '". $_POST["MinutaggioRegistrazione"] . "', '" . $_POST["DurataRegistrazione"] . "', '" . $_POST["Video"] . "', 'no')");
	
	$ChiavePrimaria = ChiavePrimariaUltimaOperazione();
	
	ChiudiMySql();
	
	Torna("{\"Numero\": \"$ChiavePrimaria\", \"NomeFile\": \"$NomeFileRegistrazione\"}");
?>
