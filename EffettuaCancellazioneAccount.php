<?php /* Richiamato con AJAX */

function MandaEsito($Esito) {
	echo "{\"Cancellato\": \"$Esito\"}";
	exit;
}

/*** Controlli di sicurezza ***/
if ((!$ID = $_POST['ID']) || (!$CA = $_POST['CA'])) {MandaEsito(0);}

require("connessione.php");

$PWDConferma = RisultatoQuery("SELECT ConfermaAzione FROM UtentiRegistrati WHERE ID = '$ID'");

if ($CA != $PWDConferma) {MandaEsito(0);}

/*** Cancellazione dell'utente ***/
require("defSettaggiUtenteCancellato.php");
query(SettaggiUtenteCancellato . "WHERE ID = '$ID'");

MandaEsito(1);
?>
