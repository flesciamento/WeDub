<?php /*** Richiamato con AJAX ***/

Session_start();

$strEsito = "{\"OK\": ";

if ($_SESSION['ID'] == $_POST['ID']) {$strEsito .= "\"1\"}";} else {$strEsito .= "\"0\"}";}

echo $strEsito;
?>
