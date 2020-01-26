<?php
function RidimensionaImmagine($LarghezzaImmagine, $AltezzaImmagine, $larghezza, $altezza, $Tipo, $tmpName, $Cartella, $strNome, $Prefisso = "") {
		/* Ridimensiona rispettando le proporzioni */
		if ($LarghezzaImmagine == "auto") {$LarghezzaImmagine = intval($AltezzaImmagine * $larghezza / $altezza);}
		if ($AltezzaImmagine == "auto") {$AltezzaImmagine = intval($LarghezzaImmagine * $altezza / $larghezza);}
		$imgDimensionata = imagecreatetruecolor($LarghezzaImmagine, $AltezzaImmagine);
	
		/* Preleva l'immagine da ridimensionare */
		$imgOriginale = ($Tipo == "image/png") ? imagecreatefrompng($tmpName) : imagecreatefromjpeg($tmpName);
		$Stringa .=  ($imgOriginale) ? " <font color=green>ok</font>" : " <font color=red>errore</font>";
	
		/* Ridimensionamento con interpolazione */
		$Stringa .=  (imagecopyresampled($imgDimensionata, $imgOriginale, 0,0,0,0, $LarghezzaImmagine, $AltezzaImmagine, $larghezza, $altezza)) ? " <font color=green>ok</font>" : " <font color=red>errore</font>";
	
		/* Memorizzazione dell'immagine in jpeg */
		$Stringa .=  "</font>&nbsp;<font face='Verdana' size=2>Ridimensionamento jpeg larghezza $LarghezzaImmagine ";
		$Percorso = CreaPercorso($Cartella, $strNome, ".jpg", $Prefisso);
		$Stringa .=  (imagejpeg($imgDimensionata, $Percorso, 100)) ? "riuscito." : "non riuscito."; //Salvataggio nuova immagine ridimensionata
		return $Percorso;
}
?>
