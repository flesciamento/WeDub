<?php require("p1.php"); require("DecodificaDatiPersonaggi.php"); require("fAnteprimaVideo.php");   ?>
                <h3 class="header-line">PROVINI</h3>
                
                            </div>

        </div>
        
        <div class="row">
			
        <?php
			if (!mysqli_num_rows($DatiProgetto = query("SELECT Progetti.*, UtentiRegistrati.Nome FROM Progetti, UtentiRegistrati WHERE Progetti.Tipo = 'Provino' AND Progetti.Stato = 0 AND UtentiRegistrati.ID = Progetti.ID_CreatoreProgetto ORDER BY Progetti.DataCreazione DESC, Progetti.NumProgetto DESC"))) {
				echo "<center class='alert alert-info'>Non ci sono provini attivi al momento <a href='NuovoProvino.php'>Clicca qui per crearne uno tu</a>!</center>";
			}
			
			$ColonneRiga = 0;
			while($DP = mysqli_fetch_assoc($DatiProgetto)) {
				$AnteprimaVideo = AnteprimaVideo($DP['PiattaformaVideo'], $DP['PercorsoVideo'], 200);
				
				echo "<div class='col-md-6 col-sm-6 col-xs-12'>
						<a href='FaiProvino.php?N=" . $DP['NumProgetto'] . "' class='alert-primary'><div class='panel panel-primary'>
							<div class='panel-heading'>
								<center><span style='font-size: 20px; font-weight: bold;'>" . $DP['NomeProgetto'] . "</span></center>
							</div>
							<div class='panel-body'>
								<div class='alert alert-primary back-widget-set text-center'>
									<h2>Provino per " . $DP['RuoloProvino'] . "</h2>
									<b>Stato</b>: " . ($DP['Stato'] ? "<span class='btn btn-danger btn-sm'>Chiuso</span>" : "<span class='btn btn-info btn-xs'>Aperto</span>") . "
									<br><br>
									$AnteprimaVideo
									<br><br>
									<h4><i><b>Sesso</b></i>: " . $SessoPersonaggio[$DP['SessoProvino']] . "</h4>
									<h4><i><b>Età</b></i>: " . $EtaPersonaggio[$DP['SessoProvino']][$DP['EtaProvino']] . "</h4>"
									 . $DP['DescrizioneProvino'] . 
									"<br><br><b>Creatore del progetto</b>: " . $DP['Nome'] . "
								</div>
							</div>
						</div></a>
					</div>";
					
					$ColonneRiga = ++$ColonneRiga * ($ColonneRiga < 2);	if ($ColonneRiga == 0) {echo "</div><div class='row'>";}
			}
		?>
			
		</div>
			
		
		<?php
		
			if (mysqli_num_rows(query("SELECT * FROM Progetti WHERE ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Provino' LIMIT 1"))) {
				echo "<center class='alert alert-info'>Per gestire i provini creati da te vai a <a href='GestioneMieiProvini.php' class='btn btn-primary btn-lg'>GESTISCI I PROVINI DA VALUTARE</a></center>";
			}
			
			ChiudiMySql();
		
		?>

    
<?php require("p2.php"); ?>
