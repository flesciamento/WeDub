<?php 
	echo "<i>" . $_SESSION['Nome'] . "</i>&nbsp;&nbsp;";
	
	if ($_SESSION['FB']) {
		require("FBCaricamento.php"); echo "<script src='FBEsci4.1.js'></script><script src='FBLibrerie.js'></script>";
	}
	//echo "<a href=\"../index.php\" class=\"btn btn-info pull-right fa fa-gears\">Esci dall'App</a>";
?>
<div class="btn-group">
  <a data-toggle="dropdown" class="btn btn-primary dropdown-toggle fa fa-gears"> <span class="caret"></span></a>
  <ul class="dropdown-menu">
	<li><a href="Profilo.php?U=<?=$_SESSION['ID']?>">Profilo personale</a></li>
	<li><a href="Account.php">Opzioni account</a></li>
	<li class="divider"></li>
	<li><a href="../index.php">Esci dall'App</a></li>
  </ul>
</div>
<script src='Logout1.3.js'></script>
