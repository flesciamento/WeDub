function SelezionaTutto(e) {
	e.target.select();
}

function Evidenzia(e) {
	if (e.target.value) {MsgCampoOK(e.target.id);} else {MsgCampoRichiesto(e.target.id, "Il campo è obbligatorio.");}
}

function MsgCampoOK(ID) {
	var Contenitore = document.getElementById(ID).parentNode;
	document.getElementById(ID).style.borderColor = "";
	Contenitore.className = "form-group has-success";
	Mex(document.querySelector('#' + Contenitore.id + ' .help-block').id, '&nbsp;');
	
	var AiutoInvio = document.getElementsByName('pAiutoInvio');
	for(var I = 0; I < AiutoInvio.length; I++) {
		Mex(AiutoInvio[I].id, "");
	}
}

function MsgCampoRichiesto(ID, Stringa) {
	var Contenitore = document.getElementById(ID).parentNode;
	Contenitore.className = "form-group has-error";
	Mex(document.querySelector('#' + Contenitore.id + ' .help-block').id, Stringa, "red");
}

function CampoCompilato(ID) {
	if (document.getElementById(ID).value) {MsgCampoOK(ID); return true;} else {MsgCampoRichiesto(ID, "Il campo è obbligatorio."); return false;}
}

function ControllaEMail(ID, IDErrore) {
	var IndirizzoEMail = document.getElementById(ID).value.trim();
	if (ContieneCaratteriNonConsentitiEMail(IndirizzoEMail) || (IndirizzoEMail.indexOf(".") == -1) || (IndirizzoEMail.indexOf("@") == -1) || (IndirizzoEMail.indexOf(" ") > -1)) {MsgCampoRichiesto(ID, "L'indirizzo e-mail non risulta corretto", 'red'); Mex(IDErrore, "Controlla l'indirizzo e-mail inserito.", 'blue'); return false;}

	return CampoCompilato(ID);
}

function ContieneCaratteriNonConsentitiEMail(IndirizzoEMail) {
	return IndirizzoEMail.match(/[^a-zA-Z0-9\.@]/g) ? true : false
}

function ControllaOpzPresaVisione(ID, IDErrore) {
	if (!document.getElementById(ID).checked) {MsgCampoRichiesto(ID, "^ La casella è obbligatoria.", 'red'); Mex(IDErrore, "La presa visione dell'informativa sulla Privacy e l'accettazione dei Termini e condizioni sono obbligatori.", 'blue');}
	
	return document.getElementById(ID).checked;
}
