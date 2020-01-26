<?php /*** Richiamato con AJAX ***/
	
	require("fTorna.php"); require("fPlayerVideo.php");
	
	$Link = $_POST['Link'];
	
	function PrelevaDatoLink($NomeDato) {
		parse_str(parse_url($GLOBALS['Link'], PHP_URL_QUERY), $Dati);
		return $Dati[$NomeDato];
	}
	
	function MandaInfo($Piattaforma, $ID_Video) {
		$Embed = PlayerVideo($Piattaforma, $ID_Video, 480, 270);
		
		Torna("{\"Piattaforma\": \"$Piattaforma\", \"ID_Video\": \"$ID_Video\", \"Player\": \"$Embed\"}");
	}
	
	
	/*** YouTube ***/
	if (strstr($Link, "youtube.com/watch")) {MandaInfo("YouTube", PrelevaDatoLink("v"));}
	
	if (strstr($Link, "youtube.com/embed")) {
		$Delimitatore = (strpos($Link, "?")) ? "?" : "\"";
		MandaInfo("YouTube", substr(strstr(strstr($Link, "embed/"), $Delimitatore, true), 6));
	}
	
	if (strstr($Link, "https://youtu.be/")) {MandaInfo("YouTube", strstr(substr(strrchr($Link, "/"), 1) . "?", "?", true));}
	/***************/
	
	/*** DailyMotion ***/
	if (strstr($Link, "dailymotion.com/embed/video/")) {
		$LinkRidotto = strstr(strstr($Link, "video/"), " ", true);
		$Delimitatore = (strpos($LinkRidotto, "?")) ? "?" : "\"";
		MandaInfo("DailyMotion", substr(strstr($LinkRidotto, $Delimitatore, true), 6));
	}
	
	if (strstr($Link, "dailymotion.com/video")) {MandaInfo("DailyMotion", substr(strstr($Link, "video/"), 6));}
	
	if (strstr($Link, "//dai.ly/")) {MandaInfo("DailyMotion", strstr(substr(strrchr($Link, "/"), 1) . "?", "?", true));}
	/*******************/
	
	/*** Facebook ***/
	if (strstr($Link, "<iframe src=\"https://www.facebook.com/plugins/video.php")) {
		$Link = strstr(substr(strstr($Link, "\""), 1), "\"", true);
		$Link = PrelevaDatoLink("href");
	}
	
	if (strstr($Link, "facebook.com/")) {
		if ($PorzioneLink = strstr($Link, "videos/")) {
			MandaInfo("Facebook", strstr(substr($PorzioneLink, 7), "/", true));
		}
	}
	/****************/
	
	Torna("Devi copiare e incollare il link di un video di YouTube, Facebook o DailyMotion!", true);

?>
