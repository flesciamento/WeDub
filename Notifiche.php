<script>
function CaricaNotifiche() {
	var XHR = new XMLHttpRequest();
		XHR.open ("post", "CaricaNotifichePersonalizzate.php", true);
		XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		XHR.onreadystatechange = function () {
            if (XHR.readyState == 4 && XHR.status == 200) {
				var Dati = JSON.parse(XHR.responseText), A, N, D, Img, Lato = "right";
				for(var I = 0; I < Dati.length; I++) {
					A = CreaElemento('a', 'Link' + I, 'Notifiche'); A.href = Dati[I].Link;
						N = CreaElemento('div', 'N' + I, 'Link' + I, Dati[I].Testo); N.className = "chat-widget-" + Lato;
					D = CreaElemento('div', 'D' + I, 'Notifiche'); D.className = "chat-widget-name-" + Lato;
						Img = CreaElemento('img', 'Img' + I, 'D' + I); Img.className = "media-object img-circle img-" + Lato + "-chat"; Img.src = Dati[I].FotoUtente;
						CreaElemento('h4', 'NomeUtente' + I, 'D' + I, Dati[I].Utente); 
					    CreaElemento('h5', 'Data' + I, 'D' + I, Dati[I].Data);
						CreaElemento('br', 'Interlinea' + I, 'D' + I);
					Lato = (Lato == "right" ? "left" : "right");
				}
			}
		};
		
	XHR.send();
}
</script>

<div class="row">
	<div class="col-md-12 col-sm-12 col-xs-12">
		<div class="panel panel-primary">
			<div class="panel-heading text-center">
				Notifiche
			</div>
			<div class="panel-body chat-widget-main" id="Notifiche"></div>
		</div>
	</div>
</div>

<script>CaricaNotifiche();</script>
