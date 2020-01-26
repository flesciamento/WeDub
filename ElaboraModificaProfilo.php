<?php Session_start(); 

if (!$_SESSION['ID']) {header("location: https://" . $_SERVER['SERVER_NAME'] . "/index.php"); exit;}


function Errore($Messaggio) {
	header("location: ModificaNomeFoto.php?E=$Messaggio&Nome=" . rawurlencode($_POST['Nome']) . "&PresaVisione=" . rawurlencode($_POST['opzPresaVisione']) . "&Pag=" . rawurlencode($_POST['Pag'])); exit;
}

require("fSistema.php");

if ((!$Nome = trim(Sistema($_POST['Nome']))) || (!$PresaVisione = $_POST['opzPresaVisione'])) {Errore("ErrCampi");}

if (preg_match("/[^a-zA-Z0-9 \.]+/", $Nome)) {Errore("ErrCaratteri"); exit;}

require("connessione.php");

if (mysqli_num_rows(query("SELECT Nome FROM UtentiRegistrati WHERE LOWER(Nome) = '" . strtolower($Nome) . "'"))) {Errore("ErrNomeEsistente");}

unset($_SESSION['DaModificareProfilo']);

$_SESSION['Nome'] = $Nome; $_SESSION['FotoProfilo'] = $_POST['PercorsoFotoProfilo'];

query("UPDATE UtentiRegistrati SET Nome = '$Nome', FotoProfilo = '" . $_POST['PercorsoFotoProfilo'] . "' WHERE ID = '" . $_SESSION['ID'] . "'");
mail("wedubinfo@gmail.com", "WEDUB - AGGIORNAMENTO NUOVO ISCRITTO", $_SESSION['ID'] . " ha cambiato il nome in: \n$Nome", "From: bot@wedub.it");

ChiudiMySql();

require("RedirezionaAlLogin.php");
?>
