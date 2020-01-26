<?php
function PasswordCasuale() {
	$Caratteri ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	$PWD = "";
	for($I = 0; $I < 10; $I++){
		$PWD .= substr($Caratteri, rand(0, strlen($Caratteri) - 1), 1);
	}
	return $PWD;
}
?>
