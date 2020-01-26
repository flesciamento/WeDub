<?php require("p1.php"); ?>
                <h3 class="header-line">PANORAMICA</h3>
                
                            </div>

        </div>
             <div class="row">
				<div class="row pad-botm">
					<div class="col-md-12"><h4 class="header-line">I progetti degli utenti</h4></div>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-6">
					<a href="ListaDoppiaggi.php" class="alert-success">
						<div class="alert alert-success text-center EvidenziaAlPassaggio" style="opacity: 0.9;">
							<span class="fa fa-film fa-5x"></span>
							<h3>Doppiaggi</h3>
							Partecipa ai progetti di doppiaggio cui fai parte!
						
						</div>
					</a>
				</div>
				<div class="col-md-3 col-sm-3 col-xs-6">
					<a href="ListaProvini.php" class="alert-danger">
						<div class="alert alert-danger text-center EvidenziaAlPassaggio" style="opacity: 0.9;">
							<span class="fa fa-microphone fa-5x"></span>
							<h3>Provini</h3>
							Partecipa ai provini creati dagli utenti per entrare a far parte del cast dei personaggi!
						</div>
					</a>
				</div>
			</div>
			<?php require("Notifiche.php"); ?>
             
             <div class="row">
				<div class="row pad-botm">
					<div class="col-md-12"><h4 class="header-line">I miei progetti</h4></div>
				</div>
				<div class="col-md-6 col-sm-6 col-xs-12">
					<div class="panel panel-warning">
	                    <div class="panel-heading">
	                        <b>Nuovi progetti</b>
						</div>
						<div class="panel-body">
							<div class="col-sm-6 col-xs-12">
								<div class="alert alert-warning back-widget-set text-center">
									<a href="NuovoDoppiaggio.php" class="alert-warning"><span class="fa fa-file-movie-o fa-5x"></span>
										<h3>Nuovo video da doppiare</h3>
										Linka il video da doppiare e seleziona i doppiatori designati ai vari ruoli.
									</a>
								</div>
							</div>
							<div class="col-sm-6 col-xs-12">
								<div class="alert alert-warning back-widget-set text-center">
									<a href="NuovoProvino.php" class="alert-warning"><span class="fa fa-file-powerpoint-o fa-5x"></span>
										<h3>Nuovo provino</h3>
										Crea un nuovo provino linkando lo spezzone video a tua scelta nel quale chi vorrà potrà cimentarsi per il casting del personaggio.
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-sm-6 col-xs-12">
					<div class="panel panel-info">
	                    <div class="panel-heading">
	                        <b>Progetti gestiti</b>
						</div>
						<div class="panel-body">
							<div class="col-sm-6 col-xs-12">
								<div class="alert alert-info back-widget-set text-center">
									<a href="GestioneMieiProgetti.php" class="alert-info"><span class="fa fa-video-camera fa-5x"></span>
										<h3>Gestisci i progetti</h3>
										Visualizza l'andamento dei tuoi progetti in tempo reale, intervieni sulle tracce audio registrate e dirigi il doppiaggio.
									</a>
								</div>
							</div>
							<div class="col-sm-6 col-xs-12">
								<div class="alert alert-info back-widget-set text-center">
									<a href="GestioneMieiProvini.php" class="alert-info"><span class="fa fa-check-square-o fa-5x"></span>
										<h3>Valuta i provini</h3>
										Valuta i provini mandati dagli utenti per decidere il cast per il tuo progetto.
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

    
<?php require("p2.php"); ?>
