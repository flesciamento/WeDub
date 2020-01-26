<?php Session_start();
	
	$PaginaRichiesta = $_GET['Pag'];
	
	$PaginaRedirezione = ($PaginaRichiesta ? $PaginaRichiesta : "Dashboard.php");

	$strInfo = $PaginaRichiesta? "Per potere proseguire alla pagina desiderata devi loggarti." : "Per utilizzare WE DUB è necessario iscriversi. L'iscrizione è completamente gratuita.";

	if ($_SESSION['ID']) {header("location: " . urlencode($PaginaRedirezione)); exit;}
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
    <title>WE DUB - Login</title>
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
			<h3 class="header-line" style="color: white;"><a href="https://<?=$_SERVER['SERVER_NAME']?>" style="float: left; position: relative; top: -50px;"><img src="assets/img/logomicrofono300_WEDUB_2.png" width="200" border="0" /></a> &nbsp;&nbsp;&nbsp;&nbsp;LOGIN</h3>
            <div id="Info" class="text-center" style="font-size: 16px; color: white; text-shadow: 3px 3px 3px black; background-color: rgba(80,106,185, 0.3);"><b><?=$strInfo?></b><br>Puoi anche entrare direttamente col tuo account Facebook cliccando sul pulsante "<b>Accedi con Facebook</b>".</div>
            </div>
            
        </div>
        
		
		
	<div class="row">
		<div id="divLogin" class="col-md-6 col-sm-6 col-xs-12">
		    <div class="panel panel-primary">
				<div class="panel-heading text-center">
				   LOGIN
				</div>
				<div class="panel-body">
					<center>
						<?php require("FBCaricamento.php"); ?>
						
						<form role="form" id="frmLogin" name="frmLogin" method="post" action="ControllaLogin.php" style="display: none;">
						<br><b style="color: blue;">Oppure inserisci le tue credenziali:</b>
					</center>
						 
						<div id="divLogEMail" class="form-group" style="display: none;">
							<label class="control-label" style="color: blue;">E-Mail o Nickname</label>
							<input class="form-control" type="text" id="LogEMail" name="EMail" placeholder="Inserisci il tuo indirizzo e-mail o il tuo nickname" />
							<p id="pAiutoLogEmail" class="help-block">&nbsp;</p>
						</div>
						<div id="divLogPassword" class="form-group" style="display: none;">
							<label class="control-label" style="color: blue;">Password</label>
							<input class="form-control" type="password" id="LogPassword" name="Password" placeholder="Inserisci la password" />
							<p id="pAiutoLogPassword" class="help-block">&nbsp;</p>
						</div>
						<input type="hidden" id="Pag" name="Pag" value="<?=$_GET['Pag']?>">
						<div id="divPulsanteLogin" class="form-group" style="display: none;"> 
							<center>
								<a id="pulLogin" class="btn btn-success btn-lg">LOGIN</a>
								<p id="pAiutoLogin" name="pAiutoInvio" class="help-block"></p>
							</center>
						</div>
					</form>
				</div>
            </div>
        </div>
        
		<div id="divRegistrazione" class="col-md-6 col-sm-6 col-xs-12" style="display: none;">
		    <div class="panel panel-danger">
				<div class="panel-heading text-center">
				   Non sei ancora registrato?
				</div>
				<div class="panel-body">
					<center><b>Se non vuoi entrare col tuo account Facebook:<br>REGISTRATI QUI:</b></center>
					<form role="form" id="frmRegistrati" name="frmRegistrati" method="post" action="Registrazione.php">
								
						<div id="divRegNome" class="form-group">
							<label class="control-label">Nome / Nickname</label>
							<input class="form-control" type="text" id="RegNome" name="Nome" placeholder="Inserisci il tuo nome o nickname" value="<?=str_replace("\"", "", $_GET['Nome'])?>"/>
							<p id="pAiutoRegNome" class="help-block">&nbsp;</p>
						</div>
						<div id="divRegEMail" class="form-group">
							<label class="control-label">E-Mail<br><span style="font-size: 12px;">(Serve per aggiornarti sulle novità e sui tuoi progetti, è tuo vantaggio inserire un indirizzo e-mail valido)</span></label>
							<input class="form-control" type="text" id="RegEMail" name="EMail" placeholder="Inserisci il tuo indirizzo e-mail" value="<?=str_replace("\"", "", $_GET['EMail'])?>"/>
							<p id="pAiutoRegEMail" class="help-block">&nbsp;</p>
						</div>
						<div id="divRegPassword" class="form-group">
							<label class="control-label">Password</label>
							<input class="form-control" type="password" id="RegPassword" name="Password" placeholder="Inserisci la password" />
							<p id="pAiutoRegPassword" class="help-block">&nbsp;</p>
						</div>
						<div id="divRegPasswordRipetuta" class="form-group">
							<label class="control-label">Ripeti Password</label>
							<input class="form-control"  type="password" id="RegPasswordRipetuta" name="PasswordRipetuta" placeholder="Ridigita la stessa password per sicurezza" />
							<p id="pAiutoRegPasswordRipetuta" class="help-block">&nbsp;</p>
						</div>
						<div class="form-group">
							<div class="checkbox">
								<label id="lblRegOpzPresaVisione" class="form-group">
									<input id="opzPresaVisione" type="checkbox" name="opzPresaVisione" value="PresaVisione" <?=$_GET['PresaVisione'] ? "checked" : ""?> />Ho preso visione della <a href="//www.iubenda.com/privacy-policy/38344112" class="iubenda-white iubenda-embed" title="Privacy Policy">Privacy Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src = "//cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script> (informativa sulla Privacy) e accettato i <a data-link="../TerminiECondizioni.php" data-larghezza="800" data-altezza="650" onclick="ApriFinestra(event);" style="cursor: pointer;">Termini e le condizioni</a>.
									<p id="pAiutoRegOpzPresaVisione" class="help-block">&nbsp;</p>
								</label>
							</div>
						</div>
						<div id="divPulsanteRegistrati" class="form-group text-center">
							<a id="pulRegistrati" class="btn btn-danger btn-lg">Registrati</a>
							<p id="pAiutoRegistrati" name="pAiutoInvio" class="help-block"></p>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

