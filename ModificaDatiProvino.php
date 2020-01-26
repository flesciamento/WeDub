<?php
if (!$NumeroProgetto = $_GET['N']) {header("location: Dashboard.php"); exit;}

require("p1.php");

	 
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT * FROM Progetti WHERE NumProgetto = '$NumeroProgetto' AND ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Provino'"))) {header("location: Dashboard.php"); exit;}
	
	ChiudiMySql();
	
	
?>
<h3 class="header-line">MODIFICA PROVINO</h3>
                
                            </div>

        </div>

		<?php $PaginaSalvataggio = "SalvaDatiProvino.php"; $Provino = true; require("FormProgettoDoppiaggio.php"); ?>
		
		<br><a href="GestioneProvino.php?N=<?=$NumeroProgetto?>" class="btn btn-primary">&lt; Torna indietro senza salvare</a>

<?php require("p2.php"); ?>
