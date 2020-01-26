<?php
function ChiavePrimariaUltimaOperazione() {
	return RisultatoQuery("SELECT LAST_INSERT_ID()"); 
}

?>
