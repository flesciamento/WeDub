<?php Session_start(); /*** Effettua il login (la prima volta o le successive) per gli utenti Facebook ***/

if (!$ID_Utente = $_POST['id']) {header("location: Login.php"); exit;}

require("fVerificaTokenFB.php");

if (!VerificaTokenFB($_POST['T'], $ID_Utente)) {exit("Autenticazione utente Facebook fallita!");}

$NomeUtente = $_POST['name']; $EmailUtente = $_POST['email']; $FotoProfilo = $_POST['picture']; $Facebook = $_POST['FB'];

$_SESSION['ID'] = $ID_Utente; $_SESSION['EMail'] = $EmailUtente; $_SESSION['FB'] = $Facebook;


require("connessione.php"); 

	/** Verifica se l'utente è nuovo **
	 * 	Per utente nuovo si intende:
	 *   - un utente che si iscrive per la prima volta (riga database inesistente)
	 *   - un utente che era già entrato, ma deve ancora scegliere il nome (variabile Nome del database vuota) */
	$Verifica = mysqli_fetch_assoc(query("SELECT Nome, FotoProfilo FROM UtentiRegistrati WHERE ID = '" . $_SESSION['ID'] . "'"));
	
	if ($Verifica['Nome'] != "") {
		/* Utente già esistente */
		$_SESSION['Nome'] = $Verifica['Nome'];
		$_SESSION['FotoProfilo'] = ((substr($Verifica['FotoProfilo'], 0, 4) == "http") ? $FotoProfilo : $Verifica['FotoProfilo']); //Se è stata scelta una foto profilo dal proprio pc, mantiene quella, altrimenti aggiorna la foto profilo di Facebook
		query("UPDATE UtentiRegistrati SET Cancellato = 0, FotoProfilo = '" . $_SESSION['FotoProfilo'] . "' WHERE ID = '" . $_SESSION['ID'] . "'");
		require("GeneraCA.php");
		
		if ($Verifica['Nome'] == "Cristina Lo Verme") {
		    query("UPDATE UtentiRegistrati SET ID = '$ID_Utente', EMail = '$EmailUtente', FotoProfilo = '$FotoProfilo' WHERE ID = 'provvCri'");
		    query("UPDATE Ruoli SET ID_Utente = '$ID_Utente' WHERE ID_Utente = 'provvCri'");
		}
	} else {
		/* Utente nuovo */
		$_SESSION['DaModificareProfilo'] = true;
		
		if (isset($Verifica['Nome'])) {
		    query("UPDATE UtentiRegistrati SET Cancellato = 0, EMail = '$EmailUtente', FotoProfilo = '$FotoProfilo' WHERE ID = '" . $_SESSION['ID'] . "'");
		} else {
			query("INSERT INTO UtentiRegistrati (ID, EMail, FotoProfilo, Facebook) VALUES('$ID_Utente', '$EmailUtente', '$FotoProfilo', $Facebook)");
			mail("wedubinfo@gmail.com", "WEDUB - NUOVO ISCRITTO", "$ID_Utente\n$NomeUtente\n$EmailUtente", "From: bot@wedub.it");
		}
		
		require("GeneraCA.php");
		
		header("location: ModificaNomeFoto.php?Pag=" . urlencode($_POST['Pag'])); exit;
	}

ChiudiMySql();

require("RedirezionaAlLogin.php");
?>
