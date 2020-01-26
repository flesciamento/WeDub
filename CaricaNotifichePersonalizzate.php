<?php Session_start();
require("connessione.php"); 

	$Doppiaggi = query("SELECT UtentiRegistrati.Nome, UtentiRegistrati.FotoProfilo, Progetti.*, Ruoli.Ruolo, Provini.NumProvino, Provini.DataProvino FROM Progetti, UtentiRegistrati, Ruoli, Provini WHERE 
							IF(Progetti.Tipo = 'Doppiaggio',
								Ruoli.NumProgetto = Progetti.NumProgetto AND Ruoli.ID_Utente = '" . $_SESSION['ID'] . "' AND Progetti.ID_CreatoreProgetto != '" . $_SESSION['ID'] . "' AND UtentiRegistrati.ID = Progetti.ID_CreatoreProgetto AND Provini.NumProvino = 0,
								Ruoli.NumProgetto = 0 AND IF (Progetti.ID_CreatoreProgetto = '" . $_SESSION['ID'] . "', 
									Provini.NumProgetto = Progetti.NumProgetto AND UtentiRegistrati.ID = Provini.ID_UtenteProvinante AND Provini.ProvinoPubblicato = 1,
									Provini.NumProvino = 0 AND UtentiRegistrati.ID = Progetti.ID_CreatoreProgetto
								)
							)
						ORDER BY Provini.DataProvino DESC, Progetti.DataUltimaModifica DESC LIMIT 20"
	);
	
	
	$strNotifiche = "[";
	
	if (mysqli_num_rows($Doppiaggi)) {
		
		while($Elementi = mysqli_fetch_assoc($Doppiaggi)) {
			
			$strNotifiche .= "{\"Utente\": \"" . $Elementi['Nome'] . "\", \"FotoUtente\": \"" . $Elementi['FotoProfilo'] . "\",";
			if ($Elementi['Tipo'] == "Provino") {
				
				if ($Elementi['ID_CreatoreProgetto'] == $_SESSION['ID']) {
					$strNotifiche .= "\"Data\": \"" . Date("d/m", $Elementi['DataProvino']) . "\",
									  \"Testo\": \"Postato provino da valutare per <b>" . $Elementi['RuoloProvino'] . "</b> di " . $Elementi['NomeProgetto'] . "<br>[VALUTA IL PROVINO!]\",
									  \"Link\": \"Doppiaggio.php?N=" . $Elementi['NumProgetto'] . "&P=" . $Elementi['NumProvino'] . "\"},";
				} else {
					$strNotifiche .= "\"Data\": \"" . Date("d/m", $Elementi['DataUltimaModifica']) . "\",
									  \"Testo\": \"" . ($Elementi['Stato'] ? "Chiuso" : "Aperto") . " il provino per <b>" . $Elementi['RuoloProvino'] . "</b> di " . $Elementi['NomeProgetto'] . "\",
									  \"Link\": \"FaiProvino.php?N=" . $Elementi['NumProgetto'] . "\"},";
				}
				
			} else {
				$strNotifiche .= "\"Data\": \"" . Date("d/m", $Elementi['DataUltimaModifica']) . "\",
								  \"Testo\": \"" . ($Elementi['Stato'] ? "Marcato come COMPLETATO: " : "Aperto il progetto ") . "<i>" . $Elementi['NomeProgetto'] . " - " . $Elementi['NomeDoppiaggio'] . "</i>" . " dove ti è stato affidato il ruolo di <b>" . $Elementi['Ruolo'] . "</b>" . ($Elementi['Stato'] ? "" : "<br>[DOPPIA ORA!]") . "\",
								  \"Link\": \"Doppiaggio.php?N=" . $Elementi['NumProgetto'] . "\"},";
			}
			
		}
		
		$strNotifiche = substr($strNotifiche, 0, -1);
		
	}
	
	$strNotifiche .= "]";
	

ChiudiMySql();
	
	echo $strNotifiche;
?>
