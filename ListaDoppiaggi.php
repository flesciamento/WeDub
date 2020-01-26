<?php require("p1.php"); require("fAcquisisciDatiDoppiatori.php"); require("fAnteprimaVideo.php"); require("fDoppiatoreOnline.php"); ?>
                <h3 class="header-line">DOPPIAGGI</h3>
                
                            </div>

        </div>
        
        <div class="row">
			
        <?php
			if (!mysqli_num_rows($DP = query("SELECT Progetti.*, Ruoli.*, UtentiRegistrati.Nome FROM Progetti, Ruoli, UtentiRegistrati WHERE Ruoli.ID_Utente = '" . $_SESSION['ID'] . "' AND Progetti.NumProgetto = Ruoli.NumProgetto AND UtentiRegistrati.ID = Progetti.ID_CreatoreProgetto ORDER BY Progetti.DataCreazione DESC, Progetti.NumProgetto DESC"))) {
				echo "<center class='alert alert-info'>Attualmente non partecipi a nessun progetto di doppiaggio <a href='NuovoDoppiaggio.php'>Clicca qui per crearne uno tu</a>!</center>";
			}
			
            $ColonneRiga = 0;
			while($DatiProgetto = mysqli_fetch_assoc($DP)) {
				$AnteprimaVideo = AnteprimaVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo'], 200);
				
				echo "<div class='col-md-6 col-sm-6 col-xs-12'>
						<a href='Doppiaggio.php?N=" . $DatiProgetto['NumProgetto'] . "' class='alert-primary'><div class='panel panel-primary'>
							<div class='panel-heading'>
								<center><span style='font-size: 20px; font-weight: bold;'>" . $DatiProgetto['NomeProgetto'] . "</span></center>
							</div>
							<div class='panel-body'>
								<div class='alert alert-primary back-widget-set text-center'>
									<h2>" . $DatiProgetto['NomeDoppiaggio'] . "</h2>
									<b>Stato</b>: " . ($DatiProgetto['Stato'] ? "<span class='btn btn-success btn-sm'>Completato</span>" : "<span class='btn btn-info btn-xs'>Aperto</span>") . "
									<br><br>
									$AnteprimaVideo
									<br><br>
									<h4><i><b>Ruolo assegnato</b></i>: " . $DatiProgetto['Ruolo'] . "</h4>";
									
							$DatiDoppiatori = AcquisisciDatiDoppiatori($DatiProgetto['NumProgetto']);
							
							if (count($DatiDoppiatori) > 1) {
								echo "<br><h5>Altri doppiatori:</h5>
										<table class='TabellaRuoli'>
										<tr><td><b>Doppiatore</b></td><td><b>Personaggio</b></td></tr>";
														
								foreach($DatiDoppiatori as $Doppiatore) {
									if ($Doppiatore['ID'] != $_SESSION['ID']) {
										echo "<tr><td>" . $Doppiatore['Nome'] . DoppiatoreOnline($Doppiatore['DataUltimaAzione']) . "</td><td>" . $Doppiatore['Ruolo'] . "</td></tr>";
									}
								}
				echo "				</table><br>\n";
							}
							require("AggiungiLinkCopione.php");
				echo "				<br><br><b>Creatore del progetto</b>: " . $DatiProgetto['Nome'] . "
								</div>
							</div>
						</div></a>
					</div>";
					
				$ColonneRiga = ++$ColonneRiga * ($ColonneRiga < 2);	if ($ColonneRiga == 0) {echo "</div><div class='row'>";}
			}
		?>
			
		</div>
			
		
		<?php
		
			if (mysqli_num_rows(query("SELECT * FROM Progetti WHERE ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Doppiaggio' LIMIT 1"))) {
				echo "<center class='alert alert-info'>Per gestire i progetti creati da te vai a <a href='GestioneMieiProgetti.php' class='btn btn-primary btn-lg'>GESTISCI I PROGETTI</a></center>";
			}
			
			ChiudiMySql();
		
		?>

    
<?php require("p2.php"); ?>
