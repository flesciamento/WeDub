<?php
require("p1.php");

$DatiUtente = mysqli_fetch_assoc(query("SELECT * FROM UtentiRegistrati WHERE ID = '" . $_SESSION['ID'] . "'"));
?>
			<center>
				<h4 class="header-line">IMPOSTAZIONI ACCOUNT DI</h4>
                <h3 class="header-line"><b><?=$_SESSION['Nome']?></b> <?=($FotoProfilo = $_SESSION['FotoProfilo']) ? "<img src='$FotoProfilo' width=60>" : ""?></h3>
            </center>
                            </div>

        </div>
        
		<div class="row">
             <?php 
             if (!$_SESSION['FB']) {
			 ?>
				 <div class="col-md-6 col-sm-6 col-xs-12">
					<div class="panel panel-info text-center">
						<div class="panel-heading">
							<b>Cambia password</b>
						</div>
						<div class="panel-body">
						</div>
					</div>
				</div>
			<?php
			}
			?>
			
			<div class="col-md-6 col-sm-6 col-xs-12">
				<div class="panel panel-info text-center">
					<div class="panel-heading">
						<b>Cancella account</b>
					</div>
					<div id="divCancellaAccount"class="panel-body">
						<a id="pulCancellaAccount" class="btn btn-danger" href="CancellaAccount.php">Cancella account</a>
					</div>
				</div>
			</div>
		
		</div>
			


<?php require("p2.php"); ?>
