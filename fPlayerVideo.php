<?php
function PlayerVideo($Piattaforma, $ID_Video, $Larghezza, $Altezza) {
	switch($Piattaforma) {
		case "YouTube": $Player = "<iframe width='$Larghezza' height='$Altezza' src='https://www.youtube.com/embed/$ID_Video?rel=0' frameborder='5'></iframe>"; break;
		case "DailyMotion": $Player = "<iframe width='$Larghezza' height='$Altezza' src='//www.dailymotion.com/embed/video/$ID_Video' frameborder='5'></iframe>"; break;
		case "Facebook": $Player = "<iframe src='https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F$ID_Video%2F&width=$Larghezza&show_text=false&appId=806415089524313&height=280' width='$Larghezza' height='$Altezza' style='border: none; overflow: hidden;' scrolling='no' frameborder='0' allowTransparency='true'></iframe>"; break;
	}
	
	return $Player;
}
