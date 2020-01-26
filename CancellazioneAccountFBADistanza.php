<?php
require("fDecodificaCallBackFB.php");

$Dati = DecodificaCallbackFB($_POST['signed_request']);

require("fVerificaTokenFB.php");
$EsitoVerificaTokenFB = VerificaTokenFB($Dati['oauth_token'], $Dati['user_id']);

$strEsito = "Verifica Token FB - " . ($EsitoVerificaTokenFB ? "OK" : "ERRORE") . "\n";

require("connessione.php");
require("defSettaggiUtenteCancellato.php");

$EsitoCancellazione = query(SettaggiUtenteCancellato . " WHERE ID = '" . $Dati['user_id'] . "'");

$strEsito .= $EsitoCancellazione ? "Cancellazione effettuata con successo" : "Errore nella cancellazione! " . ErroreMySql();

mail("wedubinfo@gmail.com", "CALLBACK FB - CANCELLAZIONE ACCOUNT", "Esito chiamata: " . print_r($Dati, true) . "\n" . $strEsito . "\n\n" . $_POST['signed_request'], "From: bot@wedub.it");

ChiudiMySql();
?>
