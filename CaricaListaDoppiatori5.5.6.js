tmrFaiRicercaDoppiatore = []; ListaDoppiatori = document.getElementById("Doppiatori");

function CaricaListaDoppiatori(Filtro) {
	var XHR = new XMLHttpRequest();
		XHR.open ("post", "ElencoDoppiatori.php", true);
		XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		XHR.onreadystatechange = function () {
            if (XHR.readyState == 4 && XHR.status == 200) {
				var Dati = XHR.responseText, Opzione;

				ListaDoppiatori.innerHTML = "";
				
				if (Dati != "") {
					Dati = JSON.parse(Dati);
					for(var I = 0; I < Dati.length; I++) {
						Opzione = CreaElemento('option', 'opzDoppiatori' + I, 'Doppiatori', Dati[I].Nome); Opzione.dataset.ID_Doppiatore = Dati[I].ID; Opzione.dataset.FotoProfilo = Dati[I].FotoProfilo;
					}
				}
			
			}
		};
		
		XHR.send("Filtro=" + encodeURIComponent(Filtro));
}

function CaricaListaFiltrata(e) {
	var CasellaDiTesto = e.currentTarget, Ricerca = CasellaDiTesto.value;
	
	if ((Ricerca.length < 3) || (Ricerca == CasellaDiTesto.dataset.ricercaprec)) {return;}
	
	CaricaListaDoppiatori(Ricerca);
	CasellaDiTesto.dataset.ricercaprec = Ricerca;
}

function CasellaModificata_AcquisisciID_Doppiatore(e) {
	AcquisisciID_Doppiatore(e.currentTarget);
}

function AcquisisciID_Doppiatore(CasellaTesto) {
	var DoppiatoreScelto = CasellaTesto.value, Doppiatori = document.querySelectorAll('#Doppiatori option'), Numero = CasellaTesto.dataset.Numero, ID_Doppiatore = document.getElementById('ID_Doppiatore' + Numero), FotoProfiloDoppiatore = document.getElementById('imgFotoProfilo' + Numero), ContenitoreMessaggio = 'pAiuto' + Numero;
	
	Mex(ContenitoreMessaggio, "&nbsp;");
	
	for(var I = 0; (I < Doppiatori.length) && (Doppiatori[I].innerText != DoppiatoreScelto); I++);
	
	/*** Verifica se il doppiatore scelto esiste ***/
	if (I >= Doppiatori.length) {
		CasellaTesto.style.borderColor = "red"; CasellaTesto.value = ""; ID_Doppiatore.value = ""; FotoProfiloDoppiatore.src = "";
		Mex(ContenitoreMessaggio, "Devi scegliere un doppiatore dall'elenco!<br>Se non lo trovi <a href='https://" +  window.location.hostname + "' target='_blank'><b><i>invitalo ad iscriversi a questa App</i></b></a>!", "red");
		return;
	}	
	/***********************************************/
	
	/*** Verifica che il doppiatore non sia già stato inserito ***/
	for(var D = 1; (D <= document.getElementById('NumeroDoppiatori').value) && document.getElementById('ID_Doppiatore' + D).value != Doppiatori[I].dataset.ID_Doppiatore; (++D == Numero) ? D++ : "");
	
	if (D > document.getElementById('NumeroDoppiatori').value) {
		ID_Doppiatore.value = Doppiatori[I].dataset.ID_Doppiatore;
		FotoProfiloDoppiatore.src = Doppiatori[I].dataset.FotoProfilo;
		CasellaTesto.style.borderColor = "green";
	} else {
		CasellaTesto.style.borderColor = "red"; CasellaTesto.value = ""; ID_Doppiatore.value = ""; FotoProfiloDoppiatore.src = "";
		Mex(ContenitoreMessaggio, "Il doppiatore <b><i>" + document.getElementById('RicercaDoppiatore' + D).value + "</i></b> è già stato scelto!<br>Se ha più di un ruolo elencarli tutti nella casella dei ruoli (evidenziata in giallo)", "red");
		Mex('pAiuto' + D, "Se il doppiatore ha più di un ruolo elencarli tutti qui ^", 'orange');
		document.getElementById('RuoloDoppiatore' + D).style.borderColor = 'orange';
	}
	/*************************************************************/
}


function FaiRicercaDoppiatore(Numero) {
	window.clearTimeout(tmrFaiRicercaDoppiatore[Numero]);
	tmrFaiRicercaDoppiatore[Numero] = window.setTimeout(function () {CercaDoppiatore(Numero);}, 300);
}

function CercaDoppiatore(Numero) {
	var XHR = new XMLHttpRequest();
		XHR.open ("post", "CercaDoppiatori.php", true);
		XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		XHR.onreadystatechange = function () {
            if (XHR.readyState == 4 && XHR.status == 200) {
				var Dati = JSON.parse(XHR.responseText);
				var Opzione;
				document.getElementById("DoppiatoriTrovati" + Numero).innerHTML = "";
				for(var I = 0; I < Dati.length; I++) {
					Opzione = CreaElemento('option', 'opzDoppiatori' + I, 'DoppiatoriTrovati' + Numero, '<img src="' + Dati[I].FotoProfilo + '">' + Dati[I].Nome); Opzione.value = Dati[I].ID;
				}
				
				document.getElementById("DoppiatoriTrovati" + Numero).addEventListener('click', function () {CancellaRicerca(Numero);});
			}
		};
		
		XHR.send("Nome=" + encodeURIComponent(document.getElementById('RicercaDoppiatore' + Numero).value));
}

function CancellaRicerca(Numero) {
	document.getElementById('RicercaDoppiatore' + Numero).value = "";
}

FormPronto();
