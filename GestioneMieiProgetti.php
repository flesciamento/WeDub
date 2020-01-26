<?php require("p1.php"); require("fAcquisisciDatiDoppiatori.php"); require("fAnteprimaVideo.php"); require("fDoppiatoreOnline.php"); ?>
                <h3 class="header-line">I MIEI PROGETTI DI DOPPIAGGIO</h3>
                
                            </div>

        </div>
        
        <div class="row">
			
		 <?php
			if (!mysqli_num_rows($DatiProgetto = query("SELECT * FROM Progetti WHERE ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Doppiaggio' ORDER BY DataCreazione DESC, NumProgetto DESC"))) {
				echo "<center class='alert alert-info'>Non hai ancora creato alcun progetto di doppiaggio. <a href='NuovoDoppiaggio.php'>Clicca qui per crearne uno</a>!</center>";
			}
			
			$ColonneRiga = 0;
			while($DP = mysqli_fetch_assoc($DatiProgetto)) {
				$AnteprimaVideo = AnteprimaVideo($DP['PiattaformaVideo'], $DP['PercorsoVideo'], 200, 113);
				
				echo "<div class='col-md-6 col-sm-6 col-xs-12'>
						<a href='GestioneProgetto.php?N=" . $DP['NumProgetto'] . "' class='alert-info'><div class='panel panel-info'>
							<div class='panel-heading'>
								<center><span style='font-size: 20px; font-weight: bold;'>" . $DP['NomeProgetto'] . "</span></center>
							</div>
							<div class='panel-body'>
								<div class='alert alert-info back-widget-set text-center'>
									<h2>" . $DP['NomeDoppiaggio'] . "</h2>
									<b>Stato</b>: " . ($DP['Stato'] ? "<span class='btn btn-success btn-sm'>Completato</span>" : "<span class='btn btn-info btn-xs'>Aperto</span>") . "
									<br><br>
									$AnteprimaVideo
									<h3>Doppiatori e ruoli:</h3>
									<table class='TabellaRuoli'>
										<tr><td><b>Doppiatore</b></td><td><b>Personaggio</b></td></tr>";
							
							$DatiDoppiatori = AcquisisciDatiDoppiatori($DP['NumProgetto']);
							foreach($DatiDoppiatori as $Doppiatore) {
								echo "<tr><td>" . $Doppiatore['Nome'] . DoppiatoreOnline($Doppiatore['DataUltimaAzione']) . "</td><td>" . $Doppiatore['Ruolo'] . "</td></tr>";
							}
							
				echo "				</table>
								</div>
							</div>
						</div></a>
					</div>";
					
					$ColonneRiga = ++$ColonneRiga * ($ColonneRiga < 2);	if ($ColonneRiga == 0) {echo "</div><div class='row'>";}
			}
			
			ChiudiMySql();
		 ?>			

<?php require("p2.php"); ?>
