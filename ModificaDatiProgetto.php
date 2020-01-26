<?php
if (!$NumeroProgetto = $_GET['N']) {header("location: Dashboard.php"); exit;}

require("p1.php");

	require("fAcquisisciDatiDoppiatori.php");  
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT * FROM Progetti WHERE NumProgetto = '$NumeroProgetto' AND ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Doppiaggio'"))) {header("location: Dashboard.php"); exit;}
	
	$DatiDoppiatori = AcquisisciDatiDoppiatori($NumeroProgetto);
	
	ChiudiMySql();
	
	
?>
<h3 class="header-line">MODIFICA PROGETTO DI DOPPIAGGIO</h3>
                
                            </div>

        </div>

		<?php $PaginaSalvataggio = "SalvaDatiDoppiaggio.php"; require("FormProgettoDoppiaggio.php"); ?>
		
		<br><a href="GestioneProgetto.php?N=<?=$NumeroProgetto?>" class="btn btn-primary">&lt; Torna indietro senza salvare</a>

<?php require("p2.php"); ?>
