<? 
function CreaPercorso($Cartella, $strNome, $Estensione = "", $Prefisso = "") {
		$NomeImmagine = (strstr($strNome, "/")) ? substr(strrchr($strNome, "/"), 1, -4) : substr($strNome, 0, -4); 
		if ($Estensione == "") {$Estensione = substr($strNome, -4);}
		return "$Cartella$Prefisso$NomeImmagine$Estensione";
}
?>
