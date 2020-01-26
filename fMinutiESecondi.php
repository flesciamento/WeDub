<?php
	function MinutiESecondi($Secondi) {
		$MS['Minuti'] = intval($Secondi / 60);
		$MS['Secondi'] = (($Secondi / 60) - $MS['Minuti']) * 60;
		
		return $MS;
	}
?>
