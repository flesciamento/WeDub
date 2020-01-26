<?php 
	function FaiQuery($MySQL) {
		if (!($Contenuto = query($MySQL))) {Torna($MySQL . " " . ErroreMySql(), true);} else {return $Contenuto;}
	}
?>
