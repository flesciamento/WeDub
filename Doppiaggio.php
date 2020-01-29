<?php 
	function Esci() {
		header("location: Dashboard.php"); exit;
	}
	
	if (!$N = $_GET['N']) {Esci();}

	require("connessione.php"); require("fSistema.php"); 
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT * FROM Progetti WHERE NumProgetto = '$N'"))) {Esci();}

	if (!$DatiProgetto['Stato']) {require("ControllaAccesso.php");} else {Session_start();} //Se il progetto di doppiaggio è completato o il provino è chiuso (e pubblicato v. succ.), il video doppiato è pubblico (attualmente non dà la possibilità di caricare le tracce, v. CaricaRegistrazione.php)
	
		$CreatoreDelProgetto = ($_SESSION['ID'] == $DatiProgetto['ID_CreatoreProgetto']);
		
		if ($Provino = ($DatiProgetto['Tipo'] == "Provino")) {
			
			if (!$P = $_GET['P']) {
				
				if ($DatiProgetto['Stato'] && !$CreatoreDelProgetto) {exit("<center><br><br>Il provino è stato chiuso!<br><br><a href='ListaProvini.php'>&lt;&lt; Torna ai provini!</a></center>");}
				
				/*** Nel caso di un nuovo provino, viene:
				 *  creata la nuova riga del database
				 *  ricaricata subito la pagina con i riferimenti nuovi (in maniera tale che l'eventuale aggiornamento della pagina non dia problemi) ***/
				require("fChiavePrimariaUltimaOperazione.php");
				query("INSERT INTO Provini (NumProgetto, ID_UtenteProvinante, DataProvino) VALUES ('$N', '" . $_SESSION['ID'] . "', '" . time() . "')");
				
				$P = ChiavePrimariaUltimaOperazione();
			
				header("location: Doppiaggio.php?N=$N&P=$P"); exit;
			}
			
			if (!$DatiProvinante = mysqli_fetch_assoc(query("SELECT * FROM Provini, UtentiRegistrati WHERE Provini.NumProvino = '$P' AND Provini.NumProgetto = '$N' AND UtentiRegistrati.ID = Provini.ID_UtenteProvinante"))) {Esci();}
			
			$DoppiatoriTotali = 1; $DatiDoppiatori = array(1 => array("ID" => $DatiProvinante['ID'], "Nome" => $DatiProvinante['Nome'], "FotoProfilo" => $DatiProvinante['FotoProfilo'], "Ruolo" => $DatiProgetto['RuoloProvino']));
			
			$Visitatore = ($_SESSION['ID'] != $DatiProvinante['ID']);

			if ($Visitatore && !$DatiProvinante['ProvinoPubblicato']) {Esci();}
			
			$SessioneOspite = ($Visitatore || $DatiProgetto['Stato']); $NumeroPosizionePersonale = ($Visitatore? "" : 1);
			
		} else {
			$P = 0;
			require("fAcquisisciDatiDoppiatori.php");
			
			$DatiDoppiatori = AcquisisciDatiDoppiatori($N); $DoppiatoriTotali = count($DatiDoppiatori); $TantiDoppiatori = ($DoppiatoriTotali > 5);
			
			for($I = 1; $I <= $DoppiatoriTotali && $DatiDoppiatori[$I]['ID'] != $_SESSION['ID']; $I++);
			
			$SessioneOspite = ($I > $DoppiatoriTotali); $NumeroPosizionePersonale = ($SessioneOspite? "" : $I);
	
		}
		
		$SuddivisioneTracce = ($TantiDoppiatori? "70" : (100 / $DoppiatoriTotali)); $UnitaDiMisura = ($TantiDoppiatori? "px" : "%");
		
	ChiudiMySql();
?>

<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta name="mobile-web-app-capable" content="yes">

  <base target="_blank">

  <title>WE DUB - Doppiaggio <?=$DatiProgetto['NomeProgetto']?></title>

  <link rel="stylesheet" href="css/Template5.3.2.css">
  <link rel="stylesheet" href="assets/css/bootstrap1.1.css">
  <link rel="stylesheet" href="assets/css/font-awesome.css">
  <style type="text/css">
    a.fa-file-audio-o, a.fa-file-zip-o {
        transition: all 1s;
        width: 20px;
    }
    
    a.fa-file-audio-o:hover {
        width: 335px;
        font-size: 14px
    }
    a.fa-file-audio-o:hover:after {
        content: " Esporta l'intera traccia in un unico file audio";
    }
    
    a.fa-file-zip-o:hover {
        width: 260px;
    }
    a.fa-file-zip-o:hover:after {
        content: " Scarica tutte le clip audio in un file zip";
    }

	.TabellaOpzioniTraccia tr td {
		padding: 10px;
	}
  </style>
