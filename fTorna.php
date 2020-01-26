<?php
function Torna($Messaggio, $Errore = false) {
	if ($Errore) {echo "{\"Errore\": \"$Messaggio\"}";} else {echo $Messaggio;}
	exit;
}
?>
