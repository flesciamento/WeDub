<?php
$_FILES["Foto"]["name"] = $_POST['Nome'];
file_put_contents($NomeFileProvvisorio = "FotoProfilo/Provvisorio" . time(), file_get_contents($_POST['Percorso']));
$_FILES["Foto"]["tmp_name"] = $NomeFileProvvisorio;

require("CaricaFotoProfilo.php");
?>