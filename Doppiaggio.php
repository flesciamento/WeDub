<?php 
	function Esci() {
		header("location: Dashboard.php"); exit;
	}
	
	/** Controlli esistenza progetto **/
	if (!$N = $_GET['N']) {Esci();}

	require("connessione.php"); require("fSistema.php"); 
	
	if (!$DatiProgetto = mysqli_fetch_assoc(query("SELECT * FROM Progetti WHERE NumProgetto = '$N'"))) {Esci();}
	/**********************************/

	require("AcquisisciDatiCreatoreProgetto.php"); require("Doppiaggio_Stringhe.php");

	$NumeroTracciaRuoliDaAssegnare = "false";
	
	$ModalitaStreaming = ($_GET['Streaming'] == 1);
		
	/** Gestione del progetto **/
	if ($Provino = ($DatiProgetto['Tipo'] == "Provino")) {

		require("ControllaAccesso.php"); require("DeterminaCreatoreProgetto.php"); // L'utente dev'essere iscritto al sito per potere visualizzare o creare qualunque provino.
		
		if (!$P = $_GET['P']) {
			
			if ($DatiProgetto['Stato'] && !$CreatoreDelProgetto) {exit("<center><br><br>" . s_ProvinoChiuso . "<br><br><a href='ListaProvini.php'>&lt;&lt; " . s_TornaAiProvini . "</a></center>");}
			
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

		if ($Visitatore && !$DatiProvinante['ProvinoPubblicato']) {Esci();} // Il provino non è visibile per i visitatori a meno che non venga pubblicato.
		
		$NumeroPosizionePersonale = ($Visitatore? "" : 1);

		$SessioneOspite = ($Visitatore || $DatiProgetto['Stato']); // Siamo sempre "ospiti" se il provino è stato chiuso. Gli ospiti non possono modificare nulla, a meno che non siamo i creatori del progetto (v. CreaElementoLineaTemporale js)

		if (($CreatoreDelProgetto) && ($DatiProvinante['Visionato'] == 0)) {query("UPDATE Provini SET Visionato = 1 WHERE NumProvino = '$P'");} // Aggiorna la presa visione del provino da parte del creatore del progetto.
		
	} else {
		$P = 0;
		if (!$DatiProgetto['Stato']) {require("ControllaAccesso.php");} else {Session_start();} // Se il progetto di doppiaggio è completato, il video doppiato è pubblico
		require("fAcquisisciDatiDoppiatori.php"); $DatiDoppiatori = AcquisisciDatiDoppiatori($N); require("DeterminaCreatoreProgetto.php"); 
		require("fRilevaRuoliDaAssegnare.php"); $RuoliDaAssegnare = RilevaRuoliDaAssegnare($N);
		
		$DoppiatoriTotali = count($DatiDoppiatori);
		/* Verifica se siamo uno dei doppiatori, altrimenti siamo "visitatori". Il creatore del progetto potrà comunque modificare tutte le tracce (v. CreaElementoLineaTemporale js) */
		for($I = 1; ($I <= $DoppiatoriTotali) && ($DatiDoppiatori[$I]['ID'] != $_SESSION['ID']); $I++);
		$Visitatore = ($I > $DoppiatoriTotali); $NumeroPosizionePersonale = ($Visitatore? 0 : $I);
		if ($PresenzaTracciaRuoliDaAssegnare = ($RuoliDaAssegnare && ($Visitatore || $CreatoreDelProgetto))) {
			$DatiDoppiatori[0] = array("ID" => "RuoliDaAssegnare", "Nome" => "", "FotoProfilo" => "images/RuoliDaAssegnare2ITA.png", "Ruolo" => $RuoliDaAssegnare);
			if ($Visitatore) {ksort($DatiDoppiatori); $NumeroTracciaRuoliDaAssegnare = 0;} else {$NumeroTracciaRuoliDaAssegnare = $DoppiatoriTotali;} // Se si è creatore del progetto non visitatore (doppiatore) la traccia comparirà come ultima, altrimenti sarà la prima.
		}
		$SonoDoppiatoreCandidatoRuoliDaAssegnare = ($PresenzaTracciaRuoliDaAssegnare && !$CreatoreDelProgetto);

		require("DeterminaUnicoDoppiatore.php");

		/* Memorizza la presa visione del proprio ruolo se siamo uno dei doppiatori */
		if ((!$Visitatore) && ($DatiDoppiatori[$I]['EntratoPrimaVolta'] == 0)) {query("UPDATE Ruoli SET EntratoPrimaVolta = 1 WHERE NumProgetto = '$N' AND ID_Utente = '" . $_SESSION['ID'] . "'");}

		/* Determina se possiamo registrare o meno */
		$SessioneOspite = (($Visitatore && (!$RuoliDaAssegnare || $CreatoreDelProgetto)) || $DatiProgetto['Stato']); // Siamo sempre "ospiti" se il progetto è marcato come "completato".

		/* Verifica se la modalità Light o Ultra-Light è attivabile */
		if ($SessioneOspite && ($_GET['ModalitaLight'] || $_GET['ModalitaUltraLight'])) {exit(s_NonPuoiUsareModalitaLight);}

		/* Carica gli eventuali titoli per la modalità streaming */
		if ($ModalitaStreaming) {$Titoli = query("SELECT N, MinutaggioTitolo, DurataTitolo, Titolo FROM TitoliVersioneStreaming WHERE NumProgetto = $N");}
	}
	
	$pxPosizioneNomiTracce = ($SessioneOspite? "81" : "82"); $TantiDoppiatori = ($DoppiatoriTotali > 1);
	$SuddivisioneTracce = ($TantiDoppiatori? "90" : (80 / $DoppiatoriTotali)); $UnitaDiMisura = ($TantiDoppiatori? "px" : "%");
		
	ChiudiMySql();


	function LimitaCaratteri($Stringa, $Limite) {
		return ((strlen($Stringa) > $Limite) ? substr($Stringa, 0, $Limite) . "..." : $Stringa);
	}

	require("fAnteprimaVideo.php");

	$strTitoloDaVisualizzare = "WE DUB - Doppiaggio " . $DatiProgetto['NomeProgetto'] . " - " . $DatiProgetto['NomeDoppiaggio'];
	$strPercorsoAnteprimaVideo = PercorsoAnteprimaVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo']);
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="mobile-web-app-capable" content="yes" />
	<link rel="manifest" href="manifest1.0.json" />
	<meta id='meta_viewport' name="viewport" content="width=device-width, initial-scale=0.35, maximum-scale=0.35, user-scalable=no" />
	<base target="_blank" />

	<title><?=$strTitoloDaVisualizzare?></title>
	<meta property="og:title" content="<?=$strTitoloDaVisualizzare?>" />
	<meta property="og:type" content="video.movie" />
	<meta property="og:url" content="https://wedub.altervista.org/WEDUB/Doppiaggio.php?N=<?=$N?>&P=<?=$P?>" />
	<meta property="og:image:url" content="<?=$strPercorsoAnteprimaVideo?>" />
	<meta property="og:image:secure_url" content="<?=$strPercorsoAnteprimaVideo?>" />
	<meta property="og:description" content="Video doppiato con We Dub: piattaforma libera per il doppiaggio amatoriale!" />

	<script>
		if (window.location.href.substr(0, 5) == "http:") {window.location.href = "https://<?=$_SERVER['SERVER_NAME']?>/WEDUB/Doppiaggio.php?N=<?=$N?>&P=<?=$P?>&Streaming=<?=$_GET['Streaming']?>";}
	</script>
  
	<link rel="icon" href="images/audio-input-microphone.svg" />
	<link rel="stylesheet" href="css/Template5.3.2-black9.2.0.0.css" />
	<link rel="stylesheet" href="css/AnimazioniAttesa1.0.css" />
	<link rel="stylesheet" href="assets/css/bootstrap1.1.css" />
	<link rel="stylesheet" href="assets/css/font-awesome.css" />
	<link rel="stylesheet" href="assets/css/style1.4.css" />
	<style type="text/css">
		.TabellaOpzioniTraccia tr td a {
			transition: all 1s;
			width: max-content;
		}
		
		.TabellaOpzioniTraccia tr td a.fa-download.btn-default:hover:after {
			content: " <?=s_descrpultraccia_Download?>";
		}

		.TabellaOpzioniTraccia tr td > a.fa-volume-up.btn-default:hover:after {
			content: " <?=s_descrpultraccia_Muta?>";
		}

		.TabellaOpzioniTraccia tr td > a.fa-trash-o.btn-default:hover:after {
			content: " <?=s_descrpultraccia_CestinoRipristina?>";
		}

		.TabellaOpzioniTraccia tr td > a.fa-trash-o.btn-warning:hover:after {
			content: " <?=s_descrpultraccia_CestinoNascondi?>";
		}
		
		.TabellaOpzioniTraccia tr td {
			padding: 0px 10px;
		}
	</style>
</head>
<body id='bodyPagina'>
	<script>
		var NotificaMessaggi = false, RidimensionaVideo = false; // Inizializza i nomi delle funzioni per potere verificare con if se al momento opportuno esistono
	</script> 
	
	<div id="Contenitore" <?=($TantiDoppiatori? "style='height: " . ($SuddivisioneTracce * $DoppiatoriTotali + 30) . "px;'" : "")?>>
		<div id="LineaTemporale" style='display: <?=($ModalitaStreaming? "none" : "inline")?>;'>
			<div id="NomiTracce" class="Tracce" style="position: fixed; left: 0px; top: calc(40% + <?=$pxPosizioneNomiTracce?>px); width: 10%; z-index: 1000;">
				<?php
					$Alternanza = true; $NumeroTraccia = 0; $strTracce = ""; $strArrayDatiDoppiatori = "";
					foreach($DatiDoppiatori as $Doppiatore) {
						$Alternanza = !$Alternanza; $TracciaPersonale = (($NumeroTraccia + (!$PresenzaTracciaRuoliDaAssegnare || $CreatoreDelProgetto)) == $NumeroPosizionePersonale);
						$TracciaRuoliDaAssegnare = ($Doppiatore['ID'] == "RuoliDaAssegnare"); $OpzioniRuoliDaAssegnare = ($TracciaRuoliDaAssegnare && $CreatoreDelProgetto);
						$ColoreAlternato = ($Alternanza ? "lavender" : "aliceblue"); $Bordo = ($TracciaPersonale? " border-width: 1px 0; border-color: green; border-style: solid;" : "");
						$PosizioneTraccia = ($NumeroTraccia * $SuddivisioneTracce);
						$ProprietaDivTraccia = "class='NomeTraccia' style='top: $PosizioneTraccia$UnitaDiMisura; height: $SuddivisioneTracce$UnitaDiMisura; background-color: $ColoreAlternato; $Bordo box-shadow: $ColoreAlternato 5px 0px 10px;";

						$PulsanteEscludiRipristinaTraccia = "<td><a id='EscludiRipristinaTraccia" . $Doppiatore['ID'] . "' onclick=\"EscludiRipristinaTraccia('" . $Doppiatore['ID'] . "');\" class='btn btn-default btn-xs fa fa-volume-up' title=\"Rendi muta (o ripristina) l'intera traccia\"></a></td>";
						$ID_OpzioniDownload = "OpzioniDownload$NumeroTraccia";
								
						echo "<div id='NomeTraccia$NumeroTraccia' data-numerotraccia='$NumeroTraccia' ontouchstart=\"AttivaVariazioneAltezzaTracciaConMouse(event);\" $ProprietaDivTraccia'>
								<div id='divContenutoNomeTraccia$NumeroTraccia'>" . ($OpzioniRuoliDaAssegnare? "<div class='ContenitoreSpiegazioniFunzioni' onmouseenter='AggiornaElencoCandidatiRuoliDaAssegnare_slow();' onmouseleave='ElencoCandidatiRuoliDaAssegnareScompare_slow();'>" : "") .
									"<a class='btn btn-default btn-sm " . ($TracciaRuoliDaAssegnare? "alert-info' id='pulRuoliDaAssegnare' title='-- " . s_RuoliDaAssegnare . " -- ' style='white-space: normal; word-break: break-word; text-align: left;'" . ($OpzioniRuoliDaAssegnare? "onclick='AggiornaElencoCandidatiRuoliDaAssegnare();'" : "") : "' style='overflow: hidden; text-overflow: ellipsis; width: 100%;' title='-- " . SistemaHTML(strtoupper($Doppiatore['Nome']) . " - " . $Doppiatore['Ruolo']) . " -- ' data-link='Profilo.php?U=" . $Doppiatore['ID'] . "' data-larghezza='800' data-altezza='600' data-nomefinestra='Profilo" . $Doppiatore['ID'] . "' onclick='ApriFinestra(event);'") . ">"
									. ($TracciaRuoliDaAssegnare? "<div id='divTitoloRuoliDaAssegnare' class='btn btn-success btn-sm' style='font-style: italic; font-weight: bold; margin-bottom: 10px'>" . s_RuoliDaAssegnare . "</div><br />" : "")
									. "<img id='FotoProfiloTraccia$NumeroTraccia' src='" . $Doppiatore['FotoProfilo'] . "' height='35' width='35' alt='' onerror=\"this.src='images/null.png'\" style='float: left;' />
									   <span id='" . $Doppiatore['ID'] . "_online' name='" . $Doppiatore['ID'] . "_online'></span>
									   <b><span id='spanNomeUtenteTraccia$NumeroTraccia'>" . ($OpzioniRuoliDaAssegnare? "<div class='btn btn-primary btn-xs'>" . s_CliccaPerListaCandidati . "</div>" : $Doppiatore['Nome']) . "</span></b>
									   <br /><i><span id='spanRuoliTraccia$NumeroTraccia'>" . $Doppiatore['Ruolo'] . "</span></i></a><br />"
									. ($OpzioniRuoliDaAssegnare? "<div id='divElencoCandidatiRuoliDaAssegnare' class='SpiegazioniFunzioni transizione-morbida-si' style='left: 100%; top: 0px; width: 350px; opacity: 0; visibility: hidden;'></div></div>
																  <div id='divChatCandidato' class='btn btn-primary btn-xs fa fa-comments-o' style='display: none;' data-link='' data-larghezza='800' data-altezza='600' data-nomefinestra='ChatRoomCandidato' onclick='ApriFinestra(event);'> " . s_ChattaConDoppiatore . "</div><div id='divChatCandidato_NumeroMessaggiDaLeggere' style='position: relative; top: -6px; left: -10px; border-radius: 10px; background-color: red; height: 25px; padding: 0px 5px; color: white; display: none;'></div>
																  <div id='divNotificaNuoveClipRuoliDaAssegnare' style='position: fixed; left: 10%; margin-top: -30px; background-color: red; border-radius: 10px; color: white;'></div>
																  <div id='pulAggiungiDoppiatoreCandidato' class='btn btn-warning btn-xs' style='display: none;' onclick='AggiungiDoppiatoreCandidatoNelCast(event);'>" . s_AggiungiDoppiatoreNelCast . "</div>" : "")

									. "<table class='TabellaOpzioniTraccia'>
										<tr>"
								. (($CreatoreDelProgetto || $TracciaPersonale)
										?  "<td><div class='btn-group'>
													<a data-toggle='dropdown' class='btn btn-default btn-xs fa fa-download' onclick=\"ApriChiudiMenu('$ID_OpzioniDownload', true);\"><span class='caret'></span></a>
													<ul id='$ID_OpzioniDownload' class='dropdown-menu'>
														<li id='DownloadTraccia$NumeroTraccia' onclick=\"DownloadTraccia($NumeroTraccia); ApriChiudiMenu('$ID_OpzioniDownload', false);\" data-utente='" . $Doppiatore['ID'] . "' class='btn btn-info fa fa-file-zip-o' title='" . s_ScaricaZipTraccia_title . "'> " . s_ScaricaZipTraccia . "</li>
														<li id='EsportaTraccia$NumeroTraccia'  onclick=\"ApriFinestra(event); ApriChiudiMenu('$ID_OpzioniDownload', false);\" data-larghezza='850px' data-altezza='500px' data-link='RenderingAudio/Rendering/Rendering.php?N=$N&P=$P&ID=" . $Doppiatore['ID'] . "' class='btn btn-primary fa fa-file-audio-o' title=\"" . s_EsportaAudioTraccia_title . "\"> " . s_EsportaAudioTraccia . "</li>
													</ul>
												</div>
											</td>
											$PulsanteEscludiRipristinaTraccia
											<td><a id='ApriCestinoTraccia" . $Doppiatore['ID'] . "' data-idutente='" . $Doppiatore['ID'] . "' data-ripristinati='si' class='btn btn-default btn-xs fa fa-trash-o' title='" . s_CestinoVisualizza_title . "' onclick='ApriCestinoTraccia(event);'></a></td>"
										
										:   $PulsanteEscludiRipristinaTraccia
								) .	  "</tr>
									</table>
								</div>"
								. ($TantiDoppiatori? "<div class='btn btn-default' style='position: absolute; bottom: 0px; width: 100%; cursor: row-resize;' title=\"" . s_VariaAltezzaTraccia_title . "\" data-numerotraccia='$NumeroTraccia' onmousedown=\"AttivaVariazioneAltezzaTracciaConMouse(event);\"></div>" : "")
						.  "</div>";

						$strTracce .= "<div id='Traccia$NumeroTraccia' $ProprietaDivTraccia z-Index: " . ($DoppiatoriTotali - $NumeroTraccia) . "'></div>";

						$strArrayDatiDoppiatori .= "\"" . $Doppiatore['ID'] . "\": {nome: \"" . $Doppiatore['Nome'] . "\", numeroTraccia: $NumeroTraccia},";
						$NumeroTraccia++;
					}
					$strArrayDatiDoppiatori = "{" . substr($strArrayDatiDoppiatori, 0, -1) . "}";
				?>
			</div>

			<div id="ContenitoreRighello" style="position: relative; left: 10%; width: 90%;"><div id="Righello"><div id="MinutaggiRighello"></div><div id="ContenutoTracce" class="Tracce" style="width: 100%;"><div id="Cursore" style='z-Index: <?=($DoppiatoriTotali + 2)?>;'></div><div id="CursoreAnteprima" style='z-Index: <?=($DoppiatoriTotali + 1)?>;'></div><?=$strTracce?></div></div></div>
		</div>
    </div>

	<!-- Elementi che stanno sopra rispetto alle tracce (anche nell'asse Z) -->
	<div id="Monitors" class='text-center' <?=($ModalitaStreaming? "style='height: 100%;'" : "")?>>
		<table id="TabellaMonitors">
			<tr>
				<td id="ContenitorePannelloSx" style="position: relative; vertical-align: bottom; padding: 20px; width: 20%; z-index: 1;">
					<!-- <video id="gum" autoplay muted style="display: none;"></video> -->
					
					<?php
						$divMessaggiAJAX = "<div id='Messaggio' style='text-align: center;'></div><div id='BarraProgressoCaricamento' class='progress progress-striped active' style='opacity: 0; pointer-events: none;'><div id='ProgressoCaricamento' class='progress-bar progress-bar-primary' style='pointer-events: none;'></div></div>";
						
						$strScrittaSotto = ""; $NotificaMessaggi = "<div id='NumMessaggiDaLeggere' style='position: relative; top: -13px; left: -15px; border-radius: 10px; background-color: red; height: 25px; padding: 0px 5px; color: white; display: none;'></div>";
						if ($Provino) {
							/*** Provino ***/
							$Indirizzo = ($CreatoreDelProgetto? "GestioneProvino.php" : "FaiProvino.php");
							if ($SessioneOspite) {
								echo "<div class='alert alert-success text-center'><b>" . s_ProvinoDi . strtoupper($DatiProvinante['Nome']) . "</b><br>
											<span style='color: grey;'>del " . Date("d/m/Y", $DatiProvinante['DataProvino']) . s_alle . Date("H:i", $DatiProvinante['DataProvino']) . "</span>
										</div>";
							}
							$strScrittaSotto = "<a style='float: left;' href='$Indirizzo?N=$N' id='pulEsci' class='btn btn-info' target='_self'>&lt; " . s_Esci . "</a>";
							if ($CreatoreDelProgetto || !$SessioneOspite) {
								$Interlocutore = ($CreatoreDelProgetto? $DatiProvinante['ID'] : $DatiProgetto['ID_CreatoreProgetto']);
								$strScrittaSotto .= "<a class='btn btn-primary' data-link='ChatRoom.php?S=$N&A=$Interlocutore' data-larghezza='800' data-altezza='600' data-nomefinestra='ChatRoom' onclick='ApriFinestra(event);'><span class='fa fa-comments-o'></span> " . ($CreatoreDelProgetto? s_CommentaIlProvino : s_ChatConCreatoreProgetto) . "</a>$NotificaMessaggi
														<script>
															function NotificaMessaggi() {AJAX('NumeroMessaggiNonLettiChat.php', 'ID_Interlocutore=$Interlocutore&StanzaChat=$N', function (Dati) {VisualizzaMessaggiDaLeggere(Dati, 'NumMessaggiDaLeggere');}, '', '', true);}
															setInterval(NotificaMessaggi, 8000);
														</script>";
							}
						} else {
							/*** Doppiaggio ***/
							$strPulsanteChat = "";
							if (!$ModalitaStreaming) {
								if ($DatiProgetto['Stato']) {$strScrittaSotto .= "<div id='InfoProgetto' class='alert alert-success text-center'><b>" . s_ProgettoMarcatoCompletato . "</b></div>";}
								$Indirizzo = ($CreatoreDelProgetto? "GestioneProgetto.php?N=$N" : "Dashboard.php");
								if ($CreatoreDelProgetto || !$SessioneOspite) {
									$Interlocutore = ($SonoDoppiatoreCandidatoRuoliDaAssegnare? $DatiProgetto['ID_CreatoreProgetto'] : "0");
									$strPulsanteChat = "<div id='pulChatRoom'><p class='btn btn-primary' data-link='ChatRoom.php?S=$N&A=$Interlocutore' data-larghezza='800' data-altezza='600' data-nomefinestra='ChatRoom' onclick='ApriFinestra(event);'>" . ($SonoCreatoreDelProgettoEUnicoDoppiatore? "<span class='fa fa-file-text'></span> " . s_NotePersonali : "<span class='fa fa-comments-o'></span> " . ($SonoDoppiatoreCandidatoRuoliDaAssegnare? s_ChatConCreatoreProgetto . " <b>" . LimitaCaratteri($NomeCreatoreProgetto, 20) . "</b>" : s_ChatDiGruppo)) . "</p>$NotificaMessaggi</div>
									<script>
										function NotificaMessaggi() {AJAX('NumeroMessaggiNonLettiChat.php', 'ID_Interlocutore=$Interlocutore&StanzaChat=$N', function (Dati) {VisualizzaMessaggiDaLeggere(Dati, 'NumMessaggiDaLeggere');}, '', '', true);}
										setInterval(NotificaMessaggi, 30000);
									</script>";
								}
							}

							$strScrittaSotto .= "<a href='$Indirizzo' id='pulEsci' class='btn btn-info' style='margin: 10px; float: left; " . ($ModalitaStreaming? "display: none;" : "") . "' target='_self'>&lt; " . ($SessioneOspite? s_Esci : s_TerminaDoppiaggioEdEsci) . "</a>$strPulsanteChat";
						}
					?>
					<?=(!$ModalitaStreaming? "<div style='position: fixed; top: 0px; left: 0px; width: 30%; padding: 20px; z-Index: 1000; pointer-events: none;'>$divMessaggiAJAX</div>" : "")?>
					<div style='position: relative;'>
						<?php 
							echo $strScrittaSotto;
							
							if ((!$ModalitaStreaming) && ($CreatoreDelProgetto || !$SessioneOspite)) {
								/** Tools **/
							?>
								<br /><br />
								<fieldset><legend style='color: white; font-size: 16px;'><?=s_Strumenti?></legend>
									<a id="pul_tool0" class="btn btn-primary fa fa-hand-o-up" 	title='<?=s_tool0_title?>' onclick='CambiaTool(0);'> <?=s_tool0?></a>
									<a id="pul_tool1" class="btn btn-default fa fa-cut" 		title='<?=s_tool1_title?>' onclick='CambiaTool(1);'> <?=s_tool1?></a>
									<a id="pul_tool2" class="btn btn-default fa fa-volume-up" 	title="<?=s_tool2_title?>" style='position: relative;' onclick='CambiaTool(2);'><span style="position: absolute; left: 1px; top: 11px; height: 30px; border-top: 1px solid white; transform: rotate(30deg); width: 19px;"></span><span style="position: absolute; left: 1px; top: 10px; height: 30px; border-top: 1px solid #274661; transform: rotate(30deg); width: 19px;"></span> <?=s_tool2?></a>
								</fieldset>
							<?php
							}
							?>
						<script>
							function VisualizzaMessaggiDaLeggere(Dati, divID) {
								const NumMessaggiDaLeggere = document.getElementById(divID);
								NumMessaggiDaLeggere.innerText = Dati.NumMessaggiNonLetti; NumMessaggiDaLeggere.style.display = ((Dati.NumMessaggiNonLetti > 0) ? "inline" : "none");
							}
						</script>
					</div>
				</td>
				<td id="ContenitoreVideoGuida" style='<?=($ModalitaStreaming? "width: 100%; position: fixed; left: 0px; top: 0px;" : "position: relative; width: 60%;")?>'></td>
				<td id="ContenitorePannelloDx" style="text-align: right; vertical-align: bottom; padding-bottom: 10px; position: relative; width: 20%;">
					<?php $CondizioneQualitaMedia = (($Provino) || ($SessioneOspite && $CreatoreDelProgetto)); ?>
					<div style="position: absolute; top: 70px; float: right; right: 0px;<?=((($SessioneOspite && !$CreatoreDelProgetto) || $ModalitaStreaming) ? " display: none;" : "")?>">
						<div id="SelezioneMicrofono"><div class='text-left' style="vertical-align: middle; color: white;"><?=s_Microfono?>:</div><div><select id="SorgenteAudio" disabled></select></div></div>
						<div id="meters"><div id="instant" style='line-height: 0px;'><meter high="0.25" max="1" value="0"></meter><div class="label"></div><div class="value"></div></div><!-- <div id="slow"><div class="label"></div><meter high="0.25" max="1" value="0"></meter><div class="value"></div></div><div id="clip"><div class="label"></div><meter max="1" value="0"></meter><div class="value"></div></div>--></div>
						<div id="SelezioneQualitaRegistrazione"><div class="ContenitoreSpiegazioniFunzioni"><select name="selectQualitaRegistrazione" id="selectQualitaRegistrazione" title='<?=s_QualitaRegistrazione_title?>' onchange='AttivaIngressi();'><option value="1" <?=($CondizioneQualitaMedia? "" : "selected")?>><?=s_QualitaAlta?></option><option value="0" <?=($CondizioneQualitaMedia? "selected" : "")?>><?=s_QualitaMedia?></option></select><div class="SpiegazioniFunzioni text-left transizione-morbida-si" style="left: -300px; line-height: 15pt; z-index: 1000;"><small><?=s_QualitaRegistrazione_Spiegazioni?></small></div></div></div>
						<div id="SelezioneWebcam"><div><select id="SorgenteVideo" disabled style="display: none;"><option value="">Disattivata</option></select></div></div>
					</div>
					<div id="MessaggiUlteriori" style="color: grey;"></div>
					<?php
					if (!$ModalitaStreaming) {require("PulsanteSchermoIntero.php"); echo "<span id='ContenitorePulApriCopioneInFinestra' style='position: relative;'>"; require("AggiungiLinkCopione.php"); echo "</span>";} // Lo span serve sia come contenitore per il box suggerimenti, sia per essere escluso dalla ricerca dei pulsanti da rimpicciolire (v. AdattaDimensionePulsanti())
					?>
					<?php
					if ($Provino) {
						/*** Provino ***/
						if (!$SessioneOspite) {
							if ($DatiProvinante['ProvinoPubblicato']) {
								echo "<span style='color: green; font-weight: bold; font-decoration: italic;'>" . s_ProvinoPubblicato . "</span>";
							} else {
								echo "<span><a href='PubblicaProvino.php?N=$N&P=$P' class='btn btn-success' target='_self'>" . s_MandaIlProvino . " ></a></span>"; // Lo span serve per essere escluso dalla ricerca dei pulsanti da rimpicciolire (v. AdattaDimensionePulsanti())
							}
						}
						if ($DatiProgetto['Stato']) {echo "<div class='alert alert-warning text-center'><b style='font-size: 14px;'>" . s_ProvinoChiuso_esteso . "</b></div>";}
					} else {
						/*** Doppiaggio ***/
						if (!$ModalitaStreaming) {
							if ($DatiProgetto['CI'] != "") {echo "<p class='btn btn-default' style='margin: 5px;' id='pulSwitchColonnaInternazionale' title=\"" . s_ColonnaInternazionale_title . "\"><label class=\"btn switch\" style='margin-bottom: 0px;'><span id='pulSwitchCI_Interruttore' class=\"slider round\"></span></label>&nbsp;&nbsp;<span id='pulSwitchCI_testo'>" . s_ColonnaInternazionale . "</span></p>";}
							echo "<p id='pulAnteprimaInFinestra' class='btn btn-success' data-link='Doppiaggio.php?N=$N&P=0&Streaming=1' data-larghezza='1024' data-altezza='576' data-nomefinestra='AnteprimaDoppiaggio' onclick='ApriFinestra(event);'><span class='fa fa-play'></span> <span>" . s_Anteprima . "</span></p>";
						}
					}
					?>
				</td>
			</tr>
		</table>
		<div id="imgAttesa"></div>
	</div>

	<?php
	if ($ModalitaStreaming) {
		echo "<div style='position: fixed; left: 10px; bottom: 30px; width: 30%; z-Index: 10000000000000000000000;'>$divMessaggiAJAX</div>";
		require("CaricaTitoliVersioneStreaming.php");
	}
	?>
			
	<?php $NonVisualizzareInModalitaStreaming = ($ModalitaStreaming? "none" : "table-cell"); define('DaInputATesto', "readonly=readonly style='pointer-events: none; color: white; background: transparent; border: 0px; text-shadow: 2px 2px 2px black;");
		  $SoloSePuoiRegistrare = (($ModalitaStreaming || $SessioneOspite) ? "none" : "table-cell"); ?>
	<div id="ComandiPlayer" class='text-center <?=($ModalitaStreaming? "ComandiStreaming' style='z-index: 100000000000000000;" : "ComandiEditor")?>'>
			<table id="TabellaVideoGuida" style="margin: 0px auto;">
				<tr>
					<td style='display: <?=$SoloSePuoiRegistrare?>;' rowspan='2'><div class="btn btn-primary btn-xs" style="position: relative;"><div style="position: absolute; top: 6px; left: -45px; padding: 5px; margin: 0px; transform: rotate(-90deg); background-color: #e21b1b; border-radius: 10%; font-size: 9px; font-weight: bold;"><?=s_OpzioniDoppiaggio?></div><div id='divFunzioniPreRegistrazione'><div class="ContenitoreSpiegazioniFunzioni transizione-morbida-si"><select id='opzFunzionalitaPreRegistrazione' style="color: black;"><option value='countdown'>Countdown</option><option value='preroll'>Pre-roll</option></select><input id="inputCountdownRegistrazione" class="SelettoreMinutaggioMinuti" type="number" min="0" step="1" value="3" max="30" /> <?=s_secondi?><div style="text-align: left;" class="SpiegazioniFunzioni transizione-morbida-si"><?=s_SpiegazioniOpzioniPreRegistrazione?></div></div></div><label style="color: white; font-weight: normal; margin: 0px;"><input type="checkbox" id='checkAscoltaClipDuranteRegistrazione' style="transform: scale(0.8); padding: 0px;" /> <span class="btn" style="position: relative; top: -5px; margin: 0px; padding: 0px; font-size: 10px; line-height: 0px;"><?=s_AscoltaClipMentreRegistri?></span></label></div></td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;' rowspan='2'><button id="AnnullaRegistrazione" class="PulsanteGrafico" title="<?=s_AnnullaRegistrazione_title?>" disabled><img id="imgAnnullaRegistrazione" class="imgComandoPlayer" src="images/x-rossa.png"></button></td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;' rowspan='2'><button id="StopRegistrazione" class="PulsanteGrafico" title="<?=s_TerminaRegistrazione_title?>" disabled><div><img id="imgStopRegistrazione" class="imgComandoPlayer" src="images/red-stop-button-spigoloso.png"></div></button></td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;' rowspan=2><button id="Registra" title="<?=s_Registra?>" class="PulsanteGrafico" disabled><span id="TestoPulRegistra" style="display: none;"></span><img id="imgRegistra" class="imgComandoPlayer" src="images/rec-rosso-microfono.png"></button></td>
					<td rowspan=2><button id="Play" class="PulsanteGrafico"><img id="imgPlay" class="imgComandoPlayer" src="images/play-blue.png"></button></td>
					<td id='lblVolumeVideoGuida' style='display: <?=$NonVisualizzareInModalitaStreaming?>;'><?=s_VolumeFilmato?></td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;'><?=s_Minuti?></td><td style='display: <?=$NonVisualizzareInModalitaStreaming?>;'></td><td style='display: <?=$NonVisualizzareInModalitaStreaming?>;' ><?=s_Secondi?></td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;'>Zoom:</td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;'></td>
				</tr>
				<tr>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;'><input type="range" id="VolumeVideoGuida" min="0" max="1" step="0.01" value="1" style="width: 100px;" onchange="CambiaVolumeVideoGuida();" /></td>
					<td <?=($ModalitaStreaming? "style='text-align: right; width: 30%;'" : "")?>><input id="MinutaggioMinuti" class="SelettoreMinutaggioMinuti" <?=($ModalitaStreaming? DaInputATesto . " text-align: right;'" : "type=\"number\" min=\"0\" step=\"1\" onchange=\"MinutaggioCambiato();\"")?> value="0" /></td><td>:</td><td style='text-align: left;'><input id="MinutaggioSecondi" class="SelettoreMinutaggioSecondi" <?=($ModalitaStreaming? DaInputATesto . "'" : "type=\"number\" min=\"0\" step=\"0.1\" onchange=\"MinutaggioCambiato();\"")?> value="0" /></td>
					<td style='padding-left: 10px; display: <?=$NonVisualizzareInModalitaStreaming?>;'><input type="range" id="Zoom" min="100" max="2000" value="100" style="width: 150px;" /></td>
					<td style='display: <?=$NonVisualizzareInModalitaStreaming?>;'>&nbsp;<a id="pulVariaAltezzaTracce" class="btn btn-default fa fa-sort-amount-asc" title="<?=s_AbbassaTracce_title?>" onclick='CliccatoVariazioneAltezzaTracce();'></a></td>
				<?php
					if ($ModalitaStreaming) {echo "<td>"; require("PulsanteSchermoIntero.php"); echo "</td>";}
				?>
				</tr>
				<tr>
					<td style='display: <?=($ModalitaStreaming? "table-cell" : "none")?>; padding-top: 20px; width: 15%;' colspan="5"><input type='range' id='slideMinutaggioAttuale' value="0" min="0" onchange="slide_SpostatiAlMinutaggioSelezionato();" style='width: 100%; cursor: pointer;' /></td>
				</tr>
			</table>
	</div>

	<div id='ContenitorePulMessaggioVocale' class='alert alert-info text-center' style='display: none; position: fixed; right: 10px; bottom: 10px; z-index: 10000000000000000000000;'>
		<div id='didascaliaMessaggioVocale'></div>
		<p id='pulMessaggioVocale' class='btn btn-default' title='<?=s_pulMessaggioVocaleIstantaneo_title?>' onmousedown='RegistraMessaggioVocale_slow();' ontouchstart='RegistraMessaggioVocale_slow();' onmouseup='MandaMessaggioVocale();' ontouchend='MandaMessaggioVocale();'><span class='fa fa-microphone'></span> <span><?=s_pulMessaggioVocaleIstantaneo?></span></p>
		<select id="selUtenteMessaggioVocale"></select>
	</div>

	<div id="Vetro"></div>

	<div id="divCaricamento" class='text-center' style='position: fixed; width: 100%; background-image: linear-gradient(-45deg, transparent, lavender, transparent); opacity: 0.9; z-index: 100000000000000000000000;'><?=AnteprimaVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo'], 150)?>&nbsp;<span id="MsgCaricamentoIniziale"><?=s_CaricamentoInCorso?></span>&nbsp;<span id='imgAttesaIniziale' class="fa fa-spinner fa-spin fa-2x"></span>
		<p id="Info"><span id="TuaVersione"></span></p>
		<script src='https://cdn.jsdelivr.net/npm/bowser@latest/es5.js'></script><script src="ControllaBrowser3.7.js"></script>
		<script>
			const TestoVersioneBrowser = document.getElementById('TuaVersione'); 
			VerificaVersioneBrowser([{Browser: 'Firefox', VersioneMinima: <?=($SessioneOspite? 29 : 79)?>}, {Browser: 'Chrome', VersioneMinima: <?=($SessioneOspite? 47 : 66)?>}]);
		</script>
		<p id="MessaggiIniziali" class='alert alert-info'></p>
	</div>
	
	<?php define('versione', "5.9.4.7"); ?>
	<script>
		const N = "<?=$N?>", P = "<?=$P?>", TipoProgetto = "<?=$DatiProgetto['Tipo']?>";
		const NomeProgetto = "<?=Sistema($DatiProgetto['NomeProgetto'], true)?>", NomeDoppiaggio = "<?=Sistema($Provino? "Provino per " . $DatiProgetto['RuoloProvino'] : $DatiProgetto['NomeDoppiaggio'], true)?>";
		const ID_Utente = "<?=$_SESSION['ID']?>", NomeCreatoreProgetto = "<?=$NomeCreatoreProgetto?>", ID_CreatoreProgetto = "<?=$DatiProgetto['ID_CreatoreProgetto']?>", SonoCreatoreProgetto = <?=($CreatoreDelProgetto? "true" : "false")?>;
		const DatiDoppiatori = <?=$strArrayDatiDoppiatori?>;
		const RuoliDaAssegnare_NumeroTraccia = <?=$NumeroTracciaRuoliDaAssegnare?>;
		const ModalitaUltraLightAttiva = <?=(($_GET['ModalitaUltraLight'] == 1) ? "true" : "false")?>, ModalitaLightAttiva = ModalitaUltraLightAttiva || <?=(($_GET['ModalitaLight'] == 1) ? "true" : "false")?>;
		const dimensioneBuffer = ((SistemaOperativoAttuale == "Android") ? 16384 : 4096);
		const SuddivisioneTracce = <?=$SuddivisioneTracce?>, UnitaDiMisura = "<?=$UnitaDiMisura?>", pxPosizioneNomiTracce = <?=$pxPosizioneNomiTracce?>, NumeroTotaleTracce = <?=$DoppiatoriTotali?>, DecimaliSecondiMinutaggio = <?=($ModalitaStreaming? 0 : 3)?>;
		const Visitatore = <?=($Visitatore? "true" : "false")?>, SessioneOspite = <?=($SessioneOspite? "true" : "false")?>, ProgettoCompletato = <?=($DatiProgetto['Stato']? "true" : "false")?>, ModalitaStreaming = <?=($ModalitaStreaming? "true" : "false")?>, VersioneJS = "<?=versione?>";
		const PercorsoVideoGuida = "<?=$DatiProgetto['PercorsoVideo']?>", LinkColonnaInternazionale = "<?=$DatiProgetto['CI']?>", percorsoAudioWorklet = "AudioWorkletProcessor3.9.6.js";
		const VisualizzaSuggerimenti = <?=(($_SESSION["VisualizzaSuggerimenti"] && !$SessioneOspite) ? "true, SuggerimentiIniziali = [" . ($DatiProgetto['LinkCopione'] ? "{testo: '" . s_sugg_iniziali_Copione . "', stile: 'default', simboloSx: 'fa fa-file-text-o', simboloDx: 'fa fa-arrow-right', VicinoA: document.getElementById('ContenitorePulApriCopioneInFinestra'), scostamentoX: '-' + ((+document.getElementById('ContenitorePulApriCopioneInFinestra').offsetWidth) + 550) + 'px', scostamentoY: '-20px'}," : "") . 
																																	  "{testo: '" . s_sugg_iniziali_Timeline      . "', stile: 'info', simboloSx: '', simboloDx: 'fa fa-arrow-up', coordinate: {left: '10%', top: '60%'}},
																																	   {testo: '" . s_sugg_iniziali_AbbassaTracce . "', stile: 'default', simboloSx: 'fa fa-arrow-up', simboloDx: '', VicinoA: document.getElementById('pulVariaAltezzaTracce').parentNode, scostamentoX: '-100px', scostamentoY: '30px'},
																																	   {testo: '" . s_sugg_iniziali_Registrazione . "', stile: 'danger', simboloSx: 'fa fa-arrow-up', simboloDx: '', VicinoA: document.getElementById('Registra').parentNode, scostamentoX: '-50px', scostamentoY: '60px'}]" : "false")?>;
		const VisualizzaSuggerimentiRuoliDaAssegnare = <?=(($_SESSION['VisualizzaSuggerimentiRuoliDaAssegnare'] && $SonoDoppiatoreCandidatoRuoliDaAssegnare) ? "true, SuggerimentiRuoliDaAssegnare = [{testo: '" . s_sugg_ruolidaassegnare_Personaggi  . "', stile: 'success', simboloSx: 'fa fa-arrow-left', simboloDx: '', VicinoA: document.getElementById('ContenitoreRighello'), scostamentoX: '0px', scostamentoY: '80px'},
																																																	  {testo: '" . s_sugg_ruolidaassegnare_Direttore   . "', stile: 'default', simboloSx: 'fa fa-info-circle', simboloDx: '', coordinate: {left: '10%', top: '60%'}},
																																																	  {testo: '" . s_sugg_ruolidaassegnare_Chattare    . "', stile: 'info', simboloSx: 'fa fa-arrow-left', simboloDx: '', VicinoA: document.getElementById('pulChatRoom'), scostamentoX: '0px', scostamentoY: '0px'},
																																																	  {testo: '" . s_sugg_ruolidaassegnare_FrasiFinali . "', stile: 'success', simboloSx: '', simboloDx: '', coordinate: {left: '40%', top: '10%'}}]" : "false")?>;
		var VisualizzaSuggerimentiFinestraOpzioni = <?=($_SESSION['VisualizzaSuggerimentiFinestraOpzioni'] ? "true" : "false")?>, VisualizzaSuggerimentiCestinaClip = <?=($_SESSION['VisualizzaSuggerimentiCestinaClip'] ? "true" : "false")?>;
	</script>
	<?php
	require("ElementiComuni.php");

	if (!$ModalitaStreaming) {
	?>
		<script defer type='text/javascript' src="ffmpeg-terminal4.0.0.2_stringheITA.js"></script><script defer type='text/javascript' src="ffmpeg-terminal-doppiaggio4.2.1.5.js"></script>
	<?php
	}
	?>
	<script defer src="FunzioniComuniRiproduzione1.6.js"></script>
	<script defer src="Registrazione5.9.0.5_stringhe.js"></script><script defer src="Registrazione<?=versione?>.js"></script>
	<script defer src="SelezioneDispositivo4.0.js"></script><script defer src="StartAudioContext1.0.js"></script>
	<?php
	require("fLibrerieGestioneVideoGuida.php"); LibrerieGestioneVideoGuida($DatiProgetto);
	/* (($_SESSION['FB'] == 1) ? "<script defer src='FBVerificaAccount.js'></script>" : "") */
	?>

	<a href='https://<?=$_SERVER['SERVER_NAME']?>' style="position: fixed; top: 0px; right: 0px; z-Index: 10000000000000; <?=($ModalitaStreaming? "opacity: 0.5;" : "")?>"><img src="assets/img/logomicrofono300_WEDUB_2.png" width="<?=($ModalitaStreaming? "120" : "150")?>" /></a>
	<div id="Versione"><?=versione?></div>
</body>
</html>
