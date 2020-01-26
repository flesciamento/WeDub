<?php Session_start();
    require("ControllaAccesso.php");
    
	if ((!$N = $_GET['N']) || is_null($S = $_GET['S'])) {header("location: Dashboard.php"); exit;}

	
	require("connessione.php"); 
	
		$DatiProgetto = mysqli_fetch_assoc(query("SELECT ID_CreatoreProgetto, Tipo FROM Progetti WHERE NumProgetto = '$N'"));
		
		if ($_SESSION['ID'] != $DatiProgetto['ID_CreatoreProgetto']) {echo "Non sei autorizzato a modificare lo stato di questo progetto!"; exit;}
		
		query("UPDATE Progetti SET Stato = '$S', DataUltimaModifica = " . time() . " WHERE NumProgetto = '$N'");
	
	ChiudiMySql();

	header("location: " . (($DatiProgetto['Tipo'] == "Doppiaggio") ? "GestioneProgetto.php" : "GestioneProvino.php") . "?N=$N"); exit;

?>
