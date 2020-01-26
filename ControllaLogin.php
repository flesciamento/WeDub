<?php Session_start(); /*** Effettua il login per gli utenti normali (iscritti con la procedura interna del sito) ***/

	if ($_SESSION['ID']) {header("location: Dashboard.php"); exit;}

	require("connessione.php"); 
    
    $EMail_Nickname = strtolower($_POST['EMail']);
	
		if (!$UtenteRegistrato = mysqli_fetch_assoc(query("SELECT * FROM UtentiRegistrati WHERE (LOWER(EMail) = '$EMail_Nickname' XOR LOWER(Nome) = '$EMail_Nickname') AND Password = MD5('" . $_POST['Password'] . "') AND Facebook = false AND Cancellato = false"))) {header("location: Login.php?E=lgnErr"); exit;}
		
		$_SESSION['ID'] = $UtenteRegistrato['ID']; $_SESSION['Nome'] = $UtenteRegistrato['Nome']; $_SESSION['EMail'] = $UtenteRegistrato['EMail']; $_SESSION['FB'] = 0;
	
		/* setcookie("ID", $_SESSION['ID'], time() + 63072000); Vedere se vale la pena utilizzare i Cookie che non scadono (scadenza impostata a 2 anni), per leggerli: $_COOKIE['NomeCookie'] */
	
	require("GeneraCA.php");
		
	ChiudiMySql();
	
	require("RedirezionaAlLogin.php");
?>
