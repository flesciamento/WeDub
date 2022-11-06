<?php /*** Richiamato con AJAX ***/
Session_start();
require("fFaiQuery.php"); require("fSistema.php"); require("fTorna.php"); require("connessione.php"); require("fCreaRigaJSON.php"); require("fEliminaFileRegistrazione.php");

$N = $_POST['NumProgetto']; $P = $_POST['NumProvino']; $FiltraSoloMieRegistrazioni = ""; $AggiungiCandidatoRuoliDaAssegnare = "";
/* Carica le clip solo per gli utenti registrati oppure per qualunque visitatore solo se il progetto è stato completato */
$StatoProgetto = RisultatoQuery("SELECT Stato FROM Progetti WHERE NumProgetto = '$N'");
if ($StatoProgetto == 0) {require("ControllaAccesso_AJAX.php"); $FiltraSoloMieRegistrazioni = (($_POST['SoloMieRegistrazioni'] == 1) ? "AND Registrazioni.ID_Utente = '" . $_SESSION['ID'] . "'" : ""); $AggiungiCandidatoRuoliDaAssegnare = (($_POST['IDCandidatoRuoliDaAssegnare'] != "") ? " OR (Registrazioni.ID_Utente = '" . $_POST['IDCandidatoRuoliDaAssegnare'] . "' AND Ruoli.NumProgetto = 0)" : "");}

		$FiltraSoloUtentiAttivi = (($P == 0) ? "((Ruoli.NumProgetto = Registrazioni.NumProgetto AND Registrazioni.ID_Utente = Ruoli.ID_Utente) $AggiungiCandidatoRuoliDaAssegnare)" : "Ruoli.NumProgetto = 0"); // Se i doppiatori del progetto sono stati modificati, carica solo quelli attualmente attivi, ovvero evita di caricare registrazioni di utenti che non sono più nel progetto.

		$FiltroStreaming = (($_POST['Streaming'] == 1) ? "AND Registrazioni.Rimosso = 'no'" : "");

		$FiltroMinutaggio = (($_POST['FinoAlMinuto'] != "") ? "AND Registrazioni.MinutaggioRegistrazione <= " . $_POST['FinoAlMinuto'] : "") . (($_POST['DalMinuto'] != "") ? " AND Registrazioni.MinutaggioRegistrazione >= " . $_POST['DalMinuto'] : "");
		
	$Contenuto = FaiQuery("SELECT Registrazioni.* FROM Registrazioni, Ruoli WHERE Registrazioni.NumProgetto = '$N' AND Registrazioni.NumProvino = '$P' AND Registrazioni.Danneggiato = 0 AND $FiltraSoloUtentiAttivi $FiltroStreaming $FiltroMinutaggio $FiltraSoloMieRegistrazioni ORDER BY Registrazioni.MinutaggioRegistrazione ASC");
	
	$strRegistrazioni = "";
	while($Elementi = mysqli_fetch_assoc($Contenuto)) {
		$NumRegistrazione = $Elementi['N'];
		
		if ($Elementi['Rimosso'] == "si") {
			if ($Elementi['DataRimozione'] < strtotime("2 days ago")) {
				FaiQuery("DELETE FROM Registrazioni WHERE N = '$NumRegistrazione'");
				if (mysqli_num_rows(query("SELECT N FROM Registrazioni WHERE Registrazione = '" . $Elementi['Registrazione'] . "'")) == 0) {EliminaFileRegistrazione($Elementi['Registrazione']);}
				continue;
			}
		}
		
		$Elementi['Data'] = "del " . Date(formato_data, $Elementi['Data']) . " alle " . Date("H:i", $Elementi['Data']);
		
		$strRegistrazioni .= CreaRigaJSON($Elementi) . ",";
	}
	$strRegistrazioni = "[" . substr($strRegistrazioni, 0, -1) . "]";
	
	ChiudiMySql();
	
	Torna($strRegistrazioni);
?>
