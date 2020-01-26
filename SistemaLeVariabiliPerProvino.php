<?php
	$RuoloProvino = EliminaParentesiAcute(Sistema($_POST['RuoloProvino']));
	$DescrizioneProvino = str_replace("\n", "<br>", str_replace("\r", "", SistemaHTML(strip_tags($_POST['DescrizioneProvino'], "<b><i><u>"))));
?>
