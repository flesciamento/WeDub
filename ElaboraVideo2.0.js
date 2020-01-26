function ElaboraLink(e) {
	document.getElementById('PercorsoVideo').value = "";
	ElaborazioneLink(e.target.value);
}

function ElaborazioneLink(Link) {
	var ContenitoreCaricaVideo = document.getElementById('ContenitoreCaricaVideo');
	ContenitoreCaricaVideo.style.display = "none";
	
	document.getElementById('VisualizzaVideo').innerHTML = "";
	
	Mex("pAiutoLinkVideo", "<img src='images/attendere.gif'>");
	
	var XHR = new XMLHttpRequest();
		XHR.open ("post", "ElaboraLink.php", true);
		XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) {
				if (XHR.status == 200) {
					var Dati = JSON.parse(XHR.responseText);
					if (Dati.Errore) {Mex("pAiutoLinkVideo", Dati.Errore, "red"); /*ContenitoreCaricaVideo.style.display = "inline";*/ return;}
					
					Mex("pAiutoLinkVideo", "Rilevato video " + Dati.Piattaforma, "green");
					
					document.getElementById('PiattaformaVideo').value = Dati.Piattaforma; document.getElementById('PercorsoVideo').value = Dati.ID_Video;
					
					document.getElementById('VisualizzaVideo').innerHTML = Dati.Player;
					
					Mex('pAiutoInvio', "");
					
				} else {Mex("pAiutoLinkVideo", "Errore di connessione! Nuovo tentativo in corso...", "red"); window.setTimeout(function () {ElaborazioneLink(Link);}, 1000);}
			}
		};
		
		XHR.send("Link=" + encodeURIComponent(Link));
}
