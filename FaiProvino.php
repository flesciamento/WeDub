<?php 
if (!$NumeroProgetto = $_GET['N']) {header("location: Dashboard.php"); exit;}

require("p1.php");

	require("DecodificaDatiPersonaggi.php"); require("fPlayerVideo.php");  
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT Progetti.*, UtentiRegistrati.Nome FROM Progetti, UtentiRegistrati WHERE NumProgetto = '$NumeroProgetto' AND Tipo = 'Provino' AND UtentiRegistrati.ID = Progetti.ID_CreatoreProgetto"))) {header("location: Dashboard.php"); exit;}
	
	$DatiProvini = query("SELECT * FROM Provini WHERE NumProgetto = '$NumeroProgetto' AND ID_UtenteProvinante = '" . $_SESSION['ID'] . "' ORDER BY DataProvino DESC");
	
	ChiudiMySql();
?>
                <center>
					<h2 class="header-line">PROVINO:</h2>
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
							<b>Stato</b>: <?=$DatiProgetto['Stato'] ? "<span class='btn btn-danger'>Chiuso</span>" : "<span class='btn btn-info btn-sm'>Aperto</span>"?>
							<br><br>
							<?=PlayerVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo'], 300, 169)?>
							
							<br><br>
							<h4><i><b>Sesso</b></i>: <?=$SessoPersonaggio[$DatiProgetto['SessoProvino']]?></h4>
							<h4><i><b>Età</b></i>: <?=$EtaPersonaggio[$DatiProgetto['SessoProvino']][$DatiProgetto['EtaProvino']]?></h4>
							<p style="text-align: justify; padding: 20px;"><?=$DatiProgetto['DescrizioneProvino']?></p><br>
							<?php require("AggiungiLinkCopione.php"); ?><br><br>
							<span style="font-family: Verdana; font-size: 10px;">Provino creato da <?=$DatiProgetto['Nome']?> il: <?=Date(formato_data, $DatiProgetto['DataCreazione'])?></span>
						</div>
					</div>
				</div>
				
				<div class='col-md-6 col-sm-6 col-xs-12 alert alert-success back-widget-set text-center'>
				<?php
					while($Provino = mysqli_fetch_assoc($DatiProvini)) {
						echo "<a href='Doppiaggio.php?N=$NumeroProgetto&P=" . $Provino['NumProvino'] . "' class='btn " . ($Provino['ProvinoPubblicato'] ? "btn-success" : "btn-primary") . " btn-lg'>
								<span class='fa fa-edit' style='font-size: 21px;'>&nbsp;&nbsp;</span><b>Provino " . ($Provino['ProvinoPubblicato'] ? "pubblicato" : "da mandare") . "<br>
								<span style='font-size: 16px;'>" . ($Provino['ProvinoPubblicato'] ? "il " : "creato il ") . Date(formato_data, $Provino['DataProvino']) . " alle " . Date("H:i", $Provino['DataProvino']) . "</span></b>
							  </a><br><br>";
					}
				?>
					<a href="Doppiaggio.php?N=<?=$NumeroProgetto?>" class="btn btn-success btn-lg"><span class="fa fa-microphone" style="font-size: 21px;">&nbsp;&nbsp;</span><B>NUOVO PROVINO ></B></a>
				</div>
			</div>
			
			<center><h3><a href="ListaProvini.php" class="btn btn-info">&lt; Torna a tutti i provini</a></h3></center>

<?php require("p2.php"); ?>
