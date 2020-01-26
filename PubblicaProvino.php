<?php
    require("ControllaAccesso.php");

	if ((!$N = $_GET['N']) || (!$P = $_GET['P'])) {header("location: Dashboard.php"); exit;}
	
	require("connessione.php"); 
	
		if (!mysqli_num_rows(query("SELECT N FROM Registrazioni WHERE NumProgetto = '$N' AND NumProvino = '$P' AND Rimosso = 'no' LIMIT 1"))) {
			echo "<center><br><br>Per pubblicare il provino devi registrare almeno una traccia!<br><br>
				  <a href='Doppiaggio.php?N=$N&P=$P'>&lt;&lt; Torna al doppiaggio</a></center>";
			exit;
		}
		
		query("UPDATE Provini SET ProvinoPubblicato = 1, DataProvino = '" . time() . "' WHERE NumProgetto = '$N' AND NumProvino = '$P'");
	
	ChiudiMySql();
	
	header("location: FaiProvino.php?N=$N"); exit;
?>
