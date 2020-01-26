function StatoLoginUtente(response) {
	
	try {VerificaAccountFB(response);} catch(e) {}
	
	try {AvviaCaricamentoVideoFB();} catch(e) {}
	
}
