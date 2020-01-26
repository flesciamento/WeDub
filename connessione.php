<?php
$DatabaseMySQL = mysqli_connect("localhost", "flesciamento", "", "my_wedub");
	if (mysqli_connect_errno()) {echo "<b>Errore database:</b> " . mysqli_connect_error();}
	
	function query($SQL) {
		return mysqli_query($GLOBALS['DatabaseMySQL'], $SQL);
	}
	
	function RisultatoQuery($SQL) {
		$Risultato = mysqli_fetch_row(query($SQL));
		return $Risultato[0];
	}
	
	function ChiudiMySql() {
		mysqli_close($GLOBALS['DatabaseMySQL']);
	}
	
	function ErroreMySql() {
		return mysqli_error($GLOBALS['DatabaseMySQL']);
	}
	
	if ($_SESSION['ID']) {
	   query("UPDATE UtentiRegistrati SET DataUltimaAzione = '" . time() . "' WHERE ID = '" . $_SESSION['ID'] . "'");
	}
?>
