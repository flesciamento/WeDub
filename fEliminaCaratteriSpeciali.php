<?php
	function EliminaParentesiAcute($Stringa) {
		return str_replace(array("<", ">"), "", $Stringa);
	}
?>
