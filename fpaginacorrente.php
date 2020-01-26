<?php
function PaginaCorrente() {
	$QstPagina = $_SERVER['PHP_SELF'];
    return (strstr($QstPagina, "/")) ? substr(strrchr($QstPagina, "/"), 1) : $QstPagina;
}
?>
