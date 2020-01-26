<?php
function ControllaImmagine($strNome, $tmpName) {
	/* Preleva le informazioni sull'immagine */
	$Info = getimagesize($tmpName);
	list($larghezza, $altezza) = $Info; $Tipo = $Info["mime"]; $Stringa = "$larghezza x $altezza > $Tipo";
	return array($Stringa, $Tipo, $larghezza, $altezza);
}
?>
