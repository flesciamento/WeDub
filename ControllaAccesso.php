<?php Session_start();

require("fpaginacorrente.php"); $PaginaAttuale = PaginaCorrente();

if (!$_SESSION['ID']) {header("location: https://" . $_SERVER['SERVER_NAME'] . "/index.php?Pag=" . urlencode($PaginaAttuale) . ($_SERVER['QUERY_STRING'] ? urlencode("?" . $_SERVER['QUERY_STRING']) : "")); exit;}

if (isset($_SESSION['DaModificareProfilo'])) {header("location: ModificaNomeFoto.php"); exit;}

?>
