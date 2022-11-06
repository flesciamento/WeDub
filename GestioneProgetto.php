<?php 
if (!$NumeroProgetto = $_GET['N']) {header("location: Dashboard.php"); exit;}

require("p1.php");

	require("fAcquisisciDatiDoppiatori.php"); require("fPlayerVideo.php"); require("fDoppiatoreOnline.php");
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT * FROM Progetti WHERE NumProgetto = '$NumeroProgetto' AND ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Doppiaggio'"))) {exit("<script>window.location.href = 'Dashboard.php';</script>");} // Non si usa l'header perché per aprire la sessione (e controllarla ecc.) si è aperto p1.php e l'header non funzionerebbe.
	
	$DatiDoppiatori = AcquisisciDatiDoppiatori($NumeroProgetto);
	
	ChiudiMySql();
?>
                <center>
					<h2 class="header-line">GESTIONE PROGETTO DI DOPPIAGGIO:</h2>
					<h3 class="header-line"><?=$DatiProgetto['NomeProgetto']?></h3>
                </center>
                            </div>

        </div>
             <div class="row">
				<div class="col-md-6 col-sm-6 col-xs-12">
					<div class="panel panel-info text-center">
	                    <div class="panel-heading">
	                        <b>Dati del progetto:</b>
						</div>
						<div class="panel-body">
							<h2><?=$DatiProgetto['NomeDoppiaggio']?></h2>
							<b>Stato</b>:
							 <div class="btn-group">	
								<a data-toggle="dropdown" <?=($DatiProgetto['Stato'] ? "class='btn btn-success dropdown-toggle'>Completato " : "class='btn btn-info dropdown-toggle'>Aperto ")?><span class="caret"></span></a>
									<ul class="dropdown-menu">
										<li><a href="CambiaStatoProgetto.php?N=<?=$NumeroProgetto?>&S=0">Aperto</a></li>
										<li class="btn-success"><a href="CambiaStatoProgetto.php?N=<?=$NumeroProgetto?>&S=1">Completato</a></li>
									</ul>
							 </div>
							<br><br>
							<?=PlayerVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo'], 300, 169)?>
							
							<h3>Doppiatori e ruoli:</h3>
							<table class="TabellaRuoli">
									<tr><td><b>Doppiatore</b></td><td><b>Personaggio</b></td></tr>
							<?php
								foreach($DatiDoppiatori as $Doppiatore) {
								    echo "<tr><td>" . $Doppiatore['Nome'] . DoppiatoreOnline($Doppiatore["DataUltimaAzione"]) . "</td><td>" . $Doppiatore['Ruolo'] . "</td></tr>";
								}
							?>
							</table><br><br>
							<?php require("AggiungiLinkCopione.php"); ?>
							
							<a class="btn btn-primary" href="ModificaDatiProgetto.php?N=<?=$NumeroProgetto?>"><i class="fa fa-edit "></i> Modifica</a>
							<br><br><span style="font-family: Verdana; font-size: 10px;">Progetto creato il: <?=Date(formato_data, $DatiProgetto['DataCreazione'])?></span>
						</div>
					</div>
				</div>
				
				<div class='col-md-6 col-sm-6 col-xs-12 alert alert-success back-widget-set text-center'>
					<a href="Doppiaggio.php?N=<?=$NumeroProgetto?>" class="btn btn-success btn-lg"><span class='fa fa-microphone' style="font-size: 25px;margin-right: 6px;"></span><span style="font-size: 19px;font-weight: bold;">DOPPIAGGIO <div class="fa fa-arrow-right"></div></span></a>
				</div>
				<div class='col-md-6 col-sm-6 col-xs-12 alert alert-success back-widget-set text-center'>
					<a onclick='ApriFinestra(event);' data-larghezza='850px' data-altezza='500px' data-link='RenderingAudio/Rendering/Rendering.php?N=<?=$NumeroProgetto?>' class='btn btn-primary btn-lg' title="Esporta tutte le tracce di tutti i doppiatori in un unico file audio"><span class="fa fa-file-audio-o fa-2x" style="float: left; margin: 5px 10px 0 0;"></span><b> Esporta l'intero doppiaggio<br />in un unico file audio</b></a>
				</div>
			</div>
			
			<center><h3><a href="GestioneMieiProgetti.php" class="btn btn-info">&lt; Torna ai progetti</a></h3></center>

<?php require("p2.php"); ?>
