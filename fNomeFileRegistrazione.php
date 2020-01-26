<?php
	require("fMinutiESecondi.php");
	
	function NomeFileRegistrazioneDaScaricare($PercorsoFile, $NomeProgetto, $NomeDoppiaggio, $NomeUtente, $MinutaggioRegistrazione) {
		$MS = MinutiESecondi($MinutaggioRegistrazione); $InfoFile = pathinfo($PercorsoFile);
		$NomeFile = "$NomeProgetto - $NomeDoppiaggio - $NomeUtente - Battuta a " . sprintf("%'.02d", $MS['Minuti']) . " min " .  sprintf("%06.3f", floatval($MS['Secondi'])) . " sec." . $InfoFile['extension'];
		
		return str_replace(array("*", "|", "\\", ":", "\"", "<", ">", "?", "/", "'"), "_", $NomeFile);
	}
?>
