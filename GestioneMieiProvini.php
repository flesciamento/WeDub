<?php require("p1.php"); require("DecodificaDatiPersonaggi.php"); require("fAnteprimaVideo.php");   ?>
                <h3 class="header-line">GESTISCI I PROVINI DA VALUTARE</h3>
                
                            </div>

        </div>
        
        <div class="row">
			
		 <?php
			if (!mysqli_num_rows($DatiProgetto = query("SELECT * FROM Progetti WHERE ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Provino' ORDER BY DataCreazione DESC, NumProgetto DESC"))) {
				echo "<center class='alert alert-info'>Non hai ancora creato alcun provino. <a href='NuovoProvino.php'>Clicca qui per crearne uno</a>!<br><br>
					  Se invece stai cercando provini su cui cimentarti <a href='ListaProvini.php'>clicca qui</a></center>";
			}
			
			$ColonneRiga = 0;
			while($DP = mysqli_fetch_assoc($DatiProgetto)) {
				$AnteprimaVideo = AnteprimaVideo($DP['PiattaformaVideo'], $DP['PercorsoVideo'], 200, 113);
				
				echo "<div class='col-md-6 col-sm-6 col-xs-12'>
						<a href='GestioneProvino.php?N=" . $DP['NumProgetto'] . "' class='alert-info'><div class='panel panel-info'>
							<div class='panel-heading'>
								<center><span style='font-size: 20px; font-weight: bold;'>" . $DP['NomeProgetto'] . "</span></center>
							</div>
							<div class='panel-body'>
								<div class='alert alert-info back-widget-set text-center'>
									<h2>Provino per " . $DP['RuoloProvino'] . "</h2>
									<b>Stato</b>: " . ($DP['Stato'] ? "<span class='btn btn-danger'>Chiuso</span>" : "<span class='btn btn-info btn-sm'>Aperto</span>") . "
									<br><br>
									$AnteprimaVideo
									<br><br>
									<h4><i><b>Sesso</b></i>: " . $SessoPersonaggio[$DP['SessoProvino']] . "</h4>
									<h4><i><b>Età</b></i>: " . $EtaPersonaggio[$DP['SessoProvino']][$DP['EtaProvino']] . "</h4>
									<p style='text-align: justify; padding: 5px 20%;'>" . $DP['DescrizioneProvino'] . "</p>
							    </div>
							</div>
						</div></a>
					</div>";
					
					$ColonneRiga = ++$ColonneRiga * ($ColonneRiga < 2);	if ($ColonneRiga == 0) {echo "</div><div class='row'>";}
			}
			
			ChiudiMySql();
		 ?>			

<?php require("p2.php"); ?>