<script src="FunzioniComuniForm3.1.js"></script>
<script src="Mex1.0.js"></script>
<script src="FBLogin2.1.4.js"></script>
<script class="_iub_cs_activate" type="text/plain" suppressedsrc="FBLibrerie.js"></script>
<script>
	function ControllaEInviaLogin() {
		if (!CampoCompilato('LogEMail') || !CampoCompilato('LogPassword')) {Mex('pAiutoLogin', "Alcuni campi non sono stati ancora compilati!", 'blue'); return;}
		
		DisabilitaPulsanti();
		document.getElementById('frmLogin').submit();
	}
	
	function ControllaEInviaRegistrazione() {
		if (!CampoCompilato('RegNome') || !CampoCompilato('RegEMail') || !CampoCompilato('RegPassword') || !CampoCompilato('RegPasswordRipetuta')) {Mex('pAiutoRegistrati', "Per registrarti devi compilare tutti i campi!<br>Ricordati che se vuoi puoi saltare questo passaggio entrando direttamente col tuo account Facebook (premendo il pulsante sotto Login)!", "blue"); return;}
		
		if (!ControllaNome() || !Controlla2Pwd() || !ControllaPwd() || !ControllaCorrettezzaEMail() || !ControllaFlaggataPresaVisione()) {return;}
		
		
		DisabilitaPulsanti();
		document.getElementById('frmRegistrati').submit();
	}
	
	function ControllaNome() {
		if (ContieneCaratteriSpeciali(document.getElementById('RegNome').value)) {MsgCampoRichiesto('RegNome', "Il tuo nome o nickname può contenere solo numeri, lettere, spazi e il punto.", 'red'); Mex('pAiutoRegistrati', "Controlla il campo Nome / Nickname.", 'blue'); return false;}
		
		return CampoCompilato('RegNome');
	}
	
	function ControllaPwd() {
		if (document.getElementById('RegPassword').value.indexOf(" ") > -1) {MsgCampoRichiesto('RegPassword', "La password non può contenere spazi.", 'red'); Mex('pAiutoRegistrati', "Errore nel campo Password", 'blue'); return false;}
		
		return CampoCompilato('RegPassword');
	}
	
	function Controlla2Pwd() {
		if (document.getElementById('RegPassword').value != document.getElementById('RegPasswordRipetuta').value) {MsgCampoRichiesto('RegPasswordRipetuta', "Le password inserite non coincidono!", 'red'); Mex('pAiutoRegistrati', "Ridigita le password facendo attenzione a maiuscole e minuscole!"); return false;}
		
		return CampoCompilato('RegPasswordRipetuta');
	}
	
	function ControllaCorrettezzaEMail() {
		return ControllaEMail('RegEMail', 'pAiutoRegistrati');
	}
	
	function ControllaFlaggataPresaVisione() {
		return ControllaOpzPresaVisione('opzPresaVisione', 'pAiutoRegistrati');
	}
	
	function DisabilitaPulsanti() {
		document.getElementById('pulLogin').disabled = true;
		document.getElementById('pulRegistrati').disabled = true;
		document.getElementById('pulLogin').style.opacity = 0.5;
		document.getElementById('pulRegistrati').style.opacity = 0.5;
	}
	
	
	document.getElementById('LogEMail').addEventListener('change', Evidenzia);
	document.getElementById('LogPassword').addEventListener('change', Evidenzia);
	
	document.getElementById('RegNome').addEventListener('change', ControllaNome);
	document.getElementById('RegEMail').addEventListener('change', ControllaCorrettezzaEMail);
	document.getElementById('RegPassword').addEventListener('change', ControllaPwd); document.getElementById('RegPassword').addEventListener('click', SelezionaTutto);
	document.getElementById('RegPasswordRipetuta').addEventListener('change', Controlla2Pwd); document.getElementById('RegPasswordRipetuta').addEventListener('click', SelezionaTutto);
	
	
	document.getElementById('pulLogin').onclick = ControllaEInviaLogin;
	document.getElementById('pulRegistrati').onclick = ControllaEInviaRegistrazione;
	
	
	
	function AzioneDopoLoginFB(DatiPrincipali) {
		document.getElementById('frmDatiPrincipali').submit();
	}
	
	function AzioneInCasoNonLoggatoFB() {
		document.getElementById('divRegistrazione').style.display = "inline";
		
		document.getElementById('frmLogin').style.display = "inline";
		var CampiLogin = document.querySelectorAll('#divLogin .form-group');
		for(var I = 0; I < CampiLogin.length; I++) {
			CampiLogin[I].style.display = "inline";
		}
	}
	
	<?php 
		switch($_GET['E']) {
			case "ErrCampi": echo "ControllaEInviaRegistrazione();"; break;
			case "Err2Pwd": echo "Controlla2Pwd();"; break;
			case "ErrNomeEsistente": echo "MsgCampoRichiesto('RegNome', \"Peccato! Il nome scelto è già utilizzato da un altro utente registrato. Scegline uno diverso.\", 'blue'); Mex('pAiutoRegistrati', \"Il nome scelto è già utilizzato da un altro utente. Prova a cambiarlo.\", 'blue')"; break;
			case "ErrMailEsistente": echo "MsgCampoRichiesto('RegEMail', \"L'indirizzo e-mail scelto è già esistente! Se sei già iscritto usa il campo <b>Login</b>, oppure entra col tuo account Facebook.\", 'red'); Mex('pAiutoRegistrati', \"Risulti già iscritto, prova ad usare il campo Login oppure entrare col tuo account Facebook.\", 'red');"; break;
			
			case "lgnErr": echo "MsgCampoRichiesto('LogEMail', \"Credenziali non valide! Ritenta\", 'red');"; break;
		}
	
	?>
</script>
</div>
<?php require("p2.php"); ?>
