<?php require_once("fRichiesteHTTPS.php");
	function AnteprimaVideo($Piattaforma, $ID_Video, $Larghezza) {
		switch($Piattaforma) {
			case "YouTube": $Anteprima = "<img src='https://img.youtube.com/vi/$ID_Video/0.jpg' width='$Larghezza'>"; break;
			case "DailyMotion": $Anteprima = "<img src='https://www.dailymotion.com/thumbnail/video/$ID_Video' width='$Larghezza'>"; break;
			case "Facebook": 
				//$IndirizzoImmagine = HTTPS_RichiestaGET("https://graph.facebook.com/$ID_Video/picture", "access_token=806415089524313|52dfbd3b25c3c848102152bdd98aacb7");
				$Anteprima = "<img src='https://graph.facebook.com/$ID_Video/picture?access_token=806415089524313|52dfbd3b25c3c848102152bdd98aacb7' width='$Larghezza'>"; break;
		}
		
		return $Anteprima;
	}
?>
