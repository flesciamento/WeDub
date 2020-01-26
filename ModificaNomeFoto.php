<?php Session_start();

if (!$_SESSION['ID']) {header("location: https://" . $_SERVER['SERVER_NAME'] . "/index.php"); exit;}	

 require("connessione.php");
 $FotoProfilo = RisultatoQuery("SELECT FotoProfilo FROM UtentiRegistrati WHERE ID = '" . $_SESSION['ID'] . "'");
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <![endif]-->
    <title>WE DUB - Nome e foto profilo</title>
    <!-- bootstrap1.0 CORE STYLE  -->
    <link href="assets/css/bootstrap1.1.css" rel="stylesheet" />
    <!-- FONT AWESOME STYLE  -->
    <link href="assets/css/font-awesome.css" rel="stylesheet" />
    <!-- CUSTOM STYLE  -->
    <link href="assets/css/style1.1.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/TemplateGenerale1.2.6.css">
    <!-- GOOGLE FONT 
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />-->
	<script src="FunzioniComuni5.4.3.js"></script><script src="FunzioniComuni5.1.0_stringheITA.js"></script>
	<?php require("CookiePolicy.php"); ?>
</head>
<body background="../assets/images/sfondomicrofono1920_WEDUB.jpg">
<div class="content-wrapper">
	<div class="container">
		<div class="row pad-botm">
			<div class="col-md-12">
				<h3 class="header-line" style="color: white;"><div id="Info" class="text-center" style="font-size: 16px; color: white; text-shadow: 3px 3px 3px black; background-color: rgba(80,106,185, 0.3);">Scegli il nome e la foto del tuo profilo</div></h3>
            </div>
        </div>
           
	    <div class="row">
			<div id="divLogin" class="col-md-12 col-sm-12 col-xs-12">
			    <div class="panel panel-primary">
					<div class="panel-heading text-center">
					   Nome e foto profilo
					</div>
					<div class="panel-body text-center">
						<form role="form" id="frmModificaNomeFoto" name="frmModificaNomeFoto" method="post" action="ElaboraModificaProfilo.php" onSubmit="return ValidazioneForm();">
							<br><b style="color: blue; font-size: 15px;">Scegli come vuoi comparire su WeDub:</b><br /><br />
							 
							<div id="divNome" class="form-group">
								<label class="control-label" style="color: blue;">Nome o Nickname</label>
								<input class="form-control" type="text" id="Nome" name="Nome" placeholder="Inserisci il nome o il nickname che vuoi utilizzare per WeDub" / value='<?=$_GET['Nome']?>'>
								<p id="pAiutoNome" class="help-block">&nbsp;</p>
							</div>
							<div id="divFoto" class="form-group">
								<label class="control-label" style="color: blue;">Foto profilo</label>
								<img id='imgFoto' name='imgFoto' class='FotoProfilo' src='<?=$FotoProfilo?>' />
								<br />
								Seleziona un'immagine dal tuo computer se vuoi modificare l'attuale foto profilo
								<input class="form-control" type="file" id="Foto" name="Foto" onchange='CaricaFotoProfilo();' />
								<input type='hidden' id='PercorsoFotoProfilo' name='PercorsoFotoProfilo' value='<?=$FotoProfilo?>' />
								<div id="Messaggio"></div><div id="BarraProgressoCaricamento" style="color: white; font-family: 'Comic Sans MS'; transition: 1s;"><div id="ProgressoCaricamento" style='background-color: blue; transition: 1s;'></div></div>
								<p id="pAiutoFoto" class="help-block">&nbsp;</p>
							</div>
							<div class="form-group">
								<div class="checkbox">
									<label id="lblOpzPresaVisione" class="form-group">
										<input id="opzPresaVisione" type="checkbox" name="opzPresaVisione" value="PresaVisione" <?=$_GET['PresaVisione'] ? "checked" : ""?> />Ho preso visione della <a href="//www.iubenda.com/privacy-policy/38344112" class="iubenda-white iubenda-embed" title="Privacy Policy">Privacy Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src = "//cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script> (informativa sulla Privacy) e accettato i <a data-link="../TerminiECondizioni.php" data-larghezza="800" data-altezza="650" onclick="ApriFinestra(event);" style="cursor: pointer;">Termini e le condizioni</a>.
										<p id="pAiutoOpzPresaVisione" class="help-block">&nbsp;</p>
									</label>
								</div>
							</div>
							
							<input type="hidden" id="Pag" name="Pag" value="<?=$_GET['Pag']?>">
							<div id="divPulsanteLogin" class="form-group text-center"> 
								<a id="pulModifica" class="btn btn-success btn-lg">SALVA</a>
								<p id="pAiutoModifica" name="pAiutoInvio" class="help-block"></p>
							</div>
						</form>
					</div>
	            </div>
	        </div>
	    </div>
    </div>
</div>
        
<script src="FunzioniComuniForm3.1.js"></script>
<script src="Mex1.0.js"></script>
<script>
	function CaricaFotoProfilo() {
		var F = new FormData(), file = document.getElementById('Foto').files[0];
		F.set("Foto", file, file.name);
		AJAX("CaricaFotoProfilo.php", F,
			 function (Dati) {
			 	document.getElementById('imgFoto').src = Dati.PercorsoFotoProfilo;
			 	document.getElementById('PercorsoFotoProfilo').value = Dati.PercorsoFotoProfilo;
			 	document.getElementById('Foto').value = "";
			 }
			, "Caricamento in corso...", "Foto Profilo caricata.", false, true
		);
	}

	function DisabilitaSchermata() {
		document.getElementById('pulModifica').abilita(false);
	}

	function RiabilitaSchermata() {
		document.getElementById('pulModifica').abilita(true);
	}

	function ValidazioneForm() {
		if (!ControllaNome() || !ControllaFlaggataPresaVisione()) {Mex('pAiutoModifica', "Alcuni campi non sono stati ancora compilati!", 'blue'); return false;}

		DisabilitaSchermata();
		return true;
	}
	
	function ControllaEInviaLogin() {
		if (ValidazioneForm()) {document.getElementById('frmModificaNomeFoto').submit();}
	}
	
	function ControllaNome() {
		if (ContieneCaratteriSpeciali(document.getElementById('Nome').value)) {MsgCampoRichiesto('Nome', "Il tuo nome o nickname può contenere solo numeri, lettere, spazi e il punto."); Mex('pAiutoModifica', "Controlla il campo Nome / Nickname.", 'blue'); return false;}
		
		return CampoCompilato('Nome');
	}
	
	function ControllaFlaggataPresaVisione() {
		return ControllaOpzPresaVisione('opzPresaVisione', 'pAiutoModifica');
	}

	document.getElementById('pulModifica').onclick = ControllaEInviaLogin;

	var Nome = document.getElementById('Nome'); Nome.onchange = ControllaNome; Nome.focus();
	
	<?php 
		switch($_GET['E']) {
			case "ErrCampi": echo "ValidazioneForm();"; break;
			case "ErrNomeEsistente": echo "MsgCampoRichiesto('Nome', \"Peccato! Il nome scelto è già utilizzato da un altro utente registrato. Scegline uno diverso.\", 'blue'); Mex('pAiutoModifica', \"Il nome scelto è già utilizzato da un altro utente. Prova a cambiarlo.\", 'blue')"; break;
		}
	?>
</script>
    
<?php require("p2.php"); ?>