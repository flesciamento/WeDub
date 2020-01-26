<?php /*** Richiamato con AJAX ***/ 
Session_start();

if (!$_SESSION['ID'] || !isset($_FILES)) {header("location: https://" . $_SERVER['SERVER_NAME'] . "/index.php"); exit;}

function Errore($Messaggio) {
	echo "{\"Errore\": \"$Messaggio\"}"; exit;
}

require("ControlloImmagine.php");
require("RidimensionaImmagine.php");
require("CreaPercorso.php");

require("connessione.php"); $TipiConsentiti = array("image/png", "image/x-png", "image/jpeg", "image/pjpeg");
	if (($_FILES["Foto"]["error"] != 0) || (trim($_FILES["Foto"]["name"]) == "")) {
		Errore("Errore nel caricamento del file.");
	} else {
	  $strNome = $_FILES["Foto"]["name"];
	  $Controllo = ControllaImmagine($strNome, $_FILES["Foto"]["tmp_name"]); $Tipo = $Controllo[1];

	  $strNome = $_SESSION['ID'] . "_" . preg_replace("/[^a-zA-Z0-9\.]+/", "_", $strNome); //Sostituice il nome originale col nome più compatibile per il programma
	
	/* Controllo tipologia di immagine */
	if (!in_array($Tipo, $TipiConsentiti)) {
		Errore("Tipo di immagine non riconosciuto ($Tipo).<br>Caricare file 'png' o 'jpg'.");
	} else {
		$Cartella = "FotoProfilo/"; 
		$Percorso = RidimensionaImmagine("auto", 60, $Controllo[2], $Controllo[3], $Tipo, $_FILES["Foto"]["tmp_name"], $Cartella, $strNome);
		
        @unlink($_FILES["Foto"]["tmp_name"]);
		
		echo "{\"PercorsoFotoProfilo\": \"$Percorso\"}";  	
	
		/* Inserimento relativa riga nel database 
		  $SQL = "INSERT INTO UtentiRegistrati (FotoProfilo) VALUES ('$P', '$NumFU', '$strNome');";
		  $Stringa .= (query($SQL)) ? "</td><td><font color=green size=4><b>foto salvata correttamente.</b></font>" : "</td><td><font color=red><b>Errore inserimento foto nel database.</b></font>";
		  ChiudiMySql();*/
	}
  }

?>