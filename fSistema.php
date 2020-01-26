<?php
function Sistema($Stringa, $EscludiApice = false) {
	$Stringa = str_replace("\"", "\\\"", str_replace("\\", "\\\\", $Stringa));
	if (!$EscludiApice) {$Stringa = str_replace("'", "\\'", $Stringa);}
	
	return $Stringa;
}

function SistemaHTML($Stringa) {
	return str_replace("'", "&#39;", str_replace("\"", "&quot;", $Stringa));
}
?>
