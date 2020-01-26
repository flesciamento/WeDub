<?php /*** Richiamato con AJAX ***/
require("fFaiQuery.php"); require("fTorna.php"); require("ControllaAccesso_AJAX.php"); require("connessione.php");
		
		$FiltraSoloUtentiAttivi = ($_POST['NumProvino'] == 0) ? "Ruoli.NumProgetto = Registrazioni.NumProgetto AND Registrazioni.ID_Utente = Ruoli.ID_Utente" : "Ruoli.NumProgetto = 0"; // Se i doppiatori del progetto sono stati modificati, carica solo quelli attualmente attivi, ovvero evita di caricare registrazioni di utenti che non sono più nel progetto.
		
	$Contenuto = FaiQuery("SELECT Registrazioni.*, UtentiRegistrati.DataUltimaAzione FROM Registrazioni, Ruoli, UtentiRegistrati WHERE Registrazioni.NumProgetto = '" . $_POST['NumProgetto'] . "' AND Registrazioni.NumProvino = '" . $_POST['NumProvino'] . "' AND $FiltraSoloUtentiAttivi AND UtentiRegistrati.ID = Registrazioni.ID_Utente");
	
	$strRegistrazioni = "[";
	if (mysqli_num_rows($Contenuto)) {
		
		while($Elementi = mysqli_fetch_assoc($Contenuto)) {
			
			if ($Elementi['Rimosso'] == "si") {
				if ($Elementi['DataRimozione'] <= strtotime("2 days ago")) {
					FaiQuery("DELETE FROM Registrazioni WHERE N = '" . $Elementi['N'] . "'");
					@unlink($Elementi['Registrazione']);
					continue;
				}
			}
			
			$Elementi['Data'] = "del " . Date("d/m/Y", $Elementi['Data']) . " alle " . Date("H:i", $Elementi['Data']);
			
			$strRegistrazioni .= "{";
			foreach($Elementi as $Nome => $Valore) {
				$strRegistrazioni .= "\"$Nome\": \"$Valore\",";
			}
			$strRegistrazioni = substr($strRegistrazioni, 0, -1) . "},";
		}
		
		$strRegistrazioni = substr($strRegistrazioni, 0, -1);
		
	}
	$strRegistrazioni .= "]";
	
	ChiudiMySql();
	
	Torna($strRegistrazioni);
?>
