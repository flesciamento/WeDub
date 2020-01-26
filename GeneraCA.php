<?php
require("fPasswordCasuale.php");

query("UPDATE UtentiRegistrati SET ConfermaAzione = '" . PasswordCasuale() . "' WHERE ID = '" . $_SESSION['ID'] . "'");
?>