</head>
<body>
	<div id="divCaricamento" class='text-center'><span id="MsgCaricamentoIniziale">Caricamento in corso...</span>&nbsp;<img id="imgAttesaIniziale" src="images/attendere.gif">
		<p id="Info"><span id="TuaVersione"></span></p>
		<script>var Testo = document.getElementById('TuaVersione');</script><script src="ControllaBrowser2.2.js"></script>
		<p id="MessaggiIniziali"></p>
	</div>

	
	<div id="Contenitore">
		<div id="LineaTemporale">
			<table id="TabellaLineaTemporale" width="100%">
				<tr>
					<td width="10%"><div id="NomiTracce" class="Tracce" style="width: 10%; z-index: 1;">
						<?php
							$Alternanza = true; $NumeroTraccia = 0; $strTracce = "";
							foreach($DatiDoppiatori as $Doppiatore) {
								$Alternanza = !$Alternanza; $TracciaPersonale = (($NumeroTraccia + 1) == $NumeroPosizionePersonale);
								$ColoreAlternato = ($Alternanza ? " lavender" : "white"); $Bordo = ($TracciaPersonale? " border-width: 2px 0; border-color: green; border-style: solid;" : "");
								$PosizioneTraccia = ($NumeroTraccia * $SuddivisioneTracce);
								
								$strTracce .= $strTraccia = "<div class='NomeTraccia' style='Top: $PosizioneTraccia$UnitaDiMisura; height: $SuddivisioneTracce$UnitaDiMisura; background-color: $ColoreAlternato; $Bordo opacity: 0.9; box-shadow: $ColoreAlternato 5px 0px 10px;'>";
										
								echo $strTraccia . "<div><img src='" . $Doppiatore['FotoProfilo'] . "' height='35' width='35' style='float: left;'><b>" . substr($Doppiatore['Nome'], 0, 20) . (strlen($Doppiatore['Nome']) > 20 ? "..." : "") . "&nbsp;<span id='" . $Doppiatore['ID'] . "_online' style='color: green;' class='" . (($Doppiatore['DataUltimaAzione'] > strtotime("20 minutes ago")) ? "fa fa-circle" : "") . "'></span></b><br>
											<i>" . $Doppiatore['Ruolo'] . "</i>"
											 . (($CreatoreDelProgetto || $TracciaPersonale) ? "<br /><table class='TabellaOpzioniTraccia'><tr><td><a onclick='ApriFinestra(event);' data-larghezza='850px' data-altezza='500px' data-link='RenderingAudio/Rendering/Rendering.php?N=$N&P=$P&ID=" . $Doppiatore['ID'] . "' class='btn btn-success btn-xs fa fa-file-audio-o' title=\"Esporta l'intera traccia in un unico file audio\"></a></td><td><a id='DownloadTraccia$NumeroTraccia' onclick='DownloadTraccia($NumeroTraccia);' data-utente='" . $Doppiatore['ID'] . "' class='btn btn-info btn-xs fa fa-file-zip-o' title='Scarica le singole clip in un file zip'></a></td></tr></table>"
											 : "") . 
										"</div>
										<input type='hidden' id='NomeDoppiatore_" . $Doppiatore['ID'] . "' value='" . SistemaHTML($Doppiatore['Nome']) . "'>
										<input type='hidden' id='NumeroTraccia_" . $Doppiatore['ID'] . "' value='$NumeroTraccia'>
                                    </div>";
								$strTracce .= "</div>";
								$NumeroTraccia++;
							}
							
						?>
						<input type="hidden" id="SuddivisioneTracce" value="<?=$SuddivisioneTracce?>"><input type="hidden" id="UnitaDiMisura" value="<?=$UnitaDiMisura?>">
					</div></td>
					<td id="ContenitoreRighello" style="width: 90%;"><div id="Righello"><div id="MinutaggiRighello"></div><img id="Cursore" src="images/Cursore.png" <?=(($UnitaDiMisura == "px") ? "style='height: " . ($SuddivisioneTracce * $DoppiatoriTotali) . "px;'" : "")?>><div id="ContenutoTracce" class="Tracce" style="width: 100%;"><?=$strTracce?></div></div></td>
				</tr>
			</table>
			<img id="imgAttesa" src="images/attendere.gif">
		</div>
    </div>

	<!-- Elementi che stanno sopra rispetto alle tracce (anche nell'asse Z) -->
	<div id="Monitors" class='text-center'>
			<table id="TabellaMonitors">
				<tr>
					<td width="30%" style="vertical-align: bottom; padding: 20px;">
						<video id="gum" autoplay muted style="display: none;"></video>
						
						<?php
							if ($Provino) {
								/*** Provino ***/
								$Indirizzo = ($CreatoreDelProgetto? "GestioneProvino.php" : "FaiProvino.php");
								if ($SessioneOspite) {
									echo "<div class='alert alert-success text-center'><b>Provino di " . strtoupper($DatiProvinante['Nome']) . "</b><br>
												<span style='color: grey;'>del " . Date("d/m/Y", $DatiProvinante['DataProvino']) . " alle " . Date("H:i", $DatiProvinante['DataProvino']) . "</span>
										  </div>";
								}
								$strScrittaSotto = "<a href='$Indirizzo?N=$N' id='pulEsci' class='btn btn-info' target='_self'>&lt; Esci</a>";
							} else {
								/*** Doppiaggio ***/
								if ($DatiProgetto['Stato']) {$strScrittaSotto = "<div class='alert alert-success text-center'><b>Il progetto è stato marcato come COMPLETATO!</b></div>";}
							}
						?>
						<div id="Messaggio"></div><div id="BarraProgressoCaricamento"><div id="ProgressoCaricamento"></div></div>
						<?=$strScrittaSotto?>
					</td>
					<td width="40%" id="ContenitoreVideoGuida"></td>
					<td width="30%" style="text-align: right; vertical-align: bottom; position: relative;">
						<img src="assets/img/logomicrofono300_WEDUB_2.png" width="150" style="position: fixed; top: 0px; right: 0px;">

						<table style="position: absolute; top: 100px; float: right; right: 0px;<?=($SessioneOspite? " display: none;" : "")?>">
							<tr id="SelezioneMicrofono"><td style="vertical-align: middle;">Microfono:&nbsp;&nbsp;</td><td><select id="SorgenteAudio" disabled></select></td></tr>
							<tr id="SelezioneWebcam"><td><!-- Webcam: --></td><td><select id="SorgenteVideo" disabled style="display: none;"><option value="">Disattivata</option></select></td></tr>
						</table>
						
						<div style="clear: right; position: absolute; bottom: 10px; width: 90%; right: 20px;">
							<div id="MessaggiUlteriori" style="color: grey;"></div>
							<table width=100%>
								<tr>
									<td><?php require("AggiungiLinkCopione.php"); ?></td>
									<td>
							<?php
							if ($Provino) {
								/*** Provino ***/
								if (!$SessioneOspite) {
									if ($DatiProvinante['ProvinoPubblicato']) {
										echo "<span style='color: green; font-weight: bold; font-decoration: italic;'>Il provino è stato pubblicato!</span>";
									} else {
										echo "<a href='PubblicaProvino.php?N=$N&P=$P' class='btn btn-success' target='_self'>Manda il provino ></a>";
									}
								}
								if ($DatiProgetto['Stato']) {echo "<div class='alert alert-warning text-center'><b style='font-size: 14px;'>Il provino per questo personaggio è stato chiuso!</b></div>";}
							} else {
								/*** Doppiaggio ****/
								$Indirizzo = $CreatoreDelProgetto? "GestioneProgetto.php?N=$N" : "Dashboard.php";
								echo "<a href='$Indirizzo' id='pulEsci' class='btn btn-info' target='_self'>" . ($SessioneOspite? "Esci" : "Termina doppiaggio ed esci") . " ></a><br>";
							}
							?>		
									</td>
								</tr>
							</table>
						</div>
					</td>
				</tr>
			</table>
	</div>
			
	<div id="ComandiPlayer" class='text-center'>
			<table id="TabellaVideoGuida" style="margin: 0px auto;">
				<tr>
					<td rowspan=2><button id="AnnullaRegistrazione" class="PulsanteGrafico" title="Annulla la registrazione in corso (non salvare)" disabled><img id="imgAnnullaRegistrazione" class="imgComandoPlayer" src="images/x-rossa.png"></button></td><td rowspan=2><button id="StopRegistrazione" class="PulsanteGrafico" title="Termina la registrazione e salva" disabled><img id="imgStopRegistrazione" class="imgComandoPlayer" src="images/red-stop-button-spigoloso.png"></button></td><td rowspan=2><button id="Registra" title="Registra" class="PulsanteGrafico" disabled><span id="TestoPulRegistra" style="display: none;"></span><img id="imgRegistra" class="imgComandoPlayer" src="images/rec-rosso-microfono.png"></button></td><td rowspan=2><button id="Play" class="PulsanteGrafico"><img id="imgPlay" class="imgComandoPlayer" src="images/play-blue.png"></button></td>
					<td>Volume:</td><td>Minuti</td><td>Secondi</td><td rowspan=2 width="21%" style="padding-left: 10px;">&nbsp;<div id="meters"><div id="instant"><div class="label"></div><meter high="0.25" max="1" value="0"></meter><div class="value"></div></div><div id="slow"><div class="label"></div><meter high="0.25" max="1" value="0"></meter><div class="value"></div></div><div id="clip"><div class="label"></div><meter max="1" value="0"></meter><div class="value"></div></div></div></td>
					<td>Zoom:</td>
				</tr>
				<tr>
					<td><input type="range" id="VolumeVideoGuida" min="0" max="1" step="0.01" value="1" onchange="CambiaVolumeVideoGuida()"></td><td><input type="number" id="MinutaggioMinuti" class="SelettoreMinutaggioMinuti" min="0" step="1" onchange="MinutaggioCambiato()"></td><td><input type="number" id="MinutaggioSecondi" class="SelettoreMinutaggioSecondi" min="0" step="0.1" onchange="MinutaggioCambiato()"></td>
					<td style="padding-left: 10px;"><input type="range" id="Zoom" min="100" max="500" value="100" style="width: 100px;"></td>
				</tr>
			</table>
	</div>
	
	<?php define('versione', "4.2.1.2"); ?>
	<script>
		const N = "<?=$N?>", P = "<?=$P?>", TipoProgetto = "<?=$DatiProgetto['Tipo']?>";
		const NomeProgetto = "<?=Sistema($DatiProgetto['NomeProgetto'], true)?>", NomeDoppiaggio = "<?=Sistema($Provino? "Provino per " . $DatiProgetto['RuoloProvino'] : $DatiProgetto['NomeDoppiaggio'], true)?>";
		const ID_Utente = "<?=$_SESSION['ID']?>"
		const SessioneOspite = <?=($SessioneOspite? "true" : "false")?>, ProgettoCompletato = <?=($DatiProgetto['Stato']? "true" : "false")?>, SolaVisione = <?=(($SessioneOspite || $DatiProgetto['Stato']) ? "true" : "false") ?>;
		const PercorsoVideoGuida = "<?=$DatiProgetto['PercorsoVideo']?>";
	</script>
	<script defer src="FunzioniComuni5.4.3.js"></script><script defer src="FunzioniComuni5.1.0_stringheITA.js"></script>
	<script defer src="MediaStreamRecorder/MediaStreamRecorder-v2.1.js"></script><script defer src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
	<script defer type='text/javascript' src="RenderingAudio/Rendering/ffmpeg-terminal4.0.0.2_stringheITA.js"></script><script defer type='text/javascript' src="RenderingAudio/Rendering/ffmpeg-terminal-doppiaggio4.1.0.0.js"></script>
	<script defer src="waveform.js"></script>
	<script defer src="StatisticheSuono.js"></script>
	<script defer src="Registrazione4.1.4.5_stringheITA.js"></script><script defer src="Registrazione<?=versione?>.js"></script>
	<script defer src="SelezioneDispositivo3.2.js"></script>
	<?php
	$NecessarieLibrerieFB = ($_SESSION['FB'] == 1);
	switch($DatiProgetto['PiattaformaVideo']) {
		case "YouTube": echo "<script defer src='https://www.youtube.com/iframe_api'></script><script defer src='InterfacciaVideoYouTube4.0.js'></script>"; break;
		case "DailyMotion": echo "<script defer src='https://api.dmcdn.net/all.js'></script><script defer src='InterfacciaVideoDailyMotion6.8.1.js'></script>"; break;
		case "Facebook": echo "<div id='fb-root'></div><script defer src='InterfacciaVideoFacebook4.0.3.2.js'></script>"; $NecessarieLibrerieFB = true; break;
		case "Integrata": echo "<script defer src='InterfacciaVideoIntegrato3.6.2.js'></script>"; break;
	}
	?>
	
	<?php
		echo (($_SESSION['FB'] == 1) ? "<script defer src='FBVerificaAccount.js'></script>" : "") . ($NecessarieLibrerieFB? "<script defer src='FBDiramaStatoLoginUtente.js'></script><script defer src='FBLibrerie.js'></script><script defer src='Logout1.3.js'></script>" : "");
	?>
	<div id="Versione"><?=versione?></div>
</body>
</html>
