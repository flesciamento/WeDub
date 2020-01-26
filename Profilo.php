<?php
function Esci() {header("location: Dashboard.php"); exit;}

if (!($ID_Utente = $_GET['U'])) {Esci();}

require("p1.php"); require("fDoppiatoreOnline.php");
if (!$DatiUtente = mysqli_fetch_assoc(query("SELECT * FROM UtentiRegistrati WHERE ID = '$ID_Utente'"))) {"<div class='text-center'>Utente non trovato!</div>"; exit;}
?>
			<div class="text-center">
				<h4 class="header-line">PROFILO DI</h4>
                <h3 class="header-line"><b><?=$DatiUtente['Nome'] . DoppiatoreOnline($DatiUtente['DataUltimaAzione'])?></b> <?=($FotoProfilo = $DatiUtente['FotoProfilo']) ? "<img src='$FotoProfilo' width=60>" : ""?></h3>
            </div>
                            </div>

        </div>
        <script>
			function Manda(Link) {
				window.location.href = Link;
			}
        </script>
        
		<div class="row">
             <div class="col-md-6 col-sm-6 col-xs-12">
				<div class="panel panel-info text-center">
					<div class="panel-heading">
						<b>Progetti creati</b>
					</div>
					<div class="panel-body">
						<?php
						$Progetti = query("SELECT * FROM Progetti WHERE ID_CreatoreProgetto = '$ID_Utente' AND Tipo = 'Doppiaggio' ORDER BY DataCreazione DESC");
						
						echo "<div class='table-responsive'><table class='table table-hover'>
								<thead><tr><th>Data creazione</th><th>Progetto</th><th>Stato</th></tr></thead>\n";
						
						while($P = mysqli_fetch_assoc($Progetti)) {
							echo "<tr style='cursor: pointer;' onclick=\"Manda('Doppiaggio.php?N=" . $P['NumProgetto'] . "');\"><td>" . Date("d-m-Y", $P['DataCreazione']) . "</td><td>" . $P['NomeProgetto'] . " - " . $P['NomeDoppiaggio'] . "</td><td>" . ($P['Stato'] ? "<span style='font-weight: bold; color: green;'>Completato</span>" : "<span style='color: blue'>Aperto</span>") . "</td></tr>";
						}
						
						echo "</table></div>";
						?>
					</div>
				</div>
			</div>
		
			<div class="col-md-6 col-sm-6 col-xs-12">
				<div class="panel panel-info text-center">
					<div class="panel-heading">
						<b>Provini creati</b>
					</div>
					<div class="panel-body">
						<?php
						$Provini = query("SELECT * FROM Progetti WHERE ID_CreatoreProgetto = '$ID_Utente' AND Tipo = 'Provino' ORDER BY DataCreazione DESC");
						
						echo "<div class='table-responsive'><table class='table table-hover'>
								<thead><tr><th>Data creazione</th><th>Provino</th><th>Stato</th></tr></thead>\n";
						
						while($P = mysqli_fetch_assoc($Provini)) {
							echo "<tr style='cursor: pointer;' " . (($P['Stato'] == 0) ? "onclick=\"Manda('FaiProvino.php?N=" . $P['NumProgetto'] . "');\"" : "") . "><td>" . Date("d-m-Y", $P['DataCreazione']) . "</td><td>" . $P['RuoloProvino'] . " di " . $P['NomeProgetto'] . "</td><td>" . ($P['Stato'] ? "<span style='font-weight: bold; color: red;'>Chiuso</span>" : "<span style='color: blue'>Aperto</span>") . "</td></tr>";
						}
						
						echo "</table></div>";
						?>
					</div>
				</div>
			</div>
		
		</div>
			

		<div class="row">
             <div class="col-md-6 col-sm-6 col-xs-12">
				<div class="panel panel-info text-center">
					<div class="panel-heading">
						<b>Ruoli ottenuti</b>
					</div>
					<div class="panel-body">
						<?php
						$RuoliOttenuti = query("SELECT Ruoli.Ruolo, Progetti.* FROM Progetti, Ruoli WHERE Ruoli.ID_Utente = '$ID_Utente' AND Progetti.NumProgetto = Ruoli.NumProgetto ORDER BY Progetti.DataCreazione DESC");
						
						echo "<div class='table-responsive'><table class='table table-hover'>
								<thead><tr><th>Data</th><th>Progetto</th><th>Ruolo</th></tr></thead>\n";
						
						while($P = mysqli_fetch_assoc($RuoliOttenuti)) {
							echo "<tr style='cursor: pointer;' onclick=\"Manda('Doppiaggio.php?N=" . $P['NumProgetto'] . "');\"><td>" . Date("d-m-Y", $P['DataCreazione']) . "</td><td>" . $P['NomeProgetto'] . " - " . $P['NomeDoppiaggio'] . "</td><td>" . $P['Ruolo'] . "</td></tr>";
						}
						
						echo "</table></div>";
						?>
					</div>
				</div>
			</div>
		
			<div class="col-md-6 col-sm-6 col-xs-12">
				<div class="panel panel-info text-center">
					<div class="panel-heading">
						<b>Provini a cui ha partecipato</b>
					</div>
					<div class="panel-body">
						<?php
						$ProviniPubblicati = query("SELECT Progetti.*, Provini.NumProvino, Provini.DataProvino FROM Progetti, Provini WHERE Provini.ID_UtenteProvinante = '$ID_Utente' AND Progetti.NumProgetto = Provini.NumProgetto AND Provini.ProvinoPubblicato = 1 ORDER BY Provini.DataProvino DESC");
						
						echo "<div class='table-responsive'><table class='table table-hover'>
								<thead><tr><th>Data</th><th>Provino</th></tr></thead>\n";
						
						while($P = mysqli_fetch_assoc($ProviniPubblicati)) {
							echo "<tr style='cursor: pointer;' onclick=\"Manda('Doppiaggio.php?N=" . $P['NumProgetto'] . "&P=" . $P['NumProvino'] . "');\"><td>" . Date("d-m-Y", $P['DataProvino']) . "</td><td>" . $P['RuoloProvino'] . " di " . $P['NomeProgetto'] . "</td></tr>";
						}
						
						echo "</table></div>";
						?>
					</div>
				</div>
			</div>
		
		</div>

<?php require("p2.php"); ?>
