function Logout(Accidentale) {
	window.location.href = "https://" + window.location.hostname + "/WEDUB/Logout.php" + (Accidentale? "?Pag=" + encodeURIComponent(window.location.href) : "");
}
