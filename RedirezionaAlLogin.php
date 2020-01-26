<?php
if ($_POST['Pag'] != "") {
	header("location: " . $_POST['Pag']); exit;
}

header("location: https://" . $_SERVER['SERVER_NAME'] . "/WEDUB/Dashboard.php"); exit;
?>
