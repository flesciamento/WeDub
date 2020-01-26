<?php Session_start(); require("fSistema.php");

	if ($_SESSION['ID']) {header("location: Dashboard.php"); exit;}


	function Errore($Messaggio) {
		header("location: Login.php?E=$Messaggio&Nome=" . rawurlencode($_POST['Nome']) . "&EMail=" . rawurlencode($_POST['EMail']) . "&PresaVisione=" . rawurlencode($_POST['opzPresaVisione'])); exit;
	}
	
	if ((!$Nome = trim(Sistema($_POST['Nome']))) || (!$EMail = trim($_POST['EMail'])) || (!$Pwd = $_POST['Password']) || (!$PresaVisione = $_POST['opzPresaVisione'])) {Errore("ErrCampi");}
	if ($Pwd != $_POST['PasswordRipetuta']) {Errore("Err2Pwd");}
	
	require("connessione.php"); 
	
		if (mysqli_num_rows(query("SELECT Nome FROM UtentiRegistrati WHERE LOWER(Nome) = '" . strtolower($Nome) . "'"))) {Errore("ErrNomeEsistente");}
	
		if (mysqli_num_rows(query("SELECT EMail FROM UtentiRegistrati WHERE LOWER(EMail) = '" . strtolower($EMail) . "'"))) {Errore("ErrMailEsistente");}
		
		$UltimoID = RisultatoQuery("SELECT ID FROM UtentiRegistrati WHERE LOCATE('INT', ID) ORDER BY ID DESC LIMIT 1");
		
		$ID = "INT" . sprintf("%'.07d", (intval(substr($UltimoID, 3)) + 1));
		$strQuery = "INSERT INTO UtentiRegistrati (ID, Nome, Password, EMail, Facebook) VALUES ('$ID', '$Nome', MD5('$Pwd'), '$EMail', 0)";
		query($strQuery) or exit($strQuery . " - " . ErroreMySql());
		mail("wedubinfo@gmail.com", "WEDUB - NUOVO ISCRITTO", "$ID\n$Nome\n$Email", "From: bot@wedub.it");
	
	$_SESSION['ID'] = $ID; $_SESSION['Nome'] = $Nome; $_SESSION['EMail'] = $EMail; $_SESSION['FB'] = 0;
	
	require("GeneraCA.php");
	
	ChiudiMySql();
	
	header("location: Dashboard.php"); exit;
?>
