<?php require("fSistema.php"); ?>
		<div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
				<div class="panel panel-primary">
					<div class="panel-heading text-center"><b>Video da doppiare</b></div>
					<div id="ContenitoreLinkVideo" class="form-group">
						<label>Linka il video da doppiare</label>
						<div class="input-group">
							  <input type="text" class="form-control" id="LinkVideo" placeholder="Copia e incolla il link di un video YouTube, Facebook o DailyMotion!"><span class="form-group input-group-btn"><a class="btn btn-default">Carica</a></span>
						</div>
						<p id="pAiutoLinkVideo" class="help-block"></p>
					</div>
					<div id="ContenitoreCaricaVideo" class="form-group" style="display: none;">
						<label>oppure carica un video</label>
						<div class="input-group">
							  <input type="file" class="form-control" id="CaricaVideo" placeholder="Carica un video non superiore a 20 Mb">
							  <p id="pAiutoCaricaVideo" class="help-block"></p>
						</div>
					</div>
					<div id="VisualizzaVideo" class="form-group" style="text-align: center;">
					<?php
						if ($DatiProgetto) {require("fPlayerVideo.php"); echo PlayerVideo($DatiProgetto['PiattaformaVideo'], $DatiProgetto['PercorsoVideo'], 480, 270);}
					?>
					</div>
				</div>
			</div>
			
            <div class="col-md-6 col-sm-6 col-xs-12">
               <div class="panel panel-info">
                    <div class="panel-heading text-center"><b>Dati del progetto di doppiaggio</b></div>
                    <div class="panel-body">
                        <form role="form" id="frmDoppiaggio" name="frmDoppiaggio" method="post" action="<?=$PaginaSalvataggio?>">
                            <div id="divNomeProgetto" class="form-group">
                                <label class="control-label">Nome del progetto</label>
                                <input class="form-control text-center" style="font-weight: bold;" type="text" id="NomeProgetto" name="NomeProgetto" placeholder="Inserisci il nome del progetto di doppiaggio" value="<?=SistemaHTML($DatiProgetto['NomeProgetto'])?>"/>
                                <p id="pAiutoNomeProgetto" class="help-block">&nbsp;</p>
                            </div>
							<div id="divNomeDoppiaggio" class="form-group"<?=($Provino? " style='display: none;'" : "")?>>
								<label class="control-label">Nome del video da doppiare</label>
								<input class="form-control" type="text" id="NomeDoppiaggio" name="NomeDoppiaggio" placeholder="(ad es.: Episodio n... / Spezzone dal film / ecc.)" value="<?=SistemaHTML($DatiProgetto['NomeDoppiaggio'])?>"/>
                                <p id="pAiutoNomeDoppiaggio" class="help-block">&nbsp;</p>
                            </div>
							<?php
								if (!$Provino) {
									echo "<div id='SceltaDoppiatori' class='form-group'>
										<br>
										<center><label>Doppiatori:</label><br>
										Scegli i doppiatori che prendono parte al doppiaggio.<br>Ricordati di scegliere anche te stesso se fai parte del cast!</center>
										<div id='ContenitoreDoppiatori'></div>
										<input type='hidden' id='NumeroDoppiatori' name='NumeroDoppiatori'>
										<a id='pulAggiungiDoppiatore' class='btn btn-default'><i class='fa fa-plus-circle'></i> Aggiungi un altro doppiatore nel progetto</a>
									</div>
										  
									<datalist id='Doppiatori'></datalist>";
								} else {
									echo "<div id='ContenitoreRuoloProvino' class='form-group'>
										<br>
										<center><label class='control-label'>Ruolo da provinare:</label></center><br>
										<input class='form-control' style='font-weight: bold;' type='text' id='RuoloProvino' name='RuoloProvino' placeholder='Nome del personaggio' value='" . SistemaHTML($DatiProgetto['RuoloProvino']) . "'/>
										<p id='pAiutoRuoloProvino' class='help-block'>&nbsp;</p>
									</div>
									
									<div id='ContenitoreSessoProvino' class='form-group'>
										<br>
										<center><label class='control-label'>Sesso:</label></center><br>
										<select class='form-control' id='SessoProvino' name='SessoProvino'>
											<option value=0>Maschio</option>
											<option value=1>Femmina</option>
										</select>
										<script>document.getElementById('SessoProvino').selectedIndex = " . intval($DatiProgetto['SessoProvino']) . ";</script>
										<p id='pAiutoSessoProvino' class='help-block'>&nbsp;</p>
									</div>
									<div id='ContenitoreEtaProvino' class='form-group'>
										<br>
										<center><label class='control-label'>Età del personaggio:</label></center><br>
										<select class='form-control' id='EtaProvino' name='EtaProvino'>
											<option id='opzEta0' value=0></option>
											<option id='opzEta1' value=1></option>
											<option id='opzEta2' value=2></option>
											<option id='opzEta3' value=3></option>
										</select>
										<script>document.getElementById('EtaProvino').selectedIndex = " . intval($DatiProgetto['EtaProvino']) . ";</script>
										<p id='pAiutoEtaProvino' class='help-block'>&nbsp;</p>
									</div>
										<script>document.getElementById('SessoProvino').onchange = function () {
											if (this.value == '0') {
												document.getElementById('opzEta0').innerText = 'Bambino';
												document.getElementById('opzEta1').innerText = 'Ragazzo (adolescente)';
												document.getElementById('opzEta2').innerText = 'Adulto';
												document.getElementById('opzEta3').innerText = 'Anziano';
											} else {
												document.getElementById('opzEta0').innerText = 'Bambina';
												document.getElementById('opzEta1').innerText = 'Ragazza (adolescente)';
												document.getElementById('opzEta2').innerText = 'Adulta';
												document.getElementById('opzEta3').innerText = 'Anziana';
											}
										};
										document.getElementById('SessoProvino').onchange();
										</script>
									<div id='ContenitoreDescrizioneProvino' class='form-group'>
										<br>
										<center><label class='control-label'>Descrivi la voce e l'interpretazione che cerchi:</label></center><br>
										<textarea class='form-control' id='DescrizioneProvino' rows=5 name='DescrizioneProvino' placeholder='Tipo di voce, personalità del personaggio, ecc.'>" . str_replace("<br>", "\n", $DatiProgetto['DescrizioneProvino']) . "</textarea>
										<p id='pAiutoRuoloProvino' class='help-block'>&nbsp;</p>
									</div>";
								}
                            ?>
							<div id="ContenitoreLinkCopione" class="form-group">
								<label>Linka il copione (facoltativo)</label>
								<div class="input-group">
									  <input type="text" class="form-control" id="LinkCopione" name="LinkCopione" placeholder="Copia e incolla il link del copione!" value="<?=$DatiProgetto['LinkCopione']?>"><span class="form-group input-group-btn"><span class="btn btn-default" style="transition: 1s; -webkit-transition: 1s; -moz-transition: 1s; -o-transition: 1s;" id="TestLink" data-link="" onclick="ApriCopione(event);"></span></span>
								</div>
								<p id="pAiutoLinkCopione" class="help-block"></p>
							</div>
							<script>
								var LinkCopione = document.getElementById('LinkCopione');
								LinkCopione.onchange = function () {
									var TestLink = document.getElementById('TestLink');
									LinkCopione.value = LinkCopione.value.trim();
									TestLink.dataset.link = LinkCopione.value;
									TestLink.innerText = (LinkCopione.value ? "prova il link" : "");
									TestLink.style.opacity = (LinkCopione.value ? 1 : 0);
									TestLink.style.pointerEvents = LinkCopione.value ? "auto" : "none";
								}
								LinkCopione.onchange();
							</script>
							
                            <input type="hidden" id="PiattaformaVideo" name="PiattaformaVideo" value="<?=($DatiProgetto? $DatiProgetto['PiattaformaVideo'] : "")?>"><input type="hidden" id="PercorsoVideo" name="PercorsoVideo" value="<?=($DatiProgetto? $DatiProgetto['PercorsoVideo'] : "")?>">
                            <br><br>
                            <div class="form-group text-center">
								<a id="pulInvia" class="btn btn-info btn-lg">SALVA ></a>
								<p id="pAiutoInvio" name="pAiutoInvio" class="help-block"></p>
							</div>

							<script src="FunzioniComuniForm3.1.js"></script><script src="ElaboraVideo2.0.js"></script><script src="Mex1.0.js"></script>
							<script>
								var NumeroDoppiatori = 0;
								
								function AggiungiCampoDoppiatore(Dati) {
									NumeroDoppiatori++;
									
									/*** Creazione dei campi da riempire ***/
									var Contenitore = CreaElemento('div', 'divContenitoreDoppiatore' + NumeroDoppiatori, 'ContenitoreDoppiatori'); Contenitore.className = "form-group has-default";
									
										CreaElemento('p', 'pNomeDoppiatore' + NumeroDoppiatori, 'divContenitoreDoppiatore' + NumeroDoppiatori, "<b>Doppiatore " + NumeroDoppiatori + "</b><br>Nome utente:");
										
										var divIG = CreaElemento('div', 'divIG' + NumeroDoppiatori, 'divContenitoreDoppiatore' + NumeroDoppiatori); divIG.className = "input-group";
										
											var spanFP = CreaElemento('span', 'spanFotoProfilo' + NumeroDoppiatori, 'divIG' + NumeroDoppiatori); spanFP.className = "form-group input-group-addon"
												var FP = CreaElemento('img', 'imgFotoProfilo' + NumeroDoppiatori, 'spanFotoProfilo' + NumeroDoppiatori); FP.className = "FotoProfilo";
											
											var RD = CreaElemento('input', 'RicercaDoppiatore' + NumeroDoppiatori, 'divIG' + NumeroDoppiatori); RD.setAttribute('type', 'text'); RD.removeAttribute('name');
												RD.className = "form-control"; RD.setAttribute('list', 'Doppiatori'); RD.setAttribute('placeholder', "Cerca il doppiatore dall'elenco...");
												RD.dataset.Numero = NumeroDoppiatori; RD.dataset.ricercaprec = "";
												RD.addEventListener('change', CasellaModificata_AcquisisciID_Doppiatore); RD.addEventListener('keydown', CaricaListaFiltrata);
												
											var HD = CreaElemento('input', 'ID_Doppiatore' + NumeroDoppiatori, 'divIG' + NumeroDoppiatori); HD.setAttribute('type', 'hidden');
											
										
										CreaElemento('p', 'pRuoloDoppiatore' + NumeroDoppiatori, 'divContenitoreDoppiatore' + NumeroDoppiatori, "Ruolo:")
										
										var RU = CreaElemento('input', 'RuoloDoppiatore' + NumeroDoppiatori, 'divContenitoreDoppiatore' + NumeroDoppiatori); RU.setAttribute('type', 'text');
											RU.className = "form-control"; RU.setAttribute('placeholder', "Scrivi qui i personaggi assegnati");
											RU.addEventListener('change', Evidenzia);
											
										var pA = CreaElemento('p', 'pAiuto' + NumeroDoppiatori, 'divContenitoreDoppiatore' + NumeroDoppiatori, '&nbsp;'); pA.className = "help-block";
										
										CreaElemento('br', 'brDoppiatore' + NumeroDoppiatori, 'divContenitoreDoppiatore' + NumeroDoppiatori);
									
									document.getElementById('NumeroDoppiatori').value = NumeroDoppiatori;
									/***************************************/
									
									/*** Inserimento dei dati (se presenti) ***/
									if (Dati) {
										if (Dati.Nome) {
											RD.value = Dati.Nome;
											HD.value = Dati.ID; 
											FP.src   = Dati.FotoProfilo;
											RU.value = Dati.Ruolo;
										}
									}
									/*****************************************/
								}
								
								function ControllaEInvia() {
									if (!CampoCompilato('NomeProgetto') <?=$Provino? "|| !CampoCompilato('RuoloProvino')" : "|| !CampoCompilato('NomeDoppiaggio')"?>) {Mex('pAiutoInvio', "Alcuni campi non sono stati ancora compilati!", 'blue'); return;}
									
									if (!document.getElementById('PercorsoVideo').value) {
										document.getElementById('LinkVideo').style.display = "inline"; document.getElementById('CaricaVideo').style.display = "inline";
										Mex('pAiutoLinkVideo', "Devi scegliere un video da doppiare.<br>Puoi linkare un video di YouTube, Facebook o DailyMotion", 'red');
										
										Mex('pAiutoInvio', "Devi ancora scegliere un video da doppiare!", 'blue'); return;
									}
									
									<?php
										if (!$Provino) {
											echo "for(var I = 1; I <= NumeroDoppiatori && !document.getElementById('ID_Doppiatore' + I).value; I++);
												if (I > NumeroDoppiatori) {
													Mex('pAiuto1', 'Devi scegliere almeno un doppiatore che ricopre un ruolo nel doppiaggio (compreso te stesso se doppi anche tu questo video)', 'red');
													Mex('pAiutoInvio', 'Scegli almeno un doppiatore!', 'blue'); return;
												}";
										}
									?>
									
									document.getElementById('pulInvia').disabled = true; document.getElementById('pulInvia').style.opacity = 0.5;
									document.getElementById('frmDoppiaggio').submit();
								}
								
								document.getElementById('LinkVideo').addEventListener('click', SelezionaTutto);
								document.getElementById('LinkVideo').addEventListener('change', ElaboraLink);
								
								document.getElementById('NomeProgetto').addEventListener('change', Evidenzia); document.getElementById('NomeDoppiaggio').addEventListener('change', Evidenzia);
								
								<?php 
									if (!$Provino) {
										echo "document.getElementById('pulAggiungiDoppiatore').addEventListener('click', AggiungiCampoDoppiatore);";
									} else {
										echo "document.getElementById('RuoloProvino').addEventListener('change', Evidenzia);";
									}
								?>
								document.getElementById('pulInvia').addEventListener('click', ControllaEInvia);
								
								
								function FormPronto() {
									
									<?php
										if ($DatiProgetto) {
											foreach($DatiDoppiatori as $Doppiatore) {
												echo "AggiungiCampoDoppiatore({\"Nome\": \"" . Sistema($Doppiatore['Nome']) . "\", \"Ruolo\": \"" . Sistema($Doppiatore['Ruolo']) . "\", \"FotoProfilo\": \"" . $Doppiatore['FotoProfilo'] . "\", \"ID\": \"" . $Doppiatore['ID'] . "\"});";
											}
										} else {
											echo "AggiungiCampoDoppiatore();";
										}
									?>
									
								}
							</script>
							<script src="CaricaListaDoppiatori5.5.6.js"></script>
							<?php if ($NumeroProgetto) {echo "<input type='hidden' name='NumProgetto' value='$NumeroProgetto'>";} ?>
                        </form>
                    </div>
                </div>
            </div>
        </div>
