<?php require("ControllaAccesso.php");
	
	function VoceMenu($Pagina, $NomePagina) {
		$VoceMenuAttuale = ($GLOBALS['PaginaAttuale'] == $Pagina);
		$Link = $VoceMenuAttuale? "#" : $Pagina;
		$EvidenziaMenu = $VoceMenuAttuale? " class=\"menu-top-active\"" : "";

		return "<a href=\"$Link\"$EvidenziaMenu>$NomePagina</a>";
	}

	function VoceMenuADiscesa($Pagina1, $Pagina2, $NomeMenu, $NomePagina1, $NomePagina2) {
		$Link1 = ($GLOBALS['PaginaAttuale'] == $Pagina1) ? "#" : $Pagina1; $Link2 = ($GLOBALS['PaginaAttuale'] == $Pagina2) ? "#" : $Pagina2;
		$EvidenziaMenu = (($GLOBALS['PaginaAttuale'] == $Pagina1) || ($GLOBALS['PaginaAttuale'] == $Pagina2)) ? " menu-top-active" : "";
		
		return "<a href='#' class='dropdown-toggle$EvidenziaMenu' data-toggle='dropdown'>$NomeMenu <i class='fa fa-angle-down'></i></a>
				<ul class='dropdown-menu' role='menu' aria-labelledby='ddlmenuItem'>
					<li role='presentation'><a role='menuitem' tabindex='-1' href='$Link1'>$NomePagina1</a></li>
					<li role='presentation'><a role='menuitem' tabindex='-1' href='$Link2'>$NomePagina2</a></li>
				</ul>";
	}

	require("connessione.php");
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
    <title>WE DUB</title>
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
</head>
<body background="../assets/images/sfondomicrofono1920_WEDUB.jpg" style="background-attachment: fixed; background-repeat: no-repeat;">
    <div class="navbar navbar-inverse set-radius-zero" >
        <div class="container">
            <div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="Dashboard.php">

                    <img src="assets/img/logomicrofono300_WEDUB_2.png" width="200" />
                </a>

            </div>

            <div class="right-div">
                <?php require("PulsanteLogout.php"); ?>
            </div>
        </div>
    </div>
    <!-- LOGO HEADER END-->
    <section class="menu-section">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="navbar-collapse collapse ">
                        <ul id="menu-top" class="nav navbar-nav navbar-right">
                            <li><?=VoceMenu("Dashboard.php", "PANORAMICA")?></li>
                            <li><?=VoceMenuADiscesa("NuovoDoppiaggio.php", "NuovoProvino.php", "CREA NUOVO", "DOPPIAGGIO", "PROVINO")?></li>
                            <li><?=VoceMenuADiscesa("GestioneMieiProgetti.php", "GestioneMieiProvini.php", "GESTISCI", "I MIEI PROGETTI DI DOPPIAGGIO", "I PROVINI DA VALUTARE")?></li>
                            
                            <li><?=VoceMenu("ListaDoppiaggi.php", "DOPPIAGGI")?></li>
                            <li><?=VoceMenu("ListaProvini.php", "PROVINI")?></li>

                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </section>
     <!-- MENU SECTION END-->
    <div class="content-wrapper">
         <div class="container">
        <div class="row pad-botm">
            <div class="col-md-12">
