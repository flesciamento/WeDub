<?php Session_start();
    if (!$_SESSION['ID']) {Torna("Non sei connesso al sito, <a href='https://" . $_SERVER['SERVER_NAME'] . "/WEDUB/Login.php'>rifai il login!</a>", true);}
?>