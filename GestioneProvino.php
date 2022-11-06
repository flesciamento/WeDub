<?php 
if (!$NumeroProgetto = $_GET['N']) {header("location: Dashboard.php"); exit;}

require("p1.php");

	require("DecodificaDatiPersonaggi.php"); require("fPlayerVideo.php");  
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT * FROM Progetti WHERE NumProgetto = '$NumeroProgetto' AND ID_CreatoreProgetto = '" . $_SESSION['ID'] . "' AND Tipo = 'Provino'"))) {exit("<script>window.location.href = 'Dashboard.php';</script>");} // Non si usa l'header perché per aprire la sessione (e controllarla ecc.) si è aperto p1.php e l'header non funzionerebbe.
	
	$DatiProvini = query("SELECT Provini.*, UtentiRegistrati.* FROM Provini, UtentiRegistrati WHERE Provini.NumProgetto = '$NumeroProgetto' AND Provini.ProvinoPubblicato = 1 AND UtentiRegistrati.ID = Provini.ID_UtenteProvinante ORDER BY Provini.DataProvino DESC");
	
	ChiudiMySql();
?>
                <center>
					<h2 class="header-line">GESTIONE PROVINO:</h2>
					<h3 class="header-line"><?=$DatiProgetto['NomeProgetto']?></h3>
                </center>
                            </div>

        </div>
             <div class="row">
				<div class="col-md-6 col-sm-6 col-xs-12">
					<div class="panel panel-info text-center">
	                    <div class="panel-heading">
	                        <b>Dati del provino:</b>
						</div>
						<div class="panel-body">
							<h2>Provino per <?=$DatiProgetto['RuoloProvino']?></h2>
							<b>Stato</b>:
							 <div class="btn-group">	
								<a data-toggle="dropdown" <?=($DatiProgetto['Stato'] ? "class='btn btn-danger dropdown-toggle'>Chiuso " : "class='btn btn-info dropdown-toggle'>Aperto ")?> <span class="caret"></span></a>
									<ul class="dropdown-menu">
										<li><a href="CambiaStatoProgetto.php?N=<?=$NumeroProgetto?>&S=0">Aperto</a></li>
										<li class="btn-danger"><a href="CambiaStatoProgetto.php?N=<?=$NumeroProgetto?>&S=1">Chiuso</a></li>
									</ul>
							 </div>
							<br><br>
							<?=PlayerVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo'], 300, 169)?>
							
							<br><br>
							<h4><i><b>Sesso</b></i>: <?=$SessoPersonaggio[$DatiProgetto['SessoProvino']]?></h4>
							<h4><i><b>Età</b></i>: <?=$EtaPersonaggio[$DatiProgetto['SessoProvino']][$DatiProgetto['EtaProvino']]?></h4>
							<p style="text-align: justify; padding: 20px;"><?=$DatiProgetto['DescrizioneProvino']?></p><br>
							<?php require("AggiungiLinkCopione.php"); ?>
							<a class="btn btn-primary" href="ModificaDatiProvino.php?N=<?=$NumeroProgetto?>"><i class="fa fa-edit"></i> Modifica</a>
							<br><br><span style="font-family: Verdana; font-size: 10px;">Provino creato il: <?=Date(formato_data, $DatiProgetto['DataCreazione'])?></span>
						</div>
					</div>
				</div>
				
				<div class="col-md-6 col-sm-6 col-xs-12">
					<div class="panel panel-primary back-widget-set text-center">
						<div class="panel-heading"><b>Provini consegnati:</b></div>
						<div class="panel-body">
						<?php
							while($Provino = mysqli_fetch_assoc($DatiProvini)) {
								echo "<a href='Doppiaggio.php?N=$NumeroProgetto&P=" . $Provino['NumProvino'] . "' class='btn btn-primary btn-lg'><span class='fa fa-play-circle' style='font-size: 21px'>&nbsp;&nbsp;</span><img src='" . $Provino['FotoProfilo'] . "'>&nbsp;<b>" . $Provino['Nome']  . "</b><br>il " . Date(formato_data, $Provino['DataProvino']) . " alle " . Date("H:i", $Provino['DataProvino']) . "</a><br><br>";
							}
						?>
						</div>
					</div>
				</div>
			</div>
			
			<center>
				<div class="col-md-6">
					<div class="alert alert-<?=$DatiProgetto['Stato'] ? "danger" : "success"?>">
						<?php 
							if ($DatiProgetto['Stato']) {
								
								echo "<b>Il provino è chiuso: gli utenti non possono più partecipare!</b>";
								
							} else {
								
								$LinkProvino = "https://" . $_SERVER['SERVER_NAME'] . "/WEDUB/FaiProvino.php?N=$NumeroProgetto";
								
								echo "Il progetto è aperto a chiunque voglia partecipare!<br>Copia questo link per diffondere il provino:<br><br>
									  <a href='$LinkProvino'>$LinkProvino</a>";
									  
							}
						?>
					</div>
				</div>
				<h3><a href="GestioneMieiProvini.php" class="btn btn-info">&lt; Torna ai provini</a></h3>
			</center>

<?php require("p2.php"); ?>
